import db from '../../db/database.js';
import { translations } from '../data/translations.js';

export function renderTermsDictionaryPage(lang = 'en') {
  const t = translations[lang] || translations.en;
  const terms = db.prepare('SELECT * FROM legal_terms ORDER BY term_en ASC').all();

  return `
  <section class="tools-page-header">
    <div class="site-container">
      <span class="tools-badge">Plain Language Glossary</span>
      <h1 class="tools-main-title">
        ${lang === 'ne' ? 'नेपाली-अंग्रेजी कानुनी शब्दकोश' : 'Legal Terms Dictionary (Nepali ↔ English)'}
      </h1>
      <p class="tools-main-subtitle">
        ${lang === 'ne'
          ? 'नेपालका अदालत, मालपोत र प्रशासनमा प्रयोग हुने जटिल कानुनी शब्दहरूको आम नागरिकले बुझ्ने सरल व्याख्या।'
          : 'Demystifying dense legal terminology, court jargon, and property registry vocabulary used across Nepal.'}
      </p>
    </div>
  </section>

  <div class="site-container dictionary-container">
    <div class="dictionary-search-bar">
      <input 
        type="search" 
        id="terms-search-input" 
        class="directory-search-input" 
        placeholder="${lang === 'ne' ? 'कानुनी शब्द खोज्नुहोस् (जस्तै: लालपुर्जा, फिरादपत्र, बन्दीप्रत्यक्षीकरण)...' : 'Search legal terms (e.g., Lalpurja, Firadpatra, Habeas Corpus)...'}" 
      />
    </div>

    <div class="terms-dictionary-grid" id="terms-list">
      ${terms.map(term => `
        <article class="term-card" data-term="${term.term_en.toLowerCase()} ${term.term_ne}">
          <div class="term-card-top">
            <span class="term-category-badge">${term.category}</span>
            <span class="term-statute-badge">⚖️ ${term.legal_source}</span>
          </div>

          <h2 class="term-title-en">${term.term_en}</h2>
          <div class="term-title-ne">${term.term_ne}</div>

          <div class="term-section">
            <h3 class="term-sub-heading">${lang === 'ne' ? 'कानुनी परिभाषा (Formal Definition):' : 'Statutory Definition:'}</h3>
            <p class="term-formal-def">${lang === 'ne' ? term.definition_ne : term.definition_en}</p>
          </div>

          <div class="term-section plain-explanation-box">
            <h3 class="term-sub-heading">💡 ${lang === 'ne' ? 'सर्वसाधारणका लागि सरल अर्थ:' : 'Plain Language Meaning:'}</h3>
            <p class="term-simple-def">${lang === 'ne' ? term.simple_explanation_ne : term.simple_explanation_en}</p>
          </div>
        </article>
      `).join('')}
    </div>
  </div>
  `;
}
