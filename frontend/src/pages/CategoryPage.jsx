import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const categoryContent = {
  workshop: {
    title: 'Workshop',
    heading: 'Precision Locksmith Work in Ajman',
    description: 'Kurtuba Locksmith operates a dedicated workshop in Ajman with modern key-cutting machines, lock repair tools, and car key programming equipment for reliable service.',
    summary: 'Our workshop is equipped to handle key duplication, lock repair, rekeying, remote programming, and complete locksmith solutions for homes, offices, and vehicles.',
    image: '/workshop-machine.jpg',
    checklist: [
      'House key duplication and replacement',
      'Car key cutting and programming',
      'Remote keys and smart key service',
      'Lock repair and rekeying',
      'Master key solutions and security upgrades',
      'Fast onsite service for Ajman and nearby areas',
    ],
    highlights: [
      {
        title: 'Advanced key cutting',
        description: 'Precision machines for house keys, car keys, remote keys, and transponder programming.',
      },
      {
        title: 'Modern repair bay',
        description: 'Our workshop is equipped for lock repair, door hardware upgrades, and emergency access solutions.',
      },
      {
        title: 'Dedicated specialists',
        description: 'Experienced team members handle all types of locksmith jobs with accuracy, speed, and care.',
      },
    ],
  },
  keys: {
    title: 'Key Collection',
    heading: 'Professional Key Cutting & Duplication',
    description: 'From house keys to transponder and remote keys, we provide accurate key duplication and replacement with fast turnaround times in Ajman, UAE.',
    summary: 'We cut and program keys for homes, shops, offices, and vehicles, using quality equipment and careful checking before handover.',
    image: '/keylist.png',
    checklist: [
      'House key duplication',
      'Car key cutting and coding',
      'Smart key and transponder keys',
      'Spare key replacement',
      'Fast delivery and same-day service',
    ],
    highlights: [
      {
        title: 'Precision duplication',
        description: 'Every key is cut with exact measurements to match your original lock setup safely and accurately.',
      },
      {
        title: 'Vehicle compatibility',
        description: 'We support a wide range of vehicle makes and models for replacement and programming.',
      },
      {
        title: 'Trusted service',
        description: 'Our customers rely on us for quick, dependable, and affordable key solutions.',
      },
    ],
  },
  equipment: {
    title: 'Cutting Machine Equipment',
    heading: 'Advanced Locksmith Cutting Machine Equipment',
    description: 'Kurtuba Locksmith uses professional key cutting and programming equipment to deliver accurate, efficient, and high-quality locksmith work in Ajman, UAE.',
    summary: 'Our cutting machine equipment supports key duplication, lock repair, transponder programming, and precision work for homes, offices, and vehicles.',
    image: '/equipment.png',
    checklist: [
      'High-precision key cutting machines',
      'Transponder and smart key programming tools',
      'Lock repair and rekeying equipment',
      'Advanced diagnostics and calibration gear',
      'Reliable workshop machinery for fast service',
    ],
    highlights: [
      {
        title: 'Precision key cutting',
        description: 'Our equipment ensures accurate cuts for house keys, car keys, and high-security lock systems.',
      },
      {
        title: 'Professional programming',
        description: 'We use modern tools to program transponder, remote, and smart keys efficiently and correctly.',
      },
      {
        title: 'Dependable workshop output',
        description: 'Every machine and tool is selected to help our locksmith team deliver consistent, fast, and secure results.',
      },
    ],
  },
  team: {
    title: 'Team',
    heading: 'Experienced Locksmith Team',
    description: 'Our team of locksmith specialists combines technical skill and customer care to provide dependable solutions for every client need.',
    summary: 'From emergency door access to key programming and lock repairs, our team works with precision and professionalism.',
    image: '/workshop-machine.jpg',
    checklist: [
      'Certified locksmith specialists',
      'Customer-focused support',
      'Quick troubleshooting and fix service',
      'Trusted by homes, businesses, and drivers',
    ],
    highlights: [
      {
        title: 'Skilled professionals',
        description: 'Our locksmiths are trained to handle a wide range of tasks with speed and accuracy.',
      },
      {
        title: 'Responsive service',
        description: 'We respond quickly and keep customers informed throughout the service process.',
      },
      {
        title: 'Trusted workmanship',
        description: 'Customer trust is built through consistent quality and honest support.',
      },
    ],
  },
  'before-after': {
    title: 'Before & After',
    heading: 'Before & After Locksmith Results',
    description: 'See the difference between damaged, outdated, or worn lock systems and the polished, secure result after our professional service.',
    summary: 'We restore functionality and improve security across residential and commercial properties with practical locksmith solutions.',
    image: '/workshop-machine.jpg',
    checklist: [
      'Lock repair and replacement',
      'Door and security upgrade work',
      'Key system improvement',
      'Safe and secure final results',
    ],
    highlights: [
      {
        title: 'Repair and upgrade',
        description: 'We fix worn locks and improve door security with stronger, better-fitting solutions.',
      },
      {
        title: 'Restored confidence',
        description: 'Customers gain back reliable access and stronger peace of mind after each repair.',
      },
      {
        title: 'Quality outcome',
        description: 'Every job is finished with practical improvements and careful attention to detail.',
      },
    ],
  },
};

