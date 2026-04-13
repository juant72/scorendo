import Link from 'next/link';
import { Trophy, Bird, GitBranch, Flame, Zap } from 'lucide-react';

const SPORTS_LINKS = [
  { slug: 'football', emoji: '⚽', name: 'Football' },
  { slug: 'motorsports', emoji: '🏎️', name: 'F1 / Motorsports' },
  { slug: 'nba', emoji: '🏀', name: 'NBA Basketball' },
  { slug: 'rugby', emoji: '🏉', name: 'Rugby' },
];

const PLATFORM_LINKS = [
  { href: '/matches', label: 'Live Matches' },
  { href: '/contests', label: 'All Arenas' },
  { href: '/ranking', label: 'Leaderboard' },
  { href: '/dashboard', label: 'My Dashboard' },
];

const LEGAL_LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight to-[#03080f]" />
      <div className="absolute inset-0 bg-pitch-lines opacity-10" />
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* ── Brand Column ── */}
            <div className="md:col-span-4 space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 border border-primary/20 transition-all">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-primary">Score</span>
                  <span className="text-white">ndo</span>
                </span>
              </Link>

              <p className="text-sm text-white/30 max-w-xs leading-relaxed">
                The premier skill-based multisport prediction arena. Predict outcomes across 8 sports and earn SOL prizes — pure intelligence, zero luck.
              </p>

              {/* Sport pills */}
              <div className="flex flex-wrap gap-2">
                {SPORTS_LINKS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/contests?sport=${s.slug}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/8 text-white/30 hover:text-primary hover:border-primary/20 transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span>{s.emoji}</span>
                    {s.name}
                  </Link>
                ))}
              </div>

              {/* Social */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 text-white/30 hover:text-primary hover:border-primary/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  aria-label="Twitter/X"
                >
                  <Bird className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 text-white/30 hover:text-primary hover:border-primary/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  aria-label="GitHub"
                >
                  <GitBranch className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block md:col-span-1" />

            {/* ── Platform Links ── */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-2">
                <Flame className="w-3 h-3 text-match" />
                Platform
              </h4>
              <ul className="space-y-3">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/30 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Legal Links ── */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" />
                Legal & Help
              </h4>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/30 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Newsletter / Solana Badge ── */}
            <div className="md:col-span-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5">
                Stay on Top
              </h4>
              <p className="text-xs text-white/25 mb-4 leading-relaxed">
                Get notified when new tournament arenas open. No spam, just game-changing signals.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@wallet.sol"
                  className="flex-1 min-w-0 h-10 px-4 rounded-xl text-xs bg-white/5 border border-white/8 text-white/50 placeholder:text-white/20 focus:outline-none focus:border-primary/30 focus:bg-white/7 transition-all"
                />
                <button className="h-10 px-4 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-midnight text-xs font-black transition-all whitespace-nowrap">
                  Join →
                </button>
              </div>

              {/* Solana badge */}
              <div className="mt-5 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 w-fit"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-sm">⚡</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30">
                  Powered by Solana
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Legal Disclaimer ── */}
        <div className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-[9px] leading-relaxed text-white/20 italic text-center max-w-4xl mx-auto">
              <strong className="text-white/30">LEGAL NOTICE:</strong> Scorendo is an independent, skill-based sports prediction platform.
              This application is <strong className="text-white/30">NOT affiliated with, sponsored by, nor endorsed by</strong> any official sports league
              (including but not limited to FIFA, UEFA, AFA, La Liga, FIA, or the NBA), nor any individual professional sports club or athlete.
              All team names, competition names, and match data are used for{' '}
              <strong className="text-white/30">informational and identification purposes only</strong> (Nominative Fair Use).
              Users must be of legal age and reside in a jurisdiction where skill-based gaming is permitted.
            </p>
          </div>
        </div>

        {/* ── Copyright Bar ── */}
        <div className="border-t border-white/3">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-white/20 font-medium">
              © {new Date().getFullYear()} Scorendo Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[10px] text-white/15 font-bold uppercase tracking-widest">
              <span>8 Sports</span>
              <span>·</span>
              <span>World-Class Arenas</span>
              <span>·</span>
              <span>Solana Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
