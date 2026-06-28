import { FiAward, FiClock, FiShield, FiUsers, FiMapPin, FiPhone, FiCheckCircle } from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const milestones = [
  { year: '2010', title: 'Founded', desc: 'Kurtuba Locksmith opened its first shop in Ajman.' },
  { year: '2014', title: 'Car Keys', desc: 'Expanded to include car key programming and transponder keys.' },
  { year: '2018', title: '1,000+ Clients', desc: 'Reached 1,000 satisfied customers across UAE.' },
  { year: '2022', title: 'Smart Keys', desc: 'Added smart key and keyless entry programming services.' },
  { year: '2024', title: 'Today', desc: 'Serving 5,000+ customers as Ajman\'s most trusted locksmith.' },
];

const values = [
  { icon: FiAward,  title: 'Quality First',     desc: 'Every key tested before handover. We never compromise on precision.' },
  { icon: FiClock,  title: 'Fast Service',       desc: 'House keys in 5 minutes. Car keys typically within an hour.' },
  { icon: FiShield, title: 'Honest Pricing',     desc: 'Transparent quotes. No hidden fees. Up to 70% less than dealerships.' },
  { icon: FiUsers,  title: 'Customer Trust',     desc: 'Over 5,000 satisfied customers and a 4.9-star Google rating.' },
];

const team = [
  { name: 'Mohammed Al Kurtubi', role: 'Founder & Master Locksmith', exp: '15+ years', emoji: '👨‍🔧' },
  { name: 'Ahmed Hassan',        role: 'Car Key Specialist',          exp: '10+ years', emoji: '🚗' },
  { name: 'Tariq Mahmoud',       role: 'Security Systems Expert',     exp: '8+ years',  emoji: '🔐' },
];

export default function AboutPage() {
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kurtuba Locksmith',
    description: 'Professional key duplication and locksmith services in Ajman, UAE since 2010.',
    foundingDate: '2010',
    address: { '@type': 'PostalAddress', addressLocality: 'Ajman', addressCountry: 'AE' },
    url: window.location.origin,
  });

  return (
    <>
      <SEOHead
        title="About Kurtuba Locksmith — Ajman's Trusted Key Experts Since 2010"
        description="Learn about Kurtuba Locksmith — Ajman's most trusted key duplication and locksmith shop since 2010. Meet our team and discover our story."
        keywords={['about Kurtuba Locksmith','locksmith Ajman history','key shop UAE']}
        canonical={`${window.location.origin}/about`}
        schema={schema}
      />
      <Navbar />

      <main className="pt-28 min-h-screen">
        {/* Hero */}
        <div className="bg-dark py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 key-pattern opacity-10 pointer-events-none" />
          <div className="section-container text-center relative z-10">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30
                             text-gold-400 text-sm font-semibold rounded-full mb-4">
              Our Story
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              About Kurtuba Locksmith
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Serving Ajman and the UAE since 2010. From humble beginnings to the region's
              most trusted key and locksmith specialists.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-badge">Who We Are</span>
                <h2 className="section-title mb-6">
                  Ajman's Most Trusted{' '}
                  <span className="gradient-text">Locksmith Shop</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Kurtuba Locksmith was founded in 2010 with a single goal: provide the people of
                  Ajman with fast, reliable, and affordable key and locksmith services. What started
                  as a small key cutting booth has grown into a full-service shop equipped with the
                  latest technology.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Today, we serve thousands of customers every year — from homeowners needing a spare
                  key to businesses requiring master key systems and car owners looking for a
                  cost-effective alternative to expensive dealerships.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Our team of certified locksmiths brings decades of combined experience. We invest
                  in the latest Silca, Ilco, and Autel equipment to ensure every cut and every
                  programmed key meets the highest standard.
                </p>
                <div className="flex gap-4">
                  <Link to="/services" className="btn-primary">Our Services</Link>
                  <a href="/#contact" className="btn-secondary">Contact Us</a>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl
                                aspect-[4/3] flex items-center justify-center overflow-hidden relative">
                  <GiKey className="text-gold-400 text-9xl animate-float" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-bl-full" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gold-400/10 rounded-tr-full" />
                </div>
                {/* Stat badge */}
                <div className="absolute -bottom-5 -right-5 bg-gold-400 rounded-2xl p-4 shadow-gold text-center">
                  <div className="text-3xl font-display font-bold text-dark">14+</div>
                  <div className="text-xs font-semibold text-dark">Years of Trust</div>
                </div>
                {/* Map badge */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-card p-3
                                flex items-center gap-2 max-w-[170px]">
                  <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">📍</div>
                  <div>
                    <p className="text-dark text-xs font-bold">Find Us</p>
                    <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67" target="_blank"
                       rel="noopener noreferrer" className="text-gold-600 text-xs underline">
                      View on Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-light">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="section-badge">Our Values</span>
              <h2 className="section-title">What We Stand For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card p-6 text-center hover:-translate-y-1 transition-all">
                  <div className="w-14 h-14 bg-gold-400/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-gold-600 text-2xl" />
                  </div>
                  <h3 className="font-display font-bold text-dark mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-dark">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30
                               text-gold-400 text-sm font-semibold rounded-full mb-3">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                14 Years of Growth
              </h2>
            </div>
            <div className="relative max-w-3xl mx-auto">
              {/* Line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gold-400/20 hidden md:block" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <div key={m.year} className={`flex gap-6 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="flex-1 card p-5 hover:border-gold-400/40 border border-white/5 bg-white/5">
                      <h3 className="font-display font-bold text-white text-lg">{m.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{m.desc}</p>
                    </div>
                    <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center
                                    text-dark font-display font-bold text-sm flex-shrink-0 shadow-gold z-10">
                      {m.year}
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <span className="section-badge">Our Team</span>
              <h2 className="section-title">Meet the Experts</h2>
              <p className="section-subtitle mx-auto">
                Certified locksmiths with decades of combined experience.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {team.map(({ name, role, exp, emoji }) => (
                <div key={name} className="card p-6 text-center hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center
                                  justify-center text-3xl mx-auto mb-4">{emoji}</div>
                  <h3 className="font-display font-bold text-dark">{name}</h3>
                  <p className="text-gold-600 text-sm font-medium mt-1">{role}</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-gray-400 text-xs">
                    <FiAward size={12} /> {exp} experience
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gold-400">
          <div className="section-container text-center">
            <h2 className="text-3xl font-display font-bold text-dark mb-3">
              Ready to Visit Our Shop?
            </h2>
            <p className="text-dark/70 mb-6">
              Come see us in Ajman. Walk-ins welcome, no appointment needed.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+971523433077"
                 className="px-6 py-3 bg-dark text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2">
                <FiPhone /> Call Now
              </a>
              <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67" target="_blank"
                 rel="noopener noreferrer"
                 className="px-6 py-3 bg-white/20 text-dark font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
                <FiMapPin /> Get Directions
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
