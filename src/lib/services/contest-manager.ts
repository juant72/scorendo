import { prisma } from '../prisma';
import { SCORING } from '../constants';
import { calculateMatchPoints, type PredictionData, type MatchData } from '../scoring';
import { ContestStatus, TransactionType } from '@prisma/client';

/**
 * CONTEST MANAGER SERVICE
 * Engineered for massive scale and financial integrity.
 */
export class ContestManagerService {
  
  /**
   * 1. BULK SCORE CALCULATION
   * Scores all predictions for a contest in optimized batches.
   */
  static async scoreContest(contestId: string) {
    console.log(`[CONTEST_MANAGER] Starting scoring for contest ${contestId}`);
    
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      select: { tournamentId: true, phaseId: true }
    });

    if (!contest) return;

    const finishedMatches = await prisma.match.findMany({
      where: { 
        OR: [
          { phaseId: contest.phaseId || 'none' },
          { phase: { tournamentId: contest.tournamentId || 'none' } }
        ],
        status: 'FINISHED',
        homeScore: { not: null },
        awayScore: { not: null }
      },
      include: { homeTeam: true, awayTeam: true }
    });

    for (const match of finishedMatches) {
      console.log(`[CONTEST_MANAGER] Scoring match: ${match.homeTeam.name} vs ${match.awayTeam.name}`);
      
      const actual: MatchData = {
        homeScore: match.homeScore!,
        awayScore: match.awayScore!,
        overUnderLine: match.overUnderLine ?? undefined,
        handicapLine: match.handicapLine ?? undefined,
        firstScorerId: match.firstScorerId ?? undefined,
        lastScorerId: match.lastScorerId ?? undefined,
        bothTeamsScore: match.bothTeamsScore ?? undefined,
      };

      let skip = 0;
      const batchSize = 5000;
      let hasMore = true;

      while (hasMore) {
        const predictions = await prisma.prediction.findMany({
          where: { matchId: match.id, scored: false },
          take: batchSize,
          skip: skip
        });

        if (predictions.length === 0) {
          hasMore = false;
          break;
        }

        await prisma.$transaction(
          predictions.map(pred => {
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

            const pts = calculateMatchPoints(actual, prediction);

            const market = pred.market;
            let isExact = false;
            let isCorrectWinner = false;

            if (market === 'CORRECT_SCORE' && actual.homeScore === prediction.predictedHome && actual.awayScore === prediction.predictedAway) {
              isExact = true;
            }
            if (market === 'MATCH_RESULT' && prediction.predictedWinner) {
              if (actual.homeScore! > actual.awayScore! && prediction.predictedWinner === 'HOME') isCorrectWinner = true;
              if (actual.homeScore! < actual.awayScore! && prediction.predictedWinner === 'AWAY') isCorrectWinner = true;
              if (actual.homeScore! === actual.awayScore! && prediction.predictedWinner === 'DRAW') isCorrectWinner = true;
            }

            return prisma.prediction.update({
              where: { id: pred.id },
              data: { 
                pointsEarned: pts, 
                scored: true,
                isExactScore: isExact,
                isCorrectWinner: isCorrectWinner
              }
            });
          })
        );

        console.log(`[CONTEST_MANAGER] Processed ${predictions.length} predictions for match ${match.id}`);
        if (predictions.length < batchSize) {
          hasMore = false;
        } else {
          skip += batchSize;
        }
      }
    }

    await prisma.contest.update({
      where: { id: contestId },
      data: { status: 'SCORING' }
    });
  }

  /**
   * 2. MASSIVE RANKING GENERATION
   * Uses atomic point aggregation and ranking logic.
   */
  static async finalizeRankings(contestId: string) {
    console.log(`[CONTEST_MANAGER] Finalizing rankings for contest ${contestId}`);

    // Update finalPoints in UserContestEntry by summing all predictions
    // This is an atomic SQL update for maximum performance
    await prisma.$executeRawUnsafe(`
      UPDATE "UserContestEntry"
      SET "finalPoints" = COALESCE((
        SELECT SUM("pointsEarned") 
        FROM "Prediction" 
        WHERE "Prediction"."userWallet" = "UserContestEntry"."userWallet" 
          AND "Prediction"."contestId" = "UserContestEntry"."contestId"
      ), 0)
      WHERE "contestId" = '${contestId}'
    `);

    // Now calculate Rank based on points and secondary tie-breakers
    // 1. Points DESC, 2. CreatedAt ASC (Predicting earlier is better)
    // Note: SQLite doesn't support UPDATE FROM syntax directly in older versions, 
    // but in modern Postgres/SQLite it works. Standard SQL approach for compatibility:
    await prisma.$executeRawUnsafe(`
      UPDATE "UserContestEntry"
      SET "finalRank" = (
        SELECT COUNT(*) + 1
        FROM "UserContestEntry" e2
        WHERE e2."contestId" = '${contestId}'
          AND (e2."finalPoints" > "UserContestEntry"."finalPoints" 
               OR (e2."finalPoints" = "UserContestEntry"."finalPoints" AND e2."createdAt" < "UserContestEntry"."createdAt"))
      )
      WHERE "contestId" = '${contestId}'
    `);
    
    await prisma.contest.update({
      where: { id: contestId },
      data: { status: 'DISTRIBUTING' }
    });
  }

  /**
   * 3. FINANCIAL LIQUIDATION
   * Calculates prizes based on distribution JSON and platform cuts.
   */
  static async liquidatePrizes(contestId: string) {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
      include: { entries: { orderBy: { finalRank: 'asc' } } }
    });

    if (!contest) return;
    if (contest.currentEntries < contest.minParticipants) {
        console.log(`[CONTEST_MANAGER] Contest ${contestId} did not reach min participants. Refunds needed.`);
        return;
    }

    const entryFee = BigInt(contest.entryFeeLamports);
    const totalPool = BigInt(contest.currentEntries) * entryFee;
    const orgCutPercent = BigInt(Math.floor(contest.orgCutPercent));
    const platformCut = (totalPool * orgCutPercent) / BigInt(100);
    const netPool = totalPool - platformCut;

    // Distribution formula from JSON (e.g., { "1": 0.5, "2": 0.3, "3": 0.2 })
    const dist = contest.distribution as Record<string, number>;

    for (const entry of contest.entries) {
      const rankStr = entry.finalRank?.toString() || "";
      if (dist[rankStr]) {
        const share = Math.floor(dist[rankStr] * 10000); // Basis points
        const prizeAmount = (netPool * BigInt(share)) / BigInt(10000);
        
        await prisma.$transaction([
          // 1. Assign prize to entry
          prisma.userContestEntry.update({
            where: { id: entry.id },
            data: { prizeAmount }
          }),
          // 2. Create Ledger Record (PENDING)
          prisma.transaction.create({
            data: {
              type: TransactionType.PRIZE_PAYOUT,
              userWallet: entry.userWallet,
              contestId: contest.id,
              amount: prizeAmount,
              txSignature: `LIQ_${contest.id}_${entry.userWallet.slice(0, 8)}_${Date.now()}`,
              status: 'PENDING'
            }
          })
        ]);
      }
    }

    await prisma.contest.update({
      where: { id: contestId },
      data: { status: 'FINISHED' }
    });
    
    console.log(`[CONTEST_MANAGER] Contest ${contestId} FINISHED and Liquidated.`);
  }
}
