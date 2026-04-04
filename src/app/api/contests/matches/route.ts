import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const statusList = statusParam ? statusParam.split(',') : ['SCHEDULED', 'LIVE'];

    const matches = await prisma.match.findMany({
      where: {
        status: { in: statusList }
      },
      include: {
        homeTeam: true,
        awayTeam: true
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
