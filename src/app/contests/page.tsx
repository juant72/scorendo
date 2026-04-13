'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronRight, Sparkles, PlusCircle, Target, Activity, Fuel, ShieldCheck, Search, Trophy, Key } from 'lucide-react';
import ContestCard from '@/components/contests/ContestCard';
import { CreatePrivateModal } from '@/components/contests/CreatePrivateModal';
import { PageTransition } from '@/components/layout/PageTransition';
import { getArenaImagery } from '@/lib/graphics';

const QUICK_FILTERS = [
  { id: 'all', name: 'Command Center', icon: Sparkles },
  { id: 'football', name: 'Football', icon: Activity },
  { id: 'motorsports', name: 'Formula 1', icon: Fuel },
  { id: 'nba', name: 'NBA', icon: Target },
  { id: 'rugby', name: 'Rugby', icon: ShieldCheck },
];

function ContestsLobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sportSlug = searchParams.get('sport') || 'all';
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line
    setLoading(true);
    const url = sportSlug !== 'all' ? `/api/contests?sport=${sportSlug}` : '/api/contests';
    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.success) setCompetitions(json.competitions);
        setLoading(false);
      });
  }, [sportSlug]);

  const activeSport = QUICK_FILTERS.find(f => f.id === sportSlug) || QUICK_FILTERS[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#020814] text-white selection:bg-primary/30">
        
        {/* ═ TACTICAL COMMAND HEADER ═ */}
        <div className="border-b-2 border-white/10 bg-[#020814]/80 backdrop-blur-3xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
           <div className="max-w-6xl mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                 
                 <div className="flex items-center gap-6">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                       <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                          <Trophy className="text-primary w-7 h-7 filter drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                       </div>
                       {activeSport.name} <span className="text-primary">Sectors</span>
                    </h1>
                 </div>

                 {/* ═ TACTICAL SECTOR NAV ═ */}
                 <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {QUICK_FILTERS.map((f) => {
                       const isActive = sportSlug === f.id;
                       return (
                          <button
                            key={f.id}
                            onClick={() => router.push(f.id === 'all' ? '/contests' : `/contests?sport=${f.id}`)}
                            className={`whitespace-nowrap h-12 px-6 rounded-xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden group/btn ${
                               isActive 
                               ? 'bg-primary text-midnight shadow-[0_0_20px_rgba(0,230,118,0.3)]' 
                               : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                             <f.icon size={12} className={isActive ? 'animate-pulse' : ''} />
                             {f.name}
                             {!isActive && (
                               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                             )}
                          </button>
                       );
                    })}
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-10">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Main List Column */}
              <div className="lg:col-span-8 space-y-8">
                 
                 {/* Search & Tactical Filtering */}
                 <div className="flex bg-[#060D1A] border-2 border-white/5 rounded-[1.5rem] p-1.5 gap-2 shadow-inner">
                    <div className="flex-1 relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search Active Combat Sectors..." 
                         className="w-full h-12 bg-transparent pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/10 outline-none"
                       />
                    </div>
                 </div>

                 {/* High-Velocity Data Rows */}
                 <div className="space-y-4">
                    {loading ? (
                       [1,2,3,4].map(i => <div key={i} className="h-28 bg-[#060D1A] rounded-[2rem] animate-pulse border-2 border-white/5" />)
                    ) : competitions.length > 0 ? (
                       competitions.map((comp) => (
                         <ContestCard key={comp.id} {...comp} prizePoolPoolAmount={comp.prizePool ? Number(comp.prizePool) / 1e9 : 0} />
                       ))
                    ) : (
                       <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02]">
                          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10">
                             <Target className="text-white/10" size={40} />
                          </div>
                          <h3 className="text-xl font-black text-white uppercase italic tracking-[0.2em] mb-3">No Arenas Detected</h3>
                          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Scanning system for available deployment zones...</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Practical Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                 
                 {/* ═ ENCRYPTED ACCESS NODE ═ */}
                 <div className="bg-[#060D1A] p-8 rounded-[2.5rem] border-2 border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />
                    <div className="flex items-center gap-3 text-primary mb-8 border-b border-white/5 pb-5">
                       <Key size={16} className="animate-pulse" />
                       <span className="text-[11px] font-black uppercase tracking-[0.4em]">Encrypted Access</span>
                    </div>
                    
                    <div className="space-y-5">
                       <div className="flex gap-2 relative">
                          <input 
                            type="text" 
                            placeholder="Enter Signature" 
                            className="flex-1 h-14 bg-black/40 border border-white/10 rounded-2xl px-6 font-black text-[11px] uppercase tracking-[0.2em] focus:border-primary/50 outline-none text-white placeholder:text-white/10 transition-all"
                          />
                          <button className="w-14 h-14 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-midnight transition-all shadow-xl hover:shadow-primary/20">
                             <ChevronRight size={20} />
                          </button>
                       </div>
                       <button 
                         onClick={() => setIsModalOpen(true)}
                         className="w-full h-14 border-2 border-dashed border-white/10 hover:border-primary/40 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-primary transition-all rounded-2xl flex items-center justify-center gap-3 bg-white/[0.01]"
                       >
                          <PlusCircle size={16} /> Initialize Node
                       </button>
                    </div>
                 </div>

                 {/* ═ ELITE SECTOR RECON ═ */}
                 <div className="relative rounded-[2.5rem] overflow-hidden group shadow-[0_0_50px_rgba(255,215,0,0.05)] border-2 border-gold/10 hover:border-gold/30 transition-all h-80 flex flex-col justify-end">
                    <img src="/corporate_lobby.png" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000" alt="Pro" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A]/90 to-transparent" />
                    
                    <div className="relative p-8 flex flex-col items-center text-center space-y-6">
                       <div className="bg-gold/10 p-5 rounded-3xl border border-gold/20 shadow-[0_0_30px_rgba(255,215,0,0.2)] group-hover:scale-110 transition-transform">
                          <Trophy className="text-gold" size={32} />
                       </div>
                       <div className="space-y-2">
                          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">Elite <span className="text-gold">Sectors</span></h2>
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] max-w-[220px] leading-relaxed mx-auto">High stakes arenas with confirmed liquidity pools for top-tier tacticians.</p>
                       </div>
                       <button className="w-full h-12 bg-gold/10 hover:bg-gold text-gold hover:text-midnight border border-gold/20 font-black text-[10px] uppercase tracking-[0.3em] transition-all rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                          Request Deployment
                       </button>
                    </div>
                 </div>

              </div>
           </div>
        </div>

        {isModalOpen && <CreatePrivateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </div>
    </PageTransition>
  );
}

function Badge({ text, lively }: { text: string, lively?: boolean }) {
   return (
      <div className={`flex items-center gap-2 px-2 py-1 rounded-md border ${lively ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/10'}`}>
         {lively && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
         <span className={`text-[8px] font-black tracking-widest uppercase ${lively ? 'text-white/80' : 'text-white/40'}`}>{text}</span>
      </div>
   );
}

export default function ContestsLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020814] flex items-center justify-center"><Sparkles className="animate-pulse text-white/10" size={32} /></div>}>
      <ContestsLobbyContent />
    </Suspense>
  );
}
