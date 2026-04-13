import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Target, Trophy, Flame, Percent, Clock, ChevronRight, Zap } from 'lucide-react';
import { XPProgressBar } from '@/components/contests/XPProgressBar';
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

  // Fetch full user and latest predictions
  const user = await prisma.user.findUnique({
    where: { walletAddress: payload.wallet as string },
    include: {
      predictions: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          match: {
            include: { homeTeam: true, awayTeam: true }
          },
          contest: true
        }
      },
      contestEntries: {
        take: 3,
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

  // 🕒 Calculate Next Deadline
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
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-primary/20 border-4 border-black shadow-[0_0_40px_-10px_rgba(0,230,118,0.5)] flex items-center justify-center">
            {/* Avatar Placeholder */}
            <span className="text-4xl">⚽</span>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
             <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-[9px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">Tactical Elite</div>
             <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Verified Ops</div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-3 text-white uppercase italic tracking-tighter drop-shadow-2xl">{displayName}</h1>
          <p className="text-white/20 font-mono text-xs mb-8 tracking-widest uppercase flex items-center gap-2 justify-center md:justify-start">
             <Zap size={14} className="text-primary" /> Signature: {user.walletAddress}
          </p>
          
          <div className="max-w-md">
            <XPProgressBar xp={user.xp} level={user.level} />
          </div>
        </div>

        {/* Next Deadline Card */}
        {nextMatch && (
           <div className="w-full md:w-auto glass-premium-thick border border-primary/20 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_50px_-20px_rgba(0,230,118,0.3)]">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                 <Clock size={32} strokeWidth={2.5} />
              </div>
               <div className="text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Deployment Window</span>
                  <h3 className="text-xl font-bold text-white mb-1 leading-none uppercase italic">T-Minus {timeLeftHrs} Hours</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">Arena: {nextMatch.homeTeam?.name || 'Upcoming Match'}</p>
               </div>
              <Link 
                href={`/contests/lpf-2026-season-rookie`} 
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors ml-auto"
              >
                 <ChevronRight size={20} />
              </Link>
           </div>
        )}
      </div>

      {/* ═ TACTICAL HUD STATS ═ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 relative">
        <div className="absolute -inset-4 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="relative overflow-hidden group bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 hover:border-gold/30 transition-all">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgNDBoNDB2LTQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20" />
          <span className="relative z-10 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
             <Trophy size={12} className="text-gold" /> Global Intel
          </span>
          <div className="relative z-10 flex flex-col">
             <span className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">{user.totalPoints}</span>
             <span className="text-[10px] font-black text-gold/40 uppercase tracking-widest mt-1">Acquired XP</span>
          </div>
        </div>
        
        <div className="relative overflow-hidden group bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 hover:border-primary/30 transition-all">
          <span className="relative z-10 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
             <Target size={12} className="text-primary" /> Strike Rate
          </span>
          <div className="relative z-10 flex flex-col">
             <span className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(0,230,118,0.3)]">{user.totalExact}</span>
             <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1">Perfect Hits</span>
          </div>
        </div>

        <div className="relative overflow-hidden group bg-[#060D1A] p-8 rounded-[2rem] border-2 border-white/5 hover:border-orange-500/30 transition-all">
          <span className="relative z-10 text-white/40 text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
             <Flame size={12} className="text-orange-500" /> Momentum
          </span>
          <div className="relative z-10 flex flex-col">
             <span className="text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,100,0,0.3)]">{user.bestStreak}</span>
             <span className="text-[10px] font-black text-orange-500/40 uppercase tracking-widest mt-1">Match Streak</span>
          </div>
        </div>

        <div className="relative overflow-hidden group bg-[#060D1A] p-8 rounded-[2rem] border-2 border-primary/20 shadow-[0_0_40px_-10px_rgba(0,230,118,0.1)] transition-all">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <span className="relative z-10 text-primary text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4 animate-pulse">
             <Percent size={12} /> Efficiency
          </span>
          <div className="relative z-10 flex flex-col">
             <span className="text-5xl font-black text-primary italic tracking-tighter drop-shadow-[0_0_15px_rgba(0,230,118,0.4)]">{user.accuracy.toFixed(1)}%</span>
             <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1">Tactical Precision</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Battle Record */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-white/60">
             <Trophy className="h-6 w-6 text-gold drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]"/> Battle Record
          </h2>
          
          <div className="space-y-4">
            {user.predictions.length === 0 ? (
              <div className="glass-premium-thick p-12 text-center rounded-3xl border border-white/5 flex flex-col items-center gap-4">
                <div className="p-4 rounded-2xl bg-white/5 text-muted-foreground/20">
                   <Target size={40} />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold text-white/40 uppercase tracking-widest">No Predictions Active</p>
                   <p className="text-xs text-muted-foreground">The arena is waiting. Join a contest to start your legacy.</p>
                </div>
                 <Link href="/contests" className="mt-4 h-12 px-10 rounded-xl bg-primary text-midnight text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl shadow-primary/20">
                    Find Active Arena
                 </Link>
              </div>
            ) : (
              (user as any).predictions.map((pred: ElitePrediction) => (
                <div key={pred.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-foreground mb-1">
                      {(pred as any).match.homeTeam.code} vs {(pred as any).match.awayTeam.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Contest: {(pred as any).contest.name}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-black tabular-nums tracking-widest text-white/90">
                       {pred.predictedHome ?? '-'} : {pred.predictedAway ?? '-'}
                    </div>
                    {pred.scored ? (
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm ${pred.pointsEarned > 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                        {pred.pointsEarned > 0 ? `+${pred.pointsEarned} PTS` : 'LOSS'}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Pending</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Contests */}
        <div>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase italic text-white/60">
             <Target className="h-6 w-6 text-primary drop-shadow-[0_0_10px_rgba(0,230,118,0.4)]"/> Active Missions
          </h2>
          <div className="space-y-4">
            {user.contestEntries.length === 0 ? (
              <div className="glass p-8 text-center rounded-2xl border border-white/5 flex flex-col items-center gap-3">
                 <Trophy size={24} className="text-muted-foreground/20" />
                 <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">No Stakes Yet</p>
              </div>
            ) : (
              user.contestEntries.map((entry: any) => (
                <div key={entry.id} className="glass p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <div className="text-sm font-bold text-foreground mb-1 line-clamp-1">{entry.contest.name}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{entry.contest.status}</span>
                    <span className="text-gold font-bold">{entry.finalPoints} PTS Rank</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
