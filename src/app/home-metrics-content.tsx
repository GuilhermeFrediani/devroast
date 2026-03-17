"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

const HOUR_IN_MS = 60 * 60 * 1000;

export function HomeMetricsContent() {
  const trpc = useTRPC();
  const { data } = useQuery(
    trpc.roast.getStats.queryOptions(undefined, { staleTime: HOUR_IN_MS }),
  );

  const [totalRoasts, setTotalRoasts] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    if (!data) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setTotalRoasts(data.totalRoasts);
      setAvgScore(data.avgScore);
    });

    return () => cancelAnimationFrame(frame);
  }, [data]);

  return (
    <div className="flex items-center justify-center gap-6 text-xs text-text-tertiary">
      <span className="flex items-center gap-1">
        <NumberFlow
          value={totalRoasts}
          format={{ useGrouping: true }}
          className="font-mono text-text-secondary tabular-nums"
        />
        <span>codes roasted</span>
      </span>

      <span>&middot;</span>

      <span className="flex items-center gap-1">
        <span>avg score:</span>
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-mono text-text-secondary tabular-nums"
        />
        <span>/10</span>
      </span>
    </div>
  );
}
