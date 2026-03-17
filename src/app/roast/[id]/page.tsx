import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffBlock } from "@/components/ui/diff-block";
import { DiffLine } from "@/components/ui/diff-line";
import { getCodeLanguage } from "@/components/ui/leaderboard-snippet";
import { ScoreRing } from "@/components/ui/score-ring";
import { SectionTitle } from "@/components/ui/section-title";
import {
  computeDiffLines,
  formatVerdictLabel,
  getVerdictBadgeVariant,
} from "@/lib/roast";
import { caller } from "@/trpc/server";

type RoastResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
  return (
    <Suspense fallback={null}>
      <RoastResultContent params={params} />
    </Suspense>
  );
}

async function RoastResultContent({ params }: RoastResultPageProps) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const roast = await caller.roast.getById({ id });

  if (!roast) {
    notFound();
  }

  const diffLines = computeDiffLines(roast.code, roast.suggestedFix);

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-6 pt-10 pb-16 sm:px-10 lg:px-20">
      <section className="flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
        <ScoreRing score={roast.score} />

        <div className="flex w-full flex-col gap-4">
          <Badge variant={getVerdictBadgeVariant(roast.verdict)}>
            {`verdict: ${formatVerdictLabel(roast.verdict)}`}
          </Badge>

          <p className="max-w-4xl text-xl leading-relaxed text-text-primary sm:text-2xl">
            {`"${roast.roastQuote}"`}
          </p>

          <div className="flex items-center gap-4 text-xs text-text-tertiary">
            <span>{`lang: ${roast.language}`}</span>
            <span>&middot;</span>
            <span>{`${roast.lineCount} lines`}</span>
            <span>&middot;</span>
            <span>{roast.roastMode ? "roast mode" : "review mode"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] text-text-tertiary">id: {id}</span>
          </div>
        </div>
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-4">
        <SectionTitle label="your_submission" />
        <CodeBlock
          code={roast.code}
          lang={getCodeLanguage(roast.language)}
          className="w-full"
        />
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-6">
        <SectionTitle label="detailed_analysis" />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {roast.analysisItems.map((item) => (
            <AnalysisCardRoot key={item.title}>
              <Badge variant={item.severity}>{item.severity}</Badge>
              <AnalysisCardTitle>{item.title}</AnalysisCardTitle>
              <AnalysisCardDescription>
                {item.description}
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          ))}
        </div>
      </section>

      <div className="h-px w-full bg-border-default" />

      <section className="flex w-full flex-col gap-6">
        <SectionTitle label="suggested_fix" />

        <DiffBlock fileName="your_code.ts → improved_code.ts">
          {diffLines.map((line, index) => (
            <DiffLine
              key={`${line.type}-${index + 1}`}
              type={line.type}
              code={line.code}
            />
          ))}
        </DiffBlock>
      </section>
    </main>
  );
}
