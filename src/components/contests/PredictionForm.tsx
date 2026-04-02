'use client';

import { useState } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { TeamBadge } from './TeamBadge';
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
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', msg: string, lastSaved?: string } | null>(null);

  // Auto-save logic with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      const formattedPredictions = Object.entries(predictions).map(([matchId, scores]) => {
        const homeScore = parseInt(scores.home);
        const awayScore = parseInt(scores.away);
        if (isNaN(homeScore) || isNaN(awayScore)) return null;
        
        let winner = 'DRAW';
        if (homeScore > awayScore) winner = 'HOME';
        else if (awayScore > homeScore) winner = 'AWAY';
        return { matchId, predictedHome: homeScore, predictedAway: awayScore, predictedWinner: winner };
      }).filter(Boolean);

      if (formattedPredictions.length > 0) {
        savePredictions(formattedPredictions);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [predictions]);

  const savePredictions = async (formattedPredictions: any) => {
    try {
      setSaving(true);
      const res = await fetch('/api/predictions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId, predictions: formattedPredictions })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: 'success', msg: 'Sync completed', lastSaved: new Date().toLocaleTimeString() });
      } else {
        if (data.error === 'PAYMENT_REQUIRED') {
           setSaveStatus({ type: 'error', msg: '💰 Entry Ticket Required' });
        }
      }
    } catch (error) {
      setSaveStatus({ type: 'error', msg: 'Sync error' });
    } finally {
      setSaving(false);
    }
  };

  const handleScoreChange = (matchId: string, team: 'home' | 'away', val: string) => {
    const safeVal = val.replace(/[^0-9]/g, '').slice(0, 2);
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: '', away: '' }),
        [team]: safeVal
      }
    }));
  };

  return (
    <div className="space-y-12 sm:space-y-20 relative">
      <div className="flex items-center justify-between gap-6 mb-8 sm:mb-12">
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
         <div className="flex items-center gap-4 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Vault</div>
            {saving ? (
               <Loader2 className="w-3 h-3 animate-spin text-primary" />
            ) : saveStatus?.lastSaved ? (
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-bold text-muted-foreground tabular-nums">Saved {saveStatus.lastSaved}</span>
               </div>
            ) : (
               <div className="text-[9px] font-bold text-muted-foreground italic">Ready for predictions</div>
            )}
         </div>
         <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-10 sm:gap-16">
        {matches.map((match) => {
          const pred = predictions[match.id] || { home: '', away: '' };

          return (
            <div key={match.id} className="group relative stadium-shadow bg-midnight/30 rounded-[3rem] sm:rounded-[4rem] overflow-hidden border border-white/5 hover:border-primary/20 transition-all">
               <div className="absolute inset-0 bg-net opacity-5 pointer-events-none" />
               <div className="absolute inset-0 stadium-flare opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               
               <div className="relative z-10 p-8 sm:p-16 flex flex-col items-center">
                  <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 sm:gap-14">
                     
                     <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <TeamBadge name={match.homeTeam.name} code={match.homeTeam.code} />
                        <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">{match.homeTeam.name}</span>
                     </div>

                     {/* Scoreboard Inputs - Optimized for Mobile Thumb Use */}
                     <div className="flex items-center gap-4 sm:gap-8 px-6 sm:px-10 py-5 sm:py-8 bg-black/40 rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 backdrop-blur-xl stadium-shadow">
                        <div className="flex flex-col items-center gap-2">
                           <input 
                              type="text"
                              inputMode="numeric"
                              value={pred.home}
                              onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                              disabled={isLive}
                              placeholder="0"
                              className="w-20 h-28 sm:w-28 sm:h-40 bg-white/5 border-2 border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] text-center text-5xl sm:text-7xl font-black text-white focus:border-primary focus:bg-primary/10 transition-all outline-none shadow-inner placeholder:opacity-5"
                           />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Home</span>
                        </div>

                        <div className="text-3xl sm:text-5xl font-black text-primary italic transform rotate-[-10deg] drop-shadow-[0_0_15px_#00E676]">VS</div>

                        <div className="flex flex-col items-center gap-2">
                           <input 
                              type="text"
                              inputMode="numeric"
                              value={pred.away}
                              onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                              disabled={isLive}
                              placeholder="0"
                              className="w-20 h-28 sm:w-28 sm:h-40 bg-white/5 border-2 border-white/10 rounded-[1.5rem] sm:rounded-[2.5rem] text-center text-5xl sm:text-7xl font-black text-white focus:border-primary focus:bg-primary/10 transition-all outline-none shadow-inner placeholder:opacity-5"
                           />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Away</span>
                        </div>
                     </div>

                     <div className="flex flex-col items-center gap-4 sm:gap-6">
                        <TeamBadge name={match.awayTeam.name} code={match.awayTeam.code} />
                        <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">{match.awayTeam.name}</span>
                     </div>

                  </div>

                  <div className="w-full mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00E676]" />
                        <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Match Analytics Ready</span>
                     </div>
                     <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/10" />
                     <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Kickoff {match.kickoff ? new Date(match.kickoff).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : 'TBD'}</span>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {!isLive && (!isEntered && entryFeeSOL > 0) && (
        <div className="pt-12 flex flex-col items-center gap-10">
            <div className="w-full glass-strong p-8 rounded-[3rem] border-gold/30 flex flex-col md:flex-row items-center justify-between gap-8 stadium-shadow relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -mr-32 -mt-32" />
               <div className="relative z-10 text-center md:text-left">
                  <h5 className="text-2xl font-black text-white uppercase italic leading-none mb-2">Pro Battle Required</h5>
                  <p className="text-xs text-muted-foreground font-medium">Predictions will only be valid after entering the arena with {entryFeeSOL} SOL.</p>
               </div>
               <button className="relative z-10 h-16 px-10 rounded-2xl bg-gold text-midnight font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-gold/20 active:scale-95 leading-none">
                  Enter Pro Arena
               </button>
            </div>
            
            {saveStatus?.type === 'error' && (
               <div className="flex items-center gap-4 px-8 py-4 rounded-2xl border-2 bg-red-500/10 border-red-500/40 text-red-400 animate-in fade-in slide-in-from-top-4 duration-500">
                  <span className="text-xs font-black uppercase tracking-widest">{saveStatus.msg}</span>
               </div>
            )}
        </div>
      )}
    </div>
  );
}
