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

  /**
   * Redis ZREM command: Removes member from the sorted set.
   */
  zrem(userId) {
    return this.members.delete(userId);
  }

  /**
   * Resets member streak score to 0 upon broken streak.
   */
  zscoreReset(userId) {
    const member = this.members.get(userId);
    if (!member) return false;
    this.members.set(userId, { ...member, score: 0 });
    return true;
  }

  /**
   * Returns contextual ranking window around target athlete for focused UI view.
   */
  getRankAroundUser(userId, windowSize = 1) {
    const userRank = this.zrevrank(userId);
    if (!userRank) return null;

    const all = Array.from(this.members.entries())
      .map(([id, data]) => ({
        userId: id,
        username: data.username,
        streakDays: data.score,
        xpPoints: data.score * 50,
      }))
      .sort((a, b) => b.streakDays - a.streakDays)
      .map((entry, idx) => ({ rank: idx + 1, ...entry }));

    const userIdx = userRank - 1;
    const start = Math.max(0, userIdx - windowSize);
    const end = Math.min(all.length, userIdx + windowSize + 1);
    return all.slice(start, end);
  }

  /**
   * Batch ingests multiple athlete streaks efficiently.
   */
  zaddBatch(records = []) {
    let count = 0;
    for (const rec of records) {
      if (rec && rec.userId) {
        this.zadd(rec.userId, rec.score || 0, rec.username || 'Fighter');
        count++;
      }
    }
    return count;
  }

  /**
   * Returns paginated leaderboard with pagination metadata.
   */
  getPaginatedLeaderboard(page = 1, pageSize = 5) {
    const validPage = Math.max(1, Number(page) || 1);
    const validSize = Math.max(1, Number(pageSize) || 5);
    const all = this.getTopLeaderboard(this.members.size);
    const totalAthletes = all.length;
    const totalPages = Math.ceil(totalAthletes / validSize) || 1;
    const offset = (validPage - 1) * validSize;
    const athletes = all.slice(offset, offset + validSize);

    return {
      athletes,
      totalAthletes,
      totalPages,
      currentPage: validPage,
      pageSize: validSize,
      hasNextPage: validPage < totalPages,
    };
  }

  /**
   * Redis ZCOUNT command: Returns count of athletes with score between minScore and maxScore.
   */
  zcount(minScore = -Infinity, maxScore = Infinity) {
    let count = 0;
    for (const data of this.members.values()) {
      if (data.score >= minScore && data.score <= maxScore) {
        count++;
      }
    }
    return count;
  }

  /**
   * Returns tier breakdown distribution for gamification and ranking badges.
   */
  getTierDistribution() {
    let cyberImmortal = 0; // >= 30
    let neonVeteran = 0;   // 15 - 29
    let streetFighter = 0; // 5 - 14
    let rookie = 0;        // < 5

    for (const data of this.members.values()) {
      const s = data.score;
      if (s >= 30) cyberImmortal++;
      else if (s >= 15) neonVeteran++;
      else if (s >= 5) streetFighter++;
      else rookie++;
    }

    return {
      cyberImmortal,
      neonVeteran,
      streetFighter,
      rookie,
      totalAthletes: this.members.size,
    };
  }

  /**
   * Clears all leaderboard members.
   */
  clear() {
    const size = this.members.size;
    this.members.clear();
    return size;
  }
}

export const leaderboardEngine = new RedisLeaderboardEngine();
