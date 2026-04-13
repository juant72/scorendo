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
import { calculateMatchPoints } from '@/lib/scoring';
import { MatchTicket } from './MatchTicket';
import { exportMatchTicket } from '@/lib/ticket-exporter';
import { CommunityTrends } from './CommunityTrends';
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
  const [predictions, setPredictions] = useState<Record<string, { home: string, away: string }>>(
    existingPredictions.reduce((acc, pred) => {
      if (pred.predictedHome !== null && pred.predictedAway !== null) {
        acc[pred.matchId] = { home: pred.predictedHome.toString(), away: pred.predictedAway.toString() };
      }
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any)
  );

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', msg: string, lastSaved?: string, xpEarned?: number } | null>(null);
  const [sharingMatchId, setSharingMatchId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

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

    if (onPredictionsChange) {
       let total = 0;
       matches.forEach(m => {
          const scores = predictions[m.id];
          if (!scores || scores.home === '' || scores.away === '') return;
          const pred = { home: parseInt(scores.home), away: parseInt(scores.away) };
          if (!isNaN(pred.home) && !isNaN(pred.away)) {
            total += calculateMatchPoints(pred, pred); 
          }
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
    if (isLive) return;
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
        <div className="sticky top-16 z-50 flex items-center justify-between gap-4 py-3 bg-[#020814]/90 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-primary animate-pulse'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{isLive ? 'Arena Locked' : 'Predictions Open'}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {saving ? (
              <><Loader2 className="w-3 h-3 text-primary animate-spin" /><span className="text-[9px] font-bold text-white/50 uppercase">Syncing...</span></>
            ) : saveStatus?.lastSaved ? (
              <><CheckCircle2 className="w-3 h-3 text-primary" /><span className="text-[9px] font-bold text-primary uppercase">Saved {saveStatus.lastSaved}</span></>
            ) : (
              <span className="text-[9px] font-bold text-white/30 uppercase">Ready</span>
            )}
          </div>
        </div>

        {/* ═ DENSE DATA LIST ═ */}
        <div className="space-y-3">
          {matches.map((match) => {
            const pred = predictions[match.id] || { home: '', away: '' };
            return (
              <div key={match.id} className="relative group bg-[#060D1A] rounded-xl border border-white/5 hover:border-primary/30 transition-colors flex flex-col md:flex-row shadow-md overflow-hidden">
                 {/* Match Info Side */}
                 <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 items-center border-b md:border-b-0 md:border-r border-white/5">
                    {/* Time / Status (Left corner) */}
                    <div className="w-full md:w-16 flex md:flex-col justify-between md:justify-center items-center md:items-start text-[10px] font-bold text-white/30 tracking-wider">
                       <span>{match.kickoff ? new Date(match.kickoff).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</span>
                       <span className="font-medium">{match.kickoff ? new Date(match.kickoff).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>

                    {/* Team Names */}
                    <div className="flex-1 flex items-center justify-between w-full space-x-4">
                       <div className="flex items-center gap-3 flex-1 justify-end">
                          <span className="text-sm md:text-base font-bold text-white tracking-wide truncate">{match.homeTeam.name}</span>
                          <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.homeTeam.code} size="sm" hideName /></div>
                       </div>
                       <span className="text-xs font-bold text-white/20 italic">VS</span>
                       <div className="flex items-center gap-3 flex-1 justify-start">
                          <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.awayTeam.code} size="sm" hideName /></div>
                          <span className="text-sm md:text-base font-bold text-white tracking-wide truncate">{match.awayTeam.name}</span>
                       </div>
                    </div>
                 </div>

                 {/* Input Core (Right side) */}
                 <div className="flex flex-row items-center justify-center p-4 gap-6 bg-black/20 shrink-0">
                    <div className="flex items-center gap-2">
                       <input 
                         type="text"
                         inputMode="numeric"
                         value={pred.home}
                         onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                         disabled={isLive}
                         placeholder="-"
                         className="w-12 h-14 bg-black/60 border border-white/10 rounded-lg text-center text-xl font-black text-white focus:bg-white/5 focus:border-primary transition-all outline-none"
                       />
                       <span className="text-lg font-bold text-white/10">:</span>
                       <input 
                         type="text"
                         inputMode="numeric"
                         value={pred.away}
                         onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                         disabled={isLive}
                         placeholder="-"
                         className="w-12 h-14 bg-black/60 border border-white/10 rounded-lg text-center text-xl font-black text-white focus:bg-white/5 focus:border-primary transition-all outline-none"
                       />
                    </div>
                    
                    {/* Share Action */}
                    <button 
                      onClick={() => handleShare(match.id)}
                      disabled={sharingMatchId === match.id}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      title="Share Prediction"
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
