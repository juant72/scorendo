'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, Gift, Loader2, CheckCircle2, AlertCircle, History, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Transaction {
  id: string;
  amount: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'PRIZE' | 'ENTRY_FEE';
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  createdAt: string;
  meta?: any;
}

export default function WalletPage() {
  const [data, setData] = useState<{ balance: number, transactions: Transaction[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/user/wallet');
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleClaim = async (txId: string) => {
    setClaiming(txId);
    try {
      const res = await fetch(`/api/user/wallet/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txId })
      });
      const data = await res.json();
      if (data.success) {
        alert('Funds successfully transferred to your main balance!');
        fetchWallet();
      }
    } catch (err) {
      alert('Claim Error.');
    } finally {
      setClaiming(null);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  const pendingPrizes = data?.transactions.filter(tx => tx.type === 'PRIZE' && tx.status === 'PENDING') || [];
  const history = data?.transactions.filter(tx => tx.status !== 'PENDING' || tx.type !== 'PRIZE') || [];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-10">
      {/* 💳 Balance Hero Card */}
      <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-card to-background border border-border/40 overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Coins size={240} />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-4 text-center md:text-left">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Available Balance</span>
               <div className="flex items-baseline gap-3">
                  <h1 className="text-6xl font-black tracking-tighter text-white">{(data?.balance || 0).toFixed(4)}</h1>
                  <span className="text-2xl font-bold text-primary italic">SOL</span>
               </div>
               <div className="flex gap-2 justify-center md:justify-start">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] font-black uppercase tracking-widest px-3">Insured</Badge>
                  <Badge className="bg-blue-500/10 text-blue-400 border-none text-[9px] font-black uppercase tracking-widest px-3">Layer-1 Ready</Badge>
               </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
               <Button className="flex-1 md:flex-none h-16 px-10 bg-primary text-midnight font-black uppercase text-xs tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  <ArrowDownRight size={18} className="mr-2" /> Top Up
               </Button>
               <Button variant="outline" className="flex-1 md:flex-none h-16 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-xs tracking-widest rounded-2xl">
                  <ArrowUpRight size={18} className="mr-2" /> Withdraw
               </Button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 🎯 Pending Claims */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-bold flex items-center gap-3">
                  <Gift className="text-primary" size={20} /> Collect Prize
               </h2>
               <span className="text-[10px] font-mono text-muted-foreground uppercase">{pendingPrizes.length} Pending</span>
            </div>
            
            {pendingPrizes.length === 0 ? (
               <div className="p-16 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/2 flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-white/5 opacity-20">
                     <History size={40} />
                  </div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-40">No pending prizes found</p>
               </div>
            ) : (
               <div className="grid gap-4">
                  {pendingPrizes.map((tx) => (
                     <Card key={tx.id} className="bg-card/40 border-primary/20 shadow-lg shadow-primary/5 rounded-[2rem] overflow-hidden group hover:border-primary transition-all">
                        <CardContent className="p-6 flex items-center justify-between gap-6">
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                 <PlusIcon value={tx.amount} />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-lg font-black text-white">{parseFloat(tx.amount).toFixed(4)} SOL</span>
                                 <span className="text-[10px] font-mono text-muted-foreground uppercase">{tx.meta?.contestName || 'Contest Reward'}</span>
                              </div>
                           </div>
                           <Button 
                             onClick={() => handleClaim(tx.id)}
                             disabled={claiming === tx.id}
                             className="h-12 px-6 bg-primary text-midnight font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all"
                           >
                              {claiming === tx.id ? <Loader2 className="animate-spin" /> : 'Claim Now'}
                           </Button>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            )}
         </div>

         {/* 📜 Ledger */}
         <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3 px-2">
               <History size={20} /> Registry
            </h2>
            <div className="bg-card/40 border border-border/40 rounded-[2rem] p-6 space-y-6 overflow-hidden relative">
               <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none opacity-40" />
               
               {history.map((tx, idx) => (
                  <div key={tx.id} className="flex flex-col gap-4">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${tx.type === 'PRIZE' || tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                              {tx.type === 'PRIZE' || tx.type === 'DEPOSIT' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                           </div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-white uppercase tracking-tight">{tx.type.replace('_', ' ')}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{new Date(tx.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <span className={`text-xs font-black ${tx.type === 'PRIZE' || tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'}`}>
                           {tx.type === 'PRIZE' || tx.type === 'DEPOSIT' ? '+' : '-'}{parseFloat(tx.amount).toFixed(3)}
                        </span>
                     </div>
                     {idx < history.length - 1 && <Separator className="bg-white/5" />}
                  </div>
               ))}
               
               {history.length === 0 && (
                  <div className="p-10 text-center text-[10px] uppercase font-bold text-muted-foreground opacity-30">Empty Registry</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

function PlusIcon({ value }: { value: string }) {
   return <Gift size={24} />;
}
