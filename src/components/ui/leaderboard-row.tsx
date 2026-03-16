import { type ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const leaderboardRowRoot = tv({
  base: "flex items-center gap-6 border-b border-border-default px-5 py-4 font-mono",
});

type LeaderboardRowRootProps = ComponentProps<"div">;

const LeaderboardRowRoot = forwardRef<HTMLDivElement, LeaderboardRowRootProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={leaderboardRowRoot({ className })} {...props} />
    );
  },
);

LeaderboardRowRoot.displayName = "LeaderboardRowRoot";

const leaderboardRowRank = tv({
  base: "w-10 text-[13px] text-text-tertiary",
});

type LeaderboardRowRankProps = ComponentProps<"span">;

const LeaderboardRowRank = forwardRef<HTMLSpanElement, LeaderboardRowRankProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={leaderboardRowRank({ className })}
        {...props}
      />
    );
  },
);

LeaderboardRowRank.displayName = "LeaderboardRowRank";

const leaderboardRowScore = tv({
  base: "w-15 text-[13px] font-bold",
});

function getScoreColor(score: number): string {
  if (score <= 3) return "text-accent-red";
  if (score <= 6) return "text-accent-amber";
  return "text-accent-green";
}

type LeaderboardRowScoreProps = ComponentProps<"span"> & {
  score: number;
};

const LeaderboardRowScore = forwardRef<
  HTMLSpanElement,
  LeaderboardRowScoreProps
>(({ className, score, children, ...props }, ref) => {
  const scoreColor = getScoreColor(score);

  return (
    <span
      ref={ref}
      className={twMerge(leaderboardRowScore({ className }), scoreColor)}
      {...props}
    >
      {children ?? score.toFixed(1)}
    </span>
  );
});

LeaderboardRowScore.displayName = "LeaderboardRowScore";

const leaderboardRowCode = tv({
  base: "flex-1 truncate text-xs text-text-secondary",
});

type LeaderboardRowCodeProps = ComponentProps<"span">;

const LeaderboardRowCode = forwardRef<HTMLSpanElement, LeaderboardRowCodeProps>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={leaderboardRowCode({ className })}
        {...props}
      />
    );
  },
);

LeaderboardRowCode.displayName = "LeaderboardRowCode";

const leaderboardRowLanguage = tv({
  base: "w-25 text-right text-xs text-text-tertiary",
});

type LeaderboardRowLanguageProps = ComponentProps<"span">;

const LeaderboardRowLanguage = forwardRef<
  HTMLSpanElement,
  LeaderboardRowLanguageProps
>(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={leaderboardRowLanguage({ className })}
      {...props}
    />
  );
});

LeaderboardRowLanguage.displayName = "LeaderboardRowLanguage";

export {
  getScoreColor,
  LeaderboardRowCode,
  type LeaderboardRowCodeProps,
  LeaderboardRowLanguage,
  type LeaderboardRowLanguageProps,
  LeaderboardRowRank,
  type LeaderboardRowRankProps,
  LeaderboardRowRoot,
  type LeaderboardRowRootProps,
  LeaderboardRowScore,
  type LeaderboardRowScoreProps,
  leaderboardRowCode,
  leaderboardRowLanguage,
  leaderboardRowRank,
  leaderboardRowRoot,
  leaderboardRowScore,
};
