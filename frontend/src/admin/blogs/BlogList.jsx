import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import { blogAPI } from '../../api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const statusColors = {
  published: 'bg-green-100 text-green-700 border-green-200',
  draft:     'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export default function AdminBlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [deleting, setDeleting] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await blogAPI.getAllAdmin({ page, limit: 10 });
      setBlogs(res.data.data);
      setPagination({ total: res.data.total, pages: res.data.pages });
    } catch {
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, [page]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await blogAPI.delete(id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch {
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = blogs.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination.total} total posts
          </p>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary text-sm w-fit">
          <FiPlus />
          New Blog Post
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-400 text-sm flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input py-2 text-sm w-auto"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 skeleton rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-3">📭</div>
                    <p>No blog posts found.</p>
                    <Link to="/admin/blogs/new" className="text-gold-600 underline text-sm mt-2 inline-block">
                      Create your first post →
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                    {/* Title */}
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-dark truncate">{blog.title}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">/blog/{blog.slug}</p>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-gray-600 text-xs">{blog.category}</span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                        border ${statusColors[blog.status]}`}>
                        {blog.status}
                      </span>
                    </td>
                    {/* Views */}
                    <td className="px-4 py-4 hidden lg:table-cell text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiEye className="text-xs" /> {blog.views || 0}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-4 hidden lg:table-cell text-gray-500 text-xs">
                      {blog.publishedAt
                        ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                        : format(new Date(blog.createdAt), 'MMM d, yyyy')}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50
                                     rounded-lg transition-colors"
                          title="View on site"
                        >
                          <FiEye size={15} />
                        </a>
                        <Link
                          to={`/admin/blogs/edit/${blog._id}`}
                          className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50
                                     rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deleting === blog._id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50
                                     rounded-lg transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === blog._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-red-400
                                            border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">{pagination.total} total posts</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                           disabled:opacity-40 hover:border-gold-400 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-xs bg-gold-400 text-dark rounded-lg font-medium">
                {page} / {pagination.pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                           disabled:opacity-40 hover:border-gold-400 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
