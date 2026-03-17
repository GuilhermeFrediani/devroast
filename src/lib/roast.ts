const verdictValues = [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
] as const;

type RoastVerdict = (typeof verdictValues)[number];

function getVerdictBadgeVariant(
  verdict: RoastVerdict,
): "critical" | "warning" | "good" {
  switch (verdict) {
    case "needs_serious_help":
      return "critical";
    case "rough_around_edges":
      return "warning";
    case "decent_code":
      return "warning";
    case "solid_work":
      return "good";
    case "exceptional":
      return "good";
  }
}

function formatVerdictLabel(verdict: RoastVerdict): string {
  const labels: Record<RoastVerdict, string> = {
    needs_serious_help: "Needs Serious Help",
    rough_around_edges: "Rough Around Edges",
    decent_code: "Decent Code",
    solid_work: "Solid Work",
    exceptional: "Exceptional",
  };
  return labels[verdict];
}

type DiffLine = {
  type: "removed" | "added" | "context";
  code: string;
};

function computeDiffLines(
  originalCode: string,
  suggestedFix: string | null,
): DiffLine[] {
  if (!suggestedFix) {
    return originalCode.split("\n").map((line) => ({
      type: "context" as const,
      code: line,
    }));
  }

  const originalLines = originalCode.split("\n");
  const suggestedLines = suggestedFix.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(originalLines.length, suggestedLines.length);

  for (let i = 0; i < maxLen; i++) {
    const orig = originalLines[i];
    const sug = suggestedLines[i];

    if (orig === undefined && sug !== undefined) {
      result.push({ type: "added", code: sug });
    } else if (orig !== undefined && sug === undefined) {
      result.push({ type: "removed", code: orig });
    } else if (orig !== sug) {
      if (orig !== undefined) {
        result.push({ type: "removed", code: orig });
      }
      if (sug !== undefined) {
        result.push({ type: "added", code: sug });
      }
    } else {
      result.push({ type: "context", code: orig ?? "" });
    }
  }

  return result;
}

export {
  computeDiffLines,
  formatVerdictLabel,
  getVerdictBadgeVariant,
  type DiffLine,
  type RoastVerdict,
  verdictValues,
};
