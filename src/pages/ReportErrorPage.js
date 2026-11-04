import { translations } from '../data/translations.js';

export function renderReportErrorPage(targetUrl = '', lang = 'en') {
  const t = translations[lang] || translations.en;

  return `
  <section class="tools-page-header">
    <div class="site-container">
      <span class="tools-badge">Public Fact-Checking</span>
      <h1 class="tools-main-title">
        ${lang === 'ne' ? 'सामग्रीमा त्रुटि देखिए जानकारी दिनुहोस्' : 'Report a Content Inaccuracy or Outdated Law'}
      </h1>
      <p class="tools-main-subtitle">
        Help us maintain 100% legal precision. If you spot a repealed statute, incorrect penalty, or typo, submit your correction with evidence.
      </p>
    </div>
  </section>

  <div class="site-container form-page-container">
    <div class="form-card">
      <form id="report-error-form" action="/api/report-error" method="POST">
        <div class="form-group">
          <label for="article_url" class="form-label">Article URL or Title *</label>
          <input 
            type="text" 
            id="article_url" 
            name="article_url" 
            class="form-input" 
            value="${targetUrl}" 
            placeholder="e.g. /employment-labour-rights/minimum-wage-laws-nepal/" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="reporter_email" class="form-label">Your Email (Optional, for verification updates)</label>
          <input 
            type="email" 
            id="reporter_email" 
            name="reporter_email" 
            class="form-input" 
            placeholder="name@example.com" 
          />
        </div>

        <div class="form-group">
          <label for="issue_type" class="form-label">Type of Issue *</label>
          <select id="issue_type" name="issue_type" class="form-select" required>
            <option value="Outdated Law">Repealed or Amended Statute (आउटडेटेड कानुन)</option>
            <option value="Incorrect Penalty">Inaccurate Penalty / Fine / Section (गलत दफा वा सजाय)</option>
            <option value="Factual Error">Factual Error in Explanation (तथ्यगत त्रुटि)</option>
            <option value="Broken Link">Broken Government or Gazette Link (नखुल्ने लिंक)</option>
            <option value="Typo">Spelling / Translation Error (भाषा वा अनुवाद त्रुटि)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="details" class="form-label">Detailed Explanation & Citation *</label>
          <textarea 
            id="details" 
            name="details" 
            rows="5" 
            class="form-textarea" 
            placeholder="Please specify what is incorrect, what the correct law says, and provide an official Gazette or Nepal Law Commission citation..." 
            required
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block">
          Submit Correction for Legal Review
        </button>
      </form>
    </div>
  </div>
  `;
}
