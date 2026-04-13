import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API to list contests ready for settlement.
 * Matches belong to Phases, not directly to Contests.
 * A Contest links to matches through its phase or tournament.phases.
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
        },
        phase: {
          include: {
            matches: { select: { status: true } }
          }
        },
        tournament: {
          include: {
            phases: {
              include: {
                matches: { select: { status: true } }
              }
            }
          }
        }
      }
    });

    const settleableContests = contests.map((c) => {
      // Collect all matches from the contest's phase or tournament phases
      let allMatches: { status: string }[] = [];
      if (c.phase?.matches) {
        allMatches = c.phase.matches;
      } else if (c.tournament?.phases) {
        allMatches = c.tournament.phases.flatMap(p => p.matches);
      }

      const totalMatches = allMatches.length;
      const finishedMatches = allMatches.filter(m => m.status === 'FINISHED').length;

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
    });

    return NextResponse.json({ success: true, contests: settleableContests });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
