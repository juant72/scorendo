import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Target, Trophy, Flame, Percent, Clock, ChevronRight, Zap, ArrowRight, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import { XPProgressBar } from '@/components/contests/XPProgressBar';
import { TeamBadge } from '@/components/contests/TeamBadge';
import { getArenaImagery } from '@/lib/graphics';
import Link from 'next/link';
import { EliteUser, ElitePrediction } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Locker Room / HQ',
  description: 'Your Scorendo hub and tactical performance stats.',
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('scorendo_session')?.value;

  if (!token) {
    redirect('/');
  }

  const payload = await verifySessionToken(token);
  if (!payload?.wallet) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress: payload.wallet as string },
    include: {
      predictions: {
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          match: {
            include: { homeTeam: true, awayTeam: true }
          },
          contest: true
        }
      },
      contestEntries: {
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { 
          contest: {
            include: {
              phase: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } },
              tournament: { include: { phases: { include: { matches: { include: { homeTeam: true, awayTeam: true } } } } } }
            }
          }
        }
      }
    }
  }) as unknown as EliteUser;

  if (!user) {
    redirect('/');
  }

  const shortAddress = `${user.walletAddress.substring(0, 4)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`;
  const displayName = user.displayName || shortAddress;

  // Predict Next Deadline logic
  const upcomingMatches = user.contestEntries.flatMap((entry: any) => {
    const matches = entry.contest.phase?.matches || (entry.contest.tournament?.phases?.flatMap((p: any) => p.matches) || []);
    return matches.filter((m: any) => new Date(m.kickoff).getTime() > Date.now());
  });

  const nextMatch = upcomingMatches.length > 0 
    ? upcomingMatches.reduce((min: any, m: any) => new Date(m.kickoff).getTime() < new Date(min.kickoff).getTime() ? m : min, upcomingMatches[0])
    : null;

  const timeLeftHrs = nextMatch 
    ? Math.floor((new Date(nextMatch.kickoff).getTime() - Date.now()) / (1000 * 60 * 60))
    : null;

  return (
    <div className="relative min-h-screen bg-[#020814] text-white">
      {/* Tactical Background Layer */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDB2LTQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDIzMCwxMTgsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-40 pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 relative z-10">
        
        {/* ── PLAYER BIO SECTION ── */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20">
           <div className="flex flex-col md:flex-row items-center md:items-start gap-10 flex-1">
              <div className="relative group">
                 <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="h-40 w-40 rounded-[2.5rem] bg-[#060D1A] border-4 border-white/5 shadow-2xl flex items-center justify-center relative z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent" />
                    <span className="text-6xl filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">🎖️</span>
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center border-4 border-[#020814] text-midnight font-black text-xs z-20 shadow-xl">
                    {user.level}
                 </div>
              </div>
              
              <div className="flex-1 text-center md:text-left pt-2">
                 <div className="flex flex-wrap items-center gap-4 mb-4 justify-center md:justify-start">
                    <div className="px-4 h-7 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-2">
                       <ShieldCheck size={12} className="text-primary" />
                       <span className="text-[10px] font-black uppercase text-primary tracking-widest">Tactical Elite</span>
                    </div>
                    <div className="px-4 h-7 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                       <Activity size={12} className="text-white/40" />
                       <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active ID: {shortAddress}</span>
                    </div>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-8 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {displayName}
                 </h1>
                 <div className="max-w-md mx-auto md:mx-0">
                    <XPProgressBar xp={user.xp} level={user.level} />
                 </div>
              </div>
           </div>

           {/* Deployment Status Card */}
           <div className="w-full lg:w-96 bg-[#060D1A] rounded-[2.5rem] border-2 border-white/5 p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3 text-primary">
                    <Clock size={16} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Slot</span>
                 </div>
                 {nextMatch && <span className="text-[10px] font-mono text-white/20">GRID: 4.2.0</span>}
              </div>

              {nextMatch ? (
                 <>
                    <div className="space-y-1 mb-8">
                       <span className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">T-Minus Window</span>
                       <h3 className="text-4xl font-black text-white italic tracking-tighter">{timeLeftHrs} Hours</h3>
                    </div>
                    <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 mb-8">
                       <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                          <Target size={18} />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Objective Arena</span>
                          <span className="text-xs font-black text-white uppercase truncate max-w-[150px]">{nextMatch.homeTeam?.name || 'Sector Alpha'}</span>
                       </div>
                    </div>
                    <Link href="/contests" className="w-full h-14 bg-primary text-midnight rounded-2xl flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-primary/20">
                       Deploy Intelligence <ArrowRight size={16} />
                    </Link>
                 </>
              ) : (
                 <div className="py-10 text-center space-y-4">
                    <Sparkles className="mx-auto text-white/5" size={40} />
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No Active Deployments Found</p>
                    <Link href="/contests" className="text-primary text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Browse Available Sectors</Link>
                 </div>
              )}
           </div>
        </div>

        {/* ── PERFORMANCE MONITOR HUD ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
           {/* Stat: XP/Trophies */}
           <div className="bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-gold/10" />
              <div className="flex items-center gap-3 text-white/30 mb-6">
                 <Trophy size={14} className="text-gold" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Total Intel</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-5xl font-black text-white italic tracking-tighter leading-none mb-1">{user.totalPoints}</span>
                 <span className="text-[10px] font-black text-gold/40 uppercase tracking-widest">Legacy Points</span>
              </div>
           </div>

           {/* Stat: Perfect Hits */}
           <div className="bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-primary/10" />
              <div className="flex items-center gap-3 text-white/30 mb-6">
                 <Target size={14} className="text-primary" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Tactical Hits</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-5xl font-black text-white italic tracking-tighter leading-none mb-1">{user.totalExact}</span>
                 <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Exact Precisions</span>
              </div>
           </div>

           {/* Stat: Streak */}
           <div className="bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-orange-500/10" />
              <div className="flex items-center gap-3 text-white/30 mb-6">
                 <Flame size={14} className="text-orange-500" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Momentum</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-5xl font-black text-white italic tracking-tighter leading-none mb-1">{user.bestStreak}</span>
                 <span className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest">Max Combo</span>
              </div>
           </div>

           {/* Stat: Accuracy */}
           <div className="bg-[#060D1A] p-8 rounded-[2rem] border-2 border-primary/20 relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="flex items-center gap-3 text-primary mb-6">
                 <Percent size={14} className="animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Precision Rating</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-5xl font-black text-primary italic tracking-tighter leading-none mb-1">{user.accuracy.toFixed(1)}%</span>
                 <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Global Strike Rate</span>
              </div>
           </div>
        </div>

        {/* ── BATTLE RECORD & MISSIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Main Activity Column */}
           <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-4">
                    Combat Logs
                 </h2>
                 <Link href="/contests" className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
                    View Complete Log <ArrowRight size={12} />
                 </Link>
              </div>

              <div className="space-y-4">
                 {user.predictions.length === 0 ? (
                    <div className="bg-[#060D1A] rounded-[3rem] p-24 text-center border-2 border-dashed border-white/5">
                       <Activity className="mx-auto text-white/5 mb-6" size={48} />
                       <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter opacity-40">No Signal Detected</h3>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mt-4">Commence operations in any active sector.</p>
                    </div>
                 ) : (
                    (user as any).predictions.map((pred: ElitePrediction) => (
                       <div key={pred.id} className="bg-[#060D1A] rounded-3xl p-6 border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                          <div className="flex items-center gap-10">
                             <div className="flex items-center gap-4">
                                <TeamBadge name={(pred as any).match.homeTeam.name} code={(pred as any).match.homeTeam.code} size="sm" sport="football" />
                                <span className="text-[10px] font-black text-white/20 italic">VS</span>
                                <TeamBadge name={(pred as any).match.awayTeam.name} code={(pred as any).match.awayTeam.code} size="sm" sport="football" />
                             </div>
                             <div className="h-10 w-px bg-white/5 hidden md:block" />
                             <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{(pred as any).contest.name}</h4>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Sector: Intel Squad</span>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-10">
                             <div className="text-center">
                                <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Estimated</span>
                                <span className="text-2xl font-black text-white italic tracking-tighter">{pred.predictedHome ?? '-'} : {pred.predictedAway ?? '-'}</span>
                             </div>
                             <div className="min-w-[80px] text-right">
                                {pred.scored ? (
                                   <div className={`inline-flex items-center gap-2 px-4 h-8 rounded-xl font-black text-[9px] uppercase tracking-widest ${pred.pointsEarned > 0 ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                      {pred.pointsEarned > 0 ? `+${pred.pointsEarned} PTS` : 'LOSS'}
                                   </div>
                                ) : (
                                   <div className="flex items-center gap-2 text-white/20">
                                      <Clock size={12} />
                                      <span className="text-[9px] font-black uppercase tracking-widest">Pending</span>
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

           {/* Sidebar: Active Competitions Hub */}
           <div className="lg:col-span-4 space-y-12">
              <div>
                 <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10 pb-6 border-b border-white/5">
                    Operational Sectors
                 </h2>
                 <div className="space-y-4">
                    {user.contestEntries.length === 0 ? (
                       <div className="bg-[#060D1A]/50 p-10 rounded-[2rem] border-2 border-dashed border-white/5 text-center">
                          <Trophy size={32} className="text-white/5 mx-auto mb-4" />
                          <p className="text-[10px] color-white/20 font-black uppercase tracking-widest">No Competitions Initialized</p>
                       </div>
                    ) : (
                       user.contestEntries.map((entry: any) => {
                          const imagery = getArenaImagery({ name: entry.contest.name, slug: entry.contest.slug });
                          return (
                             <div key={entry.id} className="relative rounded-3xl overflow-hidden group border border-white/5 hover:border-primary/40 transition-all h-32 flex flex-col justify-end p-6">
                                <img src={imagery.banner} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/60 to-transparent" />
                                <div className="relative z-10 flex items-center justify-between">
                                   <div>
                                      <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none mb-1">{entry.contest.name}</h3>
                                      <span className="text-[9px] font-black text-primary uppercase tracking-widest">{entry.contest.status} Protocol</span>
                                   </div>
                                   <div className="flex flex-col items-end">
                                      <span className="text-xl font-black text-white italic tabular-nums">{entry.finalPoints}</span>
                                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">PTS Rank</span>
                                   </div>
                                </div>
                             </div>
                          );
                       })
                    )}
                 </div>
              </div>

              {/* Recruitment / Path to Pro */}
              <div className="bg-primary/5 rounded-[2.5rem] border-2 border-primary/20 p-8 space-y-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                    <Zap size={40} className="text-primary" />
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Path to <span className="text-primary">Mastery</span></h3>
                 <p className="text-[11px] text-white/40 leading-relaxed font-black uppercase tracking-widest">
                    Maintain a strike rate above 60% across 10 deploying arenas to unlock the **Diamond Tier Gateway**. Exclusive pools and higher liquidity await the elite.
                 </p>
                 <button className="w-full h-12 bg-primary/10 hover:bg-primary text-primary hover:text-midnight border border-primary/20 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                    View Milestones
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
