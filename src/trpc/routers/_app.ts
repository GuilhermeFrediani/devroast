import { createTRPCRouter } from "@/trpc/init";
import { leaderboardRouter } from "@/trpc/routers/leaderboard";
import { metricsRouter } from "@/trpc/routers/metrics";
import { roastRouter } from "@/trpc/routers/roast";

export const appRouter = createTRPCRouter({
  leaderboard: leaderboardRouter,
  metrics: metricsRouter,
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
