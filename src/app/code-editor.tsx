"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  AUTO_LANGUAGE_VALUE,
  CodeEditor as CodeEditorField,
  type CodeEditorLanguage,
} from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";
import { LANGUAGE_OPTIONS } from "@/lib/languages";
import { useTRPC } from "@/trpc/client";

function CodeEditor() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] =
    useState<CodeEditorLanguage>(AUTO_LANGUAGE_VALUE);
  const [detectedLanguage, setDetectedLanguage] = useState("typescript");

  const MAX_CHARACTERS = 2000;
  const isOverLimit = code.length > MAX_CHARACTERS;
  const canSubmit = !isOverLimit && !!code.trim();

  const submitCodeMutation = useMutation(
    trpc.roast.create.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.roast.getStats.queryFilter());
        router.push(`/roast/${result.id}`);
      },
    }),
  );

  const displayLanguage = useMemo(() => {
    if (selectedLanguage === AUTO_LANGUAGE_VALUE) {
      return `auto (${detectedLanguage})`;
    }

    return selectedLanguage;
  }, [detectedLanguage, selectedLanguage]);

  function getSubmissionLanguage() {
    if (selectedLanguage !== AUTO_LANGUAGE_VALUE) {
      return selectedLanguage;
    }

    return detectedLanguage;
  }

  async function handleRoastSubmit() {
    if (!canSubmit || submitCodeMutation.isPending) {
      return;
    }

    await submitCodeMutation.mutateAsync({
      code,
      language: getSubmissionLanguage(),
      roastMode,
    });
  }

  return (
    <>
      <div className="flex w-full max-w-[780px] flex-col overflow-hidden border border-border-default bg-bg-input">
        <div className="flex h-10 items-center justify-between border-b border-border-default px-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-accent-red" />
            <span className="size-3 rounded-full bg-accent-amber" />
            <span className="size-3 rounded-full bg-accent-green" />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wide text-text-tertiary">
              lang
            </span>
            <label className="sr-only" htmlFor="editor-language">
              select language
            </label>
            <div className="relative flex items-center gap-1">
              <select
                id="editor-language"
                className="appearance-none bg-transparent pr-5 text-xs text-text-secondary outline-none transition-colors hover:text-text-primary"
                value={selectedLanguage}
                onChange={(event) => {
                  setSelectedLanguage(event.target.value as CodeEditorLanguage);
                }}
              >
                <option
                  value={AUTO_LANGUAGE_VALUE}
                  className="bg-bg-input text-text-primary"
                >
                  automatic
                </option>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="bg-bg-input text-text-primary"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 size-3 text-text-tertiary" />
            </div>
            <span className="text-xs text-text-tertiary">
              {displayLanguage}
            </span>
          </div>
          <Button
            variant="primary"
            size="md"
            disabled={!canSubmit || submitCodeMutation.isPending}
            onClick={handleRoastSubmit}
          >
            {submitCodeMutation.isPending ? "$ roasting..." : "$ roast_my_code"}
          </Button>
        </div>

        <CodeEditorField
          value={code}
          onValueChange={setCode}
          language={selectedLanguage}
          onDetectedLanguageChange={(language) => {
            setDetectedLanguage(language);
          }}
          placeholder="// paste your code here..."
          aria-label="Code input"
        />
        <div className="flex justify-end border-t border-border-default bg-bg-surface px-4 py-2">
          <span
            className={twMerge(
              "font-mono text-[10px]",
              isOverLimit ? "text-accent-red" : "text-text-tertiary",
            )}
          >
            {code.length} / {MAX_CHARACTERS}
          </span>
        </div>
      </div>

      <div className="flex w-full max-w-[780px] items-center justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            label="roast mode"
            checked={roastMode}
            onCheckedChange={setRoastMode}
          />
          <span className="text-xs text-text-tertiary">
            {"// maximum sarcasm enabled"}
          </span>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={!canSubmit || submitCodeMutation.isPending}
          onClick={handleRoastSubmit}
        >
          {submitCodeMutation.isPending ? "$ roasting..." : "$ roast_my_code"}
        </Button>
      </div>
    </>
  );
}

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
