import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Target, Trophy, Flame, Percent } from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Your Scorendo hub and prediction stats.',
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
        include: { contest: true }
      }
    }
  });

  if (!user) {
    redirect('/');
  }

  const shortAddress = `${user.walletAddress.substring(0, 4)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`;
  const displayName = user.displayName || shortAddress;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
      
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
        <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-primary to-primary/20 border-4 border-black shadow-[0_0_40px_-10px_rgba(0,230,118,0.5)] flex items-center justify-center">
            {/* Avatar Placeholder */}
            <span className="text-4xl">⚽</span>
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl sm:text-5xl font-black mb-2 text-foreground">{displayName}</h1>
          <p className="text-muted-foreground font-mono text-sm">{user.walletAddress}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Trophy className="h-4 w-4" /> Global Points</span>
          <span className="text-4xl font-black text-gradient-gold">{user.totalPoints}</span>
        </div>
        
        <div className="glass p-6 rounded-2xl flex flex-col gap-2">
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Target className="h-4 w-4" /> Exact Scores</span>
          <span className="text-4xl font-black text-white">{user.totalExact}</span>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Flame className="h-4 w-4 text-orange-500" /> Best Streak</span>
          <span className="text-4xl font-black text-orange-400">{user.bestStreak} <span className="text-lg text-muted-foreground">match(es)</span></span>
        </div>

        <div className="glass p-6 rounded-2xl flex flex-col gap-2 border border-primary/20">
          <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Percent className="h-4 w-4 text-primary" /> Accuracy</span>
          <span className="text-4xl font-black text-primary">{user.accuracy.toFixed(1)}%</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Predictions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Trophy className="h-5 w-5 text-gold"/> Recent Predictions</h2>
          
          <div className="space-y-4">
            {user.predictions.length === 0 ? (
              <div className="glass p-8 text-center rounded-2xl text-muted-foreground">
                No predictions made yet. Join a contest and start playing!
              </div>
            ) : (
              user.predictions.map(pred => (
                <div key={pred.id} className="glass p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <div className="text-sm font-bold text-foreground mb-1">
                      {pred.match.homeTeam.code} vs {pred.match.awayTeam.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Contest: <span className="text-primary">{pred.contest.name}</span>
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
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Target className="h-5 w-5 text-primary"/> Active Entries</h2>
          <div className="space-y-4">
            {user.contestEntries.length === 0 ? (
              <div className="glass p-6 text-center rounded-2xl text-muted-foreground/60 text-sm">
                You haven't entered any contests yet.
              </div>
            ) : (
              user.contestEntries.map(entry => (
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
