import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Public pages
import Home        from './pages/Home';
import BlogList    from './pages/BlogList';
import BlogDetail  from './pages/BlogDetail';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage   from './pages/AboutPage';
import NotFound    from './pages/NotFound';

// Admin pages (lazy loaded)
const AdminLogin       = lazy(() => import('./admin/Login'));
const AdminLayout      = lazy(() => import('./admin/AdminLayout'));
const Dashboard        = lazy(() => import('./admin/Dashboard'));
const AdminBlogList    = lazy(() => import('./admin/blogs/BlogList'));
const AdminBlogForm    = lazy(() => import('./admin/blogs/BlogForm'));
const AdminServiceList = lazy(() => import('./admin/services/ServiceList'));
const AdminServiceForm = lazy(() => import('./admin/services/ServiceForm'));
const AdminGallery     = lazy(() => import('./admin/gallery/GalleryManager'));
const AdminContacts    = lazy(() => import('./admin/contacts/ContactList'));
const AdminSeo         = lazy(() => import('./admin/seo/SeoSettings'));

const AdminLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">Loading admin panel...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/"          element={<Home />} />
      <Route path="/services"  element={<ServicesPage />} />
      <Route path="/gallery"   element={<GalleryPage />} />
      <Route path="/about"     element={<AboutPage />} />
      <Route path="/blog"      element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />

      {/* ── Admin Routes ── */}
      <Route path="/admin/login" element={<Suspense fallback={<AdminLoader />}><AdminLogin /></Suspense>} />
      <Route path="/admin"       element={<Suspense fallback={<AdminLoader />}><AdminLayout /></Suspense>}>
        <Route index                     element={<Dashboard />} />
        <Route path="blogs"              element={<AdminBlogList />} />
        <Route path="blogs/new"          element={<AdminBlogForm />} />
        <Route path="blogs/edit/:id"     element={<AdminBlogForm />} />
        <Route path="services"           element={<AdminServiceList />} />
        <Route path="services/new"       element={<AdminServiceForm />} />
        <Route path="services/edit/:id"  element={<AdminServiceForm />} />
        <Route path="gallery"            element={<AdminGallery />} />
        <Route path="contacts"           element={<AdminContacts />} />
        <Route path="seo"                element={<AdminSeo />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
