'use client';

import { motion } from 'framer-motion';
import { AuthButton } from '@/components/auth/AuthButton';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 sm:px-12 flex flex-col justify-center min-h-[85vh] overflow-hidden">
      
      {/* ── Effervescent Dynamic Background ── */}
      <div className="absolute inset-0 bg-[#020814]" />
      
      {/* Fluid Aurora Orbs */}
      <motion.div 
         animate={{ 
           scale: [1, 1.2, 1], 
           opacity: [0.3, 0.6, 0.3],
           rotate: [0, 90, 0]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/20 blur-[150px] mix-blend-screen pointer-events-none" 
      />
      <motion.div 
         animate={{ 
           scale: [1, 1.5, 1], 
           opacity: [0.2, 0.5, 0.2],
           x: [0, 100, 0]
         }}
         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/20 blur-[150px] mix-blend-screen pointer-events-none" 
      />
      
      {/* Hex Grid Overlay for Structure */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMMjAgNXYxMEwxMCAyMEwwIDE1VjV6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-transparent to-transparent pointer-events-none" />

      {/* ── Glassmorphism Content Card ── */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="relative p-8 md:p-14 rounded-[3rem] border border-white/[0.08] bg-black/40 backdrop-blur-3xl shadow-2xl overflow-hidden group">
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-50" />

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8 relative z-20"
          >
             <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 shadow-[0_0_15px_rgba(0,230,118,0.4)]">
                <Flame size={14} className="text-primary animate-pulse" />
             </div>
             <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">Live Multisport Arena</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl relative z-20"
          >
             <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-[0.9] mb-8 drop-shadow-2xl">
               Dominate The Leaderboards.
               <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary animate-gradient font-black filter drop-shadow-[0_0_20px_rgba(0,230,118,0.3)]">
                 Claim The Pot.
               </span>
             </h1>
             
             <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed mb-10 font-bold tracking-wide">
               The ultimate skill-based gaming platform for sports fans. Predict real matches, outsmart other players, rank up your profile, and earn instant rewards.
             </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-20"
          >
             <div className="hover:scale-105 transition-transform"><AuthButton /></div>
             <Link
               href="/contests"
               className="group relative overflow-hidden flex items-center justify-center gap-3 px-8 h-12 rounded-xl text-sm font-black uppercase tracking-widest border-2 border-white/10 hover:border-white text-white transition-all bg-white/5 shadow-xl shadow-black/50"
             >
               <span className="relative z-10 flex items-center gap-2">Play Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
             </Link>
          </motion.div>

          {/* Gaming Value Strip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 relative z-20"
          >
             {[
               { label: 'Level Up', val: 'Earn XP', color: 'text-primary' },
               { label: 'Compete', val: 'Global Rank', color: 'text-white' },
               { label: 'Rewards', val: 'Instant SOL', color: 'text-gold' },
               { label: 'Fair Play', val: 'Skill Based', color: 'text-blue-400' }
             ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${stat.color} filter drop-shadow-md`}>{stat.label}</span>
                  <span className="text-sm font-bold tracking-wide uppercase text-white drop-shadow-sm">{stat.val}</span>
                </div>
             ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
