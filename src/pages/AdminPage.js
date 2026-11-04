import db from '../../db/database.js';

export function renderAdminPage({ isAuthenticated = true, user = 'Community Editor (Open Access)', error = null } = {}) {
  // Open access to all users without any login required

  // Retrieve statistics
  const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;
  const publishedArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE review_status = 'Published'").get().count;
  const inReviewArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE review_status IN ('Awaiting Verification', 'Awaiting Legal Review')").get().count;
  const needsUpdatingArticles = db.prepare("SELECT COUNT(*) as count FROM articles WHERE review_status = 'Needs Updating'").get().count;
  const totalReports = db.prepare("SELECT COUNT(*) as count FROM error_reports WHERE status = 'Open'").get().count;
  const totalQuestions = db.prepare("SELECT COUNT(*) as count FROM questions WHERE status = 'Pending'").get().count;

  // Retrieve articles list
  const articles = db.prepare(`
    SELECT a.id, a.slug, a.title_en, a.last_verified_date, a.review_status, a.applicable_legislation, p.slug as pillar_slug, p.short_title_en
    FROM articles a
    JOIN pillars p ON a.pillar_id = p.id
    ORDER BY a.id DESC
  `).all();

  // Retrieve error reports
  const errorReports = db.prepare('SELECT * FROM error_reports ORDER BY id DESC LIMIT 10').all();

  // Retrieve questions
  const questions = db.prepare('SELECT * FROM questions ORDER BY id DESC LIMIT 10').all();

  // Retrieve audit logs
  const auditLogs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 8').all();

  // Retrieve pillars for dropdown
  const pillars = db.prepare('SELECT id, title_en FROM pillars ORDER BY order_index ASC').all();

  return `
  <div class="admin-dashboard-wrapper">
    <!-- Top Admin Bar -->
    <header class="admin-top-bar">
      <div class="admin-brand-bar">
        <span class="admin-emblem">⚖️</span>
        <span class="admin-title">Citizens' Rights Platform &bull; Open Editorial CMS</span>
        <span style="background:#059669;color:#fff;font-size:0.75rem;padding:0.15rem 0.5rem;border-radius:9999px;font-weight:600;margin-left:0.5rem;">Public Open Access</span>
      </div>
      <div class="admin-user-menu">
        <span class="admin-logged-as">Access: <strong>Open to Everyone (No Login Required)</strong></span>
        <a href="/?lang=en" class="btn btn-sm btn-outline-white" target="_blank">View Live Site &nearr;</a>
      </div>
    </header>

    <div class="admin-main-container">
      <!-- Stats Dashboard Row -->
      <section class="admin-stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Articles</span>
          <span class="stat-num">${totalArticles}</span>
          <span class="stat-sub">Across 5 Core Pillars</span>
        </div>
        <div class="stat-card stat-success">
          <span class="stat-label">Published & Verified</span>
          <span class="stat-num">${publishedArticles}</span>
          <span class="stat-sub">Live on Public Platform</span>
        </div>
        <div class="stat-card stat-warning">
          <span class="stat-label">Pending Legal Review</span>
          <span class="stat-num">${inReviewArticles}</span>
          <span class="stat-sub">Awaiting Bar Verification</span>
        </div>
        <div class="stat-card stat-danger">
          <span class="stat-label">Needs Re-Verification</span>
          <span class="stat-num">${needsUpdatingArticles}</span>
          <span class="stat-sub">Triggered by Legislative Audit</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Open Error Reports</span>
          <span class="stat-num">${totalReports}</span>
          <span class="stat-sub">Public Corrections</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Citizen Questions</span>
          <span class="stat-num">${totalQuestions}</span>
          <span class="stat-sub">New Topic Inquiries</span>
        </div>
      </section>

      <!-- CMS Tabs -->
      <div class="admin-tabs-nav">
        <button class="admin-tab-btn active" data-tab="tab-articles">📚 Articles Management</button>
        <button class="admin-tab-btn" data-tab="tab-new-article">➕ Create New Article</button>
        <button class="admin-tab-btn" data-tab="tab-reports">🚩 Reported Errors (${totalReports})</button>
        <button class="admin-tab-btn" data-tab="tab-questions">💬 Citizen Questions (${totalQuestions})</button>
        <button class="admin-tab-btn" data-tab="tab-audit">📜 System Audit Log</button>
      </div>

      <!-- Tab 1: Articles Management -->
      <section id="tab-articles" class="admin-tab-panel active">
        <div class="panel-header-row">
          <h2>All Statutory Articles</h2>
          <button class="btn btn-primary btn-sm" onclick="document.querySelector('[data-tab=tab-new-article]').click()">
            + Draft New Article
          </button>
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title (English & Nepali)</th>
                <th>Pillar</th>
                <th>Governing Legislation</th>
                <th>Verification Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(a => `
                <tr>
                  <td>#${a.id}</td>
                  <td>
                    <strong>${a.title_en}</strong>
                    <div class="cell-sub">${a.slug}</div>
                  </td>
                  <td><span class="badge-pill">${a.short_title_en}</span></td>
                  <td>${a.applicable_legislation}</td>
                  <td>${a.last_verified_date}</td>
                  <td>
                    <span class="status-badge status-${a.review_status.toLowerCase().replace(/\s+/g, '-')}">
                      ${a.review_status}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group">
                      <a href="/${a.pillar_slug}/${a.slug}/?lang=en" target="_blank" class="btn btn-xs btn-outline">View</a>
                      <button class="btn btn-xs btn-outline update-status-btn" data-id="${a.id}" data-current="${a.review_status}">Status</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Tab 2: Create New Article -->
      <section id="tab-new-article" class="admin-tab-panel">
        <div class="panel-header-row">
          <h2>Draft New Statutory Article</h2>
          <p>Must comply with the 8 mandatory legal awareness questions.</p>
        </div>

        <form action="/api/admin/articles" method="POST" class="admin-form-grid">
          <div class="form-row">
            <div class="form-group col-6">
              <label class="form-label">Article Title (English) *</label>
              <input type="text" name="title_en" class="form-input" placeholder="e.g. Employee Leave Entitlements in Nepal Explained" required />
            </div>
            <div class="form-group col-6">
              <label class="form-label">Article Title (Nepali) *</label>
              <input type="text" name="title_ne" class="form-input" placeholder="e.g. नेपालमा श्रमिकका विदा सम्बन्धी कानुनी व्यवस्था" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <label class="form-label">URL Slug *</label>
              <input type="text" name="slug" class="form-input" placeholder="e.g. employee-leave-entitlements-nepal" required />
            </div>
            <div class="form-group col-6">
              <label class="form-label">Parent Core Pillar *</label>
              <select name="pillar_id" class="form-select" required>
                ${pillars.map(p => `
                  <option value="${p.id}">${p.title_en}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <label class="form-label">Summary / Short Answer (English) *</label>
              <textarea name="summary_en" class="form-textarea" rows="3" required></textarea>
            </div>
            <div class="form-group col-6">
              <label class="form-label">Summary / Short Answer (Nepali) *</label>
              <textarea name="summary_ne" class="form-textarea" rows="3" required></textarea>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-4">
              <label class="form-label">Applicable Legislation *</label>
              <input type="text" name="applicable_legislation" class="form-input" placeholder="e.g. Labour Act 2074 (श्रम ऐन, २०७४)" required />
            </div>
            <div class="form-group col-4">
              <label class="form-label">Relevant Sections *</label>
              <input type="text" name="relevant_sections" class="form-input" placeholder="e.g. Sections 40 to 45" required />
            </div>
            <div class="form-group col-4">
              <label class="form-label">Official Source URL (Nepal Gazette / Law Commission) *</label>
              <input type="url" name="official_source_url" class="form-input" placeholder="https://lawcommission.gov.np/..." required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-4">
              <label class="form-label">Reviewed By (Legal Reviewer) *</label>
              <input type="text" name="reviewed_by" class="form-input" value="Senior Legal Research Directorate" required />
            </div>
            <div class="form-group col-4">
              <label class="form-label">Review Status *</label>
              <select name="review_status" class="form-select" required>
                <option value="Draft">Draft</option>
                <option value="Awaiting Verification">Awaiting Verification</option>
                <option value="Awaiting Legal Review">Awaiting Legal Review</option>
                <option value="Approved">Approved</option>
                <option value="Published" selected>Published</option>
                <option value="Needs Updating">Needs Updating</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div class="form-group col-4">
              <label class="form-label">Last Verified Date *</label>
              <input type="date" name="last_verified_date" class="form-input" value="${new Date().toISOString().split('T')[0]}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <label class="form-label">Full Content (English - Markdown) *</label>
              <textarea name="content_en" class="form-textarea code-editor" rows="12" placeholder="### 1. What is the law?&#10;...&#10;### 2. What does it mean in simple language?&#10;...&#10;### 3. Who does it protect?&#10;...&#10;### 4. What are your rights?&#10;..." required></textarea>
            </div>
            <div class="form-group col-6">
              <label class="form-label">Full Content (Nepali - Markdown) *</label>
              <textarea name="content_ne" class="form-textarea code-editor" rows="12" placeholder="### १. कानुन के हो?&#10;...&#10;### २. सरल भाषामा यसको अर्थ के हो?&#10;...&#10;### ३. यसले कसलाई सुरक्षा दिन्छ?&#10;..." required></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary">
            Save & Publish Article
          </button>
        </form>
      </section>

      <!-- Tab 3: Reported Errors -->
      <section id="tab-reports" class="admin-tab-panel">
        <div class="panel-header-row">
          <h2>Crowdsourced Fact-Check Reports</h2>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Article Target</th>
                <th>Issue Type</th>
                <th>Details</th>
                <th>Reporter Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${errorReports.length === 0 ? '<tr><td colspan="6" class="text-center">No reported inaccuracies.</td></tr>' : ''}
              ${errorReports.map(r => `
                <tr>
                  <td>#${r.id}</td>
                  <td><code>${r.article_url}</code></td>
                  <td><span class="badge-pill">${r.issue_type}</span></td>
                  <td>${r.details}</td>
                  <td>${r.reporter_email || 'Anonymous'}</td>
                  <td><span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Tab 4: Citizen Inquiries -->
      <section id="tab-questions" class="admin-tab-panel">
        <div class="panel-header-row">
          <h2>Citizen Legal Questions</h2>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Citizen</th>
                <th>Topic</th>
                <th>Question</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${questions.length === 0 ? '<tr><td colspan="6" class="text-center">No citizen questions submitted yet.</td></tr>' : ''}
              ${questions.map(q => `
                <tr>
                  <td>#${q.id}</td>
                  <td><strong>${q.name || 'Anonymous'}</strong><div class="cell-sub">${q.email || ''}</div></td>
                  <td><span class="badge-pill">${q.topic}</span></td>
                  <td>${q.question_text}</td>
                  <td>${q.created_at}</td>
                  <td><span class="status-badge status-approved">${q.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Tab 5: Audit Log -->
      <section id="tab-audit" class="admin-tab-panel">
        <div class="panel-header-row">
          <h2>Editorial Audit Trail</h2>
        </div>
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Target ID</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${auditLogs.map(l => `
                <tr>
                  <td><code>${l.action}</code></td>
                  <td>${l.entity_type}</td>
                  <td>${l.entity_id}</td>
                  <td>${l.details}</td>
                  <td>${l.created_at}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
  `;
}

function renderLoginForm(error = null) {
  return `
  <div class="login-page-wrapper">
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-emblem-lg">⚖️</span>
        <h1 class="login-title">Editorial Management Portal</h1>
        <p class="login-sub">Citizens' Rights & Legal Awareness Platform (Nepal)</p>
      </div>

      ${error ? `<div class="login-error-alert">${error}</div>` : ''}

      <form action="/api/admin/login" method="POST" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Editor Username</label>
          <input type="text" id="username" name="username" class="form-input" value="admin" required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" name="password" class="form-input" placeholder="••••••••" value="nepal-legal-2026" required />
        </div>
        <button type="submit" class="btn btn-primary btn-block">
          Authenticate & Access CMS
        </button>
      </form>

      <div class="login-footer-note">
        <p>🔒 Restricted access for authorized legal editors and researchers. Public users, please visit the <a href="/">homepage</a>.</p>
      </div>
    </div>
  </div>
  `;
}
