import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText, FiMail, FiImage, FiTool, FiEye,
  FiTrendingUp, FiArrowRight, FiAlertCircle,
} from 'react-icons/fi';
import { adminAPI } from '../api';
import { format } from 'date-fns';

const StatCard = ({ icon: Icon, label, value, sub, color, to }) => (
  <Link
    to={to}
    className="card p-5 hover:-translate-y-0.5 transition-all duration-200 block"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <p className="text-3xl font-display font-bold text-dark">{value ?? '—'}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="text-xl" />
      </div>
    </div>
  </Link>
);

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
  archived: 'bg-yellow-100 text-yellow-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getStats()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 skeleton rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { overview, topBlogs, recentContacts, blogsByMonth } = stats || {};

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-display font-bold text-dark">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here's what's happening with your site.
        </p>
      </div>

      {/* ── Alert: new contacts ──────────────────────────── */}
      {(overview?.newContacts || 0) > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200
                        text-blue-700 rounded-xl px-4 py-3 text-sm">
          <FiAlertCircle className="flex-shrink-0" />
          <span>
            You have <strong>{overview.newContacts}</strong> new unread contact
            {overview.newContacts !== 1 ? 's' : ''}.
          </span>
          <Link to="/admin/contacts" className="ml-auto underline font-medium">
            View →
          </Link>
        </div>
      )}

      {/* ── Stats Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiFileText}
          label="Published Blogs"
          value={overview?.publishedBlogs}
          sub={`${overview?.draftBlogs || 0} drafts`}
          color="bg-blue-50 text-blue-600"
          to="/admin/blogs"
        />
        <StatCard
          icon={FiMail}
          label="Total Contacts"
          value={overview?.totalContacts}
          sub={`${overview?.newContacts || 0} new`}
          color="bg-green-50 text-green-600"
          to="/admin/contacts"
        />
        <StatCard
          icon={FiTool}
          label="Active Services"
          value={overview?.totalServices}
          color="bg-gold-400/10 text-gold-600"
          to="/admin/services"
        />
        <StatCard
          icon={FiImage}
          label="Gallery Images"
          value={overview?.galleryImages}
          color="bg-purple-50 text-purple-600"
          to="/admin/gallery"
        />
      </div>

      {/* ── Secondary Stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center
                          justify-center flex-shrink-0">
            <FiEye className="text-gold-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Views (Last 30 Days)</p>
            <p className="text-2xl font-display font-bold text-dark">
              {overview?.recentViews?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center
                          justify-center flex-shrink-0">
            <FiTrendingUp className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Blogs</p>
            <p className="text-2xl font-display font-bold text-dark">
              {overview?.totalBlogs || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Top Blog Posts ───────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-dark text-lg">Top Blog Posts</h2>
            <Link
              to="/admin/blogs"
              className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1"
            >
              All Posts <FiArrowRight className="text-xs" />
            </Link>
          </div>

          {topBlogs?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No blog posts yet.</p>
          ) : (
            <div className="space-y-3">
              {topBlogs?.map((blog, i) => (
                <div
                  key={blog._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
                             transition-colors"
                >
                  <span className="w-6 h-6 bg-gold-400/10 text-gold-600 rounded-lg
                                   text-xs font-bold flex items-center justify-center
                                   flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{blog.title}</p>
                    <p className="text-xs text-gray-400">
                      {blog.publishedAt
                        ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                        : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs flex-shrink-0">
                    <FiEye className="text-xs" />
                    {blog.views?.toLocaleString() || 0}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Recent Contacts ───────────────────────────── */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-dark text-lg">
              Recent Contacts
            </h2>
            <Link
              to="/admin/contacts"
              className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1"
            >
              All Contacts <FiArrowRight className="text-xs" />
            </Link>
          </div>

          {recentContacts?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No contacts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentContacts?.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50
                             transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-500/10 rounded-full flex items-center
                                  justify-center text-primary-500 font-bold text-sm
                                  flex-shrink-0">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{c.name}</p>
                    <p className="text-xs text-gray-400 truncate">{c.service || c.email}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                                ${statusColors[c.status] || statusColors.new}`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────── */}
      <div>
        <h2 className="font-display font-bold text-dark text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Blog Post', to: '/admin/blogs/new', emoji: '✍️' },
            { label: 'Add Service', to: '/admin/services/new', emoji: '🔧' },
            { label: 'Upload Images', to: '/admin/gallery', emoji: '📸' },
            { label: 'Update SEO', to: '/admin/seo', emoji: '🔍' },
          ].map(({ label, to, emoji }) => (
            <Link
              key={label}
              to={to}
              className="card p-4 text-center hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <p className="text-sm font-medium text-dark">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
