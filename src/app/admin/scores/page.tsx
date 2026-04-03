'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Zap, Search, CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminScoresPage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [settlingId, setSettlingId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: string, away: string }>>({});

  useEffect(() => {
    fetch('/api/contests/league')
      .then(res => res.json())
      .then(json => {
        if (json.success) setLeagues(json.competitions || []);
      });
  }, []);

  const fetchMatches = async () => {
    if (!selectedLeague) return;
    setLoadingMatches(true);
    try {
      const res = await fetch(`/api/contests/league/${selectedLeague}`);
      const data = await res.json();
      if (data.success && data.competition.tournaments?.[0]?.phases) {
        // Flatten all matches from all phases for this admin view
        const allMatches = data.competition.tournaments[0].phases.flatMap((p: any) => 
          p.matches.map((m: any) => ({ ...m, phaseName: p.name }))
        );
        setMatches(allMatches);
        
        // Initialize scores state
        const initialScores: any = {};
        allMatches.forEach((m: any) => {
          initialScores[m.id] = { 
            home: m.homeScore?.toString() || '', 
            away: m.awayScore?.toString() || '' 
          };
        });
        setScores(initialScores);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleScoreChange = (id: string, team: 'home' | 'away', val: string) => {
    setScores(prev => ({
      ...prev,
      [id]: { ...prev[id], [team]: val }
    }));
  };

  const handleSettle = async (matchId: string) => {
    const s = scores[matchId];
    if (s.home === '' || s.away === '') return;

    setSettlingId(matchId);
    try {
      const res = await fetch(`/api/admin/matches/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          homeScore: parseInt(s.home), 
          awayScore: parseInt(s.away) 
        })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state to mark as finished
        setMatches(prev => prev.map(m => 
          m.id === matchId ? { ...m, status: 'FINISHED', homeScore: parseInt(s.home), awayScore: parseInt(s.away) } : m
        ));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettlingId(null);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">Prophets <span className="text-primary">of Truth</span></h1>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Official Score Settlement Engine</p>
         </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-strong p-6 rounded-3xl border-white/5 flex gap-4 items-end">
         <div className="flex-1 space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Target Competition</label>
            <select 
              value={selectedLeague} 
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-all appearance-none"
            >
              <option value="">-- SELECT LEAGUE --</option>
              {leagues.map(l => (
                  <option key={l.slug} value={l.slug}>{l.name}</option>
              ))}
            </select>
         </div>
         <button 
           onClick={fetchMatches}
           disabled={loadingMatches || !selectedLeague}
           className="h-14 px-8 bg-primary/10 border border-primary/20 text-primary rounded-2xl font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all flex items-center gap-2"
         >
           {loadingMatches ? <Loader2 className="animate-spin" /> : <Search size={18} />}
           Search Matches
         </button>
      </div>

      {/* Matches List */}
      <div className="grid grid-cols-1 gap-6">
         {matches.map((match) => {
           const isFinished = match.status === 'FINISHED';
           const s = scores[match.id] || { home: '', away: '' };

           return (
              <div key={match.id} className={`glass p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 transition-all ${isFinished ? 'opacity-60 grayscale-[0.5]' : 'ring-1 ring-primary/10'}`}>
                 
                 <div className="flex-1 flex items-center justify-between gap-10 w-full">
                    {/* Home */}
                    <div className="flex-1 text-right space-y-2">
                       <h4 className="text-xl font-black uppercase italic">{match.homeTeam.name}</h4>
                       <span className="text-[10px] font-mono text-muted-foreground">{match.homeTeam.code}</span>
                    </div>

                    {/* Editor */}
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl border border-white/5 relative">
                       {isFinished && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[8px] font-black uppercase px-2 py-1 rounded-full">SETTLED</div>}
                       <input 
                         type="number" 
                         value={s.home}
                         onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                         disabled={isFinished}
                         className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black focus:border-primary outline-none transition-all"
                       />
                       <div className="text-white/20 font-black italic">VS</div>
                       <input 
                         type="number" 
                         value={s.away}
                         onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                         disabled={isFinished}
                         className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black focus:border-primary outline-none transition-all"
                       />
                    </div>

                    {/* Away */}
                    <div className="flex-1 text-left space-y-2">
                       <h4 className="text-xl font-black uppercase italic">{match.awayTeam.name}</h4>
                       <span className="text-[10px] font-mono text-muted-foreground">{match.awayTeam.code}</span>
                    </div>
                 </div>

                 {/* Action */}
                 <div className="w-full md:w-auto">
                    {!isFinished ? (
                      <button 
                        onClick={() => handleSettle(match.id)}
                        disabled={settlingId === match.id || s.home === '' || s.away === ''}
                        className="w-full h-16 px-10 bg-primary text-midnight font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                      >
                         {settlingId === match.id ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                         SUBMIT & SETTLE
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-xs tracking-widest bg-emerald-500/10 px-6 py-4 rounded-2xl border border-emerald-500/20">
                         <CheckCircle2 size={16} />
                         Verified Outcome
                      </div>
                    )}
                 </div>
              </div>
           );
         })}

         {matches.length === 0 && !loadingMatches && (
            <div className="py-20 text-center glass rounded-3xl border-dashed border-white/5 opacity-40">
               <Trophy size={48} className="mx-auto mb-4" />
               <p className="text-xs font-black uppercase tracking-widest italic">Search for active phases to begin settlement</p>
            </div>
         )}
      </div>
    </div>
  );
}
