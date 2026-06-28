const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const { protect, adminOnly } = require('../middleware/auth');
const slugify = require('slugify');

// @desc    Get all published blogs (public)
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: 0,
        total: 0,
        pages: 0,
        currentPage: 1,
        data: [],
        message: 'Database connection unavailable',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = { status: 'published' };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .select('-content')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs,
    });
  } catch (error) {
    console.error('Blog fetch error:', error.message);
    res.json({
      success: true,
      count: 0,
      total: 0,
      pages: 0,
      currentPage: 1,
      data: [],
      message: 'Unable to fetch blogs',
    });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// @desc    Get single blog by slug (public)
// @route   GET /api/blogs/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const related = await Blog.find({
      status: 'published',
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .select('title slug excerpt featuredImage publishedAt readTime category')
      .limit(3);

    res.json({ success: true, data: blog, related });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Blog not found' });
  }
});

// @desc    Get all blogs (admin)
// @route   GET /api/admin/blogs
// @access  Private/Admin
router.get('/admin/all', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .populate('author', 'name')
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get single blog for admin edit
// @route   GET /api/blogs/edit/:id
// @access  Private
router.get('/edit/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    req.body.author = req.user.id;

    // Ensure unique slug
    let slug = slugify(req.body.title, { lower: true, strict: true });
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    req.body.slug = slug;

    const blog = await Blog.create(req.body);
    await blog.populate('author', 'name');

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('author', 'name');

    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get blog categories with counts
// @route   GET /api/blogs/meta/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
