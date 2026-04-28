'use client';

import React, { useEffect, useState } from 'react';
import { Users, Trophy, DollarSign, Activity, Loader2, ArrowUpRight, Zap, RefreshCcw, Bell, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalPredictions: number;
  totalContests: number;
  totalPrizePoolEstimated: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<{ stats: Stats; recentUsers: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncMsg, setSyncMsg] = useState('');

  const fetchStats = () => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Forbidden or Error');
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGlobalSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/oracle/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncMsg(`SUCCESS: ${data.syncedCount} matches auto-settled.`);
        fetchStats(); // Refresh stats
      } else {
        setSyncMsg(`ERROR: ${data.error}`);
      }
    } catch (err) {
      setSyncMsg('SYNC FAILED');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(''), 5000);
    }
  };

  if (loading) return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Decrypting OS State...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-premium p-10 rounded-[2.5rem] border-red-500/20 text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
           <Shield className="text-red-500 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase italic text-red-400">Security Breach</h2>
        <p className="text-sm text-white/40 mb-8 italic">Your terminal session does not have administrative clearance for Node-01.</p>
        <Link href="/" className="px-8 h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-white/10 transition-all">
           Return to Sector Alpha
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-up">
      
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="h-0.5 w-10 bg-primary" />
              <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">Mission Intelligence</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white">
              Command <span className="text-primary italic">Center</span>
           </h1>
        </div>

        <div className="flex items-center gap-4">
           {/* Alerts */}
           <button className="w-14 h-14 rounded-2xl border border-white/5 bg-white/2 flex items-center justify-center text-white/40 hover:text-white transition-all relative group">
              <Bell size={18} />
              <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
           </button>

           <button 
             onClick={handleGlobalSync}
             disabled={syncing}
             className="h-14 px-8 bg-primary text-midnight font-black uppercase text-[10px] tracking-[0.25em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center gap-3 disabled:opacity-50 relative overflow-hidden group"
           >
              {syncing ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} className="relative z-10" />}
              <span className="relative z-10">{syncing ? 'Syncing Galaxy...' : 'Oracle Pulse Sync'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
           </button>
        </div>
      </div>

      {syncMsg && (
        <div className={`p-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] text-center border animate-in fade-in slide-in-from-top-4 backdrop-blur-md ${syncMsg.startsWith('SUCCESS') ? 'bg-primary/5 border-primary/20 text-primary shadow-[0_0_40px_rgba(0,230,118,0.1)]' : 'bg-red-500/5 border-red-500/20 text-red-400'}`}>
           {syncMsg}
        </div>
      )}

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-sky-400"/>} label="Total Predictors" value={data?.stats.totalUsers || 0} change="+12.4%" />
        <StatCard icon={<Activity className="text-emerald-400"/>} label="Engagement Units" value={data?.stats.totalPredictions || 0} change="+24.8%" />
        <StatCard icon={<Trophy className="text-gold"/>} label="Live Arenas" value={data?.stats.totalContests || 0} change="+5 New" />
        <StatCard icon={<DollarSign className="text-primary"/>} label="Liquidity (SOL)" value={data?.stats.totalPrizePoolEstimated || 0} change="+1.2%" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Recent Registrations Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div>
              <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Infiltration Log</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Real-time user registration pulse</p>
            </div>
            <Link href="/admin/users" className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors">
              Database Access <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="glass-premium rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Identifier</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Intelligence</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Date Stamp</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Access</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {data?.recentUsers.map((user: any) => (
                    <tr key={user.walletAddress} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-primary transition-colors" />
                           <div className="flex flex-col">
                             <span className="text-xs font-black font-mono text-white group-hover:text-primary transition-colors">{user.walletAddress.slice(0, 12)}...</span>
                             <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{user.email || 'No neural link'}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{user.totalPoints}</span>
                            <span className="text-[9px] font-black text-primary uppercase">PTS</span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                         {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:border-primary/30 transition-all">
                            <ChevronRight size={16} />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table Footer */}
            <div className="px-8 py-4 bg-white/2 border-t border-white/5 flex items-center justify-center">
               <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.5em]">End of Log · Secured Sector</span>
            </div>
          </div>
        </div>

        {/* Intelligence Hub / Health */}
        <div className="space-y-6">
           <div className="px-2">
              <h2 className="text-xl font-black text-white italic uppercase tracking-widest">Engine Status</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Hardware & Neural Synchronization</p>
           </div>
           
           <div className="glass-premium p-10 rounded-[2.5rem] space-y-10">
              <div className="space-y-6">
                 <HealthBar label="Database Core" status="Synchronized" value={100} />
                 <HealthBar label="Auth Protocol" status="Encrypted" value={98} />
                 <HealthBar label="Solana Node" status="Reaching" value={72} />
              </div>

              <div className="p-6 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                 <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Active Memo</span>
                 </div>
                 <p className="text-[10px] text-white/30 leading-relaxed italic">
                    "AFA Matchday dates are currently synchronized with Option A real-feel dataset. FWC 2026 Arenas are awaiting final group stage encryption."
                 </p>
              </div>

              <button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
                 Diagnostic Run <DiagnosticIcon size={14} className="opacity-40" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string | number, change: string }) {
  return (
    <div className="glass-premium p-8 rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors" />
      
      <div className="flex justify-between items-start mb-8">
        <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all">
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
          <ArrowUpRight size={10} className={change.startsWith('+') ? 'rotate-0' : 'rotate-90'} />
          {change}
        </div>
      </div>
      
      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{value}</p>
    </div>
  );
}

function HealthBar({ label, status, value }: { label: string, status: string, value: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
         <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</span>
         <span className="text-[9px] font-black uppercase text-primary tracking-widest">{status}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
         <div 
           className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(0,230,118,0.5)] transition-all duration-1000"
           style={{ width: `${value}%` }} 
         />
      </div>
    </div>
  );
}

function DiagnosticIcon({ size, className }: { size: number, className?: string }) {
  return <Activity size={size} className={className} />;
}
