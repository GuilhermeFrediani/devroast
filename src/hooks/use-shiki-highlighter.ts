"use client";

import { useEffect, useRef, useState } from "react";
import { getHighlighter, type Highlighter } from "shiki";
import { LANGUAGES } from "@/lib/languages";

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

const EAGER_LANGUAGES = Object.entries(LANGUAGES)
  .filter(([, lang]) => lang.eager)
  .map(([, lang]) => lang.shikiId);

async function getHighlighterInstance(): Promise<Highlighter> {
  if (highlighterInstance) return highlighterInstance;
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["vesper"],
      langs: EAGER_LANGUAGES as never,
    }).then((h) => {
      highlighterInstance = h;
      return h;
    });
  }
  return highlighterPromise;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
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
      getHighlighterInstance().then(() => setIsLoading(false));
    }
  }, []);

  const ensureLanguageLoaded = async (language: string): Promise<void> => {
    const langEntry = LANGUAGES[language];
    if (!langEntry) return;

    const shikiId = langEntry.shikiId;
    const highlighter = await getHighlighterInstance();

    if (highlighter.getLoadedLanguages().includes(shikiId)) {
      return;
    }

    const existingPromise = loadingRef.current.get(shikiId);
    if (existingPromise) return existingPromise;

    const loadPromise = highlighter.loadLanguage(shikiId as never).then(() => {
      loadingRef.current.delete(shikiId);
    });

    loadingRef.current.set(shikiId, loadPromise);
    return loadPromise;
  };

  const highlight = (code: string, language: string): string => {
    if (isLoading || !highlighterInstance) {
      return `<pre class="shiki vesper" style="background-color:transparent"><code>${escapeHtml(code)}</code></pre>`;
    }

    const langEntry = LANGUAGES[language];
    const shikiId = langEntry?.shikiId ?? "text";

    if (!highlighterInstance.getLoadedLanguages().includes(shikiId)) {
      return `<pre class="shiki vesper" style="background-color:transparent"><code>${escapeHtml(code)}</code></pre>`;
    }

    try {
      return highlighterInstance.codeToHtml(code, {
        lang: shikiId,
        theme: "vesper",
      });
    } catch {
      return `<pre class="shiki vesper" style="background-color:transparent"><code>${escapeHtml(code)}</code></pre>`;
    }
  };

  return { highlight, isLoading, ensureLanguageLoaded };
}

export { useShikiHighlighter, type UseShikiHighlighterReturn };
