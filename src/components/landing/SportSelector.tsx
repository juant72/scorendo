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
    stats: 'Tournaments & Daily',
    icon: Activity,
    color: 'from-emerald-500/20 to-emerald-900/40',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  {
    id: 'motorsports',
    name: 'Automovilismo',
    slug: 'motorsports',
    stats: 'Full Season & GP',
    icon: Fuel,
    color: 'from-red-500/20 to-red-900/40',
    accent: 'text-red-400',
    border: 'border-red-500/20',
  },
  {
    id: 'nba',
    name: 'NBA',
    slug: 'nba',
    stats: 'Playoffs & Dates',
    icon: Target,
    color: 'from-orange-500/20 to-orange-900/40',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  {
    id: 'rugby',
    name: 'Rugby',
    slug: 'rugby',
    stats: 'International Mix',
    icon: ShieldCheck,
    color: 'from-amber-700/20 to-amber-900/40',
    accent: 'text-amber-500',
    border: 'border-amber-700/20',
  }
];


export function SportSelector() {
  return (
    <section className="relative py-12 px-4 overflow-hidden flex flex-col justify-center border-b border-white/5 bg-midnight/50 backdrop-blur-md">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 relative z-10">
        <div className="flex items-center gap-2 pr-6 border-r border-white/10 hidden md:flex">
           <Zap className="w-3 h-3 text-gold animate-pulse" />
           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">Arena Choice</span>
        </div>

        {SPORTS.map((sport, idx) => (
          <motion.div
            key={sport.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link href={`/contests?sport=${sport.slug}`}>
               <div className={`relative flex items-center gap-3 px-6 py-3 rounded-full border transition-all duration-300 ${sport.border} hover:border-primary bg-black/40 shadow-lg group`}>
                  <div className={`${sport.accent} group-hover:scale-110 transition-transform`}>
                     <sport.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                    {sport.name}
                  </span>
                  
                  {/* Subtle Glow */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-full blur-md transition-all" />
               </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}


