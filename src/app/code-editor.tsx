"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AUTO_LANGUAGE_VALUE,
  CodeEditor as CodeEditorField,
  type CodeEditorLanguage,
  SUPPORTED_CODE_EDITOR_LANGUAGES,
} from "@/components/ui/code-editor";
import { Toggle } from "@/components/ui/toggle";

function CodeEditor() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] =
    useState<CodeEditorLanguage>(AUTO_LANGUAGE_VALUE);
  const [detectedLanguage, setDetectedLanguage] = useState("typescript");

  const displayLanguage = useMemo(() => {
    if (selectedLanguage === AUTO_LANGUAGE_VALUE) {
      return `auto (${detectedLanguage})`;
    }

    return selectedLanguage;
  }, [detectedLanguage, selectedLanguage]);

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
                <option value={AUTO_LANGUAGE_VALUE} className="bg-bg-input text-text-primary">
                  automatic
                </option>
                {SUPPORTED_CODE_EDITOR_LANGUAGES.map((language) => (
                  <option
                    key={language}
                    value={language}
                    className="bg-bg-input text-text-primary"
                  >
                    {language}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 size-3 text-text-tertiary" />
            </div>
            <span className="text-xs text-text-tertiary">
              {displayLanguage}
            </span>
          </div>
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

        <Button variant="primary" size="md">
          $ roast_my_code
        </Button>
      </div>
    </>
  );
}

CodeEditor.displayName = "CodeEditor";

export { CodeEditor };
