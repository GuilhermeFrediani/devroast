import { sql } from "drizzle-orm";
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
});
