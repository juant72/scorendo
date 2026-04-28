import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? await verifySessionToken(token) : null;
    
    if (!session?.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }
    
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
