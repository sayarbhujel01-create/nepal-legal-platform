export function generateMetaTags({
  title,
  description,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  lang = 'en'
}) {
  const baseUrl = 'https://nepal-legal-awareness.gov.np';
  const fullUrl = `${baseUrl}${url}`;
  const siteName = lang === 'ne' 
    ? 'नागरिक अधिकार तथा कानुनी सचेतना मञ्च' 
    : "Citizens' Rights & Legal Awareness Platform";

  return `
    <title>${escapeHtml(title)} | ${siteName}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${fullUrl}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:locale" content="${lang === 'ne' ? 'ne_NP' : 'en_US'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
    ${modifiedTime ? `<meta property="article:modified_time" content="${modifiedTime}" />` : ''}
    <link rel="alternate" hreflang="en" href="${fullUrl}?lang=en" />
    <link rel="alternate" hreflang="ne" href="${fullUrl}?lang=ne" />
    <link rel="alternate" hreflang="x-default" href="${fullUrl}" />
  `;
}

export function generateWebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Citizens' Rights & Legal Awareness Platform",
    "alternateName": "नागरिक अधिकार तथा कानुनी सचेतना मञ्च",
    "url": "https://nepal-legal-awareness.gov.np",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://nepal-legal-awareness.gov.np/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function generateOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Citizens' Rights & Legal Awareness Initiative Nepal",
    "url": "https://nepal-legal-awareness.gov.np",
    "logo": "https://nepal-legal-awareness.gov.np/favicon.svg",
    "description": "Independent public legal awareness and education platform for citizens of Nepal.",
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    },
    "knowsAbout": [
      "Constitution of Nepal",
      "Labour Law of Nepal",
      "National Civil Code Muluki Devani Samhita",
      "Land Revenue & Property Law",
      "Consumer & Cyber Law"
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function generateBreadcrumbSchema(items) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://nepal-legal-awareness.gov.np${item.url}`
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function generateArticleSchema(article, pillar) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title_en,
    "description": article.summary_en,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://nepal-legal-awareness.gov.np/${pillar.slug}/${article.slug}/`
    },
    "datePublished": article.publication_date,
    "dateModified": article.last_verified_date,
    "inLanguage": ["en", "ne"],
    "publisher": {
      "@type": "Organization",
      "name": "Citizens' Rights & Legal Awareness Initiative Nepal",
      "url": "https://nepal-legal-awareness.gov.np"
    },
    "author": {
      "@type": "Organization",
      "name": article.reviewed_by || "Legal Research Directorate"
    },
    "articleSection": pillar.title_en
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function generateFAQSchema(faqs, lang = 'en') {
  if (!faqs || faqs.length === 0) return '';
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": lang === 'ne' ? faq.q_ne : faq.q_en,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": lang === 'ne' ? faq.a_ne : faq.a_en
      }
    }))
  };
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
