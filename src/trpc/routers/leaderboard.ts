import { asc, count, sql } from "drizzle-orm";
import { z } from "zod";
import type { db } from "@/db";
import { submissions } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

async function getLeaderboardEntries(database: typeof db, limit?: number) {
  const query = database
    .select({
      id: submissions.id,
      score: sql<number>`${submissions.score}::float8`,
      language: submissions.language,
      code: submissions.code,
    })
    .from(submissions)
    .orderBy(asc(submissions.score), asc(submissions.createdAt));

  const rows = limit ? await query.limit(limit) : await query;

  return rows.map((entry, index) => ({
    id: entry.id,
    rank: index + 1,
    score: entry.score,
    language: entry.language,
    code: entry.code,
    lineCount: entry.code.split("\n").length,
  }));
}

export const leaderboardRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(20).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const [entries, [countResult]] = await Promise.all([
          getLeaderboardEntries(ctx.db, input.limit),
          ctx.db.select({ totalCount: count() }).from(submissions),
        ]);

        return {
          entries,
          totalCount: countResult?.totalCount ?? 0,
        };
      } catch {
        return {
          entries: [],
          totalCount: 0,
        };
      }
    }),
});
