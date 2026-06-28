const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: 0, data: [] });
    }
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get featured services
// @route   GET /api/services/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] });
    }
    const services = await Service.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .limit(6);
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Featured services error:', error.message);
    res.json({ success: true, data: [] });
  }
});

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all services (admin)
// @route   GET /api/services/admin/all
// @access  Private
router.get('/admin/all', protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
