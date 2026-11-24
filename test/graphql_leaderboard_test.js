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

console.log('==================================================');
console.log('🏆 ALL JS CLIENT TESTS PASSED (100%)');
console.log('==================================================');
