# App Router — Padrões

Guia para rotas, páginas e componentes específicos de página em `src/app/`.

## Regras

- Preferir Server Components por padrão.
- Criar Client Components apenas para hooks, interação, animação ou APIs do browser.
- Quando houver dados vindos da aplicação, preferir integração via `tRPC` em vez de mocks locais.

## tRPC no front-end

- Para dados lidos em páginas, preferir prefetch no Server Component com `prefetch(...)` e `HydrateClient`.
- Em Client Components, usar `useTRPC()` com `useQuery`/`useMutation` do TanStack React Query.
- Após mutations, invalidar apenas as queries afetadas.

## Loading e animação

- Usar `Suspense` quando fizer sentido para blocos assíncronos do App Router.
- Exceção: se a experiência pedir animação de `0 -> valor real` com `NumberFlow`, não usar skeleton nesse bloco; iniciar em `0` e atualizar quando a API responder.
- Para números animados, usar `@number-flow/react`.

## Homepage

- As métricas da homepage devem vir da API via tRPC.
- O contador deve começar em `0` e animar para o valor real após carregamento.
- Não implementar mais dados da homepage no tRPC além do necessário para a feature atual sem uma nova spec.
