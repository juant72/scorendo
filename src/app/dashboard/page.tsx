import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EliteUser } from '@/lib/types';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

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
        where: {
          contest: {
            OR: [
              { tournament: { slug: 'fifa-world-cup-2026' } },
              { phase: { tournament: { slug: 'fifa-world-cup-2026' } } }
            ]
          }
        },
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
        where: {
          contest: {
            OR: [
              { tournament: { slug: 'fifa-world-cup-2026' } },
              { phase: { tournament: { slug: 'fifa-world-cup-2026' } } }
            ]
          }
        },
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
    <DashboardContent
      user={user}
      shortAddress={shortAddress}
      displayName={displayName}
      timeLeftHrs={timeLeftHrs}
      nextMatch={nextMatch}
    />
  );
}
