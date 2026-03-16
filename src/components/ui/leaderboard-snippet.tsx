import type { BundledLanguage } from "shiki";
import { twMerge } from "tailwind-merge";
import { CodeBlock } from "@/components/ui/code-block";
import { LeaderboardSnippetClient } from "@/components/ui/leaderboard-snippet-client";

type LeaderboardSnippetProps = {
  rank: number;
  score: number;
  language: string;
  code: string;
  lineCount: number;
  collapsedHeightClassName?: string;
};

const bundledLanguages = new Set<BundledLanguage>([
  "bash",
  "go",
  "java",
  "javascript",
  "json",
  "php",
  "python",
  "ruby",
  "rust",
  "sql",
  "typescript",
]);

function getCodeLanguage(language: string): BundledLanguage {
  if (bundledLanguages.has(language as BundledLanguage)) {
    return language as BundledLanguage;
  }

  return "javascript";
}

export async function LeaderboardSnippet({
  rank,
  score,
  language,
  code,
  lineCount,
  collapsedHeightClassName,
}: LeaderboardSnippetProps) {
  const preview = await CodeBlock({
    code,
    lang: getCodeLanguage(language),
    className: "border-0",
  });

  return (
    <article className="flex flex-col">
      <header className="flex min-h-12 items-center justify-between gap-4 border-b border-border-default px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-tertiary">#</span>
            <span
              className={twMerge(
                "text-[13px] font-bold",
                rank === 1 ? "text-accent-amber" : "text-text-secondary",
              )}
            >
              {rank}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-tertiary">score:</span>
            <span className="text-[13px] font-bold text-accent-red">
              {score.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-text-secondary">{language}</span>
          <span className="text-text-tertiary">{lineCount} lines</span>
        </div>
      </header>

      <LeaderboardSnippetClient
        preview={preview}
        collapsedHeightClassName={collapsedHeightClassName}
      />
    </article>
  );
}

export { getCodeLanguage, type LeaderboardSnippetProps };
