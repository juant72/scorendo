import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { settleMatchScores } from '@/lib/settle';

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
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin Only' }, { status: 403 });
    }

    const { homeScore, awayScore } = await req.json();

    if (homeScore === undefined || awayScore === undefined) {
      return NextResponse.json({ success: false, error: 'Missing Scores' }, { status: 400 });
    }

    // 2. Settlement: RUN ATOMIC ENGINE
    const result = await settleMatchScores(matchId, homeScore, awayScore);

    // 3. Admin Logging
    await prisma.adminLog.create({
      data: {
        adminWallet: session.wallet as string,
        action: 'SETTLE_MATCH',
        entityType: 'MATCH',
        entityId: matchId,
        data: { homeScore, awayScore, totalScored: result.totalScored }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Match ${matchId} settled. ${result.totalScored} predictions processed.` 
    });

  } catch (error: any) {
    console.error('Admin Settlement Failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
