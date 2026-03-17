import { LeaderboardSnippet } from "@/components/ui/leaderboard-snippet";
import { SectionTitle } from "@/components/ui/section-title";
import { caller } from "@/trpc/server";

export async function LeaderboardContent() {
  const [leaderboard, stats] = await Promise.all([
    caller.roast.getLeaderboard({ limit: 20 }),
    caller.roast.getStats(),
  ]);

  return (
    <>
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
          <span>{stats.totalRoasts.toLocaleString("en-US")} submissions</span>
          <span>&middot;</span>
          <span>avg score: {stats.avgScore.toFixed(1)}/10</span>
        </div>
      </section>

      <section className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <SectionTitle label="full_ranking" />
          <span className="text-xs text-text-tertiary">
            ordered by worst score first
          </span>
        </div>

        {leaderboard.entries.length > 0 ? (
          <div className="flex w-full flex-col border border-border-default">
            {leaderboard.entries.map((entry, index) => (
              <div
                key={entry.id}
                className={
                  index < leaderboard.entries.length - 1
                    ? "border-b border-border-default"
                    : undefined
                }
              >
                <LeaderboardSnippet
                  rank={entry.rank}
                  score={entry.score}
                  language={entry.language}
                  code={entry.code}
                  lineCount={entry.lineCount}
                  collapsedHeightClassName="max-h-[220px]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-border-default px-5 py-8 text-center text-xs text-text-tertiary">
            no roasts yet. ship something cursed and come back.
          </div>
        )}
      </section>
    </>
  );
}
