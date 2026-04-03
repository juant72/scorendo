'use client';

import React from 'react';
import { Shield, Star, Crown, Zap } from 'lucide-react';

interface LevelBadgeProps {
  level: number;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  // Level tiers
  const isHeritageMaster = level >= 50;
  const isLegend = level >= 25;
  const isPro = level >= 10;

  const colorClass = isHeritageMaster 
    ? 'text-gold border-gold/40 bg-gold/10' 
    : isLegend 
    ? 'text-zinc-300 border-zinc-300/40 bg-zinc-300/10'
    : isPro
    ? 'text-primary border-primary/40 bg-primary/10'
    : 'text-muted-foreground border-white/10 bg-white/5';

  const Icon = isHeritageMaster ? Crown : isLegend ? Star : isPro ? Zap : Shield;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-md transition-all hover:scale-105 ${colorClass}`}>
      <Icon size={12} className={isHeritageMaster ? 'animate-pulse' : ''} />
      <span className="text-[10px] font-black uppercase tracking-widest italic">
        LVL {level}
      </span>
    </div>
  );
}
