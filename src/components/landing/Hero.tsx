'use client';

import { motion } from 'framer-motion';
import { AuthButton } from '@/components/auth/AuthButton';
import { CountdownTimer } from './CountdownTimer';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 pitch-lines opacity-40" />
      <div className="absolute inset-0 net-pattern" />

      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/3 blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm text-muted-foreground">
            World Cup 2026 — Registrations Opening Soon
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-gradient-hero">Predict.</span>{' '}
          <span className="text-gradient-pitch">Compete.</span>{' '}
          <span className="text-gradient-gold">Win.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Use your football knowledge to predict match outcomes.
          Compete against thousands. Top predictors share the{' '}
          <span className="text-gold font-medium">prize pool</span>.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <CountdownTimer />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <AuthButton />
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-all hover:bg-white/5"
          >
            How It Works
          </a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground/50"
        >
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> Non-custodial wallets
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> Skill-based competition
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> Free entry always available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-primary">✓</span> Built on Solana
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
