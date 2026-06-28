const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const { protect, adminOnly } = require('../middleware/auth');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

// @desc    Get active gallery images (public)
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let query = { isActive: true };
    if (category) query.category = category;

    const images = await Gallery.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get featured gallery images
// @route   GET /api/gallery/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] });
    }
    const images = await Gallery.find({ isActive: true, isFeatured: true })
      .sort({ sortOrder: 1 })
      .limit(8);
    res.json({ success: true, data: images });
  } catch (error) {
    console.error('Featured gallery error:', error.message);
    res.json({ success: true, data: [] });
  }
});

// @desc    Get all gallery (admin)
// @route   GET /api/gallery/admin/all
// @access  Private
router.get('/admin/all', protect, async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Upload gallery image
// @route   POST /api/gallery
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    const gallery = await Gallery.create({
      ...req.body,
      imageUrl,
      thumbnailUrl: imageUrl,
    });

    res.status(201).json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', gallery.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await gallery.deleteOne();
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
