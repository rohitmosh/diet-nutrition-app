const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here are protected and require admin role
router.use(protect, authorize('admin'));

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

// POST /api/admin/users - Add a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, height, weight } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, password and role' 
      });
    }
    
    const userId = await userModel.addUser(
      { name, email, height, weight },
      { email, password, role }
    );
    
    res.status(201).json({
      success: true,
      message: 'User added successfully',
      userId
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Server error adding user' });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await userModel.deleteUser(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
});

module.exports = router;
