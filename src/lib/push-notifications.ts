import { prisma } from './prisma';

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string }>;
}

export interface Subscriber {
  walletAddress: string;
  subscription: PushSubscription;
  createdAt: Date;
}

export const NOTIFICATION_TYPES = {
  MATCH_STARTING: 'match_starting',
  CONTEST_WINNING: 'contest_winning',
  PRIZE_CLAIMED: 'prize_claimed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  STREAK_MILESTONE: 'streak_milestone',
  CONTEST_STARTING: 'contest_starting',
} as const;

export class PushNotifier {
  private static async getVapidPublicKey(): Promise<string> {
    return process.env.NEXT_PUBLIC_VAPID_KEY || '';
  }

  static async subscribe(walletAddress: string, subscription: PushSubscription): Promise<void> {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "PushSubscription" ("walletAddress", "subscription", "createdAt")
      VALUES ($1, $2, NOW())
      ON CONFLICT ("walletAddress") DO UPDATE 
      SET "subscription" = $2, "createdAt" = NOW()
    `, walletAddress, JSON.stringify(subscription));
  }

  static async unsubscribe(walletAddress: string): Promise<void> {
    await prisma.$executeRawUnsafe(`
      DELETE FROM "PushSubscription" WHERE "walletAddress" = $1
    `, walletAddress);
  }

  static async notifyMatchStarting(matchId: string, minutesUntil: number): Promise<number> {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { homeTeam: true, awayTeam: true },
    });

    if (!match) return 0;

    const notification: PushNotification = {
      title: `${match.homeTeam.code} vs ${match.awayTeam.code} Starting Soon!`,
      body: `Match starts in ${minutesUntil} minutes. Submit your predictions now!`,
      icon: '/icon-192.png',
      badge: '/badge-new.png',
      data: { type: NOTIFICATION_TYPES.MATCH_STARTING, matchId },
    };

    return this.broadcastToMatchParticipants(matchId, notification);
  }

  static async notifyContestWinner(contestId: string, walletAddress: string, rank: number, prizeAmount: bigint): Promise<void> {
    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) return;

    const prizeSOL = Number(prizeAmount) / 1e9;

    const notification: PushNotification = {
      title: `🎉 You Finished #${rank}!`,
      body: rank === 1 
        ? `Congratulations! You won ${prizeSOL} SOL in ${contest.name}!`
        : `You placed #${rank} in ${contest.name}. Prize: ${prizeSOL} SOL`,
      icon: '/icon-192.png',
      badge: '/badge-prize.png',
      data: { type: NOTIFICATION_TYPES.CONTEST_WINNING, contestId, rank },
    };

    await this.sendToUser(walletAddress, notification);
  }

  static async notifyLevelUp(walletAddress: string, newLevel: number, rewards: string[]): Promise<void> {
    const notification: PushNotification = {
      title: `🆙 Level ${newLevel} Reached!`,
      body: `You've leveled up! Unlocked: ${rewards.join(', ')}`,
      icon: '/icon-192.png',
      badge: '/badge-level.png',
      data: { type: NOTIFICATION_TYPES.LEVEL_UP, level: newLevel },
    };

    await this.sendToUser(walletAddress, notification);
  }

  static async notifyAchievement(walletAddress: string, achievementName: string, rarity: string): Promise<void> {
    const emoji = rarity === 'LEGENDARY' ? '🏆' : rarity === 'EPIC' ? '💎' : '⭐';

    const notification: PushNotification = {
      title: `${emoji} Achievement Unlocked!`,
      body: `You've earned: ${achievementName}`,
      icon: '/icon-192.png',
      badge: '/badge-achievement.png',
      data: { type: NOTIFICATION_TYPES.ACHIEVEMENT_UNLOCKED, achievement: achievementName },
    };

    await this.sendToUser(walletAddress, notification);
  }

  private static async sendToUser(walletAddress: string, notification: PushNotification): Promise<void> {
    console.log(`[PUSH] Sending to ${walletAddress.slice(0, 8)}: ${notification.title}`);
  }

  private static async broadcastToMatchParticipants(matchId: string, notification: PushNotification): Promise<number> {
    const predictions = await prisma.prediction.findMany({
      where: { matchId },
      select: { userWallet: true },
    });

    const uniqueWallets = [...new Set(predictions.map(p => p.userWallet))];

    for (const wallet of uniqueWallets) {
      await this.sendToUser(wallet, notification);
    }

    return predictions.length;
  }

  static async scheduleMatchReminder(matchId: string, minutesBefore: number): Promise<void> {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      select: { kickoff: true },
    });

    if (!match) return;

    const reminderTime = new Date(match.kickoff.getTime() - minutesBefore * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        this.notifyMatchStarting(matchId, minutesBefore);
      }, delay);
    }
  }
}

export function createWebPushPayload(notification: PushNotification): Record<string, unknown> {
  return {
    notification: {
      title: notification.title,
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      data: notification.data,
      actions: notification.actions,
      vibrate: [200, 100, 200],
      tag: 'scorendo-notification',
      renotify: true,
    },
  };
}