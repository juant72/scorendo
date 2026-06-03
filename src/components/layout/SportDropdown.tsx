'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy, Cpu, Zap } from 'lucide-react';
import { locales } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

export function SportDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale } = useAuthStore();
  const t = locales[locale].sportDropdown;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight/80 border border-[#FFD700]/30 hover:border-[#FFD700]/60 transition-all group backdrop-blur-xl shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="text-gold group-hover:scale-110 transition-transform relative z-10">
          <Trophy className="w-4 h-4 filter drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700] hidden sm:block relative z-10">
          World Cup 2026
        </span>
        <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-300 relative z-10 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full mt-3 right-0 w-72 bg-[#060a14] rounded-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[110] p-4 space-y-4"
          >
            <div className="absolute inset-0 bg-primary/2 opacity-100 transition-opacity" />
            
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2 flex items-center justify-between">
              <span>{t.statusHeader}</span>
              <Cpu size={10} className="text-gold/60" />
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/40">{t.activeArena}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-gold">World Cup 2026</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/40">{t.sportSector}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/80">{locale === 'es' ? 'Fútbol' : 'Football'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/40">{t.syncStatus}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#00E676] flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" /> {t.live}
                </span>
              </div>
            </div>
            
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wide leading-relaxed p-3 bg-gold/5 border border-gold/10 rounded-2xl italic text-center">
              "{t.offlineLeaguesWarning}"
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
               <Zap size={10} className="text-gold" />
               {t.worldCupActive}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
