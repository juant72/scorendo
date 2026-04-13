'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChevronRight, Sparkles, Key, Lock, PlusCircle, Shield, Activity, Fuel, Target, ShieldCheck } from 'lucide-react';
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
        
        {/* Functional Hero & Nav */}
        <div className="relative pt-24 pb-12 border-b border-white/5">
           <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
           
           <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="h-px w-8 bg-primary" />
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Arena Lobby</span>
                    </div>
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                       {activeSport.name.split(' ')[0]} <span className="text-white/20 italic">Chambers</span>
                    </h1>
                 </div>

                 {/* Pragmatic Navigation: Quick Pill Bar */}
                 <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {QUICK_FILTERS.map((f) => (
                       <button
                         key={f.id}
                         onClick={() => router.push(f.id === 'all' ? '/contests' : `/contests?sport=${f.id}`)}
                         className={`whitespace-nowrap h-11 px-6 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                            sportSlug === f.id 
                            ? 'bg-primary text-midnight shadow-lg shadow-primary/20' 
                            : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white'
                         }`}
                       >
                          <f.icon size={14} />
                          {f.name}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          
          {/* Main Grid: Data-Rich League Cards */}
          <div className="mb-32">
             {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-20">
                   {[1,2,3,4].map(i => <div key={i} className="h-64 glass-premium rounded-3xl animate-pulse" />)}
                </div>
             ) : competitions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {competitions.map((comp) => {
                      const imagery = getArenaImagery(comp);
                      return (
                        <div 
                          key={comp.id}
                          onClick={() => router.push(`/contests/league/${comp.slug}`)}
                          className="group relative h-72 rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/40 transition-all hover:-translate-y-1 cursor-pointer shadow-2xl"
                        >
                           {/* BG Overlay */}
                           <div className="absolute inset-0">
                              <img src={imagery.banner} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700" alt="Arena" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-[#020814]/40 to-transparent" />
                           </div>

                           {/* Content */}
                           <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                 <div className="p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                    <img src={imagery.badge} alt="Logo" className="w-10 h-10 object-contain" />
                                 </div>
                                 <Badge text="ACTIVE RECRUITMENT" />
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                                 <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                                       {comp.name}
                                    </h3>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{comp.country || 'International'} Division</p>
                                 </div>
                                 <button className="h-12 px-8 bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-midnight rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Join Arena
                                 </button>
                              </div>
                           </div>
                        </div>
                      );
                   })}
                </div>
             ) : (
                <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                   <Sparkles className="mx-auto text-white/5 mb-6" size={64} />
                   <p className="text-white/20 font-black uppercase tracking-[0.4em] italic">No Active Arenas in this Sector</p>
                </div>
             )}
          </div>

          {/* Secondary Actions: Private & Pro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
             
             {/* Battle Deployment (Private) */}
             <div className="lg:col-span-5 glass-premium p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
                   <Lock size={200} />
                </div>
                
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-3 text-primary">
                      <Lock size={18} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Restricted Zones</span>
                   </div>
                   <h2 className="text-4xl font-black text-white uppercase italic leading-none">Private <span className="text-white/30">Battles</span></h2>
                   <p className="text-sm text-white/40 italic leading-relaxed max-w-sm">Launch a custom arena or use an authorization signature to penetrate private tournament layers.</p>
                </div>

                <div className="space-y-3 relative z-10">
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="SIGNATURE_CODE" 
                        className="flex-1 h-16 bg-white/5 border border-white/10 rounded-2xl px-6 font-black text-xs tracking-widest focus:border-primary outline-none placeholder:text-white/10"
                      />
                      <button className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-midnight transition-all">
                         <ChevronRight size={24} />
                      </button>
                   </div>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="w-full h-14 border border-dashed border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-all rounded-2xl flex items-center justify-center gap-2"
                   >
                      <PlusCircle size={14} /> Initialize Conflict protocol
                   </button>
                </div>
             </div>

             {/* Pro Sponsorship (High Stakes) */}
             <div className="lg:col-span-7 relative rounded-[2.5rem] overflow-hidden group shadow-2xl min-h-[400px]">
                <img src="/corporate_lobby.png" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-1000 group-hover:scale-105" alt="Pro" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020814] via-[#020814]/40 to-transparent" />
                
                <div className="relative h-full p-12 flex flex-col justify-end items-start space-y-8">
                   <div className="flex items-center gap-3 text-gold">
                      <Shield size={24} />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em]">High-Clearance Rewards</span>
                   </div>
                   <h2 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">Verified<br/><span className="text-gold">Sponsorship</span></h2>
                   <p className="text-base text-white/30 italic max-w-md">Official brand-sanctioned events. Liquidate high-tier tokens by proving market dominance.</p>
                   <button className="h-16 px-12 bg-white text-midnight font-black text-xs uppercase tracking-[0.3em] hover:bg-gold hover:scale-105 transition-all rounded-2xl shadow-2xl shadow-black/50">
                      Request Authentication
                   </button>
                </div>
             </div>

          </div>
        </div>

        {isModalOpen && <CreatePrivateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </div>
    </PageTransition>
  );
}

function Badge({ text }: { text: string }) {
   return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
         <span className="text-[8px] font-black text-white/60 tracking-widest uppercase">{text}</span>
      </div>
   );
}

export default function ContestsLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020814] flex items-center justify-center"><Sparkles className="animate-pulse text-primary/50" size={32} /></div>}>
      <ContestsLobbyContent />
    </Suspense>
  );
}
