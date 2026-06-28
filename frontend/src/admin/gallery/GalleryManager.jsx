import { useState, useEffect, useRef } from 'react';
import { FiUpload, FiTrash2, FiStar, FiToggleLeft, FiToggleRight, FiX, FiImage } from 'react-icons/fi';
import { galleryAPI } from '../../api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Workshop', 'Keys', 'Equipment', 'Team', 'Before-After', 'General'];

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [preview, setPreview] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '', altText: '', category: 'General', description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await galleryAPI.getAllAdmin();
      setImages(res.data.data);
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setFilePreview(ev.target.result);
    reader.readAsDataURL(file);
    if (!uploadForm.title) {
      setUploadForm((p) => ({
        ...p,
        title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error('Please select an image first'); return; }
    if (!uploadForm.title.trim()) { toast.error('Title is required'); return; }
    if (!uploadForm.altText.trim()) { toast.error('Alt text is required for SEO'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v));

      await galleryAPI.upload(formData);
      toast.success('Image uploaded successfully!');
      setSelectedFile(null);
      setFilePreview(null);
      setUploadForm({ title: '', altText: '', category: 'General', description: '' });
      setShowUploadPanel(false);
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image permanently?')) return;
    setDeleting(id);
    try {
      await galleryAPI.delete(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (img, field) => {
    try {
      await galleryAPI.update(img._id, { [field]: !img[field] });
      setImages((prev) =>
        prev.map((i) => i._id === img._id ? { ...i, [field]: !i[field] } : i)
      );
    } catch {
      toast.error('Failed to update image');
    }
  };

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Gallery</h1>
          <p className="text-gray-500 text-sm mt-0.5">{images.length} total images</p>
        </div>
        <button
          onClick={() => setShowUploadPanel(true)}
          className="btn-primary text-sm w-fit"
        >
          <FiUpload />
          Upload Image
        </button>
      </div>

      {/* Upload Panel Modal */}
      {showUploadPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-dark text-xl">Upload Image</h2>
              <button
                onClick={() => { setShowUploadPanel(false); setSelectedFile(null); setFilePreview(null); }}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-gold-400
                         rounded-xl p-6 text-center cursor-pointer transition-colors mb-4
                         bg-gray-50 hover:bg-gold-50/30"
            >
              {filePreview ? (
                <img src={filePreview} alt="preview" className="h-32 mx-auto object-cover rounded-lg" />
              ) : (
                <>
                  <FiImage className="text-3xl text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Drop image here or <span className="text-gold-600 font-medium">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 5MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="form-label text-xs">Title *</label>
                  <input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Workshop photo"
                    className="form-input text-sm py-2"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm((p) => ({ ...p, category: e.target.value }))}
                    className="form-input text-sm py-2"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label text-xs">Alt Text * <span className="text-gray-400">(for SEO)</span></label>
                <input
                  value={uploadForm.altText}
                  onChange={(e) => setUploadForm((p) => ({ ...p, altText: e.target.value }))}
                  placeholder="Professional key cutting machine Ajman"
                  className="form-input text-sm py-2"
                />
              </div>
              <div>
                <label className="form-label text-xs">Description <span className="text-gray-400">(optional)</span></label>
                <input
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Brief description of the image"
                  className="form-input text-sm py-2"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowUploadPanel(false); setSelectedFile(null); setFilePreview(null); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg
                           text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="flex-1 py-2.5 bg-gold-400 text-dark rounded-lg text-sm
                           font-semibold hover:bg-gold-500 disabled:opacity-50
                           disabled:cursor-not-allowed transition-colors flex items-center
                           justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload size={15} />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-gold-400 text-dark'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square skeleton rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <FiImage className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-dark mb-2">No images yet</h3>
          <p className="text-gray-500 mb-4">Upload your first gallery image.</p>
          <button onClick={() => setShowUploadPanel(true)} className="btn-primary mx-auto w-fit">
            <FiUpload /> Upload Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((img) => (
            <div
              key={img._id}
              className={`relative rounded-xl overflow-hidden group aspect-square bg-gray-100
                          ${!img.isActive ? 'opacity-50' : ''}`}
            >
              {img.imageUrl ? (
                <img
                  src={img.imageUrl}
                  alt={img.altText || img.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreview(img)}
                />
              ) : (
                <div
                  className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700
                              flex items-center justify-center cursor-pointer"
                  onClick={() => setPreview(img)}
                >
                  <span className="text-white text-xs text-center px-2">{img.title}</span>
                </div>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60
                              transition-all duration-200 flex items-end justify-end p-2 gap-1.5">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                  {/* Featured toggle */}
                  <button
                    onClick={() => handleToggle(img, 'isFeatured')}
                    className={`p-1.5 rounded-lg text-white transition-colors ${
                      img.isFeatured ? 'bg-gold-400/90' : 'bg-white/20 hover:bg-white/30'
                    }`}
                    title={img.isFeatured ? 'Remove from featured' : 'Mark featured'}
                  >
                    <FiStar size={14} />
                  </button>
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggle(img, 'isActive')}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title={img.isActive ? 'Hide' : 'Show'}
                  >
                    {img.isActive ? <FiToggleRight size={14} /> : <FiToggleLeft size={14} />}
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(img._id)}
                    disabled={deleting === img._id}
                    className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white
                               transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === img._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Featured badge */}
              {img.isFeatured && (
                <div className="absolute top-2 left-2 bg-gold-400 text-dark text-xs
                                font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <FiStar size={9} /> Featured
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full"
            onClick={() => setPreview(null)}
          >
            <FiX size={22} />
          </button>
          <div onClick={(e) => e.stopPropagation()} className="max-w-2xl w-full">
            {preview.imageUrl && (
              <img
                src={preview.imageUrl}
                alt={preview.altText}
                className="w-full max-h-[75vh] object-contain rounded-xl"
              />
            )}
            <div className="text-center mt-3">
              <p className="text-white font-medium">{preview.title}</p>
              <p className="text-gray-400 text-xs mt-1">{preview.category} · {preview.altText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
