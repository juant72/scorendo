'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, Fuel, Target, ShieldCheck, Check, Zap, Trophy } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SPORT_META, SportSlug } from '@/lib/constants';

const SPORT_ICONS: Record<string, any> = {
  football: Activity,
  motorsports: Fuel,
  nba: Target,
  rugby: ShieldCheck,
};

export function SportDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentSportSlug = (searchParams.get('sport') || 'football') as SportSlug;
  const currentSport = SPORT_META[currentSportSlug] || SPORT_META.football;
  const CurrentIcon = SPORT_ICONS[currentSportSlug] || Activity;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    const isHome = window.location.pathname === '/';
    const targetPath = isHome ? '/' : '/contests';
    router.push(`${targetPath}?sport=${slug}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight/80 border border-white/10 hover:border-primary/50 transition-all group backdrop-blur-xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`${currentSport.accent} group-hover:scale-110 transition-transform relative z-10`}>
          <CurrentIcon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/90 hidden sm:block relative z-10">
          {currentSport.name}
        </span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full mt-3 left-0 w-72 bg-[#060a14] rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[110] p-3"
          >
            <div className="absolute inset-0 bg-primary/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 mb-3 flex items-center justify-between">
              <span>Sector Selection</span>
              <Zap size={10} className="text-primary/40" />
            </div>
            
            <div className="space-y-1.5">
              {Object.values(SPORT_META).map((sport) => {
                const Icon = SPORT_ICONS[sport.slug];
                const isSelected = currentSportSlug === sport.slug;
                
                return (
                  <button
                    key={sport.slug}
                    onClick={() => handleSelect(sport.slug)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group relative overflow-hidden ${
                      isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {isSelected && (
                       <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
                    )}
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-2.5 rounded-xl transition-all ${isSelected ? 'bg-primary text-midnight shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                           {sport.name}
                        </div>
                        <div className="text-[8px] font-black text-white/20 group-hover:text-primary transition-colors flex items-center gap-1 uppercase">
                           <Trophy size={8} /> {sport.stats}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                       <motion.div layoutId="active-check" className="relative z-10">
                          <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                             <Check className="w-3 h-3 text-primary stroke-[4]" />
                          </div>
                       </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Accent */}
            <div className="mt-3 pt-3 border-t border-white/5">
               <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-white/10">
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  Live Sync Active
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
