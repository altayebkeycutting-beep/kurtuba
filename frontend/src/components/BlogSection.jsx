import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar, FiTag } from 'react-icons/fi';
import { blogAPI } from '../api';
import { format } from 'date-fns';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    blogAPI
      .getAll({ limit: 3, page: 1 })
      .then((res) => {
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
            ? res.data
            : [];
        setPosts(items);
        setError(null);
      })
      .catch((err) => {
        console.error('BlogSection load error:', err);
        setError('Unable to load latest articles right now.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) {
    return (
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="section-badge">Latest Articles</span>
              <h2 className="section-title">
                Key &amp; Lock <span className="gradient-text">Expert Tips</span>
              </h2>
            </div>
            <Link
              to="/blog"
              className="flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition-colors shrink-0"
            >
              View All Posts
              <FiArrowRight />
            </Link>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {error || 'No articles are available right now.'}
            </p>
            <p className="text-sm text-gray-500">
              Check the blog page later or publish new posts from the admin dashboard.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="section-badge">Latest Articles</span>
            <h2 className="section-title">
              Key &amp; Lock{' '}
              <span className="gradient-text">Expert Tips</span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gold-600 font-semibold
                       hover:text-gold-700 transition-colors shrink-0"
          >
            View All Posts
            <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[16/9] skeleton rounded-t-2xl" />
                  <div className="p-5">
                    <div className="h-3 skeleton rounded mb-3 w-1/3" />
                    <div className="h-5 skeleton rounded mb-2" />
                    <div className="h-3 skeleton rounded mb-1" />
                    <div className="h-3 skeleton rounded w-4/5" />
                  </div>
                </div>
              ))
            : posts.map((post) => <BlogCard key={post._id} post={post} />)}
        </div>
      </div>
    </section>
  );
}

export function BlogCard({ post }) {
  const categoryColors = {
    'Key Duplication': 'bg-yellow-100 text-yellow-800',
    'Car Keys': 'bg-blue-100 text-blue-800',
    'Security Tips': 'bg-green-100 text-green-800',
    'Smart Keys': 'bg-purple-100 text-purple-800',
    Locksmith: 'bg-red-100 text-red-800',
    General: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link to={`/blog/${post.slug}`} className="card group block hover:-translate-y-1 transition-all duration-300">
      {/* Featured image */}
      <div className="aspect-[16/9] overflow-hidden rounded-t-2xl bg-gradient-to-br
                      from-primary-500 to-primary-700 flex items-center justify-center">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="text-center text-white">
            <div className="text-5xl mb-2">📝</div>
            <p className="text-xs text-gray-300">{post.category}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category + read time */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${categoryColors[post.category] || categoryColors.General}`}
          >
            <FiTag className="inline text-xs mr-1" />
            {post.category}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <FiClock className="text-xs" />
            {post.readTime || 1} min read
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-dark text-lg mb-2 leading-snug
                       group-hover:text-gold-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Date + arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-gray-400 text-xs flex items-center gap-1">
            <FiCalendar className="text-xs" />
            {post.publishedAt
              ? format(new Date(post.publishedAt), 'MMM d, yyyy')
              : 'Recent'}
          </span>
          <span className="text-gold-600 text-sm font-semibold flex items-center gap-1
                           group-hover:gap-2 transition-all">
            Read More <FiArrowRight className="text-xs" />
          </span>
        </div>
      </div>
    </Link>
  );
}
