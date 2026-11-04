/**
 * Citizens' Rights & Legal Awareness Platform (Nepal)
 * Interactive Citizen Tools Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initRightsExplorer();
  initChecklistPersistence();
  initDirectoryFilter();
  initTermsFilter();
});

// ----------------------------------------------------
// 1. Interactive Legal Rights Explorer Wizard
// ----------------------------------------------------
function initRightsExplorer() {
  const wizard = document.getElementById('rights-wizard');
  if (!wizard) return;

  const step1 = wizard.querySelector('[data-step="1"]');
  const step2 = wizard.querySelector('[data-step="2"]');
  const step3 = wizard.querySelector('[data-step="3"]');
  const step2Options = document.getElementById('step2-options');
  const wizardResult = document.getElementById('wizard-result');
  const prevBtn = document.getElementById('wizard-prev-btn');
  const restartBtn = document.getElementById('wizard-restart-btn');

  let selectedCategory = null;

  const scenarios = {
    labour: [
      {
        id: 'unpaid_salary',
        label: 'My employer or company has not paid my monthly salary.',
        verdict: {
          act: 'Labour Act 2074 (Section 34 & Section 131)',
          right: 'You are legally entitled to 100% of your unpaid remuneration plus compensation and statutory interest. An employer cannot withhold wages under any circumstances.',
          action: '1. Send a 7-day formal written demand notice. 2. File a formal claim at the District Labour Office (श्रम कार्यालय).',
          link: '/employment-labour-rights/unpaid-salary-employer-labour-complaint-nepal/?lang=en',
          linkText: 'Read Full Unpaid Salary Step-by-Step Guide'
        }
      },
      {
        id: 'immediate_termination',
        label: 'I was fired without notice or reason.',
        verdict: {
          act: 'Labour Act 2074 (Sections 141-145)',
          right: 'Immediate dismissal without written show-cause notice and statutory severance compensation (one month basic salary per year of service) is unlawful.',
          action: 'File an illegal dismissal dispute with the Labour Office within statutory limitation period.',
          link: '/employment-labour-rights/employee-rights-nepal-labour-act-complete-guide/?lang=en',
          linkText: 'Check Termination Protections'
        }
      }
    ],
    property: [
      {
        id: 'buying_land_check',
        label: 'I am planning to buy land and want to verify ownership.',
        verdict: {
          act: 'Land Revenue Act 2034 & Muluki Devani Samhita',
          right: 'You have the right to inspect public land records (Sresta) at the Land Revenue Office to ensure no mortgages, court freezes, or double sales exist.',
          action: 'Cross-check plot number, verify Rokka at Malpot, and get field trace map from Napi.',
          link: '/property-land-rights/verify-land-ownership-lalpurja-nepal-guide/?lang=en',
          linkText: 'View Lalpurja Verification Guide'
        }
      },
      {
        id: 'tenant_eviction',
        label: 'My landlord is trying to force me out without notice.',
        verdict: {
          act: 'National Civil Code 2074 (Part 4 Chapter 10 Tenancy)',
          right: 'A landlord cannot unlawfully lock out a tenant without giving at least 35 days written advance notice and having statutory grounds (e.g. personal use or non-payment).',
          action: 'Lodge an immediate complaint at the local Ward Judicial Committee (वडा न्यायिक समिति).',
          link: '/property-land-rights/?lang=en',
          linkText: 'View Tenant Rights in Property Pillar'
        }
      }
    ],
    family: [
      {
        id: 'court_marriage',
        label: 'We want to register a court marriage in Nepal.',
        verdict: {
          act: 'National Civil Code 2074 (Sections 67 to 84)',
          right: 'Both individuals who have completed 20 years of age and are unmarried have the fundamental right to marry before a District Court Judge regardless of community or caste.',
          action: 'Obtain Unmarried Certificates from local Ward Offices and submit joint application to District Court.',
          link: '/family-marriage-rights/court-marriage-registration-nepal-process-documents/?lang=en',
          linkText: 'Complete Court Marriage Documents Guide'
        }
      },
      {
        id: 'property_partition',
        label: 'I want to know my legal rights to ancestral family property (Anshbanda).',
        verdict: {
          act: 'National Civil Code 2074 (Chapter 10 Partition)',
          right: 'Under the Constitution and Civil Code, daughters and sons possess strictly equal birthrights to ancestral property partition alongside spouses.',
          action: 'Request amicable family partition deed passed at Malpot, or file civil suit at District Court.',
          link: '/family-marriage-rights/divorce-laws-procedures-nepal-property-partition/?lang=en',
          linkText: 'Read Partition & Family Law Guide'
        }
      }
    ],
    criminal: [
      {
        id: 'police_arrest',
        label: 'A friend or family member was arrested by the police.',
        verdict: {
          act: 'Constitution of Nepal 2072 (Article 20) & Criminal Procedure Code 2074',
          right: 'Article 20 strictly guarantees production before a judge within 24 hours. The detainee has the constitutional right to consult a lawyer immediately and protection against torture.',
          action: '1. Demand arrest warrant (पक्राउ पुर्जी). 2. Contact defense lawyer. 3. Insist on hospital medical examination.',
          link: '/consumer-cyber-criminal-rights/rights-when-arrested-by-police-nepal/?lang=en',
          linkText: 'Read Critical 24-Hour Arrest Guide'
        }
      }
    ],
    cyber: [
      {
        id: 'online_shopping_fraud',
        label: 'I was scammed by an online seller on social media / digital wallet.',
        verdict: {
          act: 'Consumer Protection Act 2075 & Electronic Transactions Act 2063',
          right: 'Selling counterfeit or non-delivered goods online is a punishable crime. You are entitled to refund, compensation, and police investigation.',
          action: '1. Contact bank/eSewa to freeze transaction. 2. Call Consumer Hotline 1137. 3. File Cyber Bureau complaint.',
          link: '/consumer-cyber-criminal-rights/online-shopping-scams-cyber-fraud-reporting-nepal/?lang=en',
          linkText: 'Follow Online Fraud Reporting Steps'
        }
      }
    ],
    constitutional: [
      {
        id: 'rti_request',
        label: 'I want to obtain official documents or budget records from a government office.',
        verdict: {
          act: 'Right to Information Act 2064 & Constitution Article 27',
          right: 'Every citizen has the right to inspect and obtain copies of public records within 15 days from any government body.',
          action: 'Submit written application to Public Information Officer with Rs. 10 postal stamp.',
          link: '/fundamental-rights/right-to-information-nepal-how-to-file-rti/?lang=en',
          linkText: 'How to File RTI in Nepal'
        }
      }
    ]
  };

  // Step 1 Click
  wizard.querySelectorAll('.wizard-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-category');
      const categoryScenarios = scenarios[selectedCategory] || [];

      step2Options.innerHTML = categoryScenarios.map(sc => `
        <button class="wizard-option-btn" data-scenario-id="${sc.id}">
          <span class="opt-label">${sc.label}</span>
        </button>
      `).join('');

      // Bind scenario click
      step2Options.querySelectorAll('.wizard-option-btn').forEach(sBtn => {
        sBtn.addEventListener('click', () => {
          const scId = sBtn.getAttribute('data-scenario-id');
          const scenario = categoryScenarios.find(s => s.id === scId);
          showVerdict(scenario.verdict);
        });
      });

      step1.classList.remove('active');
      step2.classList.add('active');
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      step3.classList.remove('active');
      step1.classList.add('active');
    });
  }

  function showVerdict(v) {
    wizardResult.innerHTML = `
      <div style="margin-bottom:1rem;">
        <span style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#0F766E;background:#ECFDF5;padding:0.2rem 0.5rem;border-radius:4px;">
          Statutory Match Found
        </span>
      </div>
      <h3 style="font-size:1.35rem;font-weight:800;color:#0B2545;margin-bottom:0.75rem;">
        Applicable Statute: ${v.act}
      </h3>
      <div style="background:#EFF6FF;border-left:4px solid #1D4ED8;padding:1rem;margin-bottom:1rem;border-radius:0 6px 6px 0;">
        <strong style="display:block;color:#0B2545;margin-bottom:0.25rem;">Your Legal Right:</strong>
        <p style="font-size:0.95rem;color:#1E293B;">${v.right}</p>
      </div>
      <div style="margin-bottom:1.25rem;">
        <strong style="display:block;color:#0B2545;margin-bottom:0.25rem;">Immediate Next Action:</strong>
        <p style="font-size:0.95rem;color:#475569;">${v.action}</p>
      </div>
      <a href="${v.link}" class="btn btn-primary">
        ${v.linkText} &rarr;
      </a>
    `;
    step2.classList.remove('active');
    step3.classList.add('active');
  }
}

// ----------------------------------------------------
// 2. Interactive Document Checklist Persistence
// ----------------------------------------------------
function initChecklistPersistence() {
  const checkboxes = document.querySelectorAll('.tool-cb, .checklist-cb');
  if (checkboxes.length === 0) return;

  checkboxes.forEach((cb, index) => {
    const key = `legal_chk_${window.location.pathname}_${index}`;
    if (localStorage.getItem(key) === 'true') {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked);
    });
  });
}

// ----------------------------------------------------
// 3. Government Directory Real-time Filter
// ----------------------------------------------------
function initDirectoryFilter() {
  const input = document.getElementById('directory-search-input');
  const cards = document.querySelectorAll('.authority-directory-card');
  if (!input || cards.length === 0) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.getAttribute('data-name') || card.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// ----------------------------------------------------
// 4. Terms Dictionary Real-time Filter
// ----------------------------------------------------
function initTermsFilter() {
  const input = document.getElementById('terms-search-input');
  const cards = document.querySelectorAll('.term-card');
  if (!input || cards.length === 0) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    cards.forEach(card => {
      const text = card.getAttribute('data-term') || card.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}
