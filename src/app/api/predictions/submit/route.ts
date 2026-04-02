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

    // 1. Fetch the Contest to evaluate the entry fee
    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    // 2. We use a Prisma transaction to ensure all predictions are saved atomically
    const savedPredictions = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if user already has an entry
      let userEntry = await tx.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId } }
      });

      // If it's a PAID contest, they must have a pre-existing paid entry (Payment flow happens separately)
      if (contest.entryFeeSOL > 0) {
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
