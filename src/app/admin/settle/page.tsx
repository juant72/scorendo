'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Users, DollarSign, ArrowRight, Loader2, CheckCircle2, AlertCircle, TrendingUp, Wallet, ShieldCheck, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContestSettleInfo {
  id: string;
  name: string;
  slug: string;
  status: string;
  currentEntries: number;
  entryFeeSOL: number;
  prizePoolSOL: number;
  matchesFinished: number;
  totalMatches: number;
  canSettle: boolean;
}

export default function SettlementPage() {
  const [contests, setContests] = useState<ContestSettleInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchContests = async () => {
    try {
      const res = await fetch('/api/admin/contests/settleable');
      const data = await res.json();
      setContests(data.contests || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleFinalize = async (contestId: string) => {
    if (!confirm('Are you sure you want to finalize this contest? This will distribute prizes via smart contract logic on the rankings engine.')) return;
    
    setProcessingId(contestId);
    try {
      const res = await fetch(`/api/admin/contests/${contestId}/finalize`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('SUCCESS: Prizes authorized and distribution queue initialized.');
        fetchContests();
      } else {
        alert(`CRITICAL ERROR: ${data.error}`);
      }
    } catch (err) {
      alert('NETWORK INTERRUPTION: Finalization status unknown.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Auditing Prize Pools...</span>
      </div>
    </div>
  );

  const readyToSettle = contests.filter(c => c.canSettle).length;

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Trophy size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-gold" />
               <span className="text-[10px] font-black text-gold uppercase tracking-[0.5em]">Grandmaster Protocol</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              Prize <span className="text-gold italic">Settlement</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Final Prize Liquidation • Ranking Audit • Smart Contract Payout Integrity
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="px-8 py-5 glass-premium bg-emerald-500/5 border-emerald-500/10 rounded-3xl flex flex-col items-end min-w-[200px]">
               <span className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest mb-1">Treasury Commission (15%)</span>
               <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-emerald-400">{(contests.reduce((a, b) => a + (b.prizePoolSOL * 0.15), 0)).toFixed(2)}</span>
                  <span className="text-xs font-black text-emerald-400/50">SOL</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS TILES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsTile 
          icon={<AlertCircle className="text-gold" />} 
          title="Ready for Execution" 
          value={readyToSettle} 
          subtitle="Contests with verified final scores"
          accent="gold"
        />
        <StatsTile 
          icon={<TrendingUp className="text-sky-400" />} 
          title="Total Predictors" 
          value={contests.reduce((a, b) => a + b.currentEntries, 0)} 
          subtitle="Unique active participants across sectors"
          accent="sky"
        />
        <StatsTile 
          icon={<Wallet className="text-primary" />} 
          title="Potential Liquidation" 
          value={contests.reduce((a, b) => a + b.prizePoolSOL, 0).toFixed(2)} 
          subtitle="Total SOL volume awaiting distribution"
          accent="primary"
        />
      </div>

      {/* ── SETPRETMENT TABLE ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div>
              <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Payout Queue</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Active tournament termination states</p>
           </div>
        </div>

        <div className="glass-premium rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Arena / Sector</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Engine Sync</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Entries</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Pool Volume</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {contests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-60 text-center text-white/10 italic text-sm font-black uppercase tracking-widest">
                       <div className="flex flex-col items-center gap-3">
                          <ShieldCheck size={40} className="text-white/5" />
                          Zero queues requiring terminal action.
                       </div>
                    </td>
                  </tr>
                ) : (
                  contests.map((contest) => (
                    <tr key={contest.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-sm text-white group-hover:text-primary transition-colors">{contest.name}</span>
                          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{contest.slug}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black italic text-white/80">{contest.matchesFinished} / {contest.totalMatches}</span>
                            <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                               <div 
                                 className="h-full bg-primary shadow-[0_0_10px_rgba(0,230,118,0.5)] transition-all duration-1000" 
                                 style={{ width: `${(contest.matchesFinished/contest.totalMatches) * 100}%` }}
                               />
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                         <span className="text-xs font-black text-white/60 mb-1 block">{contest.currentEntries}</span>
                         <span className="text-[8px] font-black text-white/20 uppercase">Units</span>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col items-center gap-1 group/pool">
                            <div className="flex items-center gap-1.5 text-primary">
                               <span className="text-sm font-black italic">{contest.prizePoolSOL}</span>
                               <span className="text-[9px] font-black opacity-60">SOL</span>
                            </div>
                            <div className="h-0.5 w-0 group-hover/pool:w-8 bg-primary transition-all duration-300" />
                         </div>
                      </td>
                      <td className="px-10 py-8 text-center text-center">
                         <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase border ${contest.canSettle ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-white/30'}`}>
                            {contest.canSettle && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                            {contest.canSettle ? 'Verified Terminal' : 'Engine Syncing'}
                         </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <button 
                           onClick={() => handleFinalize(contest.id)}
                           disabled={!contest.canSettle || processingId === contest.id}
                           className="h-12 px-6 rounded-2xl bg-primary text-midnight font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-30 flex items-center gap-2 ml-auto"
                         >
                            {processingId === contest.id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                            Finalize Sector
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Edge decoration */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function StatsTile({ icon, title, value, subtitle, accent }: { icon: React.ReactNode, title: string, value: string | number, subtitle: string, accent: 'gold' | 'sky' | 'primary' }) {
  const accentColors = {
    gold: 'group-hover:border-gold/30 hover:bg-gold/5',
    sky: 'group-hover:border-sky-400/30 hover:bg-sky-400/5',
    primary: 'group-hover:border-primary/30 hover:bg-primary/5'
  };

  return (
    <div className={`p-10 glass-premium rounded-[3rem] group transition-all duration-500 shadow-xl border-white/5 ${accentColors[accent]}`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all">
          {icon}
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-white/10 group-hover:text-white/20 transition-colors">
           <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
        </div>
      </div>
      <p className="text-[10px] text-white/25 uppercase font-black tracking-[0.3em] mb-2">{title}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-5xl font-black tracking-tighter text-white italic">{value}</h3>
      </div>
      <p className="text-[10px] text-white/20 italic leading-relaxed group-hover:text-white/40 transition-colors">{subtitle}</p>
    </div>
  );
}
