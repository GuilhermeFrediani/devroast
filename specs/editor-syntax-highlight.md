# Especificação: Editor de Código com Syntax Highlight

## Conclusões da Pesquisa

Após a análise da implementação do **ray.so** e de outras alternativas comuns no mercado (como Monaco Editor e CodeMirror), concluímos qual é a melhor abordagem para o **DevRoast**.

### Alternativas Analisadas
1. **Monaco Editor / CodeMirror**: Extremamente completos, oferecem auto-complete, minimap, etc. Porém, são bibliotecas pesadas e difíceis de estilizar para que pareçam apenas mais um componente fluído da interface.
2. **Textarea Overlay + Shiki (Abordagem do ray.so)**: Utiliza um `<textarea>` HTML nativo com texto transparente sobreposto perfeitamente a uma div que contém o código renderizado com cores.

### Abordagem Escolhida: Textarea Overlay + Shiki
Essa é a melhor opção pois:
- É extremamente leve e performática.
- Já utilizamos o `shiki` no projeto (conforme `package.json` e `AGENTS.md` - tema *vesper*).
- O estilo é 100% customizável via Tailwind CSS.
- Mantém o comportamento nativo de seleção de texto, copy/paste do navegador.

## Especificação Técnica

### 1. Renderização e Sobreposição (Textarea Overlay)
- O componente de Editor terá um layout usando **CSS Grid** (`grid-template-areas` ou `grid-column/row: 1/1`) para colocar o `<textarea>` e o `<pre>` (renderizado pelo Shiki) exatamente no mesmo espaço.
- O `<textarea>` terá a classe `text-transparent` (ou `-webkit-text-fill-color: transparent`) e `caret-white` (ou a cor do cursor definida pelo design). O texto digitado não será visível, apenas o cursor.
- O texto visível será o bloco renderizado pelo **Shiki**, que ficará na camada inferior (z-index menor).
- É crucial que ambos tenham exatamente a mesma fonte (`font-mono`), tamanho, `line-height` e `padding` para que o cursor do textarea fique perfeitamente alinhado com o texto colorido embaixo.

### 2. Syntax Highlighting
- O `shiki` será responsável por transformar o texto cru em HTML estilizado.
- O processamento deve ocorrer no Client-Side através de um `useEffect` ou `useMemo` assíncrono (com *debounce* para evitar travamentos ao digitar muito rápido).
- O tema fixo será o `vesper`.

### 3. Detecção Automática de Linguagem
- O Shiki não possui uma funcionalidade robusta de descoberta de linguagem a partir de texto puro. O ray.so resolve isso usando a função `highlightAuto` do `highlight.js`.
- **Decisão**: Utilizaremos uma biblioteca auxiliar para inferir a linguagem. Duas opções viáveis são:
  - `highlight.js` (importando apenas a função de detecção para economizar bundle).
  - `flourite` (biblioteca específica para detecção de linguagem).
- A detecção rodará de forma assíncrona (debounced) logo após a colagem do código.

### 4. Seleção Manual de Linguagem
- Acima do editor na Homepage, deverá haver um componente de Select/Dropdown (podendo utilizar os hooks do `@base-ui/react`).
- Opções do seletor: `"Automático"` (default) seguido de uma lista de linguagens suportadas (JavaScript, TypeScript, Python, Rust, etc).
- Se o usuário alterar manualmente, a auto-detecção será desativada para a sessão atual.

### 5. Interações do Editor
- O componente precisará interceptar a tecla `Tab` para inserir espaços (ex: 2 espaços) no texto, ao invés de pular o foco do formulário.
- Atributos obrigatórios no textarea: `spellcheck="false"`, `autoComplete="off"`, `autoCorrect="off"`, `autoCapitalize="off"`.

---

## To-Dos (Plano de Ação)

- [ ] Instalar biblioteca para detecção de linguagem (Avaliar entre `flourite` e `highlight.js`).
- [ ] Criar o componente base `src/components/ui/CodeEditor.tsx` utilizando `forwardRef` (seguindo as regras do `AGENTS.md`).
- [ ] Implementar a estrutura de sobreposição do `textarea` + `<pre>` usando Tailwind (Grid e transparência de texto).
- [ ] Integrar a renderização assíncrona do `shiki` com o state interno do texto.
- [ ] Implementar a lógica de interceptação da tecla `Tab` dentro do `textarea`.
- [ ] Adicionar um debounce na mudança de texto para acionar a detecção automática de linguagem e a re-renderização do Shiki.
- [ ] Implementar na Homepage a integração do `CodeEditor` junto de um `Select` (manual) de linguagem.
