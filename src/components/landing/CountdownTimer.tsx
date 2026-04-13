'use client';

import { useEffect, useState } from 'react';
import { WORLD_CUP_START } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function FlipBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center rounded-2xl min-w-[72px] sm:min-w-[88px] h-[72px] sm:h-[88px] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(0,230,118,0.03) 100%)',
          border: '1px solid rgba(0,230,118,0.15)',
          boxShadow: '0 0 30px rgba(0,230,118,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Top/bottom divider (flip clock look) */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/40 z-10" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'backOut' }}
            className="text-3xl sm:text-4xl font-black text-primary tabular-nums tracking-tight"
            style={{ textShadow: '0 0 20px rgba(0,230,118,0.5)' }}
          >
            {display}
          </motion.span>
        </AnimatePresence>

        {/* Corner accents */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-primary/30 rounded-tl" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-primary/30 rounded-tr" />
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-primary/30 rounded-bl" />
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-primary/30 rounded-br" />
      </div>

      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const calculate = () => {
      const now = new Date().getTime();
      const target = WORLD_CUP_START.getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return (
    <div className="flex items-center gap-3">
      {['Days', 'Hrs', 'Min', 'Sec'].map((l) => (
        <div key={l} className="flex flex-col items-center gap-2">
          <div className="min-w-[72px] h-[72px] rounded-2xl animate-pulse" style={{ background: 'rgba(0,230,118,0.05)' }} />
          <span className="text-[8px] text-white/20">{l}</span>
        </div>
      ))}
    </div>
  );

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hrs' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Sec' },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Label */}
      <div className="flex items-center gap-2">
        <div className="h-px w-6 bg-primary/30" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">
          World Cup 2026 Countdown
        </span>
        <div className="h-px w-6 bg-primary/30" />
      </div>

      {/* Flip blocks */}
      <div className="flex items-end gap-2 sm:gap-3">
        {blocks.map((block, i) => (
          <div key={block.label} className="flex items-end gap-2 sm:gap-3">
            <FlipBlock value={block.value} label={block.label} />
            {i < blocks.length - 1 && (
              <span className="text-2xl font-black text-white/20 mb-8 leading-none">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