export default function CategoryPage({ category = 'workshop' }) {
  const content = categoryContent[category] || categoryContent.workshop;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kurtuba Locksmith',
    description: `${content.title} services in Ajman, UAE by Kurtuba Locksmith.`,
    url: window.location.origin,
    telephone: '+971-52-343-3077',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ajman',
      addressCountry: 'AE',
    },
    image: content.image,
  });

  return (
    <>
      <SEOHead
        title={`${content.title} | Locksmith Services Ajman UAE`}
        description={`${content.description} Visit Kurtuba Locksmith in Ajman for reliable locksmith solutions.`}
        keywords={[`Kurtuba ${content.title.toLowerCase()} Ajman`, 'locksmith Ajman UAE', 'key service Ajman']}
        canonical={`${window.location.origin}/${category}`}
        schema={schema}
      />

      <Navbar />

      <main className="pt-28 min-h-screen bg-light">
        <section className="bg-dark py-16 px-4">
          <div className="section-container text-center">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-sm font-semibold rounded-full mb-4">
              {content.title}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {content.heading}
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              {content.description}
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="overflow-hidden rounded-3xl shadow-card bg-slate-900">
              <img
                src={content.image}
                alt={`${content.title} locksmith service in Ajman, UAE`}
                className="w-full h-[420px] md:h-[520px] object-cover"
              />
            </div>

            <div>
              <span className="section-badge">Overview</span>
              <h2 className="section-title mb-5">
                Trusted <span className="gradient-text">{content.title}</span> solutions
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {content.summary}
              </p>

              <ul className="space-y-3 mb-8">
                {content.checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <span className="mt-0.5 flex-shrink-0">
                      <FiCheckCircle className="text-gold-600 text-lg" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <a href="tel:+971523433077" className="btn-primary">
                  <FiPhone /> Call Now
                </a>
                <Link to="/gallery" className="btn-secondary">
                  View Gallery <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-light">
          <div className="section-container">
            <div className="text-center mb-10">
              <span className="section-badge">Why Customers Choose Us</span>
              <h2 className="section-title">What makes our {content.title.toLowerCase()} service reliable</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {content.highlights.map(({ title, description }) => (
                <div key={title} className="card p-7">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/10 flex items-center justify-center mb-4">
                    <FiCheckCircle className="text-gold-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-dark mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-dark text-white">
          <div className="section-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="section-badge bg-gold-400/10 text-gold-400 border-gold-400/30">Visit Our Shop</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mt-2">
                Need expert help in Ajman?
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="tel:+971523433077" className="btn-primary">
                <FiPhone /> +971 52 343 3077
              </a>
              <a href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67" target="_blank" rel="noreferrer" className="btn-outline">
                <FiMapPin /> Find Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
