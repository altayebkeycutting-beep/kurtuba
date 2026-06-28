const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Blog = require('../models/Blog');

let mongoServer;
const localMongoUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/kurtuba';
const memoryMongoVersion = process.env.MEMORY_MONGO_VERSION || '5.0.19';

const isPlaceholderUri = (uri) => /<.*>/.test(uri);

const seedDevData = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kurtuba.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = await User.create({
        name: 'Kurtuba Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
      });
      console.log(`✅ Dev admin user created: ${admin.email}`);
    }

    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: 'How to Choose the Right Key Duplication Service in UAE',
          slug: 'how-to-choose-key-duplication-service-uae',
          excerpt: 'With dozens of key cutting shops across UAE, finding a reliable one can be tricky. Here\'s what to look for when choosing a key duplication service in Ajman.',
          content: '<h2>Why Quality Key Duplication Matters</h2><p>A poorly cut duplicate key can damage your lock over time. Choosing a professional key duplication service ensures precision cuts that work perfectly and last long.</p><h2>What to Look For</h2><ul><li><strong>Modern Equipment:</strong> Laser-cutting and computerized machines produce more accurate keys.</li><li><strong>Experience:</strong> A shop with thousands of keys knows how to handle yours.</li><li><strong>Warranty:</strong> Good shops stand behind their work with a guarantee.</li><li><strong>Range of Services:</strong> Look for shops that handle everything from house keys to car transponders.</li></ul><h2>Why Choose Kurtuba Locksmith</h2><p>At our Ajman shop, we use the latest Silca and Ilco key cutting machines. Every key is tested before handover, and we offer a satisfaction guarantee on all duplications.</p>',
          category: 'Key Duplication',
          tags: ['key duplication', 'UAE', 'Ajman', 'key cutting', 'tips'],
          author: admin._id,
          status: 'published',
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Car Key Programming: Everything You Need to Know',
          slug: 'car-key-programming-complete-guide',
          excerpt: 'Car key programming can save you hundreds compared to dealership prices. Understand the process, costs, and what to expect at Kurtuba Locksmith Ajman.',
          content: '<h2>What is Car Key Programming?</h2><p>Modern car keys contain microchips that communicate with your vehicle\'s immobilizer system. Without programming, a key won\'t start the car even if it\'s cut perfectly.</p><h2>Types of Car Keys</h2><ul><li><strong>Transponder Keys:</strong> Contain a chip that sends a signal to the car\'s ECU.</li><li><strong>Remote Keys:</strong> Combine transponder and remote lock/unlock functionality.</li><li><strong>Smart Keys:</strong> Allow push-to-start with proximity detection.</li><li><strong>Flip Keys:</strong> Fold into the fob when not in use.</li></ul><h2>Cost Comparison</h2><p>Dealerships typically charge AED 500–1500 for car key programming. At Kurtuba Locksmith in Ajman, we offer the same service starting from AED 80 using identical OEM-grade equipment.</p>',
          category: 'Car Keys',
          tags: ['car key programming', 'transponder key', 'remote key', 'smart key', 'Ajman'],
          author: admin._id,
          status: 'published',
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Top 5 Home Lock Security Tips for UAE Residents',
          slug: 'home-lock-security-tips-uae',
          excerpt: 'Protect your home with these expert lock security tips from Kurtuba Locksmith. Simple upgrades that make a big difference in keeping your family safe in Ajman.',
          content: '<h2>Assess Your Current Locks</h2><p>Many homes in the UAE still use basic pin-tumbler locks that can be bumped or picked. Start by evaluating what you have installed on every entry point.</p><h2>5 Essential Lock Security Tips</h2><ol><li><strong>Upgrade to High-Security Locks:</strong> Brands like Mul-T-Lock and Abloy offer drill-resistant and pick-resistant cylinders.</li><li><strong>Use Deadbolts:</strong> Never rely solely on spring latches. Install a quality deadbolt on all exterior doors.</li><li><strong>Track Your Keys:</strong> Keep track of who has copies. If a key is lost, re-key the lock immediately.</li><li><strong>Consider Smart Locks:</strong> Digital locks with PIN codes eliminate the need to carry keys and provide access logs.</li><li><strong>Reinforce Door Frames:</strong> The strongest lock is useless if the door frame is weak.</li></ol><h2>When to Re-Key vs Replace</h2><p>Re-keying changes the internal pins so old keys no longer work — it\'s faster and cheaper than full replacement. Visit Kurtuba Locksmith in Ajman for advice.</p>',
          category: 'Security Tips',
          tags: ['home security', 'lock safety', 'UAE security', 'door locks', 'Ajman'],
          author: admin._id,
          status: 'published',
          publishedAt: new Date(),
        },
      ]);
      console.log('✅ Dev blog posts seeded');
    }
  } catch (error) {
    console.error('❌ Dev seed error:', error.message);
  }
};

const connectDB = async () => {
  const rawUri = process.env.MONGODB_URI || '';
  const atlasUri = rawUri && !isPlaceholderUri(rawUri) ? rawUri : '';

  try {
    if (!atlasUri) {
      throw new Error('MONGODB_URI is missing or contains placeholder values');
    }

    const conn = await mongoose.connect(atlasUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (!atlasUri && rawUri) {
      console.warn('⚠️  MONGODB_URI looks like it contains placeholder values. Update backend/.env with the real password or use a local MongoDB URI.');
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Attempting local MongoDB fallback for development...');
      try {
        const conn = await mongoose.connect(localMongoUri);
        console.log(`✅ Local MongoDB Connected: ${conn.connection.host}`);
        await seedDevData();
        return;
      } catch (localError) {
        console.error(`❌ Local MongoDB fallback failed: ${localError.message}`);
      }

      if (process.platform === 'win32') {
        console.warn('⚠️  In-memory MongoDB fallback is not supported on Windows in this environment; skipping.');
      } else {
        console.log('⚠️  Starting in-memory MongoDB for local development...');
        try {
          mongoServer = await MongoMemoryServer.create({
            binary: { version: memoryMongoVersion },
          });
          const uri = mongoServer.getUri();
          const conn = await mongoose.connect(uri);
          console.log(`✅ In-memory MongoDB started: ${conn.connection.host}`);
          await seedDevData();
          return;
        } catch (memoryError) {
          console.error(`❌ In-memory MongoDB failed: ${memoryError.message}`);
        }
      }
    }

    console.log('⚠️  Server will run without database connection. Some features may not work.');
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoServer.stop();
    console.log('✅ In-memory MongoDB stopped');
  }
  process.exit(0);
});

module.exports = connectDB;
