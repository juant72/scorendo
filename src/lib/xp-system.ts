import { prisma } from './prisma';

export interface XpConfig {
  BASE_XP_PER_LEVEL: number;
  XP_MULTIPLIER_CURVE: number;
  STREAK_BONUS_MULTIPLIER: number;
  PERFECT_CONTEST_BONUS: number;
  ACCURACY_TIER_THRESHOLDS: Array<{ min: number; name: string; bonus: number }>;
}

export const XP_CONFIG: XpConfig = {
  BASE_XP_PER_LEVEL: 100,
  XP_MULTIPLIER_CURVE: 1.15,
  STREAK_BONUS_MULTIPLIER: 0.1,
  PERFECT_CONTEST_BONUS: 50,
  ACCURACY_TIER_THRESHOLDS: [
    { min: 0.9, name: 'Diamond', bonus: 100 },
    { min: 0.75, name: 'Gold', bonus: 50 },
    { min: 0.6, name: 'Silver', bonus: 25 },
    { min: 0.4, name: 'Bronze', bonus: 10 },
  ],
};

export interface LevelReward {
  level: number;
  title: string;
  badge: string;
  perks: string[];
}

export const LEVEL_REWARDS: LevelReward[] = [
  { level: 1, title: 'Rookie', badge: '🥉', perks: ['Basic contests'] },
  { level: 5, title: 'Regular', badge: '🥈', perks: ['Standard contests', '5% prize boost'] },
  { level: 10, title: 'Veteran', badge: '🥇', perks: ['All contests', '10% prize boost'] },
  { level: 20, title: 'Elite', badge: '💎', perks: ['VIP access', '15% prize boost', 'Early predictions'] },
  { level: 50, title: 'Legend', badge: '👑', perks: ['Legend status', '20% prize boost', 'Exclusive contests'] },
];

export interface LevelUpResult {
  oldLevel: number;
  newLevel: number;
  xpGained: number;
  xpRemaining: number;
  rewards: typeof LEVEL_REWARDS[number] | null;
}

export function calculateLevelFromXp(xp: number): number {
  let level = 1;
  let xpRequired = XP_CONFIG.BASE_XP_PER_LEVEL;
  let totalXpAccumulated = 0;

  while (totalXpAccumulated + xpRequired <= xp) {
    totalXpAccumulated += xpRequired;
    level++;
    xpRequired = Math.floor(
      XP_CONFIG.BASE_XP_PER_LEVEL * Math.pow(XP_CONFIG.XP_MULTIPLIER_CURVE, level - 1)
    );
  }

  return level;
}

export function calculateXpForLevel(targetLevel: number): number {
  let totalXp = 0;
  for (let i = 1; i < targetLevel; i++) {
    totalXp += Math.floor(
      XP_CONFIG.BASE_XP_PER_LEVEL * Math.pow(XP_CONFIG.XP_MULTIPLIER_CURVE, i - 1)
    );
  }
  return totalXp;
}

export function calculateXpInCurrentLevel(xp: number): { current: number; required: number; progress: number } {
  const level = calculateLevelFromXp(xp);
  const xpForCurrentLevel = calculateXpForLevel(level);
  const xpForNextLevel = calculateXpForLevel(level + 1);
  const xpInLevel = xp - xpForCurrentLevel;
  const xpRequired = xpForNextLevel - xpForCurrentLevel;
  
  return {
    current: xpInLevel,
    required: xpRequired,
    progress: xpInLevel / xpRequired,
  };
}

export function getLevelRewards(level: number): LevelReward | null {
  for (let i = LEVEL_REWARDS.length - 1; i >= 0; i--) {
    if (level >= LEVEL_REWARDS[i].level) {
      return LEVEL_REWARDS[i];
    }
  }
  return null;
}

export function getNewLevelAfterXpGain(currentXp: number, xpGained: number): LevelUpResult {
  const oldLevel = calculateLevelFromXp(currentXp);
  const newTotalXp = currentXp + xpGained;
  const newLevel = calculateLevelFromXp(newTotalXp);
  
  const oldRewards = getLevelRewards(oldLevel);
  const newRewards = getLevelRewards(newLevel);
  
  const leveledUp = newLevel > oldLevel;
  const xpForNewLevel = calculateXpForLevel(newLevel);
  const xpRemaining = newTotalXp - xpForNewLevel;
  
  return {
    oldLevel,
    newLevel,
    xpGained,
    xpRemaining: leveledUp ? xpRemaining : currentXp + xpGained - calculateXpForLevel(oldLevel),
    rewards: leveledUp ? newRewards : oldRewards,
  };
}

export function calculateStreakBonus(currentStreak: number, basePoints: number): number {
  return Math.floor(basePoints * (currentStreak * XP_CONFIG.STREAK_BONUS_MULTIPLIER));
}

export async function awardXpForPrediction(
  walletAddress: string,
  points: number,
  isCorrect: boolean,
  isExact: boolean
): Promise<LevelUpResult> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // New robust streak model: compute streak based on last prediction date (live check)
  const lastPrediction = await prisma.prediction.findFirst({
    where: { userWallet: walletAddress },
    orderBy: { createdAt: 'desc' }
  });

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const lastDate = lastPrediction?.createdAt ? new Date(lastPrediction.createdAt) : null;
  const isContinuingStreak = !!lastDate && lastDate.toDateString() === yesterday.toDateString();
  const newStreak = isContinuingStreak ? user.currentStreak + 1 : 1;

  let xpGained = 0;
  if (isCorrect) {
    xpGained += points;
  }
  if (isExact) {
    xpGained += XP_CONFIG.PERFECT_CONTEST_BONUS;
  }

  // Streak bonus uses the new streak value
  const streakBonus = calculateStreakBonus(newStreak, points);
  xpGained += streakBonus;

  const result = getNewLevelAfterXpGain(user.xp, xpGained);

  if (result.newLevel > result.oldLevel) {
    await prisma.user.update({
      where: { walletAddress },
      data: {
        xp: result.xpRemaining,
        level: result.newLevel,
        currentStreak: newStreak,
        bestStreak: Math.max(user.bestStreak, newStreak),
      },
    });
  } else {
    await prisma.user.update({
      where: { walletAddress },
      data: {
        xp: user.xp + xpGained,
        currentStreak: newStreak,
        bestStreak: Math.max(user.bestStreak, newStreak),
      },
    });
  }

  return result;
}
