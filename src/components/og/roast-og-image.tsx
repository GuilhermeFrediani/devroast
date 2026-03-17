type RoastOgImageProps = {
  score: number;
  verdict: string;
  language: string;
  lineCount: number;
  roastQuote: string;
};

function getScoreColor(score: number): string {
  if (score <= 2) return "#ef4444";
  if (score <= 4) return "#f97316";
  if (score <= 6) return "#eab308";
  if (score <= 8) return "#84cc16";
  return "#22c55e";
}

function formatVerdictLabel(verdict: string): string {
  const labels: Record<string, string> = {
    needs_serious_help: "Needs Serious Help",
    rough_around_edges: "Rough Around Edges",
    decent_code: "Decent Code",
    solid_work: "Solid Work",
    exceptional: "Exceptional",
  };
  return labels[verdict] ?? verdict;
}

function truncateQuote(quote: string, maxLength = 80): string {
  if (quote.length <= maxLength) return quote;
  return `${quote.slice(0, maxLength)}...`;
}

function RoastOgImage({
  score,
  verdict,
  language,
  lineCount,
  roastQuote,
}: RoastOgImageProps) {
  const scoreColor = getScoreColor(score);
  const verdictLabel = formatVerdictLabel(verdict);
  const truncatedQuote = truncateQuote(roastQuote);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        padding: "48px",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#10b981",
          }}
        >
          DevRoast
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: "bold",
              color: scoreColor,
              marginRight: "16px",
            }}
          >
            {score.toFixed(1)}
          </span>
          <span
            style={{
              fontSize: "24px",
              color: "#a3a3a3",
            }}
          >
            / 10
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: scoreColor,
              padding: "8px 16px",
              backgroundColor: "#171717",
              borderRadius: "8px",
            }}
          >
            {verdictLabel}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#737373",
            }}
          >
            {language.toUpperCase()}
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#737373",
            }}
          >
            {lineCount} lines
          </span>
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#a3a3a3",
            fontStyle: "italic",
            maxWidth: "600px",
          }}
        >
          "{truncatedQuote}"
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "24px",
          borderTop: "1px solid #262626",
          paddingTop: "24px",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            color: "#525252",
          }}
        >
          devroast.app
        </span>
      </div>
    </div>
  );
}

export { RoastOgImage, type RoastOgImageProps };
