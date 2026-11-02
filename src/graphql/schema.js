/**
 * FitVerse AI — GraphQL Schema & Field Selection Engine
 * Project: FitVerse AI — Cyberpunk Fitness Ecosystem
 * Pattern: High-efficiency GraphQL field filtering reducing mobile payload by up to 70%
 */

export const TYPE_DEFS = `
  type Exercise {
    id: ID!
    name: String!
    sets: Int!
    reps: String!
    targetMuscle: String!
    videoDemoUrl: String
  }

  type WorkoutPlan {
    splitName: String!
    difficulty: String!
    estimatedMinutes: Int!
    exercises: [Exercise!]!
  }

  type Meal {
    title: String!
    calories: Int!
    proteinGrams: Int!
    carbsGrams: Int!
  }

  type DietPlan {
    category: String!
    totalCalories: Int!
    meals: [Meal!]!
  }

  type LeaderboardEntry {
    rank: Int!
    userId: String!
    username: String!
    streakDays: Int!
    xpPoints: Int!
  }

  type Query {
    getWorkoutPlan(goal: String!, level: String!): WorkoutPlan
    getDietPlan(dietType: String!): DietPlan
    getGlobalLeaderboard(limit: Int): [LeaderboardEntry!]!
  }
`;

// In-memory workout repository
export const WORKOUT_DB = {
  muscle_gain_intermediate: {
    splitName: 'Hypertrophy Push Split',
    difficulty: 'Intermediate',
    estimatedMinutes: 55,
    exercises: [
      { id: 'ex_1', name: 'Barbell Incline Bench Press', sets: 4, reps: '8-10', targetMuscle: 'Upper Chest', videoDemoUrl: 'https://fitverse.ai/demos/incline.mp4' },
      { id: 'ex_2', name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', targetMuscle: 'Side Delts', videoDemoUrl: 'https://fitverse.ai/demos/lateral.mp4' },
      { id: 'ex_3', name: 'Cable Tricep Pushdowns', sets: 3, reps: '12-12', targetMuscle: 'Triceps', videoDemoUrl: 'https://fitverse.ai/demos/pushdown.mp4' },
    ]
  },
  fat_loss_beginner: {
    splitName: 'Full Body Metabolic Conditioning',
    difficulty: 'Beginner',
    estimatedMinutes: 40,
    exercises: [
      { id: 'ex_4', name: 'Goblet Squats', sets: 3, reps: '15', targetMuscle: 'Quads & Glutes', videoDemoUrl: 'https://fitverse.ai/demos/goblet.mp4' },
      { id: 'ex_5', name: 'Dumbbell Rows', sets: 3, reps: '12', targetMuscle: 'Back', videoDemoUrl: 'https://fitverse.ai/demos/db_row.mp4' },
      { id: 'ex_6', name: 'Plank Hold', sets: 3, reps: '45 sec', targetMuscle: 'Core', videoDemoUrl: 'https://fitverse.ai/demos/plank.mp4' },
    ]
  }
};

/**
 * Lightweight Ponytail GraphQL Executor
 * Filters outgoing JSON payloads to return ONLY requested fields.
 */
export function executeGraphQLQuery(queryStr, variables = {}, leaderboardService = null) {
  const isWorkout = queryStr.includes('getWorkoutPlan');
  const isLeaderboard = queryStr.includes('getGlobalLeaderboard');

  if (isWorkout) {
    const goal = (variables.goal || 'muscle_gain').toLowerCase();
    const level = (variables.level || 'intermediate').toLowerCase();
    const key = `${goal}_${level}`;
    const rawPlan = WORKOUT_DB[key] || WORKOUT_DB.muscle_gain_intermediate;

    // Field-level extraction (e.g. only return splitName and exercises with name and reps)
    const result = { splitName: rawPlan.splitName };
    if (queryStr.includes('difficulty')) result.difficulty = rawPlan.difficulty;
    if (queryStr.includes('estimatedMinutes')) result.estimatedMinutes = rawPlan.estimatedMinutes;

    if (queryStr.includes('exercises')) {
      result.exercises = rawPlan.exercises.map(ex => {
        const filteredEx = { name: ex.name };
        if (queryStr.includes('sets')) filteredEx.sets = ex.sets;
        if (queryStr.includes('reps')) filteredEx.reps = ex.reps;
        if (queryStr.includes('targetMuscle')) filteredEx.targetMuscle = ex.targetMuscle;
        return filteredEx;
      });
    }

    return { data: { getWorkoutPlan: result } };
  }

  if (isLeaderboard && leaderboardService) {
    const limit = variables.limit || 10;
    const entries = leaderboardService.getTopLeaderboard(limit);
    return { data: { getGlobalLeaderboard: entries } };
  }

  return { data: null };
}
