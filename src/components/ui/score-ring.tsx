import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const SIZE = 180;
const RADIUS = (SIZE - 8) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

const scoreRing = tv({
  base: "relative size-[180px] font-mono",
});

type ScoreRingProps = ComponentProps<"div"> & {
  score: number;
  max?: number;
};

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, max = 10, ...props }, ref) => {
    const ratio = Math.min(score / max, 1);
    const offset = CIRCUMFERENCE * (1 - ratio);

    const scoreColor =
      score <= 3
        ? "text-accent-red"
        : score <= 6
          ? "text-accent-amber"
          : "text-accent-green";
    const gradientId =
      score <= 3
        ? "score-grad-red"
        : score <= 6
          ? "score-grad-amber"
          : "score-grad-green";

    return (
      <div ref={ref} className={scoreRing({ className })} {...props}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0"
          aria-label={`Score ${score.toFixed(1)} out of ${max}`}
          role="img"
        >
          <defs>
            <linearGradient id="score-grad-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-red)" />
              <stop offset="100%" stopColor="var(--color-accent-amber)" />
            </linearGradient>
            <linearGradient id="score-grad-amber" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-amber)" />
              <stop offset="100%" stopColor="var(--color-accent-green)" />
            </linearGradient>
            <linearGradient id="score-grad-green" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-green)" />
              <stop offset="100%" stopColor="var(--color-accent-cyan)" />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="var(--color-ring-track)"
            strokeWidth={4}
          />
          {/* Score arc */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={twMerge("text-5xl font-bold leading-none", scoreColor)}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-base text-text-tertiary">/{max}</span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing, type ScoreRingProps, scoreRing };
