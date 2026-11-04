import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'platform.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance concurrency
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS pillars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title_en TEXT NOT NULL,
      title_ne TEXT NOT NULL,
      short_title_en TEXT,
      short_title_ne TEXT,
      icon TEXT,
      entity_name TEXT,
      laws_covered TEXT,
      meta_description_en TEXT,
      meta_description_ne TEXT,
      intro_en TEXT,
      intro_ne TEXT,
      overview_html_en TEXT,
      overview_html_ne TEXT,
      order_index INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      pillar_id INTEGER NOT NULL,
      category_slug TEXT,
      title_en TEXT NOT NULL,
      title_ne TEXT NOT NULL,
      summary_en TEXT NOT NULL,
      summary_ne TEXT NOT NULL,
      target_audience TEXT,
      primary_keyword TEXT,
      related_entities TEXT,
      jurisdiction TEXT DEFAULT 'Nepal',
      applicable_legislation TEXT,
      relevant_sections TEXT,
      official_source_url TEXT,
      publication_date TEXT,
      last_verified_date TEXT,
      reviewed_by TEXT,
      review_status TEXT DEFAULT 'Published',
      content_en TEXT NOT NULL,
      content_ne TEXT NOT NULL,
      faqs_json TEXT,
      steps_json TEXT,
      checklist_json TEXT,
      view_count INTEGER DEFAULT 0,
      FOREIGN KEY (pillar_id) REFERENCES pillars (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS authorities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_en TEXT NOT NULL,
      name_ne TEXT NOT NULL,
      role_en TEXT,
      role_ne TEXT,
      phone TEXT,
      emergency_helpline TEXT,
      website_url TEXT,
      address_en TEXT,
      address_ne TEXT,
      jurisdiction TEXT DEFAULT 'Nepal',
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS legal_terms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      term_en TEXT NOT NULL,
      term_ne TEXT NOT NULL,
      definition_en TEXT NOT NULL,
      definition_ne TEXT NOT NULL,
      simple_explanation_en TEXT,
      simple_explanation_ne TEXT,
      category TEXT,
      legal_source TEXT
    );

    CREATE TABLE IF NOT EXISTS document_checklists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT NULL,
      title_ne TEXT NOT NULL,
      category TEXT,
      description_en TEXT,
      description_ne TEXT,
      items_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS procedure_guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_en TEXT NOT NULL,
      title_ne TEXT NOT NULL,
      category TEXT,
      summary_en TEXT,
      summary_ne TEXT,
      steps_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      topic TEXT,
      question_text TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS error_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_url TEXT NOT NULL,
      reporter_email TEXT,
      issue_type TEXT,
      details TEXT NOT NULL,
      status TEXT DEFAULT 'Open',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_pillar ON articles(pillar_id);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(review_status);
  `);
}

// Initialize tables automatically upon import
initSchema();

export default db;
