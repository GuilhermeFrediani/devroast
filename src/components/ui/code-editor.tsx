"use client";

import flourite from "flourite";
import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  type BundledLanguage,
  createHighlighter,
  type Highlighter,
} from "shiki";
import { tv } from "tailwind-variants";

const codeEditor = tv({
  slots: {
    root: "flex max-h-[600px] w-full overflow-hidden bg-bg-input font-mono",
    lineNumbers:
      "flex flex-col gap-2 overflow-y-hidden border-r border-border-default bg-bg-surface px-3 py-4 text-right text-xs leading-snug text-text-tertiary select-none",
    editorLayer: "grid min-w-0 flex-1 overflow-hidden",
    textarea:
      "[grid-area:1/1] h-full w-full resize-none overflow-auto bg-transparent p-4 text-xs leading-snug text-transparent caret-text-primary outline-none placeholder:text-text-tertiary",
    highlighted:
      "[grid-area:1/1] overflow-auto p-4 text-xs leading-snug pointer-events-none [&_.line]:leading-snug [&_pre]:m-0 [&_pre]:bg-transparent [&_pre]:p-0",
  },
});

const DETECT_DEBOUNCE_MS = 200;
const RENDER_DEBOUNCE_MS = 120;
const AUTO_LANGUAGE_VALUE = "auto";

const SUPPORTED_CODE_EDITOR_LANGUAGES: BundledLanguage[] = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "python",
  "java",
  "go",
  "rust",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "json",
  "yaml",
  "markdown",
  "bash",
  "docker",
];

const FLOURITE_LANGUAGE_TO_SHIKI: Record<string, BundledLanguage> = {
  javascript: "javascript",
  typescript: "typescript",
  html: "html",
  css: "css",
  python: "python",
  java: "java",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
  swift: "swift",
  kotlin: "kotlin",
  sql: "sql",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
  shell: "bash",
  bash: "bash",
  dockerfile: "docker",
};

function normalizeDetectedLanguage(value: string): BundledLanguage {
  const normalized = value.trim().toLowerCase();

  if (normalized in FLOURITE_LANGUAGE_TO_SHIKI) {
    return FLOURITE_LANGUAGE_TO_SHIKI[normalized];
  }

  if (SUPPORTED_CODE_EDITOR_LANGUAGES.includes(normalized as BundledLanguage)) {
    return normalized as BundledLanguage;
  }

  return "typescript";
}

type CodeEditorLanguage = BundledLanguage | typeof AUTO_LANGUAGE_VALUE;

type CodeEditorProps = Omit<
  ComponentProps<"textarea">,
  "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  language?: CodeEditorLanguage;
  onDetectedLanguageChange?: (language: BundledLanguage) => void;
  className?: string;
};

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      value,
      onValueChange,
      language = AUTO_LANGUAGE_VALUE,
      onDetectedLanguageChange,
      className,
      ...props
    },
    ref,
  ) => {
    const [detectedLanguage, setDetectedLanguage] =
      useState<BundledLanguage>("typescript");
    const [highlightedHtml, setHighlightedHtml] = useState("");
    const highlighterRef = useRef<Highlighter | null>(null);
    const lineNumbersRef = useRef<HTMLDivElement | null>(null);
    const highlightedRef = useRef<HTMLDivElement | null>(null);

    const { root, lineNumbers, editorLayer, textarea, highlighted } =
      codeEditor();
    const activeLanguage =
      language === AUTO_LANGUAGE_VALUE ? detectedLanguage : language;
    const lineCount = Math.max(value.split("\n").length, 16);

    useEffect(() => {
      let isMounted = true;

      async function setupHighlighter() {
        const highlighter = await createHighlighter({
          themes: ["vesper"],
          langs: SUPPORTED_CODE_EDITOR_LANGUAGES,
        });

        if (!isMounted) {
          return;
        }

        highlighterRef.current = highlighter;
      }

      setupHighlighter().catch((error) => {
        console.error("Failed to initialize syntax highlighter", error);
      });

      return () => {
        isMounted = false;
        highlighterRef.current?.dispose();
        highlighterRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (language !== AUTO_LANGUAGE_VALUE) {
        return;
      }

      const timeout = window.setTimeout(() => {
        const { language: inferredLanguage } = flourite(value, {
          heuristic: true,
          shiki: true,
        });
        const normalizedLanguage = normalizeDetectedLanguage(inferredLanguage);
        setDetectedLanguage(normalizedLanguage);
        onDetectedLanguageChange?.(normalizedLanguage);
      }, DETECT_DEBOUNCE_MS);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [language, onDetectedLanguageChange, value]);

    useEffect(() => {
      const timeout = window.setTimeout(() => {
        if (!highlighterRef.current || !value.trim()) {
          setHighlightedHtml("");
          return;
        }

        const html = highlighterRef.current.codeToHtml(value, {
          lang: activeLanguage,
          theme: "vesper",
        });
        setHighlightedHtml(html);
      }, RENDER_DEBOUNCE_MS);

      return () => {
        window.clearTimeout(timeout);
      };
    }, [activeLanguage, value]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
      if (event.key === "Tab") {
        event.preventDefault();
        const target = event.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const nextValue = `${value.slice(0, start)}  ${value.slice(end)}`;
        onValueChange(nextValue);

        window.requestAnimationFrame(() => {
          target.selectionStart = start + 2;
          target.selectionEnd = start + 2;
        });
      }

      props.onKeyDown?.(event);
    }

    function handleScroll(event: React.UIEvent<HTMLTextAreaElement>) {
      const { scrollLeft, scrollTop } = event.currentTarget;

      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }

      if (highlightedRef.current) {
        highlightedRef.current.scrollTop = scrollTop;
        highlightedRef.current.scrollLeft = scrollLeft;
      }

      props.onScroll?.(event);
    }

    return (
      <div className={root({ className })}>
        <div ref={lineNumbersRef} className={lineNumbers()}>
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={`line-${index + 1}`} style={{ minWidth: "1.5rem" }}>
              {index + 1}
            </span>
          ))}
        </div>

        <div className={editorLayer()}>
          <textarea
            {...props}
            ref={ref}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className={textarea()}
          />

          <div
            ref={highlightedRef}
            className={highlighted()}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki trusted output
            dangerouslySetInnerHTML={{
              __html:
                highlightedHtml ||
                `<pre class="shiki vesper" style="background-color:transparent"><code><span class="line">${value
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .split("\n")
                  .join('</span>\n<span class="line">')}</span></code></pre>`,
            }}
          />
        </div>
      </div>
    );
  },
);

CodeEditor.displayName = "CodeEditor";

export {
  AUTO_LANGUAGE_VALUE,
  CodeEditor,
  type CodeEditorLanguage,
  type CodeEditorProps,
  codeEditor,
  SUPPORTED_CODE_EDITOR_LANGUAGES,
};
