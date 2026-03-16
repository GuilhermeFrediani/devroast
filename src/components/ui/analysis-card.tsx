import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

const analysisCardRoot = tv({
  base: "flex flex-col gap-3 border border-border-default p-5 font-mono",
});

type AnalysisCardRootProps = ComponentProps<"div">;

const AnalysisCardRoot = forwardRef<HTMLDivElement, AnalysisCardRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={analysisCardRoot({ className })} {...props} />
    );
  },
);

AnalysisCardRoot.displayName = "AnalysisCardRoot";

const analysisCardTitle = tv({
  base: "text-[13px] text-text-primary",
});

type AnalysisCardTitleProps = ComponentProps<"span">;

const AnalysisCardTitle = forwardRef<HTMLSpanElement, AnalysisCardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <span ref={ref} className={analysisCardTitle({ className })} {...props} />
    );
  },
);

AnalysisCardTitle.displayName = "AnalysisCardTitle";

const analysisCardDescription = tv({
  base: "text-xs leading-6 text-text-secondary",
});

type AnalysisCardDescriptionProps = ComponentProps<"p">;

const AnalysisCardDescription = forwardRef<
  HTMLParagraphElement,
  AnalysisCardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={analysisCardDescription({ className })}
      {...props}
    />
  );
});

AnalysisCardDescription.displayName = "AnalysisCardDescription";

export {
  AnalysisCardDescription,
  type AnalysisCardDescriptionProps,
  AnalysisCardRoot,
  type AnalysisCardRootProps,
  AnalysisCardTitle,
  type AnalysisCardTitleProps,
  analysisCardDescription,
  analysisCardRoot,
  analysisCardTitle,
};
