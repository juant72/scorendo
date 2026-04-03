import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  try {
    const entries = await prisma.userContestEntry.findMany({
      where: { contestId: id },
      orderBy: { finalPoints: 'desc' },
      take: 50,
      include: {
        user: {
          select: { displayName: true }
        }
      }
    });

    const rankings = entries.map(e => ({
      walletAddress: e.userWallet,
      displayName: e.user?.displayName || 'Anonymous Hero',
      points: e.finalPoints
    }));

    return NextResponse.json({ success: true, rankings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
