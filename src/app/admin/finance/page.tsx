'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, ArrowUpRight, TrendingUp, ShieldCheck, Loader2, LineChart, Database, Zap, Lock } from 'lucide-react';

export default function AdminFinancePage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Decrypting Financial Ledger...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── TREASURY HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <LineChart size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-emerald-400" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Fiscal Sovereignty</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              Treasury <span className="text-emerald-400 italic">Monitor</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Liquidity Flow • Revenue Stream Realization • Platform Solvency Engine
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="px-8 py-5 glass-premium bg-emerald-500/5 border-emerald-500/10 rounded-3xl flex flex-col items-end min-w-[200px] group/vault">
               <span className="text-[9px] font-black text-emerald-400/50 uppercase tracking-widest mb-1 group-hover/vault:text-emerald-400 transition-colors">Vault Status</span>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  <span className="text-2xl font-black text-emerald-400 italic">SECURE</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINANCE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatsCard 
          label="Prize Pool Liabilities" 
          value={`${stats?.totalPrizePoolEstimated || 0}`} 
          unit="SOL"
          sub="Locked in Smart Vaults"
          icon={<Wallet className="text-primary" />}
          accent="primary"
        />
        <StatsCard 
          label="Platform Revenue (15%)" 
          value={`${((stats?.totalPrizePoolEstimated || 0) * 0.15).toFixed(2)}`} 
          unit="SOL"
          sub="Protocol Performance Fee"
          icon={<TrendingUp className="text-emerald-400" />}
          accent="emerald"
        />
        <StatsCard 
          label="Cumulative Volume" 
          value={`${stats?.totalPrizePoolEstimated || 0}`} 
          unit="SOL"
          sub="Ecosystem Transactional Flow"
          icon={<DollarSign className="text-sky-400" />}
          accent="sky"
        />
      </div>

      {/* ── SETTLEMENT AUTH ── */}
      <div className="glass-premium p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-all duration-1000" />
         
         <div className="flex flex-col xl:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                     <ShieldCheck size={24} className="text-primary" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Governance Protocol Verified</span>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Hash: 0x99AC...BB7B</span>
                  </div>
               </div>
               <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Financial Authorization <span className="text-primary italic">Terminal</span></h2>
               <p className="text-sm text-white/30 max-w-2xl italic leading-relaxed">
                  "Treasury commissions are algorithmically sequestered upon match closure. The 15% protocol fee is distributed between the Heritage Rewards pool and Ecosystem growth. All transactions are immutable on the Solana ledger."
               </p>
            </div>
            
            <div className="flex flex-col gap-4 min-w-[280px]">
               <button className="h-20 px-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-white/20 cursor-wait flex items-center justify-center gap-3 disabled:opacity-50 group/btn">
                  <Database size={16} className="group-hover/btn:scale-125 transition-transform" />
                  Global Audit <span className="text-[8px] opacity-50 pl-2">V2.4</span>
               </button>
               <button className="h-14 px-10 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary/20 transition-all text-primary flex items-center justify-center gap-3 group/sync">
                  <Zap size={16} className="group-hover/sync:animate-pulse" />
                  Sync Treasury
               </button>
            </div>
         </div>
      </div>
      
      {/* ── FOOTER STATS ── */}
      <div className="flex items-center justify-center gap-10 py-6 border-t border-white/5 opacity-20 hover:opacity-100 transition-opacity">
         <span className="text-[8px] font-black uppercase tracking-[0.5em]">Network: Solana Mainnet</span>
         <span className="text-[8px] font-black uppercase tracking-[0.5em]">Precision: 9 Decimals</span>
         <span className="text-[8px] font-black uppercase tracking-[0.5em]">Status: Reaching Solvency</span>
      </div>
    </div>
  );
}

function StatsCard({ label, value, unit, sub, icon, accent }: { label: string, value: string, unit: string, sub: string, icon: React.ReactNode, accent: 'primary' | 'emerald' | 'sky' }) {
  const accentClasses = {
    primary: 'group-hover:border-primary/30 hover:bg-primary/5',
    emerald: 'group-hover:border-emerald-400/30 hover:bg-emerald-400/5',
    sky: 'group-hover:border-sky-400/30 hover:bg-sky-400/5'
  };

  return (
    <div className={`p-10 glass-premium rounded-[3rem] border border-white/5 space-y-8 group transition-all duration-500 shadow-xl overflow-hidden relative ${accentClasses[accent]}`}>
       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
          <Lock size={100} />
       </div>
       
       <div className="flex justify-between items-start relative z-10">
          <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-xl">{icon}</div>
          <ArrowUpRight className="text-white/10 group-hover:text-white/30 transition-colors" size={24} />
       </div>
       
       <div className="relative z-10">
          <h3 className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-2 group-hover:text-white/50 transition-colors">{label}</h3>
          <div className="flex items-baseline gap-2">
             <p className="text-5xl font-black tracking-tighter text-white italic">{value}</p>
             <span className="text-xs font-black text-white/20 uppercase tracking-widest">{unit}</span>
          </div>
       </div>
       
       <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.3em] italic group-hover:text-white/20 transition-colors relative z-10">{sub}</p>
    </div>
  );
}
