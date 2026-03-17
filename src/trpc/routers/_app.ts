import { createTRPCRouter } from "@/trpc/init";
import { roastRouter } from "@/trpc/routers/roast";

export const appRouter = createTRPCRouter({
  roast: roastRouter,
});

export type AppRouter = typeof appRouter;
