import "server-only";

import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  type TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "@/trpc/init";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/_app";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export async function prefetch(
  // biome-ignore lint/suspicious/noExplicitAny: required by tRPC helper typing
  queryOptions: ReturnType<TRPCQueryOptions<any>>,
) {
  const queryClient = getQueryClient();

  if (queryOptions.queryKey[1]?.type === "infinite") {
    await queryClient.prefetchInfiniteQuery(queryOptions as never);
    return;
  }

  await queryClient.prefetchQuery(queryOptions);
}

export function HydrateClient({
  children,
  queryClient,
}: Readonly<{ children: React.ReactNode; queryClient?: QueryClient }>) {
  const activeQueryClient = queryClient ?? getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(activeQueryClient)}>
      {children}
    </HydrationBoundary>
  );
}
