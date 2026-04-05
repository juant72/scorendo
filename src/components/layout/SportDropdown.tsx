'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, Fuel, Target, ShieldCheck, Check } from 'lucide-react';
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
      >
        <div className={`${currentSport.accent} group-hover:scale-110 transition-transform`}>
          <CurrentIcon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/90 hidden sm:block">
          {currentSport.name}
        </span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-2 left-0 w-64 bg-[#0a0f1d]/98 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-white/5 mb-2">
                Select Active Arena
              </div>
              
              {Object.values(SPORT_META).map((sport) => {
                const Icon = SPORT_ICONS[sport.slug];
                const isSelected = currentSportSlug === sport.slug;
                
                return (
                  <button
                    key={sport.slug}
                    onClick={() => handleSelect(sport.slug)}

                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group ${
                      isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-widest">{sport.name}</div>
                        <div className="text-[8px] font-bold text-muted-foreground/60">{sport.stats}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>

            {/* Bottom Glow */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
