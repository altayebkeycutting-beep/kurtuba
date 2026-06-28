import Navbar       from '../components/Navbar';
import Hero         from '../components/Hero';
import Services     from '../components/Services';
import About        from '../components/About';
import WhyChooseUs  from '../components/WhyChooseUs';
import Gallery      from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import BlogSection  from '../components/BlogSection';
import Contact      from '../components/Contact';
import Footer       from '../components/Footer';
import SEOHead      from '../components/SEOHead';

export default function Home() {
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Kurtuba Locksmith',
    description: 'Professional key duplication, car key programming and locksmith services in Ajman, UAE.',
    url: 'https://www.kurtubalocksmith.com',
    telephone: '+971 52 343 3077',
    email: 'info@kurtubalocksmith.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ajman',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.3886,
      longitude: 55.3945,
    },
    priceRange: '$',
    openingHours: ['Mo-Sa 09:00-21:00', 'Su 10:00-18:00'],
    hasMap: 'https://maps.app.goo.gl/TyqaZNGERFDBtZb67',
  });

  return (
    <>
      <SEOHead
        title="Key Duplication & Locksmith Services Ajman UAE"
        description="Kurtuba Locksmith — professional key duplication, car key programming & locksmith services in Ajman, UAE. Fast service, expert technicians, best prices."
        keywords={[
          'Kurtuba Locksmith Ajman',
          'key duplication Ajman',
          'car key programming UAE',
          'locksmith Ajman',
          'remote key programming UAE',
          'smart key Ajman',
          'house key duplicate UAE',
        ]}
        schema={schema}
      />
      <Navbar />
      <main>
        <Hero />
        <Services homepage />
        <About />
        <WhyChooseUs />
        <Gallery limit={8} />
        <Testimonials />
        <BlogSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
