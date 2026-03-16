"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

const VISIBLE_LINES = 16;

function CodeEditor() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);

  const lineCount = Math.max(code.split("\n").length, VISIBLE_LINES);

  return (
    <>
      {/* Code editor */}
      <div className="flex w-full max-w-[780px] flex-col overflow-hidden border border-border-default bg-bg-input">
        {/* Window header with traffic lights */}
        <div className="flex h-10 items-center gap-2 border-b border-border-default px-4">
          <span className="size-3 rounded-full bg-accent-red" />
          <span className="size-3 rounded-full bg-accent-amber" />
          <span className="size-3 rounded-full bg-accent-green" />
        </div>

        {/* Code area */}
        <div className="flex h-[320px]">
          {/* Line numbers */}
          <div className="flex flex-col gap-2 border-r border-border-default bg-bg-surface px-3 py-4">
            {Array.from({ length: lineCount }, (_, i) => (
              <span
                key={i}
                className="text-right text-xs leading-snug text-text-tertiary"
                style={{ minWidth: "1.5rem" }}
              >
                {i + 1}
              </span>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// paste your code here..."
            spellCheck={false}
            className="flex-1 resize-none bg-transparent p-4 text-xs leading-snug text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
      </div>

      {/* Actions bar */}
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
