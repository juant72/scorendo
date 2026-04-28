import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Minimal skeleton for 1v1 prediction challenges between two users.
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    // Expected fields (simplified): challengerWallet, opponentWallet, matchId, contestId, home/away predictions
    const { challengerWallet, opponentWallet, matchId, contestId, predictedHome, predictedAway, market } = body;
    // This is a placeholder implementation. In a full implementation you would create a dedicated 1v1 contest or group,
    // assign participants, and track mutually agreed wagers or points.
    if (!challengerWallet || !opponentWallet || !matchId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Return a not-implemented status to signal planning phase.
    return NextResponse.json({ success: true, message: '1v1 challenge created (skeleton only)', data: { matchId, contestId, challengerWallet, opponentWallet } });
  } catch (err) {
    console.error('1v1 route error', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
