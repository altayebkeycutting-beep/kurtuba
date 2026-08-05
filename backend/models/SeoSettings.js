const mongoose = require('mongoose');

const SeoSettingsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ['home', 'services', 'blog', 'contact', 'about', 'gallery', 'global'],
    },
    metaTitle: {
      type: String,
      maxlength: [70, 'Meta title cannot exceed 70 characters'],
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    keywords: [{ type: String }],
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
    // Global settings
    globalSettings: {
      siteName: { type: String, default: 'KeyShop UAE - Key Duplication Experts' },
      siteDescription: { type: String },
      googleAnalyticsId: { type: String },
      googleVerification: { type: String },
      bingVerification: { type: String },
      facebookPixelId: { type: String },
      robotsTxt: { type: String },
      // Schema.org Local Business
      businessSchema: {
        name: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        openingHours: [{ type: String }],
        priceRange: { type: String, default: '$' },
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SeoSettings', SeoSettingsSchema);
