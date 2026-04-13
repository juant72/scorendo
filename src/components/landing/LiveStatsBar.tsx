'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Trophy, Users, Zap, Globe } from 'lucide-react';

function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const stats = [
  {
    icon: Trophy,
    label: 'Total Prizes Distributed',
    value: 12847,
    suffix: ' SOL',
    color: 'text-gold',
    glow: 'rgba(255,215,0,0.15)',
  },
  {
    icon: Users,
    label: 'Active Predictors',
    value: 8392,
    suffix: '+',
    color: 'text-primary',
    glow: 'rgba(0,230,118,0.15)',
  },
  {
    icon: Zap,
    label: 'Live Tournaments',
    value: 24,
    suffix: '',
    color: 'text-match',
    glow: 'rgba(255,107,53,0.15)',
  },
  {
    icon: Globe,
    label: 'Sports Covered',
    value: 8,
    suffix: ' Sports',
    color: 'text-sky-400',
    glow: 'rgba(56,189,248,0.15)',
  },
];

export function LiveStatsBar() {
  return (
    <section className="relative py-8 px-4 border-y border-white/5 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-midnight via-[#0d1f3c] to-midnight" />
      <div className="absolute inset-0 bg-pitch-lines opacity-30" />

      {/* Scan line animation */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-primary/5 to-transparent pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110"
                style={{ background: stat.glow }}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className={`text-2xl md:text-3xl font-black tabular-nums tracking-tight ${stat.color}`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
