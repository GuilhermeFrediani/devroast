import { TRPCError } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { analysisIssues, codeDiffs, submissions } from "@/db/schema";
import { revalidateRoastCaches } from "@/lib/revalidate";
import { parseDiffContent, serializeDiffLines } from "@/lib/roast";
import { generateRoastAnalysis } from "@/lib/roast-generator";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const roastIdSchema = z.object({
  id: z.string().uuid(),
});

const createRoastSchema = z.object({
  code: z.string().trim().min(1).max(2000),
  language: z.string().trim().min(1).max(50),
  isRoastMode: z.boolean(),
});

const issueOrder = {
  critical: 0,
  warning: 1,
  good: 2,
} as const;

export const roastRouter = createTRPCRouter({
  byId: baseProcedure.input(roastIdSchema).query(async ({ ctx, input }) => {
    try {
      const [submission, issues, [suggestedFix]] = await Promise.all([
        ctx.db
          .select({
            id: submissions.id,
            code: submissions.code,
            language: submissions.language,
            score: sql<number>`${submissions.score}::float8`,
            isRoastMode: submissions.isRoastMode,
            verdict: submissions.verdict,
            roastQuote: submissions.roastQuote,
            createdAt: submissions.createdAt,
          })
          .from(submissions)
          .where(eq(submissions.id, input.id))
          .then((rows) => rows[0]),
        ctx.db
          .select({
            id: analysisIssues.id,
            type: analysisIssues.issueType,
            title: analysisIssues.title,
            description: analysisIssues.description,
          })
          .from(analysisIssues)
          .where(eq(analysisIssues.submissionId, input.id)),
        ctx.db
          .select({
            diffContent: codeDiffs.diffContent,
          })
          .from(codeDiffs)
          .where(eq(codeDiffs.submissionId, input.id))
          .orderBy(desc(codeDiffs.createdAt))
          .limit(1),
      ]);

      if (!submission) {
        return null;
      }

      return {
        ...submission,
        verdict: submission.verdict as
          | "catastrophic"
          | "needs_serious_help"
          | "questionable_choices"
          | "almost_ok"
          | "surprisingly_decent",
        roastQuote:
          submission.roastQuote ??
          "the model roasted this code so hard it forgot to save the quote.",
        lineCount: submission.code.split("\n").length,
        issues: issues.sort((left, right) => {
          const orderDelta = issueOrder[left.type] - issueOrder[right.type];

          if (orderDelta !== 0) {
            return orderDelta;
          }

          return left.title.localeCompare(right.title);
        }),
        suggestedFix: parseDiffContent(suggestedFix?.diffContent ?? ""),
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to load roast.",
        cause: error,
      });
    }
  }),

  create: baseProcedure
    .input(createRoastSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const roast = await generateRoastAnalysis(input);

        const created = await ctx.db.transaction(async (tx) => {
          const [submission] = await tx
            .insert(submissions)
            .values({
              code: input.code,
              language: input.language,
              score: roast.score.toFixed(1),
              isRoastMode: input.isRoastMode,
              verdict: roast.verdict,
              roastQuote: roast.roastQuote,
            })
            .returning({ id: submissions.id });

          await tx.insert(analysisIssues).values(
            roast.issues.map((issue) => ({
              submissionId: submission.id,
              issueType: issue.type,
              title: issue.title,
              description: issue.description,
            })),
          );

          await tx.insert(codeDiffs).values({
            submissionId: submission.id,
            diffContent: serializeDiffLines(roast.suggestedFix.lines),
          });

          return submission;
        });

        revalidateRoastCaches();

        return { id: created.id };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate roast.",
          cause: error,
        });
      }
    }),
});
