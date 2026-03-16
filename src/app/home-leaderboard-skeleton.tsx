export function HomeLeaderboardSkeleton() {
  return (
    <div className="flex w-full max-w-[960px] flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-44 animate-pulse bg-bg-surface" />
        <div className="h-8 w-28 animate-pulse border border-border-default bg-bg-surface" />
      </div>

      <div className="h-4 w-72 animate-pulse bg-bg-surface" />

      <div className="flex flex-col border border-border-default">
        <div className="flex h-10 items-center bg-bg-surface px-5 text-xs font-medium text-text-tertiary">
          <span className="w-[50px]">#</span>
          <span className="w-[70px]">score</span>
          <span className="flex-1">code</span>
          <span className="w-[100px]">lang</span>
        </div>

        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={`leaderboard-skeleton-${index + 1}`}
            className="border-b border-border-default px-5 py-4 last:border-b-0"
          >
            <div className="flex items-start gap-4">
              <div className="h-4 w-[30px] animate-pulse bg-bg-surface" />
              <div className="h-4 w-[50px] animate-pulse bg-bg-surface" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-full animate-pulse bg-bg-surface" />
                <div className="h-4 w-[85%] animate-pulse bg-bg-surface" />
                <div className="h-4 w-[65%] animate-pulse bg-bg-surface" />
              </div>
              <div className="h-4 w-[60px] animate-pulse bg-bg-surface" />
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto h-4 w-52 animate-pulse bg-bg-surface" />
    </div>
  );
}
