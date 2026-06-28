import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiEye, FiLink } from 'react-icons/fi';
import { blogAPI } from '../../api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Key Duplication', 'Car Keys', 'Security Tips', 'Smart Keys', 'Locksmith', 'General'];

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SEO_CHAR_LIMITS = { metaTitle: 70, metaDescription: 160 };
const CharCount = ({ value = '', limit }) => {
  const len = value.length;
  const pct = len / limit;
  const color = pct > 1 ? 'text-red-500' : pct > 0.85 ? 'text-yellow-500' : 'text-green-600';
  return <span className={`text-xs font-mono ${color}`}>{len}/{limit}</span>;
};

const defaultForm = {
  title: '', slug: '', excerpt: '', content: '',
  category: 'General', tags: '', status: 'draft',
  featuredImage: '', featuredImageAlt: '',
  seo: { metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', ogTitle: '', ogDescription: '' },
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const contentRef = useRef(null);

  // Load existing blog for edit
  useEffect(() => {
    if (!isEdit) return;
    blogAPI
      .getForEdit(id)
      .then((res) => {
        const b = res.data.data;
        setForm({
          title: b.title || '',
          slug: b.slug || '',
          excerpt: b.excerpt || '',
          content: b.content || '',
          category: b.category || 'General',
          tags: b.tags?.join(', ') || '',
          status: b.status || 'draft',
          featuredImage: b.featuredImage || '',
          featuredImageAlt: b.featuredImageAlt || '',
          seo: {
            metaTitle: b.seo?.metaTitle || '',
            metaDescription: b.seo?.metaDescription || '',
            keywords: b.seo?.keywords?.join(', ') || '',
            canonicalUrl: b.seo?.canonicalUrl || '',
            ogTitle: b.seo?.ogTitle || '',
            ogDescription: b.seo?.ogDescription || '',
          },
        });
        setAutoSlug(false);
      })
      .catch(() => { toast.error('Blog not found'); navigate('/admin/blogs'); })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      ...(autoSlug ? { slug: slugify(title) } : {}),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('seo.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, seo: { ...prev.seo, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, publish = false) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!form.content.trim()) { toast.error('Content is required'); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: publish ? 'published' : form.status,
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
      };

      if (isEdit) {
        await blogAPI.update(id, payload);
        toast.success('Blog updated successfully!');
      } else {
        const res = await blogAPI.create(payload);
        toast.success(publish ? 'Blog published!' : 'Blog saved as draft!');
        navigate(`/admin/blogs/edit/${res.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl animate-pulse space-y-4">
        <div className="h-8 skeleton rounded w-48" />
        <div className="h-12 skeleton rounded" />
        <div className="h-64 skeleton rounded" />
      </div>
    );
  }

  const tabs = [
    { id: 'content', label: '📝 Content' },
    { id: 'seo', label: '🔍 SEO' },
    { id: 'media', label: '🖼️ Media' },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blogs"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <FiArrowLeft />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-dark">
              {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
            </h1>
            {isEdit && (
              <a
                href={`/blog/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold-600 flex items-center gap-1 mt-0.5 hover:underline"
              >
                <FiEye size={11} /> View on site
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={saving}
            className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm
                       font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, form.status !== 'published')}
            disabled={saving}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiSave />
                {form.status === 'published' ? 'Update Post' : 'Publish'}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* ── Main Editor ──────────────────────────────── */}
        <div className="space-y-5">
          {/* Title */}
          <div className="card p-5">
            <label className="form-label text-base">Post Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleTitleChange}
              placeholder="Enter a compelling blog title..."
              className="form-input text-lg font-medium"
            />
            {/* Slug */}
            <div className="flex items-center gap-2 mt-2">
              <FiLink className="text-gray-400 text-xs flex-shrink-0" />
              <span className="text-xs text-gray-400">Slug:</span>
              <input
                name="slug"
                value={form.slug}
                onChange={(e) => { setForm((p) => ({ ...p, slug: e.target.value })); setAutoSlug(false); }}
                className="flex-1 text-xs text-gray-600 bg-gray-50 border border-gray-200
                           rounded px-2 py-1 focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="card overflow-hidden">
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-gold-600 border-b-2 border-gold-400 bg-gold-50/50'
                      : 'text-gray-500 hover:text-dark hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Excerpt * <span className="text-gray-400 text-xs">(max 500 chars)</span></label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Brief summary shown in blog listing (1–2 sentences)..."
                      className="form-input resize-none"
                      maxLength={500}
                    />
                    <p className="text-right text-xs text-gray-400 mt-1">{form.excerpt.length}/500</p>
                  </div>

                  <div>
                    <label className="form-label">Content * <span className="text-gray-400 text-xs">(HTML supported)</span></label>
                    <textarea
                      ref={contentRef}
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      rows={18}
                      placeholder="Write your blog content here. You can use HTML tags like <h2>, <p>, <ul>, <strong>, etc..."
                      className="form-input resize-y font-mono text-sm leading-relaxed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      HTML supported: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;strong&gt;, &lt;a&gt;
                    </p>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                    ℹ️ SEO fields override the defaults. Leave blank to use auto-generated values from title/excerpt.
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="form-label mb-0">Meta Title</label>
                      <CharCount value={form.seo.metaTitle} limit={SEO_CHAR_LIMITS.metaTitle} />
                    </div>
                    <input
                      name="seo.metaTitle"
                      value={form.seo.metaTitle}
                      onChange={handleChange}
                      placeholder={`${form.title} | Kurtuba Locksmith`}
                      className="form-input"
                      maxLength={70}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="form-label mb-0">Meta Description</label>
                      <CharCount value={form.seo.metaDescription} limit={SEO_CHAR_LIMITS.metaDescription} />
                    </div>
                    <textarea
                      name="seo.metaDescription"
                      value={form.seo.metaDescription}
                      onChange={handleChange}
                      placeholder={form.excerpt || 'Describe this blog post for search engines...'}
                      rows={3}
                      className="form-input resize-none"
                      maxLength={160}
                    />
                  </div>

                  <div>
                    <label className="form-label">Focus Keywords <span className="text-gray-400 text-xs">(comma-separated)</span></label>
                    <input
                      name="seo.keywords"
                      value={form.seo.keywords}
                      onChange={handleChange}
                      placeholder="key duplication Ajman, car key UAE, locksmith tips"
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Canonical URL <span className="text-gray-400 text-xs">(optional)</span></label>
                    <input
                      name="seo.canonicalUrl"
                      value={form.seo.canonicalUrl}
                      onChange={handleChange}
                      placeholder={`https://www.kurtubalocksmith.com/blog/${form.slug}`}
                      className="form-input"
                    />
                  </div>

                  <hr className="border-gray-100" />
                  <h4 className="font-semibold text-dark text-sm">Open Graph (Social Media)</h4>

                  <div>
                    <label className="form-label">OG Title</label>
                    <input
                      name="seo.ogTitle"
                      value={form.seo.ogTitle}
                      onChange={handleChange}
                      placeholder={form.seo.metaTitle || form.title}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">OG Description</label>
                    <textarea
                      name="seo.ogDescription"
                      value={form.seo.ogDescription}
                      onChange={handleChange}
                      placeholder={form.seo.metaDescription || form.excerpt}
                      rows={2}
                      className="form-input resize-none"
                    />
                  </div>

                  {/* Sitemap preview */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sitemap URL Preview</p>
                    <p className="text-sm text-blue-600 font-mono break-all">
                      https://www.kurtubalocksmith.com/blog/{form.slug || 'your-blog-slug'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      This URL is automatically added to <code className="bg-gray-200 px-1 rounded">sitemap-blogs.xml</code> when published.
                    </p>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Featured Image URL</label>
                    <input
                      name="featuredImage"
                      value={form.featuredImage}
                      onChange={handleChange}
                      placeholder="https://... or /uploads/blog/image.jpg"
                      className="form-input"
                    />
                    {form.featuredImage && (
                      <div className="mt-3 rounded-xl overflow-hidden aspect-[16/9] bg-gray-100 max-w-sm">
                        <img
                          src={form.featuredImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="form-label">
                      Featured Image Alt Text{' '}
                      <span className="text-gray-400 text-xs">(important for SEO)</span>
                    </label>
                    <input
                      name="featuredImageAlt"
                      value={form.featuredImageAlt}
                      onChange={handleChange}
                      placeholder="Describe the image for accessibility and SEO"
                      className="form-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sidebar Settings ─────────────────────────── */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="card p-5">
            <h3 className="font-semibold text-dark mb-4">Publish Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-input text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="form-input text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">
                  Tags{' '}
                  <span className="text-gray-400 text-xs">(comma-separated)</span>
                </label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="key duplication, UAE, Ajman"
                  className="form-input text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => handleSubmit(e, false)}
                disabled={saving}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg
                           text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Draft
              </button>
              <button
                onClick={(e) => handleSubmit(e, true)}
                disabled={saving}
                className="flex-1 py-2 bg-gold-400 text-dark rounded-lg text-sm
                           font-semibold hover:bg-gold-500 transition-colors"
              >
                {saving ? '...' : form.status === 'published' ? 'Update' : 'Publish'}
              </button>
            </div>
          </div>

          {/* SEO Score Preview */}
          <div className="card p-5">
            <h3 className="font-semibold text-dark mb-3">SEO Checklist</h3>
            <div className="space-y-2">
              {[
                { label: 'Title present', ok: Boolean(form.title) },
                { label: 'Excerpt written', ok: Boolean(form.excerpt) },
                { label: 'Content written', ok: form.content.length > 100 },
                { label: 'Category set', ok: Boolean(form.category) },
                { label: 'Tags added', ok: form.tags.length > 0 },
                { label: 'Meta title set', ok: Boolean(form.seo.metaTitle) },
                { label: 'Meta description set', ok: Boolean(form.seo.metaDescription) },
                { label: 'Focus keywords', ok: Boolean(form.seo.keywords) },
                { label: 'Featured image', ok: Boolean(form.featuredImage) },
                { label: 'Image alt text', ok: Boolean(form.featuredImageAlt) },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <span className={ok ? 'text-green-500' : 'text-gray-300'}>{ok ? '✓' : '○'}</span>
                  <span className={ok ? 'text-gray-700' : 'text-gray-400'}>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              {(() => {
                const checks = [
                  Boolean(form.title), Boolean(form.excerpt), form.content.length > 100,
                  Boolean(form.category), form.tags.length > 0, Boolean(form.seo.metaTitle),
                  Boolean(form.seo.metaDescription), Boolean(form.seo.keywords),
                  Boolean(form.featuredImage), Boolean(form.featuredImageAlt),
                ];
                const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                const color = score >= 80 ? 'text-green-600 bg-green-50' : score >= 50 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                return (
                  <div className={`text-center py-2 rounded-lg ${color}`}>
                    <span className="font-bold text-lg">{score}%</span>
                    <span className="text-xs ml-1">SEO Score</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
