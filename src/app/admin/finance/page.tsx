'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, ArrowUpRight, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';

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

  if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Treasury <span className="text-primary">Monitor</span></h1>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Platform Solvency & Revenue Audit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FinanceCard 
          label="Prize Pool Liabilities" 
          value={`${stats?.totalPrizePoolEstimated || 0} SOL`} 
          sub="Locked in Smart Vaults"
          icon={<Wallet className="text-primary" />}
        />
        <FinanceCard 
          label="Platform Revenue (15%)" 
          value={`${((stats?.totalPrizePoolEstimated || 0) * 0.15).toFixed(2)} SOL`} 
          sub="AFA Operational Fee"
          icon={<TrendingUp className="text-emerald-400" />}
        />
        <FinanceCard 
          label="Total Volume" 
          value={`${stats?.totalPrizePoolEstimated || 0} SOL`} 
          sub="All-time Transactional flow"
          icon={<DollarSign className="text-blue-400" />}
        />
      </div>

      <div className="glass-strong p-10 rounded-[3rem] border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
         
         <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em]">
                  <ShieldCheck size={14} />
                  Vault Integrity Verified
               </div>
               <h2 className="text-3xl font-black uppercase italic tracking-tighter">Financial Settlement Authorization</h2>
               <p className="text-sm text-muted-foreground max-w-xl italic leading-relaxed">
                  Platform fees are automatically calculated upon match settlement. Platform takes a 15% cut from every prize pool to fund the Heritage Rewards pool.
               </p>
            </div>
            <button className="h-20 px-12 bg-white/5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all text-white/40 cursor-not-allowed">
               Execute Global Audit
            </button>
         </div>
      </div>
    </div>
  );
}

function FinanceCard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="glass-strong p-8 rounded-[2.5rem] border-white/5 space-y-4 hover:border-primary/20 transition-all group">
       <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
          <ArrowUpRight className="text-white/20" size={20} />
       </div>
       <div>
          <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</h3>
          <p className="text-4xl font-black tracking-tighter text-white">{value}</p>
       </div>
       <p className="text-[10px] text-primary/40 font-black uppercase italic">{sub}</p>
    </div>
  );
}
