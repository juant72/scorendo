'use client';

import { useState, useEffect, useRef } from 'react';
import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { TeamBadge } from './TeamBadge';
import { 
  Loader2, 
  Share2, 
  Zap,
  CheckCircle2,
  Trophy,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/layout/PageTransition';
import { calculateSimplePoints } from '@/lib/scoring';
import { MatchTicket } from './MatchTicket';
import { exportMatchTicket } from '@/lib/ticket-exporter';
import { CommunityTrends } from './CommunityTrends';
import { SharePredictionButton } from './SharePrediction';
import { ConfettiCelebration } from './ConfettiCelebration';
import { locales, translateTeamName } from '@/lib/locales';
import { useAuthStore } from '@/store/useAuthStore';

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
  const { locale } = useAuthStore();
  const t = locales[locale].predictionForm;
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

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'predicted'>('all');
  const [phaseFilter, setPhaseFilter] = useState<'all' | 'group' | 'knockout'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

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
        setHasUnsavedChanges(false);
        setSaveStatus({ 
          type: 'success', 
          msg: locale === 'es' ? 'Sincronización completada' : 'Sync completed', 
          lastSaved: new Date().toLocaleTimeString(),
          xpEarned: data.xpEarned 
        });
        if(data.xpEarned > 0) setShowConfetti(true);
      } else {
        if (data.error === 'PAYMENT_REQUIRED') {
           setSaveStatus({ type: 'error', msg: locale === 'es' ? '💰 Boleto de Entrada Requerido' : '💰 Entry Ticket Required' });
        } else {
           setSaveStatus({ type: 'error', msg: data.error || (locale === 'es' ? 'Error al guardar' : 'Error saving predictions') });
        }
      }
    } catch (error) {
      setSaveStatus({ type: 'error', msg: locale === 'es' ? 'Error de sincronización' : 'Sync error' });
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

  // 1. Get unique dates from matches list for date selector
  const uniqueDates = Array.from(
    new Set(matches.map(m => {
       if (!m.kickoff) return '';
       return new Date(m.kickoff).toDateString();
    }).filter(Boolean))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // 2. Perform filtering
  const filteredMatches = matches.filter(match => {
    // Search Query (Teams code or name)
    const homeName = translateTeamName(match.homeTeam.name, locale).toLowerCase();
    const awayName = translateTeamName(match.awayTeam.name, locale).toLowerCase();
    const query = searchQuery.toLowerCase();
    if (query && !homeName.includes(query) && !awayName.includes(query) && !match.homeTeam.code.toLowerCase().includes(query) && !match.awayTeam.code.toLowerCase().includes(query)) {
      return false;
    }

    // Prediction Status Filter
    const pred = predictions[match.id];
    const isPredicted = pred && pred.home !== '' && pred.away !== '';
    if (statusFilter === 'pending' && isPredicted) return false;
    if (statusFilter === 'predicted' && !isPredicted) return false;

    // Phase Filter (group stage: matchNumber 1-72)
    if (phaseFilter === 'group' && match.matchNumber > 72) return false;
    if (phaseFilter === 'knockout' && match.matchNumber <= 72) return false;

    // Date Filter
    if (selectedDate !== 'all') {
      const matchDate = new Date(match.kickoff).toDateString();
      if (matchDate !== selectedDate) return false;
    }

    return true;
  });

  // 3. Count remaining predictions
  const pendingCount = matches.filter(match => {
    const pred = predictions[match.id];
    return !pred || pred.home === '' || pred.away === '';
  }).length;

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <>
    <PageTransition>
      <div className="space-y-6 relative pb-16">
        {/* ═ COMPACT TOP SYNC BAR ═ */}
        <div className="sticky top-[4.5rem] z-40 flex items-center justify-between gap-4 py-3 bg-[#020814]/90 backdrop-blur-md border-b border-white/5 shadow-md">
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-primary animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.5)]'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{isLive ? t.arenaLocked : t.oracleActive}</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10">
            {isValidating ? (
              <><Loader2 className="w-3 h-3 text-gold animate-spin" /><span className="text-[9px] font-black text-gold uppercase animate-pulse">{t.computing}</span></>
            ) : saving ? (
              <><Loader2 className="w-3 h-3 text-primary animate-spin" /><span className="text-[9px] font-black text-primary uppercase">{t.transmitting}</span></>
            ) : saveStatus?.lastSaved ? (
              <><CheckCircle2 className="w-3 h-3 text-primary" /><span className="text-[9px] font-bold text-white/50 uppercase">{t.secured} {saveStatus.lastSaved}</span></>
            ) : (
              <span className="text-[9px] font-bold text-white/30 uppercase">{t.awaitingInput}</span>
            )}
          </div>
        </div>

        {/* ═ FILTER TOOLBAR ═ */}
        <div className="flex flex-col gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input
                type="text"
                placeholder={locale === 'es' ? 'Buscar país...' : 'Search country...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/30 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === 'all' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Todos' : 'All'}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${statusFilter === 'pending' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Pendientes' : 'Pending'}
                {pendingCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-black ${statusFilter === 'pending' ? 'bg-midnight text-primary' : 'bg-white/10 text-white/60'}`}>
                    {pendingCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('predicted')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === 'predicted' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Completados' : 'Predicted'}
              </button>
            </div>

            {/* Phase Filter */}
            <div className="flex bg-black/40 border border-white/10 p-0.5 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setPhaseFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${phaseFilter === 'all' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Todo' : 'All Phases'}
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('group')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${phaseFilter === 'group' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Grupos' : 'Groups'}
              </button>
              <button
                type="button"
                onClick={() => setPhaseFilter('knockout')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${phaseFilter === 'knockout' ? 'bg-primary text-midnight shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                {locale === 'es' ? 'Eliminatorias' : 'Knockouts'}
              </button>
            </div>
          </div>

          {/* Date Selector */}
          {uniqueDates.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 pb-1 px-1 -mx-2">
              <button
                type="button"
                onClick={() => setSelectedDate('all')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                  selectedDate === 'all'
                    ? 'bg-primary border-primary/20 text-midnight shadow-[0_0_10px_rgba(0,230,118,0.2)]'
                    : 'bg-black/20 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                }`}
              >
                {locale === 'es' ? 'Cualquier Fecha' : 'Any Date'}
              </button>
              {uniqueDates.map(dateStr => {
                const d = new Date(dateStr);
                const formatted = d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
                      isSelected
                        ? 'bg-primary border-primary/20 text-midnight shadow-[0_0_10px_rgba(0,230,118,0.2)]'
                        : 'bg-black/20 border-white/5 text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {formatted}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ═ DENSE DATA LIST ═ */}
        <div className="space-y-3">
          {filteredMatches.length === 0 ? (
             <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <Filter className="mx-auto text-white/10 mb-4 animate-pulse" size={32} />
                <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">
                   {locale === 'es' ? 'No se encontraron partidos' : 'No matches found'}
                </h4>
                <p className="text-xs text-white/30 uppercase tracking-widest">
                   {locale === 'es' ? 'Prueba cambiando los filtros seleccionados' : 'Try adjusting your filters'}
                </p>
             </div>
          ) : (
             filteredMatches.map((match) => {
                const pred = predictions[match.id] || { home: '', away: '' };
                const matchKickoffTime = new Date(match.kickoff).getTime();
                const isMatchLocked = isLive || (match.kickoff && Date.now() >= matchKickoffTime - 5 * 60 * 1000);
                return (
                   <div key={match.id} className="relative group bg-[#060D1A] rounded-xl border-2 border-white/5 hover:border-primary/40 hover:shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-all flex flex-col sm:flex-row shadow-md overflow-hidden touch-manipulation">
                      {/* Match Info Side */}
                      <div className="flex-1 flex flex-col sm:flex-row p-3 sm:p-4 gap-2 sm:gap-4 items-center border-b sm:border-b-0 sm:border-r border-white/5">
                         {/* Time / Status */}
                         <div className="w-full sm:w-16 flex sm:flex-col justify-between sm:justify-center items-center sm:items-start text-[10px] font-bold text-white/30 tracking-wider">
                            <span>{match.kickoff ? new Date(match.kickoff).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : 'TBA'}</span>
                            <span className="font-medium">{match.kickoff ? new Date(match.kickoff).toLocaleDateString(locale, { month: 'short', day: 'numeric' }) : ''}</span>
                         </div>
    
                         {/* Team Names - Stack on mobile */}
                         <div className="flex-1 flex items-center justify-between w-full gap-2">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end min-w-0">
                               <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate hidden sm:block">{translateTeamName(match.homeTeam.name, locale)}</span>
                               <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate sm:hidden">{match.homeTeam.code}</span>
                               <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.homeTeam.code} size="sm" hideName isAway={false} /></div>
                            </div>
                            <span className="text-xs font-bold text-white/20 italic shrink-0">VS</span>
                           <div className="flex items-center gap-3 flex-1 justify-start">
                              <div className="w-8 h-8 shrink-0 bg-white/5 rounded-full p-1"><TeamBadge name="" code={match.awayTeam.code} size="sm" hideName isAway={true} homeCode={match.homeTeam.code} /></div>
                              <span className="text-sm md:text-base font-bold text-white tracking-wide truncate">{translateTeamName(match.awayTeam.name, locale)}</span>
                           </div>
                        </div>
                     </div>
    
                      {/* Input Core - Touch optimized */}
                      <div className="flex flex-col sm:flex-row items-center justify-center p-3 sm:p-4 gap-3 sm:gap-4 bg-black/20 shrink-0">
                        {isMatchLocked && (
                          <span className="text-[9px] font-black text-red-500/80 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                            {locale === 'es' ? 'Cerrado' : 'Locked'}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={pred.home}
                            onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                            disabled={isMatchLocked || saving || isValidating}
                            placeholder="-"
                            className="w-12 h-12 bg-black/80 border-2 border-white/10 rounded-lg text-center text-lg font-black text-white tabular-nums focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all outline-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-bold text-white/20">:</span>
                          <input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={pred.away}
                            onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                            disabled={isMatchLocked || saving || isValidating}
                            placeholder="-"
                            className="w-12 h-12 bg-black/80 border-2 border-white/10 rounded-lg text-center text-lg font-black text-white tabular-nums focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all outline-none touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
    
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/60">
                            <span>{t.confidence}</span>
                            <select
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
                              disabled={isMatchLocked || saving || isValidating}
                              className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-white focus:border-primary outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                <option key={val} value={val} className="bg-[#020814]">{val}</option>
                              ))}
                            </select>
                          </div>
    
                          <button 
                            onClick={() => handleShare(match.id)}
                            disabled={sharingMatchId === match.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                            title={locale === 'es' ? 'Exportar Registro de Batalla' : 'Export Battle Record'}
                          >
                            {sharingMatchId === match.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Share2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                   </div>
                );
             })
          )}
        </div>

        {/* ══ PREMIUM ARENA ENTRY ══ */}
        {!isLive && (!isEntered && entryFeeSOL > 0) && (
          <div className="pt-8">
            <div className="w-full bg-gold/5 p-6 rounded-2xl border border-gold/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <Trophy className="text-gold w-8 h-8" />
                 <div>
                    <h5 className="text-lg font-bold text-gold uppercase tracking-wide">{t.proEntry}</h5>
                    <p className="text-xs text-white/50">{t.fee}: {entryFeeSOL} SOL</p>
                 </div>
              </div>
              <button className="h-10 px-8 rounded-lg bg-gold text-midnight font-bold text-xs uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg">
                {t.btnAuthorize}
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
                     {isValidating ? t.btnValidating : saving ? t.transmitting : t.btnLockIn}
                  </span>
               </button>
            </motion.div>
         )}
      </AnimatePresence>

    </PageTransition>

    {/* ══ CELEBRATION ══ */}
    <ConfettiCelebration show={showConfetti} onComplete={() => setShowConfetti(false)} />

    {/* ══ SUCCESS/ERROR TOAST ══ */}
    <AnimatePresence>
      {saveStatus && (
        <motion.div 
          key={saveStatus.type}
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className={`fixed bottom-10 left-1/2 z-[100] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl border ${
            saveStatus.type === 'success'
              ? 'bg-primary border-primary/20 text-midnight'
              : 'bg-red-950 border-red-500/30 text-red-200'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <>
              <Zap size={14} fill="currentColor" />
              {t.lockedInToast} {saveStatus.xpEarned ? `+${saveStatus.xpEarned} XP` : ''}
            </>
          ) : (
            <>
              <AlertTriangle size={14} className="text-red-400 animate-pulse" />
              {saveStatus.msg}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
