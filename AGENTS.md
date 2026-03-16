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

- Todos os dados são estáticos por enquanto (sem API).

### Biome

- `tailwindDirectives: true` no CSS parser.
- `noArrayIndexKey: off`.
- Sempre rodar `pnpm biome check src/` antes de commitar.
