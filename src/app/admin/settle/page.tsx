'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Users, DollarSign, ArrowRight, Loader2, CheckCircle2, AlertCircle, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    if (!confirm('Are you sure you want to finalize this contest and SCALE prize distribution? This action is irreversible.')) return;
    
    setProcessingId(contestId);
    try {
      const res = await fetch(`/api/admin/contests/${contestId}/finalize`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Contest finalized successfully! Rankings generated and prizes assigned.');
        fetchContests();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Network error during finalization.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  const readyToSettle = contests.filter(c => c.canSettle).length;

  return (
    <div className="space-y-10 pb-20">
      {/* 👑 Header Section */}
      <div className="relative p-10 rounded-3xl overflow-hidden bg-gradient-to-br from-card/80 to-background border border-border/40 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase italic">
              Grandmaster <span className="text-primary italic">Settlement</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono tracking-widest uppercase">
               Final Prize Liquidation • Ranking Audit • Payout Integrity
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col items-end">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Revenue Forecast</span>
               <span className="text-xl font-black text-emerald-500">{(contests.reduce((a, b) => a + (b.prizePoolSOL * 0.15), 0)).toFixed(2)} SOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsTile 
          icon={<AlertCircle className="text-gold" />} 
          title="Ready to Finalize" 
          value={readyToSettle} 
          subtitle="Contests with all matches finished"
        />
        <StatsTile 
          icon={<TrendingUp className="text-blue-400" />} 
          title="Active Participants" 
          value={contests.reduce((a, b) => a + b.currentEntries, 0)} 
          subtitle="In currently open contests"
        />
        <StatsTile 
          icon={<DollarSign className="text-emerald-400" />} 
          title="Potential Payouts" 
          value={contests.reduce((a, b) => a + b.prizePoolSOL, 0).toFixed(2)} 
          subtitle="Total SOL awaiting distribution"
        />
      </div>

      {/* 📑 Settlement Table */}
      <Card className="bg-card/40 backdrop-blur-xl border-border/40 rounded-3xl overflow-hidden shadow-xl">
        <CardHeader className="border-b border-border/10 p-8">
          <CardTitle className="text-xl">Awaiting Finalization</CardTitle>
          <CardDescription>Review and finalize contest results based on official scores.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-b border-border/10">
                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contest / Slug</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Completion</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Entries</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Prize Pool</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</TableHead>
                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                     No contests currently requiring settlement.
                  </TableCell>
                </TableRow>
              ) : (
                contests.map((contest) => (
                  <TableRow key={contest.id} className="hover:bg-white/5 border-b border-border/5 transition-all">
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm">{contest.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase">{contest.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-6">
                       <div className="flex flex-col items-center gap-1.5">
                          <span className="text-xs font-bold">{contest.matchesFinished} / {contest.totalMatches}</span>
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                             <div 
                               className="h-full bg-primary transition-all duration-1000" 
                               style={{ width: `${(contest.matchesFinished/contest.totalMatches) * 100}%` }}
                             />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-center py-6 font-mono text-xs">{contest.currentEntries}</TableCell>
                    <TableCell className="text-center py-6">
                       <div className="flex items-center justify-center gap-1.5 text-primary">
                          <Wallet size={12} />
                          <span className="font-black">{contest.prizePoolSOL}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center py-6">
                       <Badge className={`${contest.canSettle ? 'bg-primary text-midnight' : 'bg-white/10 text-muted-foreground'} border-none uppercase text-[9px] font-black tracking-widest px-3`}>
                          {contest.canSettle ? 'Ready to Close' : 'In Progress'}
                       </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                       <Button 
                         onClick={() => handleFinalize(contest.id)}
                         disabled={!contest.canSettle || processingId === contest.id}
                         className="h-12 px-6 rounded-xl bg-primary text-midnight font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 disabled:opacity-30"
                       >
                          {processingId === contest.id ? <Loader2 className="animate-spin mr-2" size={14} /> : <CheckCircle2 className="mr-2" size={14} />}
                          Finalize Result
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsTile({ icon, title, value, subtitle }: { icon: React.ReactNode, title: string, value: string | number, subtitle: string }) {
  return (
    <div className="p-8 bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl group hover:border-primary/50 transition-all duration-300 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 group-hover:bg-primary/10 transition-all">
          {icon}
        </div>
      </div>
      <p className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-1 italic opacity-70">{title}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  );
}
