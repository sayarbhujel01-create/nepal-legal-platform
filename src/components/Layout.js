import { renderHeader } from './Header.js';
import { renderFooter } from './Footer.js';
import { renderSearchModal } from './SearchModal.js';
import { generateWebSiteSchema, generateOrganizationSchema } from '../utils/seo.js';

export function renderLayout({
  title,
  metaTags = '',
  structuredData = '',
  breadcrumbs = '',
  content = '',
  currentPath = '/',
  lang = 'en'
}) {
  return `<!DOCTYPE html>
<html lang="${lang}" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  ${metaTags}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="stylesheet" href="/css/styles.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Mukta:wght@400;500;600;700&display=swap" rel="stylesheet">
  ${generateWebSiteSchema()}
  ${generateOrganizationSchema()}
  ${structuredData}
</head>
<body class="site-body ${lang === 'ne' ? 'lang-ne' : 'lang-en'}">
  <!-- Skip link for keyboard accessibility -->
  <a href="#main-content" class="skip-to-content">
    ${lang === 'ne' ? 'मुख्य सामग्रीमा जानुहोस्' : 'Skip to main content'}
  </a>

  <!-- Header -->
  ${renderHeader(currentPath, lang)}

  <!-- Optional Breadcrumbs -->
  ${breadcrumbs}

  <!-- Main Landmark -->
  <main id="main-content" class="main-content-landmark" role="main">
    ${content}
  </main>

  <!-- Footer -->
  ${renderFooter(lang)}

  <!-- Search Modal -->
  ${renderSearchModal(lang)}

  <!-- Toast Notification Container -->
  <div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true"></div>

  <!-- Client-side Interactive Scripts -->
  <script src="/js/app.js" defer></script>
  <script src="/js/tools.js" defer></script>
</body>
</html>`;
}
