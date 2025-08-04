const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Hardcoded meals data for demonstration
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

// Get all available meals
router.get('/meals', protect, async (req, res) => {
  try {
    // For demonstration: Use hardcoded data instead of database
    res.json({ success: true, data: hardcodedMeals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch meals' });
  }
});

// Get user's daily calorie limit
router.get('/dailylimit', protect, async (req, res) => {
  try {
    // For demonstration: Use hardcoded daily calorie limit
    const dailyLimit = 2000; // Default daily calorie limit for demo
    res.json({ success: true, data: { dailyLimit } });
  } catch (error) {
    console.error('Error fetching daily limit:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch daily limit' });
  }
});

// Log a meal
router.post('/log', protect, async (req, res) => {
  try {
    const { mealId, mealType, date } = req.body;
    const userId = req.user.id;
    
    // Get meal calorie information
    const [mealInfo] = await db.query('SELECT Calories, NutritionalValue, Type FROM meals WHERE MealID = ?', [mealId]);
    
    if (mealInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    
    // Insert the meal log
    await db.query(
      'INSERT INTO meallogs (UserID, MealID, Date, MealType, CalorieIntake) VALUES (?, ?, ?, ?, ?)',
      [userId, mealId, date, mealType, mealInfo[0].Calories]
    );
    
    // Get user's total calories for the day
    const [dailyTotal] = await db.query(
      'SELECT SUM(CalorieIntake) as totalCalories FROM meallogs WHERE UserID = ? AND Date = ?',
      [userId, date]
    );
    
    // Get user's daily calorie limit
    const [userGoals] = await db.query(
      'SELECT DailyCalorieLimit, NutritionalGoal FROM usergoals WHERE UserID = ?',
      [userId]
    );
    
    const dailyLimit = userGoals.length > 0 ? userGoals[0].DailyCalorieLimit : 2000; // Default if not set
    const userNutritionalGoal = userGoals.length > 0 ? userGoals[0].NutritionalGoal : null;
    
    // Prepare response with warnings if needed
    const response = {
      success: true,
      data: {
        mealLogged: true,
        totalCalories: dailyTotal[0].totalCalories || 0,
        dailyLimit
      }
    };
    
    // Check if daily limit is exceeded
    if (dailyTotal[0].totalCalories > dailyLimit) {
      response.warnings = {
        calorieLimit: `Warning: You've exceeded your daily calorie limit of ${dailyLimit} calories.`
      };
    }
    
    // Check for nutritional value mismatch if user has a goal
    if (userNutritionalGoal && mealInfo[0].Type !== userNutritionalGoal) {
      if (!response.warnings) response.warnings = {};
      response.warnings.nutritionalMismatch = `Warning: This meal (${mealInfo[0].Type}) doesn't match your nutritional preference (${userNutritionalGoal}).`;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ success: false, message: 'Failed to log meal' });
  }
});

// Get logged meals for a specific date
router.get('/logs/:date', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.params.date;
    
    // Get all logged meals for the date with meal details
    const [logs] = await db.query(
      `SELECT ml.MealLogID, ml.Date, ml.MealType, ml.CalorieIntake, 
              m.MealName, m.NutritionalValue, m.Type
       FROM meallogs ml
       JOIN meals m ON ml.MealID = m.MealID
       WHERE ml.UserID = ? AND ml.Date = ?
       ORDER BY ml.MealType`,
      [userId, date]
    );
    
    // Get total calories for the day
    const [total] = await db.query(
      'SELECT SUM(CalorieIntake) as totalCalories FROM meallogs WHERE UserID = ? AND Date = ?',
      [userId, date]
    );
    
    res.json({
      success: true,
      data: {
        logs,
        totalCalories: total[0].totalCalories || 0
      }
    });
  } catch (error) {
    console.error('Error fetching meal logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch meal logs' });
  }
});

// Delete a meal log
router.delete('/log/:id', protect, async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.id;
    
    // Verify the log belongs to the user
    const [log] = await db.query(
      'SELECT Date FROM meallogs WHERE MealLogID = ? AND UserID = ?',
      [logId, userId]
    );
    
    if (log.length === 0) {
      return res.status(404).json({ success: false, message: 'Meal log not found or unauthorized' });
    }
    
    // Delete the log
    await db.query('DELETE FROM meallogs WHERE MealLogID = ?', [logId]);
    
    // Get new total calories for the day
    const [total] = await db.query(
      'SELECT SUM(CalorieIntake) as totalCalories FROM meallogs WHERE UserID = ? AND Date = ?',
      [userId, log[0].Date]
    );
    
    res.json({
      success: true,
      data: {
        deleted: true,
        totalCalories: total[0].totalCalories || 0
      }
    });
  } catch (error) {
    console.error('Error deleting meal log:', error);
    res.status(500).json({ success: false, message: 'Failed to delete meal log' });
  }
});

module.exports = router;