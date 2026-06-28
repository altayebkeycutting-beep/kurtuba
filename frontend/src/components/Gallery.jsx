import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiX, FiZoomIn } from 'react-icons/fi';
import { galleryAPI } from '../api';

const CATEGORIES = ['All', 'Workshop', 'Keys', 'Equipment', 'Team', 'Before-After'];

// Static placeholder gallery when no images are uploaded yet
const PLACEHOLDER_ITEMS = [
  { _id:'p1', title:'Our Workshop', category:'Workshop', color:'from-blue-900 to-blue-700', emoji:'🏪' },
  { _id:'p2', title:'Key Collection', category:'Keys', color:'from-yellow-900 to-yellow-700', emoji:'🔑' },
  { _id:'p3', title:'Cutting Machine', category:'Equipment', color:'from-gray-800 to-gray-600', emoji:'⚙️' },
  { _id:'p4', title:'Expert Team', category:'Team', color:'from-green-900 to-green-700', emoji:'👷' },
  { _id:'p5', title:'Car Keys', category:'Keys', color:'from-orange-900 to-orange-700', emoji:'🚗' },
  { _id:'p6', title:'Lock Repair', category:'Workshop', color:'from-purple-900 to-purple-700', emoji:'🔒' },
  { _id:'p7', title:'Smart Keys', category:'Equipment', color:'from-teal-900 to-teal-700', emoji:'📡' },
  { _id:'p8', title:'Before & After', category:'Before-After', color:'from-pink-900 to-pink-700', emoji:'✨' },
];

const PlaceholderCard = ({ item }) => (
  <div className={`bg-gradient-to-br ${item.color} w-full h-full flex flex-col items-center justify-center p-4`}>
    <span className="text-5xl mb-3">{item.emoji}</span>
    <p className="text-white/80 text-xs text-center font-medium">{item.title}</p>
    <p className="text-white/50 text-xs mt-1">{item.category}</p>
  </div>
);

export default function Gallery({ limit = 8 }) {
  const [images, setImages]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox]           = useState(null);

  useEffect(() => {
    galleryAPI.getFeatured()
      .then((res) => setImages(res.data.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  // Use real images if available, otherwise placeholders
  const source   = images.length > 0 ? images : PLACEHOLDER_ITEMS;
  const filtered = activeCategory === 'All'
    ? source
    : source.filter((img) => img.category === activeCategory);
  const displayed = filtered.slice(0, limit);

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="section-badge">Our Work</span>
          <h2 className="section-title">
            Workshop Gallery &amp;{' '}
            <span className="gradient-text">Work Samples</span>
          </h2>
          <p className="section-subtitle mx-auto">
            A glimpse inside our Ajman workshop and the quality of our locksmith work.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gold-400 text-dark shadow-gold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square skeleton rounded-xl" />
              ))
            : displayed.map((img) => (
                <div key={img._id}
                     className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
                     onClick={() => setLightbox(img)}>
                  {img.imageUrl ? (
                    <img src={img.imageUrl} alt={img.altText || img.title}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                         loading="lazy" />
                  ) : (
                    <PlaceholderCard item={img} />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50
                                  transition-colors duration-300 flex items-center justify-center">
                    <FiZoomIn className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
        </div>

        {/* View Full Gallery CTA */}
        <div className="text-center mt-8">
          <Link to="/gallery" className="btn-primary">
            View Full Gallery
            <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
             onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
                  onClick={() => setLightbox(null)}>
            <FiX size={24} />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            {lightbox.imageUrl ? (
              <img src={lightbox.imageUrl} alt={lightbox.altText || lightbox.title}
                   className="w-full max-h-[80vh] object-contain rounded-xl" />
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden max-h-[70vh]">
                <PlaceholderCard item={lightbox} />
              </div>
            )}
            <p className="text-white text-center mt-3 font-medium">{lightbox.title}</p>
            <p className="text-gray-400 text-sm text-center">{lightbox.category}</p>
          </div>
        </div>
      )}
    </section>
  );
}
