import "server-only";

import { revalidateTag } from "next/cache";
import { LEADERBOARD_CACHE_TAG, METRICS_CACHE_TAG } from "@/lib/cache-tags";

export function revalidateRoastCaches() {
  revalidateTag(LEADERBOARD_CACHE_TAG, "max");
  revalidateTag(METRICS_CACHE_TAG, "max");
}
