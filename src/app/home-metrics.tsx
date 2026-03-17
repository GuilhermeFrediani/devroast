import { cacheLife } from "next/cache";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { HomeMetricsContent } from "./home-metrics-content";

const HOUR_IN_MS = 60 * 60 * 1000;

export async function HomeMetrics() {
  await prefetch(
    trpc.roast.getStats.queryOptions(undefined, { staleTime: HOUR_IN_MS }),
  );

  return (
    <HydrateClient>
      <HomeMetricsContent />
    </HydrateClient>
  );
}
