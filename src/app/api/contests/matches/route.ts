import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MatchStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const sportSlug = searchParams.get('sport');
    const statusList = (statusParam ? statusParam.split(',') : ['SCHEDULED', 'LIVE']) as MatchStatus[];

    const matches = await prisma.match.findMany({
      where: {
        status: { in: statusList },
        ...(sportSlug ? {
          phase: {
            tournament: {
              competition: {
                sport: {
                  slug: sportSlug
                }
              }
            }
          }
        } : {})
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        phase: {
          include: {
            tournament: {
              include: {
                competition: {
                  include: {
                    sport: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        kickoff: 'asc'
      }
    });


    // BigInt fallback for prisma matches if any
    const serializedMatches = JSON.parse(JSON.stringify(matches, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ 
      success: true, 
      matches: serializedMatches 
    });

  } catch (error: any) {
    console.error('Fetch Matches Failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
