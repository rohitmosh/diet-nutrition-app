const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const { protect, authorize } = require('../middleware/authMiddleware');
const db = require('../config/db');
// All routes here are protected and require patient role
router.use(protect, authorize('patient'));

// GET /api/patient/profile - Get patient profile
router.get('/profile', async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        height: user.Height,
        weight: user.Weight
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patient profile'
    });
  }
});

// PUT /api/patient/profile - Update patient profile
router.put('/profile', async (req, res) => {
  try {
    const { height, weight } = req.body;
    
    // Basic validation
    if (height <= 0 || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid height and weight values'
      });
    }
    
    // Update user's height and weight in database
    await userModel.updateUserHealthProfile(req.user.id, height, weight);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        height,
        weight
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating patient profile'
    });
  }
});

module.exports = router;