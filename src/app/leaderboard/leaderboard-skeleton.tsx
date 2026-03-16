export function LeaderboardSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 pt-10 pb-16">
      <section className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-5 animate-pulse bg-bg-surface" />
          <div className="h-8 w-72 animate-pulse bg-bg-surface" />
        </div>

        <div className="h-4 w-64 animate-pulse bg-bg-surface" />

        <div className="flex items-center gap-2">
          <div className="h-4 w-28 animate-pulse bg-bg-surface" />
          <div className="h-4 w-2 animate-pulse bg-bg-surface" />
          <div className="h-4 w-24 animate-pulse bg-bg-surface" />
        </div>
      </section>

      <section className="flex w-full flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 animate-pulse bg-bg-surface" />
          <div className="h-4 w-40 animate-pulse bg-bg-surface" />
        </div>

        <div className="flex w-full flex-col border border-border-default">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={`leaderboard-page-skeleton-${index + 1}`}
              className="border-b border-border-default last:border-b-0"
            >
              <div className="flex min-h-12 items-center justify-between gap-4 border-b border-border-default px-5 py-3">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-10 animate-pulse bg-bg-surface" />
                  <div className="h-4 w-16 animate-pulse bg-bg-surface" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-4 w-16 animate-pulse bg-bg-surface" />
                  <div className="h-4 w-14 animate-pulse bg-bg-surface" />
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="h-48 animate-pulse rounded-sm border border-border-default bg-bg-surface" />
              </div>

              <div className="flex items-center justify-between border-t border-border-default px-4 py-2">
                <div className="h-4 w-20 animate-pulse bg-bg-surface" />
                <div className="h-4 w-4 animate-pulse bg-bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
