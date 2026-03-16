# Especificacao: Criacao de roasts com IA

## Contexto

A homepage ja permite colar codigo, mas ainda nao gera um roast real nem persiste o resultado completo.
Precisamos integrar Gemini para analisar o snippet, salvar score/verdict/quote/issues/diff no banco e redirecionar para `/roast/[id]`.

## Escopo

- **Inclui**
  - Integracao server-side com Gemini 3 Flash via AI SDK.
  - Mutation tRPC para criar um roast completo e persistir o resultado no banco.
  - Query tRPC para buscar um roast por id.
  - Redirecionamento da homepage para `/roast/[id]` apos criar o roast.
  - Pagina `/roast/[id]` renderizando dados reais do banco.
  - Suporte a `roast mode` para tom mais sarcastico.
  - Invalidacao dos caches da home e leaderboard apos nova submissao.
- **Nao inclui**
  - Compartilhamento do roast.
  - Streaming de geracao na homepage.
  - Edicao manual do resultado gerado.

## Solucao proposta

- Criar um helper server-only para gerar structured output com `generateText` + `Output.object`, ja que `generateObject` foi depreciado no AI SDK atual.
- Adicionar um router `roast` no tRPC com `create` e `byId`.
- Persistir `submissions`, `analysis_issues` e `code_diffs` em transacao unica.
- Trocar o submit da homepage para chamar `roast.create` e fazer `router.push` para a rota do resultado.
- Reaproveitar o layout existente de `/roast/[id]`, removendo mocks e lendo os dados reais via tRPC server caller.

## Criterios de aceitacao

- Ao clicar em `roast_my_code`, o app gera uma analise com Gemini e redireciona para `/roast/[id]`.
- `roast mode` altera o tom da resposta sem mudar o formato estruturado da analise.
- A pagina `/roast/[id]` mostra score, verdict, quote, issues e suggested fix salvos no banco.
- Home e leaderboard refletem novas submissoes apos invalidacao de cache.
- Nenhum segredo fica hardcoded em arquivos versionados.

## Plano de implementacao

- [ ] Instalar e configurar AI SDK + provider do Google.
- [ ] Criar helper server-only para gerar o roast estruturado com Gemini 3 Flash.
- [ ] Adicionar router `roast` com mutation de criacao e query por id.
- [ ] Atualizar homepage para enviar o codigo e redirecionar para o roast criado.
- [ ] Substituir mocks da rota `/roast/[id]` por dados reais do banco.
- [ ] Invalidar caches/tag da home e leaderboard apos nova submissao.
- [ ] Validar com `pnpm biome check` e `pnpm build`.
