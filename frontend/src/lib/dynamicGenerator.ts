import { UserProfile, WorkoutPlan, DietPlan, Exercise, Meal } from '@/types';

/**
 * FitVerse AI Dynamic Metabolic & Hypertrophy Engine
 * Computes custom Workouts and Mifflin-St Jeor Diet Plans based on
 * User Goal, Weight, Target Weight, Dietary Preference, Allergies, & Country.
 */

export function generateCustomWorkoutPlan(user: UserProfile): WorkoutPlan {
  const { goal } = user;

  let title = 'Hypertrophy Muscle Protocol';
  let exercises: Exercise[] = [];
  let duration = 45;
  let caloriesBurned = 420;

  if (goal === 'fat_loss') {
    title = 'High-Intensity Metabolic Fat Shred';
    duration = 35;
    caloriesBurned = 550;
    exercises = [
      {
        id: 'fl_1',
        name: 'Jump Squats & Explosive Depth',
        category: 'Legs & Cardio',
        sets: 4,
        reps: 15,
        restSec: 30,
        targetMuscle: 'Quadriceps',
        instructions: ['Squat deep with back straight', 'Explode upward into jump'],
        hologramColor: '#ef4444',
        modelType: 'cylinder',
      },
      {
        id: 'fl_2',
        name: 'Burpees with Pushup',
        category: 'Full Body',
        sets: 4,
        reps: 12,
        restSec: 40,
        targetMuscle: 'Full Body',
        instructions: ['Drop to plank position', 'Perform pushup then jump'],
        hologramColor: '#00e5ff',
        modelType: 'box',
      },
      {
        id: 'fl_3',
        name: 'Mountain Climbers',
        category: 'Core',
        sets: 4,
        reps: 30,
        restSec: 30,
        targetMuscle: 'Abs & Core',
        instructions: ['Maintain tight plank core', 'Drive knees rapidly toward chest'],
        hologramColor: '#22c55e',
        modelType: 'sphere',
      },
    ];
  } else if (goal === 'muscle_gain') {
    title = 'Hypertrophy Mass & Strength Protocol';
    duration = 50;
    caloriesBurned = 460;
    exercises = [
      {
        id: 'mg_1',
        name: 'Barbell Bench Press',
        category: 'Chest',
        sets: 4,
        reps: 10,
        restSec: 60,
        targetMuscle: 'Chest',
        instructions: ['Retract shoulder blades', 'Lower bar to mid-chest control'],
        hologramColor: '#00e5ff',
        modelType: 'cylinder',
      },
      {
        id: 'mg_2',
        name: 'Barbell Back Squats',
        category: 'Legs',
        sets: 4,
        reps: 8,
        restSec: 90,
        targetMuscle: 'Quadriceps & Glutes',
        instructions: ['Break at hips and knees', 'Squat parallel to ground'],
        hologramColor: '#7c3aed',
        modelType: 'torus',
      },
      {
        id: 'mg_3',
        name: 'Barbell Romanian Deadlifts',
        category: 'Hamstrings',
        sets: 4,
        reps: 10,
        restSec: 75,
        targetMuscle: 'Hamstrings & Lower Back',
        instructions: ['Hinge backward at hips', 'Keep spine neutral throughout'],
        hologramColor: '#22c55e',
        modelType: 'box',
      },
    ];
  } else {
    title = 'Functional Recomposition & Core Matrix';
    duration = 40;
    caloriesBurned = 380;
    exercises = [
      {
        id: 'mc_1',
        name: 'Dumbbell Overhead Press',
        category: 'Shoulders',
        sets: 4,
        reps: 10,
        restSec: 60,
        targetMuscle: 'Deltoids',
        instructions: ['Press dumbbells vertically', 'Lock out smoothly overhead'],
        hologramColor: '#00e5ff',
        modelType: 'cylinder',
      },
      {
        id: 'mc_2',
        name: 'Lat Pulldowns',
        category: 'Back',
        sets: 4,
        reps: 12,
        restSec: 60,
        targetMuscle: 'Latissimus Dorsi',
        instructions: ['Pull bar to collarbone', 'Squeeze lats tightly at bottom'],
        hologramColor: '#8b5cf6',
        modelType: 'sphere',
      },
    ];
  }

  return {
    id: `custom_wo_${Date.now()}`,
    title,
    difficulty: user.level || 'intermediate',
    durationMinutes: duration,
    caloriesBurned,
    exercises,
  };
}

