# 🔑 KeyShop UAE — Full-Stack MERN Website

> Professional Key Duplication & Locksmith Services Website  
> Built with MongoDB · Express · React · Node.js

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Admin Panel Guide](#admin-panel-guide)
- [SEO Architecture](#seo-architecture)
- [Sitemap URLs](#sitemap-urls)
- [API Reference](#api-reference)
- [Deployment](#deployment)

---

## ✨ Features

### 🌐 User-Facing Website
- **Hero Section** — Animated key graphic, stats bar, dual CTAs
- **Services Section** — Pulls live from database, price display, feature list
- **About Section** — Shop story, trust points, Google Maps link
- **Why Choose Us** — 6 USP cards on dark background
- **Gallery** — Category filter, lightbox, lazy-loaded images
- **Testimonials** — Star ratings, customer reviews
- **Blog Section** — Latest 3 posts preview on homepage
- **Contact Section** — Form with validation + rate limiting + Google Maps embed
- **Footer** — Full links, social icons, schema breadcrumbs

### 📝 Blog System
- Individual SEO-optimized pages per blog (`/blog/[slug]`)
- Rich HTML content support
- Category + tag filtering
- Search functionality
- Related posts sidebar
- View counter
- Read time calculator
- Social share button

### 🔍 SEO Features
- React Helmet Async per-page meta tags
- Open Graph + Twitter Card tags
- JSON-LD structured data (LocalBusiness, Article, BreadcrumbList)
- Geo meta tags (UAE/Ajman)
- Auto-generated XML sitemap index
  - `/sitemap.xml` → index
  - `/sitemap-pages.xml` → static pages
  - `/sitemap-blogs.xml` → **each blog gets its own URL automatically**
  - `/sitemap-services.xml` → service pages
- `/robots.txt` with proper directives
- Canonical URL support
- SEO score checker in blog editor

### 🛠️ Admin Panel
- **Dashboard** — Stats cards, top blogs, recent contacts, quick actions
- **Blog Manager** — Full CRUD, SEO tab per post, status management, slug editor
- **Services Manager** — Card grid, toggle active/featured, price management
- **Gallery Manager** — Drag & drop upload, category filter, lightbox, bulk controls
- **Contacts Inbox** — Status pipeline (new→read→replied→archived), admin notes, email reply
- **SEO Settings** — Per-page meta, Open Graph, SERP preview, LocalBusiness schema, analytics IDs

---

## 🛠 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18 + Vite + React Router v6               |
| Styling   | Tailwind CSS + Custom CSS variables             |
| SEO       | React Helmet Async                              |
| HTTP      | Axios with JWT interceptors                     |
| Backend   | Node.js + Express 4                             |
| Database  | MongoDB + Mongoose                              |
| Auth      | JWT (jsonwebtoken) + bcryptjs                  |
| Security  | Helmet, CORS, express-rate-limit, validation    |
| Uploads   | Multer (local, swappable to S3)                |
| Sitemap   | Custom XML generator (auto-updated)             |

---

## 📁 Project Structure

```
key-shop-website/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT protect, adminOnly, errorHandler
│   ├── models/
│   │   ├── User.js               # Admin users with JWT methods
│   │   ├── Blog.js               # Blog posts with SEO fields
│   │   ├── Service.js            # Key shop services
│   │   ├── Contact.js            # Contact form submissions
│   │   ├── Gallery.js            # Gallery images
│   │   └── SeoSettings.js        # Per-page SEO config
│   ├── routes/
│   │   ├── auth.js               # Login, register, update password
│   │   ├── blogs.js              # Blog CRUD + admin routes
│   │   ├── services.js           # Services CRUD
│   │   ├── contact.js            # Contact form (rate limited)
│   │   ├── gallery.js            # Image upload & management
│   │   ├── seo.js                # SEO settings CRUD
│   │   ├── admin.js              # Dashboard stats, user management
│   │   └── sitemap.js            # XML sitemaps + robots.txt
│   ├── utils/
│   │   └── seed.js               # Database seeder
│   ├── uploads/                  # Uploaded images (gitignored)
│   ├── server.js                 # Express app entry point
│   ├── .env.example              # Environment variable template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── favicon.svg
    ├── src/
    │   ├── api/
    │   │   └── index.js          # Axios instance + all API functions
    │   ├── components/           # Reusable UI components
    │   │   ├── Navbar.jsx        # Sticky nav with mobile menu
    │   │   ├── Hero.jsx          # Landing hero section
    │   │   ├── Services.jsx      # Services grid with API data
    │   │   ├── About.jsx         # About the shop
    │   │   ├── WhyChooseUs.jsx   # USP section (dark background)
    │   │   ├── Gallery.jsx       # Photo gallery with lightbox
    │   │   ├── Testimonials.jsx  # Customer reviews
    │   │   ├── BlogSection.jsx   # Homepage blog preview
    │   │   ├── Contact.jsx       # Contact form + map
    │   │   ├── Footer.jsx        # Site footer
    │   │   └── SEOHead.jsx       # React Helmet wrapper
    │   ├── pages/                # Page-level components
    │   │   ├── Home.jsx          # Full homepage
    │   │   ├── BlogList.jsx      # Blog listing with search/filter/pagination
    │   │   ├── BlogDetail.jsx    # Single blog with Article schema
    │   │   ├── ServicesPage.jsx  # All services page
    │   │   └── NotFound.jsx      # 404 page
    │   ├── admin/                # Admin panel (lazy-loaded)
    │   │   ├── Login.jsx         # Admin login
    │   │   ├── AdminLayout.jsx   # Sidebar + protected route
    │   │   ├── Dashboard.jsx     # Stats + recent activity
    │   │   ├── blogs/
    │   │   │   ├── BlogList.jsx  # Blog management table
    │   │   │   └── BlogForm.jsx  # Create/edit blog + SEO score
    │   │   ├── services/
    │   │   │   ├── ServiceList.jsx
    │   │   │   └── ServiceForm.jsx
    │   │   ├── gallery/
    │   │   │   └── GalleryManager.jsx
    │   │   ├── contacts/
    │   │   │   └── ContactList.jsx
    │   │   └── seo/
    │   │       └── SeoSettings.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # JWT auth state
    │   ├── App.jsx               # Route definitions
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd key-shop-website

# Install all dependencies at once
npm install        # installs concurrently in root
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/keyshop
JWT_SECRET=change_this_to_a_random_64_char_string
JWT_EXPIRE=30d
NODE_ENV=development
SITE_URL=https://www.yourdomain.com
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@keyshop.com
ADMIN_PASSWORD=Admin@123456
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin user (`admin@keyshop.com` / `Admin@123456`)
- ✅ 6 sample services
- ✅ 3 sample blog posts
- ✅ SEO settings for all pages

### 4. Start Development

```bash
# From the root — starts both backend and frontend
npm run dev
```

| Service   | URL                           |
|-----------|-------------------------------|
| Frontend  | http://localhost:3000         |
| Backend   | http://localhost:5000         |
| Admin     | http://localhost:3000/admin   |
| API       | http://localhost:5000/api     |
| Sitemap   | http://localhost:5000/sitemap.xml |
| Robots    | http://localhost:5000/robots.txt  |

---

## 🔐 Environment Variables

| Variable           | Description                                      | Required |
|--------------------|--------------------------------------------------|----------|
| `PORT`             | Backend server port (default: 5000)              | No       |
| `MONGODB_URI`      | MongoDB connection string                        | **Yes**  |
| `JWT_SECRET`       | Secret for signing JWT tokens (min 32 chars)     | **Yes**  |
| `JWT_EXPIRE`       | Token expiry (e.g. `30d`, `7d`)                  | No       |
| `NODE_ENV`         | `development` or `production`                    | No       |
| `SITE_URL`         | Full URL of your site (for sitemap)              | **Yes**  |
| `FRONTEND_URL`     | Frontend URL (for CORS)                          | **Yes**  |
| `ADMIN_EMAIL`      | Seed admin email                                 | No       |
| `ADMIN_PASSWORD`   | Seed admin password                              | No       |

---

## 👨‍💻 Admin Panel Guide

### Accessing Admin

Navigate to `/admin/login` and sign in with your credentials.

### Writing a Blog Post (SEO Best Practice)

1. Go to **Admin → Blog Posts → New Blog Post**
2. **Content tab:** Write title, excerpt (max 500 chars), and HTML content
3. **SEO tab:**
   - Set meta title (50–70 chars)
   - Set meta description (120–160 chars)
   - Add focus keywords (comma-separated)
   - The **SEO Score** (0–100%) shows your optimization level
4. **Media tab:** Add featured image URL and alt text
5. Set **Category** and **Tags** in the sidebar
6. Click **Publish** — the post URL is automatically added to `sitemap-blogs.xml`

### Managing the Sitemap

No manual action needed. The sitemap auto-updates whenever blogs are published:

- `/sitemap.xml` — References all sub-sitemaps
- `/sitemap-blogs.xml` — Auto-lists every published blog's individual URL
- `/sitemap-pages.xml` — Static pages (home, services, blog, contact)
- `/sitemap-services.xml` — Auto-lists every active service

Submit `https://yourdomain.com/sitemap.xml` to Google Search Console.

---

## 🔍 SEO Architecture

### Per-Page SEO
Every page has unique meta tags set via React Helmet Async:
```jsx
<SEOHead
  title="Page Title"
  description="Meta description"
  keywords={['keyword1', 'keyword2']}
  canonical="https://yourdomain.com/page"
  schema={JSON.stringify(schemaObject)}
/>
```

### Structured Data (JSON-LD)
- **Home** → `LocalBusiness` schema (name, address, geo, hours, phone)
- **Blog Detail** → `Article` schema + `BreadcrumbList`
- **Global** → Set business details in Admin → SEO → Global

### Individual Blog Sitemap URLs
Each blog post at `/blog/[slug]` gets its own `<url>` entry in `sitemap-blogs.xml`:
```xml
<url>
  <loc>https://yourdomain.com/blog/how-to-choose-key-duplication-service-uae</loc>
  <lastmod>2025-01-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/login`     | Admin login        |
| GET    | `/api/auth/me`        | Current user       |
| PUT    | `/api/auth/updatepassword` | Change password |

### Blog Posts
| Method | Endpoint               | Auth     | Description         |
|--------|------------------------|----------|---------------------|
| GET    | `/api/blogs`           | Public   | List published blogs |
| GET    | `/api/blogs/:slug`     | Public   | Single blog + related |
| GET    | `/api/blogs/admin/all` | Admin    | All blogs (admin)   |
| GET    | `/api/blogs/edit/:id`  | Admin    | Blog for editing    |
| POST   | `/api/blogs`           | Admin    | Create blog         |
| PUT    | `/api/blogs/:id`       | Admin    | Update blog         |
| DELETE | `/api/blogs/:id`       | Admin    | Delete blog         |

### Services
| Method | Endpoint                  | Auth   | Description        |
|--------|---------------------------|--------|--------------------|
| GET    | `/api/services`           | Public | Active services    |
| GET    | `/api/services/featured`  | Public | Featured services  |
| POST   | `/api/services`           | Admin  | Create service     |
| PUT    | `/api/services/:id`       | Admin  | Update service     |
| DELETE | `/api/services/:id`       | Admin  | Delete service     |

### Sitemaps (Public)
| URL                       | Description             |
|---------------------------|-------------------------|
| `/sitemap.xml`            | Sitemap index           |
| `/sitemap-pages.xml`      | Static pages sitemap    |
| `/sitemap-blogs.xml`      | All blog posts sitemap  |
| `/sitemap-services.xml`   | All services sitemap    |
| `/robots.txt`             | Robots directives       |

---

## 🚢 Deployment

### Backend (VPS / Railway / Render)

```bash
# Set production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/keyshop
JWT_SECRET=your_production_secret_64_chars_minimum
SITE_URL=https://www.yourdomain.com
FRONTEND_URL=https://www.yourdomain.com

# Start production server
npm start
```

### Frontend (Vercel / Netlify)

```bash
cd frontend

# Create production env file
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production
echo "VITE_SITE_URL=https://www.yourdomain.com" >> .env.production

# Build
npm run build
# Output is in frontend/dist/
```

**Vercel config** (`vercel.json` in frontend/):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Submitting Sitemap to Google

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Go to Sitemaps → Enter `sitemap.xml` → Submit
4. Google will automatically crawl all blog URLs from `sitemap-blogs.xml`

---

## 📝 Customization Checklist

Before going live, update these values:

- [ ] `backend/.env` — All environment variables
- [ ] `frontend/src/components/Navbar.jsx` — Phone number
- [ ] `frontend/src/components/Hero.jsx` — Phone, Google Maps link
- [ ] `frontend/src/components/Contact.jsx` — Phone, email, Google Maps embed
- [ ] `frontend/src/components/Footer.jsx` — Phone, email, social links
- [ ] `frontend/src/components/WhyChooseUs.jsx` — Phone
- [ ] `frontend/src/components/SEOHead.jsx` — Site URL, phone, coordinates
- [ ] Admin → SEO → Global — Business name, address, phone, hours, Google Analytics
- [ ] `backend/utils/seed.js` — Shop address and business details
- [ ] `backend/routes/sitemap.js` — `SITE_URL` default value

---

## 🎨 Branding Colors

| Name      | Hex       | Usage                       |
|-----------|-----------|-----------------------------|
| Navy      | `#1A1A2E` | Primary background, dark UI |
| Dark Navy | `#16213E` | Secondary dark              |
| Gold      | `#E8B84B` | Accents, CTAs, highlights   |
| Light     | `#F8F9FA` | Page background             |

Fonts: **Oswald** (headings) + **Inter** (body)

---

## 📞 Support

Built for KeyShop UAE, Ajman.  
Google Maps: https://maps.app.goo.gl/TyqaZNGERFDBtZb67

---

*Production-ready MERN stack website with full SEO optimization, auto-sitemap, and complete admin panel.*
