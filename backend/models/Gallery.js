const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required for SEO'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Workshop', 'Keys', 'Equipment', 'Team', 'Before-After', 'General'],
      default: 'General',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Gallery', GallerySchema);
