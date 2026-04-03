import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  try {
    const { matchId } = await params;

    // Fetch all predictions for this match across all contests
    const predictions = await prisma.prediction.findMany({
      where: { matchId },
      select: { predictedWinner: true }
    });

    const total = predictions.length;
    if (total === 0) {
      return NextResponse.json({ 
        success: true, 
        trends: { home: 33, draw: 33, away: 34, total: 0 } 
      });
    }

    const home = predictions.filter(p => p.predictedWinner === 'HOME').length;
    const draw = predictions.filter(p => p.predictedWinner === 'DRAW').length;
    const away = predictions.filter(p => p.predictedWinner === 'AWAY').length;

    return NextResponse.json({
      success: true,
      trends: {
        home: Math.round((home / total) * 100),
        draw: Math.round((draw / total) * 100),
        away: Math.round((away / total) * 100),
        total
      }
    });

  } catch (error: any) {
    console.error('Trend Fetch Failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
