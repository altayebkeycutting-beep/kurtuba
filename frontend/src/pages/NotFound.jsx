import { Link } from 'react-router-dom';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import SEOHead from '../components/SEOHead';

export default function NotFound() {
  return (
    <>
      <SEOHead title="Page Not Found" noIndex />
      <Navbar />
      <main className="min-h-screen pt-28 flex items-center justify-center bg-light px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-float inline-block">🔑</div>
          <h1 className="text-5xl font-display font-bold text-dark mb-3">404</h1>
          <h2 className="text-2xl font-display text-gray-600 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-8">
            Looks like this key doesn't open any door. The page you're looking for
            may have been moved or doesn't exist.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/"        className="btn-primary">🏠 Back to Home</Link>
            <Link to="/services" className="btn-secondary">🔧 Our Services</Link>
            <Link to="/blog"    className="btn-secondary">📖 Read Blog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
