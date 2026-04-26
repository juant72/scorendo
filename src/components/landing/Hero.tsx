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
      
      {/* Fluid Power Orbs - WC2026 Palette */}
      <motion.div 
         animate={{ 
           scale: [1, 1.3, 1], 
           opacity: [0.1, 0.2, 0.1],
           x: [0, 50, 0],
           y: [0, -30, 0]
         }}
         transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-wc-blue/20 blur-[150px] pointer-events-none" 
      />
      <motion.div 
         animate={{ 
           scale: [1, 1.2, 1], 
           opacity: [0.1, 0.15, 0.1],
           x: [0, -40, 0],
           y: [0, 60, 0]
         }}
         transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
         className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-wc-pink/15 blur-[120px] pointer-events-none" 
      />
      
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMMjAgNXYxMEwxMCAyMEwwIDE1VjV6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-20" />

      {/* ── Content ── */}
      <div className="relative z-20 max-w-6xl mx-auto w-full">
        <div className="relative p-10 md:p-20 rounded-[4rem] border-2 border-white/[0.05] bg-black/60 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-[200%] animate-scan pointer-events-none" />

          {/* System Ticker */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 mb-12 overflow-hidden"
          >
             <div className="flex items-center gap-2 px-4 py-1.5 bg-wc-green/10 rounded-full border border-wc-green/30">
                <div className="w-2 h-2 rounded-full bg-wc-green animate-pulse shadow-[0_0_8px_#00E676]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-wc-green">Mundial 2026 Protocol Active</span>
             </div>
             <div className="h-[1px] flex-1 bg-white/10" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">GLOBAL AUTH // SECTOR_BRAVO</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
             <h1 className="text-6xl sm:text-8xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-[0.8] mb-12">
               Precision <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-wc-green via-wc-purple to-wc-pink animate-gradient drop-shadow-[0_0_40px_rgba(211,21,138,0.3)]">
                 In Every Strike
               </span>
             </h1>
             
             <p className="text-xl md:text-2xl text-white/60 max-w-2xl leading-tight mb-14 font-black uppercase italic tracking-tighter">
               The tactical prediction arena for the new football era. Instant settlements, deterministic data, and pure competitive dominance.
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
                <div className="absolute -inset-2 bg-wc-green/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <AuthButton />
             </div>
             
             <Link
               href="/contests"
               className="group relative overflow-hidden flex items-center justify-center gap-4 px-12 h-20 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] border border-white/10 hover:border-wc-purple text-white transition-all bg-white/5 shadow-2xl"
             >
               <Zap size={18} className="text-wc-purple group-hover:scale-125 transition-transform" />
               Enter The Arena
               <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform opacity-30 group-hover:opacity-100" />
               <div className="absolute inset-0 bg-wc-purple/5 translate-y-full group-hover:translate-y-0 transition-transform" />
             </Link>
          </motion.div>

          {/* Strategic Features */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-16"
          >
             {[
               { label: 'Competitive', text: 'Skill-Based Protocol', icon: ShieldCheck, color: 'wc-green' },
               { label: 'Intelligence', text: 'Official Data Source', icon: Zap, color: 'wc-blue' },
               { label: 'Dominance', text: 'Global Standing XP', icon: Flame, color: 'wc-pink' }
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-5 group/item">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:border-${item.color}/50 group-hover/item:bg-${item.color}/5 transition-all shadow-xl`}>
                     <item.icon size={22} className={`text-white/40 group-hover/item:text-${item.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">{item.label}</span>
                    <span className="text-[13px] font-black uppercase tracking-widest text-white/80">{item.text}</span>
                  </div>
                </div>
             ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
