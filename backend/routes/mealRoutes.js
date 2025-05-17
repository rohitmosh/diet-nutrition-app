const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Get all available meals
router.get('/meals', protect, async (req, res) => {
  try {
    const [meals] = await db.query('SELECT * FROM meals ORDER BY MealName');
    res.json({ success: true, data: meals });
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch meals' });
  }
});

// Get user's daily calorie limit
router.get('/dailylimit', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const [goals] = await db.query(
      'SELECT DailyCalorieLimit FROM usergoals WHERE UserID = ?',
      [userId]
    );
    
    if (goals.length === 0) {
      return res.json({ success: true, data: { dailyLimit: 2000 } }); // Default value
    }
    
    res.json({ success: true, data: { dailyLimit: goals[0].DailyCalorieLimit } });
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