import { prisma } from './prisma';
import { calculateMatchPoints } from './scoring';

/**
 * Settles all predictions for a specific match.
 * Compares actual scores with predicted scores and awards points.
 */
export async function settleMatchScores(matchId: string, actualHome: number, actualAway: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch all predictions for this match
    const predictions = await tx.prediction.findMany({
      where: { matchId },
      include: { user: true }
    });

    const actual = { home: actualHome, away: actualAway };

    for (const pred of predictions) {
      if (pred.predictedHome === null || pred.predictedAway === null) continue;

      const prediction = { 
        home: pred.predictedHome, 
        away: pred.predictedAway 
      };

      // 2. Calculate points using our standard engine
      const points = calculateMatchPoints(prediction, actual);
      const isExact = points >= 5; // 5 pts for Exact, 3 for Winner, 1 for Outcome Trend
      const isCorrectWinner = points >= 3;

      // 3. Update Prediction record
      await tx.prediction.update({
        where: { id: pred.id },
        data: {
          pointsEarned: points,
          isExactScore: isExact,
          isCorrectWinner: isCorrectWinner,
          scored: true
        }
      });

      // 4. Update Global User Stats
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

    // 5. Mark Match as Finished
    await tx.match.update({
      where: { id: matchId },
      data: { 
        status: 'FINISHED',
        homeScore: actualHome,
        awayScore: actualAway
      }
    });

    return { totalScored: predictions.length };
  });
}
