'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ChevronRight, Users, Sparkles, Key, Lock, ArrowLeft, PlusCircle, Shield } from 'lucide-react';
import { CreatePrivateModal } from '@/components/contests/CreatePrivateModal';

export default function ContestsLobbyPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    paramsPromise.then(p => setLocale(p.locale || 'en'));
    fetch('/api/contests')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCompetitions(json.competitions);
      });
  }, [paramsPromise]);

  return (
    <div className="relative min-h-screen bg-midnight selection:bg-primary/30 overflow-x-hidden">
      {/* Stadium Environment Layers */}
      <div className="fixed inset-0 bg-net opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-pitch-lines opacity-10 pointer-events-none" />
      
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-20">
        
        {/* Lobby Header */}
        <div className="mb-24 text-center md:text-left">
           <div className="inline-block px-4 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Global Discovery Arena</span>
           </div>
           <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-10 drop-shadow-2xl">
              {locale === 'en' ? 'Choose Your' : 'Elige Tu'} <br/>
              <span className="text-primary italic">Battlefield.</span>
           </h1>
           <p className="max-w-2xl text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed opacity-80">
              Enter professional arenas or challenge private corporate rivalries. 
              Secure your place in the hall of fame.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Section 1: Professional Global Hub */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
               <h2 className="text-3xl font-black text-white uppercase italic tracking-wider flex items-center gap-4">
                  <Trophy className="text-yellow-500 w-8 h-8" /> Pro Arenas
               </h2>
               <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{competitions.length} Global Leagues Active</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {competitions.length > 0 ? competitions.map((comp) => (
                 <div 
                   key={comp.id} 
                   onClick={() => router.push(`/contests/league/${comp.slug}`)}
                   className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer stadium-shadow"
                 >
                    {/* Full-bleed Background */}
                    <div className="absolute inset-0 z-0">
                       <img 
                          src="/stadium_hero.png" 
                          alt={comp.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0" 
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent z-10" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 h-full p-10 flex flex-col justify-between">
                       <div className="flex justify-between items-start">
                          <div className="h-16 w-16 rounded-2xl bg-midnight/80 backdrop-blur-xl border border-white/20 p-3 stadium-shadow flex items-center justify-center">
                             {comp.logoUrl ? (
                                <img src={comp.logoUrl} className="w-full h-full object-contain" alt="Lg" />
                             ) : (
                                <Shield className="w-8 h-8 text-primary/40" />
                             )}
                          </div>
                          <div className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">{comp.category || 'Major League'}</span>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-[0.85] italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                             {comp.name}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-xs font-black text-white/60 uppercase tracking-widest">{comp.country || 'International'} Arena</span>
                             </div>
                             <div className="h-14 px-8 rounded-2xl bg-primary text-midnight font-black text-xs uppercase tracking-widest flex items-center justify-center shadow-[0_10px_30px_rgba(0,230,118,0.3)] group-hover:scale-105 transition-transform">
                                Enter Arena
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Shimmer overlay for premium feel */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
                 </div>
              )) : (
                <div className="col-span-full py-24 glass rounded-[4rem] text-center border-dashed border-white/10">
                   <div className="text-primary/20 mb-6 flex justify-center"><Sparkles className="w-12 h-12" /></div>
                   <p className="text-xl font-black text-white/20 uppercase tracking-widest italic leading-none">Scanning World Leagues</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Private & Corporate Entry */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
               <h2 className="text-3xl font-black text-white uppercase italic tracking-wider flex items-center gap-4">
                  <Lock className="text-primary w-8 h-8" /> Private Battle
               </h2>
            </div>
            
            <div className="space-y-10">
               {/* Join Private Card */}
               <div className="glass-strong p-12 rounded-[4rem] border-primary/20 stadium-shadow group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
                  <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-10 group-hover:rotate-12 transition-transform">
                     <Key className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">Got a Code?</h3>
                  <p className="text-muted-foreground text-sm font-medium mb-10 opacity-70">Enter your private invite key to join your team or company's custom battleground.</p>
                  
                  {/* Simplified Input for now or use component */}
                  <div className="flex gap-4">
                     <input 
                        type="text" 
                        placeholder="ENTER CODE" 
                        className="flex-1 h-14 bg-midnight/80 border-2 border-white/10 rounded-2xl px-6 text-white font-black tracking-widest focus:border-primary outline-none transition-all stadium-shadow uppercase"
                     />
                     <button className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-midnight shadow-[0_0_20px_rgba(0,230,118,0.3)] hover:scale-105 transition-transform active:scale-95">
                        <ChevronRight className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               {/* Create Private Tool */}
               <div 
                 onClick={() => setIsModalOpen(true)}
                 className="relative group glass-strong rounded-[4rem] p-12 border-dashed border-white/10 cursor-pointer overflow-hidden hover:border-gold/30 transition-all stadium-shadow"
               >
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-10">
                     <div className="p-4 bg-gold/10 rounded-2xl border border-gold/20 text-gold group-hover:scale-110 transition-transform">
                        <Sparkles className="w-10 h-10" />
                     </div>
                     <ChevronRight className="w-8 h-8 text-gold/20 group-hover:translate-x-3 transition-transform group-hover:text-gold" />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 italic leading-none">Clone a Arena</h3>
                  <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em] mb-4">Managers Tool</p>
                  <p className="text-xs text-muted-foreground font-medium opacity-60">Host your own private league by cloning any active professional tournament.</p>
                  
                  <img 
                    src="/corporate_hero.png" 
                    className="absolute -bottom-20 -right-20 w-64 h-64 opacity-5 group-hover:opacity-20 grayscale transition-all duration-1000" 
                    alt="Stadium Backdrop"
                  />
               </div>
            </div>
          </div>

        </div>
      </main>

      <CreatePrivateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
