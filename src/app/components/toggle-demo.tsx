"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

function ToggleDemo() {
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-8">
      <Toggle
        label="roast mode"
        checked={toggleOn}
        onCheckedChange={setToggleOn}
      />
      <Toggle
        label="roast mode"
        checked={toggleOff}
        onCheckedChange={setToggleOff}
      />
    </div>
  );
}

export { ToggleDemo };
