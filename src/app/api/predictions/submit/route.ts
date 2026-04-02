import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { PredictionOutcome } from '@prisma/client';
import { Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { contestId, predictions } = await req.json();

    if (!contestId || !predictions || !Array.isArray(predictions)) {
      return NextResponse.json({ success: false, error: 'Bad Request' }, { status: 400 });
    }

    const userWallet = session.wallet as string;

    const contest = await prisma.contest.findUnique({ 
      where: { id: contestId },
      include: {
        tournament: { include: { phases: { include: { matches: true } } } },
        phase: { include: { matches: true } }
      }
    });
    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    // 2. TIMELOCK CHECK: Multi-level safety
    // We prevent submission if the earliest match in the contest starts in < 10 mins.
    const allMatches = contest.phase?.matches || contest.tournament?.phases.flatMap(p => p.matches) || [];
    const validMatchesForThisContest = allMatches.filter(m => {
       // Filtering logic depends on contest type if needed, but for now we look at all matches in scope
       return true; 
    });

    if (validMatchesForThisContest.length > 0) {
      const earliestKickoff = Math.min(...validMatchesForThisContest.map(m => m.kickoff.getTime()));
      const now = Date.now();
      const BUFFER_MS = 10 * 60 * 1000; // 10 minutes

      if (now > (earliestKickoff - BUFFER_MS)) {
        return NextResponse.json({ 
          success: false, 
          error: 'LOCKED: Submission window closed 10 mins before kickoff.' 
        }, { status: 403 });
      }
    }

    // 3. We use a Prisma transaction to ensure all predictions are saved atomically
    const savedPredictions = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if user already has an entry
      let userEntry = await tx.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId } }
      });

      // If it's a PAID contest, they must have a pre-existing paid entry (Payment flow happens separately)
      // DEV-MODE: Allow Admins to bypass payment check
      if (contest.entryFeeSOL > 0 && !session.isAdmin) {
        if (!userEntry || !userEntry.entryPaid) {
          throw new Error('PAYMENT_REQUIRED');
        }
      }

      // If it's a FREE contest, and they don't have an entry, create a Free Entry seamlessly
      if (!userEntry) {
        userEntry = await tx.userContestEntry.create({
          data: { 
            userWallet, 
            contestId, 
            entryPaid: true, 
            isFreeEntry: true,
            entryPaidAt: new Date(),
          }
        });
      }

      // 3. Upsert predictions
      const ops = predictions.map(p => {
        return tx.prediction.upsert({
          where: { userWallet_matchId_contestId: { userWallet, matchId: p.matchId, contestId } },
          update: {
            predictedHome: p.predictedHome,
            predictedAway: p.predictedAway,
            predictedWinner: p.predictedWinner as PredictionOutcome,
          },
          create: {
            userWallet,
            contestId,
            matchId: p.matchId,
            predictedHome: p.predictedHome,
            predictedAway: p.predictedAway,
            predictedWinner: p.predictedWinner as PredictionOutcome,
          }
        });
      });

      return Promise.all(ops);
    });

    // Also update Contest entry counts if it's their first time
    const count = await prisma.userContestEntry.count({ where: { contestId } });
    await prisma.contest.update({
      where: { id: contestId },
      data: { currentEntries: count }
    });

    return NextResponse.json({ success: true, count: savedPredictions.length });

  } catch (error) {
    console.error('Prediction Submission Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
