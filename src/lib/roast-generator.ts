import "server-only";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { normalizeRoastScore, roastGenerationSchema } from "@/lib/roast";

const google = createGoogleGenerativeAI({
  apiKey:
    process.env.GEMINI_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const ROAST_MODEL = "gemini-3-flash-preview";

type GenerateRoastAnalysisInput = {
  code: string;
  language: string;
  isRoastMode: boolean;
};

function buildRoastPrompt(input: GenerateRoastAnalysisInput) {
  const toneInstruction = input.isRoastMode
    ? "Use a sharp, sarcastic, funny tone. Roast the code, but stay product-safe and avoid profanity, hate, harassment, or personal attacks."
    : "Use a direct, constructive senior-engineer tone. Be honest, but not sarcastic.";

  return [
    "You are DevRoast, an expert code reviewer that returns structured code roast analyses.",
    "Score semantics: 0.0 is terrible code, 10.0 is excellent code. Lower scores are worse.",
    "Choose exactly one verdict from: catastrophic, needs_serious_help, questionable_choices, almost_ok, surprisingly_decent.",
    "Always include at least one positive issue with type 'good'.",
    "Keep titles short and punchy.",
    "Issue descriptions must be specific and actionable.",
    "The roastQuote must be a single sentence.",
    "The suggestedFix lines must be a focused diff-like snippet that improves the most important part of the code.",
    "Use 'removed' for lines to replace, 'added' for improved lines, and 'context' for nearby unchanged lines.",
    toneInstruction,
    "",
    `Language: ${input.language}`,
    `Roast mode: ${input.isRoastMode ? "enabled" : "disabled"}`,
    "",
    "Code:",
    "```",
    input.code,
    "```",
  ].join("\n");
}

export async function generateRoastAnalysis(input: GenerateRoastAnalysisInput) {
  if (
    !process.env.GEMINI_API_KEY &&
    !process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ) {
    throw new Error("Missing Gemini API key.");
  }

  const { output } = await generateText({
    model: google(ROAST_MODEL),
    prompt: buildRoastPrompt(input),
    temperature: input.isRoastMode ? 1 : 0.7,
    output: Output.object({
      schema: roastGenerationSchema,
    }),
  });

  return {
    ...output,
    score: normalizeRoastScore(output.score),
  };
}
