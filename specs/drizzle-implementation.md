# Especificação: Implementação do Drizzle ORM + PostgreSQL

Esta especificação detalha as tabelas, enums e o plano de ação (to-dos) para implementar o banco de dados no projeto **DevRoast**, utilizando **Drizzle ORM**, **PostgreSQL** e **Docker Compose**, baseando-se nas funcionalidades descritas no `README.md` e no layout do Figma/Pencil.

## 1. Entidades e Tabelas

Com base nas funcionalidades (Submissão de Código, Modo Roast, Avaliação 0-10, Sugestões com Diffs Visuais, e Shame Leaderboard), precisamos das seguintes tabelas:

### Tabela `submissions`
Armazena o código enviado pelo usuário e o resultado geral da avaliação (roast).

- `id`: `uuid` (Primary Key, default aleatório)
- `code`: `text` (O código original submetido)
- `language`: `varchar` (Ex: `javascript`, `python`, `typescript`)
- `score`: `numeric(3, 1)` (Nota do código, de 0.0 a 10.0)
- `is_roast_mode`: `boolean` (Indica se a submissão ativou o modo roast de humor ácido)
- `verdict`: `varchar` (Ex: `needs_serious_help`, `good`, `warning`)
- `roast_quote`: `text` (A frase de efeito/roast gerada na avaliação)
- `created_at`: `timestamp` (Data de submissão, default `now()`)

### Tabela `analysis_issues`
Armazena os problemas, avisos e pontos positivos encontrados durante a avaliação do código. Corresponde aos "Cards" e "Badges" do layout.

- `id`: `uuid` (Primary Key)
- `submission_id`: `uuid` (Foreign Key para `submissions(id)`, em cascata)
- `issue_type`: `enum('critical', 'warning', 'good')` (O tipo do apontamento)
- `title`: `varchar` (Título do problema, ex: "using var instead of const/let")
- `description`: `text` (Explicação detalhada do problema)

### Tabela `code_diffs`
Armazena as sugestões de melhoria (diffs) que o DevRoast aponta para o código submetido.

- `id`: `uuid` (Primary Key)
- `submission_id`: `uuid` (Foreign Key para `submissions(id)`, em cascata)
- `diff_content`: `text` (Conteúdo do diff gerado para renderização visual das linhas removidas/adicionadas)
- `created_at`: `timestamp`

---

## 2. Enums (Tipos Enumerados)

Será necessário criar os seguintes Enums no PostgreSQL através do Drizzle para padronizar os dados:

- **`issue_type_enum`**: 
  - `'critical'` (Erros graves ou péssimas práticas)
  - `'warning'` (Avisos ou pontos de melhoria)
  - `'good'` (Pontos positivos, se existirem)

- **`verdict_enum`** (Opcional, pode ser apenas varchar no início):
  - `'needs_serious_help'`, `'could_be_worse'`, `'actually_good'`, etc.

---

## 3. To-dos para Implantação

Siga este checklist para configurar o Drizzle ORM com Docker Compose:

### Ambiente e Docker
- [ ] Criar o arquivo `docker-compose.yml` na raiz do projeto configurando o serviço `postgres` (imagem `postgres:15-alpine`, portas `5432:5432`, e credenciais de ambiente).
- [ ] Adicionar um `.env` local com a variável `DATABASE_URL` (ex: `postgresql://postgres:postgres@localhost:5432/devroast`).
- [ ] Subir o banco de dados localmente com `docker compose up -d`.

### Dependências
- [ ] Instalar as dependências do Drizzle:
  ```bash
  pnpm add drizzle-orm postgres
  pnpm add -D drizzle-kit tsx
  ```

### Configuração do Drizzle
- [ ] Criar o arquivo `drizzle.config.ts` na raiz do projeto apontando para os schemas (`./src/db/schema.ts`) e consumindo o `DATABASE_URL`.
- [ ] Configurar a conexão do banco em `src/db/index.ts` instanciando o `drizzle` junto com o driver do `postgres`.

### Schemas e Migrations
- [ ] Criar o arquivo `src/db/schema.ts` exportando as tabelas `submissions`, `analysis_issues` e `code_diffs` conforme definido acima.
- [ ] Criar os relacionamentos (`relations`) no `schema.ts` para que a query do Drizzle consiga puxar uma `submission` e fazer JOIN automático com seus `issues` e `diffs`.
- [ ] Adicionar scripts no `package.json`:
  - `"db:generate": "drizzle-kit generate"`
  - `"db:migrate": "drizzle-kit push"` (ou `drizzle-kit migrate`)
  - `"db:studio": "drizzle-kit studio"`
- [ ] Rodar a primeira geração de migration e aplicar ao banco local.

### Seed e Teste
- [ ] Criar um script `src/db/seed.ts` para inserir algumas submissões de teste (dummy data) simulando códigos "ruins" para popular a "Shame Leaderboard".
- [ ] Testar a exibição dos dados puxando do banco na página de Leaderboard (`app/leaderboard/page.tsx` ou equivalente).
