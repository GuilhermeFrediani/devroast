import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

const sectionTitle = tv({
  base: "flex items-center gap-2 font-mono",
});

type SectionTitleProps = ComponentProps<"div"> & {
  label: string;
};

const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div ref={ref} className={sectionTitle({ className })} {...props}>
        <span className="text-sm font-bold text-accent-green">{"// "}</span>
        <h2 className="text-sm font-bold text-text-primary">{label}</h2>
      </div>
    );
  },
);

SectionTitle.displayName = "SectionTitle";

export { SectionTitle, type SectionTitleProps, sectionTitle };
