import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

import db from './db/database.js';
import { renderLayout } from './src/components/Layout.js';
import { renderBreadcrumbs } from './src/components/Breadcrumbs.js';
import { renderHomePage } from './src/pages/HomePage.js';
import { renderPillarPage } from './src/pages/PillarPage.js';
import { renderArticlePage } from './src/pages/ArticlePage.js';
import { renderToolsPage } from './src/pages/ToolsPage.js';
import { renderAuthorityDirectoryPage } from './src/pages/AuthorityDirectoryPage.js';
import { renderTermsDictionaryPage } from './src/pages/TermsDictionaryPage.js';
import { renderTrustPage } from './src/pages/TrustPage.js';
import { renderReportErrorPage } from './src/pages/ReportErrorPage.js';
import { renderAskQuestionPage } from './src/pages/AskQuestionPage.js';
import { renderAdminPage } from './src/pages/AdminPage.js';
import { topicalMap } from './src/data/topicalMap.js';
import { 
  generateMetaTags, 
  generateArticleSchema, 
  generateFAQSchema, 
  generateBreadcrumbSchema 
} from './src/utils/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');

const PORT = process.env.PORT || 3000;

// In-memory or database-backed admin sessions
const activeSessions = new Map();

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }
  return list;
}

function getLang(req, urlObj) {
  const urlLang = urlObj.searchParams.get('lang');
  if (urlLang === 'ne' || urlLang === 'en') return urlLang;
  const cookies = parseCookies(req);
  if (cookies.lang === 'ne' || cookies.lang === 'en') return cookies.lang;
  return 'en';
}

function getAdminUser(req) {
  const cookies = parseCookies(req);
  const token = cookies.admin_session;
  if (!token) return null;
  return activeSessions.get(token) || null;
}

