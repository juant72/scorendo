import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API to list contests ready for settlement
 */
export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      where: {
        status: { in: ['ACTIVE', 'SCORING'] }
      },
      include: {
        _count: {
          select: { predictions: true }
        }
      }
    });

    const settleableContests = await Promise.all(contests.map(async (c) => {
      // Get match counts
      const totalMatches = await prisma.match.count({ where: { contestId: c.id } });
      const finishedMatches = await prisma.match.count({ 
        where: { 
          contestId: c.id, 
          status: 'FINISHED' 
        } 
      });

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        status: c.status,
        currentEntries: c.currentEntries,
        entryFeeSOL: c.entryFeeSOL,
        prizePoolSOL: Number(c.prizePool) / 1e9 || (c.currentEntries * c.entryFeeSOL),
        matchesFinished: finishedMatches,
        totalMatches: totalMatches,
        canSettle: totalMatches > 0 && totalMatches === finishedMatches
      };
    }));

    return NextResponse.json({ success: true, contests: settleableContests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
