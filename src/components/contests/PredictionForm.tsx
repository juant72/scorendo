'use client';

import { useState } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { Loader2, Shield, ChevronRight, Sparkles } from 'lucide-react';

interface TeamProps { name: string; code: string; }
interface MatchProps { 
  id: string; 
  matchNumber: number; 
  kickoff: Date; 
  status: string; 
  homeTeam: TeamProps; 
  awayTeam: TeamProps; 
}

interface PredictionData {
  id: string;
  matchId: string;
  predictedHome: number | null;
  predictedAway: number | null;
  predictedWinner: string;
}

interface PredictionFormProps {
  contestId: string;
  matches: MatchProps[];
  existingPredictions: PredictionData[];
  isLive: boolean; 
  isEntered: boolean; 
  entryFeeSOL?: number;
}

export function PredictionForm({ contestId, matches, existingPredictions, isLive, isEntered, entryFeeSOL = 0 }: PredictionFormProps) {
  const [predictions, setPredictions] = useState<Record<string, { home: string, away: string }>>(
    existingPredictions.reduce((acc, pred) => {
      if (pred.predictedHome !== null && pred.predictedAway !== null) {
        acc[pred.matchId] = { home: pred.predictedHome.toString(), away: pred.predictedAway.toString() };
      }
      return acc;
    }, {} as any)
  );

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleScoreChange = (matchId: string, team: 'home' | 'away', val: string) => {
    const safeVal = val.replace(/[^0-9]/g, '').slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: '', away: '' }),
        [team]: safeVal
      }
    }));
    setSaveStatus(null);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const formattedPredictions = Object.entries(predictions).map(([matchId, scores]) => {
        const homeScore = parseInt(scores.home);
        const awayScore = parseInt(scores.away);
        let winner = 'DRAW';
        if (homeScore > awayScore) winner = 'HOME';
        else if (awayScore > homeScore) winner = 'AWAY';

        return { matchId, predictedHome: homeScore, predictedAway: awayScore, predictedWinner: winner };
      }).filter(p => !isNaN(p.predictedHome) && !isNaN(p.predictedAway));

      if (formattedPredictions.length === 0) {
        setSaveStatus({ type: 'error', msg: 'Enter score predictions to continue.' });
        return;
      }

      const res = await fetch('/api/predictions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId, predictions: formattedPredictions })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: 'success', msg: 'Predictions locked in the stadium vault!' });
      } else {
        const errorMsg = data.error === 'PAYMENT_REQUIRED' 
          ? '💰 Entry Ticket required for this Pro Battle.'
          : (data.error || 'Failed to save.');
        setSaveStatus({ type: 'error', msg: errorMsg });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', msg: 'Connection error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-16 relative">
      <div className="flex items-center justify-between gap-6 mb-12">
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
         <div className="text-[10px] font-black uppercase tracking-[0.6em] text-primary whitespace-nowrap opacity-60">Tactical Scoreboard</div>
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-12">
        {matches.map((match) => {
          const pred = predictions[match.id] || { home: '', away: '' };

          return (
            <div key={match.id} className="group relative stadium-shadow bg-midnight/40 rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all">
               <div className="absolute inset-0 bg-net opacity-5 pointer-events-none" />
               <div className="absolute inset-0 stadium-flare opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               
               <div className="relative z-10 p-10 md:p-16 flex flex-col items-center">
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                     
                     {/* Home Team */}
                     <div className="flex-1 flex flex-col items-center group-hover:-translate-y-1 transition-transform">
                        <div className="h-28 w-28 rounded-[2.5rem] glass-strong flex items-center justify-center mb-6 stadium-shadow">
                           <Shield className="w-14 h-14 text-white opacity-20" />
                           <div className="absolute text-2xl font-black text-white">{match.homeTeam.code}</div>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter text-center leading-[0.9]">
                           {match.homeTeam.name}
                        </h4>
                     </div>

                     {/* Scoreboard Inputs */}
                     <div className="flex items-center gap-8 px-8 py-6 bg-black/20 rounded-[3rem] border border-white/5 backdrop-blur-sm">
                        <input 
                           type="text"
                           inputMode="numeric"
                           value={pred.home}
                           onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                           disabled={isLive || saving}
                           placeholder="0"
                           className="w-24 h-36 bg-white/5 border-2 border-white/10 rounded-[2rem] text-center text-7xl font-black text-white focus:border-primary focus:bg-primary/10 transition-all outline-none stadium-shadow placeholder:opacity-10"
                        />
                        <div className="text-4xl font-black text-primary italic opacity-20">VS</div>
                        <input 
                           type="text"
                           inputMode="numeric"
                           value={pred.away}
                           onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                           disabled={isLive || saving}
                           placeholder="0"
                           className="w-24 h-36 bg-white/5 border-2 border-white/10 rounded-[2rem] text-center text-7xl font-black text-white focus:border-primary focus:bg-primary/10 transition-all outline-none stadium-shadow placeholder:opacity-10"
                        />
                     </div>

                     {/* Away Team */}
                     <div className="flex-1 flex flex-col items-center group-hover:-translate-y-1 transition-transform">
                        <div className="h-28 w-28 rounded-[2.5rem] glass-strong flex items-center justify-center mb-6 stadium-shadow">
                           <Shield className="w-14 h-14 text-white opacity-20" />
                           <div className="absolute text-2xl font-black text-white">{match.awayTeam.code}</div>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter text-center leading-[0.9]">
                           {match.awayTeam.name}
                        </h4>
                     </div>

                  </div>

                  <div className="w-full pt-8 border-t border-white/5 flex items-center justify-center gap-10">
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Kickoff {new Date(match.kickoff).toLocaleDateString()}</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest">Locked in Arena</span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {!isLive && (
        <div className="pt-12 flex flex-col items-center gap-10">
           
           {(!isEntered && entryFeeSOL > 0) && (
              <div className="w-full glass-strong p-8 rounded-[3rem] border-gold/30 flex flex-col md:flex-row items-center justify-between gap-8 stadium-shadow relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -mr-32 -mt-32" />
                 <div className="relative z-10 text-center md:text-left">
                    <h5 className="text-2xl font-black text-white uppercase italic leading-none mb-2">Pro Battle Locked</h5>
                    <p className="text-xs text-muted-foreground font-medium">Join this arena with {entryFeeSOL} SOL to compete for the prize pool.</p>
                 </div>
                 <button className="relative z-10 h-16 px-10 rounded-2xl bg-gold text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-gold/20 active:scale-95">
                    Pay Entry Fee
                 </button>
              </div>
           )}

           <button 
             onClick={handleSubmit}
             disabled={saving || !isEntered}
             className="relative group h-28 px-24 bg-primary rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,230,118,0.3)] hover:shadow-[0_40px_80px_rgba(0,230,118,0.5)] transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
           >
              <div className="flex items-center gap-6">
                 <span className="text-3xl font-black text-midnight uppercase tracking-tighter italic">
                    {saving ? 'Authenticating...' : 'Lock Predictions'}
                 </span>
                 <div className="p-3 bg-midnight/20 rounded-2xl group-hover:translate-x-3 transition-transform">
                    <ChevronRight className="w-8 h-8 text-midnight" />
                 </div>
              </div>
           </button>
           
           {saveStatus && (
              <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border-2 animate-in fade-in slide-in-from-top-4 duration-500 ${saveStatus.type === 'success' ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-red-500/10 border-red-500/40 text-red-400'}`}>
                 <Sparkles className="w-5 h-5" />
                 <span className="text-xs font-black uppercase tracking-widest italic">{saveStatus.msg}</span>
              </div>
           )}
        </div>
      )}
    </div>
  );
}
