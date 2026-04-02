'use client';

import { useEffect, useState } from 'react';
import { WORLD_CUP_START } from '@/lib/constants';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

  if (!mounted) return null;

  const blocks = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="glass rounded-xl px-3 py-2 sm:px-5 sm:py-3 min-w-[3.5rem] sm:min-w-[4.5rem] text-center glow-green">
              <span className="text-2xl sm:text-4xl font-bold text-primary tabular-nums">
                {String(block.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-xl sm:text-3xl font-light text-muted-foreground/30 -mt-5">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
