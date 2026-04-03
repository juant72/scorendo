'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, ChevronRight, Users, Sparkles, Key, Lock, ArrowLeft, PlusCircle, Shield } from 'lucide-react';
import { CreatePrivateModal } from '@/components/contests/CreatePrivateModal';
import { PageTransition, StaggerChildren, FadeInItem } from '@/components/layout/PageTransition';

export default function ContestsLobbyPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/contests')
      .then(res => res.json())
      .then(json => {
        if (json.success) setCompetitions(json.competitions);
      });
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-midnight text-white overflow-hidden selection:bg-primary/30">
        {/* Elite Heritage BG */}
        <div className="fixed inset-0 bg-net opacity-20 pointer-events-none" />
        <div className="fixed inset-0 bg-pitch-lines opacity-10 pointer-events-none" />

        <div className="container mx-auto px-4 py-12 sm:py-24 relative z-10">
          
          {/* ════ SECTION 1: GLOBAL LEAGUES ════ */}
          <div className="mb-24 sm:mb-40">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12 sm:mb-20 pb-8 border-b border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="h-0.5 w-12 bg-primary" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Authentic Competition</span>
                  </div>
                  <h1 className="text-7xl sm:text-[9rem] font-black uppercase italic tracking-tighter leading-none">
                      Global<br/><span className="text-primary truncate">Leagues</span>
                  </h1>
                </div>
                <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{competitions.length} Global Leagues Active</div>
            </div>

            <StaggerChildren delay={0.15}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {competitions.length > 0 ? competitions.map((comp) => (
                   <FadeInItem key={comp.id}>
                      <div 
                        onClick={() => router.push(`/contests/league/${comp.slug}`)}
                        className="group relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer stadium-shadow"
                      >
                         {/* Full-bleed Background */}
                         <div className="absolute inset-0 z-0">
                            <img 
                              src={`/arena_${comp.slug}.png`}
                              onError={(e) => { e.currentTarget.src = '/stadium_hero_default.png'; }}
                              alt="Arena Backdrop"
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity group-hover:scale-110 duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/50 to-transparent" />
                         </div>

                         {/* Card Content */}
                         <div className="relative z-10 h-full p-12 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                               <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl">
                                  <img 
                                    src={`/badge_${comp.slug}.png`}
                                    onError={(e) => { e.currentTarget.src = '/badge_default.png'; }}
                                    alt="Comp Badge"
                                    className="w-16 h-16 object-contain filter invert opacity-80"
                                    style={{ mixBlendMode: 'screen' }}
                                  />
                               </div>
                               <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                  <Users className="w-3 h-3 text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Arena</span>
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
                   </FadeInItem>
                )) : (
                  <div className="col-span-full py-24 glass rounded-[4rem] text-center border-dashed border-white/10">
                     <div className="text-primary/20 mb-6 flex justify-center"><Sparkles className="w-12 h-12" /></div>
                     <p className="text-xl font-black text-white/20 uppercase tracking-widest italic leading-none">Scanning World Leagues</p>
                  </div>
                )}
              </div>
            </StaggerChildren>
          </div>

          {/* ════ SECTION 2: PRIVATE BATTLES ════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              
              {/* Private Battles Section */}
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-wider flex items-center gap-4">
                      <Lock className="text-primary w-8 h-8" /> Private Battle
                   </h2>
                </div>
                
                <div className="space-y-10">
                   {/* Join Private Card */}
                   <div className="glass-strong p-12 rounded-[4rem] border-primary/20 stadium-shadow group relative overflow-hidden">
                      <div className="relative z-10">
                        <h4 className="text-2xl font-black text-white mb-4 uppercase italic">Recruit Base</h4>
                        <p className="text-sm text-white/40 mb-10 italic leading-relaxed">Enter an authorization code to access restricted tournament zones. No fee required for verified recruits.</p>
                        <div className="flex gap-4">
                          <input 
                            type="text" 
                            placeholder="AUTH_CODE" 
                            className="flex-1 h-16 bg-black/40 border border-white/10 rounded-2xl px-6 font-black text-xs tracking-widest focus:border-primary outline-none"
                          />
                          <button className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                            <ChevronRight className="text-midnight w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16" />
                   </div>

                   {/* Create Multiplier Card */}
                   <div 
                      onClick={() => setIsModalOpen(true)}
                      className="group p-12 rounded-[4rem] border border-dashed border-white/10 hover:border-primary/50 transition-all cursor-pointer bg-white/2 hover:bg-white/5 text-center"
                   >
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-colors">
                        <PlusCircle className="text-primary w-10 h-10" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-2 uppercase italic">Initialize Battlefield</h4>
                      <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Deploy private tournament protocol</p>
                   </div>
                </div>
              </div>

              {/* High Stakes Rewards Area */}
              <div className="lg:col-span-8">
                <div className="relative h-full rounded-[4rem] overflow-hidden border border-white/5 group">
                  <img 
                    src="/corporate_lobby.png" 
                    onError={(e) => { e.currentTarget.src = '/stadium_hero_default.png'; }}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-1000 group-hover:scale-105"
                    alt="Lobby Backdrop"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-16 flex flex-col justify-end">
                    <div className="space-y-8 max-w-xl">
                       <div className="flex items-center gap-4">
                          <Shield className="text-gold w-10 h-10" />
                          <span className="text-xs font-black text-gold uppercase tracking-[0.4em]">Corporate & Brand Tiers</span>
                       </div>
                       <h2 className="text-6xl sm:text-8xl font-black text-white uppercase italic leading-[0.85] tracking-tighter">
                          Pro<br/><span className="text-gold">Sponsorship</span>
                       </h2>
                       <p className="text-lg text-white/60 italic leading-relaxed">Unlock high-stakes arenas with verified brand rewards. Authenticate your terminal to participate in official global events.</p>
                       <button className="h-20 px-12 rounded-[2rem] bg-white text-midnight font-black text-xs uppercase tracking-[0.3em] hover:bg-primary hover:text-midnight transition-all hover:scale-105 shadow-2xl">
                          Authenticate Terminal
                       </button>
                    </div>
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
