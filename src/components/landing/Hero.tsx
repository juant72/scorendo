'use client';

import { motion } from 'framer-motion';
import { AuthButton } from '@/components/auth/AuthButton';
import { ArrowRight, ShieldCheck, Zap, Trophy, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden">
      
      {/* ── Stadium Background Layers ── */}
      <div className="absolute inset-0 bg-[#020814]" />
      
      {/* Top spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-gradient-to-b from-primary/5 to-transparent" />
      
      {/* Pitch glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-primary/[0.08] to-transparent" />
      
      {/* Animated grid */}
      <motion.div 
        animate={{ backgroundPosition: ['0px 0px', '60px 60px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Floating orbs */}
      <motion.div 
        animate={{ y: [-20, 20, -20], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-primary/10 blur-[150px]" 
      />
      <motion.div 
        animate={{ y: [30, -30, 30], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[20%] left-[5%] w-64 h-64 rounded-full bg-accent/10 blur-[100px]" 
      />

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* Status Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Live Arena</span>
          </div>
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/30">2,847 Predictors Active</span>
        </motion.div>

        {/* Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
            Predict <br/>
            <span className="bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
              Dominate
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/50 mt-6 max-w-xl font-medium leading-relaxed">
            Compete in skill-based predictions. Track real-time scores. 
            Earn instant rewards. The arena for true football tacticians.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <AuthButton />
          
          <Link
            href="/contests"
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all"
          >
            <Zap size={16} className="text-purple-400" />
            Enter Arena
            <ArrowRight size={16} className="opacity-30 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-white/5"
        >
          {[
            { icon: Users, label: 'Active', value: '2,847' },
            { icon: Trophy, label: 'Prize Pool', value: '14.2 SOL' },
            { icon: TrendingUp, label: 'Accuracy', value: '94.2%' },
            { icon: Zap, label: 'Settled', value: '12.4K' }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <stat.icon size={18} className="text-primary/60" />
              <div>
                <div className="text-lg font-black text-white">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/30">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020814] to-transparent" />
    </section>
  );
}