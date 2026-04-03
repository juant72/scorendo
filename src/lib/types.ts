import { User, Prediction, Competition, Tournament, Phase, Contest, Match, UserContestEntry, PredictionOutcome } from '@prisma/client';

/**
 * EliteUser: Extends the base Prisma User with newly added fields 
 * that might not yet be in the generated client due to EPERM locks.
 */
export interface EliteUser extends User {
  xp: number;
  level: number;
  predictions: ElitePrediction[];
  contestEntries: any[]; // UserContestEntry with inclusions
}

/**
 * ElitePrediction: Extends prediction with settlement fields.
 */
export interface ElitePrediction extends Prediction {
  pointsEarned: number;
  scored: boolean;
  isExactScore: boolean;
  isCorrectWinner: boolean;
}

/**
 * EliteMatch: Ensures relation access is typed correctly.
 */
export interface EliteMatch extends Match {
  homeTeam: { name: string, code: string };
  awayTeam: { name: string, code: string };
  venue?: { name: string };
  phase?: Phase;
}

export { PredictionOutcome };
