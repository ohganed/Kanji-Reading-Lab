import type { Metadata } from "next";
import "./globals.css";
import "./kanji-structure.css";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/Kanji-Reading-Lab" : "";

export const metadata: Metadata = {
  title: "Kanji Reading Lab",
  description: "日本語学習者のための、忘却と復習を前提にしたふりがなリーディングアプリ。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
