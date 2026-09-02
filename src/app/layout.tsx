import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blockchain Trust Enterprise — Institutional Markets Workspace",
  description: "A premium institutional markets workspace for portfolio intelligence, global watchlists, and paper trading.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
