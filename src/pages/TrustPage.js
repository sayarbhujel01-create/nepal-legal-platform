import { translations } from '../data/translations.js';
import { topicalMap } from '../data/topicalMap.js';

export function renderTrustPage(slug, lang = 'en') {
  const t = translations[lang] || translations.en;
  const pageMeta = topicalMap.trustPages.find(p => p.slug === slug);
  if (!pageMeta) return null;

  const contentMap = {
    'about-us': {
      title_en: 'About Us: Public Legal Knowledge Initiative',
      title_ne: 'हाम्रोबारे: सार्वजनिक कानुनी सचेतना अभियान',
      body_en: `
        <h2>Who We Are</h2>
        <p>The <strong>Citizens' Rights & Legal Awareness Platform</strong> is an independent, non-commercial public digital initiative created to bridge the profound information gap between official statutes and ordinary citizens across Nepal. We do not operate as a private law firm seeking client retainers, nor do we sell legal services.</p>

        <h2>Our Primary Audience</h2>
        <p>Our platform is written specifically for the general public: wage laborers seeking to understand overtime rules, families dealing with ancestral property partition, couples navigating court marriage registration, tenants facing unlawful eviction, and citizens wishing to exercise their fundamental rights without intimidation.</p>

        <h2>Our Organizational Values</h2>
        <ul>
          <li><strong>Radical Clarity:</strong> Translating archaic legal language into everyday Nepali and English.</li>
          <li><strong>Statutory Authenticity:</strong> Every fact is anchored to published acts, regulations, and supreme court precedents.</li>
          <li><strong>Complete Independence:</strong> We do not take sponsorship that compromises editorial neutrality or public trust.</li>
          <li><strong>Accessibility First:</strong> Designing for mobile devices, low-bandwidth internet, and screen-readers.</li>
        </ul>
      `,
      body_ne: `
        <h2>हामी को हौँ?</h2>
        <p><strong>नागरिक अधिकार तथा कानुनी सचेतना मञ्च</strong> नेपालका आम नागरिकलाई आफ्ना कानुनी हक र कर्तव्यबारे सुसूचित गराउन सुरु गरिएको एक स्वतन्त्र, खुला र गैरव्यावसायिक सार्वजनिक ज्ञान मञ्च हो। हामी कुनै निजी ल-फर्म होइनौँ र हामी कुनै वकालत सेवा बिक्री गर्दैनौँ।</p>

        <h2>हाम्रो मुख्य उद्देश्य</h2>
        <p>नेपालको संविधान तथा प्रचलित ऐन कानुनहरूमा लेखिएका जटिल कानुनी शब्दहरूलाई सर्वसाधारणले बुझ्ने सरल भाषामा रूपान्तरण गरी नागरिकलाई आफ्ना अधिकारको रक्षा गर्न सक्षम बनाउनु हाम्रो प्रमुख उद्देश्य हो।</p>
      `
    },
    'our-mission': {
      title_en: 'Our Mission & Public Education Philosophy',
      title_ne: 'हाम्रो लक्ष्य तथा सार्वजनिक कानुनी शिक्षा दर्शन',
      body_en: `
        <h2>The Core Problem</h2>
        <p>In Nepal, ignorance of the law is not an excuse before the court (<em>ignorantia juris non excusat</em>). Yet, laws are historically published in dense legislative dialects that are incomprehensible to citizens without formal legal training. This structural barrier allows corrupt intermediaries, exploitative employers, and fraudulent agents to prey on ordinary people.</p>

        <h2>Our Mission</h2>
        <p>To democratize legal knowledge in Nepal by creating a permanently accessible, plain-language, and meticulously verified digital legal knowledge hub that answers: <em>What is the law? What does it mean? What are your rights? And what should you do if something goes wrong?</em></p>
      `,
      body_ne: `
        <h2>हाम्रो मूल दृष्टिकोण</h2>
        <p>अदालतमा 'कानुन थाहा थिएन' भन्न पाइँदैन। तर अधिकांश कानुनहरू सर्वसाधारणले बुझ्न नसक्ने जटिल भाषामा लेखिएका हुन्छन्। हाम्रो लक्ष्य यही दूरीलाई मेटेर प्रत्येक नेपाली नागरिकलाई आफ्ना अधिकार र कर्तव्यबारे स्पष्ट जानकारी दिनु हो।</p>
      `
    },
    'editorial-policy': {
      title_en: 'Editorial Policy & Source Hierarchy',
      title_ne: 'सम्पादकीय नीति तथा स्रोत छनोट मापदण्ड',
      body_en: `
        <h2>Source Hierarchy Standard</h2>
        <p>Our editorial team adheres to an unyielding hierarchy of legal authority:</p>
        <ol>
          <li><strong>Tier 1: Authentic Legislation:</strong> Acts passed by the Federal Parliament as published in the Nepal Gazette (नेपाल राजपत्र) and codified by the Nepal Law Commission.</li>
          <li><strong>Tier 2: Judicial Precedents:</strong> Binding interpretations by the Supreme Court of Nepal published in the Nepal Law Journal (नेपाल कानुन पत्रिका - NKP).</li>
          <li><strong>Tier 3: Executive Regulations & Bylaws:</strong> Gazetted Regulations (नियमावली) and Local Government Operation guidelines.</li>
        </ol>
        <h2>Prohibition of Fabricated Legal Provisions</h2>
        <p>We enforce a strict zero-tolerance policy against inventing section numbers, penalty ranges, or procedural deadlines. If an amendment is pending or a statute is repealed, it is explicitly flagged with effective dates.</p>
      `,
      body_ne: `
        <h2>स्रोत प्रमाणीकरण मापदण्ड</h2>
        <p>यस मञ्चमा लेखिने प्रत्येक लेख नेपाल कानुन आयोग, नेपाल राजपत्र र सर्वोच्च अदालतको नेपाल कानुन पत्रिका (NKP) मा प्रकाशित आधिकारिक फैसलाहरूमा आधारित हुन्छन्। कुनै पनि अनुमानित वा अप्रमाणित कानुन यस मञ्चमा प्रकाशित गरिँदैन।</p>
      `
    },
    'fact-checking-policy': {
      title_en: 'Fact-Checking & Legal Verification Protocol',
      title_ne: 'तथ्य जाँच तथा कानुनी प्रमाणीकरण नीति',
      body_en: `
        <h2>Dual Verification Workflow</h2>
        <p>Every article published on this platform undergoes a multi-layer verification protocol:</p>
        <ul>
          <li><strong>Legislative Status Verification:</strong> Cross-checking whether the referenced Act has been amended by subsequent parliamentary legislation.</li>
          <li><strong>Official Citation Verification:</strong> Ensuring every section number matches the authentic Nepali text in the Nepal Gazette.</li>
          <li><strong>Plain-Language Accuracy Review:</strong> Confirming that simplifying the legal vocabulary has not distorted the substantive legal meaning.</li>
        </ul>
      `,
      body_ne: `
        <h2>तथ्य प्रमाणीकरण प्रक्रिया</h2>
        <p>प्रत्येक लेख प्रकाशन हुनु अघि प्रचलित ऐनको संशोधन स्थिति, राजपत्रको आधिकारिक पाठ र सर्वोच्च अदालतका नवीनतम फैसलाहरूसँग रुजु गरिन्छ।</p>
      `
    },
    'legal-disclaimer': {
      title_en: 'Comprehensive Legal Disclaimer',
      title_ne: 'सार्वजनिक कानुनी अस्वीकरण (Legal Disclaimer)',
      body_en: `
        <h2>Important Public Notice</h2>
        <p><strong>This website is an educational resource, not a law firm.</strong></p>
        <p>The information provided on this platform is for general informational and educational purposes only. Nothing contained on this website constitutes legal advice, a formal legal opinion, or the establishment of a lawyer-client relationship.</p>
        <p>Individual legal situations are nuanced and depend entirely on specific facts, contracts, timelines, and judicial discretion. The law changes over time through legislative amendments and court precedents. You should not act or refrain from acting on the basis of any content on this site without seeking individual advice from a licensed advocate (अधिवक्ता) in Nepal.</p>
      `,
      body_ne: `
        <h2>महत्वपूर्ण सूचना</h2>
        <p><strong>यो वेबसाइट आम कानुनी सचेतनाका लागि मात्र हो, यो कुनै कानुन व्यवसायीको व्यक्तिगत सल्लाह होइन।</strong></p>
        <p>यस पोर्टलमा राखिएका सूचनाहरू सामान्य जानकारी र सचेतनाका लागि हुन्। कुनै पनि कानुनी मुद्दाको निर्णय व्यक्तिका प्रमाण, तथ्य र अदालतको विवेकमा निर्भर हुने हुँदा कुनै पनि कदम चाल्नुअघि आधिकारिक कानुन व्यवसायीसँग परामर्श लिनुहुन अनुरोध गरिन्छ।</p>
      `
    },
    'privacy-policy': {
      title_en: 'Privacy Policy: No Tracking, Complete Privacy',
      title_ne: 'गोपनीयता नीति: नागरिकको गोपनीयताको पूर्ण सम्मान',
      body_en: `
        <h2>Commitment to Privacy</h2>
        <p>Citizens searching for legal help are often facing stressful personal crises (e.g. domestic violence, police custody, debt). We believe privacy is an absolute human right.</p>
        <ul>
          <li>We do NOT sell user data or share query histories with marketing brokers.</li>
          <li>Search queries in our legal search tool are executed locally and without individual profiling.</li>
          <li>When you submit an error report or public legal question, your contact details are used solely to review the submission and are never disclosed publicly.</li>
        </ul>
      `,
      body_ne: `
        <h2>गोपनीयताको संरक्षण</h2>
        <p>हामी नागरिकको गोपनीयतालाई सर्वोच्च प्राथमिकता दिन्छौँ। कानुनी खोजी गर्ने प्रयोगकर्ताको कुनै पनि व्यक्तिगत विवरण तेस्रो पक्षलाई बिक्री वा वितरण गरिँदैन।</p>
      `
    },
    'terms-and-conditions': {
      title_en: 'Terms and Conditions of Use',
      title_ne: 'प्रयोगका सर्तहरू (Terms & Conditions)',
      body_en: `
        <h2>Open Educational Use</h2>
        <p>All educational articles on this platform are made available freely for public awareness, community education, and civic empowerment. Non-profit community organizations and schools are encouraged to print and distribute these guides with attribution.</p>
        <h2>Limitation of Liability</h2>
        <p>While every reasonable effort is made to maintain complete statutory accuracy, the platform and its contributors bear no legal liability for any damages or losses arising from the use of or reliance on the general information provided herein.</p>
      `,
      body_ne: `
        <h2>खुला शैक्षिक प्रयोग</h2>
        <p>यस मञ्चका सामग्रीहरू नागरिक सचेतनाका लागि निःशुल्क अध्ययन र प्रयोग गर्न सकिनेछ। कुनै पनि व्यावसायिक प्रयोजनका लागि अनधिकृत प्रतिलिपि बनाउन निषेध गरिएको छ।</p>
      `
    },
    'corrections-policy': {
      title_en: 'Corrections & Retractions Policy',
      title_ne: 'त्रुटि सच्याउने नीति (Corrections Policy)',
      body_en: `
        <h2>Transparency in Error Correction</h2>
        <p>Laws are dynamic. If a reader, legal practitioner, or government authority discovers any factual inaccuracy, outdated provision, or broken link, we pledge to review and rectify it within 48 hours of notification.</p>
        <p>When substantive corrections are made to an article, we update the <code>last_verified_date</code> and post an explicit errata note in the revision history.</p>
      `,
      body_ne: `
        <h2>पारदर्शी सच्याउने नीति</h2>
        <p>यदि कुनै लेखमा कुनै कानुनी दफा वा विवरण त्रुटिपूर्ण देखिएमा पाठकले 'त्रुटि जानकारी' फारम मार्फत जानकारी दिन सक्नुहुनेछ। हामी ४८ घण्टाभित्र प्रमाणीकरण गरी सच्याउने प्रतिबद्धता व्यक्त गर्दछौँ।</p>
      `
    },
    'sources': {
      title_en: 'Official Statutory Repositories & Sources',
      title_ne: 'आधिकारिक कानुनी स्रोत तथा सन्दर्भहरू',
      body_en: `
        <h2>Primary Official Sources of Nepal Law</h2>
        <ul>
          <li><strong>Nepal Law Commission (नेपाल कानुन आयोग):</strong> <a href="https://lawcommission.gov.np" target="_blank" rel="noopener noreferrer">lawcommission.gov.np</a> – Codified repository of all valid Acts, Rules, and Orders.</li>
          <li><strong>Department of Printing / Nepal Gazette (नेपाल राजपत्र):</strong> <a href="https://rajpatra.dop.gov.np" target="_blank" rel="noopener noreferrer">rajpatra.dop.gov.np</a> – Authentic official gazette notices and promulgations.</li>
          <li><strong>Supreme Court of Nepal (सर्वोच्च अदालत):</strong> <a href="https://supremecourt.gov.np" target="_blank" rel="noopener noreferrer">supremecourt.gov.np</a> – Judicial precedents and constitutional rulings.</li>
          <li><strong>Ministry of Law, Justice and Parliamentary Affairs:</strong> <a href="https://moljpa.gov.np" target="_blank" rel="noopener noreferrer">moljpa.gov.np</a> – Draft bills and legislative announcements.</li>
        </ul>
      `,
      body_ne: `
        <h2>नेपालका आधिकारिक कानुनी स्रोतहरू</h2>
        <p>हामी नेपाल कानुन आयोग, नेपाल राजपत्र, सर्वोच्च अदालत र सम्बन्धित मन्त्रालयहरूका आधिकारिक प्रकाशनहरूलाई मात्र प्रमाण मान्दछौँ।</p>
      `
    },
    'accessibility': {
      title_en: 'Accessibility Statement (WCAG 2.2 AA)',
      title_ne: 'पहुँचयोग्यता सम्बन्धी प्रतिबद्धता (Accessibility)',
      body_en: `
        <h2>Accessible to Every Citizen</h2>
        <p>We are dedicated to ensuring that digital legal awareness is accessible to people of all abilities, including persons with visual, auditory, cognitive, and motor impairments.</p>
        <ul>
          <li><strong>Contrast Compliance:</strong> 7:1+ contrast ratios for standard reading text exceeding WCAG 2.2 Level AA.</li>
          <li><strong>Full Keyboard Navigation:</strong> All menus, modals, search bars, and checklists are operable without a mouse.</li>
          <li><strong>Semantic Screen-Reader HTML:</strong> Clean ARIA landmarks, descriptive alt tags, and logical heading hierarchies.</li>
          <li><strong>Bilingual Typography:</strong> Clean Devanagari web fonts tuned for high legibility on mobile screens.</li>
        </ul>
      `,
      body_ne: `
        <h2>सबैका लागि पहुँचयोग्य</h2>
        <p>दृष्टिविहीन वा अपाङ्गता भएका नागरिकहरूले पनि सहजै स्क्रिन-रिडर वा किबोर्डको सहायताले कानुन अध्ययन गर्न सक्ने गरी अन्तर्राष्ट्रिय WCAG 2.2 AA मापदण्ड अनुसार यो वेबसाइट निर्माण गरिएको छ।</p>
      `
    },
    'content-review-process': {
      title_en: '6-Stage Legal Content Quality & Verification Protocol',
      title_ne: '६-चरणको कानुनी सामग्री प्रमाणीकरण प्रक्रिया',
      body_en: `
        <h2>Our 6-Stage Editorial Workflow</h2>
        <ol>
          <li><strong>Stage 1: Topic Discovery & Need Analysis:</strong> Identifying common legal hurdles faced by citizens through search patterns, legal aid queries, and news developments.</li>
          <li><strong>Stage 2: Primary Statutory Research:</strong> Reviewing the current gazetted text of relevant Acts, Rules, and Supreme Court rulings.</li>
          <li><strong>Stage 3: Plain-Language Drafting:</strong> Translating legal rules into the 8 core citizen questions without jargon.</li>
          <li><strong>Stage 4: Legal Accuracy Review:</strong> Rigorous examination by qualified legal researchers to ensure fidelity to statutory intent.</li>
          <li><strong>Stage 5: Final Editorial Approval & Publication:</strong> Generating JSON-LD structured data and publishing with an authentic verification stamp.</li>
          <li><strong>Stage 6: Periodic Legislative Auditing:</strong> Reviewing articles whenever parliament passes amendment acts to prevent outdated law.</li>
        </ol>
      `,
      body_ne: `
        <h2>६-चरणको सम्पादकीय कार्यविधि</h2>
        <p>विषय छनोट &rarr; प्राथमिक ऐन अनुसन्धान &rarr; सरल भाषा लेखन &rarr; कानुनी रुजु &rarr; सम्पादकीय स्वीकृति &rarr; आवधिक पुनरावलोकन।</p>
      `
    },
    'contact': {
      title_en: 'Contact Us & Feedback Channels',
      title_ne: 'सम्पर्क तथा सुझाव',
      body_en: `
        <h2>Get in Touch</h2>
        <p>For questions about the platform, suggestions for new legal guides, or general editorial inquiries, reach out to us:</p>
        <ul>
          <li><strong>Editorial Desk:</strong> <a href="mailto:editorial@nepal-legal-awareness.gov.np">editorial@nepal-legal-awareness.gov.np</a></li>
          <li><strong>Report an Inaccuracy:</strong> <a href="/report-error/">Use our Fact-Check Form</a></li>
          <li><strong>Ask a Public Question:</strong> <a href="/ask-question/">Ask a Public Question Form</a></li>
        </ul>
        <p><em>Note: We cannot provide individualized legal representation. For pending court cases, please consult a licensed advocate.</em></p>
      `,
      body_ne: `
        <h2>हामीलाई सम्पर्क गर्नुहोस्</h2>
        <p>पोर्टल सम्बन्धी सुझाव, नयाँ कानुनी विषय वा सम्पादकीय जिज्ञासाका लागि हामीलाई इमेल गर्न सक्नुहुन्छ वा अनलाइन फारम भर्न सक्नुहुन्छ।</p>
      `
    }
  };

  const page = contentMap[slug] || {
    title_en: pageMeta.title_en,
    title_ne: pageMeta.title_ne,
    body_en: `<p>Detailed public legal knowledge information regarding ${pageMeta.title_en}.</p>`,
    body_ne: `<p>${pageMeta.title_ne} सम्बन्धी विस्तृत जानकारी।</p>`
  };

  const title = lang === 'ne' ? page.title_ne : page.title_en;
  const body = lang === 'ne' ? page.body_ne : page.body_en;

  return `
  <section class="trust-page-hero">
    <div class="site-container">
      <span class="trust-kicker">Trust & Editorial Standard</span>
      <h1 class="trust-page-h1">${title}</h1>
      <p class="trust-page-sub">Public legal education initiative for the Federal Democratic Republic of Nepal.</p>
    </div>
  </section>

  <div class="site-container trust-page-layout">
    <article class="trust-article-prose">
      ${body}
      
      <div class="trust-page-nav-box">
        <h3>Other Trust & Transparency Policies:</h3>
        <ul class="trust-grid-links">
          ${topicalMap.trustPages
            .filter(p => p.slug !== slug)
            .map(p => `
              <li>
                <a href="/trust/${p.slug}/?lang=${lang}">
                  ${lang === 'ne' ? p.title_ne : p.title_en} &rarr;
                </a>
              </li>
            `).join('')}
        </ul>
      </div>
    </article>

    <aside class="trust-page-sidebar">
      <div class="sidebar-widget">
        <h3 class="widget-title">⚖️ Legal Notice</h3>
        <p class="widget-desc">${t.disclaimerText}</p>
      </div>

      <div class="sidebar-widget">
        <h3 class="widget-title">🚨 Emergency Contacts</h3>
        <ul class="sidebar-helplines">
          <li>Police: 100</li>
          <li>Women Helpline: 1145</li>
          <li>Child Helpline: 104</li>
          <li>Human Rights: 1114</li>
        </ul>
      </div>
    </aside>
  </div>
  `;
}
