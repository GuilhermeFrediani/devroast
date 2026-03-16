# tRPC — Padrões

Guia para a camada de API/back-end tipada em `src/trpc/`.

## Regras

- Usar tRPC v11 com `@trpc/tanstack-react-query`.
- Organizar routers por domínio em `src/trpc/routers/` e combinar no `routers/_app.ts`.
- Validar inputs com `zod` em procedures que recebem entrada.
- `src/trpc/init.ts`: centralizar `initTRPC`, contexto e helpers base.
- `src/trpc/server.tsx`: uso server-only, proxy para RSC, helpers de prefetch/hydration.
- `src/trpc/client.tsx`: contexto/provider para client components e hooks tipados.

## Integração com Next.js

- Expor o endpoint em `src/app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`.
- Em Server Components, preferir `prefetch(...)` + `HydrateClient`.
- Em Client Components, consumir com `useTRPC()` + `useQuery`/`useMutation` do TanStack.
- Evitar duplicar regras de negócio no front-end; procedures devem concentrar leitura/escrita da aplicação.

## Convenções

- Nomear routers e procedures de forma orientada a domínio (`metrics.summary`, `submission.create`, etc.).
- Para métricas e dados de homepage, preferir queries simples e enxutas.
- Para mutations que afetam dados exibidos no client, invalidar queries relacionadas após sucesso.
- Quando duas ou mais queries independentes forem necessárias na mesma procedure, usar `await Promise.all(...)` para executá-las em paralelo.
