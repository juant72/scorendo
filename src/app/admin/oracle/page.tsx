'use client';

import React, { useState, useEffect } from 'react';
import { Target, Zap, Clock, Trophy, Save, Loader2, Search, Filter, ShieldCheck, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TeamBadge } from '@/components/contests/TeamBadge';

export default function OracleHub() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, { home: number, away: number }>>({});

  const fetchMatches = async () => {
    try {
      const res = await fetch('/api/contests/matches?status=SCHEDULED,LIVE');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
        // Initialize local scores
        const initialScores: any = {};
        data.matches.forEach((m: any) => {
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
    fetchMatches();
  }, []);

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

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-10">
      {/* 🔮 Oracle Header */}
      <div className="flex justify-between items-center bg-card/40 p-10 rounded-3xl border border-white/5 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Zap size={180} className="text-primary fill-primary" />
        </div>
        <div className="flex items-center gap-6 relative z-10">
           <div className="p-4 bg-primary/20 rounded-2xl shadow-xl border border-primary/20 animate-pulse">
              <Target className="w-10 h-10 text-primary" />
           </div>
           <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tight">Oracle <span className="text-primary italic">Control</span></h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">Real-time Result Injection & Reconciliation</p>
           </div>
        </div>
      </div>

      {/* 🏟️ Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <XCircle className="mx-auto mb-4 text-muted-foreground opacity-20" size={60} />
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest italic font-mono">No active matches requiring Oracle intervention.</p>
          </div>
        ) : (
          matches.map((m) => (
            <Card key={m.id} className="bg-card/50 backdrop-blur-xl border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-primary/40 transition-all duration-300">
               <div className="p-8 space-y-8">
                  {/* Status & Tournament */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                     <Badge variant="outline" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-[0.2em] italic">
                        {m.status}
                     </Badge>
                     <span className="text-[9px] font-mono text-muted-foreground uppercase opacity-50 tracking-tighter">Match ID: {m.id.slice(-8)}</span>
                  </div>

                  {/* Teams Display - Powered by TeamBadge (Multisport Ready) */}
                  <div className="flex items-center justify-between gap-4">
                     <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="w-20 h-20 group-hover:scale-110 transition-transform flex items-center justify-center">
                           <TeamBadge name={m.homeTeam.name} code={m.homeTeam.code} hideName />
                        </div>
                        <span className="text-[10px] font-black uppercase text-center truncate w-full">{m.homeTeam.name}</span>
                     </div>
                     <div className="text-2xl font-black italic text-primary opacity-20 tracking-tighter uppercase font-mono">VS</div>
                     <div className="flex flex-col items-center gap-3 w-1/3">
                        <div className="w-20 h-20 group-hover:scale-110 transition-transform flex items-center justify-center">
                           <TeamBadge name={m.awayTeam.name} code={m.awayTeam.code} hideName />
                        </div>
                        <span className="text-[10px] font-black uppercase text-center truncate w-full">{m.awayTeam.name}</span>
                     </div>
                  </div>

                  {/* Score Input Fabricator */}
                  <div className="bg-midnight/40 p-6 rounded-3xl border border-white/5 space-y-6">
                     <div className="flex justify-center items-center gap-6">
                        <div className="space-y-2 text-center">
                           <label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Host</label>
                           <Input 
                             type="number" 
                             value={scores[m.id]?.home}
                             onChange={(e) => setScores({...scores, [m.id]: {...scores[m.id], home: parseInt(e.target.value)}})}
                             className="w-16 h-16 bg-white/5 text-center text-2xl font-black rounded-2xl border-white/10 focus:border-primary transition-all p-0"
                           />
                        </div>
                        <div className="text-xl font-black text-muted-foreground mt-4">:</div>
                        <div className="space-y-2 text-center">
                           <label className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Guest</label>
                           <Input 
                             type="number" 
                             value={scores[m.id]?.away}
                             onChange={(e) => setScores({...scores, [m.id]: {...scores[m.id], away: parseInt(e.target.value)}})}
                             className="w-16 h-16 bg-white/5 text-center text-2xl font-black rounded-2xl border-white/10 focus:border-primary transition-all p-0"
                           />
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-center gap-2 text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                        <Clock size={10} />
                        {m.kickoff ? new Date(m.kickoff).toLocaleString() : 'N/A'}
                     </div>
                  </div>

                  {/* Deploy Button */}
                  <Button 
                    onClick={() => handleScoreUpdate(m.id)}
                    disabled={savingId === m.id}
                    className="w-full h-14 bg-primary text-midnight font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-102 transition-all transition-transform"
                  >
                     {savingId === m.id ? <Loader2 className="animate-spin" /> : <ShieldCheck className="mr-2" size={16} />}
                     {savingId === m.id ? 'Reconciling...' : 'Confirm Results'}
                  </Button>
               </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
