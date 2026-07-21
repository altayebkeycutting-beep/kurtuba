import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

// Load environment variables from backend .env during local development.
dotenv.config({ path: path.join(repoRoot, 'backend', '.env'), override: false });
dotenv.config({ override: false });

const MONGODB_URI = process.env.MONGODB_URI;
const SITE_URL = normalizeSiteUrl(process.env.SITE_URL || 'https://www.locksmithajman.com');

function normalizeSiteUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'https://www.locksmithajman.com';
  return trimmed.replace(/^https?:\/\/(?:www\.)?locksmithajman\.com\/?$/i, 'https://www.locksmithajman.com').replace(/\/$/, '');
}

function formatDate(value = new Date()) {
  return new Date(value).toISOString().split('T')[0];
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemapXml(urls) {
  const urlEntries = urls.map(({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
    <changefreq>${escapeXml(changefreq || 'monthly')}</changefreq>
    <priority>${escapeXml(priority || '0.5')}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
}

function buildSitemapIndex(entries) {
  const indexEntries = entries.map(({ loc, lastmod }) => `  <sitemap><loc>${escapeXml(loc)}</loc><lastmod>${escapeXml(lastmod)}</lastmod></sitemap>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexEntries}\n</sitemapindex>`;
}

const staticPages = [
  { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_URL}/services`, changefreq: 'weekly', priority: '0.9' },
  { loc: `${SITE_URL}/gallery`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.7' },
  { loc: `${SITE_URL}/blog`, changefreq: 'daily', priority: '0.8' },
  { loc: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.7' },
];

const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n\n# Kurtuba Locksmith Ajman — Professional Key Duplication & Locksmith Services UAE\n`;

async function fetchBlogUrls(db) {
  const blogs = await db
    .collection('blogs')
    .find({ status: 'published' }, { projection: { slug: 1, updatedAt: 1, publishedAt: 1 } })
    .sort({ publishedAt: -1 })
    .toArray();

  return blogs.map((blog) => ({
    loc: `${SITE_URL}/blog/${blog.slug}`,
    lastmod: formatDate(blog.updatedAt || blog.publishedAt || new Date()),
    changefreq: 'monthly',
    priority: '0.8',
  }));
}

async function fetchServiceUrls(db) {
  const services = await db
    .collection('services')
    .find({ isActive: true }, { projection: { slug: 1, updatedAt: 1 } })
    .toArray();

  return services.map((service) => ({
    loc: `${SITE_URL}/services/${service.slug}`,
    lastmod: formatDate(service.updatedAt || new Date()),
    changefreq: 'monthly',
    priority: '0.7',
  }));
}

async function main() {
  let blogUrls = [];
  let serviceUrls = [];
  const today = formatDate();
  const outputDir = path.join(__dirname, 'public');

  if (MONGODB_URI) {
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      [blogUrls, serviceUrls] = await Promise.all([fetchBlogUrls(db), fetchServiceUrls(db)]);
    } catch (error) {
      console.warn('⚠️ Skipping dynamic sitemap generation because MongoDB is unavailable.');
      console.warn(error.message || error);
    } finally {
      await client.close();
    }
  } else {
    console.warn('⚠️ MONGODB_URI is not set. Blog and service sitemaps will be generated empty during build.');
  }

  await fs.mkdir(outputDir, { recursive: true });

  const files = [
    { name: 'sitemap-pages.xml', content: buildSitemapXml(staticPages.map((entry) => ({ ...entry, lastmod: today })) ) },
    { name: 'sitemap-blogs.xml', content: buildSitemapXml(blogUrls) },
    { name: 'sitemap-services.xml', content: buildSitemapXml(serviceUrls) },
    { name: 'sitemap.xml', content: buildSitemapIndex([
      { loc: `${SITE_URL}/sitemap-pages.xml`, lastmod: today },
      { loc: `${SITE_URL}/sitemap-blogs.xml`, lastmod: today },
      { loc: `${SITE_URL}/sitemap-services.xml`, lastmod: today },
    ]) },
    { name: 'robots.txt', content: robotsTxt },
  ];

  await Promise.all(files.map((file) => fs.writeFile(path.join(outputDir, file.name), file.content, 'utf8')));

  console.log('✔ Static sitemap files generated in frontend/public:');
  files.forEach((file) => console.log(`  - ${file.name}`));
}

main().catch((error) => {
  console.error('Failed to generate sitemaps:', error);
  process.exit(1);
});
