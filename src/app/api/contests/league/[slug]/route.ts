import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const competition = await prisma.competition.findUnique({
      where: { slug },
      include: {
        tournaments: {
          include: {
            phases: {
              include: {
                contests: {
                  where: { isPrivate: false }, // Only pro matches here
                  include: { _count: { select: { entries: true } } }
                },
                matches: {
                   include: { homeTeam: true, awayTeam: true },
                   orderBy: { kickoff: 'asc' },
                   take: 10
                }
              },
              orderBy: { order: 'asc' }
            },
            contests: {
               // Contests tied directly to the Tournament (Season long)
               where: { phaseId: null, isPrivate: false },
               include: { _count: { select: { entries: true } } }
            }
          },
          orderBy: { startDate: 'desc' },
          take: 1
        }
      }
    });

    if (!competition) {
      return NextResponse.json({ success: false, error: 'Competition not found' }, { status: 404 });
    }

    // SANITIZE BigInt for JSON serialization
    const sanitized = JSON.parse(JSON.stringify(competition, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ success: true, competition: sanitized });

  } catch (error) {
    console.error('League API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
