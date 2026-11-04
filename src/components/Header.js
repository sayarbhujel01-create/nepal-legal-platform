import { translations } from '../data/translations.js';

export function renderHeader(currentPath = '/', lang = 'en') {
  const t = translations[lang] || translations.en;

  const navLinks = [
    { href: '/', label: t.navHome },
    { href: '/fundamental-rights/', label: t.navRights },
    { href: '/employment-labour-rights/', label: t.navLaws },
    { href: '/property-land-rights/', label: t.navEveryday },
    { href: '/tools/', label: t.navResources },
    { href: '/trust/about-us/', label: t.navAbout },
  ];

  const switchLang = lang === 'en' ? 'ne' : 'en';
  const switchLabel = lang === 'en' ? 'नेपाली' : 'English';

  return `
  <!-- Top Government Legal Awareness Ribbon -->
  <aside class="gov-top-ribbon" aria-label="Official Government Legal Awareness Resource">
    <div class="site-container gov-top-inner">
      <div class="gov-top-left">
        <span class="flag-icon" aria-hidden="true">🇳🇵</span>
        <span>${t.jurisdictionNotice}</span>
      </div>
      <div class="gov-top-right">
        <a href="tel:100" class="gov-helpline-chip" title="Police Emergency">प्रहरी: १००</a>
        <a href="tel:1145" class="gov-helpline-chip" title="Women Domestic Violence Helpline">महिला हिंसा: ११४५</a>
        <a href="tel:1137" class="gov-helpline-chip" title="Consumer Complaints Hotline">उपभोक्ता: ११३७</a>
        <button id="lang-toggle-btn" class="lang-switch-btn" data-lang="${switchLang}" aria-label="Switch to ${switchLabel}">
          🌐 <span>${switchLabel}</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Institutional Navigation Bar -->
  <header class="main-header" role="banner">
    <div class="site-container header-inner">
      <a href="/?lang=${lang}" class="site-brand" aria-label="${t.siteName} Home">
        <div class="brand-emblem">
          <svg class="emblem-svg" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="M7 21h10"/>
            <path d="M12 3v18"/>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
          </svg>
        </div>
        <div class="brand-titles">
          <span class="brand-name">${t.siteName}</span>
          <span class="brand-tagline">${t.tagline}</span>
        </div>
      </a>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav" aria-label="Primary Navigation">
        <ul class="nav-list">
          ${navLinks.map(link => {
            const isActive = currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href));
            return `
              <li>
                <a href="${link.href}?lang=${lang}" class="nav-link ${isActive ? 'active' : ''}">
                  ${link.label}
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      </nav>

      <!-- Action Buttons -->
      <div class="header-actions">
        <button id="open-search-modal" class="search-trigger-btn" aria-label="${t.searchButton}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <span class="search-trigger-text">${t.searchButton}</span>
          <kbd class="search-shortcut-kbd">Ctrl+K</kbd>
        </button>

        <a href="/admin/?lang=${lang}" class="admin-badge-btn" title="${lang === 'ne' ? 'खुला सम्पादकीय प्रणाली (लगइन नचाहिने)' : 'Open Editorial CMS (No Login Required)'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
          <span>CMS</span>
        </a>

        <!-- Mobile Menu Toggle Button -->
        <button id="mobile-menu-toggle" class="mobile-toggle-btn" aria-label="Open mobile navigation menu" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div id="mobile-drawer" class="mobile-drawer" aria-hidden="true">
      <div class="mobile-drawer-content">
        <div class="mobile-drawer-header">
          <span class="mobile-brand">${t.siteName}</span>
          <button id="close-mobile-menu" class="close-drawer-btn" aria-label="Close menu">&times;</button>
        </div>
        <ul class="mobile-nav-list">
          ${navLinks.map(link => `
            <li>
              <a href="${link.href}?lang=${lang}" class="mobile-nav-link">
                ${link.label}
              </a>
            </li>
          `).join('')}
          <li class="mobile-divider"></li>
          <li>
            <a href="/tools/?lang=${lang}" class="mobile-nav-link">
              🛠️ ${t.toolsHeader}
            </a>
          </li>
          <li>
            <a href="/trust/legal-disclaimer/?lang=${lang}" class="mobile-nav-link">
              ⚖️ ${t.disclaimerTitle}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
  `;
}
