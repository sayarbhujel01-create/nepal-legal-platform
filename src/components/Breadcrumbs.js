export function renderBreadcrumbs(crumbs, lang = 'en') {
  if (!crumbs || crumbs.length === 0) return '';

  return `
  <nav class="breadcrumb-nav" aria-label="Breadcrumbs">
    <div class="site-container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <a href="/?lang=${lang}" class="breadcrumb-link">
            ${lang === 'ne' ? 'गृहपृष्ठ' : 'Home'}
          </a>
        </li>
        ${crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return `
            <li class="breadcrumb-separator" aria-hidden="true">/</li>
            <li class="breadcrumb-item ${isLast ? 'active' : ''}">
              ${isLast 
                ? `<span class="breadcrumb-current" aria-current="page">${crumb.name}</span>`
                : `<a href="${crumb.url}?lang=${lang}" class="breadcrumb-link">${crumb.name}</a>`
              }
            </li>
          `;
        }).join('')}
      </ol>
    </div>
  </nav>
  `;
}
