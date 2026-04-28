import { 
  calculateLevelFromXp,
  calculateXpForLevel,
  calculateXpInCurrentLevel,
  getLevelRewards,
  getNewLevelAfterXpGain,
  calculateStreakBonus,
  XP_CONFIG,
  LEVEL_REWARDS,
} from './src/lib/xp-system.ts';

const runTests = () => {
  let passed = 0;
  let failed = 0;

  const test = (name: string, fn: () => boolean) => {
    try {
      if (fn()) {
        console.log(`✅ ${name}`);
        passed++;
      } else {
        console.log(`❌ ${name}`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ ${name}: ${e}`);
      failed++;
    }
  };

  console.log('\n--- Testing XP System ---\n');

  test('level 1 for 0 XP', () => calculateLevelFromXp(0) === 1);
  test('level 1 for 50 XP', () => calculateLevelFromXp(50) === 1);
  test('level 2 at 100 XP', () => calculateLevelFromXp(100) === 2);
  test('level 3 at 215 XP', () => calculateLevelFromXp(215) === 3);
  test('high XP returns valid level', () => calculateLevelFromXp(1000) > 5);

  test('XP for level 1 is 0', () => calculateXpForLevel(1) === 0);
  test('XP for level 2 is 100', () => calculateXpForLevel(2) === 100);
  test('XP for level 3 is cumulative', () => calculateXpForLevel(3) === 215);

  const progress = calculateXpInCurrentLevel(50);
  test('progress calculation', () => progress.current === 50 && progress.required === 100);

  const reward = getLevelRewards(1);
  test('Rookie at level 1', () => reward?.title === 'Rookie');
  test('Regular at level 5', () => getLevelRewards(5)?.title === 'Regular');
  test('Legend at high level', () => getLevelRewards(100)?.title === 'Legend');

  const levelup = getNewLevelAfterXpGain(90, 20);
  test('level up crossing threshold', () => levelup.newLevel === 2);

  test('streak bonus calculation', () => calculateStreakBonus(5, 100) === 50);
  test('no streak = 0 bonus', () => calculateStreakBonus(0, 100) === 0);

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);

  process.exit(failed > 0 ? 1 : 0);
};

runTests();