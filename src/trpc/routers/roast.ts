import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts } from "@/db/schema";
import { generateRoast } from "@/lib/ai";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(),
      })
      .from(roasts);

    const allRoasts = await ctx.db.select({ score: roasts.score }).from(roasts);
    const avgScore =
      allRoasts.length > 0
        ? allRoasts.reduce((sum, r) => sum + (r.score ?? 0), 0) /
          allRoasts.length
        : 0;

    return {
      totalRoasts: stats.totalRoasts,
      avgScore,
    };
  }),

  getLeaderboard: baseProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(3) }))
    .query(async ({ ctx, input }) => {
      const entries = await ctx.db
        .select({
          id: roasts.id,
          code: roasts.code,
          score: roasts.score,
          language: roasts.language,
        })
        .from(roasts)
        .limit(input.limit);

      const [{ total }] = await ctx.db.select({ total: count() }).from(roasts);

      // Sort by score ascending (lower is better)
      const sorted = entries.sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

      return {
        entries: sorted.map((entry, index) => ({
          ...entry,
          rank: index + 1,
          lineCount: entry.code.split("\n").length,
        })),
        totalCount: total,
      };
    }),

  create: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(2000),
        language: z.string(),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const output = await generateRoast(
        input.code,
        input.language,
        input.roastMode,
      );

      const lineCount = input.code.split("\n").length;

      const [roast] = await ctx.db
        .insert(roasts)
        .values({
          code: input.code,
          language: input.language,
          lineCount,
          roastMode: input.roastMode,
          score: output.score,
          verdict: output.verdict,
          roastQuote: output.roastQuote,
          suggestedFix: output.suggestedFix,
        })
        .returning({ id: roasts.id });

      if (output.analysisItems.length > 0) {
        await ctx.db.insert(analysisItems).values(
          output.analysisItems.map((item, index) => ({
            roastId: roast.id,
            severity: item.severity,
            title: item.title,
            description: item.description,
            order: index,
          })),
        );
      }

      return { id: roast.id };
    }),

  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [roast] = await ctx.db
        .select()
        .from(roasts)
        .where(eq(roasts.id, input.id));

      if (!roast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roast not found",
        });
      }

      const items = await ctx.db
        .select()
        .from(analysisItems)
        .where(eq(analysisItems.roastId, roast.id));

      return {
        ...roast,
        analysisItems: items.sort((a, b) => a.order - b.order),
      };
    }),
});
