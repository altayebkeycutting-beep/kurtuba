import { useState, useEffect } from 'react';
import { FiX, FiZoomIn, FiFilter } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { galleryAPI } from '../api';

const CATEGORIES = ['All', 'Workshop', 'Keys', 'Equipment', 'Team', 'Before-After', 'General'];

const PLACEHOLDER_ITEMS = [
  { _id:'p1',  title:'Our Ajman Workshop',        category:'Workshop',    color:'from-blue-900 to-blue-700',   emoji:'🏪' },
  { _id:'p2',  title:'Key Collection',            category:'Keys',        color:'from-yellow-900 to-yellow-700',emoji:'🔑' },
  { _id:'p3',  title:'Key Cutting Machine',       category:'Equipment',   color:'from-gray-800 to-gray-600',   emoji:'⚙️' },
  { _id:'p4',  title:'Our Expert Team',           category:'Team',        color:'from-green-900 to-green-700', emoji:'👷' },
  { _id:'p5',  title:'Car Key Programming',       category:'Keys',        color:'from-orange-900 to-orange-700',emoji:'🚗' },
  { _id:'p6',  title:'Lock Repair Work',          category:'Workshop',    color:'from-purple-900 to-purple-700',emoji:'🔒' },
  { _id:'p7',  title:'Smart Key Equipment',       category:'Equipment',   color:'from-teal-900 to-teal-700',   emoji:'📡' },
  { _id:'p8',  title:'Before & After Repair',     category:'Before-After',color:'from-pink-900 to-pink-700',   emoji:'✨' },
  { _id:'p9',  title:'Remote Keys Display',       category:'Keys',        color:'from-red-900 to-red-700',     emoji:'📻' },
  { _id:'p10', title:'Shop Front',                category:'Workshop',    color:'from-indigo-900 to-indigo-700',emoji:'🏬' },
  { _id:'p11', title:'Transponder Keys',          category:'Keys',        color:'from-amber-900 to-amber-700', emoji:'🔐' },
  { _id:'p12', title:'Workshop Equipment',        category:'Equipment',   color:'from-cyan-900 to-cyan-700',   emoji:'🛠️' },
];

const PlaceholderCard = ({ item }) => (
  <div className={`bg-gradient-to-br ${item.color} w-full h-full flex flex-col items-center justify-center p-3`}>
    <span className="text-4xl mb-2">{item.emoji}</span>
    <p className="text-white/80 text-xs text-center font-medium leading-tight">{item.title}</p>
  </div>
);

export default function GalleryPage() {
  const [images, setImages]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox]           = useState(null);

  useEffect(() => {
    galleryAPI.getAll()
      .then((res) => setImages(res.data.data || []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const source   = images.length > 0 ? images : PLACEHOLDER_ITEMS;
  const filtered = activeCategory === 'All'
    ? source
    : source.filter((img) => img.category === activeCategory);

  return (
    <>
      <SEOHead
        title="Gallery — Workshop & Key Work Photos | Kurtuba Locksmith Ajman"
        description="Browse our gallery of key duplication work, workshop photos, and locksmith services in Ajman, UAE. See our equipment and team at Kurtuba Locksmith."
        keywords={['locksmith gallery Ajman','key shop photos UAE','Kurtuba Locksmith workshop']}
        canonical={`${window.location.origin}/gallery`}
      />
      <Navbar />

      <main className="pt-28 min-h-screen bg-light pb-16">
        {/* Page header */}
        <div className="bg-dark py-14 px-4">
          <div className="section-container text-center">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30
                             text-gold-400 text-sm font-semibold rounded-full mb-4">
              Photo Gallery
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Our Workshop &amp; Work Samples
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Take a look inside our Ajman key shop — our equipment, team, and the quality of our work.
            </p>
          </div>
        </div>

        <div className="section-container mt-10">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <FiFilter className="text-gray-400 self-center mr-1" />
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-gold-400 text-dark shadow-gold'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Count */}
          {!loading && (
            <p className="text-gray-500 text-sm text-center mb-6">
              {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-square skeleton rounded-xl" />
                ))
              : filtered.map((img) => (
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
                    <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-300
                                    flex items-center justify-center">
                      <FiZoomIn className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {img.isFeatured && (
                      <span className="absolute top-2 left-2 bg-gold-400 text-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                ))}
          </div>

          {/* Upload CTA */}
          <div className="text-center mt-12 card p-8">
            <div className="text-4xl mb-3">📸</div>
            <h3 className="font-display font-bold text-dark text-xl mb-2">
              More photos coming soon!
            </h3>
            <p className="text-gray-500 text-sm">
              Visit our shop in Ajman to see our work in person.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <a href="tel:+971523433077" className="btn-primary text-sm">📞 Call Us</a>
              <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67" target="_blank"
                 rel="noopener noreferrer" className="btn-secondary text-sm">📍 Visit Shop</a>
            </div>
          </div>
        </div>
      </main>

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
              <div className="aspect-video rounded-xl overflow-hidden max-w-2xl mx-auto">
                <PlaceholderCard item={lightbox} />
              </div>
            )}
            <p className="text-white text-center mt-3 font-medium">{lightbox.title}</p>
            <p className="text-gray-400 text-sm text-center">{lightbox.category}</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
