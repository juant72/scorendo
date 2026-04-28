import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateLevelFromXp,
  calculateXpForLevel,
  calculateXpInCurrentLevel,
  getLevelRewards,
  getNewLevelAfterXpGain,
  calculateStreakBonus,
  XP_CONFIG,
  LEVEL_REWARDS,
} from './xp-system';

describe('XP System', () => {
  describe('calculateLevelFromXp', () => {
    it('should return level 1 for 0 XP', () => {
      expect(calculateLevelFromXp(0)).toBe(1);
    });

    it('should return level 1 for XP below first threshold', () => {
      expect(calculateLevelFromXp(50)).toBe(1);
    });

    it('should return level 2 after reaching first threshold', () => {
      expect(calculateLevelFromXp(100)).toBe(2);
    });

    it('should return level 3 at 215 XP (100 + 115 threshold)', () => {
      expect(calculateLevelFromXp(215)).toBe(3);
    });

    it('should handle high XP values', () => {
      expect(calculateLevelFromXp(1000)).toBeGreaterThan(5);
    });
  });

  describe('calculateXpForLevel', () => {
    it('should return 0 XP for level 1', () => {
      expect(calculateXpForLevel(1)).toBe(0);
    });

    it('should return 100 XP for level 2', () => {
      expect(calculateXpForLevel(2)).toBe(100);
    });

    it('should return cumulative XP for level 3', () => {
      expect(calculateXpForLevel(3)).toBe(215);
    });
  });

  describe('calculateXpInCurrentLevel', () => {
    it('should calculate progress for level 1', () => {
      const result = calculateXpInCurrentLevel(50);
      expect(result.current).toBe(50);
      expect(result.required).toBe(100);
      expect(result.progress).toBe(0.5);
    });

    it('should handle edge case at level boundary', () => {
      const result = calculateXpInCurrentLevel(100);
      expect(result.current).toBe(0);
      expect(result.progress).toBe(0);
    });
  });

  describe('getLevelRewards', () => {
    it('should return Rookie for level 1', () => {
      const reward = getLevelRewards(1);
      expect(reward?.title).toBe('Rookie');
    });

    it('should return Regular for level 5', () => {
      const reward = getLevelRewards(5);
      expect(reward?.title).toBe('Regular');
    });

    it('should return highest reward when exceeding', () => {
      const reward = getLevelRewards(100);
      expect(reward?.title).toBe('Legend');
    });
  });

  describe('getNewLevelAfterXpGain', () => {
    it('should not level up when under threshold', () => {
      const result = getNewLevelAfterXpGain(50, 20);
      expect(result.newLevel).toBe(1);
      expect(result.rewards?.title).toBe('Rookie');
    });

    it('should level up when crossing threshold', () => {
      const result = getNewLevelAfterXpGain(90, 20);
      expect(result.newLevel).toBe(2);
    });

    it('should include correct rewards on level up', () => {
      const result = getNewLevelAfterXpGain(0, 150);
      expect(result.newLevel).toBeGreaterThan(1);
      expect(result.rewards).not.toBeNull();
    });
  });

  describe('calculateStreakBonus', () => {
    it('should return 0 for no streak', () => {
      expect(calculateStreakBonus(0, 100)).toBe(0);
    });

    it('should calculate 10% bonus per streak', () => {
      expect(calculateStreakBonus(1, 100)).toBe(10);
      expect(calculateStreakBonus(5, 100)).toBe(50);
    });
  });

  describe('constants', () => {
    it('should have valid BASE_XP_PER_LEVEL', () => {
      expect(XP_CONFIG.BASE_XP_PER_LEVEL).toBeGreaterThan(0);
    });

    it('should have valid XP_MULTIPLIER_CURVE', () => {
      expect(XP_CONFIG.XP_MULTIPLIER_CURVE).toBeGreaterThan(1);
    });

    it('should have LEVEL_REWARDS sorted by level', () => {
      for (let i = 1; i < LEVEL_REWARDS.length; i++) {
        expect(LEVEL_REWARDS[i].level).toBeGreaterThan(LEVEL_REWARDS[i - 1].level);
      }
    });
  });
});