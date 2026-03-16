# Especificacao: Homepage shame leaderboard

## Contexto

A homepage deve mostrar uma preview real do shame leaderboard em vez de dados mockados.
Esse bloco deve buscar os 3 piores trechos de codigo e exibir um loading state com `Suspense` + skeleton enquanto carrega.

## Escopo

- **Inclui**
  - Query tRPC para retornar top 3 piores codigos + total de roasts.
  - Integracao da homepage com Server Components.
  - Skeleton especifico para o bloco do leaderboard.
- **Nao inclui**
  - Refatoracao completa da pagina `/leaderboard`.
  - Novos dados alem do necessario para a preview da homepage.

## Solucao proposta

- Criar uma procedure unica que retorne `{ entries, totalCount }`.
- Extrair o bloco da homepage para um componente async proprio.
- Usar `Suspense` no `page.tsx` com fallback visual semelhante a tabela final.

## Criterios de aceitacao

- A homepage nao usa mais mock para o leaderboard preview.
- O bloco mostra apenas 3 resultados ordenados pelos piores scores.
- O rodape mostra o total real de roasts.
- Enquanto carrega, o bloco exibe skeleton via `Suspense`.

## Plano de implementacao

- [ ] Criar procedure tRPC para preview do leaderboard com `entries` + `totalCount`.
- [ ] Extrair bloco da homepage para componente proprio.
- [ ] Criar skeleton do leaderboard preview.
- [ ] Integrar `Suspense` na homepage.
- [ ] Validar com `pnpm biome check src/` e `pnpm build`.
