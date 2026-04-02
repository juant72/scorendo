import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    
    if (!payload?.wallet) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Optionally get up to date DB user info
    const user = await prisma.user.findUnique({
      where: { walletAddress: payload.wallet as string },
      select: {
        walletAddress: true,
        displayName: true,
        avatarSeed: true,
        totalPoints: true,
        isAdmin: true,
      }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });

  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
