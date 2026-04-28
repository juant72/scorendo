import { prisma } from './prisma';
import { settleMatchScores } from './settle';

export enum OracleProvider {
  SPORT_MONKS = 'sportmonks',
  API_FOOTBALL = 'apifootball',
  ACTION_GAMES = 'actiongames',
  MOCK = 'mock',
}

export interface OracleMatchResult {
  matchId: string;
  homeScore: number;
  awayScore: number;
  status: 'FINISHED' | 'LIVE' | 'POSTPONED' | 'CANCELLED';
  extraTime?: boolean;
  penalties?: boolean;
  firstScorerId?: string;
  lastScorerId?: string;
  bothTeamsScore?: boolean;
  updatedAt: Date;
}

export interface OracleConfig {
  provider: OracleProvider;
  apiKey?: string;
  baseUrl?: string;
  leagueIds?: string[];
}

const DEFAULT_CONFIG: OracleConfig = {
  provider: OracleProvider.MOCK,
};

export class SportsOracle {
  private config: OracleConfig;

  constructor(config: Partial<OracleConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async fetchMatchResult(externalMatchId: string): Promise<OracleMatchResult | null> {
    switch (this.config.provider) {
      case OracleProvider.SPORT_MONKS:
        return this.fetchFromSportMonks(externalMatchId);
      case OracleProvider.API_FOOTBALL:
        return this.fetchFromApiFootball(externalMatchId);
      case OracleProvider.MOCK:
      default:
        return this.fetchMockResult(externalMatchId);
    }
  }

  async fetchLiveScores(leagueIds?: string[]): Promise<OracleMatchResult[]> {
    const targetLeagues = leagueIds || this.config.leagueIds || [];

    switch (this.config.provider) {
      case OracleProvider.SPORT_MONKS:
        return this.fetchLiveFromSportMonks(targetLeagues);
      case OracleProvider.API_FOOTBALL:
        return this.fetchLiveFromApiFootball(targetLeagues);
      case OracleProvider.MOCK:
      default:
        return this.fetchMockLive();
    }
  }

  private async fetchFromSportMonks(externalMatchId: string): Promise<OracleMatchResult | null> {
    if (!this.config.apiKey) {
      throw new Error('SportMonks API key not configured');
    }

    try {
      const response = await fetch(
        `https://api.sportmonks.com/v3/core/fixtures/${externalMatchId}`,
        {
          headers: {
            'Authorization': `${this.config.apiKey}`,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SportMonks API error: ${response.status}`);
      }

      const data = await response.json();
      const fixture = data.data;

      return {
        matchId: externalMatchId,
        homeScore: fixture.results?.home_score ?? 0,
        awayScore: fixture.results?.away_score ?? 0,
        status: this.mapSportMonksStatus(fixture.time.status),
        extraTime: fixture.time.extra_time === 1,
        penalties: fixture.time.penalties === 1,
        updatedAt: new Date(fixture.time.updated_at),
      };
    } catch (error) {
      console.error('SportMonks fetch error:', error);
      return null;
    }
  }

  private async fetchFromApiFootball(externalMatchId: string): Promise<OracleMatchResult | null> {
    if (!this.config.apiKey) {
      throw new Error('API-Football key not configured');
    }

    try {
      const response = await fetch(
        `https://v3.api.football/fixtures/${externalMatchId}`,
        {
          headers: {
            'x-apisports-key': this.config.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API-Football error: ${response.status}`);
      }

      const data = await response.json();
      const fixture = data.response[0];

      const goals = fixture.goals;
      const scores = fixture.score;

      return {
        matchId: externalMatchId,
        homeScore: goals.home ?? 0,
        awayScore: goals.away ?? 0,
        status: this.mapFootballStatus(fixture.fixture.status.short),
        extraTime: scores.extraltime?.home !== null,
        penalties: scores.penalty?.home !== null,
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('API-Football fetch error:', error);
      return null;
    }
  }

  private async fetchLiveFromSportMonks(leagueIds: string[]): Promise<OracleMatchResult[]> {
    console.log(`[ORACLE] Fetching live matches from SportMonks for leagues: ${leagueIds.join(', ')}`);
    return [];
  }

  private async fetchLiveFromApiFootball(leagueIds: string[]): Promise<OracleMatchResult[]> {
    console.log(`[ORACLE] Fetching live matches from API-Football for leagues: ${leagueIds.join(', ')}`);
    return [];
  }

  private async fetchMockLive(): Promise<OracleMatchResult[]> {
    return [];
  }

  private async fetchMockResult(externalMatchId: string): Promise<OracleMatchResult | null> {
    console.log(`[ORACLE] Mock fetching match ${externalMatchId}`);
    return null;
  }

  private mapSportMonksStatus(status: string): OracleMatchResult['status'] {
    const statusMap: Record<string, OracleMatchResult['status']> = {
      'FT': 'FINISHED',
      'AET': 'FINISHED',
      'PEN': 'FINISHED',
      'LIVE': 'LIVE',
      'NS': 'LIVE',
      'POSTP': 'POSTPONED',
      'CANC': 'CANCELLED',
    };
    return statusMap[status] || 'LIVE';
  }

  private mapFootballStatus(status: string): OracleMatchResult['status'] {
    const statusMap: Record<string, OracleMatchResult['status']> = {
      'FT': 'FINISHED',
      'ET': 'FINISHED',
      'P': 'FINISHED',
      'LIVE': 'LIVE',
      'NS': 'LIVE',
      'Postponed': 'POSTPONED',
      'Cancelled': 'CANCELLED',
    };
    return statusMap[status] || 'LIVE';
  }
}

export async function syncMatchFromOracle(matchId: string, provider: OracleProvider = OracleProvider.MOCK): Promise<boolean> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!match) {
    throw new Error(`Match ${matchId} not found`);
  }

  const oracle = new SportsOracle({ provider });
  const result = await oracle.fetchMatchResult(matchId);

  if (!result) {
    console.log(`[ORACLE] No result available for match ${matchId}`);
    return false;
  }

  if (result.status === 'FINISHED') {
    const { settleMatchScores } = await import('./settle');
    await settleMatchScores(
      matchId,
      result.homeScore,
      result.awayScore,
      {
        overUnderLine: 2.5,
        firstScorerId: result.firstScorerId,
        lastScorerId: result.lastScorerId,
        bothTeamsScore: result.bothTeamsScore,
      }
    );
    return true;
  }

  if (result.status === 'LIVE' && match.status === 'SCHEDULED') {
    await prisma.match.update({
      where: { id: matchId },
      data: { status: 'LIVE' },
    });
    return true;
  }

  return false;
}

export async function bulkSyncFromOracle(leagueIds?: string[], provider?: OracleProvider): Promise<number> {
  const matches = await prisma.match.findMany({
    where: {
      status: { in: ['SCHEDULED', 'LIVE'] },
      kickoff: { lte: new Date() },
    },
    take: 50,
  });

  let synced = 0;
  const oracle = new SportsOracle({
    provider: provider || OracleProvider.MOCK,
    leagueIds,
  });

  const liveResults = await oracle.fetchLiveScores(leagueIds);

  for (const result of liveResults) {
    const match = matches.find(m => m.id === result.matchId);
    if (!match) continue;

    if (result.status === 'FINISHED') {
      try {
        const { settleMatchScores } = await import('./settle');
        await settleMatchScores(
          result.matchId,
          result.homeScore,
          result.awayScore
        );
        synced++;
      } catch (error) {
        console.error(`[ORACLE] Failed to settle match ${result.matchId}:`, error);
      }
    }
  }

  return synced;
}