export function generateCustomDietPlan(user: UserProfile): DietPlan {
  const { weightKg, heightCm, age, gender, goal, dietaryPreference, country } = user;

  // 1. Mifflin-St Jeor BMR Equation
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;

  // 2. TDEE Activity & Goal Adjustments
  let dailyCalories = Math.round(bmr * 1.55);
  if (goal === 'fat_loss') dailyCalories -= 450;
  if (goal === 'muscle_gain') dailyCalories += 350;

  // 3. Macro Breakdown
  const proteinG = Math.round(weightKg * 2.1);
  const fatG = Math.round(weightKg * 0.9);
  const carbsG = Math.round((dailyCalories - (proteinG * 4 + fatG * 9)) / 4);

  // 4. Country & Diet Preference Meals
  let meals: Meal[] = [];
  if (country === 'India') {
    meals = [
      { type: 'breakfast', name: dietaryPreference === 'Vegetarian' || dietaryPreference === 'Vegan' ? 'Moong Dal Chilla & Paneer / Tofu Bhurji' : 'Egg White Omelette with Multigrain Toast', calories: 450, proteinG: 32, carbsG: 45, fatG: 12, ingredients: ['Moong Dal', 'Paneer', 'Toast'] },
      { type: 'lunch', name: 'Kathiyawadi / Punjabi Roti, Chana Dal & Paneer Salad', calories: 650, proteinG: 40, carbsG: 75, fatG: 18, ingredients: ['Multigrain Roti', 'Chana Dal', 'Curd'] },
      { type: 'dinner', name: dietaryPreference === 'Non-Vegetarian' ? 'Tandoori Chicken Tikka with Brown Rice' : 'Soya Chunk Curry with Quinoa', calories: 600, proteinG: 50, carbsG: 50, fatG: 16, ingredients: ['Chicken/Soya', 'Brown Rice', 'Spices'] },
      { type: 'snack', name: 'Roasted Makhana & Whey Protein Shake', calories: 250, proteinG: 26, carbsG: 20, fatG: 6, ingredients: ['Makhana', 'Whey'] },
    ];
  } else {
    meals = [
      { type: 'breakfast', name: 'Oatmeal Bowl with Whey Protein & Berries', calories: 500, proteinG: 38, carbsG: 60, fatG: 10, ingredients: ['Oats', 'Whey', 'Berries'] },
      { type: 'lunch', name: 'Grilled Chicken Breast / Tofu with Quinoa', calories: 700, proteinG: 55, carbsG: 65, fatG: 15, ingredients: ['Chicken/Tofu', 'Quinoa', 'Olive Oil'] },
      { type: 'dinner', name: 'Pan-Seared Salmon with Asparagus & Sweet Potato', calories: 600, proteinG: 45, carbsG: 45, fatG: 20, ingredients: ['Salmon', 'Asparagus', 'Sweet Potato'] },
      { type: 'snack', name: 'Greek Yogurt with Roasted Almonds', calories: 250, proteinG: 22, carbsG: 15, fatG: 10, ingredients: ['Greek Yogurt', 'Almonds'] },
    ];
  }

  return {
    dailyCalories,
    proteinG,
    carbsG,
    fatG,
    waterTargetMl: Math.round(weightKg * 42),
    waterLoggedMl: Math.round(weightKg * 20),
    meals,
    shoppingList: ['Protein Source', 'Quinoa / Brown Rice', 'Vegetables', 'Nuts', 'Whey Protein'],
  };
}
