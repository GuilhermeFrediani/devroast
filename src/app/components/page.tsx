import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock, CodeBlockHeader } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
  LeaderboardRowCode,
  LeaderboardRowLanguage,
  LeaderboardRowRank,
  LeaderboardRowRoot,
  LeaderboardRowScore,
} from "@/components/ui/leaderboard-row";
import { Navbar } from "@/components/ui/navbar";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import { ToggleDemo } from "./toggle-demo";

const variants = ["primary", "secondary", "ghost", "danger"] as const;
const sizes = ["sm", "md", "lg"] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-[10px] font-bold tracking-widest text-text-secondary uppercase">
      {children}
    </span>
  );
}

function ComponentHeader({ name, path }: { name: string; path: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-base font-bold text-text-primary">$ {name}</h2>
      <span className="text-xs text-text-tertiary">{path}</span>
    </div>
  );
}

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 p-12">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-accent-green">
          {"// components"}
        </h1>
        <p className="text-xs text-text-secondary">
          Biblioteca de componentes UI do DevRoast
        </p>
      </header>

      {/* ── SectionTitle ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="SectionTitle"
          path="src/components/ui/section-title.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <div className="flex flex-col gap-4">
            <SectionTitle label="code_analysis" />
            <SectionTitle label="improvements" />
            <SectionTitle label="score" />
          </div>
        </div>
      </section>

      {/* ── Button ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader name="Button" path="src/components/ui/button.tsx" />

        <div className="flex flex-col gap-3">
          <SectionLabel>Variantes</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((v) => (
              <Button key={v} variant={v}>
                {`$ ${v}`}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionLabel>Tamanhos</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            {sizes.map((s) => (
              <Button key={s} size={s}>
                {`$ size_${s}`}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionLabel>Matriz variante x tamanho</SectionLabel>
          <div className="flex flex-col gap-4">
            {variants.map((v) => (
              <div key={v} className="flex items-center gap-4">
                <span className="w-20 text-xs text-text-tertiary">{v}</span>
                <div className="flex flex-wrap items-center gap-3">
                  {sizes.map((s) => (
                    <Button key={`${v}-${s}`} variant={v} size={s}>
                      {`$ ${v}_${s}`}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SectionLabel>Desabilitado</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            {variants.map((v) => (
              <Button key={v} variant={v} disabled>
                {`$ ${v}`}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Badge ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader name="Badge" path="src/components/ui/badge.tsx" />

        <div className="flex flex-col gap-3">
          <SectionLabel>Variantes</SectionLabel>
          <div className="flex flex-wrap items-center gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge variant="critical">needs_serious_help</Badge>
          </div>
        </div>
      </section>

      {/* ── Toggle ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader name="Toggle" path="src/components/ui/toggle.tsx" />

        <div className="flex flex-col gap-3">
          <SectionLabel>Estados</SectionLabel>
          <ToggleDemo />
        </div>
      </section>

      {/* ── AnalysisCard ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="AnalysisCard"
          path="src/components/ui/analysis-card.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <AnalysisCardRoot className="max-w-lg">
            <Badge variant="critical">critical</Badge>
            <AnalysisCardTitle>
              using var instead of const/let
            </AnalysisCardTitle>
            <AnalysisCardDescription>
              the var keyword is function-scoped rather than block-scoped, which
              can lead to unexpected behavior and bugs. modern javascript uses
              const for immutable bindings and let for mutable ones.
            </AnalysisCardDescription>
          </AnalysisCardRoot>
        </div>
      </section>

      {/* ── CodeBlock ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="CodeBlock"
          path="src/components/ui/code-block.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <div className="max-w-xl">
            <CodeBlockHeader fileName="calculate.js" />
            <CodeBlock code={sampleCode} lang="javascript" />
          </div>
        </div>
      </section>

      {/* ── DiffBlock ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="DiffBlock"
          path="src/components/ui/diff-block.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <DiffBlock
            fileName="your_code.ts → improved_code.ts"
            className="max-w-xl"
          >
            <DiffLine type="context" code="function calculateTotal(items) {" />
            <DiffLine type="removed" code="  var total = 0;" />
            <DiffLine
              type="removed"
              code="  for (var i = 0; i < items.length; i++) {"
            />
            <DiffLine
              type="removed"
              code="    total = total + items[i].price;"
            />
            <DiffLine type="removed" code="  }" />
            <DiffLine type="removed" code="  return total;" />
            <DiffLine
              type="added"
              code="  return items.reduce((sum, item) => sum + item.price, 0);"
            />
            <DiffLine type="context" code="}" />
          </DiffBlock>
        </div>
      </section>

      {/* ── DiffLine ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="DiffLine"
          path="src/components/ui/diff-line.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Variantes</SectionLabel>
          <div className="flex max-w-xl flex-col">
            <DiffLine type="removed" code="var total = 0;" />
            <DiffLine type="added" code="const total = 0;" />
            <DiffLine
              type="context"
              code="for (let i = 0; i < items.length; i++) {"
            />
          </div>
        </div>
      </section>

      {/* ── LeaderboardRow ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="LeaderboardRow"
          path="src/components/ui/leaderboard-row.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <div className="flex flex-col">
            <LeaderboardRowRoot>
              <LeaderboardRowRank>#1</LeaderboardRowRank>
              <LeaderboardRowScore score={2.1} />
              <LeaderboardRowCode>
                {"function calculateTotal(items) { var total = 0; ..."}
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>javascript</LeaderboardRowLanguage>
            </LeaderboardRowRoot>
            <LeaderboardRowRoot>
              <LeaderboardRowRank>#2</LeaderboardRowRank>
              <LeaderboardRowScore score={5.4} />
              <LeaderboardRowCode>
                {
                  "const fetchData = async () => { try { ... } catch (e) { console.log(e) } }"
                }
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>typescript</LeaderboardRowLanguage>
            </LeaderboardRowRoot>
            <LeaderboardRowRoot>
              <LeaderboardRowRank>#3</LeaderboardRowRank>
              <LeaderboardRowScore score={8.7} />
              <LeaderboardRowCode>
                {"def quicksort(arr): return arr if len(arr) <= 1 ..."}
              </LeaderboardRowCode>
              <LeaderboardRowLanguage>python</LeaderboardRowLanguage>
            </LeaderboardRowRoot>
          </div>
        </div>
      </section>

      {/* ── Navbar ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader name="Navbar" path="src/components/ui/navbar.tsx" />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <Navbar>
            <span className="text-[13px] text-text-secondary">leaderboard</span>
          </Navbar>
        </div>
      </section>

      {/* ── ScoreRing ── */}
      <section className="flex flex-col gap-8">
        <ComponentHeader
          name="ScoreRing"
          path="src/components/ui/score-ring.tsx"
        />

        <div className="flex flex-col gap-3">
          <SectionLabel>Exemplo</SectionLabel>
          <ScoreRing score={3.5} />
        </div>
      </section>
    </div>
  );
}
