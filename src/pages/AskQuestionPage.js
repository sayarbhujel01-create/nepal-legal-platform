import { translations } from '../data/translations.js';

export function renderAskQuestionPage(topic = '', lang = 'en') {
  const t = translations[lang] || translations.en;

  return `
  <section class="tools-page-header">
    <div class="site-container">
      <span class="tools-badge">Public Legal Inquiry</span>
      <h1 class="tools-main-title">
        ${lang === 'ne' ? 'सार्वजनिक कानुनी जिज्ञासा राख्नुहोस्' : 'Submit a Legal Awareness Topic or Question'}
      </h1>
      <p class="tools-main-subtitle">
        Have a question about how Nepali laws work? Ask our legal editorial team to create a plain-language guide on your topic.
      </p>
    </div>
  </section>

  <div class="site-container form-page-container">
    <!-- Non-Representation Warning Notice -->
    <div class="legal-notice-callout">
      <strong>⚠️ Important Notice Regarding Legal Questions:</strong>
      <p>This platform provides public legal education and cannot offer individualized legal representation, lawyer-client confidentiality, or trial strategy. Do not submit sensitive personal identifiers or pending confidential court documents. Questions help us determine which new educational guides to publish for the public.</p>
    </div>

    <div class="form-card">
      <form id="ask-question-form" action="/api/ask-question" method="POST">
        <div class="form-group">
          <label for="name" class="form-label">Your Name (or Pseudonym)</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            class="form-input" 
            placeholder="e.g. Concerned Citizen" 
          />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Your Email (Optional, to receive guide notification)</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            class="form-input" 
            placeholder="citizen@example.com" 
          />
        </div>

        <div class="form-group">
          <label for="topic" class="form-label">Topic Area *</label>
          <select id="topic" name="topic" class="form-select" required>
            <option value="Fundamental Rights" ${topic.includes('Rights') ? 'selected' : ''}>Fundamental Rights & Constitutional Law</option>
            <option value="Labour Rights" ${topic.includes('Salary') || topic.includes('Labour') ? 'selected' : ''}>Employment, Wages & Labour Law</option>
            <option value="Family Law" ${topic.includes('Marriage') || topic.includes('Divorce') ? 'selected' : ''}>Marriage, Divorce & Family Property</option>
            <option value="Property Law" ${topic.includes('Land') || topic.includes('Lalpurja') ? 'selected' : ''}>Land, Housing & Lalpurja Verification</option>
            <option value="Consumer & Cyber" ${topic.includes('Cyber') || topic.includes('Shopping') ? 'selected' : ''}>Consumer Fraud & Cyber Safety</option>
            <option value="Other">Other Citizen Legal Procedure</option>
          </select>
        </div>

        <div class="form-group">
          <label for="question_text" class="form-label">Your Legal Question *</label>
          <textarea 
            id="question_text" 
            name="question_text" 
            rows="5" 
            class="form-textarea" 
            placeholder="Describe the situation in plain language (e.g. 'Can an employer deduct salary if I leave during probation?' or 'What happens if a neighbor claims part of my registered land?')..." 
            required
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          Submit Question for Educational Guide Planning
        </button>
      </form>
    </div>
  </div>
  `;
}
