"use client";

import {
  type ComponentProps,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { tv } from "tailwind-variants";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGES } from "@/lib/languages";

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

const RENDER_DEBOUNCE_MS = 120;
const AUTO_LANGUAGE_VALUE = "auto";

type CodeEditorLanguage = string | typeof AUTO_LANGUAGE_VALUE;

type CodeEditorProps = Omit<
  ComponentProps<"textarea">,
  "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  language?: CodeEditorLanguage;
  onDetectedLanguageChange?: (language: string) => void;
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
    const [highlightedHtml, setHighlightedHtml] = useState("");
    const lineNumbersRef = useRef<HTMLDivElement | null>(null);
    const highlightedRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { highlight, isLoading, ensureLanguageLoaded } =
      useShikiHighlighter();
    const { detectedLanguage } = useLanguageDetection(
      language === AUTO_LANGUAGE_VALUE ? value : "",
    );

    const { root, lineNumbers, editorLayer, textarea, highlighted } =
      codeEditor();

    const activeLanguage =
      language === AUTO_LANGUAGE_VALUE
        ? (detectedLanguage ?? "typescript")
        : language;

    const lineCount = Math.max(value.split("\n").length, 16);

    useEffect(() => {
      if (language === AUTO_LANGUAGE_VALUE && detectedLanguage) {
        onDetectedLanguageChange?.(detectedLanguage);
      }
    }, [detectedLanguage, language, onDetectedLanguageChange]);

    useEffect(() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (isLoading || !value.trim()) {
          setHighlightedHtml("");
          return;
        }

        ensureLanguageLoaded(activeLanguage).then(() => {
          const html = highlight(value, activeLanguage);
          setHighlightedHtml(html);
        });
      }, RENDER_DEBOUNCE_MS);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [activeLanguage, ensureLanguageLoaded, highlight, isLoading, value]);

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

    function escapeHtml(text: string): string {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
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
                `<pre class="shiki vesper" style="background-color:transparent"><code><span class="line">${escapeHtml(
                  value,
                )
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
};
