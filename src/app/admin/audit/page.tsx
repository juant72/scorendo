'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Wallet, History, Search, Loader2, ArrowUpRight, ArrowDownRight, Activity, Cpu, Database, ChevronRight, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AuditDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchAuditData = async () => {
    try {
      const res = await fetch('/api/admin/audit/stats');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Accessing Immutable Ledger...</span>
      </div>
    </div>
  );

  const lamportsToSOL = (lamports: string) => (Number(lamports) / 1000000000).toFixed(4);

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── AUDIT HEADER ── */}
      <div className="relative p-12 rounded-[2.5rem] overflow-hidden glass-premium border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <ShieldCheck size={300} strokeWidth={1} />
        </div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-0.5 w-12 bg-emerald-400" />
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Governance & Compliance</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
              Financial <span className="text-emerald-400 italic">Audit</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase max-w-xl leading-relaxed">
               Precision Ledger Oversight • Transaction Verification • Administrative Accountability
            </p>
          </div>

          <button 
            onClick={fetchAuditData}
            className="h-14 px-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <History size={16} /> Re-sync Ledger
          </button>
        </div>
      </div>

      {/* ── FINANCIAL GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AuditStatCard 
          title="Total Payouts" 
          value={`${lamportsToSOL(data?.stats.prizes)}`} 
          unit="SOL"
          desc="Distributed to Sector Winners" 
          icon={<ArrowUpRight className="text-emerald-400" />} 
          accent="emerald"
        />
        <AuditStatCard 
          title="Platform Revenue" 
          value={`${lamportsToSOL(data?.stats.revenue)}`} 
          unit="SOL"
          desc="Net Treasury Accumulation" 
          icon={<TrendingUp className="text-primary" />} 
          accent="primary"
        />
        <AuditStatCard 
          title="Total Liquidity" 
          value={`${lamportsToSOL(data?.stats.entryFees)}`} 
          unit="SOL"
          desc="Cumulative Entry Volume" 
          icon={<Wallet className="text-sky-400" />} 
          accent="sky"
        />
        <AuditStatCard 
          title="Total Operations" 
          value={data?.stats.totalTransactions.toString()} 
          unit="TX"
          desc="Confirmed Smart Contracts" 
          icon={<Activity className="text-purple-400" />} 
          accent="purple"
        />
      </div>

      {/* ── AUDIT TRAIL ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Governance Trail</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Real-time immutable administrative logs</p>
           </div>
        </div>

        <div className="glass-premium rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2 border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Timestamp</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Host Identifier</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Action Signature</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Target Entity</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Data Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {data?.auditTrail.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-white group-hover:text-primary transition-colors">{new Date(log.createdAt).toLocaleDateString()}</span>
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{new Date(log.createdAt).toLocaleTimeString()}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black group-hover:border-primary/30 transition-all">GM</div>
                        <span className="text-[10px] font-black text-white/40 font-mono group-hover:text-white transition-colors">{log.adminWallet.slice(0,6)}...{log.adminWallet.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-widest uppercase text-white/60 group-hover:text-primary group-hover:border-primary/20 transition-all">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-emerald-400 uppercase italic tracking-tighter">{log.entityType}</span>
                          <span className="text-[8px] font-black text-white/10 group-hover:text-white/30 uppercase tracking-widest mt-1">UUID: {log.entityId}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="h-10 px-4 rounded-xl bg-white/2 border border-white/5 text-[8px] font-mono text-white/20 hover:text-white hover:bg-white/10 transition-all ml-auto max-w-[200px] truncate">
                          {JSON.stringify(log.data)}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Edge decoration */}
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function AuditStatCard({ title, value, unit, desc, icon, accent }: { title: string, value: string, unit: string, desc: string, icon: React.ReactNode, accent: string }) {
  const accentClasses: any = {
    emerald: 'group-hover:border-emerald-400/30 hover:bg-emerald-400/5 shadow-emerald-400/5',
    primary: 'group-hover:border-primary/30 hover:bg-primary/5 shadow-primary/5',
    sky: 'group-hover:border-sky-400/30 hover:bg-sky-400/5 shadow-sky-400/5',
    purple: 'group-hover:border-purple-400/30 hover:bg-purple-400/5 shadow-purple-400/5'
  };

  return (
    <div className={`p-10 glass-premium rounded-[3rem] group transition-all duration-500 shadow-2xl border-white/5 ${accentClasses[accent]}`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 rounded-2xl bg-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all">
          {icon}
        </div>
        <div className="w-10 h-10 flex items-center justify-center text-white/5 group-hover:text-white/10 transition-colors">
           <Lock size={20} />
        </div>
      </div>
      
      <p className="text-[10px] text-white/25 uppercase font-black tracking-[0.3em] mb-2">{title}</p>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="text-5xl font-black tracking-tighter text-white italic">{value}</h3>
        <span className="text-xs font-black text-white/20 uppercase tracking-widest">{unit}</span>
      </div>
      <p className="text-[10px] text-white/20 italic leading-relaxed group-hover:text-white/40 transition-colors">{desc}</p>
    </div>
  )
}
