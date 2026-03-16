import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";

type RoastResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type AnalysisIssue = {
  type: "critical" | "warning" | "good";
  title: string;
  description: string;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const submissionCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

const issues: AnalysisIssue[] = [
  {
    type: "critical",
    title: "using var instead of const/let",
    description:
      "var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.",
  },
  {
    type: "warning",
    title: "imperative loop pattern",
    description:
      "for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.",
  },
  {
    type: "good",
    title: "clear naming conventions",
    description:
      "calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.",
  },
  {
    type: "good",
    title: "single responsibility",
    description:
      "the function does one thing well - calculates a total. no side effects, no mixed concerns, no hidden complexity.",
  },
];

export async function generateMetadata({
  params,
}: RoastResultPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Roast Result ${id} | DevRoast`,
    description:
      "Detailed static roast result page for a submitted code snippet.",
  };
}

export default async function RoastResultPage({
  params,
}: RoastResultPageProps) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pt-10 pb-16 sm:px-10 lg:px-20">
      <section className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <ScoreRing score={3.5} />

        <div className="flex w-full flex-col gap-4">
          <Badge variant="critical">verdict: needs_serious_help</Badge>

          <p className="max-w-4xl text-xl leading-relaxed text-text-primary sm:text-2xl">
            "this code looks like it was written during a power outage... in
            2005."
          </p>

          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <span>lang: javascript</span>
            <span>&middot;</span>
            <span>16 lines</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="border border-border-default px-4 py-2 text-xs text-text-primary transition-colors hover:bg-bg-hover"
            >
              $ share_roast
            </button>
            <span className="text-[11px] text-text-tertiary">id: {id}</span>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-4">
        <SectionTitle label="your_submission" />
        <CodeBlock code={submissionCode} lang="javascript" className="w-full" />
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-6">
        <SectionTitle label="detailed_analysis" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {issues.map((issue) => (
            <AnalysisCardRoot key={issue.title}>
              <Badge variant={issue.type}>{issue.type}</Badge>
              <AnalysisCardTitle>{issue.title}</AnalysisCardTitle>
              <AnalysisCardDescription>
                {issue.description}
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-6">
        <SectionTitle label="suggested_fix" />

        <DiffBlock fileName="your_code.ts → improved_code.ts">
          <DiffLine type="context" code="function calculateTotal(items) {" />
          <DiffLine type="removed" code="  var total = 0;" />
          <DiffLine
            type="removed"
            code="  for (var i = 0; i < items.length; i++) {"
          />
          <DiffLine type="removed" code="    total = total + items[i].price;" />
          <DiffLine type="removed" code="  }" />
          <DiffLine type="removed" code="  return total;" />
          <DiffLine
            type="added"
            code="  return items.reduce((sum, item) => sum + item.price, 0);"
          />
          <DiffLine type="context" code="}" />
        </DiffBlock>
      </section>
    </main>
  );
}
