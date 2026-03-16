"use client";

import { Switch } from "@base-ui/react/switch";
import { type ComponentProps, forwardRef } from "react";
import { tv } from "tailwind-variants";

const toggle = tv({
  base: "inline-flex cursor-pointer items-center gap-3 font-mono text-xs",
});

const toggleTrack = tv({
  base: "group flex h-[22px] w-10 items-center rounded-full p-[3px] transition-colors duration-150 data-[checked]:justify-end data-[unchecked]:justify-start data-[checked]:bg-accent-green data-[unchecked]:bg-track-off",
});

const toggleKnob = tv({
  base: "size-4 rounded-full transition-colors duration-150 data-[checked]:bg-bg-page data-[unchecked]:bg-knob-off",
});

type ToggleProps = Omit<ComponentProps<"label">, "children"> & {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const Toggle = forwardRef<HTMLLabelElement, ToggleProps>(
  (
    { className, label, checked, defaultChecked, onCheckedChange, ...props },
    ref,
  ) => {
    return (
      // biome-ignore lint/a11y/noLabelWithoutControl: Switch.Root renders a hidden input
      <label ref={ref} className={toggle({ className })} {...props}>
        <Switch.Root
          className={toggleTrack()}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
        >
          <Switch.Thumb className={toggleKnob()} />
        </Switch.Root>
        {label && (
          <span className="text-text-secondary group-data-[checked]:text-accent-green">
            {label}
          </span>
        )}
      </label>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle, type ToggleProps, toggle, toggleKnob, toggleTrack };
