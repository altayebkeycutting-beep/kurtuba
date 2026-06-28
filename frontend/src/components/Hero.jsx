import { FiPhone, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Keys Cut' },
  { value: '5,000+',  label: 'Happy Customers' },
  { value: '500+',    label: 'Car Models' },
  { value: '14+',     label: 'Years Experience' },
];

const badges = [
  'House Keys', 'Car Keys', 'Remote Programming', 'Smart Keys', 'Lock Repair',
];

export default function Hero() {
  return (
    <section className="relative bg-hero min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-2 key-pattern opacity-30" />
      </div>

      <div className="section-container relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-400/10
                            border border-gold-400/30 rounded-full mb-6">
              <GiKey className="text-gold-400 text-sm" />
              <span className="text-gold-400 text-sm font-medium">
                #1 Locksmith in Ajman, UAE
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold
                           text-white leading-tight mb-6">
              Kurtuba{' '}
              <span className="gradient-text">Locksmith</span>
              {' '}Ajman
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              Fast, accurate, and affordable key duplication &amp; locksmith services in Ajman.
              From simple house keys to complex car transponders — ready in minutes.
            </p>

            {/* Service badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {badges.map((b) => (
                <span key={b}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5
                             border border-white/10 rounded-full text-sm text-gray-300">
                  <FiCheckCircle className="text-gold-400 text-xs flex-shrink-0" />
                  {b}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a href="tel:+971523433077" className="btn-primary text-base">
                <FiPhone /> Call Now
              </a>
              <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
                 target="_blank" rel="noopener noreferrer"
                 className="btn-outline text-base">
                <FiMapPin /> Get Directions
              </a>
              <Link to="/services" className="btn-secondary text-base">
                Our Services <FiArrowRight />
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in">
            <div className="relative">
              <div className="w-72 h-72 bg-gradient-to-br from-gold-400/20 to-gold-600/10
                              rounded-full flex items-center justify-center
                              border border-gold-400/20 animate-pulse-slow">
                <div className="w-52 h-52 bg-gradient-to-br from-gold-400/30 to-gold-600/20
                                rounded-full flex items-center justify-center
                                border border-gold-400/30">
                  <GiKey className="text-gold-400 text-9xl animate-float" />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-8 bg-white rounded-xl p-3 shadow-xl
                              animate-slide-in-right flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" />
                </div>
                <div>
                  <p className="text-dark text-xs font-bold">Ready in 5 min</p>
                  <p className="text-gray-500 text-xs">Most house keys</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-8 bg-white rounded-xl p-3 shadow-xl
                              animate-slide-in-right flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-400/10 rounded-lg flex items-center justify-center">
                  <GiKey className="text-gold-600 text-sm" />
                </div>
                <div>
                  <p className="text-dark text-xs font-bold">All Car Brands</p>
                  <p className="text-gray-500 text-xs">Toyota, BMW, Ford...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-white/10">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-display font-bold text-gold-400">{value}</div>
              <div className="text-gray-400 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
