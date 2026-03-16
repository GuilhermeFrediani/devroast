import { Suspense } from "react";
import { CodeEditor } from "./code-editor";
import { HomeLeaderboard } from "./home-leaderboard";
import { HomeLeaderboardSkeleton } from "./home-leaderboard-skeleton";
import { HomeMetrics } from "./home-metrics";

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center gap-8 px-10 pt-20 pb-16">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-bold text-accent-green">$</span>
          <h1 className="text-4xl font-bold text-text-primary">
            paste your code. get roasted.
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          {
            "// drop your code below and we'll rate it — brutally honest or full roast mode"
          }
        </p>
      </div>

      <CodeEditor />

      <HomeMetrics />

      <div className="h-8" />

      <Suspense fallback={<HomeLeaderboardSkeleton />}>
        <HomeLeaderboard />
      </Suspense>
    </main>
  );
}
