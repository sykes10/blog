import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Frontend Blueprints",
    template: "%s | Frontend Blueprints",
  },
  description:
    "Production-grade mental models for frontend engineers — UX, architecture, state management, accessibility, and engineering trade-offs.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required because next-themes sets a class/data-theme
    // attribute on <html> before React hydrates, causing a mismatch Next.js would
    // otherwise warn about. This is the documented, intentional pattern.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-(--background) text-(--foreground) antialiased">
        {/* next-themes injects the blocking localStorage-read script automatically.
            Do NOT hand-roll this script — next-themes handles it correctly. */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-40 border-b border-(--border) bg-(--background)/90 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <a
                href="/"
                className="font-display text-lg font-semibold tracking-tight text-(--foreground) hover:text-accent"
              >
                Frontend Blueprints
              </a>
              <nav className="flex items-center gap-4">
                <a
                  href="/patterns"
                  className="text-sm font-medium text-(--muted) hover:text-(--foreground) transition-colors"
                >
                  Patterns
                </a>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-(--border) py-6">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-(--muted)">
                Frontend Blueprints — production-grade mental models for frontend engineers
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
