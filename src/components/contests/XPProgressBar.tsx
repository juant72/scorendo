'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface XPProgressBarProps {
  xp: number;
  level: number;
  showLabels?: boolean;
}

export function XPProgressBar({ xp, level, showLabels = true }: XPProgressBarProps) {
  // Simple Level Formula: Each level requires level * 100 XP
  const nextLevelXp = level * 100;
  const progress = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className="w-full space-y-2">
      {showLabels && (
        <div className="flex justify-between items-end mb-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Progression</span>
            <span className="text-sm font-black text-white italic tracking-tighter">LVL {level} <span className="text-primary text-[10px] ml-1">HERITAGE</span></span>
          </div>
          <span className="text-[10px] font-mono text-primary/60">{xp} / {nextLevelXp} XP</span>
        </div>
      )}
      
      <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
        {/* Glow Layer */}
        <div 
          className="absolute inset-y-0 left-0 bg-primary/20 blur-md transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
        
        {/* Active Progress */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="relative h-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-full shadow-[0_0_10px_rgba(0,230,118,0.5)]"
        />
      </div>
    </div>
  );
}
