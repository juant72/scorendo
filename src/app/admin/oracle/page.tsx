'use client';

import React, { useState, useEffect } from 'react';
import { Target, Zap, Clock, Trophy, Save, Loader2, Search, Filter, ShieldCheck, XCircle, Activity, Fuel, ArrowUpRight, Database, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeamBadge } from '@/components/contests/TeamBadge';

export default function OracleHub() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: number, away: number }>>({});
  const [activeSport, setActiveSport] = useState<string>('football');

  const fetchMatches = async (sport?: string) => {
    setLoading(true);
    try {
      const targetSport = sport || activeSport;
      const res = await fetch(`/api/contests/matches?status=SCHEDULED,LIVE&sport=${targetSport}`);
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
        const initialScores: any = {};
        (data.matches || []).forEach((m: any) => {
          initialScores[m.id] = { home: m.homeScore || 0, away: m.awayScore || 0 };
        });
        setScores(initialScores);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeSport);
  }, [activeSport]);

  const handleScoreUpdate = async (matchId: string) => {
    const matchScores = scores[matchId];
    if (matchScores.home === undefined || matchScores.away === undefined) return;

    setSavingId(matchId);
    try {
      const res = await fetch(`/api/admin/matches/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeScore: Number(matchScores.home),
          awayScore: Number(matchScores.away)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Match Stabilized & Scored.');
        fetchMatches();
      } else {
        alert('Oracle Error: ' + data.error);
      }
    } catch (err) {
      alert('Network Instability Detected.');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Syncing with SportRADAR...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── ORACLE HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Zap size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-primary" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Result Reconciliation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              Oracle <span className="text-primary italic">Hub</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Direct Intelligence Injection • Real-time Result Verification • Platform Integrity Master
            </p>
          </div>

          <div className="flex bg-midnight/60 p-2 rounded-3xl border border-white/10 relative z-10 shadow-inner">
             {[
               { id: 'football', label: 'Football', icon: Activity },
               { id: 'motorsports', label: 'F1', icon: Fuel },
               { id: 'nba', label: 'NBA', icon: Target }
             ].map((s) => (
               <button
                 key={s.id}
                 onClick={() => setActiveSport(s.id)}
                 className={`rounded-2xl px-6 h-14 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all ${activeSport === s.id ? 'bg-primary text-midnight shadow-xl' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
               >
                 <s.icon size={16} />
                 {s.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* ── MATCHES MONITOR ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div>
              <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Active Conflict Monitor</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Awaiting terminal result reconciliation</p>
           </div>
        </div>

        {matches.length === 0 ? (
          <div className="py-32 text-center glass-premium border-white/5 rounded-[3rem] opacity-40">
            <Database className="mx-auto mb-6 text-white/10" size={60} />
            <p className="text-white/20 font-black uppercase text-[10px] tracking-[0.6em] italic">Zero active signals detected in sector {activeSport}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((m) => (
              <div key={m.id} className="glass-premium rounded-[3rem] border-white/5 group hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-2xl hover:-translate-y-2">
                 <div className="p-10 space-y-10">
                    
                    {/* ID & Status */}
                    <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                       <Badge className="bg-primary/10 text-primary border border-primary/20 text-[8px] font-black uppercase tracking-widest italic px-3 py-1">
                          {m.status}
                       </Badge>
                       <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">SYNC-SIG: {m.id.slice(-8)}</span>
                    </div>

                    {/* Arena Conflict Display */}
                    <div className="flex items-center justify-between gap-6 relative">
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                          <span className="text-6xl font-black italic tracking-tighter uppercase font-mono text-primary">VS</span>
                       </div>
                       
                       <div className="flex flex-col items-center gap-4 w-1/3">
                          <div className="relative group/badge">
                             <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                             <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 transition-transform group-hover/badge:scale-110">
                               <TeamBadge 
                                 name={m.homeTeam.name} 
                                 code={m.homeTeam.code} 
                                 hideName 
                                 sport={m.phase.tournament.competition.sport.slug}
                               />
                             </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-center text-white/60 group-hover:text-white transition-colors tracking-tighter">{m.homeTeam.name}</span>
                       </div>

                       <div className="flex flex-col items-center gap-4 w-1/3">
                          <div className="relative group/badge">
                             <div className="absolute -inset-2 bg-primary/20 blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                             <div className="relative w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 transition-transform group-hover/badge:scale-110">
                               <TeamBadge 
                                 name={m.awayTeam.name} 
                                 code={m.awayTeam.code} 
                                 hideName 
                                 sport={m.phase.tournament.competition.sport.slug}
                               />
                             </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-center text-white/60 group-hover:text-white transition-colors tracking-tighter">{m.awayTeam.name}</span>
                       </div>
                    </div>

                    {/* Intelligence Input */}
                    <div className="bg-white/2 p-8 rounded-[2rem] border border-white/5 space-y-6 relative overflow-hidden group/input">
                       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                       
                       <div className="flex justify-center items-center gap-8">
                          <div className="space-y-3 text-center">
                             <label className="text-[8px] font-black uppercase text-white/20 tracking-[0.3em] group-hover/input:text-white/40 transition-colors">Sector Host</label>
                             <input 
                               type="number" 
                               value={scores[m.id]?.home}
                               onChange={(e) => setScores({...scores, [m.id]: {...scores[m.id], home: parseInt(e.target.value)}})}
                               className="w-20 h-20 bg-white/5 text-center text-4xl font-black rounded-2xl border border-white/10 focus:border-primary transition-all p-0 text-white outline-none"
                             />
                          </div>
                          <div className="text-2xl font-black text-white/5 mt-6">:</div>
                          <div className="space-y-3 text-center">
                             <label className="text-[8px] font-black uppercase text-white/20 tracking-[0.3em] group-hover/input:text-white/40 transition-colors">Sector Target</label>
                             <input 
                               type="number" 
                               value={scores[m.id]?.away}
                               onChange={(e) => setScores({...scores, [m.id]: {...scores[m.id], away: parseInt(e.target.value)}})}
                               className="w-20 h-20 bg-white/5 text-center text-4xl font-black rounded-2xl border border-white/10 focus:border-primary transition-all p-0 text-white outline-none"
                             />
                          </div>
                       </div>
                    </div>

                    {/* Commit Action */}
                    <button 
                      onClick={() => handleScoreUpdate(m.id)}
                      disabled={savingId === m.id}
                      className="w-full h-16 bg-primary text-midnight font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 group/btn overflow-hidden relative"
                    >
                       <div className="relative z-10 flex items-center gap-3">
                          {savingId === m.id ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} className="group-hover/btn:scale-125 transition-transform" />}
                          {savingId === m.id ? 'Stabilizing Results...' : 'Inject Intel Signature'}
                       </div>
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[8px] font-mono text-white/10 uppercase tracking-widest pt-2">
                       <Clock size={10} />
                       {m.kickoff ? new Date(m.kickoff).toLocaleString() : 'TEMPORAL DATA NOT FOUND'}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, accent }: { label: string, value: string | number, icon: React.ReactNode, accent: string }) {
  return (
    <div className="glass-premium p-10 rounded-[3rem] border-white/5 group hover:border-primary/20 transition-all shadow-xl">
       <div className="flex justify-between items-start mb-8">
          <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
          <ArrowUpRight className="text-white/10" size={24} />
       </div>
       <div>
          <h3 className="text-[10px] font-black uppercase text-white/30 tracking-[0.4em] mb-2">{label}</h3>
          <p className="text-5xl font-black tracking-tighter text-white italic leading-none">{value}</p>
       </div>
    </div>
  );
}
