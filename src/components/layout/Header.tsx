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
    <header className="sticky top-0 z-50 bg-[#020814]/90 border-b border-white/5 backdrop-blur-2xl">
      <div className="flex h-[4.5rem] items-center justify-between px-4 sm:px-8">
        
        {/* Left Side: Brand & Main Navigation Tabs */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/10 to-transparent border border-primary/20 shadow-[0_0_15px_rgba(0,230,118,0.15)] group-hover:shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-all">
              <Trophy className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase hidden sm:block drop-shadow-md">
              Score<span className="text-primary">ndo</span>
            </span>
          </Link>

          {/* Desktop Nav Tabs (Esports Style) */}
          <nav className="hidden lg:flex items-center gap-2 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 h-[4.5rem] flex items-center justify-center group"
              >
                 <span className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors z-10">{link.label}</span>
                 {/* Gaming active tab hover effect */}
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left shadow-[0_-5px_15px_rgba(0,230,118,0.5)]" />
                 <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>
        </div>
          
        {/* Right Side: Player Hub & Ecosystem Context */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          <Suspense fallback={<div className="w-10 h-10 bg-white/5 animate-pulse rounded-xl" />}>
             <SportDropdown />
          </Suspense>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {/* Player XP / Quick Status (Fake Gamification Block for AAA feel) */}
          {isAuthenticated && (
            <div className="hidden xl:flex items-center gap-3 bg-[#060D1A] border border-white/5 pl-3 pr-4 h-10 rounded-xl shadow-inner">
               <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/20 text-primary text-[10px] font-black">42</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-primary shadow-[0_0_5px_rgba(0,230,118,0.8)] w-[65%]" />
                  </div>
               </div>
               <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Top 5%</span>
            </div>
          )}

          {isAuthenticated ? (
            <Link
               href="/dashboard"
               className="group flex items-center justify-center h-10 px-4 bg-primary text-midnight hover:bg-primary/90 font-black text-xs uppercase tracking-widest transition-all rounded-xl shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:shadow-[0_0_25px_rgba(0,230,118,0.6)]"
            >
               Locker Room
            </Link>
          ) : (
             <div className="hover:scale-105 transition-transform"><AuthButton /></div>
          )}

          {/* Sub Controls / Language / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-white/50 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
