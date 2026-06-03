import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { EliteUser } from '@/lib/types';
import { RankingsContent } from '@/components/ranking/RankingsContent';

export const metadata: Metadata = {
  title: 'Global Rankings',
  description: 'Scorendo Global Leaderboard. See who the best predictors are.',
};

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('scorendo_session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  const currentUserWallet = session?.wallet as string | undefined;

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
      accuracy: true,
      level: true
    } as any
  }) as unknown as EliteUser[];

  // Final stabilize cast to ensure the loop doesn't fail TS checks
  const rankingList = (users || []) as EliteUser[];

  return (
    <RankingsContent
      users={rankingList}
      currentUserWallet={currentUserWallet}
    />
  );
}
