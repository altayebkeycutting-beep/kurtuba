import { FiAward, FiClock, FiShield, FiUsers } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';

const trustPoints = [
  {
    icon: FiAward,
    title: '10+ Years Experience',
    desc: 'Over a decade of expertise in key cutting and locksmith services across UAE.',
  },
  {
    icon: FiClock,
    title: 'Fast Turnaround',
    desc: 'Most house keys done in under 5 minutes. Car keys typically within the hour.',
  },
  {
    icon: FiShield,
    title: 'Quality Guarantee',
    desc: 'Every key is tested before handover. Not satisfied? We fix it free.',
  },
  {
    icon: FiUsers,
    title: '5,000+ Customers',
    desc: 'Trusted by thousands of residents and businesses across Ajman and UAE.',
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Left Visual ───────────────────────────────── */}
          <div className="relative order-2 lg:order-1">
            {/* Main image placeholder */}
            <div className="relative bg-gradient-to-br from-primary-500 to-primary-700
                            rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden">
              <div className="text-center text-white">
                <GiKey className="text-8xl text-gold-400 mx-auto mb-4 animate-float" />
                <p className="text-lg font-display font-bold">Professional Key Shop</p>
                <p className="text-gray-400 text-sm">Ajman, United Arab Emirates</p>
              </div>
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/20 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gold-400/10 rounded-tr-full" />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-5 -right-5 bg-gold-400 text-dark
                            rounded-2xl p-4 shadow-gold text-center">
              <div className="text-4xl font-display font-bold">10+</div>
              <div className="text-xs font-semibold">Years of Trust</div>
            </div>

            {/* Google Maps preview */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-card
                            p-3 flex items-center gap-3 max-w-[180px]">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center
                              justify-center text-red-500 flex-shrink-0">
                📍
              </div>
              <div>
                <p className="text-dark text-xs font-bold">Find Us</p>
                <a
                  href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 text-xs underline"
                >
                  View on Maps
                </a>
              </div>
            </div>
          </div>

          {/* ── Right Content ─────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <span className="section-badge">About Our Shop</span>
            <h2 className="section-title mb-6">
              Your Trusted Key Experts{' '}
              <span className="gradient-text">in Ajman</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-6">
              We've been serving residents and businesses across Ajman and the wider
              UAE for since 2010. What started as a small key cutting booth has
              grown into a full-service locksmith shop equipped with
              state-of-the-art machinery.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              From a simple spare key for your apartment to programming the latest
              smart key for your luxury vehicle, our skilled technicians deliver
              precision results at a fraction of dealership prices.
            </p>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trustPoints.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 p-4 bg-light rounded-xl hover:shadow-card
                             transition-shadow"
                >
                  <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center
                                  justify-center flex-shrink-0">
                    <Icon className="text-gold-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark text-sm mb-0.5">{title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