export async function handleRequest(req, res) {
  try {
    let rawUrl = req.url || '/';
    if ((rawUrl === '/api/index.js' || rawUrl === '/api' || rawUrl.startsWith('/api/index.js?') || rawUrl.startsWith('/api?')) && req.headers['x-forwarded-uri']) {
      rawUrl = req.headers['x-forwarded-uri'];
    }
    const host = req.headers.host || 'localhost';
    const urlObj = new URL(rawUrl, `http://${host}`);
    const pathname = urlObj.pathname;
    const lang = getLang(req, urlObj);

    // ----------------------------------------------------
    // Static Assets (/css, /js, /favicon.svg)
    // ----------------------------------------------------
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname === '/favicon.svg') {
      const filePath = path.join(PUBLIC_DIR, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
          '.ico': 'image/x-icon'
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    // ----------------------------------------------------
    // XML Sitemap (/sitemap.xml)
    // ----------------------------------------------------
    if (pathname === '/sitemap.xml') {
      const pillars = db.prepare('SELECT slug FROM pillars').all();
      const articles = db.prepare(`
        SELECT a.slug as article_slug, p.slug as pillar_slug, a.last_verified_date
        FROM articles a
        JOIN pillars p ON a.pillar_id = p.id
        WHERE a.review_status = 'Published'
      `).all();

      const domain = 'https://nepal-legal-awareness.gov.np';
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

      // Home
      xml += `  <url>\n    <loc>${domain}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

      // Pillars
      for (const p of pillars) {
        xml += `  <url>\n    <loc>${domain}/${p.slug}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
      }

      // Articles
      for (const a of articles) {
        xml += `  <url>\n    <loc>${domain}/${a.pillar_slug}/${a.article_slug}/</loc>\n    <lastmod>${a.last_verified_date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      }

      // Tools & Trust
      const tools = ['rights-explorer', 'document-checklist', 'procedure-guide', 'government-directory', 'legal-dictionary'];
      for (const t of tools) {
        xml += `  <url>\n    <loc>${domain}/tools/${t}/</loc>\n    <priority>0.7</priority>\n  </url>\n`;
      }

      for (const tp of topicalMap.trustPages) {
        xml += `  <url>\n    <loc>${domain}/trust/${tp.slug}/</loc>\n    <priority>0.5</priority>\n  </url>\n`;
      }

      xml += `</urlset>`;
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      res.end(xml);
      return;
    }

    // ----------------------------------------------------
    // Robots.txt
    // ----------------------------------------------------
    if (pathname === '/robots.txt') {
      const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://nepal-legal-awareness.gov.np/sitemap.xml\n`;
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(robots);
      return;
    }

    // ----------------------------------------------------
    // API: Live Search (/api/search)
    // ----------------------------------------------------
    if (pathname === '/api/search') {
      const q = (urlObj.searchParams.get('q') || '').trim();
      if (!q) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ results: [] }));
        return;
      }

      const searchPattern = `%${q}%`;
      const articles = db.prepare(`
        SELECT a.slug, a.title_en, a.title_ne, a.summary_en, a.summary_ne, p.slug as pillar_slug
        FROM articles a
        JOIN pillars p ON a.pillar_id = p.id
        WHERE (a.title_en LIKE ? OR a.title_ne LIKE ? OR a.summary_en LIKE ? OR a.content_en LIKE ? OR a.applicable_legislation LIKE ?)
        LIMIT 5
      `).all(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);

      const terms = db.prepare(`
        SELECT term_en, term_ne, simple_explanation_en, simple_explanation_ne
        FROM legal_terms
        WHERE (term_en LIKE ? OR term_ne LIKE ? OR definition_en LIKE ?)
        LIMIT 2
      `).all(searchPattern, searchPattern, searchPattern);

      const authorities = db.prepare(`
        SELECT name_en, name_ne, role_en, role_ne
        FROM authorities
        WHERE (name_en LIKE ? OR name_ne LIKE ? OR role_en LIKE ?)
        LIMIT 2
      `).all(searchPattern, searchPattern, searchPattern);

      const results = [];
      for (const a of articles) {
        results.push({
          type: 'Statutory Article',
          title: lang === 'ne' ? a.title_ne : a.title_en,
          snippet: lang === 'ne' ? a.summary_ne.substring(0, 120) + '...' : a.summary_en.substring(0, 120) + '...',
          url: `/${a.pillar_slug}/${a.slug}/?lang=${lang}`
        });
      }

      for (const t of terms) {
        results.push({
          type: 'Legal Term',
          title: `${t.term_en} (${t.term_ne})`,
          snippet: lang === 'ne' ? t.simple_explanation_ne : t.simple_explanation_en,
          url: `/tools/legal-dictionary/?lang=${lang}`
        });
      }

      for (const auth of authorities) {
        results.push({
          type: 'Government Authority',
          title: lang === 'ne' ? auth.name_ne : auth.name_en,
          snippet: lang === 'ne' ? auth.role_ne : auth.role_en,
          url: `/tools/government-directory/?lang=${lang}`
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ results }));
      return;
    }

    // ----------------------------------------------------
    // API: Report Error POST
    // ----------------------------------------------------
    if (pathname === '/api/report-error' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const params = new URLSearchParams(body);
        const article_url = params.get('article_url') || 'Unknown';
        const reporter_email = params.get('reporter_email') || '';
        const issue_type = params.get('issue_type') || 'General';
        const details = params.get('details') || '';

        db.prepare(`
          INSERT INTO error_reports (article_url, reporter_email, issue_type, details, status, created_at)
          VALUES (?, ?, ?, ?, 'Open', datetime('now'))
        `).run(article_url, reporter_email, issue_type, details);

        db.prepare(`
          INSERT INTO audit_logs (action, entity_type, entity_id, details, created_at)
          VALUES ('REPORT_ERROR', 'ARTICLE', ?, ?, datetime('now'))
        `).run(article_url, `Issue reported: ${issue_type}`);

        res.writeHead(302, { 'Location': `/report-error/?success=1&lang=${lang}` });
        res.end();
      });
      return;
    }

    // ----------------------------------------------------
    // API: Ask Question POST
    // ----------------------------------------------------
    if (pathname === '/api/ask-question' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const params = new URLSearchParams(body);
        const name = params.get('name') || 'Anonymous';
        const email = params.get('email') || '';
        const topic = params.get('topic') || 'General';
        const question_text = params.get('question_text') || '';

        db.prepare(`
          INSERT INTO questions (name, email, topic, question_text, status, created_at)
          VALUES (?, ?, ?, ?, 'Pending', datetime('now'))
        `).run(name, email, topic, question_text);

        res.writeHead(302, { 'Location': `/ask-question/?success=1&lang=${lang}` });
        res.end();
      });
      return;
    }

    // ----------------------------------------------------
    // API: Admin Login / Logout
    // ----------------------------------------------------
    if (pathname === '/api/admin/login' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const params = new URLSearchParams(body);
        const username = params.get('username');
        const password = params.get('password');

        if (username === 'admin' && password === 'nepal-legal-2026') {
          const sessionToken = crypto.randomUUID();
          activeSessions.set(sessionToken, username);
          res.writeHead(302, {
            'Set-Cookie': `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict`,
            'Location': '/admin/'
          });
          res.end();
        } else {
          res.writeHead(302, { 'Location': '/admin/?error=Invalid%20credentials' });
          res.end();
        }
      });
      return;
    }

    if (pathname === '/api/admin/logout') {
      const cookies = parseCookies(req);
      if (cookies.admin_session) {
        activeSessions.delete(cookies.admin_session);
      }
      res.writeHead(302, {
        'Set-Cookie': 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Location': '/admin/'
      });
      res.end();
      return;
    }

    // ----------------------------------------------------
    // API: Create Article POST (Open to Everyone - No Login Required)
    // ----------------------------------------------------
    if (pathname === '/api/admin/articles' && req.method === 'POST') {
      const user = getAdminUser(req) || 'Community Contributor (Open Access)';

      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        const p = new URLSearchParams(body);
        const title_en = p.get('title_en');
        const title_ne = p.get('title_ne');
        const slug = p.get('slug');
        const pillar_id = parseInt(p.get('pillar_id'), 10);
        const summary_en = p.get('summary_en');
        const summary_ne = p.get('summary_ne');
        const applicable_legislation = p.get('applicable_legislation');
        const relevant_sections = p.get('relevant_sections');
        const official_source_url = p.get('official_source_url');
        const reviewed_by = p.get('reviewed_by');
        const review_status = p.get('review_status');
        const last_verified_date = p.get('last_verified_date');
        const content_en = p.get('content_en');
        const content_ne = p.get('content_ne');

        try {
          db.prepare(`
            INSERT INTO articles (
              slug, pillar_id, title_en, title_ne, summary_en, summary_ne,
              applicable_legislation, relevant_sections, official_source_url,
              reviewed_by, review_status, last_verified_date, publication_date,
              content_en, content_ne, jurisdiction
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date('now'), ?, ?, 'Nepal')
          `).run(
            slug, pillar_id, title_en, title_ne, summary_en, summary_ne,
            applicable_legislation, relevant_sections, official_source_url,
            reviewed_by, review_status, last_verified_date, content_en, content_ne
          );

          db.prepare(`
            INSERT INTO audit_logs (action, entity_type, entity_id, details, created_at)
            VALUES ('ARTICLE_CREATED', 'ARTICLE', ?, ?, datetime('now'))
          `).run(slug, `Created by ${user}`);

          res.writeHead(302, { 'Location': '/admin/?created=1' });
          res.end();
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error creating article: ' + err.message);
        }
      });
      return;
    }

    // ----------------------------------------------------
    // Page: Admin Dashboard (/admin/ - Open to All Users)
    // ----------------------------------------------------
    if (pathname === '/admin/' || pathname === '/admin') {
      const user = getAdminUser(req) || 'Community Editor (Open Access)';
      const errorMsg = urlObj.searchParams.get('error');
      const html = renderAdminPage({ isAuthenticated: true, user, error: errorMsg });
      
      const fullHtml = renderLayout({
        title: 'Open Editorial CMS & Legal Content Management',
        content: html,
        currentPath: '/admin/',
        lang: 'en'
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
      return;
    }

    // ----------------------------------------------------
    // Page: Home (/)
    // ----------------------------------------------------
    if (pathname === '/' || pathname === '') {
      const content = renderHomePage(lang);
      const metaTags = generateMetaTags({
        title: lang === 'ne' ? 'गृहपृष्ठ' : 'Your Rights. Your Laws. Your Knowledge.',
        description: 'Comprehensive public legal awareness platform for Nepal. Clear, reliable, and verified citizen guides on fundamental constitutional rights, labour laws, property, family, and cyber protections.',
        url: '/',
        lang
      });

      const fullHtml = renderLayout({
        title: lang === 'ne' ? 'नागरिक अधिकार तथा कानुनी सचेतना' : 'Citizens Rights & Legal Awareness Platform',
        metaTags,
        content,
        currentPath: '/',
        lang
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
      return;
    }

    // ----------------------------------------------------
    // Page: Interactive Tools Hub (/tools/ and subtools)
    // ----------------------------------------------------
    if (pathname === '/tools/' || pathname === '/tools' || pathname.startsWith('/tools/')) {
      if (pathname.includes('government-directory')) {
        const content = renderAuthorityDirectoryPage(lang);
        const breadcrumbs = renderBreadcrumbs([
          { name: lang === 'ne' ? 'औजारहरू' : 'Tools', url: '/tools/' },
          { name: lang === 'ne' ? 'सरकारी निकाय निर्देशिका' : 'Government Directory', url: '/tools/government-directory/' }
        ], lang);
        const fullHtml = renderLayout({
          title: lang === 'ne' ? 'सरकारी निकाय निर्देशिका' : 'Government Authority Directory',
          content,
          breadcrumbs,
          currentPath: '/tools/',
          lang
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      }

      if (pathname.includes('legal-dictionary')) {
        const content = renderTermsDictionaryPage(lang);
        const breadcrumbs = renderBreadcrumbs([
          { name: lang === 'ne' ? 'औजारहरू' : 'Tools', url: '/tools/' },
          { name: lang === 'ne' ? 'कानुनी शब्दकोश' : 'Legal Terms Dictionary', url: '/tools/legal-dictionary/' }
        ], lang);
        const fullHtml = renderLayout({
          title: lang === 'ne' ? 'कानुनी शब्दकोश' : 'Legal Terms Dictionary',
          content,
          breadcrumbs,
          currentPath: '/tools/',
          lang
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      }

      // Default tools hub
      const content = renderToolsPage('hub', lang);
      const breadcrumbs = renderBreadcrumbs([
        { name: lang === 'ne' ? 'नागरिक औजारहरू' : 'Citizen Tools', url: '/tools/' }
      ], lang);
      const fullHtml = renderLayout({
        title: lang === 'ne' ? 'नागरिक कानुनी औजारहरू' : 'Interactive Citizen Legal Tools',
        content,
        breadcrumbs,
        currentPath: '/tools/',
        lang
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
      return;
    }

    // ----------------------------------------------------
    // Page: Trust & Authority Pages (/trust/[slug]/)
    // ----------------------------------------------------
    const trustMatch = pathname.match(/^\/trust\/([a-z0-9-]+)\/?$/);
    if (trustMatch) {
      const slug = trustMatch[1];
      const content = renderTrustPage(slug, lang);
      if (content) {
        const breadcrumbs = renderBreadcrumbs([
          { name: lang === 'ne' ? 'विश्वसनीयता' : 'Trust Standards', url: '/trust/about-us/' },
          { name: slug.replace(/-/g, ' ').toUpperCase(), url: `/trust/${slug}/` }
        ], lang);
        const fullHtml = renderLayout({
          title: slug.replace(/-/g, ' ').toUpperCase(),
          content,
          breadcrumbs,
          currentPath: `/trust/${slug}/`,
          lang
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      }
    }

    // Backward-compat shortcuts (/about-us/, /contact/, /editorial-policy/, /legal-disclaimer/, etc.)
    const directTrustSlug = pathname.replace(/^\/|\/$/g, '');
    if (topicalMap.trustPages.some(p => p.slug === directTrustSlug)) {
      res.writeHead(301, { 'Location': `/trust/${directTrustSlug}/?lang=${lang}` });
      res.end();
      return;
    }

    // ----------------------------------------------------
    // Page: Report Error (/report-error/)
    // ----------------------------------------------------
    if (pathname === '/report-error/' || pathname === '/report-error') {
      const targetUrl = urlObj.searchParams.get('url') || '';
      const content = renderReportErrorPage(targetUrl, lang);
      const fullHtml = renderLayout({
        title: 'Report Content Inaccuracy',
        content,
        currentPath: '/report-error/',
        lang
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
      return;
    }

    // ----------------------------------------------------
    // Page: Ask Question (/ask-question/)
    // ----------------------------------------------------
    if (pathname === '/ask-question/' || pathname === '/ask-question') {
      const topic = urlObj.searchParams.get('topic') || '';
      const content = renderAskQuestionPage(topic, lang);
      const fullHtml = renderLayout({
        title: 'Ask a Public Legal Question',
        content,
        currentPath: '/ask-question/',
        lang
      });
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fullHtml);
      return;
    }

    // ----------------------------------------------------
    // Page: Core Pillar Landing Pages (e.g. /fundamental-rights/)
    // ----------------------------------------------------
    const pillarMatch = pathname.match(/^\/([a-z0-9-]+)\/?$/);
    if (pillarMatch) {
      const pillarSlug = pillarMatch[1];
      const pillarHtml = renderPillarPage(pillarSlug, lang);
      if (pillarHtml) {
        const pillar = db.prepare('SELECT * FROM pillars WHERE slug = ?').get(pillarSlug);
        const metaTags = generateMetaTags({
          title: lang === 'ne' ? pillar.title_ne : pillar.title_en,
          description: lang === 'ne' ? pillar.meta_description_ne : pillar.meta_description_en,
          url: `/${pillar.slug}/`,
          lang
        });
        const breadcrumbs = renderBreadcrumbs([
          { name: lang === 'ne' ? pillar.title_ne : pillar.title_en, url: `/${pillar.slug}/` }
        ], lang);
        const fullHtml = renderLayout({
          title: lang === 'ne' ? pillar.title_ne : pillar.title_en,
          metaTags,
          breadcrumbs,
          content: pillarHtml,
          currentPath: `/${pillar.slug}/`,
          lang
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      }
    }

    // ----------------------------------------------------
    // Page: Supporting Article Pages (e.g. /employment-labour-rights/unpaid-salary-employer-labour-complaint-nepal/)
    // ----------------------------------------------------
    const articleMatch = pathname.match(/^\/([a-z0-9-]+)\/([a-z0-9-]+)\/?$/);
    if (articleMatch) {
      const pillarSlug = articleMatch[1];
      const articleSlug = articleMatch[2];
      const articleHtml = renderArticlePage(pillarSlug, articleSlug, lang);

      if (articleHtml) {
        const pillar = db.prepare('SELECT * FROM pillars WHERE slug = ?').get(pillarSlug);
        const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(articleSlug);

        const metaTags = generateMetaTags({
          title: lang === 'ne' ? article.title_ne : article.title_en,
          description: lang === 'ne' ? article.summary_ne : article.summary_en,
          url: `/${pillar.slug}/${article.slug}/`,
          type: 'article',
          publishedTime: article.publication_date,
          modifiedTime: article.last_verified_date,
          lang
        });

        const articleSchema = generateArticleSchema(article, pillar);
        const breadcrumbsSchema = generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: pillar.title_en, url: `/${pillar.slug}/` },
          { name: article.title_en, url: `/${pillar.slug}/${article.slug}/` }
        ]);
        const faqSchema = article.faqs_json ? generateFAQSchema(JSON.parse(article.faqs_json), lang) : '';

        const breadcrumbs = renderBreadcrumbs([
          { name: lang === 'ne' ? pillar.title_ne : pillar.title_en, url: `/${pillar.slug}/` },
          { name: lang === 'ne' ? article.title_ne : article.title_en, url: `/${pillar.slug}/${article.slug}/` }
        ], lang);

        const fullHtml = renderLayout({
          title: lang === 'ne' ? article.title_ne : article.title_en,
          metaTags,
          structuredData: `${articleSchema}\n${breadcrumbsSchema}\n${faqSchema}`,
          breadcrumbs,
          content: articleHtml,
          currentPath: `/${pillar.slug}/${article.slug}/`,
          lang
        });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fullHtml);
        return;
      }
    }

    // ----------------------------------------------------
    // 404 Not Found
    // ----------------------------------------------------
    const notFoundHtml = renderLayout({
      title: 'Page Not Found (४०४ फेला परेन)',
      content: `
        <div class="site-container" style="text-align:center;padding:5rem 1rem;">
          <h1 style="font-size:3rem;color:#0B2545;margin-bottom:1rem;">404</h1>
          <h2 style="font-size:1.5rem;margin-bottom:1rem;">Legal Resource Not Found (पृष्ठ फेला परेन)</h2>
          <p style="color:#64748B;max-width:500px;margin:0 auto 2rem;">
            The requested legal guide or statute URL does not exist or may have been reorganized under a different core pillar.
          </p>
          <a href="/?lang=${lang}" class="btn btn-primary">Return to Knowledge Hub</a>
        </div>
      `,
      currentPath: pathname,
      lang
    });
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(notFoundHtml);

  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>500 Internal Server Error</h1><p>${err.message}</p>`);
  }
}

export const server = http.createServer(handleRequest);

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) ||
  process.argv[1].endsWith('server.js')
);

if (isMain) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`  Citizens' Rights & Legal Awareness Platform (Nepal)`);
    console.log(`  Running at: http://localhost:${PORT}`);
    console.log(`  Admin CMS:  http://localhost:${PORT}/admin/`);
    console.log(`  Language:   Bilingual English & Nepali (नेपाली)`);
    console.log(`================================================================`);
  });
}

export default handleRequest;
