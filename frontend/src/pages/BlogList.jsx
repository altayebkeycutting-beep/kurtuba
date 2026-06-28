import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiTag } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { BlogCard } from '../components/BlogSection';
import { blogAPI } from '../api';

const CATEGORIES = ['All', 'Key Duplication', 'Car Keys', 'Security Tips', 'Smart Keys', 'Locksmith', 'General'];

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const category = searchParams.get('category') || 'All';
  const page = parseInt(searchParams.get('page') || '1');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (category && category !== 'All') params.category = category;

      const res = await blogAPI.getAll(params);
      setPosts(res.data.data);
      setPagination({
        total: res.data.total,
        pages: res.data.pages,
        currentPage: res.data.currentPage,
      });
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchPosts]);

  const setCategory = (cat) => {
    setSearchParams({ category: cat, page: 1 });
  };

  const setPage = (p) => {
    setSearchParams({ category, page: p, ...(debouncedSearch ? { q: debouncedSearch } : {}) });
  };

  return (
    <>
      <SEOHead
        title="Key & Lock Expert Tips Blog"
        description="Expert articles on key duplication, car key programming, home security, and locksmith tips in UAE. Stay informed with Kurtuba Locksmith Ajman's knowledge base."
        keywords={['key tips UAE', 'car key blog', 'locksmith advice', 'home security tips Ajman']}
        canonical={`${window.location.origin}/blog`}
      />
      <Navbar />

      <main className="pt-28 pb-16 min-h-screen bg-light">
        <div className="section-container">
          {/* Page header */}
          <div className="text-center mb-12">
            <span className="section-badge">Knowledge Base</span>
            <h1 className="section-title mb-4">
              Expert Tips &amp;{' '}
              <span className="gradient-text">Key Advice</span>
            </h1>
            <p className="section-subtitle mx-auto">
              Guides on key duplication, car key programming, home security, and more from our UAE experts.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchParams({ category, page: 1, q: e.target.value });
              }}
              className="form-input pl-11 pr-4 py-3"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? 'bg-gold-400 text-dark shadow-gold'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <FiTag className="inline mr-1 text-xs" />
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-gray-500 text-sm text-center mb-8">
              {pagination.total} article{pagination.total !== 1 ? 's' : ''} found
              {debouncedSearch ? ` for "${debouncedSearch}"` : ''}
              {category !== 'All' ? ` in ${category}` : ''}
            </p>
          )}

          {/* Posts grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="aspect-[16/9] skeleton rounded-t-2xl" />
                  <div className="p-5 space-y-2">
                    <div className="h-3 skeleton rounded w-1/3" />
                    <div className="h-5 skeleton rounded" />
                    <div className="h-3 skeleton rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-display font-bold text-dark mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm
                           font-medium disabled:opacity-40 hover:border-gold-400 transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: pagination.pages }).map((_, i) => {
                const p = i + 1;
                if (
                  p === 1 ||
                  p === pagination.pages ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-gold-400 text-dark'
                          : 'bg-white border border-gray-200 hover:border-gold-400'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === page - 2 || p === page + 2) {
                  return (
                    <span key={p} className="w-10 h-10 flex items-center justify-center text-gray-400">
                      …
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm
                           font-medium disabled:opacity-40 hover:border-gold-400 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
