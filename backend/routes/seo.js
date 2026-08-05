const express = require('express');
const router = express.Router();
const SeoSettings = require('../models/SeoSettings');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get SEO settings for a page
// @route   GET /api/seo/:page
// @access  Public
router.get('/:page', async (req, res) => {
  try {
    const settings = await SeoSettings.findOne({ page: req.params.page });
    if (!settings) {
      return res.status(404).json({ success: false, message: 'SEO settings not found' });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all SEO settings
// @route   GET /api/seo
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await SeoSettings.find();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create or update SEO settings
// @route   PUT /api/seo/:page
// @access  Private/Admin
router.put('/:page', protect, adminOnly, async (req, res) => {
  try {
    const settings = await SeoSettings.findOneAndUpdate(
      { page: req.params.page },
      { page: req.params.page, ...req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

module.exports = router;
