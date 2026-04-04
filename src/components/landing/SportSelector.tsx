'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Activity, ShieldCheck, ChevronRight, Fuel, Target } from 'lucide-react';
import Link from 'next/link';

const SPORTS = [
  {
    id: 'football',
    name: 'Fútbol',
    slug: 'football',
    description: 'The Beautiful Game. Predict the World Cup 2026, Leagues, and more.',
    icon: <Activity className="w-10 h-10" />,
    color: 'from-emerald-500/20 to-emerald-900/40',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
    stats: 'Full Tournament, Phases & Daily Contests'
  },
  {
    id: 'motorsports',
    name: 'Automovilismo',
    slug: 'motorsports',
    description: 'Formula 1 & MotoGP. Annual championships or specific Grand Prix battles.',
    icon: <Fuel className="w-10 h-10" />,
    color: 'from-red-500/20 to-red-900/40',
    accent: 'text-red-400',
    border: 'border-red-500/20',
    stats: 'Season Long & GP Specific'
  },
  {
    id: 'basketball',
    name: 'Basquet NBA',
    slug: 'nba',
    description: 'The NBA Arena. Predict the full season, playoffs or tonight matches.',
    icon: <Target className="w-10 h-10" />,
    color: 'from-orange-500/20 to-orange-900/40',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
    stats: 'Season, Playoffs & Live Dates'
  },
  {
    id: 'rugby',
    name: 'Rugby',
    slug: 'rugby',
    description: 'The 6 Nations and World Cup. Strength meets strategy in every phase.',
    icon: <ShieldCheck className="w-10 h-10" />,
    color: 'from-amber-700/20 to-amber-900/40',
    accent: 'text-amber-500',
    border: 'border-amber-700/20',
    stats: 'International Mix'
  }
];

export function SportSelector() {
  return (
    <section className="relative py-32 px-4 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto text-center mb-24 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
        >
           <Zap className="w-3 h-3 text-gold animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">The Grandmaster Arena</span>
        </motion.div>
        
        <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent leading-none"
        >
          Select Your <span className="text-primary">Domain</span>
        </motion.h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          Choose a sport to unlock competitions. From full annual championships to intense daily battles.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {SPORTS.map((sport, idx) => (
          <motion.div
            key={sport.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="group"
          >
            <Link href={`/lobby?sport=${sport.slug}`}>
               <div className={`h-[450px] relative glass-premium-thick rounded-[3rem] p-10 border transition-all duration-500 ${sport.border} hover:border-white/20 overflow-hidden bg-gradient-to-br ${sport.color} flex flex-col shadow-2xl`}>
                  {/* Internal Glow */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  
                  <div className={`mb-12 inline-block p-6 rounded-[2rem] bg-black/40 border border-white/5 ${sport.accent} shadow-2xl group-hover:scale-110 transition-transform`}>
                     {sport.icon}
                  </div>

                  <h3 className="text-4xl font-black uppercase italic tracking-tight mb-4 group-hover:text-primary transition-colors leading-none">
                    {sport.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-10 group-hover:text-white/70 transition-colors">
                    {sport.description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                     <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-muted-foreground/50 tracking-widest mb-1">Available Contests</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
                           {sport.stats}
                        </span>
                     </div>
                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
                        <ChevronRight className="w-6 h-6" />
                     </div>
                  </div>
               </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
