import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const workshopHighlights = [
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
];

const workshopChecklist = [
  'House key duplication and replacement',
  'Car key cutting and programming',
  'Remote keys and smart key service',
  'Lock repair and rekeying',
  'Master key solutions and security upgrades',
  'Fast onsite service for Ajman and nearby areas',
];

const workshopImage = '/workshop-machine.jpg';

export default function WorkshopPage() {
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kurtuba Locksmith',
    description: 'Our workshop in Ajman, UAE provides locksmith services including key cutting, lock repair, and car key programming.',
    url: window.location.origin,
    telephone: '+971-52-343-3077',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ajman',
      addressCountry: 'AE',
    },
    image: workshopImage,
  });

  return (
    <>
      <SEOHead
        title="Our Workshop | Locksmith Shop Ajman UAE | Kurtuba Locksmith"
        description="Visit our Ajman locksmith workshop for key cutting, lock repair, car key programming, and professional security services in the UAE."
        keywords={[
          'Kurtuba workshop Ajman',
          'locksmith workshop UAE',
          'key cutting shop Ajman',
          'car key programming workshop',
          'lock repair Ajman',
        ]}
        canonical={`${window.location.origin}/workshop`}
        schema={schema}
      />

      <Navbar />

      <main className="pt-28 min-h-screen bg-light">
        <section className="bg-dark py-16 px-4">
          <div className="section-container text-center">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 text-gold-400 text-sm font-semibold rounded-full mb-4">
              Our Workshop
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Precision Locksmith Work in Ajman
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Kurtuba Locksmith operates a modern workshop built for accuracy, speed, and dependable service. From daily key duplication to advanced car key programming, our team works with care and precision.
            </p>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="section-container grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
            <div className="overflow-hidden rounded-3xl shadow-card bg-slate-900">
              <img
                src={workshopImage}
                alt="Key cutting machine in a locksmith workshop"
                className="w-full h-[420px] md:h-[520px] object-cover"
              />
            </div>

            <div>
              <span className="section-badge">Workshop Overview</span>
              <h2 className="section-title mb-5">
                Built for <span className="gradient-text">speed, quality, and trust</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our workshop is equipped with modern key-cutting machines, remote programming tools, and repair equipment to deliver dependable locksmith solutions for homes, businesses, and vehicles across Ajman and the UAE.
              </p>

              <ul className="space-y-3 mb-8">
                {workshopChecklist.map((item) => (
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
              <h2 className="section-title">What happens inside our workshop</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {workshopHighlights.map(({ title, description }) => (
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
                Need a locksmith in Ajman?
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
