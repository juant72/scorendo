'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Fuel, Target, ShieldCheck, ArrowUpRight, Globe, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SPORTS = [
  {
    id: 'football',
    name: 'Football',
    tagline: 'Global Leagues',
    slug: 'football',
    icon: Activity,
    accent: '#00E676',
    pattern: 'match'
  },
  {
    id: 'motorsports',
    name: 'Formula 1',
    tagline: 'World Championship',
    slug: 'motorsports',
    icon: Fuel,
    accent: '#E10600',
    pattern: 'flag'
  },
  {
    id: 'nba',
    name: 'NBA',
    tagline: 'Pro Basketball',
    slug: 'nba',
    icon: Target,
    accent: '#FF6B00',
    pattern: 'court'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    tagline: 'Grand Slams',
    slug: 'tennis',
    icon: Zap,
    accent: '#CCFF00',
    pattern: 'net'
  },
];

export function SportSelector() {
  const router = useRouter();

  return (
    <section className="py-24 px-6 relative">
      {/* Section fade in */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#020814] to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full mb-6">
            <Globe size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Select Your Arena</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
            Choose Your <span className="text-primary">Sport</span>
          </h2>
        </motion.div>

        {/* Sport Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPORTS.map((sport, index) => (
            <motion.button
              key={sport.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/contests?sport=${sport.slug}`)}
              className="group relative p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all text-left overflow-hidden"
            >
              {/* Card glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ 
                  background: `radial-gradient(circle at 50% 0%, ${sport.accent}15 0%, transparent 70%)` 
                }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ 
                    backgroundColor: `${sport.accent}15`,
                    border: `1px solid ${sport.accent}30`
                  }}
                >
                  <sport.icon size={22} style={{ color: sport.accent }} />
                </div>
                
                {/* Name */}
                <h3 className="text-xl font-black uppercase italic text-white mb-1">
                  {sport.name}
                </h3>
                
                {/* Tagline */}
                <p className="text-xs font-medium uppercase tracking-wider text-white/40 mb-4">
                  {sport.tagline}
                </p>
                
                {/* Arrow */}
                <div className="flex items-center justify-between">
                  <span 
                    className="text-xs font-bold uppercase tracking-widest transition-all group-hover:tracking-widest"
                    style={{ color: sport.accent }}
                  >
                    Enter
                  </span>
                  <ArrowUpRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* View All Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => router.push('/contests')}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 hover:text-primary transition-colors"
          >
            View All Competitions
            <ArrowUpRight size={16} />
          </button>
        </motion.div>
      </div>
      
      {/* Section fade out */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020814] to-transparent" />
    </section>
  );
}