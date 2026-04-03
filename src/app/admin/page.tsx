'use client';

import React, { useEffect, useState } from 'react';
import { Users, Trophy, DollarSign, Activity, Loader2, ArrowUpRight, Zap, RefreshCcw } from 'lucide-react';

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
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (error) return (
    <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-2xl text-destructive text-center">
      <h2 className="text-xl font-black mb-2">Admin Access Error</h2>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">Command <span className="text-primary">Center</span></h1>
           <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Scorendo Platform Intelligence Hub</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleGlobalSync}
             disabled={syncing}
             className="h-14 px-8 bg-primary text-midnight font-black uppercase text-[10px] tracking-[0.25em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 disabled:opacity-50"
           >
              {syncing ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
              {syncing ? 'Synchronizing Universe...' : 'Pulse Oracle Sync'}
           </button>
        </div>
      </div>

      {syncMsg && (
        <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border animate-in fade-in slide-in-from-top-4 ${syncMsg.startsWith('SUCCESS') ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
           {syncMsg}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-blue-400"/>} label="Total Users" value={data?.stats.totalUsers || 0} change="+12%" />
        <StatCard icon={<Activity className="text-emerald-400"/>} label="Predictions" value={data?.stats.totalPredictions || 0} change="+24%" />
        <StatCard icon={<Trophy className="text-gold"/>} label="Active Contests" value={data?.stats.totalContests || 0} change="+5" />
        <StatCard icon={<DollarSign className="text-primary"/>} label="Total Volume (SOL)" value={data?.stats.totalPrizePoolEstimated || 0} change="+1.2" />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Users List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Registrations</h2>
            <button className="text-xs font-bold text-primary hover:underline">View All Users</button>
          </div>
          <div className="bg-card/50 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Wallet / Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Points</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/5">
                {data?.recentUsers.map((user: any) => (
                   <tr key={user.walletAddress} className="hover:bg-white/5 transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex flex-col">
                         <span className="text-sm font-medium font-mono">{user.walletAddress.slice(0, 8)}...</span>
                         <span className="text-[10px] text-muted-foreground">{user.email || 'No email'}</span>
                       </div>
                     </td>
                     <td className="px-6 py-4 text-sm font-bold text-primary">{user.totalPoints}</td>
                     <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                     <td className="px-6 py-4">
                        <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                           <ArrowUpRight size={14} />
                        </button>
                     </td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity Hub */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Platform Health</h2>
          <div className="p-6 bg-card/40 border border-border/20 rounded-2xl space-y-6">
             <HealthBar label="Prisma DB Sync" status="Operational" />
             <HealthBar label="Privy Auth JWT" status="Operational" />
             <HealthBar label="Solana RPC" status="Operational" />
             <div className="pt-6 border-t border-border/10">
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  Note: AFA Matchday dates are currently synchronized with Option A real-feel dataset.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, change }: { icon: React.ReactNode, label: string, value: string | number, change: string }) {
  return (
    <div className="p-6 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl group hover:border-primary/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
          {change}
        </span>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{label}</h3>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function HealthBar({ label, status }: { label: string, status: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
       <span className="text-muted-foreground">{label}</span>
       <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-emerald-400 font-bold text-xs">{status}</span>
       </div>
    </div>
  );
}
