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
        phase: { include: { matches: { select: { id: true, kickoff: true } } } },
        tournament: { include: { phases: { include: { matches: { select: { id: true, kickoff: true } } } } } } 
      }
    });
    if (!contest) {
      return NextResponse.json({ success: false, error: 'Contest not found' }, { status: 404 });
    }

    const availableMatches = contest.phase?.matches || (contest.tournament?.phases?.flatMap((p: any) => p.matches) || []);
    const availableMatchIds = new Set(availableMatches.map((m: any) => m.id));

    if (predictions.length > availableMatches.length + 10) {
      return NextResponse.json({ success: false, error: 'PAYLOAD_OVERFLOW' }, { status: 400 });
    }

    for (const p of predictions) {
       if (!availableMatchIds.has(p.matchId)) {
          return NextResponse.json({ success: false, error: `Match ID ${p.matchId} not in contest` }, { status: 403 });
       }
    }

    const earliestMatch = availableMatches.reduce((min: any, m: any) => {
        const time = new Date(m.kickoff).getTime();
        return time < min ? time : min;
    }, Infinity);

    const now = Date.now();
    const BUFFER_MS = 5 * 60 * 1000;

    if (earliestMatch !== Infinity && now > (earliestMatch - BUFFER_MS)) {
      return NextResponse.json({ 
        success: false, 
        error: 'LOCKED: Entry closed before kickoff.' 
      }, { status: 403 });
    }

    const savedPredictions = await prisma.$transaction(async (tx: any) => {
      let userEntry = await tx.userContestEntry.findUnique({
        where: { userWallet_contestId: { userWallet, contestId } }
      });

      if (contest.entryFeeSOL > 0 && !session.isAdmin) {
        if (!userEntry || !userEntry.entryPaid) {
          throw new Error('PAYMENT_REQUIRED');
        }
      }

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

      const results = [];
      for (const p of (predictions as any[])) {
        const market = p.market || 'MATCH_RESULT';
        
        const predData: any = {
          market,
          predictedHome: p.predictedHome,
          predictedAway: p.predictedAway,
          predictedWinner: p.predictedWinner as PredictionOutcome,
        };

        if (market === 'OVER_UNDER') {
          predData.overUnderLine = p.overUnderLine;
          predData.overUnderPick = p.overUnderPick;
        } else if (market === 'HANDICAP') {
          predData.handicapLine = p.handicapLine;
          predData.handicapPick = p.handicapPick;
        } else if (market === 'FIRST_SCORER') {
          predData.firstScorerId = p.firstScorerId;
        } else if (market === 'LAST_SCORER') {
          predData.lastScorerId = p.lastScorerId;
        }

        const res = await tx.prediction.upsert({
          where: { userWallet_matchId_contestId_market: { userWallet, matchId: p.matchId, contestId, market } },
          update: predData,
          create: {
            userWallet,
            contestId,
            matchId: p.matchId,
            ...predData,
          }
        });
        results.push(res);
      }

      return results;
    }, { timeout: 15000 });

    const count = await prisma.userContestEntry.count({ where: { contestId } });
    const xpPerPrediction = 10;
    const totalXpEarned = savedPredictions.length * xpPerPrediction;

    const currentUser = await prisma.user.findUnique({ where: { walletAddress: userWallet } }) as any;
    if (currentUser) {
       const newXp = (currentUser.xp || 0) + totalXpEarned;
       const nextLevelThreshold = currentUser.level * 100;
       
       let newLevel = currentUser.level;
       let finalXp = newXp;
       
       if (newXp >= nextLevelThreshold) {
          newLevel += 1;
          finalXp = newXp - nextLevelThreshold;
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

