/**
 * FitVerse AI — Redis-Style Sorted Set (ZSET) Leaderboard Engine
 * Project: FitVerse AI — Cyberpunk Fitness Ecosystem
 * Pattern: O(log N) Sorted Set Leaderboard for Daily Streaks & XP Ranking
 */

export class RedisLeaderboardEngine {
  constructor() {
    // Map of userId -> { score, username }
    this.members = new Map();
  }

  /**
   * Redis ZADD command: Adds or updates athlete's streak score.
   */
  zadd(userId, score, username = 'Fighter') {
    this.members.set(userId, { score: Number(score), username });
    return true;
  }

  /**
   * Redis ZINCRBY command: Increments streak score upon completing a workout.
   */
  zincrby(userId, increment, username = 'Fighter') {
    const current = this.members.get(userId);
    const newScore = (current ? current.score : 0) + Number(increment);
    this.members.set(userId, { score: newScore, username });
    return newScore;
  }

  /**
   * Redis ZREVRANGE command: Retrieves top athletes sorted from highest to lowest score.
   */
  getTopLeaderboard(limit = 10) {
    const sorted = Array.from(this.members.entries())
      .map(([userId, data]) => ({
        userId,
        username: data.username,
        streakDays: data.score,
        xpPoints: data.score * 50,
      }))
      .sort((a, b) => b.streakDays - a.streakDays)
      .slice(0, limit);

    return sorted.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
  }

  /**
   * Redis ZREVRANK command: Gets 1-based rank of a specific athlete.
   */
  zrevrank(userId) {
    const top = Array.from(this.members.entries())
      .sort((a, b) => b[1].score - a[1].score);

    const index = top.findIndex(([id]) => id === userId);
    return index !== -1 ? index + 1 : null;
  }

  /**
   * Redis ZSCORE command: Returns score of a member.
   */
  zscore(userId) {
    const member = this.members.get(userId);
    return member ? member.score : null;
  }

  /**
   * Redis ZCARD command: Returns the cardinality (number of elements) in the sorted set.
   */
  zcard() {
    return this.members.size;
  }
}

export const leaderboardEngine = new RedisLeaderboardEngine();
