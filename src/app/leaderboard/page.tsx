import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "Leaderboard | DevRoast",
  description: "Shame leaderboard with the most roasted code submissions.",
};

export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  rank: number;
  score: number;
  language: string;
  code: string[];
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    score: 1.2,
    language: "javascript",
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
  },
  {
    rank: 2,
    score: 1.8,
    language: "typescript",
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
  },
  {
    rank: 3,
    score: 2.1,
    language: "sql",
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
  },
  {
    rank: 4,
    score: 2.3,
    language: "java",
    code: ["catch (e) {", "  // ignore", "}"],
  },
  {
    rank: 5,
    score: 2.5,
    language: "javascript",
    code: [
      "const sleep = (ms) =>",
      "  new Date(Date.now() + ms)",
      "  while (new Date() < end) {}",
    ],
  },
];

export default async function LeaderboardPage() {
  const submissionsCount = 2847;
  const averageScore = 4.2;

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 pt-10 pb-16">
      <section className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[2rem] font-bold text-accent-green">{">"}</span>
          <h1 className="text-[1.75rem] leading-none font-bold text-text-primary">
            shame_leaderboard
          </h1>
        </div>

        <p className="text-sm text-text-secondary">
          {"// the most roasted code on the internet"}
        </p>

        <div className="flex items-center gap-2 text-xs text-text-tertiary">
          <span>{submissionsCount.toLocaleString("en-US")} submissions</span>
          <span>&middot;</span>
          <span>avg score: {averageScore.toFixed(1)}/10</span>
        </div>
      </section>

      <section className="flex w-full flex-col gap-5">
        {leaderboardEntries.map((entry) => (
          <article
            key={entry.rank}
            className="flex w-full flex-col border border-border-default"
          >
            <header className="flex h-12 items-center justify-between border-b border-border-default px-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-text-tertiary">#</span>
                  <span className="text-[13px] font-bold text-accent-amber">
                    {entry.rank}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-text-tertiary">score:</span>
                  <span className="text-[13px] font-bold text-accent-red">
                    {entry.score.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-text-secondary">{entry.language}</span>
                <span className="text-text-tertiary">
                  {entry.code.length} lines
                </span>
              </div>
            </header>

            <CodeBlock
              code={entry.code.join("\n")}
              lang={entry.language === "sql" ? "sql" : "javascript"}
              className="h-[120px]"
            />
          </article>
        ))}
      </section>
    </main>
  );
}
