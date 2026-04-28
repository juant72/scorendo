import { SCORING, MARKET_CONFIG, type MarketType } from './constants';
import type { PredictionOutcome } from '@prisma/client';

export interface MatchScore {
  home: number;
  away: number;
}

export type PredictionMarket = 
  | 'MATCH_RESULT'
  | 'OVER_UNDER'
  | 'HANDICAP'
  | 'FIRST_SCORER'
  | 'LAST_SCORER'
  | 'CORRECT_SCORE'
  | 'BOTH_TEAMS_SCORE';

export interface PredictionData {
  market: PredictionMarket;
  predictedWinner?: 'HOME' | 'AWAY' | 'DRAW';
  predictedHome?: number;
  predictedAway?: number;
  overUnderPick?: boolean;
  handicapPick?: number;
  firstScorerId?: string;
  lastScorerId?: string;
}

export interface MatchData {
  homeScore?: number;
  awayScore?: number;
  overUnderLine?: number;
  handicapLine?: number;
  firstScorerId?: string;
  lastScorerId?: string;
  bothTeamsScore?: boolean;
}

export function calculateSimplePoints(predicted: { home: number; away: number }, actual: { home: number; away: number }): number {
  const predData: PredictionData = {
    market: 'MATCH_RESULT',
    predictedHome: predicted.home,
    predictedAway: predicted.away,
    predictedWinner: predicted.home > predicted.away ? 'HOME' : predicted.home < predicted.away ? 'AWAY' : 'DRAW',
  };
  
  const matchData: MatchData = {
    homeScore: actual.home,
    awayScore: actual.away,
  };
  
  return calculateMatchPoints(matchData, predData);
}

/**
 * Calculates points for a single match prediction across all markets
 */
export function calculateMatchPoints(
  actual: MatchData,
  predicted: PredictionData
): number {
  const { market } = predicted;
  
  switch (market) {
    case 'MATCH_RESULT':
      return calculateMatchResultPoints(actual, predicted);
    case 'OVER_UNDER':
      return calculateOverUnderPoints(actual, predicted);
    case 'HANDICAP':
      return calculateHandicapPoints(actual, predicted);
    case 'CORRECT_SCORE':
      return calculateCorrectScorePoints(actual, predicted);
    case 'BOTH_TEAMS_SCORE':
      return calculateBTTSPoints(actual, predicted);
    case 'FIRST_SCORER':
    case 'LAST_SCORER':
      return (predicted.firstScorerId === actual.firstScorerId || predicted.lastScorerId === actual.lastScorerId)
        ? SCORING.FIRST_SCORER_CORRECT
        : 0;
    default:
      return 0;
  }
}

function calculateMatchResultPoints(actual: MatchData, predicted: PredictionData): number {
  if (!actual.homeScore || !actual.awayScore || predicted.predictedHome === undefined || predicted.predictedAway === undefined) {
    return 0;
  }
  
  const actualWinner = actual.homeScore > actual.awayScore ? 'HOME' : actual.homeScore < actual.awayScore ? 'AWAY' : 'DRAW';
  const predictedWinner = predicted.predictedHome! > predicted.predictedAway! ? 'HOME' : predicted.predictedHome! < predicted.predictedAway! ? 'AWAY' : 'DRAW';
  
  if (actualWinner === predictedWinner) {
    let pts = SCORING.CORRECT_WINNER;
    if (actualWinner === 'DRAW') pts += SCORING.DRAW_CORRECT_BONUS;
    return pts;
  }
  return 0;
}

function calculateOverUnderPoints(actual: MatchData, predicted: PredictionData): number {
  if (!actual.homeScore || !actual.awayScore || !actual.overUnderLine || predicted.overUnderPick === undefined) {
    return 0;
  }
  
  const total = actual.homeScore + actual.awayScore;
  const over = total > actual.overUnderLine;
  
  return (over === predicted.overUnderPick) ? SCORING.OVER_UNDER_CORRECT : 0;
}

function calculateHandicapPoints(actual: MatchData, predicted: PredictionData): number {
  if (!actual.homeScore || !actual.awayScore || actual.handicapLine === undefined || predicted.handicapPick === undefined) {
    return 0;
  }
  
  const homeWithHandicap = actual.homeScore + actual.handicapLine;
  
  const actualWinsWithHandicap = homeWithHandicap > actual.awayScore;
  const predictedHomeWins = predicted.handicapPick > 0;
  
  return (actualWinsWithHandicap === predictedHomeWins) ? SCORING.HANDICAP_CORRECT : 0;
}

function calculateCorrectScorePoints(actual: MatchData, predicted: PredictionData): number {
  if (!actual.homeScore || !actual.awayScore || predicted.predictedHome === undefined || predicted.predictedAway === undefined) {
    return 0;
  }
  
  if (actual.homeScore === predicted.predictedHome && actual.awayScore === predicted.predictedAway) {
    return SCORING.EXACT_SCORE_BONUS;
  }
  return 0;
}

function calculateBTTSPoints(actual: MatchData, predicted: PredictionData): number {
  if (!actual.homeScore || !actual.awayScore || predicted.predictedHome === undefined) {
    return 0;
  }
  
  const bothScore = actual.homeScore! > 0 && actual.awayScore! > 0;
  
  return bothScore ? SCORING.BOTH_TEAMS_SCORE_CORRECT : 0;
}

/**
 * Simulates total points for a set of matches
 */
export function simulateTotalPoints(matches: any[], predictions: Record<string, { home: string, away: string }>): number {
  let total = 0;
  matches.forEach(match => {
    const pred = predictions[match.id];
    if (!pred || pred.home === '' || pred.away === '') return;
    
    const predictedScore = { home: parseInt(pred.home), away: parseInt(pred.away) };
    const actualScore = { home: match.homeScore ?? 0, away: match.awayScore ?? 0 };
    
    if (!isNaN(predictedScore.home) && !isNaN(predictedScore.away)) {
      total += calculateSimplePoints(predictedScore, actualScore);
    }
  });
  return total;
}
