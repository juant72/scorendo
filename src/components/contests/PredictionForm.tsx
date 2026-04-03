'use client';

import { useState, useEffect } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { TeamBadge } from './TeamBadge';
import { Loader2, Shield, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition, StaggerChildren, FadeInItem } from '@/components/layout/PageTransition';
import { calculateMatchPoints } from '@/lib/scoring';

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
  onPredictionsChange?: (points: number) => void;
}

export function PredictionForm({ contestId, matches, existingPredictions, isLive, isEntered, entryFeeSOL = 0, onPredictionsChange }: PredictionFormProps) {
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save logic with debounce
  useEffect(() => {
    if (!mounted) return;
    const formattedPredictions = Object.entries(predictions).map(([matchId, scores]) => {
      const homeScore = parseInt(scores.home);
      const awayScore = parseInt(scores.away);
      if (isNaN(homeScore) || isNaN(awayScore)) return null;
      
      let winner = 'DRAW';
      if (homeScore > awayScore) winner = 'HOME';
      else if (awayScore > homeScore) winner = 'AWAY';
      return { matchId, predictedHome: homeScore, predictedAway: awayScore, predictedWinner: winner };
    }).filter(Boolean);

    // Calculate simulated points
    if (onPredictionsChange) {
       let total = 0;
       matches.forEach(m => {
          const scores = predictions[m.id];
          if (!scores || scores.home === '' || scores.away === '') return;
          const pred = { home: parseInt(scores.home), away: parseInt(scores.away) };
          if (isNaN(pred.home) || isNaN(pred.away)) return;
          // For simulation, we assume PREDICTION matches ACTUAL in the user's mind
          // (Actually, a true simulation needs actual scores, but if they are TBD, 
          // we use the user's picks to show what they WOULD get if they hit)
          total += calculateMatchPoints(pred, pred); 
       });
       onPredictionsChange(total);
    }

    const timer = setTimeout(async () => {

      if (formattedPredictions.length > 0) {
        savePredictions(formattedPredictions);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [predictions, mounted]);

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
    setPredictions(prev => {
      const current = prev[matchId] || { home: '', away: '' };
      return {
        ...prev,
        [matchId]: {
          ...current,
          [team]: safeVal
        }
      };
    });
  };

  if (!mounted) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <PageTransition>
      <div className="space-y-12 sm:space-y-20 relative pb-16">
        {/* ═ TOP SECURE STATUS BAR ═ */}
        <div className="sticky top-0 z-50 flex items-center justify-between gap-4 mb-8 py-4 bg-midnight/80 backdrop-blur-xl border-b border-white/5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-none sm:border-none">
          <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="flex items-center gap-4 px-6 py-2 rounded-xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center gap-2">
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">ARENA_LOCKED</div>
              <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
            </div>
            <div className="h-3 w-[1px] bg-white/10" />
            {saving ? (
              <div className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 className="w-3 h-3 text-primary" />
                </motion.div>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">Syncing</span>
              </div>
            ) : saveStatus?.lastSaved ? (
              <div className="flex items-center gap-2 relative">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -inset-1 bg-primary/20 blur-md rounded-full" />
                <CheckCircle2 className="w-3 h-3 text-primary relative z-10" />
                <span className="text-[9px] font-black text-primary italic uppercase tracking-widest relative z-10">Secured</span>
              </div>
            ) : (
              <div className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">Standby</div>
            )}
          </div>
          <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>

        {/* ═ MATCH GRID ═ */}
        <StaggerChildren delay={0.1}>
          <div className="grid grid-cols-1 gap-12 sm:gap-16">
            {matches.map((match, index) => {
              const pred = predictions[match.id] || { home: '', away: '' };

              return (
                <FadeInItem key={match.id}>
                  <motion.div 
                    whileHover={{ scale: 1.01, rotateY: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative"
                  >
                    {/* ══ STADIUM WATERMARK ══ */}
                    <div className="hidden sm:block absolute -top-14 left-8 text-8xl font-black text-white/5 uppercase italic pointer-events-none select-none tracking-tighter mix-blend-overlay">
                      {index + 1 < 10 ? `MATCH 0${index + 1}` : `MATCH ${index + 1}`}
                    </div>

                    <div className="relative glass-premium-thick rounded-[2rem] sm:rounded-[3rem] overflow-hidden group-hover:border-primary/20 transition-all duration-700">
                      <div className="absolute inset-0 bg-net opacity-[0.1] pointer-events-none" />
                      
                      <div className="relative z-10 p-4 sm:p-14 w-full">
                        <div className="flex flex-row items-center justify-between gap-2 sm:gap-14 w-full">
                          
                          {/* ══ TEAM HOME ══ */}
                          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-6 min-w-0">
                            <div className="hidden sm:block stadium-aura-glow w-24 h-24 lg:w-48 lg:h-48 bg-primary rounded-full group-hover:opacity-20 transition-opacity" />
                            <div className="relative z-10 scale-[0.6] sm:scale-100">
                              <TeamBadge name={match.homeTeam.name} code={match.homeTeam.code} size="lg" hideName />
                            </div>
                            <div className="relative z-10 w-full text-center">
                              <h3 className="text-[10px] sm:text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tighter leading-none truncate block">
                                {match.homeTeam.name}
                              </h3>
                              <span className="hidden sm:block text-[8px] font-black text-primary/40 uppercase tracking-[0.4em] mt-1">{match.homeTeam.code} UNIT</span>
                            </div>
                          </div>

                          {/* ══ TACTICAL SCOREBOARD ══ */}
                          <div className="relative z-20 flex-shrink-0">
                            <div className="stadium-tactical-display px-3 sm:px-12 py-3 sm:py-10 rounded-2xl sm:rounded-[3.5rem] flex items-center gap-2 sm:gap-10 relative z-30 stadium-shadow border border-white/5">
                              <div className="flex flex-col items-center gap-1 sm:gap-2">
                                <input 
                                  type="text"
                                  inputMode="numeric"
                                  value={pred.home}
                                  onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                                  disabled={isLive}
                                  placeholder="-"
                                  className="w-10 h-12 sm:w-28 sm:h-38 bg-black/60 border border-white/10 rounded-xl sm:rounded-3xl text-center text-xl sm:text-7xl font-black text-white focus:border-primary transition-all outline-none"
                                />
                                <div className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-white/20">ATK</div>
                              </div>

                              <div className="text-lg sm:text-6xl font-black text-primary italic drop-shadow-[0_0_15px_#00E676] opacity-90">VS</div>

                              <div className="flex flex-col items-center gap-1 sm:gap-2">
                                <input 
                                  type="text"
                                  inputMode="numeric"
                                  value={pred.away}
                                  onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                                  disabled={isLive}
                                  placeholder="-"
                                  className="w-10 h-12 sm:w-28 sm:h-38 bg-black/60 border border-white/10 rounded-xl sm:rounded-3xl text-center text-xl sm:text-7xl font-black text-white focus:border-primary transition-all outline-none"
                                />
                                <div className="hidden sm:block text-[9px] font-black uppercase tracking-[0.3em] text-white/20">DEF</div>
                              </div>
                            </div>
                          </div>

                          {/* ══ TEAM AWAY ══ */}
                          <div className="flex-1 flex flex-col items-center gap-2 sm:gap-6 min-w-0">
                            <div className="hidden sm:block stadium-aura-glow w-24 h-24 lg:w-48 lg:h-48 bg-primary/40 rounded-full group-hover:opacity-20 transition-opacity" />
                            <div className="relative z-10 scale-[0.6] sm:scale-100">
                              <TeamBadge name={match.awayTeam.name} code={match.awayTeam.code} size="lg" hideName />
                            </div>
                            <div className="relative z-10 w-full text-center">
                              <h3 className="text-[10px] sm:text-2xl lg:text-4xl font-black text-white uppercase italic tracking-tighter leading-none truncate block">
                                {match.awayTeam.name}
                              </h3>
                              <span className="hidden sm:block text-[8px] font-black text-primary/40 uppercase tracking-[0.4em] mt-1">{match.awayTeam.code} UNIT</span>
                            </div>
                          </div>
                        </div>

                        {/* ══ BROADCAST FOOTER ══ */}
                        <div className="w-full mt-4 sm:mt-12 pt-4 sm:pt-10 border-t border-white/[0.05] flex flex-row items-center justify-between gap-4 px-2">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">LIVE_LINK</span>
                          </div>
                          
                          <div className="flex items-center gap-4 sm:gap-10">
                            <div className="flex flex-col items-end">
                              <span className="hidden sm:block text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 text-right">KICKOFF</span>
                              <span className="text-[10px] sm:text-xs font-black text-white uppercase italic tracking-widest text-right">
                                {match.kickoff ? new Date(match.kickoff).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }) : 'TBD'}
                              </span>
                            </div>
                            <div className="h-4 sm:h-8 w-[1px] bg-white/10" />
                            <div className="flex flex-col items-end">
                              <span className="hidden sm:block text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 text-right">LOC</span>
                              <span className="text-[9px] sm:text-xs font-black text-primary uppercase italic tracking-widest text-right">ARENA A</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </FadeInItem>
              );
            })}
          </div>
        </StaggerChildren>

        {/* ══ PREMIUM ARENA ENTRY ══ */}
        {!isLive && (!isEntered && entryFeeSOL > 0) && (
          <div className="pt-20">
            <div className="w-full glass-premium-thick p-10 rounded-[2.5rem] border-gold/40 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-gold/20 rounded-full text-[9px] font-black text-gold uppercase tracking-widest mb-4 border border-gold/20">Pro Battle Required</div>
                <h5 className="text-3xl font-black text-white uppercase italic leading-tight mb-4 tracking-tighter">Initialize Predictions</h5>
                <p className="text-sm text-muted-foreground italic max-w-md opacity-80 underline-offset-4">Allocation of {entryFeeSOL} SOL mandatory for full Arena authorization.</p>
              </div>
              <button className="relative z-10 h-16 px-12 rounded-2xl bg-gold text-midnight font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
                Authorize Entry
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
