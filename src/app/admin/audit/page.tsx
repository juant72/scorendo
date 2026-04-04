'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, Wallet, History, Search, Loader2, ArrowUpRight, ArrowDownRight, Activity, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const lamportsToSOL = (lamports: string) => (Number(lamports) / 1000000000).toFixed(4);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center bg-card/40 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-emerald-500/20 rounded-2xl shadow-inner border border-emerald-500/10">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
           </div>
           <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tight">Financial <span className="text-emerald-400 italic">Audit</span></h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Precision Ledger & Governance Office</p>
           </div>
        </div>
        <Button onClick={fetchAuditData} variant="outline" className="border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 font-black uppercase text-[10px] items-center gap-2 px-6 rounded-xl">
          <History size={14} /> Refesh Ledger
        </Button>
      </div>

      {/* Financial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Payouts" 
          value={`${lamportsToSOL(data?.stats.prizes)} SOL`} 
          desc="Distributed to winners" 
          icon={<ArrowUpRight className="text-emerald-400" />} 
          color="emerald"
        />
        <StatsCard 
          title="Platform Revenue" 
          value={`${lamportsToSOL(data?.stats.revenue)} SOL`} 
          desc="Accumulated Org Cut" 
          icon={<TrendingUp className="text-primary" />} 
          color="primary"
        />
        <StatsCard 
          title="Entry Fees" 
          value={`${lamportsToSOL(data?.stats.entryFees)} SOL`} 
          desc="Total user deposits" 
          icon={<Wallet className="text-blue-400" />} 
          color="blue"
        />
        <StatsCard 
          title="Throughput" 
          value={data?.stats.totalTransactions.toString()} 
          desc="Confirmed Operations" 
          icon={<Activity className="text-purple-400" />} 
          color="purple"
        />
      </div>

      {/* Audit Trail */}
      <Card className="bg-card/40 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
           <div className="flex items-center gap-3">
              <Cpu className="text-emerald-400" size={20} />
              <div>
                <CardTitle className="text-xl font-black uppercase italic italic tracking-tighter">Governance <span className="text-primary italic">Trail</span></CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase tracking-widest">Real-time immutable administrative logs</p>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Administrator</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data?.auditTrail.map((log: any) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6 text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-[8px] font-black">GM</div>
                        <span className="text-xs font-bold text-white font-mono">{log.adminWallet.slice(0,4)}...{log.adminWallet.slice(-4)}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black tracking-widest uppercase py-1">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-6 text-xs font-bold text-emerald-400 uppercase tracking-tighter italic">
                      {log.entityType} <span className="text-muted-foreground ml-1">#{log.entityId}</span>
                    </td>
                    <td className="p-6 max-w-xs truncate text-[10px] font-mono text-muted-foreground">
                      {JSON.stringify(log.data)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, desc, icon, color }: { title: string, value: string, desc: string, icon: React.ReactNode, color: string }) {
  const colorMap: any = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    primary: 'bg-primary/10 border-primary/20 text-primary',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400'
  }
  return (
    <Card className="bg-card/40 border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all transition-transform hover:-translate-y-1">
      <div className={`h-1 ${colorMap[color].split(' ')[0]}`} />
      <CardHeader className="p-8 pb-2 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{title}</p>
          <p className="text-2xl font-black italic tracking-tighter text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colorMap[color]} shadow-lg transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8 pt-2">
        <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  )
}
