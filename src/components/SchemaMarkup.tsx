import { Helmet } from 'react-helmet-async';
import { useSiteData } from '../lib/useSiteData';

export default function SchemaMarkup() {
  const data = useSiteData();

  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Electrician"],
    "name": data.company.name + " - " + data.company.tagline,
    "description": data.seo.description,
    "url": "https://elec-matic.be",
    "telephone": "+32488322142",
    "email": data.company.email,
    "address": { "@type": "PostalAddress", "addressLocality": data.company.city, "postalCode": data.company.postalCode, "addressRegion": data.company.region, "addressCountry": "BE" },
    "geo": { "@type": "GeoCoordinates", "latitude": "50.4108", "longitude": "4.4446" },
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "18:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "13:00" }
    ],
    "areaServed": data.company.zones.map(zone => ({ "@type": "City", "name": zone })),
    "priceRange": "€€",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "bestRating": "5", "ratingCount": String(data.testimonials.length) },
    "review": data.testimonials.map(t => ({ "@type": "Review", "author": { "@type": "Person", "name": t.name }, "reviewRating": { "@type": "Rating", "ratingValue": String(t.rating), "bestRating": "5" }, "reviewBody": t.text })),
    "hasOfferCatalog": { "@type": "OfferCatalog", "name": "Services électriques", "itemListElement": data.services.map(s => ({ "@type": "Offer", "itemOffered": { "@type": "Service", "name": s.title, "description": s.shortDesc } })) }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faq.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } }))
  };

  return (
    <Helmet>
      <title>{data.seo.title}</title>
      <meta name="description" content={data.seo.description} />
      <meta name="keywords" content={data.seo.keywords.join(', ')} />
      <meta name="robots" content="index, follow" />
      <meta name="geo.region" content="BE-WHT" />
      <meta name="geo.placename" content="Charleroi" />
      <link rel="canonical" href="https://elec-matic.be" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.seo.title} />
      <meta property="og:description" content={data.seo.description} />
      <meta property="og:locale" content="fr_BE" />
      <meta property="og:site_name" content={data.company.name} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
}
