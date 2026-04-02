'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Zap, AlertCircle } from 'lucide-react';

export default function AdminGeneratePage() {
  const [leagues, setLeagues] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matchday, setMatchday] = useState('');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/contests/league')
      .then(res => res.json())
      .then(json => {
        if (json.success) setLeagues(json.competitions || []);
      });
  }, []);

  const handleGenerate = async () => {
    if (!selectedLeague || !matchday) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/matches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leagueSlug: selectedLeague, matchdayNumber: matchday })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`SUCCESS: Gen Matchday ${matchday} for ${selectedLeague}`);
      } else {
        setMessage(`ERROR: ${data.error}`);
      }
    } catch (err) {
      setMessage('CONNECTION ERROR');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <div className="glass-strong p-10 rounded-[3rem] border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
        
        <div className="flex items-center gap-4">
           <div className="p-3 bg-primary/20 rounded-2xl">
              <Zap className="w-6 h-6 text-primary" />
           </div>
           <h1 className="text-3xl font-black text-white uppercase italic">Phase Generator</h1>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Select Competition</label>
              <select 
                value={selectedLeague} 
                onChange={(e) => setSelectedLeague(e.target.value)}
                className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-all appearance-none"
              >
                <option value="">-- SELEC LEAGUE --</option>
                {leagues.map(l => (
                   <option key={l.slug} value={l.slug}>{l.name}</option>
                ))}
              </select>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-2">Matchday Number</label>
              <input 
                type="number"
                value={matchday}
                onChange={(e) => setMatchday(e.target.value)}
                placeholder="15"
                className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-all"
              />
           </div>

           <button 
             onClick={handleGenerate}
             disabled={generating || !selectedLeague || !matchday}
             className="w-full h-16 bg-primary text-midnight font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
           >
              {generating ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : 'GENERATE PHASE & CONTESTS'}
           </button>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${message.startsWith('SUCCESS') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
             {message}
          </div>
        )}
      </div>
    </div>
  );
}
