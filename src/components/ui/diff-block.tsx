import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

const diffBlock = tv({
  base: "flex flex-col overflow-hidden border border-border-default bg-bg-input font-mono",
});

type DiffBlockProps = ComponentProps<"div"> & {
  fileName?: string;
};

const DiffBlock = forwardRef<HTMLDivElement, DiffBlockProps>(
  ({ className, fileName, children, ...props }, ref) => {
    return (
      <div ref={ref} className={diffBlock({ className })} {...props}>
        {fileName && (
          <div className="flex h-10 items-center border-b border-border-default px-4">
            <span className="text-xs font-medium text-text-secondary">
              {fileName}
            </span>
          </div>
        )}
        <div className="flex flex-col py-1">{children}</div>
      </div>
    );
  },
);

DiffBlock.displayName = "DiffBlock";

export { DiffBlock, type DiffBlockProps, diffBlock };
