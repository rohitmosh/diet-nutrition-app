// dietController.js
const db = require('../config/db');

// Get all available nutritional goals
exports.getNutritionalGoals = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT DISTINCT NutritionalGoal FROM dietplans');
    const goals = rows.map(row => row.NutritionalGoal);
    res.status(200).json(goals);
  } catch (error) {
    console.error('Error fetching nutritional goals:', error);
    res.status(500).json({ message: 'Failed to fetch nutritional goals' });
  }
};

// Get user's current goal
exports.getUserGoal = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const [rows] = await db.execute(
      'SELECT GoalID, NutritionalGoal, DailyCalorieLimit FROM usergoals WHERE UserID = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(200).json(null);
    }
    
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching user goal:', error);
    res.status(500).json({ message: 'Failed to fetch user goal' });
  }
};

// Save user's nutritional goal
exports.saveUserGoal = async (req, res) => {
  const userId = req.user.id;
  const { nutritionalGoal, exerciseLevel } = req.body;
  
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
  
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // Check if user already has a goal
    const [existingGoals] = await connection.execute(
      'SELECT GoalID FROM usergoals WHERE UserID = ?',
      [userId]
    );
    
    if (existingGoals.length > 0) {
      // Delete existing goal
      await connection.execute(
        'DELETE FROM usergoals WHERE UserID = ?',
        [userId]
      );
    }
    
    // Insert new goal
    const [result] = await connection.execute(
      'INSERT INTO usergoals (UserID, DailyCalorieLimit, NutritionalGoal) VALUES (?, ?, ?)',
      [userId, dailyCalorieLimit, nutritionalGoal]
    );
    
    await connection.commit();
    
    res.status(201).json({
      goalId: result.insertId,
      userId,
      dailyCalorieLimit,
      nutritionalGoal,
      exerciseLevel
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving user goal:', error);
    res.status(500).json({ message: 'Failed to save user goal' });
  } finally {
    connection.release();
  }
};

// Get recommended meals based on nutritional goal and exercise level
exports.getRecommendedMeals = async (req, res) => {
  const { nutritionalGoal, exerciseLevel } = req.query;
  
  try {
    // Get diet plan for the nutritional goal
    const [dietPlans] = await db.execute(
      'SELECT DietPlanID FROM dietplans WHERE NutritionalGoal = ?',
      [nutritionalGoal]
    );
    
    if (dietPlans.length === 0) {
      return res.status(404).json({ message: 'No diet plan found for this nutritional goal' });
    }
    
    const dietPlanId = dietPlans[0].DietPlanID;
    
    // Get meals associated with this diet plan
    let calorieThreshold;
    switch (exerciseLevel) {
      case 'Low':
        calorieThreshold = 300;
        break;
      case 'Medium':
        calorieThreshold = 400;
        break;
      case 'High':
        calorieThreshold = 500;
        break;
      default:
        calorieThreshold = 400;
    }
    
    // Query that joins dietplanmeals with meals and filters based on exercise level
    const [meals] = await db.execute(
      `SELECT m.MealID as mealId, m.MealName as mealName, m.Calories as calories, 
              m.NutritionalValue as nutritionalValue, m.Type as type
       FROM dietplanmeals dpm
       JOIN meals m ON dpm.MealID = m.MealID
       WHERE dpm.DietPlanID = ? AND 
             CASE 
                WHEN ? = 'High' THEN m.Calories >= 400
                WHEN ? = 'Medium' THEN m.Calories BETWEEN 200 AND 400
                ELSE m.Calories <= 300
             END
       ORDER BY m.MealName`,
      [dietPlanId, exerciseLevel, exerciseLevel]
    );
    
    res.status(200).json(meals);
  } catch (error) {
    console.error('Error fetching recommended meals:', error);
    res.status(500).json({ message: 'Failed to fetch recommended meals' });
  }
};