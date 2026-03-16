# UI Components — Padrões de Criação

Guia para agentes de IA e desenvolvedores criarem componentes consistentes dentro de `src/components/ui/`.

---

## Regras gerais

1. **Named exports apenas** — nunca use `export default`. Exporte o componente, o objeto `tv()` e os tipos.
2. **Estender props nativas do HTML** — use `ComponentProps<"element">` do React para herdar todas as propriedades nativas do elemento.
3. **`forwardRef` obrigatório** — todos os componentes devem encaminhar a ref.
4. **`displayName` obrigatório** — defina `Component.displayName` após o `forwardRef`.
5. **Composição sobre props** — componentes com múltiplos "pedaços" visuais (título, descrição, badge, etc.) devem usar o padrão de composição com sub-componentes (`Root`, `Title`, `Description`, etc.) em vez de receber tudo via props.

---

## Padrão de composição

Componentes compostos usam **named exports individuais** (não dot notation):

```tsx
// Correto — named exports individuais
import {
  AnalysisCardRoot,
  AnalysisCardTitle,
  AnalysisCardDescription,
} from "@/components/ui/analysis-card";

<AnalysisCardRoot>
  <Badge variant="critical">critical</Badge>
  <AnalysisCardTitle>using var instead of const/let</AnalysisCardTitle>
  <AnalysisCardDescription>explanation here</AnalysisCardDescription>
</AnalysisCardRoot>

// Errado — props monolíticas
<AnalysisCard title="..." description="..." severity="critical" />

// Errado — dot notation
<AnalysisCard.Root>...</AnalysisCard.Root>
```

### Quando usar composição

- Componente tem 2+ "slots" visuais distintos (título, descrição, badge, etc.)
- O consumidor pode querer reordenar, omitir ou substituir partes internas
- Primitivos como `Badge` são usados diretamente como children (não encapsulados em sub-componentes)

### Quando NÃO usar composição

- Componente é atômico (Button, Badge, Toggle, SectionTitle)
- Componente tem apenas 1 slot (DiffLine com `code` prop)

### Componentes compostos atuais

| Componente | Sub-componentes |
|---|---|
| `AnalysisCard` | `AnalysisCardRoot`, `AnalysisCardTitle`, `AnalysisCardDescription` |
| `LeaderboardRow` | `LeaderboardRowRoot`, `LeaderboardRowRank`, `LeaderboardRowScore`, `LeaderboardRowCode`, `LeaderboardRowLanguage` |

---

## Estilização

### tailwind-variants (`tv`)

- Use `tv()` para definir base, variants e defaultVariants.
- **Passe `className` diretamente** na chamada do `tv()`. O `tailwind-variants` faz o merge automaticamente.
- **Não** use `twMerge` ou `cn()` dentro da chamada do `tv()` — é redundante.
- **Use `twMerge`** diretamente (importando de `tailwind-merge`) quando precisar combinar classes estáticas com classes dinâmicas fora do `tv()` (ex: cor condicional baseada em props computadas).

```tsx
// Correto — className passado via tv()
className={button({ variant, size, className })}

// Correto — classes dinâmicas fora do tv()
import { twMerge } from "tailwind-merge";
className={twMerge("text-5xl font-bold", scoreColor)}

// Errado — merge manual redundante com tv()
className={cn(button({ variant, size }), className)}

// Errado — interpolação de string para combinar classes
className={`text-5xl font-bold ${scoreColor}`}
```

### Tailwind CSS

- Use classes utilitárias do Tailwind v4.
- **Sempre use a forma canônica** das classes. Se existe uma classe nativa do Tailwind, use-a em vez da forma com variável CSS.
- O Biome pode sugerir formas canônicas (`suggestCanonicalClasses`) — **sempre** siga essas sugestões.

---

## Estrutura de um componente simples

```tsx
import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const myComponent = tv({
  base: ["classes-base"],
  variants: { variant: { primary: ["..."], secondary: ["..."] } },
  defaultVariants: { variant: "primary" },
});

type MyComponentVariants = VariantProps<typeof myComponent>;
type MyComponentProps = ComponentProps<"div"> & MyComponentVariants;

const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div ref={ref} className={myComponent({ variant, className })} {...props} />
    );
  },
);

MyComponent.displayName = "MyComponent";

export { MyComponent, myComponent, type MyComponentProps, type MyComponentVariants };
```

---

## Checklist para novos componentes

- [ ] Named exports (componente, objeto tv, tipos)
- [ ] `ComponentProps<"element">` para herdar props nativas
- [ ] `forwardRef` com tipo genérico correto
- [ ] `displayName` definido
- [ ] `className` passado direto no `tv()` — sem `cn()`
- [ ] Classes dinâmicas (fora do `tv()`) combinadas com `twMerge` — **nunca** interpolação de string
- [ ] Composição para componentes com 2+ slots visuais
- [ ] Biome check passando sem erros
- [ ] Build passando

---

## Exceções ao padrão `forwardRef`

### CodeBlock (Server Component assíncrono)

O `CodeBlock` usa **Shiki** para syntax highlighting server-side. É uma `async function` (não `forwardRef`).

- Não é `"use client"` — é renderizado no servidor.
- Props: `code`, `lang` (default `"javascript"`), `fileName` (opcional), `className`.
- Tema: `vesper`.
- **Não pode** ser usado diretamente dentro de um componente client.

### Toggle (base-ui Switch)

O `Toggle` usa `@base-ui/react/switch`. É `"use client"`.

- Props: `label`, `checked`, `defaultChecked`, `onCheckedChange`.

### DiffBlock (Container wrapper)

Container que envolve `<DiffLine>` com header de arquivo.

- Props: `fileName` (opcional), `children`, `className`.

---

## Tokens do design

Todas as cores são variáveis Tailwind em `globals.css` (`@theme`). **Nunca** use cores hardcoded.

Referência completa de tokens: consulte `globals.css`.

### Regras

- Use classes de token (`bg-accent-green`, `text-text-primary`) em vez de cores genéricas ou hex.
- Em SVG (`stroke`, `stopColor`), use `var(--color-accent-green)`.
- Novas cores: adicione no `@theme` de `globals.css`.

### Fontes

| Classe | Fonte | Uso |
|---|---|---|
| `font-sans` | Sistema | Texto corrido, UI genérica |
| `font-mono` | JetBrains Mono | Código, terminais, botões, badges |

- **Não** use `font-primary`/`font-secondary`.
- **Não** importe fontes extras.
