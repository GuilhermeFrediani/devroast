import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { SectionTitle } from "@/components/ui/section-title";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { CodeEditor } from "./code-editor";
import { HomeMetricsContent } from "./home-metrics-content";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    language: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    language: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    language: "sql",
  },
];

export default async function HomePage() {
  await prefetch(trpc.metrics.summary.queryOptions());

  return (
    <main className="flex flex-col items-center gap-8 px-10 pt-20 pb-16">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-accent-green">$</span>
          <h1 className="text-4xl font-bold text-text-primary">
            paste your code. get roasted.
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          {
            "// drop your code below and we'll rate it \u2014 brutally honest or full roast mode"
          }
        </p>
      </div>

      {/* Code editor + actions */}
      <CodeEditor />

      {/* Footer stats */}
      <HydrateClient>
        <HomeMetricsContent />
      </HydrateClient>

      {/* Spacer */}
      <div className="h-8" />

      {/* Leaderboard preview */}
      <div className="flex w-full max-w-[960px] flex-col gap-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <SectionTitle label="shame_leaderboard" />
          <Link
            href="/leaderboard"
            className="border border-border-default px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            {"$ view_all >>"}
          </Link>
        </div>

        <p className="text-[13px] text-text-tertiary">
          {"// the worst code on the internet, ranked by shame"}
        </p>

        {/* Table */}
        <div className="flex flex-col border border-border-default">
          {/* Header */}
          <div className="flex h-10 items-center bg-bg-surface px-5 text-xs font-medium text-text-tertiary">
            <span className="w-[50px]">#</span>
            <span className="w-[70px]">score</span>
            <span className="flex-1">code</span>
            <span className="w-[100px]">lang</span>
          </div>

          {/* Rows */}
          {leaderboardData.map((row, i) => (
            <div
              key={i}
              className={twMerge(
                "flex px-5 py-4",
                i < leaderboardData.length - 1 &&
                  "border-b border-border-default",
              )}
            >
              <span
                className={twMerge(
                  "w-[50px] text-xs",
                  row.rank === 1 ? "text-accent-amber" : "text-text-secondary",
                )}
              >
                {row.rank}
              </span>
              <span className="w-[70px] text-xs font-bold text-accent-red">
                {row.score.toFixed(1)}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                {row.code.map((line, j) => (
                  <span
                    key={j}
                    className={twMerge(
                      "text-xs",
                      line.startsWith("//") || line.startsWith("--")
                        ? "text-text-tertiary"
                        : "text-text-primary",
                    )}
                  >
                    {line}
                  </span>
                ))}
              </div>
              <span className="w-[100px] text-xs text-text-secondary">
                {row.language}
              </span>
            </div>
          ))}
        </div>

        {/* Fade hint */}
        <div className="flex justify-center py-2">
          <Link
            href="/leaderboard"
            className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
          >
            {"showing top 3 of 2,847 \u00b7 view full leaderboard >>"}
          </Link>
        </div>
      </div>
    </main>
  );
}
