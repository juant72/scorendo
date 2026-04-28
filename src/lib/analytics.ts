import { prisma } from './prisma';

export interface DashboardStats {
  totalUsers: number;
  totalPredictions: number;
  totalContests: number;
  activeContests: number;
  totalVolume: number;
  prizesDistributed: number;
  averageAccuracy: number;
  topPerformers: Array<{ wallet: string; points: number; accuracy: number; level: number }>;
  recentActivity: Array<{ type: string; timestamp: Date; data: unknown }>;
}

export interface ContestAnalytics {
  contestId: string;
  totalParticipants: number;
  totalPredictions: number;
  predictionRate: number;
  mostPredictedResults: Array<{ result: string; count: number }>;
  leaderboard: Array<{ rank: number; wallet: string; points: number; isCorrect: boolean }>;
  prizeDistribution: Record<string, number>;
}

export interface UserAnalytics {
  walletAddress: string;
  totalPredictions: number;
  accuracy: number;
  averagePointsPerPrediction: number;
  bestStreak: number;
  currentStreak: number;
  favoriteTeams: string[];
  winRate: number;
  level: number;
  xp: number;
  achievements: number;
  contestsWon: number;
  contestsJoined: number;
  predictionHistory: Array<{ date: Date; predictions: number; correct: number; points: number }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    totalPredictions,
    totalContests,
    activeContests,
    volumeAgg,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.prediction.count(),
    prisma.contest.count(),
    prisma.contest.count({ where: { status: { in: ['REGISTRATION', 'ACTIVE'] } } }),
    prisma.contest.aggregate({ _sum: { prizePool: true } }),
  ]);

  const avgAccuracy = await prisma.user.aggregate({
    _avg: { accuracy: true },
  });

  const topUsers = await prisma.user.findMany({
    orderBy: { totalPoints: 'desc' },
    take: 10,
    select: { walletAddress: true, totalPoints: true, accuracy: true, level: true },
  });

  return {
    totalUsers,
    totalPredictions,
    totalContests,
    activeContests,
    totalVolume: Number(volumeAgg._sum.prizePool || 0) / 1e9,
    prizesDistributed: Number(volumeAgg._sum.prizePool || 0) / 1e9 * 0.8,
    averageAccuracy: avgAccuracy._avg.accuracy || 0,
    topPerformers: topUsers.map(u => ({
      wallet: u.walletAddress,
      points: u.totalPoints,
      accuracy: u.accuracy,
      level: u.level,
    })),
    recentActivity: [],
  };
}

export async function getContestAnalytics(contestId: string): Promise<ContestAnalytics | null> {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
  });

  if (!contest) return null;

  const predictions = await prisma.prediction.findMany({
    where: { contestId },
    include: { user: true },
  });

  const predictionMap = new Map<string, number>();
  for (const pred of predictions) {
    if (pred.predictedWinner) {
      const key = pred.predictedWinner;
      predictionMap.set(key, (predictionMap.get(key) || 0) + 1);
    }
  }

  const mostPredicted = Array.from(predictionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([result, count]) => ({ result, count }));

  const entries = await prisma.userContestEntry.findMany({
    where: { contestId },
    orderBy: { finalPoints: 'desc' },
    take: 10,
  });

  const leaderboard = entries.map((e, i) => ({
    rank: i + 1,
    wallet: e.userWallet,
    points: e.finalPoints,
    isCorrect: false,
  }));

  return {
    contestId,
    totalParticipants: contest.currentEntries,
    totalPredictions: predictions.length,
    predictionRate: contest.currentEntries > 0 
      ? (predictions.length / (contest.currentEntries * 10)) * 100 
      : 0,
    mostPredictedResults: mostPredicted,
    leaderboard,
    prizeDistribution: contest.distribution as Record<string, number>,
  };
}

export async function getUserAnalytics(walletAddress: string): Promise<UserAnalytics | null> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: { predictions: true, achievements: true, contestEntries: true },
  });

  if (!user) return null;

  const predictionsByDate = await prisma.prediction.groupBy({
    by: ['createdAt'],
    where: { userWallet: walletAddress },
    _count: true,
    _sum: { pointsEarned: true },
  });

  const predictionHistory = predictionsByDate.map(p => ({
    date: p.createdAt,
    predictions: p._count,
    correct: 0,
    points: p._sum.pointsEarned || 0,
  }));

  const contestsWon = await prisma.userContestEntry.count({
    where: { userWallet: walletAddress, finalRank: 1 },
  });

  return {
    walletAddress: user.walletAddress,
    totalPredictions: user.totalPredictions,
    accuracy: user.accuracy,
    averagePointsPerPrediction: user.totalPredictions > 0 ? user.totalPoints / user.totalPredictions : 0,
    bestStreak: user.bestStreak,
    currentStreak: user.currentStreak,
    favoriteTeams: [],
    winRate: user.contestEntries.length > 0 
      ? (contestsWon / user.contestEntries.length) * 100 
      : 0,
    level: user.level,
    xp: user.xp,
    achievements: user.achievements.length,
    contestsWon,
    contestsJoined: user.contestEntries.length,
    predictionHistory,
  };
}

export async function getRealTimeLeaderboard(contestId: string, limit = 10): Promise<Array<{
  rank: number;
  wallet: string;
  avatar?: string;
  displayName?: string;
  points: number;
  trend: 'up' | 'down' | 'same';
}>> {
  const entries = await prisma.userContestEntry.findMany({
    where: { contestId },
    orderBy: { finalPoints: 'desc' },
    take: limit,
    include: { user: { select: { avatarSeed: true, displayName: true } } },
  });

  return entries.map((entry, i) => ({
    rank: i + 1,
    wallet: entry.userWallet,
    avatar: entry.user.avatarSeed || undefined,
    displayName: entry.user.displayName || undefined,
    points: entry.finalPoints,
    trend: 'same' as const,
  }));
}

export async function getActivityFeed(limit = 20): Promise<Array<{
  id: string;
  type: 'prediction' | 'contest_join' | 'achievement' | 'prize';
  user: string;
  data: Record<string, unknown>;
  timestamp: Date;
}>> {
  const recentPredictions = await prisma.prediction.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { walletAddress: true } } },
  });

  return recentPredictions.map(p => ({
    id: p.id,
    type: 'prediction' as const,
    user: p.user.walletAddress,
    data: { contestId: p.contestId, matchId: p.matchId },
    timestamp: p.createdAt,
  }));
}