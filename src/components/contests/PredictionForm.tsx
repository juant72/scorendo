'use client';

import { useState } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { Loader2, Save } from 'lucide-react';
import { MatchCard } from '@/components/matches/MatchCard';

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
  isLive: boolean; // if true, prediction edits are locked
}

export function PredictionForm({ contestId, matches, existingPredictions, isLive }: PredictionFormProps) {
  // State holds the predictions typed by the user keyed by Match ID
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

  const calculateWinner = (home: string, away: string) => {
    const h = parseInt(home);
    const a = parseInt(away);
    if (isNaN(h) || isNaN(a)) return null;
    if (h > a) return PredictionOutcome.HOME;
    if (a > h) return PredictionOutcome.AWAY;
    return PredictionOutcome.DRAW;
  };

  const handleScoreChange = (matchId: string, team: 'home' | 'away', val: string) => {
    // We remove aggressive regex checks because some OS keyboards append zero-width spaces or behave weirdly.
    // Allow raw state entry, and sanitize at submission.
    
    // Optional: Just strip alphabetical characters safely without aborting
    const safeVal = val.replace(/[^0-9]/g, '').slice(0, 2);

    setPredictions(prev => {
      const currentMatch = prev[matchId] || { home: '', away: '' };
      return {
        ...prev,
        [matchId]: {
          ...currentMatch,
          [team]: safeVal
        }
      };
    });
    setSaveStatus(null);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);

      // We transform the state into numbers and outcome enums
      const formattedPredictions = Object.entries(predictions).map(([matchId, scores]) => {
        const homeScore = parseInt(scores.home);
        const awayScore = parseInt(scores.away);
        
        let winner = 'DRAW';
        if (homeScore > awayScore) winner = 'HOME';
        else if (awayScore > homeScore) winner = 'AWAY';

        return {
          matchId,
          predictedHome: homeScore,
          predictedAway: awayScore,
          predictedWinner: winner,
        };
      }).filter(p => !isNaN(p.predictedHome) && !isNaN(p.predictedAway));

      if (formattedPredictions.length === 0) {
        setSaveStatus({ type: 'error', msg: 'Enter at least one full prediction.' });
        return;
      }

      // API Call
      const res = await fetch('/api/predictions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId, predictions: formattedPredictions })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({ type: 'success', msg: 'Predictions locked successfully!' });
      } else {
        setSaveStatus({ type: 'error', msg: data.error || 'Failed to save predictions.' });
      }

    } catch (error) {
      setSaveStatus({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
        <p className="text-muted-foreground text-sm">
          {isLive ? '🔒 Predictions are securely locked.' : '🔮 Enter your precise score predictions below.'}
        </p>
        
        {!isLive && (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold hover:glow-green transition-all shadow-[0_0_15px_rgba(0,230,118,0.2)] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Lock Predictions'}
          </button>
        )}
      </div>

      {saveStatus && (
        <div className={`p-4 rounded-xl text-center text-sm font-bold mb-6 ${saveStatus.type === 'success' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
          {saveStatus.msg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {matches.map(match => {
          const pred = predictions[match.id] || { home: '', away: '' };
          const winner = calculateWinner(pred.home, pred.away);

          // We wrap the standard MatchCard with Interactive Inputs for eSports prediction UX
          return (
            <div key={match.id} className="relative group">
               <MatchCard
                 matchNumber={match.matchNumber}
                 homeTeam={{ name: match.homeTeam.name, code: match.homeTeam.code }}
                 awayTeam={{ name: match.awayTeam.name, code: match.awayTeam.code }}
                 kickoff={match.kickoff}
                 status={match.status as MatchStatus}
                 phaseName="Group Stage" // Dummy fallback or derived
                 predictedWinner={winner}
                 renderCenter={
                   <div className="flex items-center justify-center gap-4 sm:gap-6">
                     <input 
                       type="text"
                       inputMode="numeric"
                       maxLength={2}
                       value={pred.home}
                       onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                       disabled={isLive || saving}
                       className="w-14 h-14 sm:w-16 sm:h-16 bg-black/80 border-2 border-white/20 rounded-xl text-center text-2xl font-black text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all focus:glow-green outline-none disabled:opacity-50"
                       placeholder="-"
                     />
                     <span className="text-muted-foreground/50 font-bold">:</span>
                     <input 
                       type="text"
                       inputMode="numeric"
                       maxLength={2}
                       value={pred.away}
                       onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                       disabled={isLive || saving}
                       className="w-14 h-14 sm:w-16 sm:h-16 bg-black/80 border-2 border-white/20 rounded-xl text-center text-2xl font-black text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all focus:glow-green outline-none disabled:opacity-50"
                       placeholder="-"
                     />
                   </div>
                 }
               />
            </div>
          );
        })}
      </div>
    </div>
  );
}
