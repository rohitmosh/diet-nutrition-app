const express = require('express');
const router = express.Router();
const exerciseModel = require('../models/exerciseModel');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply middleware to all routes - only authenticated patients can access
router.use(protect, authorize('patient'));

// GET /api/exercises - Get all exercise logs for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const filterType = req.query.filter || 'all'; // Default to 'all' if not specified
    
    let exercises;
    if (filterType === 'all') {
      exercises = await exerciseModel.getUserExerciseLogs(userId);
    } else {
      exercises = await exerciseModel.getFilteredExerciseLogs(userId, filterType);
    }
    
    // Calculate total calories burned
    const totalCalories = await exerciseModel.getTotalCaloriesBurned(userId, filterType);
    
    res.status(200).json({
      success: true,
      exercises,
      totalCalories
    });
  } catch (error) {
    console.error('Error fetching exercise logs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exercise logs'
    });
  }
});

// POST /api/exercises - Add a new exercise log
router.post('/', async (req, res) => {
  try {
    const { ActivityType, Duration, Date, CaloriesBurned } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!ActivityType || !Duration || !Date || !CaloriesBurned) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Add exercise log
    const exerciseData = {
      userId,
      activityType: ActivityType,
      duration: Duration,
      date: Date,
      caloriesBurned: CaloriesBurned
    };
    
    const logId = await exerciseModel.addExerciseLog(exerciseData);
    
    res.status(201).json({
      success: true,
      message: 'Exercise logged successfully',
      exerciseLogId: logId
    });
  } catch (error) {
    console.error('Error logging exercise:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging exercise'
    });
  }
});

// DELETE /api/exercises/:id - Delete an exercise log
router.delete('/:id', async (req, res) => {
  try {
    const logId = req.params.id;
    const userId = req.user.id;
    
    const success = await exerciseModel.deleteExerciseLog(logId, userId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Exercise log not found or you do not have permission to delete it'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Exercise log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exercise log:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting exercise log'
    });
  }
});

module.exports = router;