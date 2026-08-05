import { useState, useEffect } from 'react';
import { FiSave, FiInfo, FiExternalLink } from 'react-icons/fi';
import { seoAPI } from '../../api';
import toast from 'react-hot-toast';

const PAGES = [
  { key: 'home',     label: '🏠 Home',     path: '/' },
  { key: 'services', label: '🔑 Services', path: '/services' },
  { key: 'blog',     label: '📝 Blog',     path: '/blog' },
  { key: 'contact',  label: '📞 Contact',  path: '/contact' },
  { key: 'about',    label: 'ℹ️ About',    path: '/about' },
  { key: 'global',   label: '🌐 Global',   path: null },
];

const CharBar = ({ value = '', limit, label }) => {
  const len = (value || '').length;
  const pct = Math.min((len / limit) * 100, 100);
  const color = len > limit ? 'bg-red-500' : len > limit * 0.85 ? 'bg-yellow-400' : 'bg-green-500';
  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-400">{label}</span>
        <span className={len > limit ? 'text-red-500 font-medium' : 'text-gray-400'}>
          {len}/{limit}
        </span>
      </div>
      <div className="h-1 bg-gray-100 rounded-full">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const defaultPageSeo = {
  metaTitle: '', metaDescription: '', keywords: '',
  ogTitle: '', ogDescription: '', ogImage: '', canonicalUrl: '',
};

const defaultGlobal = {
  siteName: 'Kurtuba Locksmith - Professional Key Duplication Ajman',
  siteDescription: '',
  googleAnalyticsId: '',
  googleVerification: '',
  bingVerification: '',
  facebookPixelId: '',
  businessSchema: {
    name: 'Kurtuba Locksmith',
    address: 'Ajman, United Arab Emirates',
    phone: '+971 52 343 3077',
    email: 'info@kurtubalocksmith.com',
    latitude: 25.3886,
    longitude: 55.3945,
    priceRange: '$',
    openingHours: ['Mo-Sa 09:00-21:00', 'Su 10:00-18:00'],
  },
};

export default function SeoSettings() {
  const [activePage, setActivePage] = useState('home');
  const [settings, setSettings] = useState({});
  const [globalSettings, setGlobalSettings] = useState(defaultGlobal);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    seoAPI.getAll()
      .then((res) => {
        const map = {};
        res.data.data.forEach((s) => {
          if (s.page === 'global') {
            setGlobalSettings({
              ...defaultGlobal,
              ...s.globalSettings,
              businessSchema: { ...defaultGlobal.businessSchema, ...s.globalSettings?.businessSchema },
            });
          } else {
            map[s.page] = {
              metaTitle: s.metaTitle || '',
              metaDescription: s.metaDescription || '',
              keywords: s.keywords?.join(', ') || '',
              ogTitle: s.ogTitle || '',
              ogDescription: s.ogDescription || '',
              ogImage: s.ogImage || '',
              canonicalUrl: s.canonicalUrl || '',
            };
          }
        });
        setSettings(map);
      })
      .catch(() => toast.error('Failed to load SEO settings'))
      .finally(() => setLoading(false));
  }, []);

  const getPageData = () => settings[activePage] || { ...defaultPageSeo };

  const updateField = (field, value) => {
    if (activePage === 'global') {
      if (field.startsWith('businessSchema.')) {
        const key = field.split('.')[1];
        setGlobalSettings((p) => ({
          ...p,
          businessSchema: { ...p.businessSchema, [key]: value },
        }));
      } else {
        setGlobalSettings((p) => ({ ...p, [field]: value }));
      }
    } else {
      setSettings((p) => ({
        ...p,
        [activePage]: { ...getPageData(), [field]: value },
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activePage === 'global') {
        await seoAPI.updatePage('global', { globalSettings });
      } else {
        const data = getPageData();
        await seoAPI.updatePage(activePage, {
          ...data,
          keywords: data.keywords.split(',').map((k) => k.trim()).filter(Boolean),
        });
      }
      toast.success('SEO settings saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl animate-pulse space-y-4">
        <div className="h-8 skeleton rounded w-48" />
        <div className="h-64 skeleton rounded" />
      </div>
    );
  }

  const pageData = getPageData();
  const currentPage = PAGES.find((p) => p.key === activePage);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">SEO Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage meta tags, Open Graph, and structured data for each page.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <FiSave /> Save Settings
            </>
          )}
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl
                      p-4 text-sm text-blue-700">
        <FiInfo className="flex-shrink-0 mt-0.5" />
        <div>
          Blog posts have their own individual SEO settings — edit them in the{' '}
          <strong>Blog editor</strong> under the SEO tab. This panel controls page-level settings.
          <br />
          Each published blog is automatically included in{' '}
          <code className="bg-blue-100 px-1 rounded text-xs">/sitemap-blogs.xml</code>.
        </div>
      </div>

      <div className="grid md:grid-cols-[200px_1fr] gap-6">
        {/* Page tabs */}
        <div className="space-y-1">
          {PAGES.map(({ key, label, path }) => (
            <button
              key={key}
              onClick={() => setActivePage(key)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
                          transition-all ${
                            activePage === key
                              ? 'bg-gold-400 text-dark'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
            >
              <span>{label}</span>
              {path && (
                <span className="text-xs opacity-60 block mt-0.5 font-mono">{path}</span>
              )}
            </button>
          ))}
        </div>

        {/* Settings panel */}
        <div className="space-y-5">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-dark text-lg">{currentPage?.label} Settings</h2>
            {currentPage?.path && (
              <a
                href={currentPage.path}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gold-600 hover:underline"
              >
                <FiExternalLink size={12} /> Preview page
              </a>
            )}
          </div>

          {activePage === 'global' ? (
            /* ── Global Settings ─────────────────────────── */
            <div className="space-y-5">
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-dark">Site Identity</h3>
                <div>
                  <label className="form-label">Site Name</label>
                  <input
                    value={globalSettings.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Site Description</label>
                  <textarea
                    value={globalSettings.siteDescription}
                    onChange={(e) => updateField('siteDescription', e.target.value)}
                    rows={2}
                    className="form-input resize-none"
                  />
                </div>
              </div>

              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-dark">Analytics & Verification</h3>
                {[
                  { field: 'googleAnalyticsId', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
                  { field: 'googleVerification', label: 'Google Search Console Verification', placeholder: 'google-site-verification=...' },
                  { field: 'bingVerification', label: 'Bing Verification', placeholder: 'msvalidate.01=...' },
                  { field: 'facebookPixelId', label: 'Facebook Pixel ID', placeholder: '123456789' },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="form-label">{label}</label>
                    <input
                      value={globalSettings[field] || ''}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={placeholder}
                      className="form-input font-mono text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-dark">Local Business Schema (JSON-LD)</h3>
                <p className="text-xs text-gray-500">
                  This powers your Google Business knowledge panel and rich results.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { field: 'name', label: 'Business Name' },
                    { field: 'phone', label: 'Phone' },
                    { field: 'email', label: 'Email' },
                    { field: 'priceRange', label: 'Price Range ($, $$, $$$)' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input
                        value={globalSettings.businessSchema[field] || ''}
                        onChange={(e) => updateField(`businessSchema.${field}`, e.target.value)}
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <input
                    value={globalSettings.businessSchema.address || ''}
                    onChange={(e) => updateField('businessSchema.address', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={globalSettings.businessSchema.latitude || ''}
                      onChange={(e) => updateField('businessSchema.latitude', parseFloat(e.target.value))}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={globalSettings.businessSchema.longitude || ''}
                      onChange={(e) => updateField('businessSchema.longitude', parseFloat(e.target.value))}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Per-Page SEO ─────────────────────────────── */
            <div className="space-y-5">
              {/* Meta Tags */}
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-dark">Meta Tags</h3>
                <div>
                  <label className="form-label">Meta Title</label>
                  <input
                    value={pageData.metaTitle}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    placeholder="Page title for search results..."
                    className="form-input"
                    maxLength={70}
                  />
                  <CharBar value={pageData.metaTitle} limit={70} label="Recommended: 50–70 chars" />
                </div>
                <div>
                  <label className="form-label">Meta Description</label>
                  <textarea
                    value={pageData.metaDescription}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    placeholder="Page description shown in search results..."
                    rows={3}
                    className="form-input resize-none"
                    maxLength={160}
                  />
                  <CharBar value={pageData.metaDescription} limit={160} label="Recommended: 120–160 chars" />
                </div>
                <div>
                  <label className="form-label">Keywords <span className="text-gray-400 text-xs">(comma-separated)</span></label>
                  <input
                    value={pageData.keywords}
                    onChange={(e) => updateField('keywords', e.target.value)}
                    placeholder="key duplication Ajman, locksmith UAE..."
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Canonical URL <span className="text-gray-400 text-xs">(optional)</span></label>
                  <input
                    value={pageData.canonicalUrl}
                    onChange={(e) => updateField('canonicalUrl', e.target.value)}
                    placeholder="https://www.kurtubalocksmith.com/..."
                    className="form-input font-mono text-sm"
                  />
                </div>
              </div>

              {/* Open Graph */}
              <div className="card p-5 space-y-4">
                <h3 className="font-semibold text-dark">Open Graph (Social Sharing)</h3>
                <div>
                  <label className="form-label">OG Title <span className="text-gray-400 text-xs">(overrides Meta Title for social)</span></label>
                  <input
                    value={pageData.ogTitle}
                    onChange={(e) => updateField('ogTitle', e.target.value)}
                    placeholder={pageData.metaTitle || 'Same as meta title if empty'}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">OG Description</label>
                  <textarea
                    value={pageData.ogDescription}
                    onChange={(e) => updateField('ogDescription', e.target.value)}
                    placeholder={pageData.metaDescription || 'Same as meta description if empty'}
                    rows={2}
                    className="form-input resize-none"
                  />
                </div>
                <div>
                  <label className="form-label">OG Image URL</label>
                  <input
                    value={pageData.ogImage}
                    onChange={(e) => updateField('ogImage', e.target.value)}
                    placeholder="https://... (1200×630px recommended)"
                    className="form-input"
                  />
                  {pageData.ogImage && (
                    <img
                      src={pageData.ogImage}
                      alt="OG preview"
                      className="mt-2 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </div>
              </div>

              {/* SERP Preview */}
              <div className="card p-5">
                <h3 className="font-semibold text-dark mb-3">Google SERP Preview</h3>
                <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-lg">
                  <p className="text-xs text-green-700 mb-1">
                    kurtubalocksmith.com{currentPage?.path || ''}
                  </p>
                  <p className="text-blue-600 text-base font-medium hover:underline cursor-pointer line-clamp-1">
                    {pageData.metaTitle || `Kurtuba Locksmith${currentPage?.label ? ' - ' + currentPage.label : ''}`}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {pageData.metaDescription || 'Professional key duplication and locksmith services in Ajman, UAE...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Save button (bottom) */}
          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary text-sm">
              {saving ? 'Saving...' : <><FiSave /> Save {currentPage?.label} Settings</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
