# DevRoast — AGENTS.md

Contexto global do projeto para agentes de IA.

---

## Sobre

DevRoast é um app web que analisa e "roasta" código submetido por usuários, atribuindo uma nota de 0 a 10. Estética dark terminal/hacker.

---

## Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4 + tailwind-variants + tailwind-merge
- **Linting/Formatting**: Biome (2 spaces, double quotes)
- **Package manager**: pnpm
- **Componentes com comportamento**: @base-ui/react
- **Syntax highlighting**: Shiki (tema vesper, server-side)

---

## Estrutura

```
src/
├── app/           # Rotas, páginas e componentes específicos de página
├── components/ui/ # Componentes reutilizáveis (ver AGENTS.md local)
```

---

## Padrões globais

### Specs

- Antes de implementar feature nova, criar uma spec em `specs/`.
- Seguir o formato definido em `specs/AGENTS.md`.
- Manter a spec curta e atualizar se o escopo mudar.

### Exports

- **Sempre named exports** — nunca `export default` para componentes. Páginas (`page.tsx`) e layouts (`layout.tsx`) são a exceção (exigência do Next.js).

### Estilização

- **Tokens semânticos obrigatórios**: `bg-accent-green` (nunca `bg-emerald-500` ou `bg-[#10B981]`). Todos definidos em `globals.css` `@theme`.
- **`tv()` para variantes**, `className` passado direto na chamada do `tv()`.
- **`twMerge` para classes dinâmicas** fora do `tv()` — nunca interpolação de string.
- **SVG**: usar `var(--color-*)` quando classes Tailwind não se aplicam.

### Componentes

- `forwardRef` + `displayName` obrigatórios.
- `ComponentProps<"element">` para herdar props nativas.
- **Composição sobre props** para componentes com 2+ slots visuais (Root, Title, etc.).
- Named exports individuais (nunca dot notation).
- Detalhes completos em `src/components/ui/AGENTS.md`.

### Fontes

- `font-mono` → JetBrains Mono (carregada via `next/font/google`)
- `font-sans` → stack do sistema (default)
- Nunca usar `font-primary`/`font-secondary`.

### Dados

- A camada de API/back-end do projeto é `tRPC`.
- Preferir `tRPC` para leitura/escrita de dados da aplicação em vez de dados mockados espalhados pela UI.
- Para convenções da API, ver `src/trpc/AGENTS.md`.

### Next.js App Router

- Preferir Server Components por padrão.
- Ao integrar dados com tRPC no front-end, usar prefetch/hydration via RSC sempre que fizer sentido.
- Client Components devem existir quando houver necessidade real de hooks, interação ou animação.

### Biome

- `tailwindDirectives: true` no CSS parser.
- `noArrayIndexKey: off`.
- Sempre rodar `pnpm biome check src/` antes de commitar.
