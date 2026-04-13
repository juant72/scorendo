'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Trophy, Flame, Crosshair, Shield } from 'lucide-react';

const LIVE_ACTIVITY = [
  { id: 1, player: 'PhantomX_92', action: 'locked in', target: 'Argentina vs Brazil', reward: '+25 XP', type: 'predict' },
  { id: 2, player: 'GoalSniper', action: 'climbed to', target: '#3 Global', reward: 'Rank Up!', type: 'rank' },
  { id: 3, player: 'NetBuster', action: 'claimed', target: '4.2 SOL payout', reward: '💰', type: 'win' },
  { id: 4, player: 'TacticMind', action: 'entered arena', target: 'Champions League', reward: '+10 XP', type: 'join' },
  { id: 5, player: 'SoccerSage', action: 'predicted upset', target: 'Monaco GP Round 7', reward: '+50 XP', type: 'predict' },
  { id: 6, player: 'PitchViper', action: 'hit 5-win streak', target: '🔥 On Fire!', reward: 'Badge!', type: 'streak' },
];

const HOW_IT_WORKS = [
  { 
    step: '01', 
    icon: Crosshair, 
    title: 'Choose Your Arena', 
    desc: 'Pick a live tournament from football, F1, NBA, tennis and more. Each arena has its own prize pool and competitive tier.',
    color: 'text-primary',
    glow: 'shadow-[0_0_20px_rgba(0,230,118,0.2)]'
  },
  { 
    step: '02', 
    icon: Flame, 
    title: 'Lock In Predictions', 
    desc: 'Predict exact match scores. The closer you predict, the higher you climb. No luck involved — pure tactical intelligence.',
    color: 'text-match',
    glow: 'shadow-[0_0_20px_rgba(255,107,53,0.2)]'
  },
  { 
    step: '03', 
    icon: Trophy, 
    title: 'Claim Your Rewards', 
    desc: 'Top predictors earn SOL payouts instantly. Every prediction earns XP toward your player rank, win or lose.',
    color: 'text-gold',
    glow: 'shadow-[0_0_20px_rgba(255,215,0,0.2)]'
  },
];

export function NetworkFeed() {
  const [feed, setFeed] = useState(LIVE_ACTIVITY);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed(prev => {
        const shifted = [...prev.slice(1), { ...prev[0], id: Date.now(), player: `Player_${Math.floor(Math.random() * 9999)}` }];
        return shifted;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const typeColor = (type: string) => {
    switch(type) {
      case 'predict': return 'text-primary';
      case 'rank': return 'text-blue-400';
      case 'win': return 'text-gold';
      case 'streak': return 'text-match';
      default: return 'text-white/50';
    }
  };

  return (
    <section className="bg-[#020814] border-t border-white/5">

      {/* ── Live Activity Ticker ── */}
      <div className="border-b border-white/5 py-4 overflow-hidden relative">
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#020814] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#020814] to-transparent z-10 pointer-events-none" />
        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-10 whitespace-nowrap px-6"
        >
          {[...feed, ...feed].map((item, i) => (
            <div key={`${item.id}-${i}`} className="flex items-center gap-2 text-[10px] font-bold tracking-wide shrink-0">
              <span className={`${typeColor(item.type)} font-black`}>{item.player}</span>
              <span className="text-white/30">{item.action}</span>
              <span className="text-white/60">{item.target}</span>
              <span className="text-primary/60">{item.reward}</span>
              <span className="text-white/10 ml-2">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── How It Works (Gaming Style) ── */}
      <div className="py-24 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white drop-shadow-xl mb-4">
              How The Arena Works
            </h2>
            <p className="text-sm text-white/40 max-w-xl mx-auto font-bold">
              Three steps. Zero complexity. Maximum adrenaline.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`relative group p-8 rounded-2xl border border-white/5 bg-[#060D1A] hover:border-white/15 transition-all ${item.glow.replace('shadow', 'hover:shadow')}`}
              >
                <div className="absolute top-4 right-4 text-[60px] font-black italic text-white/[0.03] leading-none select-none">{item.step}</div>
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform ${item.glow}`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mb-3">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Trust & Compliance Strip ── */}
      <div className="border-t border-white/5 py-10 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Shield, text: 'Non-Custodial Wallets' },
            { icon: Crosshair, text: 'Skill-Based Only' },
            { icon: Flame, text: 'Free Entry Available' },
            { icon: Trophy, text: 'Instant SOL Payouts' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/25 hover:text-white/50 transition-colors">
              <item.icon size={12} className="text-primary/50" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
