'use client';

import React from 'react';
import { Trophy, Clock, Users, Shield, Activity, Zap, Key } from 'lucide-react';
import { ShareButton } from '@/components/contests/ShareButton';
import { ContestPredictionHub } from '@/components/contests/ContestPredictionHub';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getArenaImagery } from '@/lib/graphics';
import { locales } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  primary?: boolean;
}

function StatItem({ icon, label, value, primary }: StatItemProps) {
  return (
    <div className={`px-6 py-4 rounded-2xl border backdrop-blur-xl flex flex-col items-center sm:items-start min-w-[140px] ${primary ? 'bg-primary/5 border-primary/20 shadow-xl' : 'bg-white/5 border-white/10'}`}>
       <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{label}</span>
       <div className="flex items-center gap-2">
          {icon}
          <span className={`text-xl font-black italic tracking-tighter ${primary ? 'text-white' : 'text-white/80'}`}>{value}</span>
       </div>
    </div>
  );
}

interface ContestDetailsContentProps {
  contest: any;
  userWallet?: string;
  existingPredictions: any[];
  isLocked: boolean;
  isEntered: boolean;
  userData: any;
  matches: any[];
}

export function ContestDetailsContent({
  contest,
  userWallet,
  existingPredictions,
  isLocked,
  isEntered,
  userData,
  matches,
}: ContestDetailsContentProps) {
  const { locale } = useAuthStore();
  const t = locales[locale].contestDetails;
  const imagery = getArenaImagery(contest);

  const prizePool = Number(contest.prizePool) / 1_000_000_000;
  const entryFee = Number(contest.entryFeeSOL);

  return (
    <div className="min-h-screen bg-[#020814]">
      
      {/* ── ARENA HERO SECTION ── */}
      <div className="relative h-[350px] lg:h-[420px] flex flex-col justify-end overflow-hidden">
         {/* Adaptive Backdrop */}
         <div className="absolute inset-0">
            <img src={imagery.banner} className="w-full h-full object-cover opacity-60" alt="Backdrop" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-[#020814]/40 to-transparent" />
         </div>

         <div className="container mx-auto px-4 relative z-10 pb-12">
            <Breadcrumbs items={[
               { label: t.arenas, href: '/contests' },
               { label: contest.tournament?.name || 'League', href: `/contests?sport=${contest.tournament?.competition?.sport?.slug}` },
               { label: contest.name }
            ]} />

            <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
               <div className="space-y-6 max-w-3xl">
                  <div className="flex items-center gap-4">
                     <div className="p-2 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/10 shadow-lg">
                        <img src={imagery.badge} className="w-8 h-8 object-contain" alt="Badge" />
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${imagery.accent}`}>{contest.tournament?.name}</span>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{contest.status}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight leading-none text-white">
                           {contest.name}
                        </h1>
                     </div>
                  </div>
               </div>

               {/* Quick Info Bar */}
               <div className="flex flex-wrap items-center gap-4">
                  <StatItem icon={<Trophy className="text-gold" />} label={t.prizeFund} value={prizePool > 0 ? `${prizePool} SOL` : t.tba} primary />
                  <StatItem icon={<Key className="text-primary" />} label={t.entryFee} value={entryFee === 0 ? t.free : `${entryFee} SOL`} />
                  <StatItem icon={<Users className="text-white/40" />} label={t.entries} value={contest.currentEntries} />
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Predictions Area (Main Segment) */}
            <div className="lg:col-span-8 space-y-12">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                       <Zap size={20} className="text-primary" /> {t.tacticalBoard.split(' ')[0]} <span className="text-primary">{t.tacticalBoard.split(' ')[1] || 'Board'}</span>
                    </h2>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t.tacticalDesc}</p>
                  </div>
                  {contest.inviteCode && (
                     <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest border border-primary/10 px-4 py-2 rounded-xl bg-primary/5">
                           <Key size={12} /> {contest.inviteCode}
                        </div>
                        <ShareButton inviteCode={contest.inviteCode} contestName={contest.name} />
                     </div>
                  )}
               </div>

               {!userWallet ? (
                 <div className="glass-premium p-16 rounded-[3rem] text-center border-white/5 shadow-3xl">
                   <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
                      <Shield className="text-primary" size={32} />
                   </div>
                   <h3 className="text-2xl font-black mb-4 text-white uppercase italic">{t.connectPlay}</h3>
                   <p className="text-sm text-white/40 mb-10 italic max-w-sm mx-auto leading-relaxed">{t.connectDesc}</p>
                   <div className="h-14 px-10 bg-primary text-midnight font-black text-xs uppercase tracking-widest rounded-xl inline-flex items-center justify-center shadow-2xl shadow-primary/20">
                      {t.btnConnect}
                   </div>
                 </div>
               ) : (
                 <ContestPredictionHub 
                   contestId={contest.id}
                   matches={matches} 
                   existingPredictions={existingPredictions}
                   isLocked={isLocked}
                   isEntered={isEntered}
                   entryFeeSOL={contest.entryFeeSOL}
                   userWallet={userWallet}
                   userName={userData?.displayName || userWallet}
                 />
               )}
            </div>

            {/* Sidebar (Pragmatic Context) */}
            <div className="lg:col-span-4 space-y-12">
               <div className="glass-premium p-10 rounded-[2.5rem] border-white/5 space-y-8">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 border-b border-white/5 pb-4">{t.arenaIntel}</h4>
                  <div className="space-y-6">
                     <p className="text-sm text-white/60 italic leading-relaxed">
                        {contest.description || (locale === 'es' ? "Predice resultados para acumular puntos. Los resultados precisos otorgan las máximas recompensas de dominio." : "Predict outcomes to accumulate points. Precise results grant maximum dominance rewards.")}
                     </p>
                     
                     <div className="p-6 bg-white/2 rounded-3xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-white/40">{t.scoringProtocol}</span>
                           <span className="text-primary">{t.v42}</span>
                        </div>
                        <ul className="space-y-3 text-[9px] font-black text-white/20 uppercase tracking-widest">
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> {t.exactScore}: 100 {t.free === 'GRATIS' ? 'PTS' : 'PTS'}</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10" /> {t.goalDiff}: 50 {t.free === 'GRATIS' ? 'PTS' : 'PTS'}</li>
                           <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/10" /> {t.outcome}: 30 {t.free === 'GRATIS' ? 'PTS' : 'PTS'}</li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
