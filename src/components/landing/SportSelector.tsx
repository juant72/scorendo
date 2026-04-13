'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Fuel, Target, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SPORTS = [
  {
    id: 'football',
    name: 'Football',
    tagline: 'Global Leagues',
    slug: 'football',
    icon: Activity,
    accent: '#00E676',
    bg: '/arenas/afa_lpf.png'
  },
  {
    id: 'motorsports',
    name: 'Formula 1',
    tagline: 'World Championship',
    slug: 'motorsports',
    icon: Fuel,
    accent: '#FF4444',
    bg: '/arenas/f1_championship.png'
  },
  {
    id: 'nba',
    name: 'NBA',
    tagline: 'Pro Basketball',
    slug: 'nba',
    icon: Target,
    accent: '#FF7700',
    bg: 'https://images.unsplash.com/photo-1541339905195-03f4770d4071?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'rugby',
    name: 'Rugby',
    tagline: 'International Mix',
    slug: 'rugby',
    icon: ShieldCheck,
    accent: '#C8A240',
    bg: '/stadium_hero.png'
  },
];

export function SportSelector() {
  const router = useRouter();

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-px w-10 bg-primary" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Arena Gate</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white leading-none">
                 Select Your <span className="text-primary">Discipline</span>
              </h2>
           </div>
           {/* Pragmatic Fast-Pass */}
           <div className="hidden sm:flex items-center gap-3">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-2">Quick Access:</span>
              {SPORTS.map(s => (
                <button 
                  key={s.id}
                  onClick={() => router.push(`/contests?sport=${s.slug}`)}
                  className="h-10 px-5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2"
                >
                   <s.icon size={12} />
                   {s.name}
                </button>
              ))}
           </div>
        </div>

        {/* High-Fidelity Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {SPORTS.map((sport, idx) => (
             <motion.div
               key={sport.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               onClick={() => router.push(`/contests?sport=${sport.slug}`)}
               className="group relative h-96 rounded-[3rem] overflow-hidden cursor-pointer border border-white/5 hover:border-primary/40 transition-all shadow-2xl"
             >
                {/* Visual Backdrop */}
                <div className="absolute inset-0">
                   <img src={sport.bg} className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-1000" alt={sport.name} />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-transparent to-transparent" />
                </div>

                {/* Card Content */}
                <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-midnight">
                         <sport.icon size={24} />
                      </div>
                      <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" size={24} />
                   </div>

                   <div className="space-y-2">
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] group-hover:text-primary transition-colors">{sport.tagline}</div>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{sport.name}</h3>
                      <div className="pt-4 flex items-center gap-3">
                         <div className="w-8 h-px bg-white/10 group-hover:bg-primary transition-colors group-hover:w-16 duration-500" />
                         <span className="text-[9px] font-black text-white/10 uppercase tracking-widest group-hover:text-white transition-colors">Enter Segment</span>
                      </div>
                   </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
                   <Sparkles size={120} />
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
