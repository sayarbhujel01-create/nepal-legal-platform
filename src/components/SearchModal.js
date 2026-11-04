import { translations } from '../data/translations.js';

export function renderSearchModal(lang = 'en') {
  const t = translations[lang] || translations.en;

  const quickQuestions = lang === 'ne' ? [
    'कम्पनीले तलब नदिएमा के गर्ने?',
    'जग्गा किन्दा लालपुर्जा कसरी जाँच्ने?',
    'प्रहरीले पक्राउ गर्दा नागरिकका अधिकार के के हुन्?',
    'अदालती विवाह गर्न कुन कुन कागजात चाहिन्छ?',
    'अनलाइन ठगीमा परेमा कहाँ उजुरी दिने?'
  ] : [
    'Can my employer fire me without notice?',
    'How do I verify a land ownership certificate (Lalpurja)?',
    'What are my rights if I am arrested by police?',
    'What documents are required for court marriage in Nepal?',
    'How can I report online shopping fraud?'
  ];

  return `
  <!-- Full Screen Search Overlay Modal -->
  <div id="search-modal" class="search-modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Legal Knowledge Search">
    <div class="search-modal-panel">
      <!-- Search Input Bar -->
      <div class="search-modal-input-wrap">
        <svg class="search-modal-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
        <input 
          type="search" 
          id="search-input" 
          class="search-modal-input" 
          placeholder="${t.searchPlaceholder}" 
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="search-results-list"
        />
        <button id="close-search-modal" class="search-close-btn" aria-label="Close search">&times;</button>
      </div>

      <!-- Quick Suggested Search Chips -->
      <div class="search-quick-queries">
        <span class="quick-queries-label">${lang === 'ne' ? 'धेरै खोजिएका कानुनी प्रश्नहरू:' : 'Popular Legal Inquiries:'}</span>
        <div class="quick-chips-container">
          ${quickQuestions.map(q => `
            <button class="quick-chip" data-query="${q}">
              ${q}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Search Results Container -->
      <div id="search-results-container" class="search-results-area" tabindex="-1">
        <div class="search-placeholder-message">
          <p>${lang === 'ne' ? 'माथि आफ्नो प्रश्न वा ऐनको नाम टाइप गर्नुहोस्' : 'Type your legal query or keyword above to search through verified Nepali laws and guides.'}</p>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="search-modal-footer">
        <span class="search-tip">
          <kbd>ESC</kbd> to close &bull; <kbd>&uarr;&darr;</kbd> to navigate &bull; <kbd>ENTER</kbd> to view
        </span>
        <span class="search-statutory-notice">
          Verified with Nepal Law Commission Official Gazette
        </span>
      </div>
    </div>
  </div>
  `;
}
