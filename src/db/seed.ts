import { faker } from "@faker-js/faker";
import "dotenv/config";
import { db } from "./index";
import { analysisIssues, codeDiffs, submissions } from "./schema";

const TOTAL_ROASTS = 100;

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "php",
  "ruby",
  "sql",
  "bash",
] as const;

const VERDICTS = [
  "catastrophic",
  "needs_serious_help",
  "questionable_choices",
  "almost_ok",
  "surprisingly_decent",
] as const;

const ROAST_QUOTES = [
  "This code looks like it was pair-programmed with a toaster.",
  "I've seen spaghetti with better structure than this.",
  "Bold strategy: ignore edge cases and pray.",
  "This function has commitment issues and no return plan.",
  "Your linter cried, then gave up.",
  "Readable? Yes. Understandable? Not even close.",
  "This query is one WHERE clause away from disaster.",
  "Beautiful chaos. Mostly chaos.",
  "You wrote this like the deadline was five minutes ago.",
  "Congratulations, you invented technical debt speedrun mode.",
] as const;

const ISSUE_TITLES = {
  critical: [
    "naming does not communicate intent",
    "unsafe mutation across unrelated steps",
    "missing input validation",
    "duplicate logic in critical path",
    "algorithmic complexity too high for scale",
  ],
  warning: [
    "inconsistent code style",
    "overly long function",
    "low signal variable naming",
    "magic values spread in logic",
    "error handling can be improved",
  ],
  good: [
    "clear business intent",
    "reasonable separation of concerns",
    "easy-to-follow flow",
    "good readability overall",
    "solid baseline for refactoring",
  ],
} as const;

function makeCode(language: (typeof LANGUAGES)[number], index: number) {
  switch (language) {
    case "javascript":
      return `function process${index}(items) {\n  return items.map((item) => item.value * 2).filter(Boolean);\n}`;
    case "typescript":
      return `type Item = { value: number };\nexport function process${index}(items: Item[]) {\n  return items.reduce((sum, item) => sum + item.value, 0);\n}`;
    case "python":
      return `def process_${index}(items):\n    return [item for item in items if item is not None]`;
    case "java":
      return `public class Processor${index} {\n  int run(int[] values) {\n    int total = 0;\n    for (int v : values) total += v;\n    return total;\n  }\n}`;
    case "go":
      return `func Process${index}(values []int) int {\n\ttotal := 0\n\tfor _, value := range values {\n\t\ttotal += value\n\t}\n\treturn total\n}`;
    case "rust":
      return `fn process_${index}(values: Vec<i32>) -> i32 {\n    values.iter().sum()\n}`;
    case "php":
      return `function process${index}($values) {\n  return array_sum($values);\n}`;
    case "ruby":
      return `def process_${index}(values)\n  values.compact.sum\nend`;
    case "sql":
      return `SELECT user_id, COUNT(*) AS total\nFROM events\nWHERE created_at >= NOW() - INTERVAL '7 days'\nGROUP BY user_id;`;
    case "bash":
      return `#!/usr/bin/env bash\nfor file in *.log; do\n  echo "processing $file"\ndone`;
    default:
      return "";
  }
}

function buildDiff(code: string) {
  const lines = code.split("\n").slice(0, 4);
  const removed = lines.map((line) => `- ${line}`).join("\n");
  const added = lines
    .map((line) => `+ ${line.replace("var ", "const ").replace("==", "===")}`)
    .join("\n");
  return `${removed}\n${added}`;
}

async function main() {
  console.log("Seeding database with roast data...");

  await db.delete(codeDiffs);
  await db.delete(analysisIssues);
  await db.delete(submissions);

  for (let index = 0; index < TOTAL_ROASTS; index += 1) {
    const language = faker.helpers.arrayElement(LANGUAGES);
    const score = faker.number.float({ min: 0, max: 10, fractionDigits: 1 });
    const code = makeCode(language, index + 1);

    const [submission] = await db
      .insert(submissions)
      .values({
        code,
        language,
        score: score.toFixed(1),
        isRoastMode: faker.datatype.boolean({ probability: 0.7 }),
        verdict: faker.helpers.arrayElement(VERDICTS),
        roastQuote: faker.helpers.arrayElement(ROAST_QUOTES),
      })
      .returning({ id: submissions.id });

    const issueCount = faker.number.int({ min: 2, max: 4 });

    await db.insert(analysisIssues).values(
      Array.from({ length: issueCount }, () => {
        const issueType = faker.helpers.weightedArrayElement([
          { value: "critical", weight: 4 },
          { value: "warning", weight: 5 },
          { value: "good", weight: 2 },
        ] as const);

        return {
          submissionId: submission.id,
          issueType,
          title: faker.helpers.arrayElement(ISSUE_TITLES[issueType]),
          description: faker.lorem.sentences({ min: 2, max: 4 }),
        };
      }),
    );

    await db.insert(codeDiffs).values({
      submissionId: submission.id,
      diffContent: buildDiff(code),
    });
  }

  console.log(`Seed completed successfully with ${TOTAL_ROASTS} roasts.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
