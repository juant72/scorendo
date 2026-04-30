import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { challengeId, opponentWallet, matchId, contestId, prediction, wallet, action } = body;
    
    if (action === 'accept') {
      const challenge = await prisma.prediction1v1.findUnique({ where: { id: challengeId } });
      if (!challenge) {
        return NextResponse.json({ success: false, error: 'Challenge not found' }, { status: 404 });
      }
      if (challenge.opponentWallet !== opponentWallet) {
        return NextResponse.json({ success: false, error: 'Not your challenge' }, { status: 403 });
      }
      const updated = await prisma.prediction1v1.update({
        where: { id: challengeId },
        data: { status: 'ACCEPTED' }
      });
      return NextResponse.json({ success: true, challenge: updated });
    }

    const challengerWallet = wallet || undefined;

    if (!challengerWallet || !opponentWallet || !matchId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const challenge = await prisma.prediction1v1.create({
      data: {
        challengerWallet,
        opponentWallet,
        matchId,
        contestId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, challengeId: challenge.id });
  } catch (err) {
    console.error('1v1 route error', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    const matchId = searchParams.get('matchId');

    const where: any = {
      OR: [
        { challengerWallet: wallet },
        { opponentWallet: wallet }
      ]
    };
    if (matchId) where.matchId = matchId;

    const challenges = await prisma.prediction1v1.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, challenges });
  } catch (err) {
    console.error('1v1 GET error', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}