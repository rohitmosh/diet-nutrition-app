const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Hardcoded users for demonstration - only these specific credentials work
const validCredentials = [
  {
    UserID: 1,
    Name: 'AdminOne',
    Email: 'admin@nutritrack.com',
    Password: 'admin123',
    Role: 'admin',
    Height: 175,
    Weight: 70
  },
  {
    UserID: 2,
    Name: 'Rohit',
    Email: 'rohit@nutritrack.com',
    Password: 'patient123',
    Role: 'patient',
    Height: 180,
    Weight: 75
  }
];

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for exact email and password match
    const user = validCredentials.find(u =>
      u.Email.toLowerCase() === email.toLowerCase() &&
      u.Password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email and password.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.UserID,
        email: user.Email,
        role: user.Role
      },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // For demonstration: Use hardcoded data instead of database
    let user = validCredentials.find(u => u.UserID === req.user.id);

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
      message: 'Server error while fetching user profile'
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // For demonstration: Registration is disabled, only predefined users can login
    return res.status(400).json({
      success: false,
      message: 'Registration is currently disabled. Please contact administrator.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};
