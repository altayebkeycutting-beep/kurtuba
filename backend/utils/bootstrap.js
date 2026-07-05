const adminEmail = process.env.ADMIN_EMAIL || 'admin@kurtuba.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

const ensureDefaultAdmin = async (UserModel) => {
  if (!UserModel) {
    throw new Error('User model is required for bootstrapping');
  }

  const existingAdmin = await UserModel.findOne({
    $or: [{ role: 'admin' }, { email: adminEmail }],
  });

  if (existingAdmin) {
    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save({ validateBeforeSave: false });
    }
    return existingAdmin;
  }

  const admin = await UserModel.create({
    name: 'Kurtuba Admin',
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
    isActive: true,
  });

  console.log(`✅ Admin user ensured: ${admin.email}`);
  return admin;
};

const ensureDefaultBlog = async (BlogModel, authorId) => {
  if (!BlogModel) {
    throw new Error('Blog model is required for bootstrapping');
  }

  const hasPublishedBlog = await BlogModel.exists({ status: 'published' });
  if (hasPublishedBlog) {
    return null;
  }

  const blog = await BlogModel.create({
    title: 'Welcome to Kurtuba Locksmith',
    slug: 'welcome-to-kurtuba-locksmith',
    excerpt:
      'The blog feed has been restored with a default post so your website stays informative while content is being added.',
    content:
      '<h2>Welcome</h2><p>We are happy to support your website with trusted locksmith services and useful content for visitors in Ajman and across the UAE.</p>',
    category: 'General',
    tags: ['kurtuba', 'locksmith', 'ajman'],
    author: authorId,
    status: 'published',
    publishedAt: new Date(),
    seo: {
      metaTitle: 'Welcome to Kurtuba Locksmith',
      metaDescription: 'A default blog post to keep the site content live after deployment or database reset.',
      keywords: ['kurtuba locksmith', 'ajman locksmith'],
    },
  });

  console.log(`✅ Default blog post ensured: ${blog.slug}`);
  return blog;
};

const bootstrapAppData = async ({ User, Blog }) => {
  const admin = await ensureDefaultAdmin(User);
  const blog = await ensureDefaultBlog(Blog, admin?._id);

  return { admin, blog };
};

module.exports = {
  bootstrapAppData,
  ensureDefaultAdmin,
  ensureDefaultBlog,
};
