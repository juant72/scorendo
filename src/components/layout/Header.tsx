'use client';

import Link from 'next/link';
import { Trophy, Menu, X } from 'lucide-react';
import { useState, Suspense } from 'react';
import { AuthButton } from '@/components/auth/AuthButton';
import { useAuthStore } from '@/store/useAuthStore';
import { LanguageSelector } from './LanguageSelector';
import { locales } from '@/lib/locales';
import { SportDropdown } from './SportDropdown';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, locale } = useAuthStore();
  const t = locales[locale].nav;

  const navLinks = [
    { href: '/matches', label: t.matches },
    { href: '/contests', label: t.contests },
    { href: '/ranking', label: t.rankings },
    { href: '/how-it-works', label: t.howItWorks },
  ];

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Sport Selector */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden xs:block">
                <span className="text-gradient-pitch">Score</span>
                <span className="text-foreground">ndo</span>
              </span>
            </Link>

            <div className="h-6 w-px bg-white/10 hidden sm:block mx-2" />

            <Suspense fallback={<div className="w-10 h-10 bg-white/5 animate-pulse rounded-xl" />}>
              <SportDropdown />
            </Suspense>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-md hover:bg-primary/5"
              >
                {t.dashboard}
              </Link>
            )}
          </nav>

          {/* Wallet + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <AuthButton />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-border/50 mt-2 pt-4 space-y-1">
            <div className="px-3 pb-3 sm:hidden">
              <LanguageSelector />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-primary rounded-md hover:bg-primary/5"
              >
                {t.dashboard}
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
