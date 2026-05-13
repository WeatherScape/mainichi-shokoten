import type { Metadata } from "next";
import Link from "next/link";
import { GalleryHorizontal } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "まいにち小個展",
  description:
    "毎日ひとつのテーマを、好きな画材で描いて飾る小さなオンライン展覧会。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="sticky top-0 z-40 border-b border-line/70 bg-wall/88 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium tracking-normal text-ink"
            >
              <span className="grid h-8 w-8 place-items-center border border-line bg-paper text-sage shadow-paper">
                <GalleryHorizontal size={17} aria-hidden="true" />
              </span>
              <span>まいにち小個展</span>
            </Link>
            <div className="flex items-center gap-1 text-sm text-muted">
              <Link
                className="px-3 py-2 transition hover:text-ink"
                href="/me"
              >
                展示室
              </Link>
              <Link
                className="border border-line bg-wall px-3 py-2 text-ink shadow-paper transition hover:border-sage"
                href="/login"
              >
                はじめる
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
