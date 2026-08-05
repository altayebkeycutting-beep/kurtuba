import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiX } from 'react-icons/fi';
import { serviceAPI } from '../../api';
import toast from 'react-hot-toast';

const SERVICE_ICONS = ['🔑', '🚗', '📡', '🔐', '🔒', '🗝️', '🏠', '🏢', '⚙️', '🛡️'];
const CATEGORIES_ICONS = SERVICE_ICONS;

const defaultForm = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  icon: '🔑',
  features: [''],
  price: { from: '', to: '', currency: 'AED', displayText: '' },
  isActive: true,
  isFeatured: false,
  sortOrder: 0,
  seo: { metaTitle: '', metaDescription: '', keywords: '' },
};

const slugify = (str) =>
  str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  useEffect(() => {
    if (!isEdit) return;
    serviceAPI.getAllAdmin()
      .then((res) => {
        const svc = res.data.data.find((s) => s._id === id);
        if (!svc) throw new Error('Not found');
        setForm({
          title: svc.title || '',
          slug: svc.slug || '',
          shortDescription: svc.shortDescription || '',
          fullDescription: svc.fullDescription || '',
          icon: svc.icon || '🔑',
          features: svc.features?.length ? svc.features : [''],
          price: {
            from: svc.price?.from || '',
            to: svc.price?.to || '',
            currency: svc.price?.currency || 'AED',
            displayText: svc.price?.displayText || '',
          },
          isActive: svc.isActive ?? true,
          isFeatured: svc.isFeatured ?? false,
          sortOrder: svc.sortOrder || 0,
          seo: {
            metaTitle: svc.seo?.metaTitle || '',
            metaDescription: svc.seo?.metaDescription || '',
            keywords: svc.seo?.keywords?.join(', ') || '',
          },
        });
        setAutoSlug(false);
      })
      .catch(() => { toast.error('Service not found'); navigate('/admin/services'); })
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name.startsWith('price.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, price: { ...p.price, [key]: val } }));
    } else if (name.startsWith('seo.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, seo: { ...p.seo, [key]: val } }));
    } else {
      setForm((p) => ({ ...p, [name]: val }));
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm((p) => ({ ...p, title, ...(autoSlug ? { slug: slugify(title) } : {}) }));
  };

  const handleFeatureChange = (index, value) => {
    const features = [...form.features];
    features[index] = value;
    setForm((p) => ({ ...p, features }));
  };

  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, ''] }));
  const removeFeature = (index) =>
    setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.shortDescription.trim()) { toast.error('Short description is required'); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        features: form.features.filter((f) => f.trim()),
        price: {
          ...form.price,
          from: form.price.from ? Number(form.price.from) : undefined,
          to: form.price.to ? Number(form.price.to) : undefined,
        },
        seo: {
          ...form.seo,
          keywords: form.seo.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        },
      };

      if (isEdit) {
        await serviceAPI.update(id, payload);
        toast.success('Service updated!');
      } else {
        await serviceAPI.create(payload);
        toast.success('Service created!');
        navigate('/admin/services');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl animate-pulse space-y-4">
        <div className="h-8 skeleton rounded w-48" />
        <div className="h-48 skeleton rounded" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/services"
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <FiArrowLeft />
        </Link>
        <h1 className="text-2xl font-display font-bold text-dark">
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </h1>
      </div>

      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-dark border-b border-gray-100 pb-3">
          Basic Information
        </h2>

        {/* Icon picker */}
        <div>
          <label className="form-label">Icon</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm((p) => ({ ...p, icon }))}
                className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                  form.icon === icon
                    ? 'border-gold-400 bg-gold-50 scale-110'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="form-label">Service Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleTitleChange}
            placeholder="e.g. Car Key Duplication"
            className="form-input"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="form-label">URL Slug</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">/services/</span>
            <input
              name="slug"
              value={form.slug}
              onChange={(e) => { setForm((p) => ({ ...p, slug: e.target.value })); setAutoSlug(false); }}
              placeholder="car-key-duplication"
              className="form-input flex-1"
            />
          </div>
        </div>

        {/* Short description */}
        <div>
          <label className="form-label">Short Description * <span className="text-gray-400 text-xs">(shown in cards, max 300 chars)</span></label>
          <textarea
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="Brief description shown in the services grid..."
            rows={2}
            maxLength={300}
            className="form-input resize-none"
            required
          />
          <p className="text-right text-xs text-gray-400 mt-1">{form.shortDescription.length}/300</p>
        </div>

        {/* Full description */}
        <div>
          <label className="form-label">Full Description <span className="text-gray-400 text-xs">(optional, for service detail page)</span></label>
          <textarea
            name="fullDescription"
            value={form.fullDescription}
            onChange={handleChange}
            placeholder="Detailed description for the service page..."
            rows={4}
            className="form-input resize-none"
          />
        </div>
      </div>

      {/* Features */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-dark border-b border-gray-100 pb-3">
          Features / Highlights
        </h2>
        <div className="space-y-2">
          {form.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1} (e.g. All car brands)`}
                className="form-input text-sm flex-1"
              />
              {form.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700
                     font-medium transition-colors"
        >
          <FiPlus size={15} />
          Add Feature
        </button>
      </div>

      {/* Pricing */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-dark border-b border-gray-100 pb-3">
          Pricing
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Price From</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">AED</span>
              <input
                type="number"
                name="price.from"
                value={form.price.from}
                onChange={handleChange}
                placeholder="25"
                className="form-input"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Price To <span className="text-gray-400 text-xs">(optional)</span></label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">AED</span>
              <input
                type="number"
                name="price.to"
                value={form.price.to}
                onChange={handleChange}
                placeholder="150"
                className="form-input"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="form-label">Sort Order</label>
            <input
              type="number"
              name="sortOrder"
              value={form.sortOrder}
              onChange={handleChange}
              placeholder="1"
              className="form-input"
              min="0"
            />
          </div>
        </div>
        <div>
          <label className="form-label">Display Text <span className="text-gray-400 text-xs">(shown on card)</span></label>
          <input
            name="price.displayText"
            value={form.price.displayText}
            onChange={handleChange}
            placeholder="Starting from AED 25"
            className="form-input"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-dark border-b border-gray-100 pb-3">
          🔍 SEO Settings
        </h2>
        <div>
          <label className="form-label">Meta Title <span className="text-gray-400 text-xs">(max 70 chars)</span></label>
          <input
            name="seo.metaTitle"
            value={form.seo.metaTitle}
            onChange={handleChange}
            placeholder={`${form.title} | Kurtuba Locksmith`}
            maxLength={70}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">Meta Description <span className="text-gray-400 text-xs">(max 160 chars)</span></label>
          <textarea
            name="seo.metaDescription"
            value={form.seo.metaDescription}
            onChange={handleChange}
            placeholder={form.shortDescription}
            maxLength={160}
            rows={2}
            className="form-input resize-none"
          />
        </div>
        <div>
          <label className="form-label">Keywords <span className="text-gray-400 text-xs">(comma-separated)</span></label>
          <input
            name="seo.keywords"
            value={form.seo.keywords}
            onChange={handleChange}
            placeholder="car key UAE, key duplication Ajman"
            className="form-input"
          />
        </div>
      </div>

      {/* Visibility Settings */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-dark border-b border-gray-100 pb-3 mb-4">
          Visibility
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-gold-400"
            />
            <div>
              <p className="text-sm font-medium text-dark">Active</p>
              <p className="text-xs text-gray-400">Show this service on the website</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 accent-gold-400"
            />
            <div>
              <p className="text-sm font-medium text-dark">Featured</p>
              <p className="text-xs text-gray-400">Show on homepage services section</p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3">
        <Link
          to="/admin/services"
          className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg
                     text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave />
              {isEdit ? 'Update Service' : 'Create Service'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
