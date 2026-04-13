'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronRight, Sparkles, PlusCircle, Target, Activity, Fuel, ShieldCheck, Search, Trophy, Key } from 'lucide-react';
import { CreatePrivateModal } from '@/components/contests/CreatePrivateModal';
import { PageTransition } from '@/components/layout/PageTransition';
import { getArenaImagery } from '@/lib/graphics';

const QUICK_FILTERS = [
  { id: 'all', name: 'All Arenas', icon: Sparkles },
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
        
        {/* Sleek, Esports Header */}
        <div className="border-b-2 border-white/10 bg-[#020814]/80 backdrop-blur-3xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
           <div className="max-w-6xl mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 
                 <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                       <Trophy className="text-primary w-6 h-6 animate-pulse filter drop-shadow-[0_0_10px_rgba(0,230,118,0.5)]" />
                       {activeSport.name} <span className="text-primary">Arenas</span>
                    </h1>
                 </div>

                 {/* Compact Esports Pill Bar */}
                 <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {QUICK_FILTERS.map((f) => (
                       <button
                         key={f.id}
                         onClick={() => router.push(f.id === 'all' ? '/contests' : `/contests?sport=${f.id}`)}
                         className={`whitespace-nowrap h-8 px-4 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                            sportSlug === f.id 
                            ? 'bg-primary text-midnight shadow-md shadow-primary/20' 
                            : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                         }`}
                       >
                          <f.icon size={12} />
                          {f.name}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main List Column */}
              <div className="lg:col-span-8 space-y-6">
                 
                 {/* Search & Filter Bar */}
                 <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 gap-2">
                    <div className="flex-1 relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                       <input 
                         type="text" 
                         placeholder="Search tournaments..." 
                         className="w-full h-10 bg-transparent pl-10 pr-4 text-xs font-medium text-white placeholder:text-white/20 outline-none"
                       />
                    </div>
                 </div>

                 {/* High-Velocity Data Rows */}
                 <div className="space-y-3">
                    {loading ? (
                       [1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)
                    ) : competitions.length > 0 ? (
                       competitions.map((comp) => {
                          const imagery = getArenaImagery(comp);
                          return (
                            <div 
                              key={comp.id}
                              onClick={() => router.push(`/contests/league/${comp.slug}`)}
                              className="group relative bg-[#0A0F1A] rounded-2xl overflow-hidden border-2 border-white/5 hover:border-primary/60 hover:shadow-[0_0_25px_rgba(0,230,118,0.15)] transition-all cursor-pointer flex flex-col sm:flex-row transform hover:-translate-y-1"
                            >
                               {/* Left Accent Bar / Imagery Hint */}
                               <div className="w-full sm:w-32 h-16 sm:h-auto relative shrink-0 overflow-hidden">
                                  <img src={imagery.banner} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" alt="Arena" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0F1A] hidden sm:block" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] to-transparent sm:hidden" />
                                  <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:pl-6 z-10">
                                     <div className="bg-black/50 p-2 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors">
                                        <img src={imagery.badge} alt="Logo" className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                                     </div>
                                  </div>
                               </div>

                               {/* Row Data */}
                               <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                  <div className="space-y-1 relative">
                                     <h3 className="text-xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors filter drop-shadow-md">
                                        {comp.name}
                                     </h3>
                                     <div className="flex items-center gap-3">
                                        <Badge text={comp.status === 'ACTIVE' ? 'LIVE NOW' : 'UPCOMING'} lively={comp.status === 'ACTIVE'} />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{comp.country || 'Global'} Server</span>
                                     </div>
                                  </div>

                                  <div className="flex items-center gap-6">
                                     <div className="hidden sm:flex flex-col text-right">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Prize Pool</span>
                                        <span className="text-sm font-black italic text-gold drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]">{comp.prizePool ? (Number(comp.prizePool) / 1e9).toFixed(2) + ' SOL' : 'TBD'}</span>
                                     </div>
                                     <button className="h-10 px-6 bg-primary/10 border-2 border-primary/20 text-primary group-hover:bg-primary group-hover:text-midnight group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(0,230,118,0.4)] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
                                        Enter Area
                                     </button>
                                  </div>
                               </div>
                            </div>
                          );
                       })
                    ) : (
                       <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
                          <Sparkles className="mx-auto text-white/10 mb-4" size={32} />
                          <p className="text-white/20 text-xs font-black uppercase tracking-[0.2em]">No Arenas in this Sector</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Practical Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                 
                 {/* Compact Private Room Bar */}
                 <div className="bg-[#060D1A] p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-primary mb-4 border-b border-white/5 pb-3">
                       <Key size={14} />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Private Chambers</span>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Enter Signature" 
                            className="flex-1 h-10 bg-white/5 border border-white/5 rounded-xl px-4 font-bold text-xs tracking-wider focus:border-primary/50 outline-none text-white placeholder:text-white/20"
                          />
                          <button className="w-10 h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center hover:bg-primary hover:text-midnight transition-colors">
                             <ChevronRight size={16} />
                          </button>
                       </div>
                       <button 
                         onClick={() => setIsModalOpen(true)}
                         className="w-full h-10 border border-dashed border-white/10 hover:border-primary/50 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-primary transition-all rounded-xl flex items-center justify-center gap-2"
                       >
                          <PlusCircle size={12} /> Create Custom Arena
                       </button>
                    </div>
                 </div>

                 {/* Compact Verified Sponsorship */}
                 <div className="relative rounded-2xl overflow-hidden group shadow-[0_0_30px_rgba(255,215,0,0.05)] border border-gold/10 hover:border-gold/30 transition-colors">
                    <img src="/corporate_lobby.png" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" alt="Pro" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-[#0A0F1A]/80 to-transparent" />
                    
                    <div className="relative p-6 flex flex-col items-center text-center space-y-4">
                       <div className="bg-gold/10 p-3 rounded-full border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                          <Trophy className="text-gold" size={24} />
                       </div>
                       <div className="space-y-1">
                          <h2 className="text-xl font-black text-white uppercase italic tracking-wide drop-shadow-md">Pro <span className="text-gold">Matches</span></h2>
                          <p className="text-[10px] text-white/50 font-bold max-w-[200px] leading-relaxed mx-auto">High stakes arenas with massive confirmed liquidity.</p>
                       </div>
                       <button className="h-8 px-6 bg-gold/20 hover:bg-gold text-gold hover:text-midnight border border-gold/40 font-black text-[9px] uppercase tracking-widest transition-all rounded-lg shadow-[0_0_10px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                          Unlock
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
