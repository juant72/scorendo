import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scorendo.com'),
  title: {
    default: "Scorendo — Dominate The Leaderboards",
    template: "%s | Scorendo",
  },
  description:
    "The ultimate skill-based multisport prediction arena. Outsmart your rivals, climb global rankings, and earn instant SOL rewards.",
  keywords: [
    "prediction",
    "football",
    "World Cup 2026",
    "Solana",
    "skill-based",
    "competition",
  ],
  openGraph: {
    title: "Scorendo — Dominate The Leaderboards",
    description: "Skill-based multisport prediction arena with instant SOL rewards.",
    type: "website",
    locale: "en_US",
    siteName: "Scorendo",
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Scorendo',
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scorendo — Dominate The Leaderboards",
    description: "Skill-based multisport prediction arena with instant SOL rewards.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col vignette" suppressHydrationWarning>
        <AppProviders>
          <Header />
          <main className="flex-1 overflow-x-hidden pt-12 pb-24 sm:pb-16">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </AppProviders>

        {/* Global SVG Assets for Jersey Engine */}
        <svg className="hidden">
           <defs>
              <pattern id="jersey-mesh" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                 <circle cx="1" cy="1" r="0.5" fill="white" opacity="0.1" />
                 <circle cx="3" cy="3" r="0.5" fill="white" opacity="0.1" />
              </pattern>
              <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                 <stop offset="50%" stopColor="white" stopOpacity="0" />
                 <stop offset="100%" stopColor="white" stopOpacity="0.2" />
              </linearGradient>
           </defs>
        </svg>
      </body>
    </html>
  );
}
