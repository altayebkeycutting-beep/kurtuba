import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';

const navLinks = [
  { label: 'Home',     path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Gallery',  path: '/gallery' },
  { label: 'About',    path: '/about' },
  { label: 'Blog',     path: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark shadow-xl shadow-black/20' : 'bg-dark/95 backdrop-blur-sm'
    }`}>
      {/* Top strip */}
      <div className="bg-gold-400 text-dark py-1.5 text-center text-xs font-semibold hidden sm:block">
        🔑 Professional Key Duplication &amp; Locksmith Services — Ajman, UAE
        &nbsp;|&nbsp;
        <a href="tel:+971523433077" className="underline hover:no-underline">Call: +971 52 343 3077</a>
      </div>

      {/* Main nav */}
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gold-400 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <GiKey className="text-dark text-xl" />
            </div>
            <div>
              <span className="text-white font-display font-bold text-lg leading-none block">
                Kurtuba Locksmith
              </span>
              <span className="text-gold-400 text-xs font-medium leading-none">
                Ajman, UAE
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, path }) => (
              <Link key={path} to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? 'text-gold-400 bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <a href="tel:+971523433077"
               className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gold-400 text-dark rounded-lg text-sm font-semibold hover:bg-gold-500 transition-colors">
              <FiPhone className="text-base" /> Call Us
            </a>
            <button onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Toggle menu">
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-primary-600 rounded-xl mb-3 overflow-hidden animate-fade-in">
            <div className="py-2 px-3 space-y-1">
              {navLinks.map(({ label, path }) => (
                <Link key={path} to={path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(path) ? 'text-gold-400 bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}>
                  {label}
                </Link>
              ))}
              <a href="tel:+971523433077"
                 className="flex items-center gap-2 px-4 py-3 bg-gold-400 text-dark rounded-lg text-sm font-semibold mt-2">
                <FiPhone /> Call: +971 52 343 3077
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
