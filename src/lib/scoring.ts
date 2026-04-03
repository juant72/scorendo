import { SCORING } from './constants';

export interface MatchScore {
  home: number;
  away: number;
}

/**
 * Calculates points for a single match prediction
 * Logic based on Official Scorendo rules in constants.ts
 */
export function calculateMatchPoints(actual: MatchScore, predicted: MatchScore): number {
  if (predicted.home === null || predicted.away === null) return 0;
  
  let points = 0;
  
  const actualWinner = actual.home > actual.away ? 'HOME' : actual.home < actual.away ? 'AWAY' : 'DRAW';
  const predictedWinner = predicted.home > predicted.away ? 'HOME' : predicted.home < predicted.away ? 'AWAY' : 'DRAW';
  
  // 1. Correct Outcome (Winner or Draw)
  if (actualWinner === predictedWinner) {
    points += SCORING.CORRECT_WINNER;
    
    // Draw Bonus (if applicable)
    if (actualWinner === 'DRAW') {
      points += SCORING.DRAW_CORRECT_BONUS;
    }
  }
  
  // 2. Exact Score Bonus
  if (actual.home === predicted.home && actual.away === predicted.away) {
    points += SCORING.EXACT_SCORE_BONUS;
  }
  
  return points;
}

/**
 * Simulates total points for a set of matches
 */
export function simulateTotalPoints(matches: any[], predictions: Record<string, { home: string, away: string }>): number {
  let total = 0;
  matches.forEach(match => {
    const pred = predictions[match.id];
    if (!pred || pred.home === '' || pred.away === '') return;
    
    // For simulation, we assume the prediction IS the actual result
    // (Wait, that's not right. Simulation mode usually means: 
    // "What if the match results were X?")
    // In our case, the user's prediction IS the 'What If' result.
  });
  return total;
}
