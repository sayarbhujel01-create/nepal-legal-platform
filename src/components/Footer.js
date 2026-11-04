import { translations } from '../data/translations.js';
import { topicalMap } from '../data/topicalMap.js';

export function renderFooter(lang = 'en') {
  const t = translations[lang] || translations.en;

  return `
  <footer class="main-footer" role="contentinfo">
    <!-- Emergency Helplines Strip -->
    <div class="footer-helpline-strip">
      <div class="site-container helpline-grid">
        <div class="helpline-item">
          <span class="helpline-badge">प्रहरी १०0</span>
          <span class="helpline-desc">Emergency Police Dispatch</span>
        </div>
        <div class="helpline-item">
          <span class="helpline-badge">महिला ११४५</span>
          <span class="helpline-desc">Domestic Violence 24/7 Helpline</span>
        </div>
        <div class="helpline-item">
          <span class="helpline-badge">बालबालिका १०४</span>
          <span class="helpline-desc">Child Missing & Protection</span>
        </div>
        <div class="helpline-item">
          <span class="helpline-badge">मानव अधिकार १११४</span>
          <span class="helpline-desc">Human Rights Commission Toll-Free</span>
        </div>
        <div class="helpline-item">
          <span class="helpline-badge">उपभोक्ता ११३७</span>
          <span class="helpline-desc">Consumer Redress Hotline</span>
        </div>
      </div>
    </div>

    <!-- Main Footer Body -->
    <div class="site-container footer-body-grid">
      <!-- Col 1: About & Jurisdiction -->
      <div class="footer-col brand-col">
        <div class="footer-brand-title">${t.siteName}</div>
        <p class="footer-brand-sub">${t.tagline}</p>
        <p class="footer-brand-p">
          ${lang === 'ne' 
            ? 'नेपालका नागरिकहरूलाई आफ्ना मौलिक हक, श्रम कानुन, अंशबण्डा, जग्गा सम्बन्धी नियम र साइबर सुरक्षा बारे सरल र तथ्यपरक ज्ञान प्रदान गर्ने आधिकारिक खुला मञ्च।'
            : 'An independent public legal awareness platform committed to translating complex statutes of Nepal into clear, practical, and verified knowledge for everyday people.'}
        </p>
        <div class="footer-official-badge">
          <span class="badge-dot"></span>
          <span>Verified against Nepal Gazette & Nepal Law Commission Records</span>
        </div>
      </div>

      <!-- Col 2: Core 5 Pillars -->
      <div class="footer-col">
        <h4 class="footer-heading">${t.viewAllPillars}</h4>
        <ul class="footer-links">
          ${topicalMap.corePillars.map(p => `
            <li>
              <a href="/${p.slug}/?lang=${lang}">
                ${lang === 'ne' ? p.title_ne : p.title_en}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Col 3: Interactive Tools & Procedures -->
      <div class="footer-col">
        <h4 class="footer-heading">${t.toolsHeader}</h4>
        <ul class="footer-links">
          <li><a href="/tools/rights-explorer/?lang=${lang}">${t.rightsExplorerTitle}</a></li>
          <li><a href="/tools/document-checklist/?lang=${lang}">${t.docChecklistTitle}</a></li>
          <li><a href="/tools/government-directory/?lang=${lang}">${t.govDirectoryTitle}</a></li>
          <li><a href="/tools/legal-dictionary/?lang=${lang}">${t.legalDictionaryTitle}</a></li>
          <li><a href="/ask-question/?lang=${lang}">${t.askAQuestion}</a></li>
          <li><a href="/report-error/?lang=${lang}">${t.reportAnError}</a></li>
        </ul>
      </div>

      <!-- Col 4: Trust & Editorial Standards (12 Trust Pages) -->
      <div class="footer-col">
        <h4 class="footer-heading">${t.trustPages}</h4>
        <ul class="footer-links trust-links-grid">
          ${topicalMap.trustPages.map(page => `
            <li>
              <a href="/trust/${page.slug}/?lang=${lang}">
                ${lang === 'ne' ? page.title_ne : page.title_en}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- Educational Disclaimer Bar -->
    <div class="footer-disclaimer-bar">
      <div class="site-container">
        <p class="disclaimer-note">
          <strong>${t.disclaimerTitle}:</strong> ${t.disclaimerText}
        </p>
      </div>
    </div>

    <!-- Bottom Copyright & Meta Bar -->
    <div class="footer-bottom">
      <div class="site-container footer-bottom-inner">
        <p>&copy; ${new Date().getFullYear()} ${t.siteName}. ${t.allRightsReserved}</p>
        <div class="footer-meta-links">
          <a href="/sitemap.xml">XML Sitemap</a>
          <span>&bull;</span>
          <a href="/robots.txt">Robots.txt</a>
          <span>&bull;</span>
          <a href="/trust/accessibility/?lang=${lang}">WCAG 2.2 AA</a>
          <span>&bull;</span>
          <a href="/admin/?lang=${lang}">Community CMS (Open Access)</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}
