"use client";

import { useRef, useState } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";
import { LANGUAGES } from "@/lib/languages";

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
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const ensureLanguageLoaded = async (_language: string): Promise<void> => {
    // No-op since shiki handles language loading automatically
  };

  const highlight = (code: string, language: string): string => {
    const langEntry = LANGUAGES[language];
    const shikiId = (langEntry?.shikiId as BundledLanguage) ?? "text";
    const cacheKey = `${shikiId}:${code}`;

    // Check cache first
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Trigger async highlight
    codeToHtml(code, {
      lang: shikiId,
      theme: "vesper",
    })
      .then((html) => {
        cacheRef.current.set(cacheKey, html);
      })
      .catch(() => {
        // Ignore errors, will show escaped code
      });

    // Return escaped HTML immediately
    return `<pre class="shiki vesper" style="background-color:transparent"><code>${escapeHtml(code)}</code></pre>`;
  };

  return { highlight, isLoading, ensureLanguageLoaded };
}

export { useShikiHighlighter, type UseShikiHighlighterReturn };
