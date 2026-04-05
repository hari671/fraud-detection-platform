import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FraudShield | Fraud Detection Dashboard",
  description: "Real-Time Fraud Detection and Risk Scoring Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100">
        <div className="min-h-full">
          <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
              <Link href="/" className="group inline-flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40">
                  FS
                </span>
                <span className="text-sm font-semibold tracking-wide text-slate-100 group-hover:text-cyan-300">
                  FraudShield
                </span>
              </Link>

              <nav className="flex items-center gap-2 text-sm">
                {[
                  { href: "/", label: "Home" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/predict", label: "Predict" },
                  { href: "/metrics", label: "Metrics" },
                  { href: "/risk-guide", label: "Risk Guide" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t border-slate-800 px-6 py-6 text-center text-sm text-slate-400 lg:px-8">
            FraudShield • Real-Time Fraud Detection and Risk Scoring Platform
          </footer>
        </div>
      </body>
    </html>
  );
}
