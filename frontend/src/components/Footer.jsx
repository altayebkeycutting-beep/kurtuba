import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';

const quickLinks = [
  { label: 'Home',     to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Gallery',  to: '/gallery' },
  { label: 'About',    to: '/about' },
  { label: 'Blog',     to: '/blog' },
  { label: 'Contact',  to: '/#contact' },
];

const services = [
  'House Key Duplication',
  'Car Key Duplication',
  'Remote Key Programming',
  'Smart Key Services',
  'Lock Repair & Replacement',
  'Master Key Systems',
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-gray-300">
      <div className="h-1.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      <div className="section-container py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gold-400 rounded-lg flex items-center justify-center">
                <GiKey className="text-dark text-xl" />
              </div>
              <div>
                <span className="text-white font-display font-bold text-xl leading-none block">
                  Kurtuba Locksmith
                </span>
                <span className="text-gold-400 text-xs">Ajman, UAE</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Ajman's most trusted key duplication and locksmith experts since 2010.
              Fast service, quality results, unbeatable prices.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook"
                 className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-gold-400 hover:text-dark text-gray-400 transition-all">
                <FiFacebook size={16} />
              </a>
              <a href="#" aria-label="Instagram"
                 className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-gold-400 hover:text-dark text-gray-400 transition-all">
                <FiInstagram size={16} />
              </a>
              <a href="https://wa.me/971523433077" aria-label="WhatsApp"
                 className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center hover:bg-green-500 hover:text-white text-gray-400 transition-all text-sm">
                💬
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-display font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 text-sm hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="text-gold-400 text-xs">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-display font-bold text-lg mb-5">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-gray-400 text-sm hover:text-gold-400 transition-colors flex items-center gap-2">
                    <span className="text-gold-400 text-xs">›</span>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-display font-bold text-lg mb-5">Contact Info</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+971523433077" className="flex items-start gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <FiPhone className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">+971 52 343 3077</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@kurtubalocksmith.com" className="flex items-start gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <FiMail className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">info@kurtubalocksmith.com</span>
                </a>
              </li>
              <li>
                <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67" target="_blank"
                   rel="noopener noreferrer" className="flex items-start gap-3 text-gray-400 hover:text-gold-400 transition-colors group">
                  <FiMapPin className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Ajman, United Arab Emirates</span>
                </a>
              </li>
              <li className="text-sm text-gray-500">
                🕐 Mon–Sat: 9am – 9pm<br />
                🕐 Sunday: 10am – 6pm
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© {year} Kurtuba Locksmith, Ajman. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Ajman · UAE</span>
            <span>|</span>
            <Link to="/admin/login" className="hover:text-gold-400 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
