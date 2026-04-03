'use client';

import React from 'react';
import { TeamBadge } from './TeamBadge';
import { Trophy, Share2, ShieldCheck, Sparkles } from 'lucide-react';

interface MatchTicketProps {
  homeTeam: { name: string; code: string };
  awayTeam: { name: string; code: string };
  prediction: { home: string; away: string };
  contestName: string;
  userName?: string;
}

export function MatchTicket({ 
  homeTeam, 
  awayTeam, 
  prediction, 
  contestName,
  userName = "Elite Predictor" 
}: MatchTicketProps) {
  return (
    <div 
      id="match-ticket-capture"
      className="relative w-[375px] h-[667px] bg-midnight overflow-hidden flex flex-col items-center justify-between p-10 font-sans"
      style={{
        background: 'linear-gradient(135deg, #0A0F14 0%, #1A1F26 100%)',
      }}
    >
      {/* 🔮 HOLOGRAPHIC BACKGROUND ACCENTS */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-gold/10 rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-net opacity-[0.05] pointer-events-none" />

      {/* 🏷️ TICKET HEADER */}
      <div className="relative z-10 w-full flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Trophy className="w-5 h-5 text-gold" />
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] text-white uppercase italic">Scorendo Heritage</span>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <h2 className="text-sm font-black text-primary/60 uppercase tracking-widest text-center mt-2">
          {contestName}
        </h2>
      </div>

      {/* 🏟️ ARENA CARD */}
      <div className="relative z-10 w-full glass-premium-thick rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center gap-8 shadow-2xl">
        <div className="flex items-center justify-between w-full gap-4">
          {/* HOME */}
          <div className="flex-1 flex flex-col items-center gap-4">
             <div className="scale-125">
               <TeamBadge name={homeTeam.name} code={homeTeam.code} size="lg" hideName />
             </div>
             <h3 className="text-xl font-black text-white text-center uppercase italic tracking-tighter leading-none">
               {homeTeam.name}
             </h3>
          </div>

          {/* VS AREA */}
          <div className="flex flex-col items-center gap-4 px-4">
             <div className="text-4xl font-black text-gold italic drop-shadow-[0_0_15px_#FFD700]">VS</div>
          </div>

          {/* AWAY */}
          <div className="flex-1 flex flex-col items-center gap-4">
             <div className="scale-125">
               <TeamBadge name={awayTeam.name} code={awayTeam.code} size="lg" hideName />
             </div>
             <h3 className="text-xl font-black text-white text-center uppercase italic tracking-tighter leading-none">
               {awayTeam.name}
             </h3>
          </div>
        </div>

        {/* 💎 THE PICK */}
        <div className="w-full bg-black/40 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
           <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.4em] mb-3">Official Prediction</span>
           <div className="flex items-center gap-6">
              <span className="text-6xl font-black text-white tabular-nums">{prediction.home}</span>
              <div className="w-4 h-[2px] bg-white/20" />
              <span className="text-6xl font-black text-white tabular-nums">{prediction.away}</span>
           </div>
        </div>
      </div>

      {/* 🏷️ TICKET FOOTER */}
      <div className="relative z-10 w-full flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Issued to</span>
           <div className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <span className="text-xs font-black text-primary italic uppercase">{userName}</span>
           </div>
        </div>

        {/* SCAN ME (QR PLACEHOLDER) */}
        <div className="flex items-center justify-between w-full">
           <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-gold" />
                 <span className="text-[8px] font-black text-gold/60 uppercase tracking-widest">Secured Arena</span>
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em]">SCNDO-2026-PRO</span>
           </div>

           <div className="p-3 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              {/* Simplistic QR Mockup using CSS */}
              <div className="w-10 h-10 flex flex-wrap gap-0.5">
                 {[...Array(25)].map((_, i) => (
                   <div key={i} className={`w-[6px] h-[6px] ${Math.random() > 0.5 ? 'bg-midnight' : 'bg-transparent'}`} />
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* STAMP */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4] pointer-events-none rotate-[-15deg]">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
    </div>
  );
}
