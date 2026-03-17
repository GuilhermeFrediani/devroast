"use client";

import { useEffect, useRef, useState } from "react";
import { createHighlighterCore, type HighlighterCore } from "shiki";
import { LANGUAGES } from "@/lib/languages";

let highlighterInstance: HighlighterCore | null = null;
let highlighterPromise: Promise<HighlighterCore> | null = null;

const EAGER_LANGUAGES = Object.entries(LANGUAGES)
  .filter(([, lang]) => lang.eager)
  .map(([key, lang]) => ({ key, shikiId: lang.shikiId }));

async function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterInstance) return highlighterInstance;
  if (!highlighterPromise) {
    highlighterPromise = initHighlighter();
  }
  return highlighterPromise;
}

async function initHighlighter(): Promise<HighlighterCore> {
  const highlighter = await createHighlighterCore({
    themes: ["vesper"],
    langs: EAGER_LANGUAGES.map((l) => l.shikiId),
  });

  highlighterInstance = highlighter;
  return highlighter;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type UseShikiHighlighterReturn = {
  highlight: (code: string, language: string) => string;
  isLoading: boolean;
  ensureLanguageLoaded: (language: string) => Promise<void>;
};

function useShikiHighlighter(): UseShikiHighlighterReturn {
  const [isLoading, setIsLoading] = useState(!highlighterInstance);
  const loadingRef = useRef<Map<string, Promise<void>>>(new Map());

  useEffect(() => {
    if (!highlighterInstance) {
      getHighlighter().then(() => setIsLoading(false));
    }
  }, []);

  const ensureLanguageLoaded = async (language: string): Promise<void> => {
    const langEntry = LANGUAGES[language];
    if (!langEntry) return;

    const shikiId = langEntry.shikiId;
    const highlighter = await getHighlighter();

    if (highlighter.getLoadedLanguages().includes(shikiId)) {
      return;
    }

    const existingPromise = loadingRef.current.get(shikiId);
    if (existingPromise) return existingPromise;

    const loadPromise = highlighter.loadLanguage(shikiId).then(() => {
      loadingRef.current.delete(shikiId);
    });

    loadingRef.current.set(shikiId, loadPromise);
    return loadPromise;
  };

  const highlight = (code: string, language: string): string => {
    if (isLoading || !highlighterInstance) {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }

    const langEntry = LANGUAGES[language];
    const shikiId = langEntry?.shikiId ?? "text";

    if (!highlighterInstance.getLoadedLanguages().includes(shikiId)) {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }

    try {
      return highlighterInstance.codeToHtml(code, {
        lang: shikiId,
        theme: "vesper",
      });
    } catch {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;
    }
  };

  return { highlight, isLoading, ensureLanguageLoaded };
}

export { useShikiHighlighter, type UseShikiHighlighterReturn };
