'use client';

import { motion } from 'framer-motion';
import { AuthButton } from '@/components/auth/AuthButton';
import { ChevronDown, Flame, Zap } from 'lucide-react';
import Link from 'next/link';

const WORDS = ['Predict.', 'Compete.', 'Win.'];
const WORD_COLORS = ['text-white', 'text-primary', 'text-gold'];

const SPORTS_TICKER = [
  { emoji: '⚽', name: 'Football' },
  { emoji: '🏎️', name: 'F1' },
  { emoji: '🏀', name: 'NBA' },
  { emoji: '🏉', name: 'Rugby' },
  { emoji: '🎾', name: 'Tennis' },
  { emoji: '⚽', name: 'Football' },
  { emoji: '🏎️', name: 'F1' },
  { emoji: '🏀', name: 'NBA' },
  { emoji: '🏉', name: 'Rugby' },
  { emoji: '🎾', name: 'Tennis' },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden">

      {/* ── Rich Background Stack ── */}
      <div className="absolute inset-0 bg-[#050d1a]" />

      {/* Stadium image overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/stadium_hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-transparent to-midnight/80" />

      {/* Green flare — top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      {/* Gold flare — bottom right */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
      {/* Red flare — bottom left */}
      <div className="absolute bottom-1/4 left-0 w-[350px] h-[350px] rounded-full bg-match/5 blur-[90px] pointer-events-none" />

      {/* ── Pitch Lines ── */}
      <div className="absolute inset-0 bg-pitch-lines opacity-20" />

      {/* ── Content Zone ── */}
      <div className="relative z-10 text-center max-w-5xl mx-auto pt-8">

        {/* Live badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 border border-primary/20"
          style={{ background: 'rgba(0,230,118,0.06)' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
            Live Tournaments · 8 Sports · World-Class Arenas
          </span>
        </motion.div>

        {/* ── Main Headline ── */}
        <div className="mb-8">
          {WORDS.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 50, rotateX: -20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15, ease: 'backOut' }}
              className={`inline-block text-5xl sm:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-none mr-4 ${WORD_COLORS[i]}`}
              style={{ textShadow: i === 2 ? '0 0 60px rgba(255,215,0,0.3)' : i === 1 ? '0 0 60px rgba(0,230,118,0.3)' : 'none' }}
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          The premier skill-based multisport prediction arena.{' '}
          <span className="text-white/80 font-medium">No luck. No gambling.</span>{' '}
          Just pure sport intelligence competing for{' '}
          <span className="text-gold font-semibold">SOL prizes</span>.
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <AuthButton />
          <Link
            href="/contests"
            className="group flex items-center gap-2 px-8 h-14 rounded-2xl text-sm font-black uppercase tracking-widest border border-white/10 hover:border-primary/40 text-white/60 hover:text-white transition-all hover:bg-white/5"
          >
            <Flame className="w-4 h-4 text-match group-hover:text-primary transition-colors" />
            Browse Arenas
          </Link>
        </motion.div>

        {/* ── Trust Indicators ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-wrap items-center justify-center gap-5 text-[10px] font-bold uppercase tracking-widest text-white/25 mb-14"
        >
          {[
            '✓ Non-custodial',
            '✓ Skill-based only',
            '✓ Free entry always',
            '✓ Built on Solana',
            '✓ 8 Sports',
          ].map((item) => (
            <span key={item} className="hover:text-white/50 transition-colors cursor-default">{item}</span>
          ))}
        </motion.div>

        {/* ── Sports Ticker ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="relative overflow-hidden rounded-2xl border border-white/5 py-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <motion.div
            animate={{ x: [0, '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 whitespace-nowrap"
          >
            {SPORTS_TICKER.map((s, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-lg">{s.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                  {s.name}
                </span>
                <span className="text-white/10">·</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <ChevronDown className="h-4 w-4 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
