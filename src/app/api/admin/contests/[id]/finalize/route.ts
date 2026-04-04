import { NextResponse } from 'next/server';
import { ContestManagerService } from '@/lib/services/contest-manager';

/**
 * API to Finalize a Contest
 * Sequences: Scoring -> Ranking -> Liquidation
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contestId } = await params;

    // 1. Scoring Phase
    await ContestManagerService.scoreContest(contestId);
    
    // 2. Ranking Phase
    await ContestManagerService.finalizeRankings(contestId);
    
    // 3. Liquidation Phase
    await ContestManagerService.liquidatePrizes(contestId);

    return NextResponse.json({ 
      success: true, 
      message: `Contest ${contestId} finalized and prizes liquidated.` 
    });
  } catch (error: any) {
    console.error('Finalization Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
