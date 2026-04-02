import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

/**
 * POST /api/contests/join-private
 * Validates an invite code and joins the user to a private league.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteCode } = await req.json();

    if (!inviteCode) {
      return NextResponse.json({ success: false, error: 'Invite code required' }, { status: 400 });
    }

    // 1. Find Contest by Invite Code
    const contest = await prisma.contest.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!contest) {
      return NextResponse.json({ success: false, error: 'INVALID_CODE: League not found.' }, { status: 404 });
    }

    // 2. Check if already joined
    const existing = await prisma.userContestEntry.findUnique({
      where: { userWallet_contestId: { userWallet: session.wallet, contestId: contest.id } }
    });

    if (existing) {
      return NextResponse.json({ success: true, message: 'ALREADY_JOINED', contestSlug: contest.slug });
    }

    // 3. Join League (Free Entry)
    await prisma.userContestEntry.create({
      data: {
        userWallet: session.wallet,
        contestId: contest.id,
        entryPaid: true,
        isFreeEntry: true,
        entryPaidAt: new Date()
      }
    });

    return NextResponse.json({ success: true, contestSlug: contest.slug });

  } catch (error) {
    console.error('Join Private League Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET Support: Redirects for easy "Magic Link" joins
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/contests', req.url));
  
  // Handled by client-side or we can auto-join and redirect
  return NextResponse.redirect(new URL(`/contests?join=${code}`, req.url));
}
