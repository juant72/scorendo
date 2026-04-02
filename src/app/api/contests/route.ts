import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const competitions = await prisma.competition.findMany({
      include: {
        tournaments: {
          where: {
            status: { in: ['UPCOMING', 'GROUP_STAGE', 'KNOCKOUT'] }
          },
          include: {
            contests: {
              where: {
                status: { in: ['UPCOMING', 'ACTIVE', 'REGISTRATION'] }
              },
              orderBy: { startDate: 'asc' }
            }
          }
        }
      }
    });

    // BigInt serialization fix
    const serializedCompetitions = JSON.parse(JSON.stringify(competitions, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ success: true, competitions: serializedCompetitions });

  } catch (error) {
    console.error('Fetch Contests Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
