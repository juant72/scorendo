import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { settleMatchScores } from '@/lib/settle';

/**
 * Admin Oracle Sync:
 * Automatically fetches the latest scores for all LIVE or SCHEDULED matches 
 * and triggers the settlement engine for any finished games.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch matches that are candidates for oracle-sync (Recent or Live)
    const matchesToSync = await prisma.match.findMany({
      where: {
        status: { in: ['LIVE', 'SCHEDULED'] },
        kickoff: { lte: new Date() } // Only matches that have started
      },
      include: { homeTeam: true, awayTeam: true }
    });

    const syncResults = [];

    for (const match of matchesToSync) {
      // 2. SIMULATION OF EXTERNAL ORACLE FETCH
      // In a real scenario, we would call fetch('https://api.sportmonks.com/...')
      // For Alpha, we'll check if there's any 'Mock Actual' data or just simulate a finish
      // to demonstrate the automation.
      
      // Let's assume for this demo that if a match started > 2 hours ago, it's FINISHED.
      const matchDurationMs = Date.now() - new Date(match.kickoff).getTime();
      const isFinishedInRealTime = matchDurationMs > (2 * 60 * 60 * 1000);

      if (isFinishedInRealTime) {
        // Randomize score for automation demo if not set
        const homeScore = Math.floor(Math.random() * 4);
        const awayScore = Math.floor(Math.random() * 3);

        const settlement = await settleMatchScores(match.id, homeScore, awayScore);
        
        syncResults.push({
          matchId: match.id,
          teams: `${match.homeTeam.code} vs ${match.awayTeam.code}`,
          status: 'AUTO_SETTLED',
          score: `${homeScore}-${awayScore}`,
          predictionsProcessed: settlement.totalScored
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      syncedCount: syncResults.length,
      results: syncResults 
    });

  } catch (error: any) {
    console.error('Oracle Sync Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
