import { useEffect, useState } from 'react';
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiPause,
  FiMapPin,
  FiPhone,
  FiPlay,
} from 'react-icons/fi';
import { GiKey } from 'react-icons/gi';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10,000+', label: 'Keys Cut' },
  { value: '5,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Car Models' },
  { value: '14+', label: 'Years Experience' },
];

const badges = [
  'House Keys', 'Car Keys', 'Remote Programming', 'Smart Keys', 'Lock Repair',
];

const slides = [
  {
    image: '/sliderimage1.jpg',
    alt: 'Professional key cutting and locksmith services at Kurtuba in Ajman',
    title: 'Expert key cutting',
    description: 'Accurate house and commercial key duplication in Ajman.',
  },
  {
    image: '/sliderimage2.jpg',
    alt: 'Car key duplication and programming service in Ajman, UAE',
    title: 'Car keys made easy',
    description: 'Car key duplication and programming for all makes and models.',
  },
  {
    image: '/sliderimage3.jpg',
    alt: 'Smart key and remote programming by Kurtuba Locksmith',
    title: 'Smart keys & remotes',
    description: 'Reliable smart key and remote programming from local experts.',
  },
  {
    image: '/sliderimage4.jpg',
    alt: 'Kurtuba Locksmith workshop and key services in Ajman',
    title: 'Your trusted locksmith',
    description: 'Friendly, fast locksmith service with quality you can trust.',
  },
];

function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [unavailableImages, setUnavailableImages] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const showSlide = (index) => setActiveSlide((index + slides.length) % slides.length);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  return (
    <section className="relative overflow-hidden bg-hero pt-16 sm:pt-[88px]">
      <div className="section-container py-5 md:py-8">
        <div
          id="hero-image-slider"
          className="relative h-[300px] overflow-hidden rounded-2xl border border-white/15 bg-primary-800 shadow-2xl shadow-black/30 sm:h-[400px] sm:rounded-3xl lg:h-[500px]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Kurtuba Locksmith services"
        >
          {slides.map((slide, index) => {
            const isActive = index === activeSlide;

            return (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                }`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
                aria-hidden={!isActive}
              >
                {unavailableImages[slide.image] ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-6 text-center sm:px-8">
                    <div className="max-w-xl">
                      <GiKey className="mx-auto mb-4 text-5xl text-gold-400/80 sm:mb-5 sm:text-6xl" aria-hidden="true" />
                      <p className="mb-2 text-2xl font-display font-bold text-white sm:text-4xl">
                        Ajman&apos;s trusted key shop
                      </p>
                      <p className="text-sm leading-relaxed text-gray-300 sm:text-lg">
                        Key cutting, car keys &amp; smart key programming from local experts.
                      </p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400 sm:mt-5">
                        Kurtuba Locksmith · Ajman, UAE
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => setUnavailableImages((images) => ({
                      ...images,
                      [slide.image]: true,
                    }))}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/10" />
                {!unavailableImages[slide.image] && (
                  <div className="absolute bottom-16 left-5 right-5 sm:bottom-20 sm:left-8 sm:right-8">
                    <p className="text-lg font-display font-bold text-white sm:text-2xl">
                      {slide.title}
                    </p>
                    <p className="mt-1 max-w-md text-xs text-gray-200 sm:text-base">
                      {slide.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between p-3 sm:p-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying((playing) => !playing)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:border-gold-400 hover:bg-gold-400 hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-10 sm:w-10"
                aria-label={isPlaying ? 'Pause automatic slides' : 'Resume automatic slides'}
                aria-controls="hero-image-slider"
              >
                {isPlaying ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}
              </button>
              <div className="flex items-center gap-2" aria-label="Choose a slide">
                {slides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    onClick={() => showSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide ? 'w-8 bg-gold-400' : 'w-2.5 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Show slide ${index + 1}: ${slide.title}`}
                    aria-current={index === activeSlide ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => showSlide(activeSlide - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:border-gold-400 hover:bg-gold-400 hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-10 sm:w-10"
                aria-label="Previous slide"
                aria-controls="hero-image-slider"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => showSlide(activeSlide + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white transition hover:border-gold-400 hover:bg-gold-400 hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 sm:h-10 sm:w-10"
                aria-label="Next slide"
                aria-controls="hero-image-slider"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <>
      <HeroSlider />
      <section className="relative overflow-hidden bg-hero text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-gold-400/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-2 key-pattern opacity-30" />
        </div>

        <div className="section-container relative z-10 py-12 md:py-16">
          <div className="mx-auto max-w-4xl animate-slide-up text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2">
              <GiKey className="text-sm text-gold-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gold-400">
                #1 Locksmith in Ajman, UAE
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-display font-bold leading-tight md:text-5xl lg:text-6xl">
              Kurtuba{' '}
              <span className="gradient-text">Locksmith</span>
              {' '}Ajman
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-300">
              Fast, accurate, and affordable key duplication &amp; locksmith services in Ajman.
              From simple house keys to complex car transponders — ready in minutes.
            </p>

            <div className="mb-8 flex flex-wrap justify-center gap-2" aria-label="Locksmith services">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300"
                >
                  <FiCheckCircle className="flex-shrink-0 text-xs text-gold-400" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+971523433077" className="btn-primary text-base">
                <FiPhone aria-hidden="true" /> Call Now
              </a>
              <a
                href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base"
              >
                <FiMapPin aria-hidden="true" /> Get Directions
              </a>
              <Link to="/services" className="btn-secondary text-base">
                Our Services <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-white/10 pt-8 md:mt-16 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-display font-bold text-gold-400">{value}</div>
                <div className="mt-1 text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
