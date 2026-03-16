import { z } from "zod";

const issueTypeValues = ["critical", "warning", "good"] as const;
const verdictValues = [
  "catastrophic",
  "needs_serious_help",
  "questionable_choices",
  "almost_ok",
  "surprisingly_decent",
] as const;
const diffLineTypeValues = ["removed", "added", "context"] as const;

export const roastIssueSchema = z.object({
  type: z.enum(issueTypeValues),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(500),
});

export const roastDiffLineSchema = z.object({
  type: z.enum(diffLineTypeValues),
  code: z.string().max(500),
});

export const roastGenerationSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum(verdictValues),
  roastQuote: z.string().trim().min(1).max(220),
  issues: z.array(roastIssueSchema).min(3).max(6),
  suggestedFix: z.object({
    lines: z.array(roastDiffLineSchema).min(4).max(20),
  }),
});

export type RoastDiffLine = z.infer<typeof roastDiffLineSchema>;
export type RoastGeneration = z.infer<typeof roastGenerationSchema>;
export type RoastIssue = z.infer<typeof roastIssueSchema>;
export type RoastVerdict = (typeof verdictValues)[number];

const diffPrefixMap: Record<RoastDiffLine["type"], string> = {
  removed: "-",
  added: "+",
  context: " ",
};

export function normalizeRoastScore(score: number) {
  return Number(score.toFixed(1));
}

export function serializeDiffLines(lines: RoastDiffLine[]) {
  return lines
    .map((line) => `${diffPrefixMap[line.type]} ${line.code}`)
    .join("\n");
}

export function parseDiffContent(diffContent: string): RoastDiffLine[] {
  return diffContent.split("\n").map((line) => {
    if (line.startsWith("- ")) {
      return { type: "removed", code: line.slice(2) };
    }

    if (line.startsWith("+ ")) {
      return { type: "added", code: line.slice(2) };
    }

    if (line.startsWith("  ")) {
      return { type: "context", code: line.slice(2) };
    }

    return { type: "context", code: line };
  });
}

export function getVerdictBadgeVariant(
  verdict: RoastVerdict,
): RoastIssue["type"] {
  switch (verdict) {
    case "catastrophic":
    case "needs_serious_help":
    case "questionable_choices":
      return "critical";
    case "almost_ok":
      return "warning";
    case "surprisingly_decent":
      return "good";
  }
}

export function formatVerdictLabel(verdict: RoastVerdict) {
  return verdict.replaceAll("_", " ");
}
