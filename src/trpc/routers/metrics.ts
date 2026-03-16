import { sql } from "drizzle-orm";
import { z } from "zod";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const metricsRouter = createTRPCRouter({
  summary: baseProcedure.query(async ({ ctx }) => {
    try {
      const [summary] = await ctx.db
        .select({
          roastedCodes: sql<number>`count(*)::int`,
          averageScore: sql<number>`coalesce(avg(${submissions.score})::float8, 0)`,
        })
        .from(submissions);

      return {
        roastedCodes: summary?.roastedCodes ?? 0,
        averageScore: summary?.averageScore ?? 0,
      };
    } catch {
      return {
        roastedCodes: 0,
        averageScore: 0,
      };
    }
  }),

  submitCode: baseProcedure
    .input(
      z.object({
        code: z.string().trim().min(1).max(2000),
        language: z.string().trim().min(1).max(50),
        isRoastMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(submissions).values({
        code: input.code,
        language: input.language,
        score: "4.2",
        isRoastMode: input.isRoastMode,
        verdict: "pending",
        roastQuote: null,
      });

      return { ok: true };
    }),
});
