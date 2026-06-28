import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Kurtuba Locksmith Ajman';
const SITE_URL  = import.meta.env.VITE_SITE_URL || 'https://www.kurtubalocksmith.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

export default function SEOHead({
  title, description, keywords = [], canonical, ogTitle,
  ogDescription, ogImage, ogType = 'website', schema, noIndex = false,
}) {
  const fullTitle  = title
    ? `${title} | ${SITE_NAME}`
    : 'Kurtuba Locksmith Ajman — Key Duplication & Locksmith UAE';
  const metaDesc   = description ||
    'Professional key duplication, car key programming and locksmith services in Ajman, UAE. Fast, affordable and reliable — Kurtuba Locksmith.';
  const canonicalUrl = canonical || `${SITE_URL}${window.location.pathname}`;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': SITE_URL,
    name: 'Kurtuba Locksmith',
    description: metaDesc,
    url: SITE_URL,
    telephone: '+971-52-343-3077',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ajman',
      addressLocality: 'Ajman',
      addressCountry: 'AE',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.3886, longitude: 55.3945 },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '18:00' },
    ],
    priceRange: '$',
    image: DEFAULT_IMAGE,
    sameAs: ['https://maps.app.goo.gl/TyqaZNGERFDBtZb67'],
  };

  const schemaData = schema || JSON.stringify(defaultSchema);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title"       content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || metaDesc} />
      <meta property="og:image"       content={ogImage || DEFAULT_IMAGE} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="en_AE" />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={ogTitle || fullTitle} />
      <meta name="twitter:description" content={ogDescription || metaDesc} />
      <meta name="twitter:image"       content={ogImage || DEFAULT_IMAGE} />

      <meta name="geo.region"    content="AE-AJ" />
      <meta name="geo.placename" content="Ajman" />
      <meta name="geo.position"  content="25.3886;55.3945" />
      <meta name="ICBM"          content="25.3886, 55.3945" />

      <script type="application/ld+json">{schemaData}</script>
    </Helmet>
  );
}
