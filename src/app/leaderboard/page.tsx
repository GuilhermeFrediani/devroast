import type { Metadata } from "next";
import { LeaderboardContent } from "./leaderboard-content";

export const metadata: Metadata = {
  title: "Leaderboard | DevRoast",
  description: "Shame leaderboard with the most roasted code submissions.",
};

export default async function LeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-20 pt-10 pb-16">
      <LeaderboardContent />
    </main>
  );
}
