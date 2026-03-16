import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevRoast",
  description: "DevRoast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={jetbrainsMono.variable}>
      <body className="min-h-screen bg-bg-page font-mono text-text-primary">
        <TRPCReactProvider>
          <Navbar>
            <Link
              href="/leaderboard"
              className="text-[13px] text-text-secondary transition-colors hover:text-text-primary"
            >
              leaderboard
            </Link>
          </Navbar>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
