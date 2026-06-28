import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiCalendar, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { BlogCard } from '../components/BlogSection';
import { blogAPI } from '../api';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    blogAPI
      .getBySlug(slug)
      .then((res) => {
        setBlog(res.data.data);
        setRelated(res.data.related || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => navigate('/blog', { replace: true }))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: blog.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-28 bg-light">
          <div className="section-container max-w-4xl animate-pulse">
            <div className="h-8 skeleton rounded mb-4 w-3/4" />
            <div className="h-4 skeleton rounded mb-8 w-1/2" />
            <div className="aspect-[16/9] skeleton rounded-2xl mb-8" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 skeleton rounded mb-3" />
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) return null;

  const siteUrl = window.location.origin;
  const blogUrl = `${siteUrl}/blog/${blog.slug}`;

  // Article Schema for SEO
  const articleSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage ? `${siteUrl}${blog.featuredImage}` : `${siteUrl}/og-image.jpg`,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author?.name || 'Kurtuba Locksmith',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Kurtuba Locksmith',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    keywords: blog.tags?.join(', '),
    articleSection: blog.category,
    wordCount: blog.content?.replace(/<[^>]*>/g, '').split(/\s+/).length,
  });

  // BreadcrumbList Schema
  const breadcrumbSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: blog.title, item: blogUrl },
    ],
  });

  const combinedSchema = `${articleSchema}\n${breadcrumbSchema}`;

  return (
    <>
      <SEOHead
        title={blog.seo?.metaTitle || blog.title}
        description={blog.seo?.metaDescription || blog.excerpt}
        keywords={blog.seo?.keywords || blog.tags || []}
        canonical={blog.seo?.canonicalUrl || blogUrl}
        ogTitle={blog.seo?.ogTitle || blog.title}
        ogDescription={blog.seo?.ogDescription || blog.excerpt}
        ogImage={blog.seo?.ogImage || blog.featuredImage}
        ogType="article"
        schema={combinedSchema}
      />
      <Navbar />

      <main className="pt-24 min-h-screen bg-white">
        {/* ── Hero area ───────────────────────────────────── */}
        <div className="bg-dark py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-gold-400 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-gray-300 truncate max-w-xs">{blog.title}</span>
            </nav>

            {/* Category */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-400/10
                             border border-gold-400/30 text-gold-400 text-xs font-semibold
                             rounded-full mb-4">
              <FiTag className="text-xs" />
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold
                           text-white leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="text-gold-400" />
                {blog.publishedAt
                  ? format(new Date(blog.publishedAt), 'MMMM d, yyyy')
                  : 'Recent'}
              </span>
              <span className="flex items-center gap-1.5">
                <FiClock className="text-gold-400" />
                {blog.readTime || 1} min read
              </span>
              <span className="flex items-center gap-1.5">
                👁 {blog.views?.toLocaleString() || 0} views
              </span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-gold-400
                           hover:text-gold-300 transition-colors"
              >
                <FiShare2 />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────── */}
        <div className="section-container max-w-4xl py-12">
          <div className="grid lg:grid-cols-[1fr_280px] gap-10">

            {/* Main content */}
            <article>
              {/* Featured image */}
              {blog.featuredImage && (
                <img
                  src={blog.featuredImage}
                  alt={blog.featuredImageAlt || blog.title}
                  className="w-full aspect-[16/9] object-cover rounded-2xl mb-8 shadow-card"
                />
              )}

              {/* Blog body */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Tags:</span>
                  {blog.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full
                                 hover:bg-gold-400/10 hover:text-gold-600 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Back + Share */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-gray-500 hover:text-dark
                             transition-colors text-sm font-medium"
                >
                  <FiArrowLeft />
                  Back to Blog
                </Link>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-dark
                             rounded-lg text-sm font-semibold hover:bg-gold-500 transition-colors"
                >
                  <FiShare2 />
                  Share Article
                </button>
              </div>
            </article>

            {/* ── Sidebar ─────────────────────────────────── */}
            <aside className="space-y-6">
              {/* CTA card */}
              <div className="bg-dark rounded-2xl p-6 text-center sticky top-24">
                <div className="text-3xl mb-3">🔑</div>
                <h3 className="text-white font-display font-bold text-lg mb-2">
                  Need a Key Duplicated?
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Visit our shop in Ajman. Fast service, best prices in UAE.
                </p>
                <a
                  href="tel:+971523433077"
                  className="btn-primary w-full justify-center text-sm"
                >
                  📞 Call Now
                </a>
                <a
                  href="/#contact"
                  className="mt-2 block text-center text-gold-400 text-sm hover:underline"
                >
                  Send a Message
                </a>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div>
                  <h3 className="font-display font-bold text-dark text-lg mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r._id}
                        to={`/blog/${r.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden
                                        bg-gray-100">
                          {r.featuredImage ? (
                            <img
                              src={r.featuredImage}
                              alt={r.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary-500 flex items-center
                                            justify-center text-xl">🔑</div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-dark line-clamp-2
                                         group-hover:text-gold-600 transition-colors">
                            {r.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {r.readTime || 1} min read
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
