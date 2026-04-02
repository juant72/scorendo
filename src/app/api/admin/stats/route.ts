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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: session.wallet }
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Aggregate Stats
    const [totalUsers, totalPredictions, totalContests, totalSolEntryFees] = await Promise.all([
      prisma.user.count(),
      prisma.prediction.count(),
      prisma.contest.count(),
      prisma.contest.aggregate({ _sum: { entryFeeSOL: true } })
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { walletAddress: true, email: true, createdAt: true, totalPoints: true }
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalPredictions,
        totalContests,
        totalPrizePoolEstimated: Number(totalSolEntryFees._sum.entryFeeSOL || 0),
      },
      recentUsers
    });

  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
