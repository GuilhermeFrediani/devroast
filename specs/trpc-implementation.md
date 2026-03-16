# Especificacao: Implementacao do tRPC (API/back-end)

## Contexto

Vamos adotar tRPC como camada de API tipada entre App Router (Next.js) e banco (Drizzle).
A implementacao deve seguir o client TanStack React Query do tRPC e integrar com SSR/RSC para prefetch + hydration.
Objetivo: centralizar regras de negocio em procedures, manter tipagem fim-a-fim e preparar base para queries/mutations reais do DevRoast.

## Escopo

- **Inclui**
  - Setup do tRPC v11 com `@trpc/tanstack-react-query`.
  - Endpoint `/api/trpc/[trpc]` com `fetchRequestHandler`.
  - Provider client-side no `layout` para hooks em client components.
  - Proxy server-side para RSC (`createTRPCOptionsProxy`) com prefetch/hydration.
  - Router inicial com procedure de health check e 1 procedure de dominio (submissions/leaderboard).
- **Nao inclui**
  - Autenticacao/autorizacao.
  - Cache distribuido/Redis.
  - Refatoracao completa de todas as paginas para tRPC nesta etapa.

## Solucao proposta

- Dependencias:
  - `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`, `@tanstack/react-query`, `zod`, `server-only`, `client-only`.
- Estrutura de arquivos:
  - `src/trpc/init.ts`: `initTRPC`, `createTRPCContext`, helpers base.
  - `src/trpc/routers/_app.ts`: `appRouter` raiz + merge de routers por dominio.
  - `src/trpc/routers/submission.ts` (ou `leaderboard.ts`): primeira procedure de dominio.
  - `src/app/api/trpc/[trpc]/route.ts`: adapter fetch do tRPC.
  - `src/trpc/query-client.ts`: `makeQueryClient()` com `staleTime` e dehydrate para queries pendentes.
  - `src/trpc/client.tsx`: `createTRPCContext`, `TRPCReactProvider`, `getUrl`, singleton de `QueryClient` no browser.
  - `src/trpc/server.tsx`: `createTRPCOptionsProxy`, `getQueryClient` com `cache`, helpers `prefetch` e `HydrateClient`.
- Integracao com Next.js App Router:
  - Montar `TRPCReactProvider` em `src/app/layout.tsx`.
  - Em server component: chamar `prefetch(trpc.<rota>.queryOptions(...))` e envolver trecho com `HydrateClient`.
  - Em client component: usar `useTRPC()` + `useQuery`/`useMutation` do TanStack.
- Regras de implementacao:
  - `import type` para `AppRouter` no client.
  - `server-only` em arquivos server (`src/trpc/server.tsx`).
  - Nao compartilhar `QueryClient` entre requests no servidor.

## Criterios de aceitacao

- Build/typecheck passam com as novas dependencias e arquivos de tRPC.
- `GET/POST /api/trpc/*` responde sem erro e resolve procedures do `appRouter`.
- Um server component prefetcha dados via `trpc.<rota>.queryOptions` e hidrata no client sem double-fetch imediato.
- Um client component consome a mesma rota via `useQuery` com tipagem inferida automaticamente.
- Procedure de dominio valida input com `zod` e retorna payload tipado.

## Plano de implementacao

- [ ] Instalar dependencias do tRPC + TanStack React Query + `zod` + `server-only`/`client-only`.
- [ ] Criar base do tRPC em `src/trpc/init.ts` e router raiz em `src/trpc/routers/_app.ts`.
- [ ] Implementar router de dominio inicial (submission/leaderboard) com pelo menos 1 query real.
- [ ] Criar handler HTTP em `src/app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`.
- [ ] Criar `src/trpc/query-client.ts` com defaults para SSR/RSC (staleTime + dehydration de pending queries).
- [ ] Criar `src/trpc/client.tsx` com `TRPCReactProvider` e integrar no `src/app/layout.tsx`.
- [ ] Criar `src/trpc/server.tsx` com `trpc` proxy, `prefetch` e `HydrateClient`.
- [ ] Integrar 1 pagina App Router com fluxo completo: prefetch no server + consumo no client.
- [ ] Validar comportamento com `pnpm lint` e `pnpm build`.
