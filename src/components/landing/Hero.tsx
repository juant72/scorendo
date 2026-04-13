'use client';

import { motion } from 'framer-motion';
import { AuthButton } from '@/components/auth/AuthButton';
import { ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 sm:px-12 flex flex-col justify-center min-h-[90vh] overflow-hidden">
      
      {/* ── Immersive Tactical Background ── */}
      <div className="absolute inset-0 bg-[#020814]" />
      
      {/* Global Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />
      
      {/* Fluid Power Orbs */}
      <motion.div 
         animate={{ 
           scale: [1, 1.3, 1], 
           opacity: [0.2, 0.4, 0.2],
         }}
         transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-primary/10 blur-[200px] pointer-events-none" 
      />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMMjAgNXYxMEwxMCAyMEwwIDE1VjV6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-30" />

      {/* ── Content ── */}
      <div className="relative z-20 max-w-6xl mx-auto w-full">
        <div className="relative p-10 md:p-20 rounded-[4rem] border-2 border-white/[0.05] bg-black/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-[200%] animate-scan pointer-events-none" />

          {/* System Ticker */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-10 overflow-hidden"
          >
             <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full border border-primary/40">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Neural Link Established</span>
             </div>
             <div className="h-[1px] flex-1 bg-white/10" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">SYST: OPERATIONAL // V2.4.0</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
             <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85] mb-10">
               Forge Your <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-primary animate-gradient drop-shadow-[0_0_30px_rgba(0,230,118,0.4)]">
                 Tactical Legacy
               </span>
             </h1>
             
             <p className="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-12 font-black uppercase italic tracking-tight">
               Deployment ready. Analyze official sports outcomes, execute precision predictions, and dominate the global arena. Powered by Solana for instant, deterministic rewards.
             </p>
          </motion.div>

          {/* Action Hub */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6"
          >
             <div className="relative group">
                <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <AuthButton />
             </div>
             
             <Link
               href="/contests"
               className="group relative overflow-hidden flex items-center justify-center gap-4 px-10 h-16 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border-2 border-white/10 hover:border-primary text-white transition-all bg-white/5"
             >
               <Zap size={16} className="text-primary group-hover:scale-125 transition-transform" />
               Enter The Lobby
               <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform opacity-30 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform" />
             </Link>
          </motion.div>

          {/* Strategic Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/5 flex flex-wrap gap-12"
          >
             {[
               { label: 'Competitive', text: 'Skill-Based Protocol', icon: ShieldCheck },
               { label: 'Intelligence', text: 'Official Data Source', icon: Zap },
               { label: 'Dominance', text: 'Global Standing XP', icon: Flame }
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-primary/50 group-hover/item:bg-primary/5 transition-all">
                     <item.icon size={18} className="text-white/40 group-hover/item:text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">{item.label}</span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80">{item.text}</span>
                  </div>
                </div>
             ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
