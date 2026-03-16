import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { LeaderboardSnippet } from "@/components/ui/leaderboard-snippet";
import { SectionTitle } from "@/components/ui/section-title";
import { LEADERBOARD_CACHE_TAG } from "@/lib/cache-tags";
import { caller } from "@/trpc/server";

type HomeLeaderboardEntry = {
  id: string;
  rank: number;
  score: number;
  language: string;
  code: string;
  lineCount: number;
};

type HomeLeaderboardItemProps = Omit<HomeLeaderboardEntry, "id">;

export async function HomeLeaderboard() {
  "use cache";

  cacheLife("hours");
  cacheTag(LEADERBOARD_CACHE_TAG);

  const data = await caller.leaderboard.list({ limit: 3 });
  const entries: HomeLeaderboardEntry[] = data.entries;

  return (
    <div className="flex w-full max-w-[960px] flex-col gap-6">
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

      <div className="flex flex-col border border-border-default">
        <div className="flex h-10 items-center bg-bg-surface px-5 text-xs font-medium text-text-tertiary">
          <span>top 3 worst snippets</span>
        </div>

        {entries.length > 0 ? (
          entries.map((row, index) => (
            <div
              key={row.id}
              className={
                index < data.entries.length - 1
                  ? "border-b border-border-default"
                  : undefined
              }
            >
              <HomeLeaderboardItem
                rank={row.rank}
                score={row.score}
                language={row.language}
                code={row.code}
                lineCount={row.lineCount}
              />
            </div>
          ))
        ) : (
          <div className="px-5 py-6 text-center text-xs text-text-tertiary">
            no roasts yet. be the first to embarrass some code.
          </div>
        )}
      </div>

      <div className="flex justify-center py-2">
        <Link
          href="/leaderboard"
          className="text-xs text-text-tertiary transition-colors hover:text-text-secondary"
        >
          {`showing top 3 of ${data.totalCount.toLocaleString("en-US")} · view full leaderboard >>`}
        </Link>
      </div>
    </div>
  );
}

async function HomeLeaderboardItem(props: HomeLeaderboardItemProps) {
  return (
    <LeaderboardSnippet
      rank={props.rank}
      score={props.score}
      language={props.language}
      code={props.code}
      lineCount={props.lineCount}
      collapsedHeightClassName="max-h-[168px]"
    />
  );
}
