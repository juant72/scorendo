import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
  title: {
    default: "Scorendo — Predict. Compete. Win.",
    template: "%s | Scorendo",
  },
  description:
    "Skill-based prediction competition platform for the World Cup 2026. Use your football knowledge to compete and win SOL prizes.",
  keywords: [
    "prediction",
    "football",
    "World Cup 2026",
    "Solana",
    "skill-based",
    "competition",
  ],
  openGraph: {
    title: "Scorendo — Predict. Compete. Win.",
    description: "Skill-based prediction competition for the World Cup 2026.",
    type: "website",
    locale: "en_US",
    siteName: "Scorendo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scorendo — Predict. Compete. Win.",
    description: "Skill-based prediction competition for the World Cup 2026.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProviders>
          <Header />
          <main className="flex-1 overflow-x-hidden pt-12 pb-16">
            {children}
          </main>
          <Footer />
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
