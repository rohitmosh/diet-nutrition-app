// dietController.js
const db = require('../config/db');

// Hardcoded diet plans data for demonstration
const hardcodedDietPlans = [
  { DietPlanID: 1, PlanName: 'Fiber Boost', Description: 'High Fiber Diet', UserID: 1, NutritionalGoal: 'High Fiber' },
  { DietPlanID: 2, PlanName: 'Muscle Gain', Description: 'Protein Rich Plan', UserID: 2, NutritionalGoal: 'High Protein' },
  { DietPlanID: 3, PlanName: 'Vitamin Packed', Description: 'Vitamin Loaded', UserID: 3, NutritionalGoal: 'Vitamins' },
  { DietPlanID: 4, PlanName: 'Low Carb Cut', Description: 'Cut Carbs Diet', UserID: 1, NutritionalGoal: 'Low Carb' },
  { DietPlanID: 5, PlanName: 'Weight Loss', Description: 'Low Fat Focused', UserID: 2, NutritionalGoal: 'Low Fat' },
  { DietPlanID: 6, PlanName: 'Gut Health', Description: 'Probiotic Focused', UserID: 1, NutritionalGoal: 'Probiotic' },
  { DietPlanID: 7, PlanName: 'Balanced Plan', Description: 'Everyday Balance', UserID: 5, NutritionalGoal: 'Balanced' }
];

// Get all available nutritional goals
exports.getNutritionalGoals = async (req, res) => {
  try {
    // For demonstration: Use hardcoded data instead of database
    const goals = [...new Set(hardcodedDietPlans.map(plan => plan.NutritionalGoal))];
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching nutritional goals:', error);
    res.status(500).json({ message: 'Failed to fetch nutritional goals' });
  }
};

// Hardcoded user goals for demonstration
let userGoals = {};

// Get user's current goal
exports.getUserGoal = async (req, res) => {
  const userId = req.user.id;

  try {
    // For demonstration: Use hardcoded data instead of database
    const userGoal = userGoals[userId] || null;
    res.status(200).json(userGoal);
  } catch (error) {
    console.error('Error fetching user goal:', error);
    res.status(500).json({ message: 'Failed to fetch user goal' });
  }
};

// Save user's nutritional goal
exports.saveUserGoal = async (req, res) => {
  const userId = req.user.id;
  const { nutritionalGoal, exerciseLevel } = req.body;

  try {
    // Calculate daily calorie limit based on exercise level
    let dailyCalorieLimit;
    switch (exerciseLevel) {
      case 'Low':
        dailyCalorieLimit = 1800;
        break;
      case 'Medium':
        dailyCalorieLimit = 2200;
        break;
      case 'High':
        dailyCalorieLimit = 2600;
        break;
      default:
        dailyCalorieLimit = 2000;
    }

    // For demonstration: Save to hardcoded data instead of database
    const goalId = Date.now(); // Use timestamp as unique ID
    userGoals[userId] = {
      GoalID: goalId,
      NutritionalGoal: nutritionalGoal,
      DailyCalorieLimit: dailyCalorieLimit,
      ExerciseLevel: exerciseLevel
    };

    console.log('Demo: Saved user goal:', userGoals[userId]);

    res.status(201).json({
      goalId,
      userId,
      dailyCalorieLimit,
      nutritionalGoal,
      exerciseLevel
    });
  } catch (error) {
    console.error('Error saving user goal:', error);
    res.status(500).json({ message: 'Failed to save user goal' });
  }
};

