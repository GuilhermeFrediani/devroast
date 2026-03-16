import { type ComponentProps, forwardRef } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { tv } from "tailwind-variants";

const codeBlock = tv({
  base: "flex overflow-hidden border border-border-default bg-bg-input font-mono",
});

const codeBlockHeader = tv({
  base: "flex h-10 items-center gap-3 border-b border-border-default px-4",
});

type CodeBlockProps = {
  code: string;
  lang?: BundledLanguage;
  className?: string;
};

type CodeBlockHeaderProps = ComponentProps<"div"> & {
  fileName?: string;
};

const CodeBlockHeader = forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ className, fileName, ...props }, ref) => {
    return (
      <div ref={ref} className={codeBlockHeader({ className })} {...props}>
        <span className="size-2.5 rounded-full bg-accent-red" />
        <span className="size-2.5 rounded-full bg-accent-amber" />
        <span className="size-2.5 rounded-full bg-accent-green" />
        <span className="flex-1" />
        {fileName && (
          <span className="text-xs text-text-tertiary">{fileName}</span>
        )}
      </div>
    );
  },
);

async function CodeBlock({
  code,
  lang = "javascript",
  className,
}: CodeBlockProps) {
  "use cache";

  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  const lines = code.split("\n");

  return (
    <div className={codeBlock({ className })}>
      <div className="flex">
        <div className="flex flex-col gap-1.5 border-r border-border-default bg-gutter px-2.5 py-3">
          {lines.map((_, i) => (
            <span
              key={i}
              className="text-right text-[13px] leading-snug text-text-tertiary"
            >
              {i + 1}
            </span>
          ))}
        </div>
        <div
          className="flex-1 overflow-x-auto [&_code]:flex [&_code]:flex-col [&_code]:gap-1.5 [&_pre]:bg-transparent [&_pre]:p-3 [&_.line]:text-[13px] [&_.line]:leading-snug"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates trusted HTML server-side
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";
CodeBlockHeader.displayName = "CodeBlockHeader";

export {
  CodeBlock,
  CodeBlockHeader,
  type CodeBlockHeaderProps,
  type CodeBlockProps,
  codeBlock,
  codeBlockHeader,
};
