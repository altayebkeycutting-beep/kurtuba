import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Ahmed Al Rashidi',
    role: 'Ajman Resident',
    text: 'Got my Toyota Camry key programmed here after losing it. Half the price of the dealership and done within an hour. Highly recommended!',
    rating: 5,
    initial: 'A',
  },
  {
    name: 'Sarah M.',
    role: 'Business Owner, Ajman',
    text: 'We needed 20 master keys made for our office complex. Professional service, perfect quality, and delivered on time. Our go-to key shop.',
    rating: 5,
    initial: 'S',
  },
  {
    name: 'Mohammed K.',
    role: 'Sharjah Resident',
    text: 'Drove from Sharjah specifically for this shop. Best prices for car key programming in the UAE. Will definitely come back.',
    rating: 5,
    initial: 'M',
  },
  {
    name: 'Priya Nair',
    role: 'Ajman',
    text: 'Quick, honest, and professional. My house key copy was done in 3 minutes flat and works perfectly. What more can you ask for?',
    rating: 5,
    initial: 'P',
  },
  {
    name: 'Faisal Al Hamdan',
    role: 'Property Manager',
    text: 'Managing 50+ units means I need a key shop I can trust. These guys handle all our key duplication needs without fail.',
    rating: 5,
    initial: 'F',
  },
  {
    name: 'David Chen',
    role: 'Expat, Ajman',
    text: 'Lost my BMW smart key. Was quoted AED 900 at the dealership. Got it here for AED 350, same quality. Brilliant service!',
    rating: 5,
    initial: 'D',
  },
];

const avatarColors = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500',
  'bg-red-500', 'bg-yellow-500', 'bg-indigo-500',
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-light">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="section-badge">Customer Reviews</span>
          <h2 className="section-title">
            What Our Customers{' '}
            <span className="gradient-text">Say About Us</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Over 5,000 satisfied customers across Ajman and UAE. Here's what a few of them had to say.
          </p>

          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="text-gold-400 fill-gold-400 text-xl" />
              ))}
            </div>
            <span className="text-dark font-bold text-lg">4.9/5</span>
            <span className="text-gray-500 text-sm">based on 200+ reviews</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="card p-6 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <FiStar
                    key={j}
                    className="text-gold-400 fill-gold-400 text-sm"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]}
                               flex items-center justify-center text-white font-bold text-sm
                               flex-shrink-0`}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="font-semibold text-dark text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 text-green-500">✓</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google review CTA */}
        <div className="text-center mt-10">
          <a
            href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-600 font-semibold
                       hover:text-gold-700 transition-colors underline underline-offset-4"
          >
            ⭐ Leave us a Google Review
          </a>
        </div>
      </div>
    </section>
  );
}
