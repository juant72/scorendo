'use client';

import { motion } from 'framer-motion';
import { Wallet, Target, Trophy, Shield, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Connect your Solana wallet in one click. Your wallet is your identity — no accounts, no passwords, no personal data required.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    glowColor: 'rgba(0,230,118,0.08)',
    accentGlow: 'rgba(0,230,118,0.25)',
  },
  {
    number: '02',
    icon: Target,
    title: 'Pick Your Arena',
    description: 'Choose from Football, F1, NBA, Rugby & more. Browse upcoming contests — from free daily predictions to premium tournaments.',
    color: 'text-gold',
    bgColor: 'bg-gold/10',
    borderColor: 'border-gold/20',
    glowColor: 'rgba(255,215,0,0.08)',
    accentGlow: 'rgba(255,215,0,0.25)',
  },
  {
    number: '03',
    icon: Trophy,
    title: 'Make Your Predictions',
    description: 'Use your sports expertise to predict outcomes. Score points for accuracy. The smartest analysts rise to the top of the leaderboard.',
    color: 'text-match',
    bgColor: 'bg-match/10',
    borderColor: 'border-match/20',
    glowColor: 'rgba(255,107,53,0.08)',
    accentGlow: 'rgba(255,107,53,0.25)',
  },
  {
    number: '04',
    icon: Shield,
    title: 'Win & Withdraw Instantly',
    description: 'Top predictors share the prize pool. Winnings go directly to your wallet via Solana smart contracts — instant, verifiable, yours.',
    color: 'text-sky-400',
    bgColor: 'bg-sky-400/10',
    borderColor: 'border-sky-400/20',
    glowColor: 'rgba(56,189,248,0.08)',
    accentGlow: 'rgba(56,189,248,0.25)',
  },
];

const contestTypes = [
  { emoji: '📅', label: 'Match Day', desc: 'Single matchday' },
  { emoji: '⚔️', label: 'Group Battle', desc: 'Group stage' },
  { emoji: '📊', label: 'Phase', desc: 'Multi-round' },
  { emoji: '🔥', label: 'Bracket', desc: 'Knockout' },
  { emoji: '🏆', label: 'Grand Tournament', desc: 'Full season' },
  { emoji: '🛡️', label: 'Zone', desc: 'Regional' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 px-4 relative overflow-hidden">

      {/* Background  */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-[#060f1e] to-midnight pointer-events-none" />
      <div className="absolute inset-0 bg-pitch-lines opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="h-px w-10 bg-primary/50" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">How It Works</span>
            <div className="h-px w-10 bg-primary/50" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black italic uppercase tracking-tighter text-white leading-none mb-6">
            Your Path to{' '}
            <span className="text-gold" style={{ textShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
              Victory
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Four steps from wallet connection to winning prizes. Pure sport intelligence, zero luck.
          </p>
        </motion.div>

        {/* ── Steps ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              className="group relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-6 h-px bg-gradient-to-r from-white/10 to-transparent z-20 translate-x-0" />
              )}

              <div
                className={`relative rounded-3xl border ${step.borderColor} p-7 h-full flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                style={{ background: step.glowColor, backdropFilter: 'blur(20px)' }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${step.accentGlow} 0%, transparent 70%)` }}
                />

                {/* Step number */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.bgColor} border ${step.borderColor}`}>
                    <step.icon className={`h-6 w-6 ${step.color}`} />
                  </div>
                  <span className={`text-5xl font-black italic ${step.color} opacity-15 leading-none`}>
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Bottom accent */}
                <div className={`mt-5 h-px bg-gradient-to-r from-transparent ${step.borderColor} to-transparent`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Contest Types ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] border border-white/5 overflow-hidden p-10 md:p-14"
          style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="text-center mb-10">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
              Multiple Ways to{' '}
              <span className="text-primary">Compete</span>
            </h3>
            <p className="text-white/30 text-sm max-w-md mx-auto">
              From daily challenges to full tournaments — every format serves a different champion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {contestTypes.map((ct, i) => (
              <motion.div
                key={ct.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="text-3xl">{ct.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors text-center">
                  {ct.label}
                </span>
                <span className="text-[9px] text-white/20 group-hover:text-white/40 transition-colors text-center">
                  {ct.desc}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              href="/contests"
              className="group inline-flex items-center gap-2 px-8 h-12 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary hover:border-primary text-primary hover:text-midnight font-black uppercase tracking-widest text-xs transition-all duration-300"
            >
              Explore All Arenas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* ── Bottom Trust Strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 pt-10 border-t border-white/5 flex flex-wrap items-center justify-center gap-8"
        >
          {[
            { icon: '🔒', text: 'Non-custodial wallets' },
            { icon: '⚡', text: 'Instant Solana payouts' },
            { icon: '🧠', text: '100% skill-based' },
            { icon: '🌍', text: '8 sports & counting' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors">
              <span>{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest">{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
