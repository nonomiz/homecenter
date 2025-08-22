import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "GC Homecenter",
  description: "店舗予約管理システム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          notoSansJP.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed right-4 top-4" style={{ zIndex: 1000 }}>
            <ThemeToggle />
          </div>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                  <nav className="flex items-center space-x-6 text-sm font-medium p-3">
                    <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/">
                      <span>予約</span>
                    </Link>
                    <Link
                      href="/store/reservations"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      店舗
                    </Link>
                    <Link
                      href="/admin/stores"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      管理者
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">
              {/* 빌드 에러 대응 */}
              <Suspense>{children}</Suspense>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
