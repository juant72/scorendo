import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { language } = await req.json();
    if (!language || !['en', 'es'].includes(language)) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.user.update({
      where: { walletAddress: session.wallet },
      data: { language }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update Language Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
