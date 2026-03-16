# Especificacao: Leaderboard com tRPC

## Contexto

A rota `/leaderboard` ainda usa dados mockados e nao reaproveita o comportamento rico da homepage.
Precisamos buscar o ranking real via tRPC e exibir cada snippet com syntax highlight e expand/collapse.
O ranking deve reutilizar o mesmo layout da homepage, enquanto o hero usa stats reais ja expostas pela API.

## Escopo

- **Inclui**
  - Procedure tRPC parametrizada por `limit`, com maximo de 20 itens.
  - Integracao da rota `/leaderboard` com dados reais do banco.
  - Reaproveitamento do padrao de collapsible + syntax highlight da homepage.
  - Reaproveitamento de `metrics.summary` para os stats do hero.
  - Loading state com `Suspense` para o conteudo principal da tela.
- **Nao inclui**
  - Paginacao, filtros ou busca no leaderboard.
  - Novos campos de analise fora do necessario para listar os snippets.

## Solucao proposta

- Extrair o card de snippet para um componente compartilhado entre homepage e leaderboard.
- Parametrizar a query de leaderboard para aceitar `limit` e limitar o maximo em 20 via `zod`.
- Reutilizar `metrics.summary` para total de submissoes e media de score mostrados no hero.
- Renderizar o conteudo da rota em um componente async server-side consumindo o tRPC e usando `Suspense` no `page.tsx`.

## Criterios de aceitacao

- `/leaderboard` nao depende mais de arrays mockados locais.
- A tela mostra total de submissões e media real de score.
- A homepage e a pagina completa compartilham o mesmo card expansivel de snippet.
- A query do ranking aceita `limit`, mas nunca retorna mais de 20 itens.
- Cada item do ranking usa syntax highlight e pode expandir/recolher o snippet.
- A homepage continua funcionando com o mesmo comportamento visual do shame leaderboard.

## Plano de implementacao

- [ ] Extrair componente compartilhado para item do leaderboard.
- [ ] Parametrizar a query tRPC do leaderboard com `limit` e maximo de 20.
- [ ] Reaproveitar `metrics.summary` no hero da pagina completa.
- [ ] Integrar a rota `/leaderboard` com componente async + `Suspense`.
- [ ] Ajustar loading state da tela.
- [ ] Validar com `pnpm biome check src/` e `pnpm build`.
