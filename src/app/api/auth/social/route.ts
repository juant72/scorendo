import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { accessToken, publicKey, profile } = await req.json();

    if (!accessToken || !publicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 1. Verify Privy JWT Access Token using standard JWKS without requiring a Secret
    const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
    if (!PRIVY_APP_ID) {
      throw new Error("Configuration error: NEXT_PUBLIC_PRIVY_APP_ID is missing");
    }

    const JWKS = jose.createRemoteJWKSet(
      new URL(`https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`)
    );

    try {
      const { payload } = await jose.jwtVerify(accessToken, JWKS);

      if (payload.app_id !== PRIVY_APP_ID) {
        throw new Error(`Invalid App ID claim. Expected ${PRIVY_APP_ID}, got ${payload.app_id}`);
      }
    } catch (e: any) {
      console.error('Privy token verification failed:', e);
      let errorDetail = e.message;
      if (e.code === 'ERR_JWT_EXPIRED') errorDetail = 'Token Expired';
      if (e.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') errorDetail = 'Invalid Signature (JWKS mismatch)';
      
      return NextResponse.json(
        { error: `Verification Failed: ${errorDetail}` },
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

    // 3. Generate Internal JWT Token for Scorendo
    const token = await createSessionToken(user.walletAddress);

    // 4. Set HttpOnly Cookie for Global Application State
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
    console.error('API /auth/social error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
