import db from '../../db/database.js';
import { translations } from '../data/translations.js';
import { topicalMap } from '../data/topicalMap.js';

export function renderPillarPage(pillarSlug, lang = 'en') {
  const t = translations[lang] || translations.en;

  const pillar = db.prepare('SELECT * FROM pillars WHERE slug = ?').get(pillarSlug);
  if (!pillar) return null;

  // Retrieve supporting articles under this pillar
  const articles = db.prepare(`
    SELECT * FROM articles 
    WHERE pillar_id = ? AND review_status = 'Published'
    ORDER BY view_count DESC
  `).all(pillar.id);

  // Retrieve authorities relevant to this pillar
  const authorities = db.prepare("SELECT * FROM authorities WHERE category LIKE ? OR jurisdiction = 'Federal / Nationwide' LIMIT 3")
    .all(`%${pillar.title_en.split(' ')[0]}%`);

  // Retrieve legal terms relevant to this pillar
  const terms = db.prepare('SELECT * FROM legal_terms LIMIT 3').all();

  // Retrieve document checklists
  const checklists = db.prepare('SELECT * FROM document_checklists LIMIT 2').all();

  // Retrieve procedure guides
  const procedure = db.prepare('SELECT * FROM procedure_guides LIMIT 1').get();

  const title = lang === 'ne' ? pillar.title_ne : pillar.title_en;
  const intro = lang === 'ne' ? pillar.intro_ne : pillar.intro_en;
  const overview = lang === 'ne' ? pillar.overview_html_ne : pillar.overview_html_en;

  return `
  <!-- Pillar Header / Hero Section (Requirements 1 & 2) -->
  <section class="pillar-hero-header">
    <div class="site-container">
      <div class="pillar-hero-meta">
        <span class="pillar-badge">Core Strategic Pillar</span>
        <span class="pillar-jurisdiction">🇳🇵 Federal Democratic Republic of Nepal</span>
      </div>

      <h1 class="pillar-h1">
        ${title}
      </h1>

      <p class="pillar-lead-text">
        ${intro}
      </p>

      <!-- Key Statute Bar (Requirement 6) -->
      <div class="pillar-statute-banner">
        <div class="statute-banner-item">
          <span class="statute-label">${lang === 'ne' ? 'प्रमुख ऐन तथा कानुनी निकाय:' : 'Governing Entity:'}</span>
          <strong class="statute-value">${pillar.entity_name}</strong>
        </div>
        <div class="statute-banner-item">
          <span class="statute-label">${lang === 'ne' ? 'समावेश ऐनहरू:' : 'Governing Legislation:'}</span>
          <span class="statute-list">${pillar.laws_covered}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Pillar Body Grid -->
  <div class="site-container pillar-layout-container">
    <div class="pillar-main-content">
      
      <!-- Table of Contents (Requirement 3) -->
      <nav class="pillar-toc-card" aria-label="Table of Contents">
        <h2 class="toc-title">📑 ${t.tableOfContents}</h2>
        <ul class="toc-list">
          <li><a href="#visual-overview">1. ${lang === 'ne' ? 'विषयगत अवधारणा र कानुनी खाका' : 'Topical Overview & Legal Scope'}</a></li>
          <li><a href="#core-concepts">2. ${lang === 'ne' ? 'मुख्य कानुनी अवधारणाहरू र अधिकार' : 'Core Legal Concepts & Rights'}</a></li>
          <li><a href="#topic-guides">3. ${lang === 'ne' ? 'विस्तृत विषयगत लेख तथा मार्गदर्शिका' : 'Topic Articles & Specialized Guides'}</a></li>
          <li><a href="#practical-procedure">4. ${lang === 'ne' ? 'तहगत कानुनी कार्यविधि र उजुरी' : 'Step-by-Step Practical Procedure'}</a></li>
          <li><a href="#checklists">5. ${lang === 'ne' ? 'आवश्यक सरकारी कागजात सूची' : 'Document Readiness Checklist'}</a></li>
          <li><a href="#faq-section">6. ${lang === 'ne' ? 'प्रायः सोधिने कानुनी प्रश्नहरू' : 'Frequently Asked Questions'}</a></li>
          <li><a href="#authorities">7. ${lang === 'ne' ? 'सहयोग गर्ने सरकारी निकायहरू' : 'Responsible Government Authorities'}</a></li>
        </ul>
      </nav>

      <!-- Visual Overview Section (Requirement 4) -->
      <section id="visual-overview" class="pillar-section-block">
        <h2 class="pillar-block-title">
          1. ${lang === 'ne' ? 'विषयगत अवधारणा र कानुनी खाका' : 'Topical Overview & Legal Framework'}
        </h2>
        <div class="editorial-prose">
          ${overview}
        </div>

        <!-- Rights vs Responsibilities Comparison Card -->
        <div class="rights-vs-duties-grid">
          <div class="r-card rights-card">
            <h3 class="r-title">🛡️ ${lang === 'ne' ? 'नागरिकका मौलिक अधिकारहरू' : 'Citizen Legal Protections'}</h3>
            <ul>
              <li>${lang === 'ne' ? 'स्वेच्छाचारी सरकारी हस्तक्षेपबाट पूर्ण कानुनी सुरक्षा' : 'Protection against arbitrary state intervention or detention'}</li>
              <li>${lang === 'ne' ? 'अदालतमा निःशुल्क वा सहुलियत दरमा रिट निवेदन दर्ताको हक' : 'Right to petition the High Court or Supreme Court for judicial remedies'}</li>
              <li>${lang === 'ne' ? 'कानुनी सल्लाहकार छनोट गर्न र गोप्य परामर्श पाउने हक' : 'Right to confidential consultation with legal counsel from moment of restraint'}</li>
            </ul>
          </div>
          <div class="r-card duties-card">
            <h3 class="r-title">📋 ${lang === 'ne' ? 'नागरिकका कानुनी दायित्वहरू' : 'Citizen Legal Responsibilities'}</h3>
            <ul>
              <li>${lang === 'ne' ? 'नेपालको संविधान र प्रचलित ऐन कानुनको अनिवार्य परिपालना' : 'Duty to abide by the Constitution of Nepal and statutory legislation'}</li>
              <li>${lang === 'ne' ? 'सरकारी निकायलाई तोकिएको ढाँचामा सत्य विवरण पेश गर्ने कर्तव्य' : 'Obligation to submit truthful documentation to administrative bodies'}</li>
              <li>${lang === 'ne' ? 'अरु नागरिकका मौलिक हकमा बाधा नपुर्याउने कर्तव्य' : 'Responsibility to respect the fundamental rights and liberties of others'}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Core Legal Concepts & Definitions (Requirement 5) -->
      <section id="core-concepts" class="pillar-section-block">
        <h2 class="pillar-block-title">
          2. ${lang === 'ne' ? 'मुख्य कानुनी अवधारणाहरू र शब्दावली' : 'Core Legal Concepts & Definitions'}
        </h2>
        <div class="terms-mini-grid">
          ${terms.map(trm => `
            <div class="term-mini-card">
              <span class="term-cat">${trm.category}</span>
              <h3 class="term-name">${lang === 'ne' ? trm.term_ne : trm.term_en}</h3>
              <p class="term-def">
                ${lang === 'ne' ? trm.simple_explanation_ne : trm.simple_explanation_en}
              </p>
              <span class="term-statute">Source: ${trm.legal_source}</span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Individual Topic Cards / Satellite Articles (Requirements 7 & 8) -->
      <section id="topic-guides" class="pillar-section-block">
        <h2 class="pillar-block-title">
          3. ${lang === 'ne' ? 'विस्तृत विषयगत लेख तथा मार्गदर्शिका' : 'Supporting Legal Guides in This Pillar'}
        </h2>
        <p class="pillar-block-sub">
          ${lang === 'ne' 
            ? 'यस स्तम्भ अन्तर्गतका विस्तृत अनुसन्धान गरिएका लेखहरू, जसमा प्रत्येक कानुनी प्रश्नको स्पष्ट उत्तर दिइएको छ:'
            : 'In-depth, verified guides answering practical citizen questions under this pillar:'}
        </p>

        <div class="pillar-articles-list">
          ${articles.map(art => `
            <article class="pillar-article-item">
              <div class="article-item-content">
                <span class="article-item-badge">Verified Statute</span>
                <h3 class="article-item-title">
                  <a href="/${pillar.slug}/${art.slug}/?lang=${lang}">
                    ${lang === 'ne' ? art.title_ne : art.title_en}
                  </a>
                </h3>
                <p class="article-item-summary">
                  ${lang === 'ne' ? art.summary_ne : art.summary_en}
                </p>
                <div class="article-item-meta">
                  <span>⚖️ ${art.applicable_legislation}</span>
                  <span>&bull;</span>
                  <span>🗓️ Verified: ${art.last_verified_date}</span>
                </div>
              </div>
              <div class="article-item-action">
                <a href="/${pillar.slug}/${art.slug}/?lang=${lang}" class="btn btn-outline">
                  ${lang === 'ne' ? 'लेख पढ्नुहोस्' : 'Read Guide'} &rarr;
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Practical Step-by-Step Procedure (Requirement 9) -->
      ${procedure ? `
        <section id="practical-procedure" class="pillar-section-block">
          <h2 class="pillar-block-title">
            4. ${lang === 'ne' ? 'तहगत कानुनी कार्यविधि' : 'Step-by-Step Legal Procedure'}
          </h2>
          <div class="procedure-card">
            <h3 class="procedure-title">${lang === 'ne' ? procedure.title_ne : procedure.title_en}</h3>
            <p class="procedure-summary">${lang === 'ne' ? procedure.summary_ne : procedure.summary_en}</p>
            <div class="steps-flow">
              ${JSON.parse(procedure.steps_json).map(s => `
                <div class="step-card">
                  <div class="step-badge">Step ${s.step}</div>
                  <h4 class="step-heading">${lang === 'ne' ? s.title_ne : s.title_en}</h4>
                  <p class="step-detail">${s.desc_en}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Document Readiness Checklists (Requirement 10) -->
      <section id="checklists" class="pillar-section-block">
        <h2 class="pillar-block-title">
          5. ${lang === 'ne' ? 'आवश्यक सरकारी कागजात तयारी' : 'Required Legal Document Checklist'}
        </h2>
        ${checklists.map(chk => `
          <div class="checklist-interactive-card" data-checklist-id="${chk.id}">
            <h3 class="checklist-title">📋 ${lang === 'ne' ? chk.title_ne : chk.title_en}</h3>
            <p class="checklist-desc">${lang === 'ne' ? chk.description_ne : chk.description_en}</p>
            <div class="checklist-items">
              ${JSON.parse(chk.items_json).map(item => `
                <label class="checklist-label">
                  <input type="checkbox" class="checklist-cb" />
                  <span class="checklist-text">${lang === 'ne' ? item.label_ne : item.label_en}</span>
                  ${item.required ? `<span class="required-tag">${lang === 'ne' ? 'अनिवार्य' : 'Mandatory'}</span>` : ''}
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Frequently Asked Questions Accordion (Requirement 11) -->
      <section id="faq-section" class="pillar-section-block">
        <h2 class="pillar-block-title">
          6. ${t.frequentlyAskedQuestions}
        </h2>
        <div class="faq-accordion-group">
          <div class="faq-item">
            <button class="faq-question-btn" aria-expanded="false">
              <span>${lang === 'ne' ? 'यस क्षेत्रको कानुन हनन भएमा सर्वप्रथम कहाँ उजुरी गर्ने?' : 'Where do I file an initial complaint if these rights are violated?'}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer-panel">
              <p>${lang === 'ne' 
                ? 'विवादको प्रकृति अनुसार स्थानीय वडा कार्यालय, जिल्ला प्रशासन कार्यालय वा सम्बन्धित विभागीय कार्यालय (जस्तै श्रम कार्यालय, मालपोत वा उपभोक्ता संरक्षण विभाग) मा लिखित उजुरी दिनुपर्छ।'
                : 'Depending on the statutory subject, initial complaints should be submitted to the local Ward Judicial Committee, the District Labour Office, the Land Revenue Office, or the Department of Commerce.'}</p>
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question-btn" aria-expanded="false">
              <span>${lang === 'ne' ? 'के सरकारी निकायले गरेको निर्णय विरुद्ध अदालत जान सकिन्छ?' : 'Can administrative government decisions be challenged in court?'}</span>
              <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer-panel">
              <p>${lang === 'ne'
                ? 'अवश्य सकिन्छ। कुनै पनि सरकारी निकाय वा अधिकारीले प्रचलित कानुन विपरित वा अधिकार क्षेत्र मिचेर गरेको निर्णय विरुद्ध उच्च अदालतमा ३५ दिनभित्र पुनरावेदन वा रिट निवेदन दर्ता गर्न सकिन्छ।'
                : 'Yes. Any administrative decision exceeding legal jurisdiction or breaching natural justice can be appealed to the High Court under statutory appeal procedures or Article 144 extraordinary writ jurisdiction.'}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Government Authorities (Requirement 12) -->
      <section id="authorities" class="pillar-section-block">
        <h2 class="pillar-block-title">
          7. ${lang === 'ne' ? 'सम्बन्धित सरकारी निकायहरू र अदालत' : 'Responsible Government Authorities'}
        </h2>
        <div class="authorities-grid">
          ${authorities.map(auth => `
            <div class="authority-card">
              <span class="auth-category">${auth.category}</span>
              <h3 class="auth-title">${lang === 'ne' ? auth.name_ne : auth.name_en}</h3>
              <p class="auth-role">${lang === 'ne' ? auth.role_ne : auth.role_en}</p>
              <div class="auth-contacts">
                <span>📞 ${auth.phone}</span>
                ${auth.emergency_helpline ? `<span>🚨 ${auth.emergency_helpline}</span>` : ''}
              </div>
              <a href="${auth.website_url}" target="_blank" rel="noopener noreferrer" class="auth-link">
                ${lang === 'ne' ? 'आधिकारिक पोर्टल खोल्नुहोस्' : 'Visit Official Portal'} &nearr;
              </a>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Educational Disclaimer Banner (Requirement 15) -->
      <div class="pillar-disclaimer-card">
        <div class="disclaimer-icon">⚖️</div>
        <div>
          <h4 class="disclaimer-heading">${t.disclaimerTitle}</h4>
          <p class="disclaimer-body">${t.disclaimerText}</p>
        </div>
      </div>

      <!-- Next Steps Call to Action (Requirement 16) -->
      <div class="pillar-cta-box">
        <h3>${lang === 'ne' ? 'के तपाईंलाई व्यक्तिगत कानुनी सहयोग चाहिएको छ?' : 'Need Personal Guidance on This Topic?'}</h3>
        <p>${lang === 'ne' 
          ? 'हाम्रो अन्तरक्रियात्मक अधिकार अन्वेषक चलाउनुहोस् वा निःशुल्क कानुनी सहायता केन्द्रको विवरण हेर्नुहोस्।'
          : 'Use our interactive Legal Rights Explorer or contact your local court-appointed Bar Association legal aid committee.'}</p>
        <div class="cta-btn-group">
          <a href="/tools/rights-explorer/?lang=${lang}" class="btn btn-primary">
            ${t.rightsExplorerTitle}
          </a>
          <a href="/ask-question/?lang=${lang}" class="btn btn-secondary">
            ${t.askAQuestion}
          </a>
        </div>
      </div>

    </div>

    <!-- Sticky Pillar Sidebar with Hub-Spoke Semantic Connections -->
    <aside class="pillar-sidebar">
      <div class="sidebar-widget">
        <h3 class="widget-title">📌 ${lang === 'ne' ? 'अन्य ४ कानुनी स्तम्भहरू' : 'Other Core Pillars'}</h3>
        <ul class="sidebar-links-list">
          ${topicalMap.corePillars
            .filter(p => p.slug !== pillar.slug)
            .map(p => `
              <li>
                <a href="/${p.slug}/?lang=${lang}">
                  ${lang === 'ne' ? p.title_ne : p.title_en}
                </a>
              </li>
            `).join('')}
        </ul>
      </div>

      <div class="sidebar-widget">
        <h3 class="widget-title">🏛️ ${lang === 'ne' ? 'आधिकारिक स्रोतहरू' : 'Official Primary Repositories'}</h3>
        <ul class="sidebar-sources-list">
          <li>
            <a href="https://lawcommission.gov.np" target="_blank" rel="noopener noreferrer">
              Nepal Law Commission (नेपाल कानुन आयोग) &nearr;
            </a>
          </li>
          <li>
            <a href="https://supremecourt.gov.np" target="_blank" rel="noopener noreferrer">
              Supreme Court of Nepal (सर्वोच्च अदालत) &nearr;
            </a>
          </li>
          <li>
            <a href="https://rajpatra.dop.gov.np" target="_blank" rel="noopener noreferrer">
              Nepal Gazette Archive (नेपाल राजपत्र) &nearr;
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-widget feedback-widget">
        <h3 class="widget-title">📝 ${lang === 'ne' ? 'त्रुटि देखिएमा' : 'Report Statutory Inaccuracy'}</h3>
        <p class="widget-desc">Help us maintain 100% legal precision for the public.</p>
        <a href="/report-error/?url=/${pillar.slug}/&lang=${lang}" class="btn btn-outline btn-sm">
          ${t.reportAnError}
        </a>
      </div>
    </aside>
  </div>
  `;
}
