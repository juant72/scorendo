import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('scorendo_session')?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session?.wallet) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userWallet = session.wallet as string;

    const groups = await prisma.socialGroup.findMany({
      where: {
        members: {
          some: {
            userWallet: userWallet
          }
        }
      },
      orderBy: [{ createdAt: 'desc' }],
      include: {
        members: { select: { userWallet: true } },
        invites: { select: { code: true, expiresAt: true } }
      }
    });
    return NextResponse.json({ success: true, groups });
  } catch (e) {
    console.error('List groups error:', e);
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}
