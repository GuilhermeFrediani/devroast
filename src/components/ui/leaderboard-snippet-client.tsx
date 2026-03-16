"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronDown } from "lucide-react";
import { type ComponentProps, forwardRef, useState } from "react";
import { tv } from "tailwind-variants";

const leaderboardSnippetClient = tv({
  slots: {
    root: "flex flex-col",
    trigger:
      "group flex w-full items-center justify-between gap-3 border-t border-border-default px-4 py-2 text-xs text-text-tertiary transition-colors hover:text-text-secondary",
    triggerLabel: "inline-flex items-center gap-2",
    previewWrapper: "px-4 pb-4",
    preview:
      "relative overflow-hidden rounded-sm border border-border-default bg-bg-input",
    previewCollapsed: "max-h-[160px]",
    previewExpanded: "max-h-none",
    fade: "pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-bg-page via-bg-page/85 to-transparent",
    icon: "size-4 transition-transform duration-200",
    iconOpen: "rotate-180",
  },
});

type LeaderboardSnippetClientProps = ComponentProps<"div"> & {
  preview: React.ReactNode;
  collapsedHeightClassName?: string;
};

const LeaderboardSnippetClient = forwardRef<
  HTMLDivElement,
  LeaderboardSnippetClientProps
>(({ preview, collapsedHeightClassName, className, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const {
    root,
    trigger,
    triggerLabel,
    previewWrapper,
    preview: previewStyles,
    previewCollapsed,
    previewExpanded,
    fade,
    icon,
    iconOpen,
  } = leaderboardSnippetClient();

  return (
    <Collapsible.Root
      ref={ref}
      open={open}
      onOpenChange={setOpen}
      className={root({ className })}
      {...props}
    >
      <div className={previewWrapper()}>
        <div
          className={previewStyles({
            className: open
              ? previewExpanded()
              : `${previewCollapsed()} ${collapsedHeightClassName ?? ""}`,
          })}
        >
          {preview}
          {!open && <div className={fade()} />}
        </div>
      </div>

      <Collapsible.Trigger className={trigger()}>
        <span className={triggerLabel()}>
          <span>{open ? "show less" : "show more"}</span>
        </span>
        <ChevronDown className={icon({ className: open ? iconOpen() : "" })} />
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
});

LeaderboardSnippetClient.displayName = "LeaderboardSnippetClient";

export {
  LeaderboardSnippetClient,
  type LeaderboardSnippetClientProps,
  leaderboardSnippetClient,
};
