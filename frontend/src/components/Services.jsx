import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { serviceAPI } from '../api';

const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="w-12 h-12 skeleton rounded-xl mb-4" />
    <div className="h-5 skeleton rounded mb-2 w-3/4" />
    <div className="h-3 skeleton rounded mb-1" />
    <div className="h-3 skeleton rounded mb-1 w-5/6" />
    <div className="h-3 skeleton rounded w-2/3" />
  </div>
);

export default function Services({ homepage = false }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceAPI
      .getFeatured()
      .then((res) => setServices(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayServices = homepage ? services.slice(0, 6) : services;

  return (
    <section id="services" className="section-padding bg-light">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="section-badge">What We Offer</span>
          <h2 className="section-title">
            Complete Key &amp;{' '}
            <span className="gradient-text">Locksmith Services</span>
          </h2>
          <p className="section-subtitle mx-auto">
            From simple house key duplication to complex car key programming —
            fast, affordable, and guaranteed.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : displayServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
        </div>

        {/* View All */}
        {homepage && (
          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary">
              View All Services
              <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  return (
    <div className="card p-6 group hover:-translate-y-1 transition-all duration-300">
      {/* Icon */}
      <div className="w-14 h-14 bg-gold-400/10 rounded-xl flex items-center justify-center
                      text-2xl mb-5 group-hover:bg-gold-400 group-hover:scale-110
                      transition-all duration-300">
        <span className="group-hover:scale-110 transition-transform">
          {service.icon || '🔑'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-display font-bold text-dark mb-2">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed mb-4">
        {service.shortDescription}
      </p>

      {/* Features */}
      {service.features?.length > 0 && (
        <ul className="space-y-1.5 mb-5">
          {service.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <FiCheckCircle className="text-gold-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        {service.price?.displayText ? (
          <span className="text-gold-600 font-semibold text-sm">
            {service.price.displayText}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">Contact for price</span>
        )}
        <a
          href="tel:+971523433077"
          className="text-sm text-dark bg-gold-400 px-3 py-1.5 rounded-lg
                     font-medium hover:bg-gold-500 transition-colors"
        >
          Get Quote
        </a>
      </div>
    </div>
  );
}
