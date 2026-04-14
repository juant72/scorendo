'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function LivePulse({ status }: { status?: string }) {
  const isLive = status === 'LIVE' || status === 'IN_PLAY';
  
  if (!isLive) return null;

  return (
    <div className="flex items-center gap-2">
       <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
       </span>
       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Live Oracle Feed</span>
    </div>
  );
}

export function DataFlowPulse() {
  return (
    <div className="flex gap-0.5 items-end h-3">
       {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
          <motion.div 
            key={i}
            animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
            transition={{ duration: 1 + i*0.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-0.5 bg-primary/40 rounded-full"
          />
       ))}
    </div>
  );
}
