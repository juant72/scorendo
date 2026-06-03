import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { ContestDetailsContent } from '@/components/contests/ContestDetailsContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const contest = await prisma.contest.findUnique({ where: { slug } });
  return {
    title: contest ? `${contest.name} | Predict & Win` : 'Contest Not Found',
  };
}

export default async function ContestDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Authenticate Request
  const cookieStore = await cookies();
  const token = cookieStore.get('scorendo_session')?.value;
  const session = token ? await verifySessionToken(token) : null;
  const userWallet = session?.wallet as string | undefined;

  // 2. Fetch Contest details
  const contest = await prisma.contest.findUnique({
    where: { slug },
    include: {
      phase: {
        include: {
          tournament: true,
          matches: {
            include: { homeTeam: true, awayTeam: true },
            orderBy: { kickoff: 'asc' }
          }
        }
      },
      tournament: {
        include: {
          competition: {
             include: { sport: true }
          },
          phases: {
            include: {
              matches: {
                include: { homeTeam: true, awayTeam: true },
                orderBy: { kickoff: 'asc' }
              }
            }
          }
        }
      }
    }
  });

  if (!contest) notFound();

  // Enforce FIFA World Cup 2026 only
  const isWC2026 = contest.tournament?.slug === 'fifa-world-cup-2026' || contest.phase?.tournament?.slug === 'fifa-world-cup-2026';
  if (!isWC2026) {
    notFound();
  }

  // 3. Determine Matches to Predict
  let matches = contest.phase?.matches || [];
  if (matches.length === 0 && contest.tournament) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches = contest.tournament.phases.flatMap((p: any) => p.matches);
  }

  // 4. Fetch User Data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let existingPredictions: any[] = [];
  let userEntry = null;
  let userData = null;

  if (userWallet) {
    [userEntry, userData, existingPredictions] = await Promise.all([
      prisma.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId: contest.id } }
      }),
      prisma.user.findUnique({
        where: { walletAddress: userWallet as string }
      }),
      prisma.prediction.findMany({
        where: { userWallet, contestId: contest.id }
      })
    ]);
  }

  // 5. Timelock Logic
  const earliestKickoff = matches.length > 0 
    ? Math.min(...matches.map(m => new Date(m.kickoff).getTime())) 
    : Infinity;
  
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const BUFFER_MS = 5 * 60 * 1000;
  const isLockedByTime = now > (earliestKickoff - BUFFER_MS);
  const isLockedByStatus = !['UPCOMING', 'REGISTRATION', 'ACTIVE'].includes(contest.status);
  const isLocked = isLockedByTime || isLockedByStatus;

  return (
    <ContestDetailsContent 
      contest={contest}
      userWallet={userWallet}
      existingPredictions={existingPredictions}
      isLocked={isLocked}
      isEntered={!!userEntry}
      userData={userData}
      matches={matches}
    />
  );
}
