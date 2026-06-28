require('dotenv').config();
const mongoose  = require('mongoose');
const connectDB = require('../config/db');

const User        = require('../models/User');
const Service     = require('../models/Service');
const Blog        = require('../models/Blog');
const Gallery     = require('../models/Gallery');
const SeoSettings = require('../models/SeoSettings');

const seedData = async () => {
  await connectDB();
  console.log('🌱 Starting database seed...');

  await Promise.all([
    User.deleteMany(),
    Service.deleteMany(),
    Blog.deleteMany(),
    Gallery.deleteMany(),
    SeoSettings.deleteMany(),
  ]);

  // ── Admin User ──────────────────────────────────────────────
  const admin = await User.create({
    name: 'Kurtuba Admin',
    email: process.env.ADMIN_EMAIL || 'admin@kurtuba.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  });
  console.log('✅ Admin user created:', admin.email);

  // ── Services ────────────────────────────────────────────────
  const services = await Service.insertMany([
    {
      title: 'House Key Duplication',
      slug: 'house-key-duplication',
      shortDescription: 'Fast and accurate duplication of all types of house and door keys. Ready in minutes.',
      fullDescription: 'We duplicate all standard and high-security house keys with precision machinery. Whether it\'s a single cut key or a complex profile, we get it right the first time.',
      icon: '🏠',
      features: ['All key types', 'Ready in 5 minutes', 'High precision cuts', 'Affordable pricing', 'Guaranteed fit'],
      price: { from: 5, to: 15, currency: 'AED', displayText: 'Starting from AED 5' },
      isFeatured: true, sortOrder: 1,
    },
    {
      title: 'Car Key Duplication',
      slug: 'car-key-duplication',
      shortDescription: 'Professional car key cutting for all makes and models including transponder keys.',
      fullDescription: 'Duplicate your car key without visiting the dealership. We handle standard, transponder, and flip keys for most vehicle brands.',
      icon: '🚗',
      features: ['All car brands', 'Transponder keys', 'Flip keys', 'Same-day service', 'OEM quality cuts'],
      price: { from: 25, to: 150, currency: 'AED', displayText: 'Starting from AED 25' },
      isFeatured: true, sortOrder: 2,
    },
    {
      title: 'Remote Key Programming',
      slug: 'remote-key-programming',
      shortDescription: 'Program car remote keys and key fobs for all major vehicle brands.',
      fullDescription: 'Lost your car remote or need an extra one? We program remote key fobs and smart keys for virtually all vehicle makes and models.',
      icon: '📡',
      features: ['All brands supported', 'OBD programming', 'Key fob cloning', 'Smart key pairing', 'Warranty included'],
      price: { from: 80, to: 350, currency: 'AED', displayText: 'Starting from AED 80' },
      isFeatured: true, sortOrder: 3,
    },
    {
      title: 'Smart Key & Keyless Entry',
      slug: 'smart-key-keyless-entry',
      shortDescription: 'Supply and programming of smart keys and keyless entry systems for modern vehicles.',
      icon: '🔐',
      features: ['Push-to-start keys', 'Proximity sensors', 'All luxury brands', 'Software programming', 'Testing included'],
      price: { from: 150, to: 600, currency: 'AED', displayText: 'Starting from AED 150' },
      isFeatured: true, sortOrder: 4,
    },
    {
      title: 'Lock Repair & Replacement',
      slug: 'lock-repair-replacement',
      shortDescription: 'Repair or replace door locks, padlocks, and security locks for homes and businesses.',
      icon: '🔒',
      features: ['All lock brands', 'Door locks', 'Padlocks', 'High-security locks', 'Emergency service'],
      price: { from: 30, to: 200, currency: 'AED', displayText: 'Starting from AED 30' },
      isFeatured: true, sortOrder: 5,
    },
    {
      title: 'Master Key Systems',
      slug: 'master-key-systems',
      shortDescription: 'Design and implement master key systems for offices, hotels, and residential complexes.',
      icon: '🗝️',
      features: ['System design', 'Multiple access levels', 'Commercial & residential', 'Security audit', 'Documentation provided'],
      price: { from: 200, currency: 'AED', displayText: 'Custom quote' },
      isFeatured: false, sortOrder: 6,
    },
  ]);
  console.log(`✅ ${services.length} services created`);

  // ── Gallery ─────────────────────────────────────────────────
  const galleryItems = await Gallery.insertMany([
    { title: 'Our Ajman Workshop',     imageUrl: '/images/gallery/workshop-1.jpg', altText: 'Kurtuba Locksmith workshop Ajman',        category: 'Workshop',    isFeatured: true,  isActive: true, sortOrder: 1 },
    { title: 'Key Cutting Machine',    imageUrl: '/images/gallery/machine-1.jpg', altText: 'Professional key cutting machine UAE',     category: 'Equipment',   isFeatured: true,  isActive: true, sortOrder: 2 },
    { title: 'Car Key Collection',     imageUrl: '/images/gallery/car-keys-1.jpg', altText: 'Car key duplication Ajman',                category: 'Keys',        isFeatured: true,  isActive: true, sortOrder: 3 },
    { title: 'Remote Keys Display',    imageUrl: '/images/gallery/remote-keys-1.jpg', altText: 'Remote car keys programming Ajman',        category: 'Keys',        isFeatured: true,  isActive: true, sortOrder: 4 },
    { title: 'Expert Locksmith Team',  imageUrl: '/images/gallery/team-1.jpg', altText: 'Kurtuba Locksmith expert team Ajman',     category: 'Team',        isFeatured: true,  isActive: true, sortOrder: 5 },
    { title: 'Smart Key Programming',  imageUrl: '/images/gallery/smart-key-1.jpg', altText: 'Smart key programming service UAE',        category: 'Equipment',   isFeatured: true,  isActive: true, sortOrder: 6 },
    { title: 'Lock Repair Work',       imageUrl: '/images/gallery/repair-1.jpg', altText: 'Door lock repair and replacement Ajman',   category: 'Workshop',    isFeatured: false, isActive: true, sortOrder: 7 },
    { title: 'Before & After Service', imageUrl: '/images/gallery/before-after-1.jpg', altText: 'Lock repair before and after Ajman',       category: 'Before-After',isFeatured: false, isActive: true, sortOrder: 8 },
  ]);
  console.log(`✅ ${galleryItems.length} gallery items created`);

  // ── Blog Posts ──────────────────────────────────────────────
  const blogs = await Blog.insertMany([
    {
      title: 'How to Choose the Right Key Duplication Service in UAE',
      slug: 'how-to-choose-key-duplication-service-uae',
      excerpt: 'With dozens of key cutting shops across UAE, finding a reliable one can be tricky. Here\'s what to look for when choosing a key duplication service in Ajman.',
      content: `<h2>Why Quality Key Duplication Matters</h2><p>A poorly cut duplicate key can damage your lock over time. Choosing a professional key duplication service ensures precision cuts that work perfectly and last long.</p><h2>What to Look For</h2><ul><li><strong>Modern Equipment:</strong> Laser-cutting and computerized machines produce more accurate keys.</li><li><strong>Experience:</strong> A shop with thousands of keys knows how to handle yours.</li><li><strong>Warranty:</strong> Good shops stand behind their work with a guarantee.</li><li><strong>Range of Services:</strong> Look for shops that handle everything from house keys to car transponders.</li></ul><h2>Why Choose Kurtuba Locksmith</h2><p>At our Ajman shop, we use the latest Silca and Ilco key cutting machines. Every key is tested before handover, and we offer a satisfaction guarantee on all duplications.</p>`,
      category: 'Key Duplication',
      tags: ['key duplication', 'UAE', 'Ajman', 'key cutting', 'tips'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      seo: {
        metaTitle: 'How to Choose Key Duplication Service in UAE | Kurtuba Locksmith',
        metaDescription: 'Expert tips on choosing the best key duplication service in UAE. Learn what to look for in a professional key shop in Ajman.',
        keywords: ['key duplication UAE', 'key cutting Ajman', 'locksmith Ajman'],
      },
    },
    {
      title: 'Car Key Programming: Everything You Need to Know',
      slug: 'car-key-programming-complete-guide',
      excerpt: 'Car key programming can save you hundreds compared to dealership prices. Understand the process, costs, and what to expect at Kurtuba Locksmith Ajman.',
      content: `<h2>What is Car Key Programming?</h2><p>Modern car keys contain microchips that communicate with your vehicle's immobilizer system. Without programming, a key won't start the car even if it's cut perfectly.</p><h2>Types of Car Keys</h2><ul><li><strong>Transponder Keys:</strong> Contain a chip that sends a signal to the car's ECU.</li><li><strong>Remote Keys:</strong> Combine transponder and remote lock/unlock functionality.</li><li><strong>Smart Keys:</strong> Allow push-to-start with proximity detection.</li><li><strong>Flip Keys:</strong> Fold into the fob when not in use.</li></ul><h2>Cost Comparison</h2><p>Dealerships typically charge AED 500–1500 for car key programming. At Kurtuba Locksmith in Ajman, we offer the same service starting from AED 80 using identical OEM-grade equipment.</p>`,
      category: 'Car Keys',
      tags: ['car key programming', 'transponder key', 'remote key', 'smart key', 'Ajman'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      seo: {
        metaTitle: 'Car Key Programming Guide UAE | Kurtuba Locksmith Ajman',
        metaDescription: 'Complete guide to car key programming in UAE. Learn about transponder keys, remote keys, costs, and why Kurtuba Locksmith is cheaper than dealerships.',
        keywords: ['car key programming UAE', 'transponder key Ajman', 'remote key programming'],
      },
    },
    {
      title: 'Top 5 Home Lock Security Tips for UAE Residents',
      slug: 'home-lock-security-tips-uae',
      excerpt: 'Protect your home with these expert lock security tips from Kurtuba Locksmith. Simple upgrades that make a big difference in keeping your family safe in Ajman.',
      content: `<h2>Assess Your Current Locks</h2><p>Many homes in the UAE still use basic pin-tumbler locks that can be bumped or picked. Start by evaluating what you have installed on every entry point.</p><h2>5 Essential Lock Security Tips</h2><ol><li><strong>Upgrade to High-Security Locks:</strong> Brands like Mul-T-Lock and Abloy offer drill-resistant and pick-resistant cylinders.</li><li><strong>Use Deadbolts:</strong> Never rely solely on spring latches. Install a quality deadbolt on all exterior doors.</li><li><strong>Track Your Keys:</strong> Keep track of who has copies. If a key is lost, re-key the lock immediately.</li><li><strong>Consider Smart Locks:</strong> Digital locks with PIN codes eliminate the need to carry keys and provide access logs.</li><li><strong>Reinforce Door Frames:</strong> The strongest lock is useless if the door frame is weak.</li></ol><h2>When to Re-Key vs Replace</h2><p>Re-keying changes the internal pins so old keys no longer work — it's faster and cheaper than full replacement. Visit Kurtuba Locksmith in Ajman for advice.</p>`,
      category: 'Security Tips',
      tags: ['home security', 'lock safety', 'UAE security', 'door locks', 'Ajman'],
      author: admin._id,
      status: 'published',
      publishedAt: new Date(),
      seo: {
        metaTitle: 'Home Lock Security Tips UAE | Kurtuba Locksmith Ajman',
        metaDescription: 'Expert home security tips for UAE residents from Kurtuba Locksmith Ajman. Learn how to upgrade your locks and protect your family.',
        keywords: ['home security UAE', 'lock safety tips', 'door lock Ajman', 'Kurtuba Locksmith'],
      },
    },
  ]);
  console.log(`✅ ${blogs.length} blog posts created`);

  // ── SEO Settings ────────────────────────────────────────────
  await SeoSettings.insertMany([
    {
      page: 'global',
      globalSettings: {
        siteName: 'Kurtuba Locksmith — Key Duplication Experts Ajman',
        siteDescription: 'Professional key duplication, car key programming and locksmith services in Ajman, UAE. Fast, affordable, and reliable.',
        businessSchema: {
          name: 'Kurtuba Locksmith',
          address: 'Ajman, United Arab Emirates',
          phone: '+971 52 343 3077',
          email: 'info@kurtubalocksmith.com',
          priceRange: '$',
          openingHours: ['Mo-Sa 09:00-21:00', 'Su 10:00-18:00'],
        },
      },
    },
    {
      page: 'home',
      metaTitle: 'Kurtuba Locksmith Ajman | Key Duplication & Car Key Programming UAE',
      metaDescription: 'Kurtuba Locksmith — professional key duplication, car key programming & locksmith services in Ajman UAE. Fast service, expert technicians, best prices!',
      keywords: ['Kurtuba Locksmith', 'key duplication Ajman', 'car key programming UAE', 'locksmith Ajman'],
    },
    {
      page: 'blog',
      metaTitle: 'Key & Lock Tips Blog | Kurtuba Locksmith Ajman UAE',
      metaDescription: 'Expert tips on key duplication, car keys, home security, and locksmith services from Kurtuba Locksmith Ajman.',
      keywords: ['key tips UAE', 'lock advice', 'car key blog', 'locksmith tips Ajman'],
    },
    {
      page: 'services',
      metaTitle: 'Locksmith Services Ajman | Kurtuba Locksmith UAE',
      metaDescription: 'Complete range of key services: house key cutting, car key programming, remote keys, smart keys, and lock repair in Ajman. Best prices in UAE.',
      keywords: ['key services Ajman', 'locksmith services UAE', 'car key programming Ajman'],
    },
    {
      page: 'contact',
      metaTitle: 'Contact Kurtuba Locksmith — Visit Our Ajman Shop',
      metaDescription: 'Get in touch with Kurtuba Locksmith in Ajman. Call us or visit our shop for key duplication and locksmith services. Fast response guaranteed.',
      keywords: ['contact locksmith Ajman', 'Kurtuba Locksmith location', 'key shop Ajman UAE'],
    },
    {
      page: 'about',
      metaTitle: 'About Kurtuba Locksmith — Ajman\'s Trusted Locksmiths Since 2010',
      metaDescription: 'Learn about Kurtuba Locksmith, Ajman\'s most trusted key duplication and locksmith shop since 2010. Meet our team and discover our story.',
      keywords: ['about Kurtuba Locksmith', 'locksmith Ajman history', 'key shop UAE trusted'],
    },
  ]);
  console.log('✅ SEO settings created');

  console.log('\n🎉 Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log(`Admin Email:    ${admin.email}`);
  console.log(`Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
  console.log('─────────────────────────────────────────');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
