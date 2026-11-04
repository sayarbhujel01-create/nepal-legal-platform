import db from '../../db/database.js';
import { translations } from '../data/translations.js';
import { renderMarkdown } from '../utils/markdown.js';

export function renderArticlePage(pillarSlug, articleSlug, lang = 'en') {
  const t = translations[lang] || translations.en;

  const pillar = db.prepare('SELECT * FROM pillars WHERE slug = ?').get(pillarSlug);
  if (!pillar) return null;

  const article = db.prepare('SELECT * FROM articles WHERE slug = ? AND pillar_id = ?').get(articleSlug, pillar.id);
  if (!article) return null;

  // Increment view counter
  db.prepare('UPDATE articles SET view_count = view_count + 1 WHERE id = ?').run(article.id);

  // Retrieve related articles in this same pillar
  const relatedArticles = db.prepare(`
    SELECT slug, title_en, title_ne, summary_en, summary_ne, applicable_legislation
    FROM articles
    WHERE pillar_id = ? AND id != ? AND review_status = 'Published'
    LIMIT 3
  `).all(pillar.id, article.id);

  const title = lang === 'ne' ? article.title_ne : article.title_en;
  const summary = lang === 'ne' ? article.summary_ne : article.summary_en;
  const content = lang === 'ne' ? article.content_ne : article.content_en;
  const faqs = article.faqs_json ? JSON.parse(article.faqs_json) : [];
  const steps = article.steps_json ? JSON.parse(article.steps_json) : [];
  const checklist = article.checklist_json ? JSON.parse(article.checklist_json) : [];

  return `
  <!-- Article Header / Hero -->
  <article class="article-detail-container" itemscope itemtype="https://schema.org/Article">
    <header class="article-hero">
      <div class="site-container">
        
        <!-- Parent Pillar Breadcrumb Indicator -->
        <div class="article-pillar-ref">
          <a href="/${pillar.slug}/?lang=${lang}" class="pillar-ref-link">
            &larr; ${lang === 'ne' ? pillar.title_ne : pillar.title_en}
          </a>
          <span class="article-jurisdiction-chip">🇳🇵 ${article.jurisdiction}</span>
        </div>

        <h1 class="article-h1" itemprop="headline">
          ${title}
        </h1>

        <!-- Short Answer / Centerpiece Summary Box -->
        <div class="article-summary-box">
          <div class="summary-badge">⚡ Quick Legal Summary</div>
          <p class="summary-text" itemprop="description">
            ${summary}
          </p>
        </div>

        <!-- Verification Metadata & Reviewer Credentials -->
        <div class="article-meta-card">
          <div class="meta-row">
            <div class="meta-item">
              <span class="meta-label">⚖️ ${lang === 'ne' ? 'प्रचलित कानुन' : 'Governing Statute'}:</span>
              <strong class="meta-value">${article.applicable_legislation}</strong>
            </div>
            <div class="meta-item">
              <span class="meta-label">📜 ${lang === 'ne' ? 'सम्बन्धित दफा' : 'Statutory Sections'}:</span>
              <span class="meta-value">${article.relevant_sections}</span>
            </div>
          </div>

          <div class="meta-row meta-verification">
            <div class="meta-item">
              <span class="meta-label">🗓️ ${t.lastVerified}:</span>
              <time class="meta-value" datetime="${article.last_verified_date}" itemprop="dateModified">${article.last_verified_date}</time>
            </div>
            <div class="meta-item">
              <span class="meta-label">👤 ${t.reviewedBy}:</span>
              <span class="meta-value reviewer-name" itemprop="author">${article.reviewed_by}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">🔒 Status:</span>
              <span class="status-badge status-${article.review_status.toLowerCase().replace(/\s+/g, '-')}">
                ✓ ${article.review_status}
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>

    <!-- Main Article Body -->
    <div class="site-container article-layout">
      <main class="article-content-column">

        <!-- Table of Contents for Longform Article -->
        <div class="article-toc">
          <h2 class="article-toc-title">📑 ${t.tableOfContents}</h2>
          <ol class="article-toc-list">
            <li><a href="#what-is-the-law">1. ${lang === 'ne' ? 'कानुन के हो?' : 'What is the law?'}</a></li>
            <li><a href="#simple-meaning">2. ${lang === 'ne' ? 'सरल भाषामा यसको अर्थ' : 'What does it mean in simple language?'}</a></li>
            <li><a href="#who-it-protects">3. ${lang === 'ne' ? 'यसले कसलाई संरक्षण गर्छ?' : 'Who does it protect or apply to?'}</a></li>
            <li><a href="#your-rights">4. ${lang === 'ne' ? 'तपाईंको अधिकार के के हुन्?' : 'What are your rights?'}</a></li>
            <li><a href="#your-responsibilities">5. ${lang === 'ne' ? 'तपाईंको दायित्व तथा कर्तव्य' : 'What are your responsibilities?'}</a></li>
            <li><a href="#what-to-do">6. ${lang === 'ne' ? 'हक हनन भएमा के गर्ने?' : 'What should you do if something goes wrong?'}</a></li>
            <li><a href="#who-can-help">7. ${lang === 'ne' ? 'सहयोग गर्ने सरकारी निकायहरू' : 'Which government authority can help?'}</a></li>
            <li><a href="#official-documents">8. ${lang === 'ne' ? 'आधिकारिक कानुनी दस्तावेज' : 'Where to find official legal documents'}</a></li>
            ${steps.length > 0 ? `<li><a href="#procedure-steps">9. ${t.stepByStepGuide}</a></li>` : ''}
            ${checklist.length > 0 ? `<li><a href="#document-checklist">10. ${t.requiredDocuments}</a></li>` : ''}
            ${faqs.length > 0 ? `<li><a href="#faqs">11. ${t.frequentlyAskedQuestions}</a></li>` : ''}
          </ol>
        </div>

        <!-- Rendered Legal Article Content (The 8 Answers) -->
        <div class="article-prose" itemprop="articleBody">
          ${renderMarkdown(content)}
        </div>

        <!-- Step-by-Step Practical Instructions (If present) -->
        ${steps.length > 0 ? `
          <section id="procedure-steps" class="article-sub-section">
            <h2 class="sub-section-title">🪜 ${t.stepByStepGuide}</h2>
            <div class="article-steps-flow">
              ${steps.map(s => `
                <div class="article-step-card">
                  <div class="step-badge">Step ${s.step}</div>
                  <div class="step-text-wrap">
                    <h3 class="step-title">${lang === 'ne' ? s.title_ne : s.title_en}</h3>
                    <p class="step-desc">${s.desc_en}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Interactive Checklist (If present) -->
        ${checklist.length > 0 ? `
          <section id="document-checklist" class="article-sub-section">
            <h2 class="sub-section-title">📋 ${t.requiredDocuments}</h2>
            <div class="checklist-interactive-card">
              <p class="checklist-tip">${lang === 'ne' ? 'कागजात तयार भएपछि चेकबक्समा चिन्ह लगाउनुहोस्:' : 'Check off each item as you prepare your paperwork:'}</p>
              <div class="checklist-items">
                ${checklist.map((item, idx) => `
                  <label class="checklist-label">
                    <input type="checkbox" class="checklist-cb" />
                    <span class="checklist-text">${item}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </section>
        ` : ''}

        <!-- Frequently Asked Questions (FAQ) Accordion -->
        ${faqs.length > 0 ? `
          <section id="faqs" class="article-sub-section">
            <h2 class="sub-section-title">❓ ${t.frequentlyAskedQuestions}</h2>
            <div class="faq-accordion-group">
              ${faqs.map(faq => `
                <div class="faq-item">
                  <button class="faq-question-btn" aria-expanded="false">
                    <span>${lang === 'ne' ? faq.q_ne : faq.q_en}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer-panel">
                    <p>${lang === 'ne' ? faq.a_ne : faq.a_en}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Official Sources Citation Box (Requirement 8) -->
        <section id="official-documents" class="article-sources-box">
          <h3 class="sources-title">🏛️ ${t.officialSource}</h3>
          <p class="sources-note">
            This guide is verified directly from authentic publications of the Government of Nepal:
          </p>
          <ul class="sources-list">
            <li>
              <a href="${article.official_source_url}" target="_blank" rel="noopener noreferrer" class="source-link">
                Official Statute: ${article.applicable_legislation} &nearr;
              </a>
            </li>
            <li>
              <a href="https://lawcommission.gov.np" target="_blank" rel="noopener noreferrer" class="source-link">
                Nepal Law Commission Official Acts Portal &nearr;
              </a>
            </li>
          </ul>
        </section>

        <!-- Educational Disclaimer Banner -->
        <div class="article-disclaimer-box">
          <span class="disclaimer-title">⚖️ ${t.disclaimerTitle}</span>
          <p class="disclaimer-text">${t.disclaimerText}</p>
        </div>

        <!-- Feedback & Report Error Action -->
        <div class="article-actions-bar">
          <a href="/report-error/?url=/${pillar.slug}/${article.slug}/&lang=${lang}" class="btn btn-outline btn-sm">
            🚩 ${t.reportAnError}
          </a>
          <a href="/ask-question/?topic=${encodeURIComponent(article.title_en)}&lang=${lang}" class="btn btn-outline btn-sm">
            💬 ${t.askAQuestion}
          </a>
        </div>

      </main>

      <!-- Sidebar -->
      <aside class="article-sidebar">
        <!-- Related Articles in Cluster -->
        <div class="sidebar-widget">
          <h3 class="widget-title">📚 ${t.relatedArticles}</h3>
          <ul class="related-articles-list">
            ${relatedArticles.map(rel => `
              <li>
                <a href="/${pillar.slug}/${rel.slug}/?lang=${lang}" class="related-link">
                  <span class="related-title">${lang === 'ne' ? rel.title_ne : rel.title_en}</span>
                  <span class="related-statute">${rel.applicable_legislation}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Pillar Navigation -->
        <div class="sidebar-widget">
          <h3 class="widget-title">🏛️ ${lang === 'ne' ? 'माउ स्तम्भ' : 'Parent Pillar'}</h3>
          <p class="widget-desc">${lang === 'ne' ? pillar.intro_ne : pillar.intro_en}</p>
          <a href="/${pillar.slug}/?lang=${lang}" class="btn btn-primary btn-sm">
            ${lang === 'ne' ? 'पूर्ण स्तम्भ हेर्नुहोस्' : 'View Parent Pillar'} &rarr;
          </a>
        </div>

        <!-- Emergency Helplines -->
        <div class="sidebar-widget helpline-widget">
          <h3 class="widget-title">🚨 ${t.emergencyHelplines}</h3>
          <ul class="sidebar-helplines">
            <li><strong>Nepal Police:</strong> 100</li>
            <li><strong>Women Commission:</strong> 1145</li>
            <li><strong>Child Protection:</strong> 104</li>
            <li><strong>Human Rights:</strong> 1114</li>
            <li><strong>Consumer Hotline:</strong> 1137</li>
          </ul>
        </div>
      </aside>
    </div>
  </article>
  `;
}
