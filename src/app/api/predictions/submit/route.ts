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

    // 1. INTEGRITY CHECK: Ensure every matchId in the payload belongs to the contestId
    const contest = await prisma.contest.findUnique({ 
      where: { id: contestId },
      include: {
        phase: { include: { matches: { select: { id: true, kickoff: true } } } },
        tournament: { include: { phases: { include: { matches: { select: { id: true, kickoff: true } } } } } }
      }
    });
    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    const availableMatches = contest.phase?.matches || (contest.tournament?.phases?.flatMap((p: any) => p.matches) || []);
    const availableMatchIds = new Set(availableMatches.map((m: any) => m.id));

    // Limit payload size to actual contest matches + 10 items padding maximum
    if (predictions.length > availableMatches.length + 10) {
      return NextResponse.json({ success: false, error: 'PAYLOAD_OVERFLOW' }, { status: 400 });
    }

    // Verify each prediction matchId
    for (const p of predictions) {
       if (!availableMatchIds.has(p.matchId)) {
          return NextResponse.json({ success: false, error: `Match ID ${p.matchId} not in contest` }, { status: 403 });
       }
    }

    // 2. TIMELOCK CHECK
    const earliestMatch = availableMatches.reduce((min: any, m: any) => {
        const time = new Date(m.kickoff).getTime();
        return time < min ? time : min;
    }, Infinity);

    const now = Date.now();
    const BUFFER_MS = 5 * 60 * 1000; // 5 minute hard-lock

    if (earliestMatch !== Infinity && now > (earliestMatch - BUFFER_MS)) {
      return NextResponse.json({ 
        success: false, 
        error: 'LOCKED: Entry closed before kickoff.' 
      }, { status: 403 });
    }

    // 3. We use a Prisma transaction to ensure all predictions are saved atomically
    const savedPredictions = await prisma.$transaction(async (tx: any) => {
      // Check if user already has an entry
      let userEntry = await tx.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId } }
      });

      // If it's a PAID contest, they must have a pre-existing paid entry
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

      // 3. Upsert predictions (sequentially to avoid race conditions in Prisma transactions)
      const results = [];
      for (const p of (predictions as any[])) {
        const res = await tx.prediction.upsert({
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
        results.push(res);
      }

      return results;
    }, { timeout: 15000 });

    // 4. Update entry count and Award Submission XP
    const count = await prisma.userContestEntry.count({ where: { contestId } });
    const xpPerPrediction = 10;
    const totalXpEarned = savedPredictions.length * xpPerPrediction;

    // Update User XP and check for Level Up
    const currentUser = await prisma.user.findUnique({ where: { walletAddress: userWallet } }) as any;
    if (currentUser) {
       const newXp = (currentUser.xp || 0) + totalXpEarned;
       const nextLevelThreshold = currentUser.level * 100;
       
       let newLevel = currentUser.level;
       let finalXp = newXp;
       
       if (newXp >= nextLevelThreshold) {
          newLevel += 1;
          finalXp = newXp - nextLevelThreshold; // Reset progress for next level
       }

       await prisma.user.update({
         where: { walletAddress: userWallet },
         data: { xp: finalXp, level: newLevel } as any
       });
    }

    await prisma.contest.update({
      where: { id: contestId },
      data: { currentEntries: count }
    });

    return NextResponse.json({ 
      success: true, 
      count: savedPredictions.length,
      xpEarned: totalXpEarned
    });

  } catch (error: any) {
    console.error('CRITICAL: Prediction Submission Failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: process.env.NODE_ENV === 'development' ? (error.message || String(error)) : 'Internal Server Error' 
    }, { status: 500 });
  }
}

