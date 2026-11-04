import db from '../../db/database.js';
import { translations } from '../data/translations.js';

export function renderAuthorityDirectoryPage(lang = 'en') {
  const t = translations[lang] || translations.en;
  const authorities = db.prepare('SELECT * FROM authorities ORDER BY id ASC').all();

  return `
  <section class="tools-page-header">
    <div class="site-container">
      <span class="tools-badge">Public Institution Registry</span>
      <h1 class="tools-main-title">
        ${lang === 'ne' ? 'सरकारी निकाय तथा न्यायिक संस्था निर्देशिका' : 'Government Authority & Judicial Directory'}
      </h1>
      <p class="tools-main-subtitle">
        ${lang === 'ne'
          ? 'नेपालका प्रमुख अदालतहरू, कानुन आयोग, श्रम विभाग, मालपोत र सुरक्षा निकायहरूको आधिकारिक सम्पर्क विवरण र कानुनी भूमिका।'
          : 'Verified roles, physical addresses, emergency helplines, and official portals of public legal authorities across Nepal.'}
      </p>
    </div>
  </section>

  <div class="site-container directory-container">
    <div class="directory-filter-bar">
      <input 
        type="search" 
        id="directory-search-input" 
        class="directory-search-input" 
        placeholder="${lang === 'ne' ? 'सरकारी निकायको नाम खोज्नुहोस्...' : 'Filter authorities by name, role, or location...'}" 
      />
    </div>

    <div class="authorities-full-grid" id="authorities-list">
      ${authorities.map(auth => `
        <article class="authority-directory-card" data-name="${auth.name_en.toLowerCase()} ${auth.name_ne}">
          <div class="auth-header">
            <span class="auth-category-pill">${auth.category}</span>
            <span class="auth-jurisdiction">📍 ${auth.jurisdiction}</span>
          </div>

          <h2 class="auth-name">
            ${lang === 'ne' ? auth.name_ne : auth.name_en}
          </h2>

          <p class="auth-role-desc">
            ${lang === 'ne' ? auth.role_ne : auth.role_en}
          </p>

          <div class="auth-detail-rows">
            <div class="detail-row">
              <span class="detail-label">🏢 Address:</span>
              <span class="detail-val">${lang === 'ne' ? auth.address_ne : auth.address_en}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📞 Telephone:</span>
              <span class="detail-val">
                <a href="tel:${auth.phone}">${auth.phone}</a>
              </span>
            </div>
            ${auth.emergency_helpline ? `
              <div class="detail-row helpline-highlight">
                <span class="detail-label">🚨 Emergency Hotline:</span>
                <span class="detail-val">
                  <a href="tel:${auth.emergency_helpline}">${auth.emergency_helpline}</a>
                </span>
              </div>
            ` : ''}
          </div>

          <div class="auth-footer-bar">
            <a href="${auth.website_url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
              ${lang === 'ne' ? 'आधिकारिक वेबसाइट' : 'Visit Official Portal'} &nearr;
            </a>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
  `;
}
