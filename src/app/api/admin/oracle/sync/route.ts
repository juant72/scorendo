import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { settleMatchScores } from '@/lib/settle';
import { SportsOracle, OracleProvider, bulkSyncFromOracle } from '@/lib/oracle';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { provider = 'MOCK', leagueIds } = await req.json().catch(() => ({}));

    const matchesToSync = await prisma.match.findMany({
      where: {
        status: { in: ['LIVE', 'SCHEDULED'] },
        kickoff: { lte: new Date() }
      },
      include: { homeTeam: true, awayTeam: true }
    });

    const syncResults = [];

    const oracleProvider = provider as OracleProvider;
    const synced = await bulkSyncFromOracle(leagueIds, oracleProvider);

    for (const match of matchesToSync) {
      const matchDurationMs = Date.now() - new Date(match.kickoff).getTime();
      const isFinishedInRealTime = matchDurationMs > (2 * 60 * 60 * 1000);

      if (isFinishedInRealTime) {
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
      syncedCount: syncResults.length + synced,
      provider: oracleProvider,
      results: syncResults 
    });

  } catch (error: any) {
    console.error('Oracle Sync Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
