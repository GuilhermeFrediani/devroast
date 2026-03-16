import { type ComponentProps, forwardRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center justify-center gap-2",
    "font-mono cursor-pointer",
    "transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      primary: [
        "bg-accent-green text-bg-page",
        "font-medium text-[13px]",
        "enabled:hover:bg-accent-green-hover",
        "enabled:active:bg-accent-green-active",
      ],
      secondary: [
        "bg-transparent text-text-primary",
        "border border-border-default",
        "text-xs font-normal",
        "enabled:hover:bg-bg-hover",
        "enabled:active:bg-bg-active",
      ],
      ghost: [
        "bg-transparent text-text-muted",
        "border border-border-default",
        "text-xs font-normal",
        "enabled:hover:text-text-bright enabled:hover:bg-bg-hover",
        "enabled:active:bg-bg-active",
      ],
      danger: [
        "bg-accent-red text-bg-page",
        "font-medium text-[13px]",
        "enabled:hover:bg-accent-red-hover",
        "enabled:active:bg-accent-red-active",
      ],
    },
    size: {
      sm: "px-3 py-1.5",
      md: "px-6 py-2.5",
      lg: "px-8 py-3",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof button>;

type ButtonProps = ComponentProps<"button"> & ButtonVariants;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={button({ variant, size, className })}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, type ButtonProps, type ButtonVariants, button };
