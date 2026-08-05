const express = require('express');
const router  = express.Router();
const Blog    = require('../models/Blog');
const Service = require('../models/Service');

const normalizeSiteUrl = (value) => {
  const trimmed = (value || 'https://www.locksmithajman.com').trim();
  return trimmed.replace(/^https?:\/\/(?:www\.)?locksmithajman\.com\/?$/i, 'https://www.locksmithajman.com');
};

const SITE_URL = normalizeSiteUrl(process.env.SITE_URL);

const formatDate = (date = new Date()) => {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) {
    return formatDate(new Date());
  }
  return value.toISOString().split('T')[0];
};

const buildSitemapXml = (urls) => {
  const urlEntries = urls.map(({ loc, lastmod, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq || 'monthly'}</changefreq>
    <priority>${priority || '0.5'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
};

// Sitemap index
router.get('/sitemap.xml', async (req, res) => {
  const today = formatDate(new Date());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-blogs.xml</loc><lastmod>${today}</lastmod></sitemap>
  <sitemap><loc>${SITE_URL}/sitemap-services.xml</loc><lastmod>${today}</lastmod></sitemap>
</sitemapindex>`;
  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

// Static pages sitemap
router.get('/sitemap-pages.xml', (req, res) => {
  const today = formatDate(new Date());
  const staticPages = [
    { loc: `${SITE_URL}/`,         changefreq: 'weekly',  priority: '1.0', lastmod: today },
    { loc: `${SITE_URL}/services`, changefreq: 'weekly',  priority: '0.9', lastmod: today },
    { loc: `${SITE_URL}/gallery`,  changefreq: 'weekly',  priority: '0.8', lastmod: today },
    { loc: `${SITE_URL}/about`,    changefreq: 'monthly', priority: '0.7', lastmod: today },
    { loc: `${SITE_URL}/blog`,     changefreq: 'daily',   priority: '0.8', lastmod: today },
    { loc: `${SITE_URL}/contact`,  changefreq: 'monthly', priority: '0.7', lastmod: today },
  ];
  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=3600');
  res.send(buildSitemapXml(staticPages));
});

// Blog posts sitemap — each blog gets its own URL
router.get('/sitemap-blogs.xml', async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt publishedAt').sort({ publishedAt: -1 });
    const blogUrls = blogs.map((b) => ({
      loc: `${SITE_URL}/blog/${b.slug}`,
      lastmod: formatDate(b.updatedAt || b.publishedAt),
      changefreq: 'monthly',
      priority: '0.8',
    }));
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=1800');
    res.send(buildSitemapXml(blogUrls));
  } catch { res.status(500).json({ success: false, message: 'Blog sitemap failed' }); }
});

// Services sitemap
router.get('/sitemap-services.xml', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).select('slug updatedAt');
    const serviceUrls = services.map((s) => ({
      loc: `${SITE_URL}/services/${s.slug}`,
      lastmod: formatDate(s.updatedAt),
      changefreq: 'monthly',
      priority: '0.7',
    }));
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(buildSitemapXml(serviceUrls));
  } catch { res.status(500).json({ success: false, message: 'Services sitemap failed' }); }
});

// Robots.txt
router.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml

# Kurtuba Locksmith Ajman — Professional Key Duplication & Locksmith Services UAE
`);
});

module.exports = router;
