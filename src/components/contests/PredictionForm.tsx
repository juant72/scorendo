'use client';

import { useState, useEffect, useRef } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { TeamBadge } from './TeamBadge';
import { 
  Loader2, 
  Share2, 
  Zap,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { calculateSimplePoints } from '@/lib/scoring';
import { MatchTicket } from './MatchTicket';
import { exportMatchTicket } from '@/lib/ticket-exporter';
import { CommunityTrends } from './CommunityTrends';
import { SharePredictionButton } from './SharePrediction';
import { ConfettiCelebration } from './ConfettiCelebration';

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
  predictedConfidence?: number;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type PredictionEntry = { home: string; away: string; confidence?: number };
  const [predictions, setPredictions] = useState<Record<string, PredictionEntry>>(
    existingPredictions.reduce((acc, pred) => {
      if (pred.predictedHome !== null && pred.predictedAway !== null) {
        const conf = (pred as any).predictedConfidence ?? 5;
        acc[pred.matchId] = { home: pred.predictedHome.toString(), away: pred.predictedAway.toString(), confidence: conf };
      }
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any)
  );

  const [saving, setSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false); // Tension Delay State
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', msg: string, lastSaved?: string, xpEarned?: number } | null>(null);
  const [sharingMatchId, setSharingMatchId] = useState<string | null>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-calculation of points to display in UI (No auto-saving)
  useEffect(() => {
    if (!mounted) return;
    if (onPredictionsChange) {
       let total = 0;
       matches.forEach(m => {
          const scores = predictions[m.id];
          if (!scores || scores.home === '' || scores.away === '') return;
          const pred = { home: parseInt(scores.home), away: parseInt(scores.away) };
          if (!isNaN(pred.home) && !isNaN(pred.away)) {
            total += calculateSimplePoints(pred, pred); 
          }
       });
       onPredictionsChange(total);
    }
  }, [predictions, mounted]);

  const executeLockIn = async () => {
    // Stage 1: Tension Validation Effect
    setIsValidating(true);
    setSaveStatus(null);
    
    const formattedPredictions = Object.entries(predictions).map(([matchId, scores]) => {
      const homeScore = parseInt(scores.home);
      const awayScore = parseInt(scores.away);
      if (isNaN(homeScore) || isNaN(awayScore)) return null;
      let winner = 'DRAW';
      if (homeScore > awayScore) winner = 'HOME';
      else if (awayScore > homeScore) winner = 'AWAY';
      return { matchId, predictedHome: homeScore, predictedAway: awayScore, predictedWinner: winner };
    }).filter(Boolean);

    // Simulate 1.5s tension delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsValidating(false);

    if (formattedPredictions.length > 0) {
      await savePredictions(formattedPredictions);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const saveOffline = () => {
    // Persist current partial predictions to localStorage for offline work
    const payload = {
      contestId,
      predictions,
      timestamp: Date.now(),
    };
    localStorage.setItem('scorendo_offline_predictions', JSON.stringify(payload));
    setOfflineSaved(true);
    setTimeout(() => setOfflineSaved(false), 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        setSaveStatus({ 
          type: 'success', 
          msg: 'Sync completed', 
          lastSaved: new Date().toLocaleTimeString(),
          xpEarned: data.xpEarned 
        });
        if(data.xpEarned > 0) setShowConfetti(true);
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
    if (isLive || saving || isValidating) return;
    const safeVal = val.replace(/[^0-9]/g, '').slice(0, 2);
    setHasUnsavedChanges(true);
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

  const handleShare = async (matchId: string) => {
    setSharingMatchId(matchId);
    setTimeout(async () => {
      try {
        await exportMatchTicket('match-ticket-capture', `Scorendo_Prediction_${matchId}`);
      } finally {
        setSharingMatchId(null);
      }
    }, 100);
  };

  if (!mounted) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <>
    <PageTransition>
      <div className="space-y-6 relative pb-16">
        {/* ═ COMPACT TOP SYNC BAR ═ */}
        <div className="sticky top-[4.5rem] z-40 flex items-center justify-between gap-4 py-3 bg-[#020814]/90 backdrop-blur-md border-b border-white/5 shadow-md">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-primary animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.5)]'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{isLive ? 'Arena Locked' : 'Oracle Sync Active'}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {isValidating ? (
              <><Loader2 className="w-3 h-3 text-gold animate-spin" /><span className="text-[9px] font-black text-gold uppercase animate-pulse">Computing Matrix...</span></>
            ) : saving ? (
              <><Loader2 className="w-3 h-3 text-primary animate-spin" /><span className="text-[9px] font-black text-primary uppercase">Transmitting...</span></>
            ) : saveStatus?.lastSaved ? (
              <><CheckCircle2 className="w-3 h-3 text-primary" /><span className="text-[9px] font-bold text-white/50 uppercase">Secured {saveStatus.lastSaved}</span></>
            ) : (
              <span className="text-[9px] font-bold text-white/30 uppercase">Awaiting Input</span>
            )}
          </div>
        </div>

        {/* ═ DENSE DATA LIST ═ */}
        <div className="space-y-3">
          {matches.map((match) => {
            const pred = predictions[match.id] || { home: '', away: '' };
            return (
               <div key={match.id} className="relative group bg-[#060D1A] rounded-xl border-2 border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-all flex flex-col sm:flex-row shadow-md overflow-hidden touch-manipulation">
                  {/* Match Info Side */}
                  <div className="flex-1 flex flex-col sm:flex-row p-3 sm:p-4 gap-2 sm:gap-4 items-center border-b sm:border-b-0 sm:border-r border-white/5">
                     {/* Time / Status */}
                     <div className="w-full sm:w-16 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start text-[10px] font-bold text-white/30 tracking-wider">
                        <span>{match.kickoff ? new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</span>
                        <span className="font-medium">{match.kickoff ? new Date(match.kickoff).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                     </div>

                     {/* Team Names - Stack on mobile */}
                     <div className="flex-1 flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                           <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate hidden sm:block">{match.homeTeam.name}</span>
                           <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate sm:hidden">{match.homeTeam.code}</span>
                           <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.homeTeam.code} size="sm" hideName /></div>
                        </div>
                        <span className="text-xs font-bold text-white/20 italic shrink-0">VS</span>
                       <div className="flex items-center gap-3 flex-1 justify-start">
                          <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.awayTeam.code} size="sm" hideName /></div>
                          <span className="text-sm md:text-base font-bold text-white tracking-wide truncate">{match.awayTeam.name}</span>
                       </div>
                    </div>
                 </div>

{/* Input Core - Touch optimized */}
                  <div className="flex flex-row items-center justify-center p-2 sm:p-4 gap-2 sm:gap-6 bg-black/20 shrink-0">
                     <div className="flex items-center gap-1 sm:gap-2">
                <input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={pred.home}
                  onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                  disabled={isLive || saving || isValidating}
                  placeholder="-"
                  className="w-14 h-14 sm:w-12 sm:h-14 bg-black/80 border-2 border-white/10 rounded-lg text-center text-xl sm:text-xl font-black text-white tabular-nums focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all outline-none placeholder:text-white/15 touch-manipulation"
                />
                {/* Confidence selector for MVP */}
                <div className="flex items-center gap-2 pl-2 pr-2 pt-1 pb-1 rounded bg-white/5 border border-white/10 text-xs">
                  <span className="text-white/70">Conf</span>
                  <input 
                    type="number" 
                    min={1} max={10} step={1}
                    value={predictions[match.id]?.confidence ?? 5}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 5;
                      setPredictions(prev => ({
                        ...prev,
                        [match.id]: {
                          ...(prev[match.id] || { home: '', away: '' }),
                          confidence: v
                        }
                      }));
                    }}
                    className="w-12 h-6 border rounded px-1 text-center text-[10px]"
                  />
                </div>
                        <span className="text-lg font-bold text-white/10 hidden sm:inline">:</span>
                        <input 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={pred.away}
                          onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                          disabled={isLive || saving || isValidating}
                          placeholder="-"
                          className="w-14 h-14 sm:w-12 sm:h-14 bg-black/80 border-2 border-white/10 rounded-lg text-center text-xl sm:text-xl font-black text-white tabular-nums focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all outline-none placeholder:text-white/15 touch-manipulation"
                        />
                     </div>
                    
                    {/* Share Action */}
                    <button 
                      onClick={() => handleShare(match.id)}
                      disabled={sharingMatchId === match.id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Export Battle Record"
                    >
                      {sharingMatchId === match.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Share2 className="w-4 h-4" />}
                    </button>
                 </div>
              </div>
            );
          })}
        </div>

        {/* ══ PREMIUM ARENA ENTRY ══ */}
        {!isLive && (!isEntered && entryFeeSOL > 0) && (
          <div className="pt-8">
            <div className="w-full bg-gold/5 p-6 rounded-2xl border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <Trophy className="text-gold w-8 h-8" />
                 <div>
                    <h5 className="text-lg font-bold text-gold uppercase tracking-wide">Pro Battle Entry</h5>
                    <p className="text-xs text-white/50">Fee: {entryFeeSOL} SOL to validate predictions on chain.</p>
                 </div>
              </div>
              <button className="h-10 px-8 rounded-lg bg-gold text-midnight font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg">
                Authorize & Lock
              </button>
            </div>
          </div>
        )}

        {/* ══ HIDDEN CAPTURE AREA ══ */}
        <div className="fixed top-[-5000px] left-0 pointer-events-none overflow-hidden">
          {sharingMatchId && (
            <MatchTicket 
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              homeTeam={matches.find(m => m.id === sharingMatchId)!.homeTeam}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              awayTeam={matches.find(m => m.id === sharingMatchId)!.awayTeam}
              prediction={predictions[sharingMatchId] || { home: '0', away: '0' }}
              contestName="- LIGA PRAGMATICA -"
            />
          )}
        </div>
      </div>

      {/* ══ THE LOCK-IN TENSION BUTTON ══ */}
      <AnimatePresence>
         {hasUnsavedChanges && !isLive && (
            <motion.div
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="fixed bottom-0 left-0 w-full z-[100] p-6 bg-gradient-to-t from-[#020814] via-[#020814]/90 to-transparent flex justify-center pointer-events-none"
            >
               <button
                  onClick={executeLockIn}
                  disabled={isValidating || saving}
                  className={`pointer-events-auto h-16 px-12 rounded-xl border-2 font-black italic uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,0,0,0.8)] ${
                     isValidating || saving 
                     ? 'bg-gold border-gold text-midnight scale-105 shadow-[0_0_30px_rgba(255,215,0,0.6)]' 
                     : 'bg-primary border-primary text-midnight hover:bg-primary/90 shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:shadow-[0_0_40px_rgba(0,230,118,0.6)]'
                  }`}
               >
                  <span className="flex items-center gap-3">
                     {isValidating || saving ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
                     {isValidating ? 'Validating Link...' : saving ? 'Transmitting...' : 'Lock In Sequence'}
                  </span>
               </button>
            </motion.div>
         )}
      </AnimatePresence>

    </PageTransition>

    {/* ══ CELEBRATION ══ */}
    <ConfettiCelebration show={showConfetti} onComplete={() => setShowConfetti(false)} />

    {/* ══ SUCCESS TOAST ══ */}
    <AnimatePresence>
      {saveStatus?.type === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[100] bg-primary text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl"
        >
          <Zap size={14} fill="black" />
          LOCKED IN! +{saveStatus.xpEarned} XP
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
