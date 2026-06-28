const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Login admin user
// @route   POST /api/auth/login
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
          success: false,
          message: 'Database unavailable. Please try again later.',
        });
      }

      const { email, password } = req.body;

      // Check user exists with timeout
      const user = await User.findOne({ email }).select('+password').timeout(3000);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      const token = user.getSignedJwtToken();

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
    }
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(401).json({ success: false, message: 'Database unavailable' });
    }

    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
router.put(
  '/updatepassword',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('+password');
      const isMatch = await user.matchPassword(req.body.currentPassword);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      user.password = req.body.newPassword;
      await user.save();

      const token = user.getSignedJwtToken();
      res.json({ success: true, token, message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @desc    Create new admin user (admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
router.post(
  '/register',
  protect,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('role').isIn(['admin', 'editor']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;
      const user = await User.create({ name, email, password, role });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

module.exports = router;
