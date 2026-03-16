import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: "flex gap-2 px-4 py-2 font-mono text-[13px]",
  variants: {
    type: {
      removed: "bg-diff-removed-bg",
      added: "bg-diff-added-bg",
      context: "bg-transparent",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const diffPrefix = tv({
  base: "select-none",
  variants: {
    type: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

const diffCode = tv({
  base: "",
  variants: {
    type: {
      removed: "text-text-secondary",
      added: "text-text-primary",
      context: "text-text-secondary",
    },
  },
  defaultVariants: {
    type: "context",
  },
});

type DiffLineVariants = VariantProps<typeof diffLine>;

type DiffLineProps = ComponentProps<"div"> &
  DiffLineVariants & {
    code: string;
  };

const prefixMap = { removed: "-", added: "+", context: " " } as const;

const DiffLine = forwardRef<HTMLDivElement, DiffLineProps>(
  ({ className, type = "context", code, ...props }, ref) => {
    return (
      <div ref={ref} className={diffLine({ type, className })} {...props}>
        <span className={diffPrefix({ type })}>
          {prefixMap[type ?? "context"]}
        </span>
        <span className={diffCode({ type })}>{code}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";

export { DiffLine, type DiffLineProps, type DiffLineVariants, diffLine };
