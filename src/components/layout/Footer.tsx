import Link from 'next/link';
import { Trophy, Bird, GitBranch, Flame, Zap, ShieldCheck } from 'lucide-react';

const SPORTS_LINKS = [
  { slug: 'football', emoji: '⚽', name: 'Football' },
  { slug: 'motorsports', emoji: '🏎️', name: 'Formula 1' },
  { slug: 'nba', emoji: '🏀', name: 'NBA' },
  { slug: 'rugby', emoji: '🏉', name: 'Rugby' },
];

const PLATFORM_LINKS = [
  { href: '/contests', label: 'Tactical Arenas' },
  { href: '/ranking', label: 'Global Standing' },
  { href: '/dashboard', label: 'Command HQ' },
];

const LEGAL_LINKS = [
  { href: '/fair-play', label: 'Protocol & Skill' },
  { href: '/terms', label: 'Terms of Engagement' },
  { href: '/privacy', label: 'Data Privacy' },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-60 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020814] to-[#01050a]" />
      
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

            {/* ── Brand Column ── */}
            <div className="md:col-span-4 space-y-8">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 border border-primary/20 transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <span className="text-3xl font-black tracking-tighter uppercase italic">
                   <span className="text-primary">Score</span>
                   <span className="text-white">ndo</span>
                </span>
              </Link>

              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/30 max-w-xs leading-relaxed">
                The ultimate competitive multisport arena. Pure tactical intelligence, deterministic outcomes, and instant rewards.
              </p>

              {/* Sport pills */}
              <div className="flex flex-wrap gap-2">
                {SPORTS_LINKS.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/contests?sport=${s.slug}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 text-white/20 hover:text-primary hover:border-primary/20 transition-all bg-white/[0.02]"
                  >
                    <span>{s.emoji}</span>
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Hub ── */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-6 flex items-center gap-2">
                <Flame className="w-3 h-3 text-orange-500" />
                Command
              </h4>
              <ul className="space-y-4">
                {PLATFORM_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Regulatory ── */}
            <div className="md:col-span-2">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-3 h-3 text-primary" />
                Protocol
              </h4>
              <ul className="space-y-4">
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Security / Solana ── */}
            <div className="md:col-span-4 space-y-8">
              <div className="p-6 rounded-[2rem] border-2 border-white/5 bg-white/[0.02] space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                       <Zap size={14} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Solana Mainnet Active</span>
                 </div>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-relaxed">
                    Deterministic prize pools verified on-chain. Rewards distributed via smart protocol indices.
                 </p>
              </div>

              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20 hover:text-primary transition-all"><Bird size={16} /></a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white/20 hover:text-primary transition-all"><GitBranch size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Legal Disclaimer ── */}
        <div className="border-t border-white/5 bg-black/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <p className="text-[9px] leading-relaxed text-white/10 font-bold uppercase tracking-wider text-center max-w-5xl mx-auto">
              Scorendo is a skill-based tactical arena. No elements of chance or technological randomization are used to determine rankings. 
              Not affiliated with official sports leagues. Data used for identification only under fair use doctrine.
            </p>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/5 py-8">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">© 2026 Scorendo Protocol</span>
            <div className="flex items-center gap-8">
               <span className="text-[9px] font-black text-primary/20 uppercase tracking-[0.5em]">Locker Room HQ</span>
               <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">V2.4.0_STABLE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
