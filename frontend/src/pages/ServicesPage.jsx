import Navbar   from '../components/Navbar';
import Services from '../components/Services';
import Footer   from '../components/Footer';
import SEOHead  from '../components/SEOHead';
import Contact  from '../components/Contact';

export default function ServicesPage() {
  return (
    <>
      <SEOHead
        title="Key Duplication & Locksmith Services — Kurtuba Locksmith Ajman"
        description="Complete range of key services in Ajman: house key cutting, car key programming, remote keys, smart keys, and lock repair. Best prices in UAE. Kurtuba Locksmith."
        keywords={['key services Ajman','car key programming UAE','locksmith Ajman','remote key UAE','Kurtuba Locksmith']}
        canonical={`${window.location.origin}/services`}
      />
      <Navbar />
      <main className="pt-28">
        <div className="bg-dark py-14 px-4">
          <div className="section-container text-center">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30
                             text-gold-400 text-sm font-semibold rounded-full mb-4">
              All Services
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Complete Key &amp; Locksmith Services
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From a simple duplicate to complex car key programming — professional service
              in Ajman, UAE. Kurtuba Locksmith has you covered.
            </p>
          </div>
        </div>
        <Services homepage={false} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
