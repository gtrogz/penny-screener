import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasdaq Penny Stock Screener",
  description: "Nasdaq listed penny stocks under $5 — live screener powered by Yahoo Finance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-zinc-200">{children}</body>
    </html>
  );
}
