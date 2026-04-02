import { NextRequest, NextResponse } from 'next/server';
import { verifySignature, createSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

/**
 * Validates the user's signature, generates a session token (JWT),
 * stores it inside an HTTP-only cookie, and upserts the user in the database.
 */
export async function POST(req: NextRequest) {
  try {
    const { message, signature, publicKey, profile } = await req.json();

    if (!message || !signature || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 1. Cryptographically verify the signature
    const isValid = verifySignature(message, signature, publicKey);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature. Authentication failed.' },
        { status: 401 }
      );
    }

    const walletMap = publicKey.toString();

    // 2. Upsert user in database
    const user = await prisma.user.upsert({
      where: { walletAddress: walletMap },
      update: {
        email: profile?.email || undefined,
        displayName: profile?.name || undefined,
        avatarUrl: profile?.avatar || undefined,
      },
      create: {
        walletAddress: walletMap,
        email: profile?.email || null,
        displayName: profile?.name || null,
        avatarUrl: profile?.avatar || null,
      },
    });

    // 3. Generate JWT Token
    const token = await createSessionToken(user.walletAddress);

    // 4. Set HttpOnly Cookie for Session
    // Next.js 15 requires awaiting the cookies function
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'scorendo_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        displayName: user.displayName,
        totalPoints: user.totalPoints,
      },
    });

  } catch (error) {
    console.error('API /auth/verify error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
