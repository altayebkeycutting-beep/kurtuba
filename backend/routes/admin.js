const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [blogs, publishedBlogs, services, contacts, newContacts, gallery, users] =
      await Promise.all([
        Blog.countDocuments(),
        Blog.countDocuments({ status: 'published' }),
        Service.countDocuments({ isActive: true }),
        Contact.countDocuments(),
        Contact.countDocuments({ status: 'new' }),
        Gallery.countDocuments({ isActive: true }),
        User.countDocuments(),
      ]);

    // Blog views in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentViews = await Blog.aggregate([
      { $match: { status: 'published', publishedAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    // Top 5 blogs by views
    const topBlogs = await Blog.find({ status: 'published' })
      .select('title slug views publishedAt')
      .sort({ views: -1 })
      .limit(5);

    // Recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email service status createdAt');

    // Blog posts per month (last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const blogsByMonth = await Blog.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalBlogs: blogs,
          publishedBlogs,
          draftBlogs: blogs - publishedBlogs,
          totalServices: services,
          totalContacts: contacts,
          newContacts,
          galleryImages: gallery,
          totalUsers: users,
          recentViews: recentViews[0]?.totalViews || 0,
        },
        topBlogs,
        recentContacts,
        blogsByMonth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
router.put('/users/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate yourself' });
    }
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
