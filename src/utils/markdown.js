export function renderMarkdown(md) {
  if (!md) return '';
  
  const lines = md.trim().split('\n');
  const htmlParts = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      const text = line.substring(4);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      htmlParts.push(`<h3 id="${id}" class="article-h3">${formatInline(text)}</h3>`);
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      const text = line.substring(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      htmlParts.push(`<h2 id="${id}" class="article-h2">${formatInline(text)}</h2>`);
      continue;
    }

    // Unordered List Items
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        htmlParts.push('<ul class="article-ul">');
        inList = true;
      }
      htmlParts.push(`<li>${formatInline(line.substring(2))}</li>`);
      continue;
    }

    // Ordered List Items
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (inList) { htmlParts.push('</ul>'); inList = false; }
      htmlParts.push(`<div class="numbered-step-item"><span class="step-num">${orderedMatch[1]}</span><div class="step-body">${formatInline(orderedMatch[2])}</div></div>`);
      continue;
    }

    // Normal paragraph
    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }
    htmlParts.push(`<p class="article-p">${formatInline(line)}</p>`);
  }

  if (inList) {
    htmlParts.push('</ul>');
  }

  return htmlParts.join('\n');
}

function formatInline(text) {
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="article-link" target="_blank" rel="noopener noreferrer">$1</a>')
    // Code
    .replace(/`(.*?)`/g, '<code class="article-code">$1</code>');
}
