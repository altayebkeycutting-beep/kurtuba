import { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiFileText, FiImage, FiMail, FiSettings, FiLogOut, FiTool, FiMenu, FiX } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { icon: FiHome,     label: 'Dashboard', path: '/admin' },
  { icon: FiFileText, label: 'Blog Posts', path: '/admin/blogs' },
  { icon: FiTool,     label: 'Services',   path: '/admin/services' },
  { icon: FiImage,    label: 'Gallery',    path: '/admin/gallery' },
  { icon: FiMail,     label: 'Contacts',   path: '/admin/contacts' },
  { icon: FiSettings, label: 'SEO',        path: '/admin/seo' },
];

export default function AdminLayout() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/admin/login'); };

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-dark flex flex-col
                         transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-gold-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <GiKey className="text-dark text-lg" />
          </div>
          <div>
            <p className="text-white font-display font-bold text-sm leading-none">Kurtuba Locksmith</p>
            <p className="text-gold-400 text-xs">Admin Panel</p>
          </div>
          <button className="ml-auto text-gray-400 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link key={path} to={path} className={`admin-nav-link ${isActive(path) ? 'active' : ''}`}>
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gold-400/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2
                         bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-xs transition-colors">
              🌐 View Site
            </Link>
            <button onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2
                         bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-xs transition-colors">
              <FiLogOut size={13} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-dark rounded-lg hover:bg-gray-100">
            <FiMenu size={20} />
          </button>
          <span className="font-display font-bold text-dark">Kurtuba Locksmith Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
