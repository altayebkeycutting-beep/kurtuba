require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length) {
  console.error('❌ Missing required environment variables:', missingEnv.join(', '));
  process.exit(1);
}

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/auth');
const { bootstrapAppData } = require('./utils/bootstrap');
const User = require('./models/User');
const Blog = require('./models/Blog');

// Route imports
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const serviceRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const galleryRoutes = require('./routes/gallery');
const seoRoutes = require('./routes/seo');
const adminRoutes = require('./routes/admin');
const sitemapRoutes = require('./routes/sitemap');

// Connect to MongoDB
connectDB()
  .then(async () => {
    try {
      await bootstrapAppData({ User, Blog });
    } catch (bootstrapError) {
      console.error('Bootstrap warning:', bootstrapError.message);
    }
  })
  .catch((err) => {
    console.error('Database connection failed during startup:', err.message);
  });

const app = express();
app.set('trust proxy', 1);

// ── Security Middleware ────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// ── CORS Configuration ────────────────────────────────────────────────────
const rawOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGINS,
].filter(Boolean);

const allowedOrigins = rawOrigins
  .flatMap((origin) => origin.split?.(',')?.map((item) => item.trim()).filter(Boolean) || [origin])
  .map((origin) => origin.replace(/\/?$/, ''));

const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');

console.log('✔️ CORS allowed origins:', allowedOrigins.join(', '));

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin?.replace(/\/?$/, '');
    if (!origin || isLocalOrigin(origin) || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── General Rate Limiting ──────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', generalLimiter);

// ── Body Parsers ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Logging ───────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Static Files (Uploads) ────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Sitemap & SEO Routes (no /api prefix) ─────────────────────────────────
app.use('/', sitemapRoutes);

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'KeyShop API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Error Handler ─────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API Base: http://localhost:${PORT}/api`);
  console.log(`🗺️  Sitemap: http://localhost:${PORT}/sitemap.xml`);
  console.log(`🤖 Robots: http://localhost:${PORT}/robots.txt\n`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;