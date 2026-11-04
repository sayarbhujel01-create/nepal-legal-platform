import db from '../../db/database.js';
import { translations } from '../data/translations.js';
import { topicalMap } from '../data/topicalMap.js';

export function renderHomePage(lang = 'en') {
  const t = translations[lang] || translations.en;

  // Retrieve pillars and top articles from SQLite
  const pillars = db.prepare('SELECT * FROM pillars ORDER BY order_index ASC').all();
  const latestArticles = db.prepare(`
    SELECT a.*, p.slug as pillar_slug, p.title_en as pillar_title_en, p.title_ne as pillar_title_ne
    FROM articles a
    JOIN pillars p ON a.pillar_id = p.id
    WHERE a.review_status = 'Published'
    ORDER BY a.view_count DESC
    LIMIT 6
  `).all();

  const authorities = db.prepare('SELECT * FROM authorities LIMIT 4').all();

  return `
  <!-- Hero Section -->
  <section class="home-hero" aria-labelledby="hero-heading">
    <div class="site-container hero-container">
      <div class="hero-badge-wrap">
        <span class="hero-status-pill">
          <span class="pulse-indicator" aria-hidden="true"></span>
          ${lang === 'ne' ? 'नेपालको सार्वजनिक कानुनी सचेतना मञ्च' : 'Independent Public Legal Awareness Platform'}
        </span>
      </div>

      <h1 id="hero-heading" class="hero-title">
        ${lang === 'ne' 
          ? 'आफ्नो अधिकार जान्नुहोस्। आफ्नो कानुन बुझ्नुहोस्।'
          : 'Know Your Rights. Understand Your Laws.'}
      </h1>

      <p class="hero-subtitle">
        ${lang === 'ne'
          ? 'नेपालको संविधान, श्रम कानुन, अंशबण्डा, जग्गा सम्बन्धी नियम तथा दैनिक कानुनी समस्याहरूको भरपर्दो र सरल जानकारी।'
          : 'Clear, reliable, and easy-to-understand legal information to help everyday citizens make informed decisions and protect their rights in Nepal.'}
      </p>

      <!-- Prominent Natural Language Search -->
      <div class="hero-search-box">
        <form action="/search" method="GET" class="hero-search-form" role="search">
          <input type="hidden" name="lang" value="${lang}" />
          <div class="hero-input-wrapper">
            <svg class="hero-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input 
              type="search" 
              name="q" 
              class="hero-search-input" 
              placeholder="${t.searchPlaceholder}" 
              required
            />
          </div>
          <button type="submit" class="hero-search-submit">
            ${t.searchButton}
          </button>
        </form>

        <!-- Quick Question Chips -->
        <div class="hero-popular-chips">
          <span class="chips-label">${lang === 'ne' ? 'धेरै सोधिने प्रश्नहरू:' : 'Popular Questions:'}</span>
          <a href="/employment-labour-rights/unpaid-salary-employer-labour-complaint-nepal/?lang=${lang}" class="hero-chip">
            ${lang === 'ne' ? 'तलब नपाए के गर्ने?' : 'Unpaid salary steps'}
          </a>
          <a href="/property-land-rights/verify-land-ownership-lalpurja-nepal-guide/?lang=${lang}" class="hero-chip">
            ${lang === 'ne' ? 'लालपुर्जा कसरी जाँच्ने?' : 'How to verify Lalpurja'}
          </a>
          <a href="/consumer-cyber-criminal-rights/rights-when-arrested-by-police-nepal/?lang=${lang}" class="hero-chip">
            ${lang === 'ne' ? 'प्रहरी पक्राउ अधिकार' : 'Rights during arrest'}
          </a>
          <a href="/family-marriage-rights/court-marriage-registration-nepal-process-documents/?lang=${lang}" class="hero-chip">
            ${lang === 'ne' ? 'अदालती विवाह दर्ता' : 'Court marriage guide'}
          </a>
        </div>
      </div>

      <!-- Hero Call-To-Action Buttons -->
      <div class="hero-ctas">
        <a href="#core-pillars" class="btn btn-primary">
          ${t.exploreRightsCta} &darr;
        </a>
        <a href="/tools/?lang=${lang}" class="btn btn-secondary">
          🛠️ ${t.toolsHeader}
        </a>
      </div>
    </div>
  </section>

  <!-- 5 Core Pillars Section (Hub & Spoke Strategic Landing Blocks) -->
  <section id="core-pillars" class="pillars-section" aria-labelledby="pillars-heading">
    <div class="site-container">
      <div class="section-header-block">
        <span class="section-kicker">${lang === 'ne' ? 'प्रमुख कानुनी विषयहरू' : 'Core Knowledge Domains'}</span>
        <h2 id="pillars-heading" class="section-title">
          ${lang === 'ne' ? '५ मुख्य कानुनी स्तम्भहरू' : 'The Five Legal Pillars of Citizen Protection'}
        </h2>
        <p class="section-desc">
          ${lang === 'ne'
            ? 'संविधानका ३१ मौलिक हकदेखि दैनिक रोजगार, अंशबण्डा, जग्गा खरिद र साइबर सुरक्षासम्मका विस्तृत कानुनी मार्गनिर्देशिका।'
            : 'From the 31 constitutional rights to employment contracts, property conveyances, and cybercrime redress—explore our comprehensive pillars.'}
        </p>
      </div>

      <div class="pillars-grid">
        ${pillars.map((pillar, idx) => `
          <article class="pillar-card pillar-${pillar.slug}">
            <div class="pillar-card-header">
              <span class="pillar-index">0${idx + 1}</span>
              <span class="pillar-statute-tag">${pillar.entity_name}</span>
            </div>
            
            <h3 class="pillar-card-title">
              <a href="/${pillar.slug}/?lang=${lang}">
                ${lang === 'ne' ? pillar.title_ne : pillar.title_en}
              </a>
            </h3>

            <p class="pillar-card-intro">
              ${lang === 'ne' ? pillar.intro_ne : pillar.intro_en}
            </p>

            <div class="pillar-card-statutes">
              <strong>${lang === 'ne' ? 'समावेश ऐनहरू:' : 'Governing Acts:'}</strong>
              <span>${pillar.laws_covered}</span>
            </div>

            <div class="pillar-card-footer">
              <a href="/${pillar.slug}/?lang=${lang}" class="pillar-card-link">
                <span>${lang === 'ne' ? 'विस्तृत स्तम्भ हेर्नुहोस्' : 'Explore Pillar Guide'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Interactive Citizen Tools Hub Teaser -->
  <section class="tools-teaser-section" aria-labelledby="tools-heading">
    <div class="site-container">
      <div class="tools-teaser-banner">
        <div class="tools-teaser-text">
          <span class="tools-pill">Free Citizen Utilities</span>
          <h2 id="tools-heading" class="tools-banner-title">
            ${t.toolsHeader}
          </h2>
          <p class="tools-banner-desc">
            ${t.toolsDesc}
          </p>
          <div class="tools-actions">
            <a href="/tools/rights-explorer/?lang=${lang}" class="btn btn-accent">
              🧭 ${t.rightsExplorerTitle}
            </a>
            <a href="/tools/document-checklist/?lang=${lang}" class="btn btn-outline-white">
              📋 ${t.docChecklistTitle}
            </a>
            <a href="/tools/legal-dictionary/?lang=${lang}" class="btn btn-outline-white">
              📖 ${t.legalDictionaryTitle}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Practical Legal Guides -->
  <section class="popular-guides-section" aria-labelledby="guides-heading">
    <div class="site-container">
      <div class="section-header-block">
        <span class="section-kicker">${lang === 'ne' ? 'प्रायोगिक मार्गदर्शिका' : 'Practical Guides'}</span>
        <h2 id="guides-heading" class="section-title">
          ${lang === 'ne' ? 'दैनिक जीवनमा काम लाग्ने कानुनी जानकारी' : 'Most-Read Everyday Legal Guides'}
        </h2>
        <p class="section-desc">
          ${lang === 'ne' 
            ? 'सर्वसाधारण नागरिकले नियमित रूपमा सामना गर्ने व्यावहारिक समस्याहरूको कानुनसम्मत समाधान।'
            : 'Verified, step-by-step instructions answering the 8 crucial questions for everyday legal situations.'}
        </p>
      </div>

      <div class="articles-grid">
        ${latestArticles.map(article => `
          <article class="article-summary-card">
            <div class="article-card-meta">
              <span class="article-category-badge">${article.jurisdiction}</span>
              <span class="article-verified-date">
                ✓ ${t.lastVerified}: ${article.last_verified_date}
              </span>
            </div>

            <h3 class="article-summary-title">
              <a href="/${article.pillar_slug}/${article.slug}/?lang=${lang}">
                ${lang === 'ne' ? article.title_ne : article.title_en}
              </a>
            </h3>

            <p class="article-summary-text">
              ${lang === 'ne' ? article.summary_ne : article.summary_en}
            </p>

            <div class="article-act-reference">
              <span class="act-name">⚖️ ${article.applicable_legislation}</span>
            </div>

            <div class="article-card-bottom">
              <a href="/${article.pillar_slug}/${article.slug}/?lang=${lang}" class="read-more-btn">
                <span>${lang === 'ne' ? 'पूरा लेख पढ्नुहोस्' : 'Read Full Guide'}</span>
                &rarr;
              </a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Secondary Topical Clusters Grid -->
  <section class="clusters-section" aria-labelledby="clusters-heading">
    <div class="site-container">
      <div class="section-header-block">
        <span class="section-kicker">${lang === 'ne' ? 'थप विषयगत क्षेत्रहरू' : 'Secondary Topical Clusters'}</span>
        <h2 id="clusters-heading" class="section-title">
          ${lang === 'ne' ? 'सरकारी सेवा, न्याय र नागरिक अधिकार क्षेत्र' : 'Institutional Clusters & Specialized Rights'}
        </h2>
      </div>

      <div class="clusters-grid">
        ${topicalMap.secondaryClusters.map(cluster => `
          <div class="cluster-card">
            <span class="cluster-code">${cluster.code}</span>
            <h3 class="cluster-title">${lang === 'ne' ? cluster.name_ne : cluster.name_en}</h3>
            <p class="cluster-desc">${lang === 'ne' ? cluster.description_ne : cluster.description_en}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Government Authorities Directory Quick Access -->
  <section class="authorities-preview-section" aria-labelledby="authorities-heading">
    <div class="site-container">
      <div class="authorities-header-row">
        <div>
          <span class="section-kicker">${lang === 'ne' ? 'सरकारी निकायहरू' : 'Official Institutions'}</span>
          <h2 id="authorities-heading" class="section-title">
            ${lang === 'ne' ? 'सहयोग पाउने प्रमुख सरकारी निकाय र अदालतहरू' : 'Where to Seek Official Legal Help'}
          </h2>
        </div>
        <a href="/tools/government-directory/?lang=${lang}" class="view-all-link">
          ${lang === 'ne' ? 'सबै निकाय हेर्नुहोस् &rarr;' : 'View Complete Directory &rarr;'}
        </a>
      </div>

      <div class="authorities-grid">
        ${authorities.map(auth => `
          <div class="authority-card">
            <span class="auth-category">${auth.category}</span>
            <h3 class="auth-title">${lang === 'ne' ? auth.name_ne : auth.name_en}</h3>
            <p class="auth-role">${lang === 'ne' ? auth.role_ne : auth.role_en}</p>
            <div class="auth-contacts">
              <span class="auth-phone">📞 ${auth.phone}</span>
              ${auth.emergency_helpline ? `<span class="auth-helpline">🚨 ${auth.emergency_helpline}</span>` : ''}
            </div>
            <a href="${auth.website_url}" target="_blank" rel="noopener noreferrer" class="auth-link">
              ${lang === 'ne' ? 'आधिकारिक वेबसाइट खोल्नुहोस्' : 'Visit Official Portal'} &nearr;
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Editorial Quality & Verification Commitment -->
  <section class="trust-commitment-section">
    <div class="site-container">
      <div class="trust-banner-card">
        <div class="trust-content">
          <span class="trust-kicker">Integrity & Accuracy Standard</span>
          <h2 class="trust-title">
            ${lang === 'ne' 
              ? 'हाम्रो सम्पादकीय नीति: शतप्रतिशत तथ्यपरक र प्रमाणीकृत'
              : 'Our Content Verification Promise: Zero Hallucinated Law'}
          </h2>
          <p class="trust-desc">
            ${lang === 'ne'
              ? 'यस पोर्टलमा प्रकाशित प्रत्येक कानुनी लेख नेपाल कानुन आयोग र नेपाल राजपत्रमा प्रकाशित आधिकारिक ऐन, नियम र सर्वोच्च अदालतका फैसलासँग रुजु गरिन्छ। कुनै पनि बनावटी वा असत्य कानुनी दफा प्रकाशित गरिँदैन।'
              : 'Every statutory article on this platform is verified against the official Nepal Gazette and Nepal Law Commission repositories. We distinguish between enforceable laws, executive directives, and civil rights remedies with strict citation standards.'}
          </p>
          <div class="trust-badges">
            <span class="trust-badge">✓ Primary Statutory Sources Only</span>
            <span class="trust-badge">✓ Periodic Legislative Review</span>
            <span class="trust-badge">✓ Non-Commercial Public Education</span>
          </div>
        </div>
        <div class="trust-side-action">
          <a href="/trust/editorial-policy/?lang=${lang}" class="btn btn-primary">
            ${lang === 'ne' ? 'सम्पादकीय नीति पढ्नुहोस्' : 'Read Editorial Policy'}
          </a>
        </div>
      </div>
    </div>
  </section>
  `;
}
