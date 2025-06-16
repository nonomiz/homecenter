import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "예약 관리 시스템",
  description: "점포 예약 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
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
                  <a className="mr-6 flex items-center space-x-2" href="/">
                    <span className="font-bold">예약 시스템</span>
                  </a>
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <a
                      href="/store"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      점포
                    </a>
                    <a
                      href="/reservations"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      예약
                    </a>
                    <a
                      href="/admin"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      관리자
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
