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

  // Quick Problem Scenarios tailored for everyday citizens
  const problemScenarios = [
    {
      icon: '💼',
      badge_en: 'Employment & Labour',
      badge_ne: 'श्रम तथा रोजगार',
      title_en: 'Unpaid Wages or Sudden Termination?',
      title_ne: 'तलब नपाएमा वा अचानक कामबाट निकालिएमा?',
      desc_en: 'Employer refusing overtime, withholding salary, or firing without severance under the Labour Act 2074.',
      desc_ne: 'श्रम ऐन २०७४ अनुसार तलब नदिएमा, ओभरटाइम नपाएमा वा बिना क्षतिपूर्ति कामबाट हटाएमा के गर्ने?',
      link: `/employment-labour-rights/unpaid-salary-employer-labour-complaint-nepal/?lang=${lang}`,
      statute: 'Labour Act 2074 &bull; Sec 163',
      color: 'teal'
    },
    {
      icon: '🏠',
      badge_en: 'Property & Land',
      badge_ne: 'घरजग्गा तथा सम्पत्ति',
      title_en: 'Buying Land? Verify Lalpurja First',
      title_ne: 'जग्गा किन्दै हुनुहुन्छ? पहिले लालपुर्जा जाँच्नुहोस्',
      desc_en: 'Avoid forged ownership deeds. Step-by-step verification at Malpot and Napi offices before paying.',
      desc_ne: 'नक्कली लालपुर्जाबाट जोगिने उपाय, मालपोत र नापी कार्यालयमा स्रेस्ता तथा कित्ताकाट भिडाउने कानुनी विधि।',
      link: `/property-land-rights/verify-land-ownership-lalpurja-nepal-guide/?lang=${lang}`,
      statute: 'Land Revenue Act 2034',
      color: 'amber'
    },
    {
      icon: '⚖️',
      badge_en: 'Police & Criminal Law',
      badge_ne: 'प्रहरी तथा फौजदारी कानुन',
      title_en: 'Rights If Arrested by the Police',
      title_ne: 'प्रहरीले पक्राउ गरेमा नागरिकका अधिकार',
      desc_en: 'Mandatory 24-hour court appearance deadline, right to consult a lawyer, arrest warrant, and medical checkup.',
      desc_ne: '२४ घण्टाभित्र अदालतमा उपस्थित गराउनुपर्ने म्याद, वकिल राख्न पाउने हक, पक्राउ पुर्जी र स्वास्थ्य जाँच।',
      link: `/consumer-cyber-criminal-rights/rights-when-arrested-by-police-nepal/?lang=${lang}`,
      statute: 'Constitution Art. 20 &bull; Penal Code',
      color: 'rose'
    },
    {
      icon: '💍',
      badge_en: 'Family & Marriage',
      badge_ne: 'पारिवारिक तथा वैवाहिक हक',
      title_en: 'Court Marriage Process & Documents',
      title_ne: 'अदालती विवाह (Court Marriage) को प्रक्रिया',
      desc_en: 'Complete document checklist, age verification (20+), witness rules, and District Court registration.',
      desc_ne: '२० वर्ष उमेर पूरा, आवश्यक प्रमाण कागजात, साक्षी र जिल्ला अदालतमा निवेदन दर्ता गर्ने सम्पूर्ण विधि।',
      link: `/family-marriage-rights/court-marriage-registration-nepal-process-documents/?lang=${lang}`,
      statute: 'Civil Code 2074 &bull; Sec 76-84',
      color: 'purple'
    },
    {
      icon: '💻',
      badge_en: 'Cyber & Online Fraud',
      badge_ne: 'साइबर सुरक्षा तथा ठगी',
      title_en: 'Online Shopping Scams & Cyber Harassment',
      title_ne: 'अनलाइन किनमेल ठगी वा सामाजिक सञ्जालमा ब्ल्याकमेल?',
      desc_en: 'Immediate steps to report financial fraud, fake eSewa/Khalti transfers, and blackmail to the Cyber Bureau.',
      desc_ne: 'डिजिटल भुक्तानी ठगी, नक्कली सामान र फेसबुक/ह्वाट्सएप ब्ल्याकमेलविरुद्ध नेपाल प्रहरी साइबर ब्युरोमा उजुरी।',
      link: `/consumer-cyber-criminal-rights/online-shopping-scams-cyber-fraud-reporting-nepal/?lang=${lang}`,
      statute: 'Electronic Transactions Act 2063',
      color: 'blue'
    },
    {
      icon: '📜',
      badge_en: 'Constitutional Rights',
      badge_ne: 'मौलिक हक तथा सूचनाको हक',
      title_en: 'How to File a Right to Information (RTI)',
      title_ne: 'सरकारी निकायबाट सूचना कसरी माग्ने (RTI)?',
      desc_en: 'Exercise your constitutional right to access public office budgets, contracts, and citizen decisions.',
      desc_ne: 'संविधानको धारा २७ अनुसार सार्वजनिक निकायका काम, बजेट र निर्णयको सूचना माग्ने निवेदनको ढाँचा।',
      link: `/fundamental-rights/right-to-information-nepal-how-to-file-rti/?lang=${lang}`,
      statute: 'RTI Act 2064 &bull; Sec 3 & 7',
      color: 'indigo'
    }
  ];

  // The 8 Core Questions Framework Infographic Data
  const eightQuestions = [
    { num: '01', title_en: 'What is the governing law?', title_ne: 'प्रचलित कानुन के हो?', sub_en: 'Act name, year & Gazette citation', sub_ne: 'ऐनको नाम, वर्ष र राजपत्र उद्धरण' },
    { num: '02', title_en: 'What does it mean in simple words?', title_ne: 'सरल भाषामा यसको अर्थ के हो?', sub_en: 'Zero legal jargon, plain language translation', sub_ne: 'जटिल कानुनी भाषाको सरल व्याख्या' },
    { num: '03', title_en: 'Who does it protect or apply to?', title_ne: 'यो कसलाई लागू हुन्छ र कसलाई जोगाउँछ?', sub_en: 'Citizen eligibility, scope & exceptions', sub_ne: 'नागरिक योग्यता, परिधि र अपवाद' },
    { num: '04', title_en: 'What are your specific rights?', title_ne: 'तपाईंका कानुनी अधिकारहरू के-के हुन्?', sub_en: 'Explicit entitlements under the statute', sub_ne: 'ऐनले दिएका स्पष्ट कानुनी सुविधाहरू' },
    { num: '05', title_en: 'What are your legal responsibilities?', title_ne: 'तपाईंका कर्तव्य तथा जिम्मेवारी के हुन्?', sub_en: 'Deadlines, documentation & obligations', sub_ne: 'म्याद, प्रमाण कागजात र कर्तव्य' },
    { num: '06', title_en: 'What if your rights are violated?', title_ne: 'हक हनन भएमा तुरुन्त के गर्ने?', sub_en: 'Emergency steps & formal dispute complaints', sub_ne: 'तत्काल चाल्नुपर्ने कदम र उजुरी प्रक्रिया' },
    { num: '07', title_en: 'Which authority can help you?', title_ne: 'कुन सरकारी निकायले सहयोग गर्छ?', sub_en: 'Offices, police stations & court remedies', sub_ne: 'सम्बन्धित मन्त्रालय, प्रहरी र अदालत' },
    { num: '08', title_en: 'Where is the official law document?', title_ne: 'आधिकारिक कानुन कहाँ हेर्न सकिन्छ?', sub_en: 'Nepal Law Commission & Gazette source link', sub_ne: 'नेपाल कानुन आयोगको आधिकारिक लिंक' }
  ];

  return `
  <!-- =========================================================================
       HERO SECTION: Civic Legal Knowledge Hub
       ========================================================================= -->
  <section class="home-hero-v2" aria-labelledby="hero-heading">
    <div class="hero-bg-overlay" aria-hidden="true"></div>
    <div class="site-container hero-container-v2">
      
      <!-- Live Status Badge -->
      <div class="hero-badge-wrap">
        <div class="hero-status-pill-v2">
          <span class="pulse-indicator-v2" aria-hidden="true"></span>
          <span class="hero-pill-text">
            ${lang === 'ne' 
              ? '🇳🇵 नेपालको सार्वजनिक कानुनी सचेतना मञ्च &bull; १००% निःशुल्क खुला पहुँच' 
              : '🇳🇵 Nepal Legal Knowledge Hub &bull; 100% Free Public Civic Resource'}
          </span>
        </div>
      </div>

      <!-- Main Headline -->
      <h1 id="hero-heading" class="hero-title-v2">
        <span class="hero-title-highlight">
          ${lang === 'ne' ? 'आफ्नो अधिकार जान्नुहोस्।' : 'Know Your Rights.'}
        </span>
        <span class="hero-title-sub">
          ${lang === 'ne' ? 'आफ्नो कानुन बुझ्नुहोस्।' : 'Understand Your Laws.'}
        </span>
      </h1>

      <p class="hero-subtitle-v2">
        ${lang === 'ne'
          ? 'नेपालको संविधानका ३१ मौलिक हकदेखि श्रम सम्झौता, अंशबण्डा, लालपुर्जा खरिद र साइबर सुरक्षासम्मका कानुनी प्रावधानहरूको सरल, निष्पक्ष र आधिकारिक मार्गदर्शिका।'
          : 'Demystifying statutory laws, constitutional rights, court procedures, and citizen remedies into crystal-clear everyday language without confusing legal jargon.'}
      </p>

      <!-- Prominent Natural Language Search Box -->
      <div class="hero-search-card">
        <form action="/search" method="GET" class="hero-search-form-v2" role="search">
          <input type="hidden" name="lang" value="${lang}" />
          <div class="hero-search-input-group">
            <svg class="hero-search-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input 
              type="search" 
              name="q" 
              class="hero-search-field" 
              placeholder="${t.searchPlaceholder}" 
              autocomplete="off"
              required
            />
            <span class="search-kbd-hint" aria-hidden="true">Press Ctrl+K</span>
          </div>
          <button type="submit" class="hero-search-btn-v2">
            <span>${t.searchButton}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </form>

        <!-- Popular Real-Life Search Prompts -->
        <div class="hero-chips-bar">
          <span class="hero-chips-label">
            ${lang === 'ne' ? '🔍 खोजिएका मुख्य विषयहरू:' : '🔍 Frequent Situations:'}
          </span>
          <div class="hero-chips-slider">
            <a href="/employment-labour-rights/unpaid-salary-employer-labour-complaint-nepal/?lang=${lang}" class="hero-query-chip">
              💼 ${lang === 'ne' ? 'तलब नपाए के गर्ने?' : 'Unpaid salary claim'}
            </a>
            <a href="/property-land-rights/verify-land-ownership-lalpurja-nepal-guide/?lang=${lang}" class="hero-query-chip">
              🏠 ${lang === 'ne' ? 'लालपुर्जा जाँच विधि' : 'Lalpurja verification'}
            </a>
            <a href="/consumer-cyber-criminal-rights/rights-when-arrested-by-police-nepal/?lang=${lang}" class="hero-query-chip">
              ⚖️ ${lang === 'ne' ? 'प्रहरी पक्राउ र २४ घण्टे म्याद' : 'Police arrest rights'}
            </a>
            <a href="/family-marriage-rights/court-marriage-registration-nepal-process-documents/?lang=${lang}" class="hero-query-chip">
              💍 ${lang === 'ne' ? 'अदालती विवाह दर्ता' : 'Court marriage guide'}
            </a>
            <a href="/consumer-cyber-criminal-rights/online-shopping-scams-cyber-fraud-reporting-nepal/?lang=${lang}" class="hero-query-chip">
              💻 ${lang === 'ne' ? 'अनलाइन ठगी उजुरी' : 'Cyber scam reporting'}
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Platform Trust Metrics Bar -->
      <div class="hero-metrics-bar">
        <div class="metric-item">
          <span class="metric-number">5</span>
          <span class="metric-label">${lang === 'ne' ? 'रणनीतिक कानुनी स्तम्भ' : 'Core Legal Pillars'}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-number">31</span>
          <span class="metric-label">${lang === 'ne' ? 'संवैधानिक मौलिक हक' : 'Fundamental Rights'}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-number">8</span>
          <span class="metric-label">${lang === 'ne' ? 'अनिवार्य कानुनी उत्तर' : 'Mandatory Answers/Guide'}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-number">100%</span>
          <span class="metric-label">${lang === 'ne' ? 'निःशुल्क नागरिक पहुँच' : 'Free Civic Access'}</span>
        </div>
      </div>

    </div>
  </section>

  <!-- =========================================================================
       EMERGENCY QUICK-DIAL BANNER: Instant 24/7 Helplines
       ========================================================================= -->
  <aside class="emergency-quickbar" aria-label="${lang === 'ne' ? 'आपतकालीन कानुनी हटलाइनहरू' : 'Emergency Citizen Helplines'}">
    <div class="site-container emergency-inner">
      <div class="emergency-label-box">
        <span class="emergency-pulse" aria-hidden="true"></span>
        <span class="emergency-title">
          ${lang === 'ne' ? '🚨 आपतकालीन नागरिक हटलाइनहरू (२४/७ निःशुल्क):' : '🚨 24/7 Official Emergency Citizen Helplines:'}
        </span>
      </div>
      <div class="emergency-numbers-row">
        <a href="tel:100" class="emergency-chip emergency-police" title="Nepal Police Control">
          <span class="em-name">${lang === 'ne' ? 'प्रहरी' : 'Police'}:</span>
          <strong class="em-num">100</strong>
        </a>
        <a href="tel:1145" class="emergency-chip emergency-women" title="National Women Commission - Domestic Violence Helpline">
          <span class="em-name">${lang === 'ne' ? 'महिला आयोग' : 'Women Helpline'}:</span>
          <strong class="em-num">1145</strong>
        </a>
        <a href="tel:104" class="emergency-chip emergency-child" title="Child Protection Helpline CWIN">
          <span class="em-name">${lang === 'ne' ? 'बालबालिका' : 'Child Helpline'}:</span>
          <strong class="em-num">104</strong>
        </a>
        <a href="tel:1114" class="emergency-chip emergency-nhrc" title="National Human Rights Commission Hotline">
          <span class="em-name">${lang === 'ne' ? 'मानव अधिकार' : 'Human Rights'}:</span>
          <strong class="em-num">1114</strong>
        </a>
        <a href="tel:1137" class="emergency-chip emergency-consumer" title="Consumer Redress & Price Gouging Complaint">
          <span class="em-name">${lang === 'ne' ? 'उपभोक्ता' : 'Consumer'}:</span>
          <strong class="em-num">1137</strong>
        </a>
      </div>
    </div>
  </aside>

  <!-- =========================================================================
       SCENARIO MATRIX: "What Legal Situation Are You Facing?"
       ========================================================================= -->
  <section class="scenarios-section" aria-labelledby="scenarios-heading">
    <div class="site-container">
      <div class="section-header-centered">
        <span class="section-kicker-v2">
          ${lang === 'ne' ? 'दैनिक व्यावहारिक समस्याहरू' : 'Everyday Real-World Situations'}
        </span>
        <h2 id="scenarios-heading" class="section-title-v2">
          ${lang === 'ne' ? 'तपाईं अहिले कस्तो कानुनी समस्यामा हुनुहुन्छ?' : 'What Legal Situation Are You Facing Today?'}
        </h2>
        <p class="section-lead-v2">
          ${lang === 'ne' 
            ? 'कानुनका धारा घोक्न पर्दैन। आफ्नो परिस्थिति छान्नुहोस् र तत्काल चाल्नुपर्ने कानुनी कदम, चाहिने कागजात र उजुरी गर्ने कार्यालय जान्नुहोस्।'
            : 'Select your exact scenario below for immediate step-by-step guidance, necessary evidence checklists, and official complaint offices.'}
        </p>
      </div>

      <div class="scenarios-grid">
        ${problemScenarios.map(sc => `
          <div class="scenario-card scenario-theme-${sc.color}">
            <div class="scenario-top">
              <span class="scenario-icon">${sc.icon}</span>
              <span class="scenario-badge">${lang === 'ne' ? sc.badge_ne : sc.badge_en}</span>
            </div>
            <h3 class="scenario-title">
              <a href="${sc.link}">
                ${lang === 'ne' ? sc.title_ne : sc.title_en}
              </a>
            </h3>
            <p class="scenario-desc">
              ${lang === 'ne' ? sc.desc_ne : sc.desc_en}
            </p>
            <div class="scenario-footer">
              <span class="scenario-statute">⚖️ ${sc.statute}</span>
              <a href="${sc.link}" class="scenario-action-link" aria-label="Read guide for ${lang === 'ne' ? sc.title_ne : sc.title_en}">
                <span>${lang === 'ne' ? 'समाधान हेर्नुहोस्' : 'See Remedies'}</span>
                &rarr;
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- =========================================================================
       5 CORE STRATEGIC PILLARS: Hub & Spoke Semantic Architecture
       ========================================================================= -->
  <section id="core-pillars" class="pillars-section-v2" aria-labelledby="pillars-heading">
    <div class="site-container">
      <div class="section-header-centered">
        <span class="section-kicker-v2">
          ${lang === 'ne' ? 'प्रमुख कानुनी विषयहरू' : 'Core Knowledge Domains'}
        </span>
        <h2 id="pillars-heading" class="section-title-v2">
          ${lang === 'ne' ? '५ मुख्य कानुनी स्तम्भहरू' : 'The Five Legal Pillars of Citizen Protection'}
        </h2>
        <p class="section-lead-v2">
          ${lang === 'ne'
            ? 'संविधानका ३१ मौलिक हकदेखि दैनिक रोजगार, अंशबण्डा, जग्गा खरिद र साइबर सुरक्षासम्मका विस्तृत कानुनी मार्गनिर्देशिका।'
            : 'Explore our authoritative pillars covering constitutional safeguards, fair wages, property conveyancing, family protection, and criminal justice.'}
        </p>
      </div>

      <div class="pillars-grid-v2">
        ${pillars.map((pillar, idx) => `
          <article class="pillar-card-v2 pillar-color-${idx + 1}">
            <div class="pillar-header-v2">
              <div class="pillar-badge-group">
                <span class="pillar-number">0${idx + 1}</span>
                <span class="pillar-statute-chip">${pillar.entity_name}</span>
              </div>
            </div>

            <h3 class="pillar-title-v2">
              <a href="/${pillar.slug}/?lang=${lang}">
                ${lang === 'ne' ? pillar.title_ne : pillar.title_en}
              </a>
            </h3>

            <p class="pillar-intro-v2">
              ${lang === 'ne' ? pillar.intro_ne : pillar.intro_en}
            </p>

            <div class="pillar-statutes-box">
              <span class="statutes-label">${lang === 'ne' ? 'समावेश ऐनहरू:' : 'Governing Acts:'}</span>
              <p class="statutes-text">${pillar.laws_covered}</p>
            </div>

            <div class="pillar-bottom-bar">
              <a href="/${pillar.slug}/?lang=${lang}" class="pillar-explore-btn">
                <span>${lang === 'ne' ? 'विस्तृत स्तम्भ हेर्नुहोस्' : 'Explore Pillar Guides'}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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

  <!-- =========================================================================
       THE 8 MANDATORY QUESTIONS FRAMEWORK: Why Citizens Trust This Portal
       ========================================================================= -->
  <section class="framework-showcase-section" aria-labelledby="framework-heading">
    <div class="site-container">
      <div class="framework-wrapper">
        <div class="framework-header">
          <span class="section-kicker-v2" style="color: #60A5FA;">
            ${lang === 'ne' ? 'हाम्रो सम्पादकीय मापदण्ड' : 'Our Plain-Language Standard'}
          </span>
          <h2 id="framework-heading" class="framework-title">
            ${lang === 'ne' 
              ? 'प्रत्येक कानुनी लेखमा पाइने ८ अनिवार्य नागरिक उत्तरहरू' 
              : 'The 8 Mandatory Answers Built Into Every Legal Guide'}
          </h2>
          <p class="framework-desc">
            ${lang === 'ne'
              ? 'यस पोर्टलमा प्रकाशित हरेक कानुनी सामग्रीले सर्वसाधारण नागरिकका ८ आधारभूत प्रश्नको सीधा, स्पष्ट र व्यावहारिक जवाफ दिन्छ। कुनै अस्पष्टता वा बनावटी कानुनी दफा राखिँदैन।'
              : 'Instead of dense legislative prose, every statutory article on this platform is structured around the 8 questions citizens actually ask when facing legal dilemmas.'}
          </p>
        </div>

        <div class="framework-grid">
          ${eightQuestions.map(item => `
            <div class="framework-card">
              <span class="framework-num">${item.num}</span>
              <h4 class="framework-q">${lang === 'ne' ? item.title_ne : item.title_en}</h4>
              <p class="framework-sub">${lang === 'ne' ? item.sub_ne : item.sub_en}</p>
            </div>
          `).join('')}
        </div>

        <div class="framework-footer">
          <div class="framework-badge-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${lang === 'ne' ? 'नेपाल कानुन आयोग तथा नेपाल राजपत्रसँग प्रमाणीकृत' : 'Verified with Official Nepal Law Commission & Gazette'}</span>
          </div>
          <div class="framework-badge-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>${lang === 'ne' ? 'अदालती वकिल वा बिचौलिया बिना बुझ्न सकिने' : 'Understandable Without Expensive Legal Consultation'}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       INTERACTIVE CITIZEN TOOLS HUB
       ========================================================================= -->
  <section class="tools-showcase-section" aria-labelledby="tools-heading">
    <div class="site-container">
      <div class="section-header-centered">
        <span class="section-kicker-v2">
          ${lang === 'ne' ? 'निःशुल्क अन्तरक्रियात्मक औजारहरू' : 'Interactive Citizen Utilities'}
        </span>
        <h2 id="tools-heading" class="section-title-v2">
          ${t.toolsHeader}
        </h2>
        <p class="section-lead-v2">
          ${t.toolsDesc}
        </p>
      </div>

      <div class="tools-card-grid">
        <!-- Tool 1: Rights Explorer -->
        <div class="tool-showcase-card">
          <div class="tool-card-icon-wrap icon-gradient-blue">
            <span class="tool-emoji">🧭</span>
          </div>
          <h3 class="tool-showcase-title">
            <a href="/tools/rights-explorer/?lang=${lang}">
              ${t.rightsExplorerTitle}
            </a>
          </h3>
          <p class="tool-showcase-desc">
            ${t.rightsExplorerDesc}
          </p>
          <ul class="tool-feature-list">
            <li>✓ 3-step decision flow for labour, property, and civil disputes</li>
            <li>✓ Identifies relevant legal act and maximum claim deadline</li>
            <li>✓ Instant emergency actions checklist</li>
          </ul>
          <a href="/tools/rights-explorer/?lang=${lang}" class="btn btn-primary tool-btn">
            ${lang === 'ne' ? 'अधिकार अन्वेषक खोल्नुहोस्' : 'Launch Rights Explorer'} &rarr;
          </a>
        </div>

        <!-- Tool 2: Document Checklist -->
        <div class="tool-showcase-card">
          <div class="tool-card-icon-wrap icon-gradient-emerald">
            <span class="tool-emoji">📋</span>
          </div>
          <h3 class="tool-showcase-title">
            <a href="/tools/document-checklist/?lang=${lang}">
              ${t.docChecklistTitle}
            </a>
          </h3>
          <p class="tool-showcase-desc">
            ${t.docChecklistDesc}
          </p>
          <ul class="tool-feature-list">
            <li>✓ Interactive document checklists with state persistence</li>
            <li>✓ Court marriage, Land purchase (Lalpurja), Labour claims</li>
            <li>✓ Printable and saveable verification receipts</li>
          </ul>
          <a href="/tools/document-checklist/?lang=${lang}" class="btn btn-secondary tool-btn">
            ${lang === 'ne' ? 'कागजात सूची हेर्नुहोस्' : 'View Document Checklists'} &rarr;
          </a>
        </div>

        <!-- Tool 3: Legal Dictionary -->
        <div class="tool-showcase-card">
          <div class="tool-card-icon-wrap icon-gradient-amber">
            <span class="tool-emoji">📖</span>
          </div>
          <h3 class="tool-showcase-title">
            <a href="/tools/legal-dictionary/?lang=${lang}">
              ${t.legalDictionaryTitle}
            </a>
          </h3>
          <p class="tool-showcase-desc">
            ${t.legalDictionaryDesc}
          </p>
          <ul class="tool-feature-list">
            <li>✓ Plain language glossary of Nepali court terminology</li>
            <li>✓ Lalpurja, Anshbanda, Firadpatra, Milapatra, Mandamus</li>
            <li>✓ Real-time keyword filter with English and Devanagari</li>
          </ul>
          <a href="/tools/legal-dictionary/?lang=${lang}" class="btn btn-secondary tool-btn">
            ${lang === 'ne' ? 'कानुनी शब्दकोश खोल्नुहोस्' : 'Explore Legal Dictionary'} &rarr;
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- =========================================================================
       POPULAR PRACTICAL GUIDES: Most Read Articles
       ========================================================================= -->
  <section class="popular-guides-section-v2" aria-labelledby="guides-heading">
    <div class="site-container">
      <div class="guides-header-row">
        <div>
          <span class="section-kicker-v2">
            ${lang === 'ne' ? 'प्रायोगिक मार्गदर्शिका' : 'Practical Guides'}
          </span>
          <h2 id="guides-heading" class="section-title-v2" style="margin-bottom:0.25rem;">
            ${lang === 'ne' ? 'दैनिक जीवनमा काम लाग्ने कानुनी जानकारी' : 'Most-Read Everyday Legal Guides'}
          </h2>
          <p class="section-lead-v2" style="margin-bottom:0;">
            ${lang === 'ne' 
              ? 'सर्वसाधारण नागरिकले नियमित रूपमा सामना गर्ने व्यावहारिक समस्याहरूको कानुनसम्मत समाधान।'
              : 'Verified, step-by-step instructions answering all 8 mandatory citizen questions.'}
          </p>
        </div>
        <a href="/fundamental-rights/?lang=${lang}" class="view-all-guides-btn">
          ${lang === 'ne' ? 'सबै लेखहरू हेर्नुहोस् &rarr;' : 'Browse All Guides &rarr;'}
        </a>
      </div>

      <div class="articles-grid-v2">
        ${latestArticles.map(article => `
          <article class="article-card-v2">
            <div class="article-meta-v2">
              <span class="article-pillar-badge">${lang === 'ne' ? article.pillar_title_ne : article.pillar_title_en}</span>
              <span class="article-verified-pill">
                ✓ ${t.lastVerified}: ${article.last_verified_date}
              </span>
            </div>

            <h3 class="article-title-v2">
              <a href="/${article.pillar_slug}/${article.slug}/?lang=${lang}">
                ${lang === 'ne' ? article.title_ne : article.title_en}
              </a>
            </h3>

            <p class="article-summary-v2">
              ${lang === 'ne' ? article.summary_ne : article.summary_en}
            </p>

            <div class="article-act-pill">
              <span>⚖️ ${article.applicable_legislation}</span>
            </div>

            <div class="article-card-footer-v2">
              <span class="article-read-time">⏱️ 5 min read</span>
              <a href="/${article.pillar_slug}/${article.slug}/?lang=${lang}" class="article-read-link">
                <span>${lang === 'ne' ? 'पूरा लेख पढ्नुहोस्' : 'Read Full Guide'}</span>
                &rarr;
              </a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- =========================================================================
       WHERE TO GET OFFICIAL HELP: Authority Directory Quick Access
       ========================================================================= -->
  <section class="authorities-preview-section-v2" aria-labelledby="authorities-heading">
    <div class="site-container">
      <div class="authorities-header-row">
        <div>
          <span class="section-kicker-v2">${lang === 'ne' ? 'सरकारी निकायहरू' : 'Official Institutions'}</span>
          <h2 id="authorities-heading" class="section-title-v2" style="margin-bottom:0.25rem;">
            ${lang === 'ne' ? 'सहयोग पाउने प्रमुख सरकारी निकाय र अदालतहरू' : 'Where to Seek Official Legal Help'}
          </h2>
          <p class="section-lead-v2" style="margin-bottom:0;">
            ${lang === 'ne' 
              ? 'प्रहरी, अदालत, स्थानीय वडा र संवैधानिक आयोगहरूका प्रमाणित सम्पर्क विवरण।'
              : 'Direct contacts, physical addresses, and jurisdiction details for public institutions.'}
          </p>
        </div>
        <a href="/tools/government-directory/?lang=${lang}" class="view-all-guides-btn">
          ${lang === 'ne' ? 'सबै निकाय हेर्नुहोस् &rarr;' : 'View Complete Directory &rarr;'}
        </a>
      </div>

      <div class="authorities-grid-v2">
        ${authorities.map(auth => `
          <div class="authority-card-v2">
            <div class="auth-card-top">
              <span class="auth-category-badge">${auth.category}</span>
              ${auth.emergency_helpline ? `<span class="auth-helpline-tag">🚨 ${auth.emergency_helpline}</span>` : ''}
            </div>
            <h3 class="auth-title-v2">${lang === 'ne' ? auth.name_ne : auth.name_en}</h3>
            <p class="auth-role-v2">${lang === 'ne' ? auth.role_ne : auth.role_en}</p>
            <div class="auth-details-box">
              <span class="auth-contact-line">📞 <strong>${auth.phone}</strong></span>
              <span class="auth-address-line">📍 ${lang === 'ne' ? auth.address_ne : auth.address_en}</span>
            </div>
            <a href="${auth.website_url}" target="_blank" rel="noopener noreferrer" class="auth-portal-link">
              ${lang === 'ne' ? 'आधिकारिक वेबसाइट खोल्नुहोस्' : 'Visit Official Portal'} &nearr;
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- =========================================================================
       EDITORIAL TRUST COMMITMENT & OPEN ACCESS GUARANTEE
       ========================================================================= -->
  <section class="trust-guarantee-section">
    <div class="site-container">
      <div class="trust-banner-v2">
        <div class="trust-banner-left">
          <span class="trust-kicker-v2">
            ${lang === 'ne' ? '१००% तथ्यपरक र निःशुल्क' : 'Integrity & Verification Guarantee'}
          </span>
          <h2 class="trust-headline-v2">
            ${lang === 'ne' 
              ? 'हाम्रो प्रतिबद्धता: बनावटी वा भ्रमपूर्ण कानुनमुक्त सार्वजनिक मञ्च'
              : 'Our Promise: Zero Hallucinated Law & Uncompromised Public Education'}
          </h2>
          <p class="trust-body-v2">
            ${lang === 'ne'
              ? 'यस पोर्टलमा प्रकाशित प्रत्येक कानुनी लेख नेपाल कानुन आयोग र नेपाल राजपत्रमा प्रकाशित आधिकारिक ऐन, नियम र सर्वोच्च अदालतका फैसलासँग रुजु गरिन्छ। यहाँ कुनै व्यावसायिक विज्ञापन, बिचौलिया प्रवर्द्धन वा सःशुल्क सदस्यता छैन।'
              : 'Every single guide on this platform is verified against the official Nepal Gazette and Nepal Law Commission repositories. We operate as a free civic knowledge initiative—strictly independent, non-commercial, and accessible to every citizen without login.'}
          </p>
          <div class="trust-features-grid">
            <div class="trust-feature-chip">✓ Primary Legislation Only</div>
            <div class="trust-feature-chip">✓ WCAG 2.2 AA Accessibility</div>
            <div class="trust-feature-chip">✓ Open Community CMS (/admin/)</div>
            <div class="trust-feature-chip">✓ English & Nepali Bilingual</div>
          </div>
        </div>

        <div class="trust-banner-right">
          <div class="trust-action-box">
            <h4>${lang === 'ne' ? 'खुला सम्पादकीय प्रणाली' : 'Community Participation'}</h4>
            <p>
              ${lang === 'ne'
                ? 'कुनै कानुन संशोधन भएको छ वा त्रुटि फेला पर्यो? जोकोहीले पनि बिना लगइन सुधार प्रस्ताव गर्न सक्नुहुन्छ।'
                : 'Found an updated amendment or clerical error? Anyone can review error reports or draft new statutory guides.'}
            </p>
            <div class="trust-actions-group">
              <a href="/trust/editorial-policy/?lang=${lang}" class="btn btn-primary">
                ${lang === 'ne' ? 'सम्पादकीय नीति पढ्नुहोस्' : 'Editorial Standards'}
              </a>
              <a href="/admin/?lang=${lang}" class="btn btn-secondary">
                🛡️ ${lang === 'ne' ? 'खुला CMS ड्यासबोर्ड' : 'Open Editorial CMS'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}
