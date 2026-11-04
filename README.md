# Citizens' Rights & Legal Awareness Platform (नागरिक अधिकार तथा कानुनी सचेतना मञ्च)
> **Brand Positioning**: *"Your Rights. Your Laws. Your Knowledge." (तपाईंको अधिकार। तपाईंको कानुन। तपाईंको ज्ञान।)*  
> **Primary Jurisdiction**: Federal Democratic Republic of Nepal (Scalable to global jurisdictions)

---

## 1. Project Overview

The **Citizens' Rights & Legal Awareness Platform** is a modern, high-performance, responsive, and SEO-optimized public legal education platform built specifically for the general public in Nepal. Rather than presenting dense legislative jargon or functioning as a law-firm commercial funnel, it demystifies statutory provisions into simple, practical, and everyday understandable guidance.

Every core legal guide directly answers the **8 Mandatory Citizen Questions**:
1. **What is the law?** (Statutory citation, enactment year, governing act)
2. **What does it mean in simple language?** (Plain-language translation without legalese)
3. **Who does it protect or apply to?** (Jurisdiction, eligibility, exclusions)
4. **What are your rights?** (Specific citizen entitlements under the law)
5. **What are your responsibilities?** (Reciprocal duties, conditions, formalities)
6. **What should you do if something goes wrong?** (Immediate emergency actions & dispute filing)
7. **Which government authority or institution can help?** (Police, Ward Committee, Department, Court)
8. **Where can you find the official legal document?** (Direct primary reference to Nepal Law Commission / Gazette)

---

## 2. Core Pillars & Topical Map Architecture

The platform follows a strict **Hub-and-Spoke Semantic Topical Architecture**:

### The 5 Core Strategic Pillars
1. **Fundamental Rights & Constitutional Law** (`/fundamental-rights/`)
   - *Governing Act*: Constitution of Nepal 2072 (Part 3, Articles 16-46)
   - *Key topics*: Equality, freedom of expression, right to information (RTI), habeas corpus writs.
2. **Employment & Labour Rights** (`/employment-labour-rights/`)
   - *Governing Act*: Labour Act 2074 & Social Security Act 2074
   - *Key topics*: 8-hour workday, overtime calculations (1.5x), minimum wage, SSF enrollment, unpaid wages claim.
3. **Family, Marriage & Personal Rights** (`/family-marriage-rights/`)
   - *Governing Act*: National Civil Code 2074 (Muluki Devani Samhita)
   - *Key topics*: Court marriage at District Court (age 20+), mutual/contentious divorce, daughter's property rights, domestic violence emergency steps (1145).
4. **Property, Land & Housing Rights** (`/property-land-rights/`)
   - *Governing Act*: Land Revenue Act 2034, Land Act 2021, Civil Code Chapter 10
   - *Key topics*: Lalpurja (Land Certificate) verification, Sresta checking, Napi trace verification, tenant eviction protections.
5. **Consumer, Cyber & Criminal Law Awareness** (`/consumer-cyber-criminal-rights/`)
   - *Governing Act*: Consumer Protection Act 2075, Electronic Transactions Act 2063, National Penal Code 2074
   - *Key topics*: Online shopping fraud, social media blackmail, rights when arrested by police (24-hour rule, Article 20).

### Secondary Topical Clusters
- **Cluster A**: Government Services & Citizen Procedures (Citizenship, NID, Passport, Ward Certificates)
- **Cluster B**: Legal System and Justice (Court hierarchy, civil vs. criminal proceedings, legal aid)
- **Cluster C**: Education & Student Rights (Anti-ragging, scholarship entitlements, right to education)
- **Cluster D**: Financial & Banking Rights (NRB consumer protection, digital payment reversals)
- **Cluster E**: Women's & Children's Protection (Anti-trafficking, child marriage bans, crisis shelters)

---

## 3. Interactive Citizen Decision Tools

Located under `/tools/`:
- **Legal Rights Explorer** (`/tools/rights-explorer/`): 3-step decision tree matching real-life crises to statutory protections.
- **Document Readiness Checklist** (`/tools/document-checklist/`): Interactive checklist for buying land, court marriages, and labour claims with print mode.
- **Government Authority Directory** (`/tools/government-directory/`): Verified telephone numbers, roles, and emergency helplines (Police 100, Women 1145, Child 104, NHRC 1114, Consumer 1137).
- **Legal Terms Dictionary** (`/tools/legal-dictionary/`): Real-time searchable glossary translating Nepali legal terms (*Lalpurja*, *Anshbanda*, *Firadpatra*, *Milapatra*, *Bandipratyakshikaran*) into plain language.
- **Live Search Modal**: Keyboard accessible (`Ctrl+K` or `/`), natural language autocomplete, and quick suggested chips.

---

## 4. Trust & Authority Infrastructure (12 Pages)

The platform provides complete institutional transparency:
1. `About Us` (`/trust/about-us/`)
2. `Contact Us` (`/trust/contact/`)
3. `Our Mission` (`/trust/our-mission/`)
4. `Editorial Policy` (`/trust/editorial-policy/`)
5. `Fact-Checking Policy` (`/trust/fact-checking-policy/`)
6. `Legal Disclaimer` (`/trust/legal-disclaimer/`)
7. `Privacy Policy` (`/trust/privacy-policy/`)
8. `Terms & Conditions` (`/trust/terms-and-conditions/`)
9. `Corrections Policy` (`/trust/corrections-policy/`)
10. `Sources and References` (`/trust/sources/`)
11. `Accessibility Statement` (`/trust/accessibility/` - WCAG 2.2 AA)
12. `Content Review Process` (`/trust/content-review-process/` - 6-Stage Quality Assurance)

---

## 5. Technical Implementation & Architecture

- **Runtime**: Native Node.js v24.21.0 with zero external npm runtime bloat.
- **Database Engine**: Built-in `node:sqlite` in WAL mode (`PRAGMA journal_mode = WAL`) with prepared statements and foreign key enforcement.
- **Rendering**: Fast Server-Side Rendering (SSR) with pre-rendered semantic HTML5 and instant hydration.
- **SEO & Structured Data**: Dynamic `sitemap.xml`, `robots.txt`, and automated schema.org JSON-LD generation (`Article`, `BreadcrumbList`, `WebSite`, `Organization`, `FAQPage`).
- **Bilingual Engine**: Real-time language switching between English and Nepali (नेपाली) with cookie and URL persistence.
- **Editorial CMS**: Open Community Management console (`/admin/`) accessible to all visitors without any login requirement. Allows anyone to draft articles, manage verification statuses (`Draft` → `Awaiting Verification` → `Awaiting Legal Review` → `Approved` → `Published` → `Needs Updating` → `Archived`), review crowdsourced error reports, and audit revisions.

---

## 6. How to Run the Platform

### Option A: Double-Click Launcher
Simply double-click **`start.bat`** on your Desktop. It will launch the server and open your default web browser at `http://localhost:3000`.

### Option B: Command Line
```powershell
cd nepal-legal-platform
agy-node server.js
```
The application will listen on `http://localhost:3000`.

### Option C: Re-seed Database
```powershell
agy-node db/seed.js
```

### Option D: Run Test Suite
```powershell
agy-node test/test-suite.js
```
All 33 test assertions will execute in-process and report verification status.

### Community CMS Access
- **URL**: `http://localhost:3000/admin/`
- **Access**: Completely open to all people &bull; No username or password required. Anyone can view dashboard statistics, draft statutory guides, and review community legal questions.
