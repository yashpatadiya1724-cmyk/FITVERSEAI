/**
 * FitVerse AI — Node.js Client GraphQL & Redis Leaderboard Unit Tests
 */

import { executeGraphQLQuery } from '../src/graphql/schema.js';
import { RedisLeaderboardEngine } from '../src/services/leaderboardRedis.js';

console.log('==================================================');
console.log('⚡ FITVERSE AI: JS CLIENT / GRAPHQL & REDIS TESTS');
console.log('==================================================');

const redisEngine = new RedisLeaderboardEngine();

// 1. Test ZADD
redisEngine.zadd('user_01', 12, 'CyberSamurai');
redisEngine.zadd('user_02', 25, 'ValkyrieNeon');
redisEngine.zadd('user_03', 8, 'ShadowRunner');

// 2. Test ZINCRBY
const newScore = redisEngine.zincrby('user_01', 3, 'CyberSamurai');
if (newScore !== 15) throw new Error(`Expected score 15, got ${newScore}`);
console.log('✅ Redis ZINCRBY: Incremented score to 15 successfully');

// 3. Test ZREVRANGE Top Leaderboard
const leaderboard = redisEngine.getTopLeaderboard(3);
if (leaderboard[0].username !== 'ValkyrieNeon' || leaderboard[0].rank !== 1) {
  throw new Error('Leaderboard ranking mismatch');
}
console.log(`✅ Redis ZREVRANGE: Rank 1 is ${leaderboard[0].username} with ${leaderboard[0].streakDays} days`);

// 4. Test ZREVRANK, ZSCORE, and ZCARD
const rankUser01 = redisEngine.zrevrank('user_01');
const scoreUser01 = redisEngine.zscore('user_01');
const totalAthletes = redisEngine.zcard();
if (rankUser01 !== 2) throw new Error(`Expected rank 2 for user_01, got ${rankUser01}`);
if (scoreUser01 !== 15) throw new Error(`Expected score 15 for user_01, got ${scoreUser01}`);
if (totalAthletes !== 3) throw new Error(`Expected cardinality 3, got ${totalAthletes}`);
console.log(`✅ Redis ZREVRANK & ZSCORE: user_01 is Rank #${rankUser01} with ${scoreUser01} score across ${totalAthletes} total athletes`);

// 5. Test GraphQL Query with Field Selection
const queryStr = `
  query GetWorkout {
    getWorkoutPlan {
      splitName
      exercises {
        name
        reps
      }
    }
  }
`;

const res = executeGraphQLQuery(queryStr, { goal: 'muscle_gain', level: 'intermediate' });
const plan = res.data.getWorkoutPlan;
if (!plan.splitName || !plan.exercises || plan.exercises.length === 0) {
  throw new Error('GraphQL query returned empty plan');
}
if (plan.exercises[0].videoDemoUrl !== undefined) {
  throw new Error('GraphQL failed to strip videoDemoUrl');
}
console.log(`✅ GraphQL Field Filter: Returned '${plan.splitName}' with ${plan.exercises.length} exercises (reps and name only, 3D/video stripped)`);

// 6. Test ZREM, ZSCORERESET, and getRankAroundUser
redisEngine.zadd('user_04', 30, 'GhostTitan');
redisEngine.zadd('user_05', 5, 'RookieSparrow');
const windowAthletes = redisEngine.getRankAroundUser('user_01', 1);
if (!windowAthletes || windowAthletes.length < 2) {
  throw new Error('Expected at least 2 athletes in contextual rank window');
}
const userInWindow = windowAthletes.find(a => a.userId === 'user_01');
if (!userInWindow || userInWindow.rank !== 3) {
  throw new Error(`Expected user_01 rank 3 in updated leaderboard, got ${userInWindow?.rank}`);
}
console.log(`✅ Redis getRankAroundUser: Retrieved ${windowAthletes.length}-athlete window around user_01 (Rank #${userInWindow.rank})`);

redisEngine.zscoreReset('user_01');
if (redisEngine.zscore('user_01') !== 0) {
  throw new Error('Failed to reset user_01 score to 0');
}
console.log(`✅ Redis zscoreReset: Reset user_01 streak score to 0 successfully`);

redisEngine.zrem('user_05');
if (redisEngine.zcard() !== 4 || redisEngine.zscore('user_05') !== null) {
  throw new Error('Failed to remove user_05 from leaderboard');
}
console.log(`✅ Redis ZREM: Removed user_05; cardinality accurately adjusted to ${redisEngine.zcard()}`);

// 7. Test zaddBatch and getPaginatedLeaderboard
const batchCount = redisEngine.zaddBatch([
  { userId: 'user_06', score: 45, username: 'ZenMaster' },
  { userId: 'user_07', score: 38, username: 'BladeRunner' },
  { userId: 'user_08', score: 22, username: 'NeonPulse' },
  { userId: 'user_09', score: 18, username: 'ApexViper' },
]);
if (batchCount !== 4) throw new Error(`Expected 4 batch ingested athletes, got ${batchCount}`);

const page1 = redisEngine.getPaginatedLeaderboard(1, 4);
if (page1.athletes.length !== 4 || page1.athletes[0].username !== 'ZenMaster') {
  throw new Error('Page 1 pagination slicing or sorting failed');
}
if (!page1.hasNextPage || page1.totalPages !== 2) {
  throw new Error(`Pagination metadata mismatch: totalPages=${page1.totalPages}, hasNext=${page1.hasNextPage}`);
}

const page2 = redisEngine.getPaginatedLeaderboard(2, 4);
if (page2.athletes.length !== 4 || page2.hasNextPage !== false) {
  throw new Error('Page 2 boundary condition failed');
}
console.log(`✅ Redis zaddBatch & Pagination: Ingested 4 athletes; Paginated ${page1.totalAthletes} athletes across 2 pages seamlessly`);

// 8. Test ZCOUNT, getTierDistribution, and clear
// Athletes in redisEngine currently:
// user_06 (45), user_07 (38), user_04 (30) -> 3 CyberImmortal (>= 30)
// user_02 (25), user_08 (22), user_09 (18) -> 3 NeonVeteran (15 - 29)
// user_03 (8) -> 1 StreetFighter (5 - 14)
// user_01 (0) -> 1 Rookie (< 5)
// Total: 8 athletes
const countAbove30 = redisEngine.zcount(30, Infinity);
if (countAbove30 !== 3) {
  throw new Error(`Expected 3 athletes with score >= 30, got ${countAbove30}`);
}

const tierDist = redisEngine.getTierDistribution();
if (tierDist.cyberImmortal !== 3 || tierDist.neonVeteran !== 3 || tierDist.streetFighter !== 1 || tierDist.rookie !== 1) {
  throw new Error(`Tier distribution mismatch: ${JSON.stringify(tierDist)}`);
}
console.log(`✅ Redis ZCOUNT & Tiers: Found ${countAbove30} elite athletes; Distribution: ${tierDist.cyberImmortal} Immortals, ${tierDist.neonVeteran} Veterans, ${tierDist.streetFighter} Street Fighters, ${tierDist.rookie} Rookies`);

// Test clear
const clearedCount = redisEngine.clear();
if (clearedCount !== 8 || redisEngine.zcard() !== 0) {
  throw new Error(`Expected 8 cleared athletes, got ${clearedCount} (current size: ${redisEngine.zcard()})`);
}
console.log(`✅ Redis clear: Flushed ${clearedCount} athletes; leaderboard cardinality verified at 0`);

console.log('==================================================');
console.log('🏆 ALL JS CLIENT TESTS PASSED (100%)');
console.log('==================================================');
