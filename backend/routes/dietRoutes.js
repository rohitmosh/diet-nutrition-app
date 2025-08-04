// dietRoutes.js
const express = require('express');
const router = express.Router();
const dietController = require('../models/dietController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Get available nutritional goals
router.get('/nutritional-goals', dietController.getNutritionalGoals);

// Get user's current goal
router.get('/user-goal', dietController.getUserGoal);

// Save user's nutritional goal
router.post('/user-goal', dietController.saveUserGoal);

// Get recommended meals based on goal and exercise level
router.get('/recommended-meals', dietController.getRecommendedMeals);

module.exports = router;