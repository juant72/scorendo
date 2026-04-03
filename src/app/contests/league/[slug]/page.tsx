'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, Trophy, Calendar, Users, ChevronRight, ArrowLeft, Shield, Sparkles, LayoutGrid, ListOrdered } from 'lucide-react';
import { TeamBadge } from '@/components/contests/TeamBadge';
import { TournamentRankings } from '@/components/contests/TournamentRankings';
import { PageTransition, StaggerChildren, FadeInItem } from '@/components/layout/PageTransition';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import Link from 'next/link';

export default function LeagueDashboardPage() {
  const router = useRouter();
  const { slug } = useParams();
  const { locale } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'rankings'>('matches');

  useEffect(() => {
    fetch(`/api/contests/league/${slug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.competition);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) return null;

  const tournament = data.tournaments?.[0];
  const seasonContests = tournament?.contests || [];
  const matchdays = tournament?.phases || [];

  return (
    <div className="relative min-h-screen bg-midnight selection:bg-primary/30">
      <PageTransition>
        {/* Background Layers */}
        <div className="fixed inset-0 bg-net opacity-20 pointer-events-none" />
        <div className="fixed inset-0 bg-pitch-lines opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-16">
          
          {/* Navigation */}
          <Breadcrumbs items={[{ label: data?.name || 'League' }]} />

          {/* Dynamic Stadium Hero */}
          <div className="relative rounded-[3.5rem] overflow-hidden stadium-shadow mb-20 group border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/60 to-transparent z-10" />
            <img 
              src={
                slug === 'argentine-football-first-div' ? '/arena_argentina.png' :
                slug === 'european-champions-cup' ? '/arena_eurocup.png' :
                slug === 'fifa-world-cup-2026' ? '/arena_worldcup.png' :
                '/stadium_hero.png'
              } 
              alt="Stadium Arena" 
              className="w-full h-80 sm:h-[450px] object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" 
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 md:p-16">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-3xl">
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md mb-6">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#00E676]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{data.category || 'Professional League'}</span>
                     </div>
                     <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
                        {data.name}
                     </h1>
                     <p className="text-muted-foreground text-lg md:text-xl max-w-xl font-medium leading-relaxed opacity-90">
                        High-stakes predictions. Precise score analysis. 
                        Command the leaderboard of the {data.name}.
                     </p>
                  </div>
                  <div className="hidden md:block">
                     <div className="glass-strong p-6 rounded-[2rem] border-white/20 text-right">
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Live Status</div>
                        <div className="text-3xl font-black text-white uppercase italic">Active Season</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Grid Layout: Season vs Matchday */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Season Hub */}
            <div className="lg:col-span-4 space-y-10">
               <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 mb-8 flex items-center gap-4">
                     Season Glory
                  </h2>
                  <div className="space-y-6">
                     {seasonContests.length > 0 ? seasonContests.map((contest: any) => (
                        <div 
                          key={contest.id}
                          onClick={() => router.push(`/contests/${contest.slug}`)}
                          className={`group relative glass rounded-[2.5rem] p-8 border-white/5 hover:border-gold/50 cursor-pointer transition-all hover:-translate-y-1 ${contest.tier === 'PREMIUM' ? 'shimmer-gold' : ''}`}
                        >
                           <div className="absolute top-4 right-6 text-gold/20 group-hover:text-gold/50 transition-colors">
                              <Trophy className="w-10 h-10" />
                           </div>
                           <div className="text-[10px] font-black text-gold uppercase tracking-widest mb-3">
                              {contest.tier} Tier
                           </div>
                           <h3 className="text-2xl font-black text-white mb-6 leading-none">{contest.name}</h3>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center -space-x-2">
                                 {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/10 border-2 border-midnight" />)}
                                 <span className="ml-4 text-xs font-bold text-muted-foreground">{contest._count?.entries || 0}</span>
                              </div>
                              <div className="h-10 px-4 rounded-xl bg-gold/10 flex items-center justify-center text-gold font-black text-[10px] uppercase tracking-widest group-hover:bg-gold group-hover:text-black transition-all">
                                 {contest.entryFeeSOL > 0 ? `${contest.entryFeeSOL} SOL` : 'FREE Entry'}
                              </div>
                           </div>
                        </div>
                     )) : (
                       <div className="glass rounded-[2rem] p-10 text-center border-dashed border-white/10">
                          <p className="text-muted-foreground text-sm font-medium italic opacity-50">Season leaderboards loading...</p>
                       </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Right Column: Matchday Scroll */}
            <div className="lg:col-span-8">
               <div className="sticky top-0 z-50 flex items-center justify-between gap-4 mb-4 sm:mb-8 py-4 sm:py-0 bg-midnight/80 backdrop-blur-xl sm:bg-transparent sm:backdrop-blur-none -mx-4 px-4 sm:mx-0 sm:px-0">
                  <h2 className="hidden sm:flex text-xs font-black uppercase tracking-[0.4em] text-primary/60 items-center gap-4">
                     Tournament Hub
                  </h2>
                  <div className="flex bg-midnight/50 p-1 rounded-2xl border border-white/5 backdrop-blur-xl w-full sm:w-auto">
                     <button 
                       onClick={() => setActiveTab('matches')}
                       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-2 rounded-xl text-xs sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'matches' ? 'bg-primary text-midnight shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                     >
                        <LayoutGrid className="w-4 h-4 sm:w-3 sm:h-3" /> Matches
                     </button>
                     <button 
                       onClick={() => setActiveTab('rankings')}
                       className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-2 rounded-xl text-xs sm:text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'rankings' ? 'bg-primary text-midnight shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                     >
                        <ListOrdered className="w-4 h-4 sm:w-3 sm:h-3" /> Ranking
                     </button>
                  </div>
               </div>

               <StaggerChildren delay={0.1}>
                  <div className="space-y-6">
                     {activeTab === 'rankings' ? (
                        <FadeInItem>
                           <TournamentRankings contestId={seasonContests[0]?.id} />
                        </FadeInItem>
                     ) : matchdays.length > 0 ? matchdays.map((phase: any) => (
                        <FadeInItem key={phase.id}>
                          <div className="glass-strong rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border-white/10 group hover:border-primary/40 transition-all shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-10">
                               <div className="space-y-1 sm:space-y-2">
                                  <div className="text-[9px] sm:text-[10px] font-black text-primary/80 uppercase tracking-[0.3em]">
                                     {new Date(phase.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </div>
                                  <h4 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{phase.name}</h4>
                               </div>

                                <div className="flex flex-wrap items-center gap-4">
                                   {Array.from(new Map(phase.contests?.map((c: any) => [c.entryFeeSOL > 0 ? 'PRO' : 'FREE', c])).values()).map((c: any) => (
                                      <button
                                         key={c.id}
                                         onClick={() => router.push(`/contests/${c.slug}`)}
                                         className={`group/btn relative h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden border shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3 ${c.entryFeeSOL > 0 ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white border-white/10 hover:border-primary/50'}`}
                                      >
                                         {c.entryFeeSOL > 0 ? 'Pro Battle' : 'Free Entry'}
                                         <ChevronRight className="w-4 h-4" />
                                      </button>
                                   ))}
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {phase.matches?.map((m: any) => (
                                   <div key={m.id} className="flex items-center justify-between glass-strong py-4 px-6 rounded-3xl border-white/10 hover:border-primary/30 transition-all stadium-shadow group/match relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/match:opacity-30 transition-opacity">
                                         <Calendar className="w-8 h-8" />
                                      </div>

                                      <div className="flex items-center gap-3 w-[40%]">
                                         <TeamBadge name={m.homeTeam.name} code={m.homeTeam.code} size="sm" />
                                      </div>

                                      <div className="flex flex-col items-center gap-1 w-[20%] text-center">
                                         <span className="text-[10px] font-black text-primary italic leading-none">VS</span>
                                         <span className="text-[9px] font-bold text-muted-foreground tabular-nums opacity-60">
                                            {m.kickoff ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(m.kickoff)) : 'TBD'}
                                         </span>
                                      </div>
                                      
                                      <div className="flex items-center justify-end gap-3 w-[40%]">
                                         <TeamBadge name={m.awayTeam.name} code={m.awayTeam.code} size="sm" />
                                      </div>
                                   </div>
                                ))}
                            </div>
                          </div>
                        </FadeInItem>
                     )) : (
                        <FadeInItem>
                          <div className="glass rounded-[3rem] p-24 text-center border-dashed border-white/20">
                             <Calendar className="w-12 h-12 text-primary/20 mx-auto mb-6" />
                             <p className="text-lg font-black text-white/20 uppercase tracking-widest">Awaiting Kickoff Data</p>
                          </div>
                        </FadeInItem>
                     )}
                  </div>
               </StaggerChildren>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
