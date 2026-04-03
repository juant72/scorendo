import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    const { displayName, email } = await req.json();
    const userWallet = session.wallet as string;

    // Validate nickname length
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
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
