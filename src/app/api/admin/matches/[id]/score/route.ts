import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { ContestManagerService } from '@/lib/services/contest-manager';

/**
 * Grandmaster Oracle Scoring API
 * Finalizes match and triggers high-scale batch scoring for all associated contests.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: matchId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    // 1. Authorization: ENSURE ADMIN ONLY
    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { homeScore, awayScore } = await req.json();

    if (homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ success: false, error: 'Missing Scores' }, { status: 400 });
    }

    // 2. Atomic Match Update
    await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore,
        status: 'FINISHED'
      }
    });

    // 3. Identify all affected Contests (Scale-Ready)
    const affectedPredictions = await prisma.prediction.findMany({
      where: { matchId: matchId },
      distinct: ['contestId'],
      select: { contestId: true }
    });

    const affectedContestIds = affectedPredictions.map(p => p.contestId);

    // 4. Trigger Batch Scoring Engine
    for (const contestId of affectedContestIds) {
      console.log(`[ORACLE] Scaling batch scoring for Contest: ${contestId}`);
      await ContestManagerService.scoreContest(contestId);
    }

    // 5. Admin Log for Audit Trail
    await prisma.adminLog.create({
      data: {
        adminWallet: session.wallet as string,
        action: 'SETTLE_MATCH_V2',
        entityType: 'MATCH',
        entityId: matchId,
        data: { homeScore, awayScore, affectedContests: affectedContestIds.length }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Match ${matchId} stabilized. ${affectedContestIds.length} contests updated in batch.` 
    });

  } catch (error: any) {
    console.error('Oracle Stabilization Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
