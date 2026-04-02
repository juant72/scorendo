import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Trophy, Medal, Crown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Global Rankings',
  description: 'Scorendo Global Leaderboard. See who the best predictors are.',
};

export const revalidate = 60; // 60 sec cache

export default async function RankingPage() {
  const users = await prisma.user.findMany({
    orderBy: {
      totalPoints: 'desc'
    },
    take: 100,
    select: {
      walletAddress: true,
      displayName: true,
      totalPoints: true,
      totalCorrect: true,
      accuracy: true
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          Global <span className="text-gradient-gold">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          The top predictors worldwide. Rank up by nailing exact scores and correct winners.
        </p>
      </div>

      {/* Top 3 Podium (Optional advanced UI later) */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 mb-16 h-48 px-2">
        {users[1] && <Podium user={users[1]} rank={2} height="h-28" color="bg-zinc-300" />}
        {users[0] && <Podium user={users[0]} rank={1} height="h-36" color="bg-gold" />}
        {users[2] && <Podium user={users[2]} rank={3} height="h-24" color="bg-amber-700" />}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden border border-border/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Rank</th>
                <th className="px-6 py-4 font-bold tracking-wider">Predictor</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Points</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right hidden sm:table-cell">Correct</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right hidden md:table-cell">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, index) => {
                const isTop3 = index < 3;
                const shortAddress = `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`;
                const displayName = user.displayName || shortAddress;

                return (
                  <tr key={user.walletAddress} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 && <Crown className="h-5 w-5 text-gold mr-2" />}
                        {index === 1 && <Medal className="h-5 w-5 text-zinc-300 mr-2" />}
                        {index === 2 && <Medal className="h-5 w-5 text-amber-700 mr-2" />}
                        <span className={`font-bold ${isTop3 ? 'text-lg' : 'text-muted-foreground'}`}>
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {displayName}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {user.walletAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-lg font-black ${isTop3 ? 'text-gradient-gold' : 'text-foreground'}`}>
                        {user.totalPoints}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground hidden sm:table-cell">
                      {user.totalCorrect}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-muted-foreground hidden md:table-cell">
                      {user.accuracy.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No ranks available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Podium
function Podium({ user, rank, height, color }: { user: any, rank: number, height: string, color: string }) {
  const shortAddress = `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-4)}`;
  const displayName = user.displayName || shortAddress;

  return (
    <div className="flex flex-col items-center justify-end w-24 sm:w-32">
      <div className="mb-3 text-center">
        <div className="font-bold text-sm text-foreground truncate w-full px-2" title={displayName}>
          {displayName}
        </div>
        <div className="text-xs font-black text-primary">{user.totalPoints} PTS</div>
      </div>
      <div className={`w-full ${height} ${color} rounded-t-xl bg-gradient-to-t opacity-90 backdrop-blur-md border border-white/20 flex items-start justify-center pt-2 shadow-2xl`}>
        <span className="text-2xl font-black text-white/50">{rank}</span>
      </div>
    </div>
  );
}