// Hardcoded meals data (from mealRoutes.js)
const hardcodedMeals = [
  { MealID: 1, MealName: 'Oats Bowl', Calories: 250, NutritionalValue: 'High Fiber', Type: 'Veg' },
  { MealID: 2, MealName: 'Grilled Chicken', Calories: 400, NutritionalValue: 'High Protein', Type: 'Non-Veg' },
  { MealID: 3, MealName: 'Fruit Salad', Calories: 180, NutritionalValue: 'Vitamins', Type: 'Veg' },
  { MealID: 4, MealName: 'Veg Sandwich', Calories: 300, NutritionalValue: 'Balanced', Type: 'Veg' },
  { MealID: 5, MealName: 'Paneer Wrap', Calories: 350, NutritionalValue: 'Protein Rich', Type: 'Veg' },
  { MealID: 6, MealName: 'Smoothie', Calories: 220, NutritionalValue: 'Fruit Boost', Type: 'Veg' },
  { MealID: 7, MealName: 'Boiled Eggs', Calories: 150, NutritionalValue: 'Protein', Type: 'Non-Veg' },
  { MealID: 8, MealName: 'Rice & Dal', Calories: 450, NutritionalValue: 'Balanced', Type: 'Veg' },
  { MealID: 9, MealName: 'Quinoa Salad', Calories: 320, NutritionalValue: 'Low Carb', Type: 'Veg' },
  { MealID: 10, MealName: 'Tofu Stir Fry', Calories: 280, NutritionalValue: 'Low Fat', Type: 'Veg' },
  { MealID: 11, MealName: 'Chicken Caesar', Calories: 390, NutritionalValue: 'Low Carb', Type: 'Non-Veg' },
  { MealID: 12, MealName: 'Greek Yogurt', Calories: 120, NutritionalValue: 'Probiotic', Type: 'Veg' },
  { MealID: 13, MealName: 'Tuna Salad', Calories: 350, NutritionalValue: 'High Protein', Type: 'Non-Veg' },
  { MealID: 14, MealName: 'Lentil Soup', Calories: 230, NutritionalValue: 'High Fiber', Type: 'Veg' },
  { MealID: 15, MealName: 'Avocado Toast', Calories: 310, NutritionalValue: 'Healthy Fat', Type: 'Veg' },
  { MealID: 16, MealName: 'Spinach Omelette', Calories: 200, NutritionalValue: 'Iron Rich', Type: 'Non-Veg' },
  { MealID: 17, MealName: 'Protein Shake', Calories: 180, NutritionalValue: 'Protein', Type: 'Veg' },
  { MealID: 18, MealName: 'Chickpea Bowl', Calories: 330, NutritionalValue: 'Protein Rich', Type: 'Veg' },
  { MealID: 19, MealName: 'Grilled Fish', Calories: 370, NutritionalValue: 'Omega 3', Type: 'Non-Veg' },
  { MealID: 20, MealName: 'Veggie Wrap', Calories: 290, NutritionalValue: 'Balanced', Type: 'Veg' }
];

// Get recommended meals based on nutritional goal and exercise level
exports.getRecommendedMeals = async (req, res) => {
  const { nutritionalGoal, exerciseLevel } = req.query;

  try {
    // For demonstration: Generate different meal plans based on goal and exercise level
    let filteredMeals = [];

    // Filter meals based on nutritional goal
    switch (nutritionalGoal) {
      case 'High Fiber':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('High Fiber') ||
          meal.NutritionalValue.includes('Balanced') ||
          meal.MealName.includes('Oats') ||
          meal.MealName.includes('Lentil')
        );
        break;

      case 'High Protein':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('High Protein') ||
          meal.NutritionalValue.includes('Protein') ||
          meal.Type === 'Non-Veg' ||
          meal.MealName.includes('Protein')
        );
        break;

      case 'Vitamins':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('Vitamins') ||
          meal.NutritionalValue.includes('Fruit') ||
          meal.NutritionalValue.includes('Iron') ||
          meal.MealName.includes('Fruit') ||
          meal.MealName.includes('Smoothie')
        );
        break;

      case 'Low Carb':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('Low Carb') ||
          meal.NutritionalValue.includes('Protein') ||
          meal.Calories <= 300
        );
        break;

      case 'Low Fat':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('Low Fat') ||
          meal.NutritionalValue.includes('Low Carb') ||
          meal.Calories <= 250
        );
        break;

      case 'Probiotic':
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('Probiotic') ||
          meal.NutritionalValue.includes('Balanced') ||
          meal.MealName.includes('Yogurt') ||
          meal.Type === 'Veg'
        );
        break;

      case 'Balanced':
      default:
        filteredMeals = hardcodedMeals.filter(meal =>
          meal.NutritionalValue.includes('Balanced') ||
          meal.Calories >= 200 && meal.Calories <= 400
        );
        break;
    }

    // Further filter based on exercise level
    switch (exerciseLevel) {
      case 'Low':
        // Lower calorie meals for low exercise
        filteredMeals = filteredMeals.filter(meal => meal.Calories <= 300);
        break;
      case 'Medium':
        // Moderate calorie meals for medium exercise
        filteredMeals = filteredMeals.filter(meal => meal.Calories >= 200 && meal.Calories <= 400);
        break;
      case 'High':
        // Higher calorie meals for high exercise
        filteredMeals = filteredMeals.filter(meal => meal.Calories >= 350);
        break;
      default:
        // No additional filtering for default case
        break;
    }

    // Ensure we have at least some meals, fallback to balanced meals if filter is too restrictive
    if (filteredMeals.length < 3) {
      filteredMeals = hardcodedMeals.filter(meal =>
        meal.NutritionalValue.includes('Balanced') ||
        meal.Calories >= 200 && meal.Calories <= 400
      ).slice(0, 6);
    }

    // Format the response to match expected structure
    const recommendedMeals = filteredMeals.slice(0, 8).map(meal => ({
      mealId: meal.MealID,
      mealName: meal.MealName,
      calories: meal.Calories,
      nutritionalValue: meal.NutritionalValue,
      type: meal.Type
    }));

    res.status(200).json(recommendedMeals);
  } catch (error) {
    console.error('Error fetching recommended meals:', error);
    res.status(500).json({ message: 'Failed to fetch recommended meals' });
  }
};