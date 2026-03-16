"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

export function HomeMetricsContent() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.metrics.summary.queryOptions());

  const [roastedCodes, setRoastedCodes] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setRoastedCodes(data.roastedCodes);
      setAverageScore(data.averageScore);
    });

    return () => cancelAnimationFrame(frame);
  }, [data]);

  return (
    <div className="flex items-center justify-center gap-6 text-xs text-text-tertiary">
      <span className="flex items-center gap-1">
        <NumberFlow
          value={roastedCodes}
          format={{ useGrouping: true }}
          className="font-mono text-text-secondary tabular-nums"
        />
        <span>codes roasted</span>
      </span>

      <span>&middot;</span>

      <span className="flex items-center gap-1">
        <span>avg score:</span>
        <NumberFlow
          value={averageScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-mono text-text-secondary tabular-nums"
        />
        <span>/10</span>
      </span>
    </div>
  );
}
