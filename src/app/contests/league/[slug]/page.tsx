'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Loader2, Trophy, Calendar, Users, ChevronRight, ArrowLeft, 
  Shield, Sparkles, LayoutGrid, ListOrdered, Target, 
  Zap, Activity, ShieldCheck, PlusCircle, Settings 
} from 'lucide-react';
import { TeamBadge } from '@/components/contests/TeamBadge';
import { TournamentRankings } from '@/components/contests/TournamentRankings';
import { PageTransition, StaggerChildren, FadeInItem } from '@/components/layout/PageTransition';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { getArenaImagery } from '@/lib/graphics';
import { DataFlowPulse } from '@/components/contests/LivePulse';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LeagueDashboardPage() {
  const router = useRouter();
  const { slug } = useParams();
  const { user } = useAuthStore();
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020814] gap-6">
        <div className="relative">
           <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
           </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 animate-pulse">Syncing Arena Data...</span>
      </div>
    );
  }

  if (!data) {
     return (
        <div className="min-h-screen bg-[#020814] flex items-center justify-center">
           <div className="text-center">
              <Target size={60} className="text-white/10 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Arena Link Offline</h2>
              <button 
                onClick={() => router.push('/contests')}
                className="px-8 h-12 bg-white text-midnight font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
              >
                 Return to Sectors
              </button>
           </div>
        </div>
     );
  }

  const tournament = data.tournaments?.[0];
  const seasonContests = tournament?.contests || [];
  const matchdays = tournament?.phases || [];
  const imagery = getArenaImagery({ name: data.name, slug: data.slug });

  return (
    <div className="relative min-h-screen bg-[#020814] selection:bg-primary/30 pb-20">
      <PageTransition>
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEwIDBMMjAgNXYxMEwxMCAyMEwwIDE1VjV6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-40 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          
          {/* Navigation & Operational Info */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
             <Breadcrumbs 
               items={[
                  { label: 'Sectors', href: '/contests' },
                  { label: data.sport?.name || 'Protocol', href: `/contests?sport=${data.sport?.slug}` },
                  { label: data.name }
               ]} 
             />
             <div className="hidden md:flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Protocol Version</span>
                   <span className="text-[11px] font-black text-primary tracking-tighter">v4.2.0-STADIUM</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-[#00E676] rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Node Verified</span>
                   <DataFlowPulse />
                </div>
             </div>
          </div>

          {/* Cinematic Stadium Hero */}
          <div className="relative rounded-[3rem] overflow-hidden mb-16 border-2 border-white/10 bg-[#060D1A] group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020814] via-[#020814]/40 to-transparent z-10" />
            <img 
              src={imagery.banner} 
              alt="Arena" 
              className="w-full h-[350px] md:h-[500px] object-cover opacity-50 contrast-125 scale-105 group-hover:scale-100 transition-all duration-[2000ms]" 
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="max-w-4xl">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl">
                           <img src={imagery.badge || '/badge_worldcup.png'} alt="League Logo" className="w-6 h-6 object-contain opacity-80" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{data.category || 'Professional Division'}</span>
                        </div>
                        {user?.isAdmin && (
                           <Link href={`/admin/competitions/${data.id}`} className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-midnight transition-all">
                              <Settings size={14} />
                           </Link>
                        )}
                     </div>
                     <h1 className="text-6xl md:text-9xl font-black text-white mb-6 uppercase italic tracking-tighter leading-[0.8] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                        {data.name}
                     </h1>
                     <div className="flex flex-wrap items-center gap-8 mt-10">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1">Status</span>
                           <span className="text-xl font-black text-white uppercase italic tracking-tighter">Active Arena</span>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Operational Area</span>
                           <span className="text-xl font-black text-white uppercase italic tracking-tighter">{data.country || 'Global'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar: Primary Contests */}
            <div className="lg:col-span-4 space-y-12">
               <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-4">
                     <span className="w-8 h-px bg-white/10" /> High Stakes Hub
                  </h2>
                  <div className="space-y-4">
                     {seasonContests.length > 0 ? seasonContests.map((contest: any) => (
                        <motion.div 
                          key={contest.id}
                          whileHover={{ x: 10 }}
                          onClick={() => router.push(`/contests/${contest.slug}`)}
                          className={`group relative bg-[#060D1A] rounded-3xl p-6 border-2 border-white/5 hover:border-primary/40 cursor-pointer transition-all ${contest.tier === 'PREMIUM' ? 'shadow-[0_0_30px_-5px_rgba(255,215,0,0.1)] border-gold/30' : ''}`}
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${contest.tier === 'PREMIUM' ? 'bg-gold text-midnight' : 'bg-white/5 text-white/40'}`}>
                                 {contest.tier} TIER
                              </div>
                              <Trophy size={16} className={contest.tier === 'PREMIUM' ? 'text-gold' : 'text-white/10'} />
                           </div>
                           <h3 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter">{contest.name}</h3>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <Users size={12} className="text-white/20" />
                                 <span className="text-[10px] font-black text-white/40">{contest._count?.entries || 0} DEPLOYED</span>
                              </div>
                              <div className="text-primary font-black text-[12px] uppercase">
                                 {contest.entryFeeSOL > 0 ? `${contest.entryFeeSOL} SOL` : 'FREE'}
                              </div>
                           </div>
                        </motion.div>
                     )) : (
                       <div className="bg-[#060D1A]/50 rounded-3xl p-10 text-center border-2 border-dashed border-white/5">
                          <Activity className="mx-auto text-white/5 mb-4" size={32} />
                          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Awaiting Grand Tournaments...</p>
                       </div>
                     )}
                  </div>
               </div>

               {/* Tactical Intel Map */}
               <div className="bg-primary/5 rounded-[2.5rem] border border-primary/10 p-8 space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                     <ShieldCheck size={18} />
                     <span className="text-[11px] font-black uppercase tracking-[0.3em]">Command Recon</span>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed font-black uppercase tracking-widest">
                     The following matchdays represent high-velocity deployment zones. Predict outcome with precision to dominate the {data.name} leaderboard.
                  </p>
               </div>
            </div>

            {/* Main Sector: Matches & Rankings */}
            <div className="lg:col-span-8">
               <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
                  <div className="flex bg-[#060D1A] p-1.5 rounded-2xl border border-white/5 shadow-inner">
                     <button 
                       onClick={() => setActiveTab('matches')}
                       className={`flex items-center gap-3 px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'matches' ? 'bg-primary text-midnight shadow-[0_0_15px_rgba(0,230,118,0.3)]' : 'text-white/30 hover:text-white'}`}
                     >
                        <Activity size={12} /> Strategic Ops
                     </button>
                     <button 
                       onClick={() => setActiveTab('rankings')}
                       className={`flex items-center gap-3 px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'rankings' ? 'bg-primary text-midnight shadow-[0_0_15px_rgba(0,230,118,0.3)]' : 'text-white/30 hover:text-white'}`}
                     >
                        <ListOrdered size={12} /> Leaderboard
                     </button>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Live Data Stream</span>
                  </div>
               </div>

               <StaggerChildren delay={0.1}>
                  <div className="space-y-10">
                     {activeTab === 'rankings' ? (
                        <FadeInItem>
                           <TournamentRankings contestId={seasonContests[0]?.id} />
                        </FadeInItem>
                     ) : matchdays.length > 0 ? matchdays.map((phase: any) => (
                        <FadeInItem key={phase.id}>
                           <div className="bg-[#060D1A] rounded-[2.5rem] border border-white/10 p-8 md:p-12 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />
                              
                              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative z-10">
                                 <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                                       <Calendar size={12} />
                                       {new Date(phase.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h4 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{phase.name}</h4>
                                 </div>

                                 <div className="flex flex-wrap gap-3">
                                    {Array.from(new Map(phase.contests?.map((c: any) => [c.entryFeeSOL > 0 ? 'PRO' : 'FREE', c])).values()).map((c: any) => (
                                       <button
                                          key={c.id}
                                          onClick={() => router.push(`/contests/${c.slug}`)}
                                          className={`group/btn relative h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all border-2 shadow-xl ${c.entryFeeSOL > 0 ? 'bg-primary text-midnight border-primary shadow-primary/20 hover:bg-white hover:border-white' : 'bg-transparent text-white border-white/10 hover:border-primary/50'}`}
                                       >
                                          {c.entryFeeSOL > 0 ? 'Deploy High Stakes' : 'Join Training'}
                                       </button>
                                    ))}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                 {phase.matches?.map((m: any) => (
                                    <div key={m.id} className="relative overflow-hidden group/match bg-[#060D1A] border border-white/5 rounded-[2rem] p-6 md:p-8 transition-all hover:border-wc-pink/50 hover:shadow-[0_20px_50px_-15px_rgba(211,21,138,0.2)]">
                                       {/* Dynamic WC2026 Background Glow */}
                                       <div className="absolute -top-24 -right-24 w-64 h-64 bg-wc-blue/10 blur-[80px] rounded-full pointer-events-none" />
                                       <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-wc-pink/10 blur-[80px] rounded-full pointer-events-none" />
                                       
                                       <div className="relative z-10">
                                          {/* Match Header: Date & Status */}
                                          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                                             <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Operational Window</span>
                                                <span className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">
                                                   {new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(m.kickoff))}
                                                </span>
                                             </div>
                                             <div className="text-right">
                                                <div className="flex items-center gap-2 mb-1 justify-end">
                                                   <div className="w-2 h-2 rounded-full bg-wc-green animate-pulse shadow-[0_0_10px_#00E676]" />
                                                   <span className="text-[10px] font-black text-wc-green uppercase tracking-widest">Oracle Live</span>
                                                </div>
                                                <span className="text-lg md:text-xl font-mono text-white/60 tabular-nums">
                                                   {m.kickoff ? new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(m.kickoff)) : 'TBD'}
                                                </span>
                                             </div>
                                          </div>

                                          {/* Match Body: Teams */}
                                          <div className="flex items-center justify-between gap-4">
                                             <div className="flex flex-col items-center gap-4 w-[42%] text-center">
                                                <div className="relative group/badge">
                                                   <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                                                   <TeamBadge name={m.homeTeam.name} code={m.homeTeam.code} size="md" sport={data.sport?.slug} hideName />
                                                </div>
                                                <div className="space-y-1">
                                                   <span className="block text-lg md:text-xl font-black text-white uppercase italic tracking-tighter truncate w-full">{m.homeTeam.name}</span>
                                                   <span className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{m.homeTeam.code}</span>
                                                </div>
                                             </div>

                                             <div className="flex flex-col items-center justify-center w-[16%]">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                                                   <span className="text-[10px] font-black text-primary italic">VS</span>
                                                </div>
                                                <div className="h-12 w-px bg-gradient-to-b from-white/10 to-transparent" />
                                             </div>

                                             <div className="flex flex-col items-center gap-4 w-[42%] text-center">
                                                <div className="relative group/badge">
                                                   <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                                                   <TeamBadge name={m.awayTeam.name} code={m.awayTeam.code} size="md" sport={data.sport?.slug} hideName />
                                                </div>
                                                <div className="space-y-1">
                                                   <span className="block text-lg md:text-xl font-black text-white uppercase italic tracking-tighter truncate w-full">{m.awayTeam.name}</span>
                                                   <span className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{m.awayTeam.code}</span>
                                                </div>
                                             </div>
                                          </div>

                                          {/* Match Footer: Action */}
                                          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                             <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-wc-blue/10 border border-wc-blue/20 flex items-center justify-center text-wc-blue">
                                                   <Target size={14} />
                                                </div>
                                                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Sector: Intel Squad</span>
                                             </div>
                                             <button className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest">
                                                Predict Match <ChevronRight size={14} />
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              {phase.matches?.length === 0 && (
                                 <div className="py-16 text-center relative z-10 border-2 border-dashed border-white/5 rounded-3xl mt-8">
                                    <Target className="mx-auto text-white/5 mb-4" size={40} />
                                    <h5 className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">Sector Empty</h5>
                                 </div>
                              )}
                           </div>
                        </FadeInItem>
                     )) : (
                        <FadeInItem>
                           <div className="bg-[#060D1A] rounded-[3rem] p-32 text-center border-2 border-dashed border-white/5">
                              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl">
                                 <Sparkles className="text-white/10 animate-pulse" size={40} />
                              </div>
                              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 opacity-40">Scan Complete: No Matches Found</h3>
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-12">System is waiting for next season initialization...</p>
                              
                              {user?.isAdmin && (
                                 <button className="inline-flex items-center gap-4 px-10 h-16 bg-primary text-midnight rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20">
                                    <PlusCircle size={18} /> Initialise Sector Alpha
                                 </button>
                              )}
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
