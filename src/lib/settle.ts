import { prisma } from './prisma';
import { calculateMatchPoints, type PredictionData, type MatchData } from './scoring';

export async function settleMatchScores(
  matchId: string, 
  actualHome: number, 
  actualAway: number,
  options?: {
    overUnderLine?: number;
    handicapLine?: number;
    firstScorerId?: string;
    lastScorerId?: string;
    bothTeamsScore?: boolean;
  }
) {
  return await prisma.$transaction(async (tx) => {
    const actual: MatchData = {
      homeScore: actualHome,
      awayScore: actualAway,
      overUnderLine: options?.overUnderLine,
      handicapLine: options?.handicapLine,
      firstScorerId: options?.firstScorerId,
      lastScorerId: options?.lastScorerId,
      bothTeamsScore: options?.bothTeamsScore,
    };

    const predictions = await tx.prediction.findMany({
      where: { matchId },
      include: { user: true }
    });

    for (const pred of predictions) {
      if (pred.predictedHome === null && pred.market === 'MATCH_RESULT') continue;

      const prediction: PredictionData = {
        market: pred.market as any,
        predictedWinner: pred.predictedWinner as any,
        predictedHome: pred.predictedHome ?? undefined,
        predictedAway: pred.predictedAway ?? undefined,
        overUnderPick: pred.overUnderPick ?? undefined,
        handicapPick: pred.handicapPick ?? undefined,
        firstScorerId: pred.firstScorerId ?? undefined,
        lastScorerId: pred.lastScorerId ?? undefined,
      };

      const points = calculateMatchPoints(actual, prediction);
      const isExact = pred.market === 'CORRECT_SCORE' && actualHome === pred.predictedHome && actualAway === pred.predictedAway;
      const isCorrectWinner = pred.market === 'MATCH_RESULT' && (
        (actualHome > actualAway && pred.predictedWinner === 'HOME') ||
        (actualHome < actualAway && pred.predictedWinner === 'AWAY') ||
        (actualHome === actualAway && pred.predictedWinner === 'DRAW')
      );

      await tx.prediction.update({
        where: { id: pred.id },
        data: {
          pointsEarned: points,
          isExactScore: isExact,
          isCorrectWinner: isCorrectWinner,
          scored: true
        }
      });

      await tx.user.update({
        where: { walletAddress: pred.userWallet },
        data: {
          totalPoints: { increment: points },
          totalCorrect: { increment: isCorrectWinner ? 1 : 0 },
          totalExact: { increment: isExact ? 1 : 0 },
          totalPredictions: { increment: 1 }
        }
      });
    }

    await tx.match.update({
      where: { id: matchId },
      data: { 
        status: 'FINISHED',
        homeScore: actualHome,
        awayScore: actualAway,
        overUnderLine: options?.overUnderLine,
        handicapLine: options?.handicapLine,
        firstScorerId: options?.firstScorerId,
        lastScorerId: options?.lastScorerId,
        bothTeamsScore: options?.bothTeamsScore,
      }
    });

    return { totalScored: predictions.length };
  });
}
