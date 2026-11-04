import db from '../../db/database.js';
import { translations } from '../data/translations.js';

export function renderToolsPage(subTool = 'hub', lang = 'en') {
  const t = translations[lang] || translations.en;

  const checklists = db.prepare('SELECT * FROM document_checklists').all();
  const procedures = db.prepare('SELECT * FROM procedure_guides').all();
  const authorities = db.prepare('SELECT * FROM authorities').all();
  const terms = db.prepare('SELECT * FROM legal_terms').all();

  return `
  <section class="tools-page-header">
    <div class="site-container">
      <span class="tools-badge">Citizen Legal Utilities</span>
      <h1 class="tools-main-title">
        ${t.toolsHeader}
      </h1>
      <p class="tools-main-subtitle">
        ${t.toolsDesc}
      </p>
    </div>
  </section>

  <div class="site-container tools-content-layout">
    
    <!-- Tool 1: Interactive Legal Rights Explorer -->
    <section id="rights-explorer" class="tool-section-card">
      <div class="tool-header">
        <span class="tool-icon">🧭</span>
        <div>
          <h2 class="tool-card-title">${t.rightsExplorerTitle}</h2>
          <p class="tool-card-desc">${t.rightsExplorerDesc}</p>
        </div>
      </div>

      <div class="rights-explorer-wizard" id="rights-wizard">
        <!-- Wizard Step 1 -->
        <div class="wizard-step active" data-step="1">
          <h3 class="wizard-q-title">
            ${lang === 'ne' ? '१. तपाईंसँग सम्बन्धित मुख्य कानुनी विषय कुन हो?' : '1. What area of law matches your immediate concern?'}
          </h3>
          <div class="wizard-options-grid">
            <button class="wizard-option-btn" data-category="labour">
              <span class="opt-icon">💼</span>
              <span class="opt-label">${lang === 'ne' ? 'रोजगार र तलब (काम, पारिश्रमिक, बिदा)' : 'Employment & Salary (Unpaid wages, dismissal, SSF)'}</span>
            </button>
            <button class="wizard-option-btn" data-category="property">
              <span class="opt-icon">🏠</span>
              <span class="opt-label">${lang === 'ne' ? 'जग्गा, घर र सम्पत्ति (लालपुर्जा, बहाल, साँध)' : 'Land, Housing & Property (Lalpurja, rent, boundary)'}</span>
            </button>
            <button class="wizard-option-btn" data-category="family">
              <span class="opt-icon">👨‍👩‍👧</span>
              <span class="opt-label">${lang === 'ne' ? 'विवाह, सम्बन्ध विच्छेद वा अंशबण्डा' : 'Marriage, Divorce or Ancestral Property (Anshbanda)'}</span>
            </button>
            <button class="wizard-option-btn" data-category="criminal">
              <span class="opt-icon">🚔</span>
              <span class="opt-label">${lang === 'ne' ? 'प्रहरी, पक्राउ वा फौजदारी अनुसन्धान' : 'Police, Arrest or Criminal Defense'}</span>
            </button>
            <button class="wizard-option-btn" data-category="cyber">
              <span class="opt-icon">💻</span>
              <span class="opt-label">${lang === 'ne' ? 'अनलाइन ठगी वा साइबर अपराध' : 'Online Scams, Defamation or Cybercrime'}</span>
            </button>
            <button class="wizard-option-btn" data-category="constitutional">
              <span class="opt-icon">📜</span>
              <span class="opt-label">${lang === 'ne' ? 'मौलिक हक वा सूचनाको हक (RTI)' : 'Fundamental Rights or Right to Information (RTI)'}</span>
            </button>
          </div>
        </div>

        <!-- Wizard Step 2 -->
        <div class="wizard-step" data-step="2">
          <h3 class="wizard-q-title">
            ${lang === 'ne' ? '२. तपाईंको वर्तमान अवस्था के हो?' : '2. What is your current situation?'}
          </h3>
          <div class="wizard-options-grid" id="step2-options">
            <!-- Dynamically populated via tools.js -->
          </div>
          <div class="wizard-nav-btns">
            <button class="btn btn-outline" id="wizard-prev-btn">&larr; Back</button>
          </div>
        </div>

        <!-- Wizard Step 3: Result Summary -->
        <div class="wizard-step" data-step="3">
          <div class="wizard-result-box" id="wizard-result">
            <!-- Dynamic Result will be injected here -->
          </div>
          <div class="wizard-nav-btns">
            <button class="btn btn-outline" id="wizard-restart-btn">🔄 Start Over</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Tool 2: Document Readiness Checklists -->
    <section id="document-checklists" class="tool-section-card">
      <div class="tool-header">
        <span class="tool-icon">📋</span>
        <div>
          <h2 class="tool-card-title">${t.docChecklistTitle}</h2>
          <p class="tool-card-desc">${t.docChecklistDesc}</p>
        </div>
      </div>

      <div class="checklists-container">
        ${checklists.map(chk => `
          <div class="interactive-checklist-box" data-id="${chk.id}">
            <div class="chk-header-bar">
              <h3 class="chk-title">📁 ${lang === 'ne' ? chk.title_ne : chk.title_en}</h3>
              <span class="chk-badge">${chk.category}</span>
            </div>
            <p class="chk-desc">${lang === 'ne' ? chk.description_ne : chk.description_en}</p>
            <div class="checklist-items-list">
              ${JSON.parse(chk.items_json).map(item => `
                <label class="interactive-chk-item">
                  <input type="checkbox" class="tool-cb" />
                  <span class="item-text">${lang === 'ne' ? item.label_ne : item.label_en}</span>
                  ${item.required ? `<span class="tag-required">Mandatory</span>` : ''}
                </label>
              `).join('')}
            </div>
            <div class="chk-actions-bar">
              <button class="btn btn-sm btn-outline print-chk-btn" onclick="window.print()">
                🖨️ ${lang === 'ne' ? 'यो सूची छाप्नुहोस्' : 'Print Checklist'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Tool 3: Step-by-Step Procedure Guides -->
    <section id="procedures" class="tool-section-card">
      <div class="tool-header">
        <span class="tool-icon">🪜</span>
        <div>
          <h2 class="tool-card-title">${t.stepByStepGuide}</h2>
          <p class="tool-card-desc">Visual flowchart and chronological guides for interacting with Nepali courts and ward committees.</p>
        </div>
      </div>

      <div class="procedures-container">
        ${procedures.map(proc => `
          <div class="procedure-interactive-item">
            <h3 class="proc-title">${lang === 'ne' ? proc.title_ne : proc.title_en}</h3>
            <p class="proc-summary">${lang === 'ne' ? proc.summary_ne : proc.summary_en}</p>
            <div class="proc-steps-timeline">
              ${JSON.parse(proc.steps_json).map(s => `
                <div class="timeline-step">
                  <div class="timeline-marker">${s.step}</div>
                  <div class="timeline-content">
                    <h4 class="timeline-heading">${lang === 'ne' ? s.title_ne : s.title_en}</h4>
                    <p class="timeline-desc">${s.desc_en}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>

  </div>
  `;
}
