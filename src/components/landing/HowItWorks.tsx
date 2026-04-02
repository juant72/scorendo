'use client';

import { motion } from 'framer-motion';
import { Wallet, Target, Trophy, Shield } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Connect your Solana wallet. Your wallet is your identity — no accounts, no passwords, no personal data.',
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Target,
    title: 'Predict & Compete',
    description: 'Browse contests, use your football knowledge to predict match outcomes. Free and paid tiers available.',
    color: 'gold',
    gradient: 'from-gold/20 to-gold/5',
  },
  {
    icon: Trophy,
    title: 'Win Prizes',
    description: 'Score points for correct predictions. Top 10 predictors share the prize pool — paid directly to your wallet.',
    color: 'match',
    gradient: 'from-match/20 to-match/5',
  },
  {
    icon: Shield,
    title: 'Your Funds, Your Control',
    description: 'Non-custodial wallets + Solana smart contracts. We never hold your crypto — everything is on-chain and verifiable.',
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 relative">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How <span className="text-gradient-pitch">Scorendo</span> Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Compete using your football knowledge. No luck, no gambling — pure skill.
          </p>
        </motion.div>

        {/* Steps grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className={`glass rounded-2xl p-6 h-full transition-all duration-300 hover:glow-green hover:border-primary/20`}>
                {/* Step number */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient}`}>
                    <step.icon className={`h-5 w-5 text-${step.color}`} />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
                    Step {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contest types preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">
            Multiple Ways to <span className="text-gradient-gold">Compete</span>
          </h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            From daily challenges to the grand tournament — pick your style.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { emoji: '📅', label: 'Match Day' },
              { emoji: '📆', label: 'Weekly' },
              { emoji: '⚔️', label: 'Group Battle' },
              { emoji: '📊', label: 'Phase' },
              { emoji: '🌎', label: 'Zone' },
              { emoji: '🔥', label: 'Bracket' },
              { emoji: '🏆', label: 'Grand Tournament' },
            ].map((contest) => (
              <div
                key={contest.label}
                className="glass rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all cursor-default"
              >
                <span className="mr-1.5">{contest.emoji}</span>
                {contest.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
