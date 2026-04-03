import { PrismaClient } from '@prisma/client';
import { settleMatchScores } from '../src/lib/settle';
const prisma = new PrismaClient();

async function alphaTestDrive() {
  console.log('🚀 --- ALFA TEST DRIVE: INITIATING END-TO-END VERIFICATION ---');

  const WALLET = 'C8zmudQmvhSvDwx5yGkRwVg4NRZESG69TJpq7vKNb3Mz'; // Test User
  const CONTEST_ID = 'cmnhaao7j000jt83jjtm8in1a';
  const MATCH_ID = 'afa-md14-1';

  // 1. PHASE 1: PRE-FLIGHT CHECK
  const userBefore = await prisma.user.findUnique({ where: { walletAddress: WALLET } }) as any;
  console.log(`[STATUS] User before: ${userBefore.totalPoints} PTS, Level ${userBefore.level}, XP ${userBefore.xp}`);

  // 2. PHASE 2: SUBMIT PREDICTION (SIMULATION)
  console.log('[ACTION] Submitting Prediction (2-1 for RIV)...');
  await prisma.prediction.upsert({
    where: { userWallet_matchId_contestId: { userWallet: WALLET, matchId: MATCH_ID, contestId: CONTEST_ID } },
    update: { predictedHome: 2, predictedAway: 1, predictedWinner: 'HOME' },
    create: { userWallet: WALLET, matchId: MATCH_ID, contestId: CONTEST_ID, predictedHome: 2, predictedAway: 1, predictedWinner: 'HOME' }
  });
  console.log('[SUCCESS] Prediction Locked.');

  // 3. PHASE 3: ORACLE SETTLEMENT (SIMULATION)
  console.log('[ACTION] Pulsing Oracle Sync (Result 2-1)...');
  const settlement = await settleMatchScores(MATCH_ID, 2, 1);
  console.log(`[SUCCESS] Oracle Pulse Finished. Processed ${settlement.totalScored} predictions.`);

  // 4. PHASE 4: GLOBAL VERIFICATION
  const userAfter = await prisma.user.findUnique({ where: { walletAddress: WALLET } }) as any;
  console.log('--- FINAL RESULTS ---');
  console.log(`[VERDICT] Points: ${userBefore.totalPoints} -> ${userAfter.totalPoints} (Diff: ${userAfter.totalPoints - userBefore.totalPoints})`);
  console.log(`[VERDICT] Level: ${userBefore.level} -> ${userAfter.level}`);
  console.log(`[VERDICT] XP: ${userBefore.xp} -> ${userAfter.xp}`);
  
  if (userAfter.totalPoints > userBefore.totalPoints) {
    console.log('✅ TEST PASSED: THE DOPAMINE ENGINE IS ALIVE.');
  } else {
    console.log('❌ TEST FAILED: Points were not awarded correctly.');
  }

  console.log('🚀 --- ALFA TEST DRIVE: COMPLETE ---');
}

alphaTestDrive().catch(e => console.error(e)).finally(() => prisma.$disconnect());
