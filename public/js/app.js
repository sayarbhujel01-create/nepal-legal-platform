/**
 * Citizens' Rights & Legal Awareness Platform (Nepal)
 * Core Client Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageToggle();
  initMobileMenu();
  initSearchModal();
  initAccordions();
  initAdminTabs();
});

// ----------------------------------------------------
// 1. Language Toggle Handler
// ----------------------------------------------------
function initLanguageToggle() {
  const btn = document.getElementById('lang-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const targetLang = btn.getAttribute('data-lang') || 'ne';
    const url = new URL(window.location.href);
    url.searchParams.set('lang', targetLang);
    window.location.href = url.toString();
  });
}

// ----------------------------------------------------
// 2. Mobile Menu Drawer
// ----------------------------------------------------
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('close-mobile-menu');
  const drawer = document.getElementById('mobile-drawer');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeMenu();
  });
}

// ----------------------------------------------------
// 3. Search Modal & Autocomplete
// ----------------------------------------------------
function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const openBtn = document.getElementById('open-search-modal');
  const closeBtn = document.getElementById('close-search-modal');
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results-container');
  const quickChips = document.querySelectorAll('.quick-chip');

  if (!modal || !searchInput) return;

  function openModal(defaultQuery = '') {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    searchInput.focus();
    if (defaultQuery) {
      searchInput.value = defaultQuery;
      performSearch(defaultQuery);
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', () => openModal());
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Keyboard shortcuts (Ctrl+K or / to open, Esc to close)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openModal();
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openModal();
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Quick chips click
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      searchInput.value = q;
      performSearch(q);
    });
  });

  // Debounced input search
  let debounceTimer = null;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();
    if (!query) {
      resultsContainer.innerHTML = '<div class="search-placeholder-message"><p>Type your query above to search verified Nepali laws and guides.</p></div>';
      return;
    }
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 200);
  });

  async function performSearch(query) {
    resultsContainer.innerHTML = '<div class="search-placeholder-message"><p>Searching verified legal database...</p></div>';
    try {
      const lang = document.body.classList.contains('lang-ne') ? 'ne' : 'en';
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&lang=${lang}`);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-placeholder-message">
            <p>No verified articles found matching <strong>"${escapeHtml(query)}"</strong>.</p>
            <p style="margin-top:0.5rem;font-size:0.85rem;">Try broader terms like "salary", "land", "arrest", or "divorce".</p>
          </div>
        `;
        return;
      }

      resultsContainer.innerHTML = data.results.map(item => `
        <a href="${item.url}" class="search-result-item">
          <span class="result-type-badge">${item.type}</span>
          <span class="result-title">${escapeHtml(item.title)}</span>
          <span class="result-snippet">${escapeHtml(item.snippet)}</span>
        </a>
      `).join('');
    } catch (err) {
      resultsContainer.innerHTML = '<div class="search-placeholder-message"><p>Error connecting to search service.</p></div>';
    }
  }
}

// ----------------------------------------------------
// 4. Accordion Toggles
// ----------------------------------------------------
function initAccordions() {
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      parent.classList.toggle('open');
    });
  });
}

// ----------------------------------------------------
// 5. Admin Dashboard Tabs
// ----------------------------------------------------
function initAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab-btn');
  const panels = document.querySelectorAll('.admin-tab-panel');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanelId = tab.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// Toast helper
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
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
