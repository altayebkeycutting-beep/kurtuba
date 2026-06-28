import { FiZap, FiDollarSign, FiTool, FiStar, FiPhoneCall, FiClock } from 'react-icons/fi';

const reasons = [
  {
    icon: FiZap,
    title: 'Lightning Fast',
    desc: 'House keys in 5 minutes. Car keys programmed same day. No unnecessary waiting.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: FiDollarSign,
    title: 'Best Prices in UAE',
    desc: 'Up to 70% cheaper than dealerships. Transparent pricing, no hidden charges.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: FiTool,
    title: 'Advanced Equipment',
    desc: 'Silca, Ilco, and Autel machines ensure OEM-quality precision on every cut.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FiStar,
    title: 'Satisfaction Guaranteed',
    desc: 'Every key tested before handover. If it doesn\'t work, we fix it for free.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: FiPhoneCall,
    title: 'Expert Advice',
    desc: 'Unsure what you need? Our technicians will guide you to the right solution.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: FiClock,
    title: 'Extended Hours',
    desc: 'Open 7 days a week. Mon–Sat 9am–9pm, Sunday 10am–6pm. We\'re here when you need us.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 key-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="section-container relative z-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30
                           text-gold-400 text-sm font-semibold rounded-full uppercase tracking-wider mb-3">
            Why Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            The Smart Choice for{' '}
            <span className="gradient-text">Key Services</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Six reasons thousands of customers in Ajman come back to us again and again.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6
                         hover:border-gold-400/40 hover:bg-white/10 transition-all duration-300
                         group"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4
                              group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} />
              </div>
              <h3 className="text-white font-display font-bold text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-14 bg-gradient-to-r from-gold-400 to-gold-500 rounded-2xl p-8
                        flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-dark font-display font-bold text-2xl mb-1">
              Need a key duplicated right now?
            </h3>
            <p className="text-dark/70 text-sm">Visit us in Ajman or give us a call.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="tel:+971523433077"
              className="px-6 py-3 bg-dark text-white font-semibold rounded-xl
                         hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              📞 Call Now
            </a>
            <a
              href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white/20 text-dark font-semibold rounded-xl
                         hover:bg-white/30 transition-colors"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
