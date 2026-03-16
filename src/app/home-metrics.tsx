import { cacheLife, cacheTag } from "next/cache";
import { METRICS_CACHE_TAG } from "@/lib/cache-tags";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { HomeMetricsContent } from "./home-metrics-content";

const HOUR_IN_MS = 60 * 60 * 1000;

export async function HomeMetrics() {
  "use cache";

  cacheLife("hours");
  cacheTag(METRICS_CACHE_TAG);

  await prefetch(
    trpc.metrics.summary.queryOptions(undefined, { staleTime: HOUR_IN_MS }),
  );

  return (
    <HydrateClient>
      <HomeMetricsContent />
    </HydrateClient>
  );
}
