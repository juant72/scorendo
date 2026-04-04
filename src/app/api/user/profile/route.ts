import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// Required OPTIONS for CORS/Next.js router pre-flight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: session.wallet },
      select: {
        walletAddress: true,
        displayName: true,
        email: true,
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user 
    });

  } catch (error: any) {
    console.error('Profile Fetch Failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { displayName, email } = body;
    const userWallet = session.wallet as string;

    if (displayName && (displayName.length < 3 || displayName.length > 20)) {
      return NextResponse.json({ success: false, error: 'Nickname must be between 3 and 20 characters.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { walletAddress: userWallet },
      data: {
        displayName: displayName || undefined,
        email: email || undefined,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        walletAddress: updatedUser.walletAddress,
        displayName: updatedUser.displayName,
        email: updatedUser.email
      }
    });

  } catch (error: any) {
    console.error('Profile Update Failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
