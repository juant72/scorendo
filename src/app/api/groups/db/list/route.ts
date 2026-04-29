import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await (prisma as any).group.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: {
        members: { select: { userWallet: true } },
        invites: { select: { code: true, expiresAt: true } }
      }
    });
    return NextResponse.json({ success: true, groups });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'DB error' }, { status: 500 });
  }
}
