import { type ComponentProps, forwardRef, type ReactNode } from "react";
import { tv } from "tailwind-variants";

const navbar = tv({
  base: "flex h-14 items-center border-b border-border-default bg-bg-page px-10 font-mono",
});

type NavbarProps = ComponentProps<"nav"> & {
  children?: ReactNode;
};

const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <nav ref={ref} className={navbar({ className })} {...props}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-accent-green">{">"}</span>
          <span className="text-lg font-medium text-text-primary">
            devroast
          </span>
        </div>
        <span className="flex-1" />
        {children}
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";

export { Navbar, type NavbarProps, navbar };
