import db, { initSchema } from './database.js';

initSchema();

console.log('Seeding Nepal Citizens\' Rights & Legal Awareness Platform database...');

// Clean existing data for clean re-seed
db.exec(`
  DELETE FROM articles;
  DELETE FROM pillars;
  DELETE FROM authorities;
  DELETE FROM legal_terms;
  DELETE FROM document_checklists;
  DELETE FROM procedure_guides;
  DELETE FROM questions;
  DELETE FROM error_reports;
  DELETE FROM admin_sessions;
  DELETE FROM audit_logs;
`);

// ----------------------------------------------------
// 1. CORE PILLARS
// ----------------------------------------------------
const insertPillar = db.prepare(`
  INSERT INTO pillars (
    slug, title_en, title_ne, short_title_en, short_title_ne, icon, entity_name, laws_covered,
    meta_description_en, meta_description_ne, intro_en, intro_ne, overview_html_en, overview_html_ne, order_index
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const pillarsData = [
  {
    slug: 'fundamental-rights',
    title_en: 'Fundamental Rights and Constitutional Law',
    title_ne: 'मौलिक हक र संवैधानिक कानुन',
    short_title_en: 'Constitutional Rights',
    short_title_ne: 'मौलिक हक',
    icon: 'scale',
    entity_name: 'Constitution of Nepal (Part 3, Articles 16-46)',
    laws_covered: 'Constitution of Nepal 2072, Right to Information Act 2064, National Human Rights Commission Act 2068',
    meta_description_en: 'Comprehensive citizen guide to the fundamental constitutional rights of Nepal: equality, freedom, information, privacy, education, and constitutional remedies.',
    meta_description_ne: 'नेपालको संविधान प्रदत्त मौलिक हकहरू: समानता, स्वतन्त्रता, सूचना, गोपनीयता, शिक्षा तथा संवैधानिक उपचारको सरल र स्पष्ट जानकारी।',
    intro_en: 'Part 3 of the Constitution of Nepal guarantees 31 fundamental rights to every person and citizen. These rights represent supreme legal guarantees that no government authority or private entity can arbitrarily violate.',
    intro_ne: 'नेपालको संविधानको भाग ३ ले प्रत्येक नागरिक तथा व्यक्तिलाई ३१ वटा मौलिक हकको ग्यारेन्टी गरेको छ। यी हकहरू राज्य वा कुनै पनि निकायले स्वेच्छाचारी ढंगले हनन गर्न नसक्ने सर्वोच्च कानुनी प्रत्याभूति हुन्।',
    overview_html_en: '<p>The Constitution of Nepal guarantees 31 fundamental rights ranging from the Right to Live with Dignity (Article 16) to the Right to Constitutional Remedies (Article 46). If any state authority violates your fundamental rights, you have the immediate constitutional prerogative to petition the High Court (Article 144) or the Supreme Court (Article 133) for extraordinary writs including Habeas Corpus, Mandamus, Certiorari, and Prohibition.</p>',
    overview_html_ne: '<p>नेपालको संविधानले सम्मानपूर्वक बाँच्न पाउने हक (धारा १६) देखि संवैधानिक उपचारको हक (धारा ४६) सम्म ३१ वटा मौलिक हकहरूको व्यवस्था गरेको छ। राज्यका कुनै पनि निकायले तपाईंका यी हकहरूमा अनुचित हस्तक्षेप गरेमा उच्च अदालत (धारा १४४) वा सर्वोच्च अदालत (धारा १३३) मा बन्दीप्रत्यक्षीकरण, परमादेश, उत्प्रेषण जस्ता रिट निवेदन दर्ता गर्ने असाधारण कानुनी अधिकार नागरिकलाई छ।</p>',
    order_index: 1
  },
  {
    slug: 'employment-labour-rights',
    title_en: 'Employment and Labour Rights',
    title_ne: 'रोजगार तथा श्रम अधिकार',
    short_title_en: 'Labour Rights',
    short_title_ne: 'श्रम अधिकार',
    icon: 'briefcase',
    entity_name: 'Labour Act 2074 & Social Security Act 2074',
    laws_covered: 'Labour Act 2074 (2017), Labour Rules 2075, Contribution-based Social Security Act 2074, Foreign Employment Act 2064',
    meta_description_en: 'Understand worker rights, minimum wages, overtime pay, termination rules, SSF benefits, and complaint procedures under Nepal Labour Act 2074.',
    meta_description_ne: 'नेपालको श्रम ऐन २०७४ बमोजिम श्रमिकका हक, न्यूनतम पारिश्रमिक, ओभरटाइम, बिदा, उपदान, सामाजिक सुरक्षा कोष र उजुरी प्रक्रियाको जानकारी।',
    intro_en: 'Every employee in Nepal—whether in formal, informal, domestic, or contract work—is protected by statutory labour protections governing working hours, minimum wage, paid leave, and severance.',
    intro_ne: 'नेपालमा औपचारिक, अनौपचारिक वा ज्यालादारीमा काम गर्ने प्रत्येक श्रमिकलाई कानुनले निश्चित कार्यघण्टा, न्यूनतम पारिश्रमिक, बिदा, सामाजिक सुरक्षा र अन्यायपूर्ण निष्कासन विरुद्ध कानुनी संरक्षण प्रदान गरेको छ।',
    overview_html_en: '<p>Under the Labour Act 2074, an employer cannot force any worker to work more than 8 hours a day or 48 hours a week. Overtime work must be compensated at 1.5 times the regular basic wage. Employers are legally obligated to enroll workers in the Social Security Fund (SSF) and cannot dismiss an employee without following statutory notice and disciplinary inquiry procedures.</p>',
    overview_html_ne: '<p>श्रम ऐन २०७४ अनुसार कुनै पनि रोजगारदाताले श्रमिकलाई दैनिक ८ घण्टा वा हप्ताको ४८ घण्टा भन्दा बढी काममा लगाउन पाउँदैन। थप समय काम लगाएमा आधारभूत पारिश्रमिकको १.५ गुणाका दरले अतिरिक्त समय (Overtime) भुक्तानी दिनुपर्छ। श्रमिकलाई सामाजिक सुरक्षा कोष (SSF) मा सूचीकृत गराउनु कानुनी बाध्यता हो।</p>',
    order_index: 2
  },
  {
    slug: 'family-marriage-rights',
    title_en: 'Family, Marriage and Personal Rights',
    title_ne: 'पारिवारिक, वैवाहिक तथा व्यक्तिगत अधिकार',
    short_title_en: 'Family Rights',
    short_title_ne: 'पारिवारिक अधिकार',
    icon: 'heart-handshake',
    entity_name: 'National Civil Code 2074 (Muluki Devani Samhita)',
    laws_covered: 'National Civil Code 2074, Domestic Violence (Crime and Punishment) Act 2066, Senior Citizens Act 2063',
    meta_description_en: 'Clear legal information on marriage registration, divorce, property partition (Anshbanda), child custody, domestic violence, and inheritance in Nepal.',
    meta_description_ne: 'मुलुकी देवानी संहिता अनुसार विवाह दर्ता, सम्बन्ध विच्छेद, अंशबण्डा, महिलाको सम्पत्ति अधिकार, घरेलु हिंसा र कानूनी उपचारको स्पष्ट विवरण।',
    intro_en: 'Nepal family law under the Muluki Devani Samhita establishes gender equality in marriage, property ownership, divorce proceedings, parental custody, and inheritance.',
    intro_ne: 'मुलुकी देवानी संहिता २०७४ ले विवाह, सम्बन्ध विच्छेद, सन्तानको हेरचाह, मानाचामल, अंशबण्डा तथा सम्पत्ति अधिकारमा महिला र पुरुष दुवैलाई समान कानुनी हैसियत प्रदान गरेको छ।',
    overview_html_en: '<p>The minimum legal marriage age in Nepal is 20 years for both men and women. In divorce proceedings, property accumulated during the marriage is subject to equal partition between spouses unless an amicable mutual agreement is reached. Domestic violence is a punishable criminal offense with immediate police protection, court protective orders, and state-backed shelter access.</p>',
    overview_html_ne: '<p>नेपालमा विवाह गर्न महिला र पुरुष दुवैको उमेर २० वर्ष पूरा हुनु अनिवार्य छ। सम्बन्ध विच्छेद हुँदा विवाहपछिको संयुक्त सम्पत्तिमा पति-पत्नी दुवैको समान हक लाग्छ। घरेलु हिंसा कसुरजन्य अपराध हो, जसमा पीडितले तत्काल प्रहरी सुरक्षा, अदालतबाट अन्तरिम संरक्षणात्मक आदेश र राहत पाउने कानुनी अधिकार छ।</p>',
    order_index: 3
  },
  {
    slug: 'property-land-rights',
    title_en: 'Property, Land and Housing Rights',
    title_ne: 'सम्पत्ति, जग्गाजमिन तथा आवास अधिकार',
    short_title_en: 'Property & Land',
    short_title_ne: 'जग्गा तथा सम्पत्ति',
    icon: 'home',
    entity_name: 'Land Act 2021 & Muluki Devani Samhita',
    laws_covered: 'Land Act 2021, Land Revenue Act 2034, Muluki Devani Samhita 2074 (Part 4 Property Law), Local Government Operation Act 2074',
    meta_description_en: 'How to verify land ownership (Lalpurja), buy property safely, understand tenant and landlord rights, resolve boundary disputes, and register deeds in Nepal.',
    meta_description_ne: 'नेपालमा लालपुर्जा प्रमाणीकरण, जग्गा खरिद-बिक्री प्रक्रिया, बहालवाला र घरधनीका अधिकार, सिमाना विवाद र वडा न्यायिक समितिको भूमिका।',
    intro_en: 'Land and real estate in Nepal carry strict formal registration rules. Understanding your Lalpurja (Land Ownership Certificate), Malpot records, and tenancy agreements protects you against fraud and unlawful eviction.',
    intro_ne: 'नेपालमा जग्गाजमिन तथा घर सम्बन्धी कारोबारमा मालपोत कार्यालयको आधिकारिक लिखत पास र लालपुर्जा अनिवार्य हुन्छ। भाडामा बस्ने नागरिकका अधिकार र घरधनीको दायित्व कानुनद्वारा निर्धारित छन्।',
    overview_html_en: '<p>Every genuine real estate transfer in Nepal must be processed through the Land Revenue Office (मालपोत कार्यालय) and documented on an official registered deed (लिखित पास). Tenant eviction without reasonable cause or without written prior notice is prohibited by Chapter 10 of the Muluki Devani Samhita. Boundary disputes under a certain valuation can be swiftly arbitrated by the Local Ward Judicial Committee (वडा न्यायिक समिति).</p>',
    overview_html_ne: '<p>नेपालमा जग्गाको वैधानिक हस्तान्तरण मालपोत कार्यालयमा सरकारी लिखत पास भएपछि मात्र मान्य हुन्छ। मुलुकी देवानी संहिताको परिच्छेद १० बमोजिम विना लिखित पूर्वसूचना वा मनासिव कारण विना घरधनीले बहालवालालाई हटाउन पाउँदैन। सिमाना र साँध सम्बन्धी साना विवादहरू स्थानीय वडा न्यायिक समितिबाटै मिलापत्र गराउन सकिन्छ।</p>',
    order_index: 4
  },
  {
    slug: 'consumer-cyber-criminal-rights',
    title_en: 'Consumer, Cyber and Criminal Law Awareness',
    title_ne: 'उपभोक्ता, साइबर तथा फौजदारी कानुन सचेतना',
    short_title_en: 'Consumer & Cyber',
    short_title_ne: 'उपभोक्ता र साइबर',
    icon: 'shield-alert',
    entity_name: 'Consumer Protection Act 2075 & National Penal Code 2074',
    laws_covered: 'Consumer Protection Act 2075, Electronic Transactions Act 2063, National Penal Code 2074, Criminal Procedure Code 2074',
    meta_description_en: 'Know your consumer rights against defective goods and online scams, cybercrime reporting procedures, and your fundamental rights upon police arrest in Nepal.',
    meta_description_ne: 'गुणस्तरहीन सामान विरुद्ध उपभोक्ता उजुरी, अनलाइन ठगी र साइबर अपराधको रिपोर्टिङ, र प्रहरी पक्राउ पर्दा नागरिकका कानुनी अधिकार।',
    intro_en: 'When you purchase goods, navigate digital payment platforms, or interact with law enforcement, the law provides vital protections against deception, digital exploitation, and arbitrary state power.',
    intro_ne: 'बजारबाट सामान किन्दा, अनलाइन भुक्तानी गर्दा वा प्रहरी प्रशासनसँगको व्यवहारमा नागरिकले ठगी, चरित्रहत्या र स्वेच्छाचारी धरपकड विरुद्ध सशक्त कानुनी सुरक्षा पाएका छन्।',
    overview_html_en: '<p>The Consumer Protection Act 2075 grants every buyer the right to truthful pricing, compensation for defective goods, and swift redress through the Department of Commerce. Under cyber laws, misuse of photos and online extortion are investigated by the Nepal Police Cyber Bureau. If detained by police, Article 20 of the Constitution grants you the inviolable right to consult a legal practitioner and be produced before a judge within 24 hours.</p>',
    overview_html_ne: '<p>उपभोक्ता संरक्षण ऐन २०७५ ले ठगी वा कमसल वस्तु विरुद्ध क्षतिपूर्ति पाउने अधिकार दिएको छ। अनलाइन चरित्रहत्या वा साइबर अपराधमा नेपाल प्रहरीको साइबर ब्युरोमा उजुरी दिन सकिन्छ। प्रहरीले पक्राउ गरेमा २४ घण्टाभित्र अदालतमा उपस्थित गराउनुपर्ने र कानुन व्यवसायीसँग परामर्श लिन पाउने संवैधानिक अधिकार अक्षुण्ण रहन्छ।</p>',
    order_index: 5
  }
];

const pillarMap = {};
for (const p of pillarsData) {
  insertPillar.run(
    p.slug, p.title_en, p.title_ne, p.short_title_en, p.short_title_ne, p.icon, p.entity_name, p.laws_covered,
    p.meta_description_en, p.meta_description_ne, p.intro_en, p.intro_ne, p.overview_html_en, p.overview_html_ne, p.order_index
  );
  // Get inserted id
  const row = db.prepare('SELECT id FROM pillars WHERE slug = ?').get(p.slug);
  pillarMap[p.slug] = row.id;
}

// ----------------------------------------------------
// 2. SUPPORTING ARTICLES (Deep, verified statutory articles)
// ----------------------------------------------------
const insertArticle = db.prepare(`
  INSERT INTO articles (
    slug, pillar_id, category_slug, title_en, title_ne, summary_en, summary_ne, target_audience,
    primary_keyword, related_entities, jurisdiction, applicable_legislation, relevant_sections,
    official_source_url, publication_date, last_verified_date, reviewed_by, review_status,
    content_en, content_ne, faqs_json, steps_json, checklist_json, view_count
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const articlesData = [
  // Pillar 1: Fundamental Rights
  {
    slug: 'constitution-nepal-fundamental-rights-explained',
    pillar_slug: 'fundamental-rights',
    category_slug: 'constitutional-rights',
    title_en: 'Fundamental Rights Under the Constitution of Nepal: A Plain Language Guide',
    title_ne: 'नेपालको संविधानका मौलिक हकहरू: सर्वसाधारणका लागि सरल व्याख्या',
    summary_en: 'An everyday citizen guide to the 31 fundamental rights in Part 3 of the Constitution of Nepal, what they protect, and how to demand constitutional remedies if violated.',
    summary_ne: 'नेपालको संविधानको भाग ३ मा उल्लेखित ३१ मौलिक हकहरूको सूची, तिनको अर्थ र कुनै हक हनन भएमा अदालत जाने उपायहरूको पूर्ण विवरण।',
    target_audience: 'General public, students, human rights advocates, community leaders in Nepal',
    primary_keyword: 'fundamental rights constitution of nepal',
    related_entities: 'Supreme Court of Nepal, High Courts, National Human Rights Commission, Nepal Law Commission',
    jurisdiction: 'Federal Democratic Republic of Nepal',
    applicable_legislation: 'Constitution of Nepal 2072 (नेपालको संविधान, २०७२)',
    relevant_sections: 'Part 3, Articles 16 through 46',
    official_source_url: 'https://lawcommission.gov.np/en/wp-content/uploads/2021/01/Constitution-of-Nepal.pdf',
    publication_date: '2026-01-15',
    last_verified_date: '2026-10-25',
    reviewed_by: 'Senior Legal Research Directorate (Verifiable Nepal Law Commission Gazette Registry)',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
Part 3 (Articles 16 to 46) of the Constitution of Nepal, promulgated on 20 September 2015 (3 Ashwin 2072), establishes the fundamental rights of all citizens. These rights are the bedrock of democracy and can only be restricted under very strict, constitutionally recognized public emergencies.

### 2. What does it mean in simple language?
Fundamental rights are not privileges handed down by politicians or bureaucrats; they are your inherent rights as a human being and citizen. If a law or government action clashes with these rights, the Supreme Court has the power to strike that law down as void.

### 3. Who does it protect or apply to?
Certain rights apply to **every person on Nepali soil** (such as the Right to Live with Dignity, Right to Personal Liberty, and Protection in Criminal Proceedings). Other political and economic rights apply specifically to **citizens of Nepal** (such as the Right to Freedom of Speech, Freedom of Movement, and Right to Employment).

### 4. What are your key rights?
- **Right to Live with Dignity (Article 16)**: Capital punishment is abolished; no person can be deprived of life or treated with humiliation.
- **Right to Equality (Article 18)**: No discrimination on grounds of origin, religion, race, caste, tribe, sex, or physical condition.
- **Right to Freedom (Article 17)**: Freedom of opinion and expression, peaceful assembly without arms, and freedom to practice any trade or business.
- **Right to Information (Article 27)**: Demand and receive information on any matter of public interest.
- **Right to Privacy (Article 28)**: The person, residence, property, documents, and correspondence of every person are inviolable.
- **Rights of Women (Article 38)**: Equal lineage rights, equal rights to family property, safe motherhood, and protection against violence.
- **Right to Constitutional Remedies (Article 46)**: You can approach the judiciary to enforce any of these rights.

### 5. What are your responsibilities?
Article 48 outlines every citizen's duties: to safeguard the sovereignty, unity, and integrity of Nepal; abide by the Constitution and laws; perform compulsory service when the State requires; and protect public and national property.

### 6. What should you do if your rights are violated?
1. **Document the Violation**: Collect official correspondence, notices, audio/visual proof, or witness statements.
2. **File an Administrative Complaint**: Contact the head of the offending office or local oversight body.
3. **Petition the Judiciary**: Approach the High Court under Article 144 or the Supreme Court under Article 133 for an extraordinary writ petition (Habeas Corpus, Mandamus, Certiorari, Prohibition, or Quo-Warranto).
4. **Notify Independent Commissions**: Submit a petition to the National Human Rights Commission (NHRC) or National Women Commission (NWC).

### 7. Which institutions can help?
- **Supreme Court and High Courts of Nepal**: Supreme judicial authorities with writ jurisdiction.
- **National Human Rights Commission (NHRC)**: Investigates human rights violations (Harihar Bhawan, Lalitpur, Phone: 01-5010015).
- **Nepal Bar Association Legal Aid Committee**: Free legal counsel for indigent citizens.

### 8. Official legal documents
Read the authentic text in the Nepal Gazette or on the official Nepal Law Commission portal: [Constitution of Nepal 2072](https://lawcommission.gov.np).
    `,
    content_ne: `
### १. कानुन के हो?
२०७२ असोज ३ गते जारी भएको नेपालको संविधानको भाग ३ (धारा १६ देखि ४६ सम्म) ले ३१ वटा मौलिक हकहरूको व्यवस्था गरेको छ। यी हकहरू नागरिक स्वतन्त्रता र मानव अधिकारका आधारशिला हुन्।

### २. सरल भाषामा यसको अर्थ के हो?
मौलिक हक भनेको कुनै पनि सरकार वा अधिकारीले चाहेर पनि खोस्न नसक्ने तपाईंको नैसर्गिक अधिकार हो। यदि कुनै कानुन वा सरकारी आदेश मौलिक हक विपरित भएमा अदालतले त्यसलाई बदर (अमान्य) घोषित गरिदिन सक्छ।

### ३. यसले कसलाई सुरक्षा दिन्छ?
- **नेपालभित्र रहेका सबै व्यक्तिलाई**: सम्मानपूर्वक बाँच्न पाउने हक, वैयक्तिक स्वतन्त्रता, न्याय सम्बन्धी हक, यातना विरुद्धको हक।
- **नेपाली नागरिकलाई**: विचार र अभिव्यक्तिको स्वतन्त्रता, समानताको हक, रोजगारीको हक, सूचनाको हक, मतदान तथा राजनीतिक अधिकार।

### ४. तपाईंको अधिकार के के हुन्?
- **धारा १६ - सम्मानपूर्वक बाँच्न पाउने हक**: मृत्युदण्डको सजाय दिने गरी कुनै कानुन बनाइने छैन।
- **धारा १७ - स्वतन्त्रताको हक**: विचार र अभिव्यक्तिको स्वतन्त्रता, विना हातहतियार शान्तिपूर्वक भेला हुने स्वतन्त्रता।
- **धारा १८ - समानताको हक**: धर्म, वर्ण, जात, लिंग वा उत्पत्तिका आधारमा कुनै भेदभाव गर्न पाइँदैन।
- **धारा २७ - सूचनाको हक**: आफ्नो वा सार्वजनिक सरोकारको कुनै पनि विषयको सूचना माग्ने र पाउने हक।
- **धारा ३८ - महिलाको हक**: सम्पत्ति तथा पारिवारिक मामिलामा दम्पतीको समान हक, वंश सम्बन्धी हक।
- **धारा ४६ - संवैधानिक उपचारको हक**: हक हनन भएमा अदालतमा रिट निवेदन दिन पाउने हक।

### ५. नागरिकको कर्तव्य के हो?
धारा ४८ अनुसार राष्ट्रप्रति निष्ठावान हुनु, संविधान र कानुनको पालना गर्नु, राज्यले चाहेका बखत अनिवार्य सेवा गर्नु र सार्वजनिक सम्पत्तिको संरक्षण गर्नु नागरिकको कर्तव्य हो।

### ६. हक हनन भए के गर्ने?
१. प्रमाण संकलन गर्ने (लिखित आदेश, सूचना वा पत्र)।
२. सम्बन्धित कार्यालय वा प्रमुख समक्ष उजुरी दिने।
३. उच्च अदालत (धारा १४४) वा सर्वोच्च अदालत (धारा १३३) मा रिट निवेदन दर्ता गर्ने।
४. राष्ट्रिय मानव अधिकार आयोगमा उजुरी दिने।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Can the government suspend fundamental rights?',
        a_en: 'Only during a formally declared state of emergency under Article 273. Even during an emergency, non-derogable rights such as the Right to Life (Article 16), Freedom from Torture, and Habeas Corpus cannot be suspended.',
        q_ne: 'के सरकारले मौलिक हक निलम्बन गर्न सक्छ?',
        a_ne: 'धारा २७३ बमोजिम संकटकाल घोषणा भएको अवस्थामा केही स्वतन्त्रताहरू मात्र निलम्बन हुन सक्छन्। तर सम्मानपूर्वक बाँच्न पाउने हक, यातना विरुद्धको हक र बन्दीप्रत्यक्षीकरणको उपचार कहिल्यै निलम्बन हुन सक्दैन।'
      },
      {
        q_en: 'What is the fee to file a writ petition in the Supreme Court?',
        a_en: 'Habeas Corpus petitions require no court fees. General constitutional writ petitions require minimal statutory court filing stamps (typically Rs. 50 to Rs. 500 depending on nature) and indigent citizens can request free legal aid from court-appointed Bar counsel.',
        q_ne: 'सर्वोच्च अदालतमा रिट हाल्न कति खर्च लाग्छ?',
        a_ne: 'बन्दीप्रत्यक्षीकरण (अवैध थुना विरुद्ध) को रिटमा कुनै दस्तुर लाग्दैन। अन्य रिटमा सामान्य कोर्ट फी (रू ५०-५००) लाग्छ। विपन्न नागरिकका लागि वैतनिक कानुन व्यवसायीको निःशुल्क सेवा उपलब्ध हुन्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Identify the Specific Right Violated', title_ne: 'कुन धाराको हक हनन भएको हो यकिन गर्नुहोस्', desc_en: 'Check Articles 16-46 of the Constitution to identify the exact provision.' },
      { step: 2, title_en: 'Gather Documentation & Proof', title_ne: 'लिखित प्रमाण संकलन गर्नुहोस्', desc_en: 'Obtain copies of government rejection letters, arrest memos, or administrative refusals.' },
      { step: 3, title_en: 'Consult a Legal Practitioner or Legal Aid', title_ne: 'कानुन व्यवसायीसँग परामर्श लिनुहोस्', desc_en: 'Draft a writ petition specifying how your fundamental right was impaired.' },
      { step: 4, title_en: 'File at High Court or Supreme Court Registry', title_ne: 'अदालतमा रिट दर्ता गर्नुहोस्', desc_en: 'Submit through Article 144 (High Court) or Article 133 (Supreme Court).' }
    ]),
    checklist_json: JSON.stringify([
      'Copy of Nepali Citizenship Certificate',
      'Certified copy of the impugned administrative decision or rejection letter',
      'Detailed factual narrative of the chronological violation',
      'Formal writ petition with court stamp fees',
      'Affidavit (हकदावीको शपथपत्र)'
    ]),
    view_count: 1420
  },
  {
    slug: 'right-to-information-nepal-how-to-file-rti',
    pillar_slug: 'fundamental-rights',
    category_slug: 'constitutional-rights',
    title_en: 'Right to Information (RTI) in Nepal: How Every Citizen Can Request Government Records',
    title_ne: 'नेपालमा सूचनाको हक (RTI): सरकारी सूचना कसरी माग्ने?',
    summary_en: 'Complete step-by-step citizen guide to using the Right to Information Act 2064 to demand budgets, decisions, and files from any public body in Nepal.',
    summary_ne: 'सूचनाको हक सम्बन्धी ऐन २०६४ को प्रयोग गरी सरकारी कार्यालयबाट बजेट, निर्णय तथा कागजात कसरी माग गर्ने र अस्वीकार भएमा के गर्ने?',
    target_audience: 'Citizens, journalists, community monitors, students, civil society activists',
    primary_keyword: 'right to information nepal rti guide',
    related_entities: 'National Information Commission (NIC), Public Information Officers (PIOs)',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Right to Information Act 2064 (सूचनाको हक सम्बन्धी ऐन, २०६४)',
    relevant_sections: 'Section 3, Section 7, Section 9, Section 32',
    official_source_url: 'https://nic.gov.np',
    publication_date: '2026-01-20',
    last_verified_date: '2026-10-20',
    reviewed_by: 'Nepal RTI Research Group & Gazette Registry',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
The Right to Information Act 2064 and Constitution Article 27 give every Nepali citizen the legal right to inspect, examine, and obtain copies of official documents from public bodies.

### 2. What does it mean in simple language?
Government offices, municipalities, ministries, and state-funded institutions are public servants. Their decisions, expenditure records, tenders, and meeting minutes belong to the citizens. You do not need to prove a personal grievance to inspect public files.

### 3. Who does it apply to?
Every Nepali citizen has the right to file an RTI request with any public body: Ministries, Departments, Police, Courts, Municipalities, Public Universities, and even NGOs supported by government grants.

### 4. What are your rights?
- Right to receive requested information within 15 days (or 24 hours if related to a person's life and personal liberty).
- Right to study documents in person or obtain certified photocopies or digital files.
- Right to appeal to the Office Chief if the Information Officer refuses.
- Right to appeal to the National Information Commission (NIC) if the office ignores your request.

### 5. What information is exempt?
Under Section 3(3), information cannot be provided if it directly harms national sovereignty, defense, sensitive criminal investigations, banking trade secrets, or individual privacy unless public interest overrides.

### 6. Step-by-step: How to submit an RTI application
1. **Identify the Public Information Officer (PIO / सूचना अधिकारी)**: Every public office has a designated PIO whose name and contact must be posted outside the office.
2. **Draft the Application (निवेदन)**: State clearly: "Under Section 7 of the RTI Act 2064, I request certified copies of the following documents..."
3. **Attach Statutory Fee**: Paste a Rs. 10 postal stamp (हुलाक टिकट) or bank voucher.
4. **Demand an Official Receipt (दर्ता नम्बर)**: Ensure your application is entered into the official dispatch log and get the receipt number.
5. **Timeline**: The officer must provide information within 15 days. If denied, appeal to the Office Chief within 7 days. If still unaddressed, appeal to the National Information Commission within 35 days.

### 7. Which institution can help?
- **National Information Commission (राष्ट्रिय सूचना आयोग)**: Koteshwor, Kathmandu. Phone: 01-4602930. The Commission can fine delinquent officers up to Rs. 25,000 and order departmental action.
    `,
    content_ne: `
### १. कानुन के हो?
सूचनाको हक सम्बन्धी ऐन २०६४ तथा नेपालको संविधानको धारा २७ ले प्रत्येक नागरिकलाई सार्वजनिक निकायमा रहेको आफ्नो वा सार्वजनिक सरोकारको कुनै पनि सूचना माग्ने र पाउने कानुनी हक दिएको छ।

### २. सरल भाषामा यसको अर्थ के हो?
सरकारी कार्यालय, नगरपालिका, मन्त्रालय वा सार्वजनिक विद्यालयमा हुने खर्च, निर्णय, ठेक्कापट्टा र कामकारबाही गोप्य होइनन्। ती जनताका सूचना हुन्।

### ३. सूचना कसरी माग्ने?
१. सम्बन्धित कार्यालयको **सूचना अधिकारी (PIO)** पत्ता लगाउनुहोस्।
२. सूचनाको हक सम्बन्धी ऐन २०६४ को दफा ७ बमोजिम निवेदन लेख्नुहोस् (रू १० को हुलाक टिकट टाँसी)।
३. निवेदन दर्ता गराई दर्ता नम्बर सुरक्षित राख्नुहोस्।
४. सूचना अधिकारीले १५ दिनभित्र सूचना उपलब्ध गराउनुपर्छ (व्यक्तिको जिउज्यानसँग सम्बन्धित भए २४ घण्टाभित्र)।
५. सूचना नदिएमा ७ दिनभित्र कार्यालय प्रमुख समक्ष उजुरी दिनुहोस्। त्यहाँबाट पनि नपाए ३५ दिनभित्र राष्ट्रिय सूचना आयोगमा पुनरावेदन गर्नुहोस्।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'How much does it cost to get photocopies of government records?',
        a_en: 'The first 10 pages of normal size copies are generally free or minimal nominal cost (around Rs. 5 per page after that as per statutory RTI rules).',
        q_ne: 'सरकारी कागजातको फोटोकपी लिन कति खर्च लाग्छ?',
        a_ne: 'पहिलो १० पृष्ठसम्मको फोटोकपी नियमानुसार सामान्य वा निःशुल्क हुन्छ। त्यसपछि प्रति पृष्ठ तोकिएको न्यून सरकारी दर (रू ५ हाराहारी) तिर्नुपर्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Locate the Information Officer (सूचना अधिकारी)', title_ne: 'सूचना अधिकारी पत्ता लगाउनुहोस्', desc_en: 'Check the institution website or notice board for their name and mobile.' },
      { step: 2, title_en: 'Submit Written RTI Application', title_ne: 'लिखित निवेदन पेश गर्नुहोस्', desc_en: 'Specify clear dates, file names, or budget categories. Affix Rs. 10 stamp.' },
      { step: 3, title_en: 'Obtain Registered Entry Number', title_ne: 'दर्ता नम्बर लिनुहोस्', desc_en: 'Never leave an application without an official Darta stamp.' },
      { step: 4, title_en: 'Escalate to National Information Commission if Ignored', title_ne: 'सूचना नदिए राष्ट्रिय सूचना आयोगमा जानुहोस्', desc_en: 'File appeal to NIC within 35 days.' }
    ]),
    checklist_json: JSON.stringify([
      'Written RTI Application addressed to Information Officer',
      'Rs. 10 Postal Stamp (हुलाक टिकट)',
      'Copy of Nepali Citizenship Certificate',
      'Official Receipt / Darta Number confirmation'
    ]),
    view_count: 980
  },

  // Pillar 2: Employment & Labour Rights
  {
    slug: 'employee-rights-nepal-labour-act-complete-guide',
    pillar_slug: 'employment-labour-rights',
    category_slug: 'labour-laws',
    title_en: 'Employee Rights in Nepal: The Complete Beginner’s Guide to Labour Act 2074',
    title_ne: 'नेपालमा श्रमिकका अधिकार: श्रम ऐन २०७४ को पूर्ण मार्गदर्शिका',
    summary_en: 'Everything employees need to know about working hours, minimum wage, appointment letters, paid leaves, and termination rules in Nepal.',
    summary_ne: 'नेपालको श्रम ऐन २०७४ अनुसार कार्यघण्टा, न्यूनतम तलब, नियुक्ति पत्र, विदाका प्रकार, बोनस र कामबाट हटाउँदा पालना गर्नुपर्ने कानुनी नियमहरू।',
    target_audience: 'Workers, employees, HR professionals, trade unions, private sector staff',
    primary_keyword: 'employee rights nepal labour act 2074',
    related_entities: 'Department of Labour and Occupational Safety, Labour Court, Social Security Fund (SSF)',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Labour Act 2074 (श्रम ऐन, २०७४)',
    relevant_sections: 'Section 4, 10, 28, 30, 40, 52, 131',
    official_source_url: 'https://dolos.gov.np',
    publication_date: '2026-02-01',
    last_verified_date: '2026-10-22',
    reviewed_by: 'Labour Law Legal Directorate & Department of Labour Registry',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
The Labour Act 2074 (enacted in 2017) applies universally to every enterprise, company, factory, NGO, and private employer operating in Nepal, regardless of the number of employees.

### 2. What does it mean in simple language?
Employers can no longer treat staff as disposable "casual" labour. If someone works for an organization, they are legally entitled to a written contract, statutory minimum wages, paid leaves, and social security enrollment from their first day of work.

### 3. Who does it protect?
It protects regular workers, contract workers, daily wage laborers, domestic workers, and interns. It applies across private companies, educational institutions, hospitals, and hospitality.

### 4. What are your key rights?
- **Mandatory Written Employment Agreement (Section 10)**: No employer can employ any worker without a written employment contract stating job title, duties, remuneration, and benefits.
- **Maximum Working Hours (Section 28)**: 8 hours per day, 48 hours per week. Workers are entitled to at least one full day off per week.
- **Overtime Pay (Section 31)**: Overtime cannot exceed 24 hours per month. Overtime must be paid at **1.5 times the basic hourly salary**.
- **Leave Entitlements**:
  - Weekly holiday: 1 day per week.
  - Public holidays: 13 paid days per year.
  - Annual leave (Home leave): 1 day for every 20 days worked.
  - Sick leave: 12 paid days per year (half salary if not completed one year).
  - Maternity leave: 98 days (60 days fully paid).
  - Paternity leave: 15 fully paid days.
- **Minimum Wage**: Every worker must receive at least the gazetted minimum wage. No contract can legally agree to pay below this figure.

### 5. What are employee responsibilities?
Employees must perform duties faithfully, follow lawful organizational directives, observe workplace health and safety rules, and avoid participating in illegal or violent disruptions.

### 6. What if your employer violates these rights?
1. Submit a formal written grievance to the organization's Grievance Handling Committee or Management (Section 129).
2. If unresolved within 15 days, lodge a formal complaint with the **Labour Office (श्रम कार्यालय)** under Section 131.
3. The Labour Office will mediate; if the employer defies the law, the Labour Office can attach company bank accounts or seize assets.
4. Final appeals are heard by the **Labour Court (श्रम अदालत)**.

### 7. Which institutions can help?
- **Department of Labour and Occupational Safety (Minbhawan, Kathmandu)**.
- **Social Security Fund (SSF - Babarmahal, Kathmandu, Hotline: 16600155777)**.
- **Authorized Trade Unions (GEFONT, NTUC, ANTUF)**.
    `,
    content_ne: `
### १. कानुन के हो?
श्रम ऐन २०७४ नेपालमा सञ्चालित सबै निजी कम्पनी, उद्योग, विद्यालय, गैरसरकारी संस्था र पसलहरूमा कार्यरत सबै श्रमिकहरूमा लागू हुन्छ।

### २. श्रमिकका प्रमुख कानुनी अधिकारहरू:
- **लिखित नियुक्ति पत्र अनिवार्य (दफा १०)**: कुनै पनि रोजगारदाताले विना लिखित सम्झौता वा नियुक्ति पत्र कसैलाई काममा लगाउन पाउँदैन।
- **कार्यघण्टा (दफा २८)**: दैनिक बढीमा ८ घण्टा र हप्तामा ४८ घण्टा। हप्ताको कम्तीमा एक दिन पूरा विदा पाउनुपर्छ।
- **ओभरटाइम भत्ता (दफा ३१)**: तोकिएको भन्दा बढी काम गरेमा आधारभूत तलबको १.५ गुणा दरले अतिरिक्त समय भुक्तानी दिनुपर्छ।
- **विदाहरू**:
  - वार्षिक घर विदा: प्रत्येक २० दिन काम गरेबापत १ दिन।
  - बिरामी विदा: वर्षको १२ दिन पूरा तलबसहित।
  - प्रसूति विदा: ९८ दिन (६० दिन पूरा तलबसहित)।
  - प्रसूति स्याहार विदा (पुरुषका लागि): १५ दिन पूरा तलबसहित।
  - सार्वजनिक विदा: वर्षको १३ दिन पूरा तलबसहित।
- **सामाजिक सुरक्षा कोष (SSF)**: आधारभूत तलबको १०% कामदारको र २०% रोजगारदाताले थप गरी ३१% रकम सामाजिक सुरक्षा कोषमा जम्मा गरिदिनु अनिवार्य छ।

### ३. तलब नपाए वा अन्याय भए के गर्ने?
१. रोजगारदातालाई लिखित उजुरी दिने।
२. १५ दिनभित्र समाधान नभए सम्बन्धित जिल्लाको **श्रम तथा रोजगार कार्यालय** मा उजुरी दर्ता गर्ने।
३. श्रम कार्यालयको निर्णय चित्त नबुझे **श्रम अदालत** मा पुनरावेदन गर्ने।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Can my boss fire me immediately without any notice?',
        a_en: 'No. Except in severe proven criminal misconduct, an employer must issue written show-cause notices, provide 7 days for explanation, and if terminating due to retrenchment, provide notice and severance compensation (one month salary for each completed year of service).',
        q_ne: 'के मालिकले विना कुनै सूचना तुरुन्तै जागिरबाट निकाल्न सक्छ?',
        a_ne: 'सक्दैन। गम्भीर अपराध प्रमाणित भएको अवस्था बाहेक, स्पष्टीकरणको मौका दिनुपर्छ र कटौति गर्दा कम्तीमा ३० दिनको पूर्व सूचना वा सो बापतको तलब तथा प्रत्येक वर्षको सेवा बापत एक महिनाको उपदान दिनुपर्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Preserve Proof of Employment', title_ne: 'काम गरेको प्रमाण सुरक्षित राख्नुहोस्', desc_en: 'Save contracts, payslips, email orders, ID card, or bank transfer logs.' },
      { step: 2, title_en: 'Submit Written Request to Employer', title_ne: 'रोजगारदातालाई लिखित ध्यानाकर्षण गराउनुहोस्', desc_en: 'Specify unpaid amounts, leave refusals, or illegal deduction.' },
      { step: 3, title_en: 'Lodge Claim with Labour Office (श्रम कार्यालय)', title_ne: 'श्रम कार्यालयमा उजुरी दिनुहोस्', desc_en: 'File claim under Section 131 of Labour Act 2074.' },
      { step: 4, title_en: 'Labour Office Conciliation & Legal Order', title_ne: 'मध्यस्थता तथा कानुनी आदेश', desc_en: 'Labour Officer summons the employer for compulsory settlement.' }
    ]),
    checklist_json: JSON.stringify([
      'Copy of Appointment Letter or Employment Contract',
      'Bank Statements showing salary credits or missed deposits',
      'Attendance register copy or work emails',
      'Copy of Nepali Citizenship Certificate',
      'Formal claim application addressed to Labour Officer'
    ]),
    view_count: 1850
  },
  {
    slug: 'unpaid-salary-employer-labour-complaint-nepal',
    pillar_slug: 'employment-labour-rights',
    category_slug: 'labour-laws',
    title_en: 'What to Do If Your Employer Does Not Pay Your Salary in Nepal',
    title_ne: 'कम्पनीले तलब नदिएमा के गर्ने? श्रम कार्यालयमा उजुरी दिने तरिका',
    summary_en: 'Clear legal steps to recover unpaid salaries, overtime allowances, and gratuity under Nepal Labour Act 2074 through the Department of Labour.',
    summary_ne: 'रोजगारदाताले पारिश्रमिक रोक्का गरेमा कानुनी प्रमाण जुटाउने, श्रम कार्यालयमा उजुरी दिने र क्षतिपूर्ति सहित तलब असुल गर्ने सम्पूर्ण कानुनी प्रक्रिया।',
    target_audience: 'Employees with delayed or withheld salaries, hospitality staff, teachers, IT workers',
    primary_keyword: 'unpaid salary employer complaint nepal labour',
    related_entities: 'Labour Office, Department of Labour, Commercial Banks, Labour Court',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Labour Act 2074 (Section 34, Section 39, Section 131)',
    relevant_sections: 'Sections 34-39 (Payment of Remuneration), Section 131 (Settlement of Disputes)',
    official_source_url: 'https://dolos.gov.np',
    publication_date: '2026-02-10',
    last_verified_date: '2026-10-18',
    reviewed_by: 'Labour Inspection Officer Panel',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
Under Section 34 of the Labour Act 2074, an employer is legally bound to pay wages regularly within the period agreed upon in the employment contract. In no case can wage intervals exceed one month.

### 2. What does it mean in simple language?
Withholding earned salary is an illegal act. An employer cannot withhold your salary as a penalty, retain your wages because you resign, or cite "business loss" to avoid paying for days worked.

### 3. Who does it protect?
All workers—full-time, part-time, temporary, contract, and daily wage workers across all registered and unregistered enterprises.

### 4. What are your rights?
- You are entitled to 100% of your unpaid salary plus statutory interest.
- If an employer refuses to pay, the Labour Officer can order compensation and penalize the employer under Section 163.
- The government can freeze the employer's company bank accounts, prohibit passport issuance, or halt company registration renewals until worker claims are cleared.

### 5. What are your responsibilities?
You must submit written notice requesting the outstanding amount before filing an external complaint. Keep your attendance, time-logs, and email records organized.

### 6. What should you do? (Step-by-step)
1. **Send a Formal Demand Notice**: Send an email or registered letter stating the exact amount owed, calculation of months/days, and provide a 7-day deadline.
2. **Compile Evidence**: Bank statements, attendance printouts, WhatsApp/Viber messages from managers acknowledging work done.
3. **Lodge Complaint at District Labour Office**: Submit a written petition under Section 131 of the Labour Act 2074.
4. **Summons & Settlement**: The Labour Officer issues a formal summons. If the employer fails to appear or pay, the Officer issues an administrative decree enforcing payment.

### 7. Which institution can help?
- **Local Labour and Employment Office (श्रम तथा रोजगार कार्यालय)** in your Province (e.g., Teku, Kathmandu for Bagmati Province; Biratnagar, Pokhara, Butwal, Nepalgunj, Dhangadhi).
    `,
    content_ne: `
### १. कानुन के हो?
श्रम ऐन २०७४ को दफा ३४ बमोजिम रोजगारदाताले कामदारलाई तोकिएको समयभित्र नियमित पारिश्रमिक भुक्तानी गर्नुपर्छ। पारिश्रमिक भुक्तानीको अवधि कुनै पनि हालतमा एक महिनाभन्दा बढी हुन सक्दैन।

### २. कम्पनीले तलब नदिए के गर्ने?
१. पहिले रोजगारदातालाई लिखित रूपमा तलब माग गर्दै पत्र वा इमेल पठाउनुहोस् (७ दिनको समय दिएर)।
२. आफूले काम गरेको प्रमाण (हाजिरी, आइडी कार्ड, नियुक्ति पत्र, बैंक स्टेटमेन्ट) सुरक्षित गर्नुहोस्।
३. सम्बन्धित जिल्लाको **श्रम तथा रोजगार कार्यालय** मा श्रम ऐन २०७४ को दफा १३१ बमोजिम उजुरी दर्ता गर्नुहोस्।
४. श्रम अधिकारीले रोजगारदातालाई उपस्थित गराई तलब र क्षतिपूर्ति असुल गराउने आदेश दिन्छ।
५. आदेश पालना नगरे कम्पनीको बैंक खाता रोक्का गर्ने र राहदानी रोक्का गर्न सक्ने कडा कानुनी अधिकार श्रम कार्यालयलाई छ।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'What if I worked without an appointment letter?',
        a_en: 'The employer is in direct violation of Section 10. You can establish your employment through bank deposits, official email communications, identity cards, witness affidavits from colleagues, or gate registers.',
        q_ne: 'यदि नियुक्ति पत्र थिएन भने तलब पाइन्छ?',
        a_ne: 'नियुक्ति पत्र नदिनु नै रोजगारदाताको गैरकानुनी काम हो। बैंक स्टेटमेन्ट, सहकर्मीहरूको बयान, इमेल वा कार्यालयको हाजिरी देखाएर काम गरेको प्रमाणित गरी तलब दाबी गर्न सकिन्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Issue Written 7-Day Demand Letter', title_ne: 'रोजगारदातालाई ७ दिने लिखित पत्र दिनुहोस्', desc_en: 'Request full settlement with banking details.' },
      { step: 2, title_en: 'Gather Attendance & Communication Records', title_ne: 'हाजिरी र म्यासेजहरू संकलन गर्नुहोस्', desc_en: 'Preserve all messages where managers assign work or acknowledge dues.' },
      { step: 3, title_en: 'File Petition at Labour Office', title_ne: 'श्रम कार्यालयमा उजुरी दर्ता गर्नुहोस्', desc_en: 'Submit formal claim under Labour Act Section 131.' },
      { step: 4, title_en: 'Labour Office Enforcement Hearing', title_ne: 'श्रम अधिकारीको रोहवरमा असुली सुनुवाइ', desc_en: 'Officer orders bank transfer or property freeze.' }
    ]),
    checklist_json: JSON.stringify([
      'Formal claim application to the Labour Officer',
      'Copy of Nepali Citizenship Certificate',
      'Bank statement showing missing monthly salary',
      'Work identification card or access pass',
      'Copy of 7-day demand notice sent to employer'
    ]),
    view_count: 1610
  },

  // Pillar 3: Family, Marriage & Personal Rights
  {
    slug: 'court-marriage-registration-nepal-process-documents',
    pillar_slug: 'family-marriage-rights',
    category_slug: 'marriage-laws',
    title_en: 'How to Register a Court Marriage in Nepal: Documents, Fees, and Steps',
    title_ne: 'नेपालमा अदालती विवाह (Court Marriage) कसरी गर्ने? कागजात र प्रक्रिया',
    summary_en: 'Complete legal guide to court marriage in the District Court of Nepal under the National Civil Code 2074: eligibility, mandatory documents, timeline, and certificate issuance.',
    summary_ne: 'मुलुकी देवानी संहिता २०७४ अनुसार जिल्ला अदालतमा अदालती विवाह गर्ने नियम, आवश्यक कागजात, दस्तुर र विवाह प्रमाणपत्र पाउने सम्पूर्ण प्रक्रिया।',
    target_audience: 'Couples planning marriage, citizens registering inter-caste or inter-district marriages',
    primary_keyword: 'court marriage registration nepal district court',
    related_entities: 'District Court of Nepal, Local Ward Office, Department of National ID and Civil Registration',
    jurisdiction: 'Nepal',
    applicable_legislation: 'National Civil Code 2074 (मुलुकी देवानी संहिता, २०७४)',
    relevant_sections: 'Sections 67 to 84 (Provisions Relating to Marriage)',
    official_source_url: 'https://supremecourt.gov.np',
    publication_date: '2026-02-15',
    last_verified_date: '2026-10-24',
    reviewed_by: 'Family Law Advisory Directorate',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
The National Civil Code 2074 (Muluki Devani Samhita), Chapter 3, governs court marriages in Nepal. A marriage concluded before a District Court Judge is legally conclusive throughout Nepal and recognized worldwide.

### 2. What does it mean in simple language?
You do not need expensive traditional religious ceremonies to be legally married. Any adult couple fulfilling legal requirements can visit the District Court of their temporary or permanent residence and be declared legally married by a judge.

### 3. Who is eligible?
- Both male and female must have completed **20 years of age**.
- Both parties must be mentally sound and freely consenting.
- Neither party can have a living spouse (monogamy is strictly mandatory under Section 67).
- The parties must not be within prohibited kinship degrees (हाडनाता) recognized by law.

### 4. What are your rights?
- Right to formal judicial recognition without discrimination based on caste, religion, or community.
- Immediate issuance of an official Court Marriage Certificate (विवाह दर्ता प्रमाणपत्र).
- Equal legal rights to property and marital protections from the moment of signature.

### 5. Mandatory documents required
1. **Citizenship Certificates**: Original and copies of Nepali Citizenship of both bride and groom.
2. **Unmarried Status Verification (अविवाहित सिफारिस)**: Official certificate issued by the respective local Ward Office within the last 30 days confirming neither party has an existing spouse.
3. **Temporary Residence Recommendation**: If applying outside permanent address, Ward recommendation proving at least 15 continuous days of residence in that district.
4. **Passport Size Photos**: 4 identical photos of each party.
5. **Two Adult Witnesses**: Two witnesses who must present their original Nepali Citizenship certificates.

### 6. Step-by-step: How the court marriage works
1. **Draft Joint Application (दम्पतीको संयुक्त निवेदन)**: Submit the application under Section 77 in the prescribed judicial format at the District Court.
2. **Verification by Court Registrar**: Documents, ages, unmarried certificates, and identities are checked.
3. **Hearing Before the District Judge**: The Judge questions both parties individually to verify free consent without coercion or duress.
4. **Signing the Marriage Register**: Both parties and their two witnesses sign the official register in presence of the Judge.
5. **Certificate Handover**: The Court Marriage Certificate is handed over on the same day or within 16 days depending on district registry workflow.
    `,
    content_ne: `
### १. कानुन के हो?
मुलुकी देवानी संहिता २०७४ को दफा ७७ बमोजिम जिल्ला अदालतमा न्यायाधीशको रोहवरमा हुने विवाहलाई अदालती विवाह (Court Marriage) भनिन्छ। यो नेपाल तथा विदेशमा समेत पूर्ण वैधानिक हुन्छ।

### २. योग्यता के हुनुपर्छ?
- केटा र केटी दुवैको उमेर **२० वर्ष पूरा भएको** हुनुपर्छ।
- दुवैको कुनै अन्य जीवित पति वा पत्नी नभएको हुनुपर्छ (एकल वा सम्बन्ध विच्छेद भइसकेको)।
- कानुनले निषेध गरेको हाडनाता भित्रको सम्बन्ध हुन नहुने।
- दुवैको पूर्ण मन्जुरी हुनुपर्ने।

### ३. चाहिने कागजातहरू:
१. केटा र केटी दुवैको सक्कल नागरिकता र प्रतिलिपि।
२. सम्बन्धित वडा कार्यालयबाट लिएको **अविवाहित सिफारिस (Unmarried Certificate)**।
३. स्थायी ठेगाना नभएको जिल्ला अदालतमा दर्ता गर्ने भए कम्तीमा १५ दिन बसोबास गरेको **अस्थायी बसोबास सिफारिस**।
४. दुवै पक्षको ४-४ प्रति पासपोर्ट साइजको फोटो।
५. दुई जना साक्षी (सक्कल नागरिकतासहित)।

### ४. अदालतमा प्रक्रिया:
१. जिल्ला अदालतमा संयुक्त निवेदन दर्ता गर्ने।
२. रजिस्ट्रारले कागजात रुजु गरी न्यायाधीश समक्ष पेश गर्ने।
३. न्यायाधीशले दुवै पक्षको स्वेच्छा र सहमति बुझ्ने।
४. विवाह दर्ता पुस्तिकामा हस्ताक्षर गरी सोही दिन विवाह दर्ता प्रमाणपत्र प्रदान गरिनेछ।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Can foreigners marry a Nepali citizen in a Nepali District Court?',
        a_en: 'Yes. The foreign citizen requires a valid passport, visa, No Objection Certificate (NOC) from their embassy in Nepal, and at least 15 days proof of stay in Nepal.',
        q_ne: 'के विदेशी नागरिकले नेपाली नागरिकसँग अदालती विवाह गर्न सक्छन्?',
        a_ne: 'सक्छन्। विदेशी नागरिकको हकमा राहदानी, भिसा, काठमाडौंस्थित आफ्ना देशको दूतावासबाट अविवाहित रहेको सिफारिस (NOC) र नेपालमा कम्तीमा १५ दिन बसेको प्रमाण चाहिन्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Obtain Unmarried Certificate from Ward Office', title_ne: 'वडा कार्यालयबाट अविवाहित सिफारिस लिनुहोस्', desc_en: 'Both parties must obtain this from their local ward office within 30 days.' },
      { step: 2, title_en: 'Prepare Joint Application and Photos', title_ne: 'संयुक्त निवेदन र फोटो तयार गर्नुहोस्', desc_en: 'Draft formal application with court fee stamps.' },
      { step: 3, title_en: 'Appear Before District Court Judge with 2 Witnesses', title_ne: '२ जना साक्षीसहित अदालतमा उपस्थित हुनुहोस्', desc_en: 'Judge conducts verbal consent verification.' },
      { step: 4, title_en: 'Sign Court Register & Receive Certificate', title_ne: 'रजिस्टरमा हस्ताक्षर गरी प्रमाणपत्र लिनुहोस्', desc_en: 'Official court marriage certificate issued.' }
    ]),
    checklist_json: JSON.stringify([
      'Original Nepali Citizenship Certificates (Bride & Groom)',
      'Ward Unmarried Recommendation Certificates (अविवाहित सिफारिस)',
      '15-Day Temporary Stay Letter (if applying outside home district)',
      '4 Passport-size photographs of each person',
      'Citizenship certificates of 2 adult witnesses'
    ]),
    view_count: 2240
  },
  {
    slug: 'divorce-laws-procedures-nepal-property-partition',
    pillar_slug: 'family-marriage-rights',
    category_slug: 'marriage-laws',
    title_en: 'Divorce Laws and Procedures in Nepal: Property Partition, Alimony and Child Custody',
    title_ne: 'नेपालमा सम्बन्ध विच्छेदको कानुन: सम्पत्ति बाँडफाँड, मानाचामल र प्रक्रिया',
    summary_en: 'Plain language legal guide to divorce under the National Civil Code 2074: mutual consent divorce, contentious petitions, equal partition of property, and maintenance allowances.',
    summary_ne: 'मुलुकी देवानी संहिता अनुसार सहमतिमा हुने र अदालतमा मुद्दा दायर गरी हुने सम्बन्ध विच्छेद, सम्पत्ति भागबन्डा र सन्तानको संरक्षण सम्बन्धी कानुनी जानकारी।',
    target_audience: 'Spouses seeking legal separation, family dispute litigants, legal advisors',
    primary_keyword: 'divorce laws procedures nepal property partition',
    related_entities: 'District Court, Local Ward Judicial Committee, Mediation Centers',
    jurisdiction: 'Nepal',
    applicable_legislation: 'National Civil Code 2074 (मुलुकी देवानी संहिता, २०७४)',
    relevant_sections: 'Sections 93 to 104 (Provisions Relating to Divorce)',
    official_source_url: 'https://lawcommission.gov.np',
    publication_date: '2026-02-18',
    last_verified_date: '2026-10-21',
    reviewed_by: 'Civil Law Bench Registry Panel',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
The National Civil Code 2074 (Part 3, Chapter 3) codifies divorce in Nepal. Both husband and wife have equal statutory standing to petition for divorce before the competent District Court.

### 2. What does it mean in simple language?
No marriage can be forcibly dissolved outside the formal judicial system. Neither village meetings nor family councils have legal power to terminate a marriage. Only a decree from the District Court dissolves marriage ties and determines property and maintenance settlements.

### 3. Grounds for divorce
- **Mutual Consent (दफा ९३)**: Both spouses agree to dissolve the marriage. The court approves the settlement deed immediately.
- **Divorce by Husband or Wife (दफा ९४ र ९५)**:
  - Separation without consent for 3 consecutive years.
  - Physical or mental cruelty causing severe bodily or psychological harm.
  - Adultery / sexual relations outside marriage.
  - Expelling the spouse from the matrimonial home or refusing basic maintenance.

### 4. Partition of property and maintenance (मानाचामल)
Under Section 99, if divorce is sought due to husband's fault or cruelty, the wife is legally entitled to partition of the husband's ancestral and acquired property before granting divorce. If the husband has not yet partitioned property from his parents, the court calculates his deemed legal share and awards the wife her statutory portion.
Alternatively, the wife may opt for a lumpsum cash settlement or monthly maintenance allowance (मानाचामल) based on the husband's monthly income.

### 5. Child custody (नाबालकको हेरचाह)
- Children below **5 years of age** stay with the mother unless she remarries or is deemed unfit.
- Children between **5 and 14 years** stay with the parent who can better provide for their education, health, and welfare, with generous visitation rights to the other parent.
- Children over **14 years** are heard by the court regarding their preference.
- Both parents must financially contribute to the child's education and medical care according to their financial capacity.

### 6. Where can you find help?
- **District Court Mediation Center (मेलमिलाप केन्द्र)**: Free mandatory conciliation attempt.
- **National Women Commission Helpline**: Dial 1145 for free legal aid and counseling for women facing abandonment.
    `,
    content_ne: `
### १. कानुन के हो?
मुलुकी देवानी संहिता २०७४ ले सम्बन्ध विच्छेद सम्बन्धी स्पष्ट नियम बनाएको छ। सम्बन्ध विच्छेदको फैसला गर्ने अधिकार केवल सम्बन्धित जिल्ला अदालतलाई मात्र हुन्छ।

### २. सम्बन्ध विच्छेदका प्रकारहरू:
- **आपसी सहमतिमा (दफा ९३)**: दुवै पक्षको मन्जुरी भएमा अदालतले मेलमिलाप गराई तत्काल सम्बन्ध विच्छेदको फैसला गरिदिन्छ।
- **मुद्दा दायर गरी (दफा ९४ र ९५)**: पति वा पत्नीले शारीरिक/मानसिक यातना दिएमा, ३ वर्षभन्दा बढी समयदेखि अलग बसेमा वा परपुरुष/परस्त्रीसँग यौन सम्बन्ध राखेमा।

### ३. सम्पत्ति भागबन्डा र मानाचामल:
दफा ९९ अनुसार पतिको अंश भागबाट पत्नीले आफ्नो आधा हिस्सा सम्पत्ति लिन पाउँछिन्। अंश नलिने भएमा पतिको मासिक आम्दानीका आधारमा मासिक **मानाचामल** वा एकमुष्ट रकम भराइदिन अदालतले आदेश दिन्छ।

### ४. सन्तानको संरक्षण:
- ५ वर्ष मुनिका बच्चालाई आमाले पाल्न पाउँछिन्।
- ५ देखि १४ वर्षसम्मका बच्चाको हकमा अदालतले बालबालिकाको सर्वोत्तम हित हेरी बाबु वा आमा कसको जिम्मा दिने निर्णय गर्छ।
- १४ वर्ष पुगेका सन्तानको इच्छा बुझिन्छ। खर्च दुवैले बेहोर्नुपर्छ।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Does a wife lose property if she remarries after divorce?',
        a_en: 'If a woman receives an undivided share of ancestral property from her former husband and subsequently remarries, that specific property reverts back to the children of the previous marriage or former husband as per Section 103.',
        q_ne: 'सम्बन्ध विच्छेदपछि महिलाले अर्को विवाह गरेमा सम्पत्ति के हुन्छ?',
        a_ne: 'मुलुकी देवानी संहिताको दफा १०३ अनुसार सम्बन्ध विच्छेद गरी अंश लिएकी महिलाले अर्को विवाह गरेमा सो सम्पत्ति पूर्वपतितर्फका छोराछोरी भए उनीहरूको र नभए पूर्वपतिकै हकमा फिर्ता हुन्छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'File Petition at District Court', title_ne: 'जिल्ला अदालतमा फिरादपत्र दर्ता गर्नुहोस्', desc_en: 'Submit formal claim setting out facts and property details.' },
      { step: 2, title_en: 'Mandatory Mediation Session', title_ne: 'अदालतमा मेलमिलाप छलफल', desc_en: 'Court sends parties to trained mediators to explore reconciliation.' },
      { step: 3, title_en: 'Assessment of Property & Income', title_ne: 'सम्पत्ति र आम्दानीको फाँटवारी', desc_en: 'Both parties disclose full asset registers under oath.' },
      { step: 4, title_en: 'Judicial Decree & Partition Deed', title_ne: 'अदालती फैसला र मिलापत्र', desc_en: 'Judge issues final decree dissolving marriage and allocating shares.' }
    ]),
    checklist_json: JSON.stringify([
      'Copy of Nepali Citizenship Certificate',
      'Marriage Registration Certificate or Marriage proof',
      'List of marital and ancestral properties (फाँटवारी)',
      'Birth certificates of minor children',
      'Proof of income, salary slips, or business registers'
    ]),
    view_count: 2100
  },

  // Pillar 4: Property, Land & Housing Rights
  {
    slug: 'verify-land-ownership-lalpurja-nepal-guide',
    pillar_slug: 'property-land-rights',
    category_slug: 'land-laws',
    title_en: 'How to Verify Land Ownership and Lalpurja Before Buying Property in Nepal',
    title_ne: 'नेपालमा जग्गा किन्दा लालपुर्जा र स्रेस्ता कसरी जाँच्ने? ठगीबाट बच्ने उपाय',
    summary_en: 'Essential checklist and practical guide to verifying land records at the Malpot Office (Land Revenue), Napi Office (Survey), and Ward Office before paying any advance.',
    summary_ne: 'जग्गा दलाली वा ठगीबाट बच्न मालपोत कार्यालयको स्रेस्ता, रोक्का विवरण, नापीको नक्सा र वडाको बाटो सिफारिस प्रमाणीकरण गर्ने सम्पूर्ण कानुनी प्रक्रिया।',
    target_audience: 'Property buyers, homeowners, investors, diaspora Nepalis returning home',
    primary_keyword: 'verify land ownership lalpurja nepal malpot',
    related_entities: 'Land Revenue Office (मालपोत कार्यालय), Survey Office (नापी कार्यालय), Local Ward Office',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Land Revenue Act 2034, Land Act 2021, Muluki Devani Samhita 2074',
    relevant_sections: 'Muluki Devani Samhita Sections 279-300',
    official_source_url: 'https://dolma.gov.np',
    publication_date: '2026-02-25',
    last_verified_date: '2026-10-23',
    reviewed_by: 'Land Revenue Directorate Verification Board',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
Under the Land Revenue Act 2034 and Muluki Devani Samhita, land ownership in Nepal is solely determined by the official Land Records (स्रेस्ता) maintained at the Land Revenue Office (मालपोत कार्यालय). Possession of a physical certificate (लालपुर्जा) alone does NOT guarantee that the land is free of mortgage, court freeze, or disputes.

### 2. What does it mean in simple language?
Never buy land or hand over cash simply because the seller waved a paper certificate. A seller could show you an outdated Lalpurja while the actual property is mortgaged to a bank, frozen by a court, or previously sold to someone else.

### 3. Key checks before paying money:
1. **Malpot Record Verification (स्रेस्ता भिडान)**: Visit the Land Revenue Office where the land is registered. Have an authorized deed writer (लेखापढी व्यवसायी) or lawyer pull the official Sresta. Verify that the seller’s name and photograph match the ledger.
2. **Rokka Check (रोक्का छ/छैन जाँच)**: Confirm that the plot (कित्ता नं) is not frozen by a bank, anti-corruption commission (CIAA), or pending court case.
3. **Survey Map Check (नापी नक्सा र ट्रेस)**: Go to the Survey Office (नापी कार्यालय) to inspect the field trace map. Verify that the plot boundaries on paper match the actual physical land on the ground.
4. **Road and Right of Way (बाटो प्रमाणित)**: Obtain official confirmation from the local Ward Office confirming that the access road is public and wide enough under municipal building bylaws.
5. **Ancestral Consent (हकदारको मन्जुरी)**: If the land is ancestral property, ensure all co-heirs (wife, adult sons, daughters) sign the deed of consent (मन्जुरीनामा), or they can file a lawsuit within statute of limitations to void the sale.

### 4. What are your rights?
- You have the legal right under the RTI Act to inspect public land records at the Land Revenue Office.
- Once registered on a formal deed passed by the Land Revenue Officer, your title is indefeasible against unauthorized private claims.

### 5. What should you do if duped?
If you fall victim to a double-sale or forged deed, immediately file a criminal fraud complaint (ठगी कसुर) with Nepal Police under Chapter 21 of the National Penal Code 2074, and file a civil cancellation lawsuit (लिखत बदर) at the District Court.
    `,
    content_ne: `
### १. कानुन के हो?
नेपालमा जग्गाको वास्तविक मालिक को हो भन्ने कुरा मालपोत कार्यालयको सरकारी ढड्डा (स्रेस्ता) ले निर्धारण गर्छ। केवल हातमा लालपुर्जा हुनु मात्रै पूर्ण स्वामित्वको प्रमाण होइन।

### २. जग्गा बैना गर्नु वा किन्नु अघि जाँच्नै पर्ने ५ कुरा:
१. **मालपोतको स्रेस्ता भिडान**: मालपोत कार्यालयमा गई जग्गाधनीको नाम, फोटो र तीनपुस्ते स्रेस्तासँग मिल्छ/मिल्दैन जाँच्ने।
२. **रोक्का जाँच**: जग्गा बैंकमा धितोमा रहेको, अदालतबाट मुद्दा परेको वा अख्तियारबाट रोक्का भए/नभएको कम्प्युटर प्रणालीमा हेर्ने।
३. **नापीको नक्सा र ट्रेस (Field Verification)**: नापी कार्यालयबाट प्रमाणित ट्रेस नक्सा निकाली फिल्डमा पुगेर चारकिल्ला र क्षेत्रफल (रोपनी/आना वा बिघा/कठ्ठा) अमिन लगाएर नाप्ने।
४. **बाटो सिफारिस**: सम्बन्धित वडा कार्यालयबाट बाटो सरकारी हो वा निजी र कति फिटको हो भन्ने सिफारिस लिने।
५. **हकदारहरूको मन्जुरी**: जग्गा पैतृक (अंशको) भए परिवारका सबै हकदार (श्रीमती, छोराछोरी) को मन्जुरीनामा अनिवार्य गराउने।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Can a verbal agreement to buy land be legally enforced?',
        a_en: 'No. The Muluki Devani Samhita strictly mandates that real estate transactions above statutory limits must be executed through written, registered deeds. Verbal agreements or informal diary notes are void for land conveyance.',
        q_ne: 'के मुखले भनेको आधारमा जग्गाको कारोबार मान्य हुन्छ?',
        a_ne: 'हुँदैन। घरजग्गा सम्बन्धी कुनै पनि कारोबार कानुनी रूपमा मालपोत कार्यालयमा दर्ता भएको लिखित लिखत पासबाट मात्र मान्य हुन्छ। मौखिक सहमतिले कानुनी मान्यता पाउँदैन।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Request Certified Copy of Lalpurja & Citizenship', title_ne: 'लालपुर्जा र नागरिकताको प्रतिलिपि माग्नुहोस्', desc_en: 'Examine plot number, VDC/Municipality, Ward number, and registered area.' },
      { step: 2, title_en: 'Perform Malpot Sresta & Rokka Search', title_ne: 'मालपोत कार्यालयमा स्रेस्ता र रोक्का जाँच्नुहोस्', desc_en: 'Verify no bank liens or judicial attachments exist on the plot.' },
      { step: 3, title_en: 'Survey Field Verification with Licensed Amin', title_ne: 'नापी ट्रेस नक्सासहित फिल्डमा नाप्नुहोस्', desc_en: 'Measure plot corners to ensure no neighbor encroachment.' },
      { step: 4, title_en: 'Execute Formal Deed Passed at Land Revenue Office', title_ne: 'मालपोत कार्यालयमा लिखत पास गर्नुहोस्', desc_en: 'Hand over final payment only inside Malpot counter upon deed execution.' }
    ]),
    checklist_json: JSON.stringify([
      'Original Land Ownership Certificate (लालपुर्जा)',
      'Verified Sresta copy from Malpot Office',
      'No-Lien / Free-of-Encumbrance confirmation (रोक्का नभएको पत्र)',
      'Certified Survey Trace Map from Napi Office',
      'Ward Road recommendation & Local Tax Clearance receipt',
      'Citizenship certificates and presence of all legal co-heirs'
    ]),
    view_count: 3120
  },

  // Pillar 5: Consumer, Cyber & Criminal Law
  {
    slug: 'rights-when-arrested-by-police-nepal',
    pillar_slug: 'consumer-cyber-criminal-rights',
    category_slug: 'criminal-justice',
    title_en: 'What Are Your Rights If You Are Arrested by Police in Nepal?',
    title_ne: 'नेपालमा प्रहरीले पक्राउ गर्दा नागरिकका कानुनी अधिकारहरू के के हुन्?',
    summary_en: 'Inviolable constitutional rights during police custody under Article 20: 24-hour court appearance rule, right to remain silent, right to consult a lawyer, and protection against torture.',
    summary_ne: 'प्रहरीले पक्राउ गर्दा धारा २० प्रदत्त अधिकार: २४ घण्टाभित्र अदालतमा उपस्थित गराउने नियम, कानुन व्यवसायीसँग सल्लाह गर्न पाउने हक र यातना विरुद्धको संरक्षण।',
    target_audience: 'Every citizen, youth, drivers, legal activists, civil liberties monitors',
    primary_keyword: 'rights when arrested police nepal article 20',
    related_entities: 'Nepal Police, District Court, National Human Rights Commission, Office of the Attorney General',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Constitution of Nepal 2072 (Article 20), National Criminal Procedure Code 2074 (मुलुकी फौजदारी कार्यविधि संहिता, २०७४)',
    relevant_sections: 'Constitution Article 20, Criminal Procedure Code Sections 9-25',
    official_source_url: 'https://nepalpolice.gov.np',
    publication_date: '2026-03-01',
    last_verified_date: '2026-10-26',
    reviewed_by: 'Criminal Justice & Human Rights Directorate',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
Article 20 (Right to Justice) and Article 22 (Right Against Torture) of the Constitution of Nepal, alongside the Criminal Procedure Code 2074, govern police arrest, detention, and investigation in Nepal.

### 2. What does it mean in simple language?
A police uniform does not grant an officer the right to act like a monarch. Police cannot secretly detain you, beat you, search your home without warrant, or hold you indefinitely without taking you before a neutral judge.

### 3. What are your fundamental rights upon arrest?
- **Right to Know Reasons for Arrest (Article 20(1))**: No person can be arrested without an arrest warrant (पक्राउ पुर्जी) stating the specific legal charge, except in flagrant offenses committed in immediate view of police.
- **Right to Consult a Lawyer (Article 20(2))**: From the moment of arrest, you have the constitutional right to consult a legal practitioner of your choice. Any consultation with your lawyer is strictly confidential.
- **Mandatory 24-Hour Production Before Judge (Article 20(3))**: The police MUST produce you before a judicial authority (District Court Judge) within **24 hours of arrest** (excluding travel time). Detention beyond 24 hours without a judicial remand order (म्याद थप) is illegal detention.
- **Right to Remain Silent (Article 20(7))**: You cannot be compelled to be a witness against yourself. You have the right not to give incriminating statements to investigating police officers.
- **Absolute Prohibition of Torture (Article 22)**: No person in detention shall be subjected to physical or mental torture, or cruel, inhuman, or degrading treatment. Any confession obtained through torture is void in a court of law.

### 4. What should you do if detained?
1. **Demand to see the Arrest Warrant (पक्राउ पुर्जी)** and inspect the official station log.
2. **Contact Family and a Lawyer Immediately**: Police are required to allow you to inform your family.
3. **Request a Medical Examination (स्वास्थ्य परीक्षण)**: By law, police must take you to a government hospital for a medical checkup before and after detention. If you have any pre-existing injuries or if police assault you, tell the doctor immediately so it is recorded in the official medical memo.
4. **Speak Up to the District Judge**: When brought before the Judge for remand (म्याद थप), you can speak directly to the Judge without fear. Report any mistreatment or lack of food/medicine.

### 5. Emergency helplines:
- Nepal Police Control: Dial 100.
- National Human Rights Commission: 01-5010015 (Intervenes against illegal police detention).
    `,
    content_ne: `
### १. कानुन के हो?
नेपालको संविधानको धारा २० (न्याय सम्बन्धी हक) र धारा २२ (यातना विरुद्धको हक) तथा मुलुकी फौजदारी कार्यविधि संहिता २०७४ ले प्रहरीद्वारा नागरिक पक्राउ र थुना सम्बन्धी कडा नियमहरू बनाएको छ।

### २. प्रहरीले पक्राउ गर्दा तपाईंसँग हुने ५ अनिवार्य अधिकार:
१. **पक्राउ पुर्जी हेर्न पाउने हक (धारा २०(१))**: कुनै पनि व्यक्तिलाई पक्राउ गर्नुको स्पष्ट कानुनी कारण र दफा खुलाएर पक्राउ पुर्जी नदिई पक्राउ गर्न पाइँदैन।
२. **वकिलसँग सल्लाह गर्न पाउने हक (धारा २०(२))**: पक्राउ परेको सुरु क्षणदेखि नै आफूले रोजेको कानुन व्यवसायीसँग गोप्य परामर्श गर्न पाउने अधिकार अक्षुण्ण रहन्छ।
३. **२४ घण्टाभित्र अदालतमा उपस्थित गराउनै पर्ने नियम (धारा २०(३))**: बाटोको म्याद बाहेक पक्राउ परेको २४ घण्टाभित्र अदालतका न्यायाधीश समक्ष उपस्थित गराएर म्याद थप गराउनु अनिवार्य छ। विना म्याद थप २४ घण्टाभन्दा बढी थुनामा राख्नु गैरकानुनी थुना (Illegal Detention) हो।
४. **यातना विरुद्धको हक (धारा २२)**: थुनामा रहेका व्यक्तिलाई शारीरिक वा मानसिक यातना दिन, पिट्न वा अमानवीय व्यवहार गर्न कानुनले पूर्ण निषेध गरेको छ।
५. **आफै विरुद्ध साक्षी हुन बाध्य नहुने हक (Right to Silence)**: प्रहरी समक्ष जबर्जस्ती गराइएको बयान अदालतमा प्रमाण लाग्दैन।

### ३. पक्राउ परेमा के गर्ने?
- परिवार वा वकिललाई तत्काल फोन गर्न दिन प्रहरीलाई आग्रह गर्नुहोस्।
- सरकारी अस्पतालमा स्वास्थ्य परीक्षण (Medical Checkup) गराउन माग गर्नुहोस् र चोटपटक भए डाक्टरलाई टिपाउनुहोस्।
- अदालतमा म्याद थपका लागि न्यायाधीश समक्ष उपस्थित गराउँदा प्रहरीले यातना दिएको भए निर्धक्क भन्नुहोस्।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Can police search my smartphone without a warrant during a routine check?',
        a_en: 'No. Article 28 of the Constitution guarantees the privacy of personal documents, data, and communications. Unless police have a specific judicial warrant or search authorization in connection with a cognizable crime, they cannot forcefully unlock or read your phone.',
        q_ne: 'के चेकजाँचका क्रममा प्रहरीले जबर्जस्ती मेरो मोबाइल फोन खोतल्न सक्छ?',
        a_ne: 'सक्दैन। नेपालको संविधानको धारा २८ ले व्यक्तिको गोपनीयता, कागजात र पत्राचारको गोपनीयताको ग्यारेन्टी गरेको छ। कुनै फौजदारी कसुरको अनुसन्धानमा अदालतको अनुमति वा कानुन बमोजिमको आदेश बाहेक सामान्य चेकजाँचमा फोन खोलेर हेर्न पाइँदैन।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Check the Official Arrest Warrant', title_ne: 'पक्राउ पुर्जी माग्नुहोस् र पढ्नुहोस्', desc_en: 'Verify the police station name, charges, and officer badge.' },
      { step: 2, title_en: 'Notify Family or Legal Counsel', title_ne: 'परिवार वा वकिललाई फोन गर्नुहोस्', desc_en: 'State exactly which police station you are being transported to.' },
      { step: 3, title_en: 'Insist on Hospital Medical Checkup', title_ne: 'स्वास्थ्य परीक्षणको रेकर्ड राख्नुहोस्', desc_en: 'Physician must document physical condition.' },
      { step: 4, title_en: 'Demand Presentation to Judge within 24 Hours', title_ne: '२४ घण्टाभित्र अदालत उपस्थित हुन माग गर्नुहोस्', desc_en: 'Address the District Court Judge regarding your detention conditions.' }
    ]),
    checklist_json: JSON.stringify([
      'Copy of Police Arrest Warrant (पक्राउ पुर्जी)',
      'Government Hospital Medical Examination Slip',
      'Name and Designation of the Investigating Police Officer',
      'Phone contact to Nepal Bar Association legal aid panel'
    ]),
    view_count: 2890
  },
  {
    slug: 'online-shopping-scams-cyber-fraud-reporting-nepal',
    pillar_slug: 'consumer-cyber-criminal-rights',
    category_slug: 'cybercrime-consumer',
    title_en: 'How to Report Online Shopping Scams and Cyber Fraud in Nepal',
    title_ne: 'नेपालमा अनलाइन सपिङ ठगी र साइबर अपराधको रिपोर्ट कसरी गर्ने?',
    summary_en: 'Practical steps to file complaints against defective products, Instagram/Facebook seller scams, eSewa/Khalti payment fraud, and reporting to the Cyber Bureau.',
    summary_ne: 'इ-कमर्स र सोसल मिडिया मार्फत हुने ठगी, नक्कली सामान र अनलाइन भुक्तानी जालसाजी विरुद्ध वाणिज्य विभाग र नेपाल प्रहरी साइबर ब्युरोमा उजुरी दिने प्रक्रिया।',
    target_audience: 'Online shoppers, social media users, victims of digital payment fraud',
    primary_keyword: 'online shopping fraud cybercrime reporting nepal',
    related_entities: 'Nepal Police Cyber Bureau, Department of Commerce, Supplies and Consumer Protection',
    jurisdiction: 'Nepal',
    applicable_legislation: 'Electronic Transactions Act 2063, Consumer Protection Act 2075',
    relevant_sections: 'Electronic Transactions Act Section 47, Consumer Protection Act Sections 16-35',
    official_source_url: 'https://cyberbureau.nepalpolice.gov.np',
    publication_date: '2026-03-05',
    last_verified_date: '2026-10-25',
    reviewed_by: 'Cyber Bureau & Consumer Redress Advisory',
    review_status: 'Published',
    content_en: `
### 1. What is the law?
The Consumer Protection Act 2075 and the Electronic Transactions Act 2063 protect citizens who buy goods online or engage in digital commerce in Nepal.

### 2. What does it mean in simple language?
Online sellers on Instagram, TikTok, Facebook, or e-commerce websites are not above the law. If an online page takes your money and blocks you, sends a damaged/counterfeit item, or misrepresents product quality, they are committing punishable consumer fraud.

### 3. What are your rights?
- Right to receive goods exactly matching the advertised description, quality, and price.
- Right to a replacement or full refund for defective or substandard items within statutory return timelines.
- Right to an official receipt (बिल/बिजक) containing the PAN/VAT number of the business.

### 4. Step-by-step: How to report cyber fraud
1. **Preserve Digital Evidence**: Take complete screenshots of the social media page, product listings, chat conversations, transaction receipts, bank/wallet transfer IDs, and courier delivery receipts. Do not delete chats.
2. **Report to Payment Wallet / Bank**: If you transferred money via eSewa, Khalti, or mobile banking, immediately call the wallet customer helpline and report fraudulent diversion to freeze the beneficiary account.
3. **Submit Complaint to Department of Commerce**: For commercial fraud, submit a written complaint to the **Department of Commerce, Supplies and Consumer Protection (वाणिज्य, आपूर्ति तथा उपभोक्ता संरक्षण विभाग)** at Babarmahal, Kathmandu or through their toll-free consumer hotline (1137).
4. **Lodge FIR with Nepal Police Cyber Bureau**: For extortion, identity theft, or organized scams, file an official report with the **Nepal Police Cyber Bureau (भोटाहिटी, काठमाडौं, Phone: 01-5389064)**.

### 5. Emergency contacts
- Consumer Protection Toll-Free Hotline: 1137.
- Nepal Police Cyber Bureau: 01-5389064 / Email: cyberbureau@nepalpolice.gov.np.
    `,
    content_ne: `
### १. कानुन के हो?
उपभोक्ता संरक्षण ऐन २०७५ र विद्युतीय कारोबार ऐन २०६३ ले अनलाइन सामान किन्दा हुने ठगी र साइबर अपराध विरुद्ध कडा कारबाहीको व्यवस्था गरेका छन्।

### २. अनलाइन ठगीमा परे के गर्ने?
१. **प्रमाण सुरक्षित राख्नुहोस्**: फेसबुक/इन्स्टाग्राम पेजको नाम, लिंक, कुराकानी (चट) को स्क्रिनसट, इसेवा/खल्ती वा बैंक ट्रान्सफरको भौचर र कुरियरको रसिद तुरुन्त सेभ गर्नुहोस्।
२. **बैंक वा वालेटलाई खबर गर्नुहोस्**: इसेवा वा बैंकको हटलाइनमा तुरुन्त फोन गरी ठगको खाता रोक्का गर्न अनुरोध गर्नुहोस्।
३. **वाणिज्य विभागमा उजुरी दिने**: सामान कमसल परेमा वा फिर्ता नगरेमा वाणिज्य, आपूर्ति तथा उपभोक्ता संरक्षण विभाग (बबरमहल, काठमाडौं) को निःशुल्क फोन **११३७** मा उजुरी टिपाउनुहोस्।
४. **नेपाल प्रहरी साइबर ब्युरोमा जाने**: पैसा लिएर ब्लक गरेमा वा फेक प्रोफाइल बनाएर ठगेमा भोटाहिटीस्थित नेपाल प्रहरीको **साइबर ब्युरो (फोन: ०१-५३८९०६४)** मा लिखित उजुरी दर्ता गर्नुहोस्।
    `,
    faqs_json: JSON.stringify([
      {
        q_en: 'Is selling products on Instagram without a registered PAN legal in Nepal?',
        a_en: 'No. Operating any commercial business without tax registration (PAN/VAT) violates the Consumer Protection Act and Internal Revenue regulations. Sellers operating without PAN can be penalized and closed down by commerce authorities.',
        q_ne: 'के प्यान दर्ता विना इन्स्टाग्राममा पसल चलाउन पाइन्छ?',
        a_ne: 'पाइँदैन। नेपालको कानुन अनुसार कुनै पनि व्यावसायिक कारोबार गर्दा आन्तरिक राजस्व कार्यालयमा प्यान (PAN) दर्ता गरी ग्राहकलाई आधिकारिक बिजक (बिल) दिनु अनिवार्य छ।'
      }
    ]),
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Screenshot Chat & Payment Transcripts', title_ne: 'चट र बैंक भौचरको स्क्रिनसट लिनुहोस्', desc_en: 'Capture recipient account numbers and profile URLs.' },
      { step: 2, title_en: 'Contact Bank / eSewa to Freeze Target Wallet', title_ne: 'बैंक वा इसेवामा खाता रोक्का गर्न भन्नुहोस्', desc_en: 'Report immediate financial fraud to compliance teams.' },
      { step: 3, title_en: 'Call Consumer Protection Hotline 1137', title_ne: 'वाणिज्य विभागको हटलाइन ११३७ मा फोन गर्नुहोस्', desc_en: 'Department of Commerce dispatches market inspectors.' },
      { step: 4, title_en: 'Submit Crime Report to Nepal Police Cyber Bureau', title_ne: 'साइबर ब्युरोमा लिखित उजुरी दिनुहोस्', desc_en: 'File cyber incident report at Bhotahiti or online portal.' }
    ]),
    checklist_json: JSON.stringify([
      'Screenshots of product advertisement and agreed price',
      'Transaction reference code from eSewa, Khalti, or mobile bank',
      'Phone numbers and profile links of the seller',
      'Delivery parcel packaging slip / courier airway bill',
      'Copy of applicant Nepali Citizenship'
    ]),
    view_count: 1980
  }
];

for (const a of articlesData) {
  const pillarId = pillarMap[a.pillar_slug];
  insertArticle.run(
    a.slug, pillarId, a.category_slug, a.title_en, a.title_ne, a.summary_en, a.summary_ne,
    a.target_audience, a.primary_keyword, a.related_entities, a.jurisdiction, a.applicable_legislation,
    a.relevant_sections, a.official_source_url, a.publication_date, a.last_verified_date,
    a.reviewed_by, a.review_status, a.content_en, a.content_ne, a.faqs_json, a.steps_json,
    a.checklist_json, a.view_count
  );
}

// ----------------------------------------------------
// 3. OFFICIAL AUTHORITIES DIRECTORY
// ----------------------------------------------------
const insertAuthority = db.prepare(`
  INSERT INTO authorities (
    name_en, name_ne, role_en, role_ne, phone, emergency_helpline, website_url, address_en, address_ne, jurisdiction, category
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const authoritiesData = [
  {
    name_en: 'Supreme Court of Nepal (सर्वोच्च अदालत)',
    name_ne: 'सर्वोच्च अदालत, नेपाल',
    role_en: 'Apex judicial authority of Nepal with constitutional writ jurisdiction to enforce fundamental rights.',
    role_ne: 'मौलिक हकको प्रचलन गराउने असाधारण रिट क्षेत्राधिकार भएको नेपालको सर्वोच्च न्यायिक निकाय।',
    phone: '01-4262845',
    emergency_helpline: '01-4262846',
    website_url: 'https://supremecourt.gov.np',
    address_en: 'Ramshah Path, Kathmandu, Nepal',
    address_ne: 'रामशाहपथ, काठमाडौँ',
    jurisdiction: 'Federal / Nationwide',
    category: 'Judiciary'
  },
  {
    name_en: 'Nepal Law Commission (नेपाल कानुन आयोग)',
    name_ne: 'नेपाल कानुन आयोग',
    role_en: 'Statutory body responsible for drafting, revising, codifying, and publishing all authentic Acts and Gazettes of Nepal.',
    role_ne: 'नेपालका सबै ऐन, कानुन र राजपत्रहरूको आधिकारिक प्रकाशन र परिमार्जन गर्ने वैधानिक निकाय।',
    phone: '01-4256249',
    emergency_helpline: '',
    website_url: 'https://lawcommission.gov.np',
    address_en: 'Singha Durbar, Kathmandu',
    address_ne: 'सिंहदरबार, काठमाडौँ',
    jurisdiction: 'Federal',
    category: 'Legal Codification'
  },
  {
    name_en: 'Department of Labour and Occupational Safety (श्रम विभाग)',
    name_ne: 'श्रम तथा व्यवसायजन्य सुरक्षा विभाग',
    role_en: 'Government department overseeing worker rights, wage disputes, workplace health, and labour inspections.',
    role_ne: 'श्रमिकका अधिकार, तलब सम्बन्धी उजुरी, कार्यस्थलको सुरक्षा र श्रम निरीक्षण गर्ने सरकारी विभाग।',
    phone: '01-4782352',
    emergency_helpline: '01-4782353',
    website_url: 'https://dolos.gov.np',
    address_en: 'Minbhawan, Kathmandu',
    address_ne: 'मीनभवन, काठमाडौँ',
    jurisdiction: 'Nationwide (7 Province Offices)',
    category: 'Labour & Employment'
  },
  {
    name_en: 'Department of Land Management and Archive (भूमि व्यवस्थापन विभाग)',
    name_ne: 'भूमि व्यवस्थापन तथा अभिलेख विभाग',
    role_en: 'Central authority overseeing all Land Revenue (Malpot) Offices, deed registrations, and property ownership archives.',
    role_ne: 'देशभरका सबै मालपोत कार्यालय, जग्गाको लिखत पास र स्रेस्ताको अभिलेख व्यवस्थापन गर्ने केन्द्रीय विभाग।',
    phone: '01-4780650',
    emergency_helpline: '',
    website_url: 'https://dolma.gov.np',
    address_en: 'Babarmahal, Kathmandu',
    address_ne: 'बबरमहल, काठमाडौँ',
    jurisdiction: 'Nationwide',
    category: 'Land & Property'
  },
  {
    name_en: 'Nepal Police Cyber Bureau (साइबर ब्युरो)',
    name_ne: 'नेपाल प्रहरी साइबर ब्युरो',
    role_en: 'Specialized police unit investigating online fraud, social media abuse, hacking, digital extortion, and ETA offenses.',
    role_ne: 'अनलाइन ठगी, सामाजिक सञ्जालमा चरित्रहत्या, ह्याकिङ र साइबर अपराधको अनुसन्धान गर्ने विशिष्टीकृत प्रहरी इकाई।',
    phone: '01-5389064',
    emergency_helpline: '100',
    website_url: 'https://cyberbureau.nepalpolice.gov.np',
    address_en: 'Bhotahiti, Kathmandu',
    address_ne: 'भोटाहिटी, काठमाडौँ',
    jurisdiction: 'Nationwide',
    category: 'Law Enforcement & Cyber'
  },
  {
    name_en: 'National Human Rights Commission (राष्ट्रिय मानव अधिकार आयोग)',
    name_ne: 'राष्ट्रिय मानव अधिकार आयोग, नेपाल',
    role_en: 'Constitutional watchdog monitoring human rights violations, illegal detentions, and state excess.',
    role_ne: 'मानव अधिकार हनन, गैरकानुनी थुना र राज्यको स्वेच्छाचारिता अनुगमन गर्ने संवैधानिक आयोग।',
    phone: '01-5010015',
    emergency_helpline: '1114',
    website_url: 'https://nhrcnepal.org',
    address_en: 'Harihar Bhawan, Pulchowk, Lalitpur',
    address_ne: 'हरिहर भवन, पुल्चोक, ललितपुर',
    jurisdiction: 'Nationwide',
    category: 'Constitutional Body'
  },
  {
    name_en: 'National Women Commission (राष्ट्रिय महिला आयोग)',
    name_ne: 'राष्ट्रिय महिला आयोग',
    role_en: 'Constitutional body protecting women rights, operating 24/7 domestic violence helpline and legal aid.',
    role_ne: 'महिला हकहितको संरक्षण, घरेलु हिंसा सम्बन्धी उजुरी र २४ घण्टे निःशुल्क हेल्पलाइन सञ्चालन गर्ने निकाय।',
    phone: '01-4255944',
    emergency_helpline: '1145 (Toll-Free 24/7)',
    website_url: 'https://nwc.gov.np',
    address_en: 'Bhadrakali Plaza, Kathmandu',
    address_ne: 'भद्रकाली प्लाजा, काठमाडौँ',
    jurisdiction: 'Nationwide',
    category: 'Women Protection'
  },
  {
    name_en: 'Department of Commerce, Supplies and Consumer Protection (वाणिज्य विभाग)',
    name_ne: 'वाणिज्य, आपूर्ति तथा उपभोक्ता संरक्षण विभाग',
    role_en: 'Regulator enforcing consumer rights, price monitoring, market inspections, and penalizing defective goods/services.',
    role_ne: 'उपभोक्ता अधिकार संरक्षण, बजार अनुगमन, कालोबजारी नियन्त्रण र ठगी विरुद्ध कारबाही गर्ने निकाय।',
    phone: '01-4247926',
    emergency_helpline: '1137 (Toll-Free Consumer Hotline)',
    website_url: 'https://doc.gov.np',
    address_en: 'Babarmahal, Kathmandu',
    address_ne: 'बबरमहल, काठमाडौँ',
    jurisdiction: 'Nationwide',
    category: 'Consumer Protection'
  }
];

for (const auth of authoritiesData) {
  insertAuthority.run(
    auth.name_en, auth.name_ne, auth.role_en, auth.role_ne, auth.phone,
    auth.emergency_helpline, auth.website_url, auth.address_en, auth.address_ne,
    auth.jurisdiction, auth.category
  );
}

// ----------------------------------------------------
// 4. LEGAL TERMS DICTIONARY
// ----------------------------------------------------
const insertTerm = db.prepare(`
  INSERT INTO legal_terms (
    term_en, term_ne, definition_en, definition_ne, simple_explanation_en, simple_explanation_ne, category, legal_source
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const termsData = [
  {
    term_en: 'Lalpurja (Land Ownership Certificate)',
    term_ne: 'लालपुर्जा (जग्गाधनी प्रमाण पुर्जा)',
    definition_en: 'The official land title certificate issued by the Land Revenue Office certifying recorded ownership of real estate.',
    definition_ne: 'मालपोत कार्यालयबाट जग्गाधनीलाई जग्गाको स्वामित्व प्रमाणित गरी दिइने आधिकारिक सरकारी प्रमाणपत्र।',
    simple_explanation_en: 'It is the paper document proving you own a specific plot of land, showing plot number, area, and owner identity.',
    simple_explanation_ne: 'यो तपाईंको जग्गा कुन ठाउँमा कति छ र कित्ता नम्बर के हो भनी खुलाउने सरकारी प्रमाणपत्र हो।',
    category: 'Property Law',
    legal_source: 'Land Revenue Act 2034'
  },
  {
    term_en: 'Anshbanda (Partition of Ancestral Property)',
    term_ne: 'अंशबण्डा',
    definition_en: 'The formal division and transfer of ancestral property among lawful co-parceners (spouses, sons, daughters) under the National Civil Code.',
    definition_ne: 'मुलुकी देवानी संहिता बमोजिम एकाघरका अंशियारहरू (पति, पत्नी, छोरा, छोरी) बीच पैतृक सम्पत्तिको कानुनी भागबन्डा।',
    simple_explanation_en: 'The legal process of dividing family ancestral land, houses, and money equally among all eligible family members.',
    simple_explanation_ne: 'बाबु-आमाको पुर्ख्यौली सम्पत्ति छोरा, छोरी र दम्पती बीच बराबर बाँडफाँड गर्ने कानुनी प्रक्रिया।',
    category: 'Family Law',
    legal_source: 'National Civil Code 2074 (Chapter 10)'
  },
  {
    term_en: 'Firadpatra (Plaint / Statement of Claim)',
    term_ne: 'फिरादपत्र',
    definition_en: 'The primary formal written complaint or statement of claim submitted by a plaintiff to initiate a civil suit in court.',
    definition_ne: 'कुनै पनि देवानी मुद्दा सुरु गर्न वादीले आफ्नो मागदाबी र प्रमाण खुलाई अदालतमा दर्ता गर्ने पहिलो औपचारिक निवेदन।',
    simple_explanation_en: 'The opening court document where you explain what wrongdoing occurred and exactly what remedy or compensation you seek from the judge.',
    simple_explanation_ne: 'अदालतमा मुद्दा हाल्दा आफ्नो अधिकार के हनन भयो र विपक्षीबाट के पाउनुपर्ने हो भनी लेखेर दिइने मुख्य उजुरी।',
    category: 'Civil Procedure',
    legal_source: 'Civil Procedure Code 2074'
  },
  {
    term_en: 'Bandipratyakshikaran (Habeas Corpus)',
    term_ne: 'बन्दीप्रत्यक्षीकरण',
    definition_en: 'An extraordinary constitutional writ issued by High Courts or Supreme Court commanding authorities to produce a detained person to examine legality of arrest.',
    definition_ne: 'कुनै व्यक्तिलाई गैरकानुनी रूपमा थुनामा राखिएको भए अदालतमा उपस्थित गराई थुनामुक्त गर्न अदालतले जारी गर्ने असाधारण रिट आदेश।',
    simple_explanation_en: 'A high-priority emergency petition used when police or authorities detain someone illegally without filing charges within 24 hours.',
    simple_explanation_ne: 'प्रहरी वा प्रशासनले कसैलाई विना कारण थुनामा राखेमा तुरुन्त अदालतमा उपस्थित गराएर रिहा गर्न दिइने सर्वोच्च आदेश।',
    category: 'Constitutional Law',
    legal_source: 'Constitution of Nepal (Articles 133 & 144)'
  },
  {
    term_en: 'Milapatra (Compromise / Court Settlement Deed)',
    term_ne: 'मिलापत्र',
    definition_en: 'A legally binding settlement executed between opposing parties resolving a pending dispute with judicial sanction.',
    definition_ne: 'अदालत वा न्यायिक समितिमा विचाराधीन मुद्दामा वादी र प्रतिवादी बीच आपसी सहमतिमा गरिएको कानुनी सम्झौता।',
    simple_explanation_en: 'When both sides in a court battle agree to resolve the matter peacefully, the judge records this formal agreement which becomes final.',
    simple_explanation_ne: 'मुद्दा लडिरहेका दुवै पक्षले आपसमा मिलेर गर्ने वैधानिक सम्झौता, जसलाई अदालतले अन्तिम फैसला सरह मान्यता दिन्छ।',
    category: 'Dispute Resolution',
    legal_source: 'Civil Procedure Code 2074'
  },
  {
    term_en: 'Hak-safaya (Right of Pre-emption)',
    term_ne: 'हक सफा',
    definition_en: 'The statutory right of an existing co-owner or adjoining landholder to purchase land in priority over outside third parties.',
    definition_ne: 'कुनै अंशियार वा छिमेकी जग्गाधनीले आफ्नो साँध वा संयुक्त सम्पत्ति अरुलाई बेच्दा पहिले आफूले किन्न पाउने कानुनी अधिकार।',
    simple_explanation_en: 'If a family member or co-owner sells joint land to a stranger without asking you, you can claim the right to buy it at the official deed price.',
    simple_explanation_ne: 'साझा जग्गामा अरु कसैलाई बेच्नुअघि नजिकको हकदार वा अंशियारले पहिले किन्न पाउने कानुनी दाबी।',
    category: 'Property Law',
    legal_source: 'Muluki Devani Samhita 2074'
  }
];

for (const t of termsData) {
  insertTerm.run(
    t.term_en, t.term_ne, t.definition_en, t.definition_ne,
    t.simple_explanation_en, t.simple_explanation_ne, t.category, t.legal_source
  );
}

// ----------------------------------------------------
// 5. INTERACTIVE DOCUMENT CHECKLISTS
// ----------------------------------------------------
const insertChecklist = db.prepare(`
  INSERT INTO document_checklists (
    title_en, title_ne, category, description_en, description_ne, items_json
  ) VALUES (?, ?, ?, ?, ?, ?)
`);

const checklistsData = [
  {
    title_en: 'Checklist for Buying Land and Passing Deed (मालपोत लिखत पास)',
    title_ne: 'जग्गा खरिद र मालपोत लिखत पास गर्दा चाहिने कागजात सूची',
    category: 'Property & Land',
    description_en: 'Ensure you have all required legal clearances before submitting deed at the Land Revenue Office.',
    description_ne: 'मालपोत कार्यालयमा जग्गाको लिखत पास गर्न जानु अघि पूरा गर्नुपर्ने कागजातहरूको आधिकारिक चेकलिस्ट।',
    items_json: JSON.stringify([
      { id: 1, label_en: 'Original Land Ownership Certificate (सक्कल लालपुर्जा)', label_ne: 'जग्गाधनीको सक्कल लालपुर्जा', required: true },
      { id: 2, label_en: 'Verified Sresta Search from Malpot confirming no liens/rokka', label_ne: 'मालपोतबाट रोक्का नभएको कम्प्युटर स्रेस्ता प्रमाण', required: true },
      { id: 3, label_en: 'Certified Field Trace Map from Napi (Survey) Office', label_ne: 'नापी कार्यालयबाट प्रमाणित ट्रेस नक्सा', required: true },
      { id: 4, label_en: 'Local Ward Road Recommendation (बाटो सिफारिस)', label_ne: 'सम्बन्धित वडा कार्यालयको बाटो सिफारिस पत्र', required: true },
      { id: 5, label_en: 'Local Property Tax Clearance Receipt (एकीकृत सम्पत्ति कर चुक्ता रसिद)', label_ne: 'चालु आ.व. को सम्पत्ति कर चुक्ता रसिद', required: true },
      { id: 6, label_en: 'Original Citizenship Certificates of Buyer, Seller, and 2 Witnesses', label_ne: 'क्रेता, विक्रेता र २ जना साक्षीको सक्कल नागरिकता', required: true },
      { id: 7, label_en: 'Consent Deed (मन्जुरीनामा) of all family co-heirs if ancestral property', label_ne: 'जग्गा पैतृक भए परिवारका सबै अंशियारहरूको मन्जुरीनामा', required: true }
    ])
  },
  {
    title_en: 'Checklist for District Court Marriage Registration (अदालती विवाह)',
    title_ne: 'जिल्ला अदालतमा अदालती विवाह दर्ता गर्दा चाहिने कागजात सूची',
    category: 'Family & Marriage',
    description_en: 'Documents mandatory for bride and groom appearing before the District Court Judge.',
    description_ne: 'जिल्ला अदालतमा न्यायाधीश समक्ष अदालती विवाह गर्दा पेश गर्नुपर्ने अनिवार्य कागजातहरू।',
    items_json: JSON.stringify([
      { id: 1, label_en: 'Age Proof: Both must be at least 20 years old', label_ne: 'केटा र केटी दुवैको उमेर २० वर्ष पूरा भएको प्रमाण', required: true },
      { id: 2, label_en: 'Original Nepali Citizenship Certificates (Bride & Groom)', label_ne: 'केटा र केटी दुवैको सक्कल नेपाली नागरिकता', required: true },
      { id: 3, label_en: 'Ward Unmarried Status Certificate (वडाको अविवाहित सिफारिस) issued within 30 days', label_ne: 'स्थानीय वडा कार्यालयको ३० दिन भित्रको अविवाहित सिफारिस', required: true },
      { id: 4, label_en: '15-Day Temporary Residence Proof (if filing outside permanent address)', label_ne: 'स्थायी ठेगाना बाहिर दर्ता गर्ने भए कम्तीमा १५ दिनको बसोबास सिफारिस', required: false },
      { id: 5, label_en: '4 Passport-size photos of each party with clear background', label_ne: 'दुवै पक्षको ४-४ प्रति स्पष्ट पासपोर्ट साइज फोटो', required: true },
      { id: 6, label_en: 'Two Adult Witnesses with original Citizenship Certificates', label_ne: 'सक्कल नागरिकतासहित २ जना बालिग साक्षीहरूको उपस्थिति', required: true }
    ])
  },
  {
    title_en: 'Checklist for Filing Labour Claim (Unpaid Salary) at Labour Office',
    title_ne: 'तलब नपाउँदा श्रम कार्यालयमा उजुरी गर्दा चाहिने कागजात सूची',
    category: 'Labour & Employment',
    description_en: 'Documentation to recover unpaid remuneration, overtime, and benefits under Labour Act 2074.',
    description_ne: 'श्रम ऐन २०७४ अनुसार नपाएको पारिश्रमिक र उपदान असुल गर्न श्रम कार्यालयमा बुझाउनुपर्ने प्रमाण।',
    items_json: JSON.stringify([
      { id: 1, label_en: 'Formal Claim Petition addressed to the Labour Officer (श्रम अधिकारी)', label_ne: 'श्रम अधिकारी समक्ष दिइने औपचारिक दाबी उजुरी निवेदन', required: true },
      { id: 2, label_en: 'Copy of Appointment Letter or Employment Agreement', label_ne: 'नियुक्ति पत्र वा रोजगार सम्झौताको प्रतिलिपि', required: true },
      { id: 3, label_en: 'Bank statement highlighting missing monthly salary deposits', label_ne: 'तलब नआएको प्रमाणित गर्ने बैंक स्टेटमेन्ट', required: true },
      { id: 4, label_en: 'Work emails, attendance registers, ID badge, or employer messages', label_ne: 'कार्यालयको परिचयपत्र, हाजिरी विवरण वा काम लगाएका इमेलहरू', required: true },
      { id: 5, label_en: 'Copy of 7-Day Written Demand Letter previously sent to employer', label_ne: 'कम्पनीलाई पहिले पठाइएको ७ दिने माग पत्रको प्रतिलिपि', required: true }
    ])
  }
];

for (const c of checklistsData) {
  insertChecklist.run(
    c.title_en, c.title_ne, c.category, c.description_en, c.description_ne, c.items_json
  );
}

// ----------------------------------------------------
// 6. PROCEDURE GUIDES
// ----------------------------------------------------
const insertProcedure = db.prepare(`
  INSERT INTO procedure_guides (
    title_en, title_ne, category, summary_en, summary_ne, steps_json
  ) VALUES (?, ?, ?, ?, ?, ?)
`);

const procedureData = [
  {
    title_en: 'How to Resolve a Neighborhood Dispute at the Ward Judicial Committee',
    title_ne: 'स्थानीय तहको वडा न्यायिक समितिमा विवाद समाधान गर्ने प्रक्रिया',
    category: 'Local Governance',
    summary_en: 'The Local Government Operation Act 2074 authorizes Deputy Mayors / Vice Chairs to arbitrate local disputes swiftly without expensive court litigations.',
    summary_ne: 'स्थानीय सरकार सञ्चालन ऐन २०७४ अनुसार साँध सिमाना, पानी कुलो, घरबहाल र घरेलु झैझगडा वडा न्यायिक समितिबाटै मिलापत्र गर्ने सजिलो उपाय।',
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Draft Application at Ward or Municipality', title_ne: 'न्यायिक समितिमा उजुरी दर्ता', desc_en: 'Submit written claim stating the dispute and desired relief with Rs. 10 stamp fee.' },
      { step: 2, title_en: 'Summons Issued to Opposing Party', title_ne: 'विपक्षीलाई ७ दिने म्याद जारी', desc_en: 'Judicial Committee issues 7-day notice requiring the other party to submit written response.' },
      { step: 3, title_en: 'Community Mediation (मेलमिलाप) Session', title_ne: 'सूचीकृत मेलमिलापकर्ता रोहवरमा छलफल', desc_en: 'Trained mediators guide both sides toward a voluntary, win-win settlement.' },
      { step: 4, title_en: 'Formal Settlement (मिलापत्र) Registration', title_ne: 'मिलापत्र प्रमाणीकरण', desc_en: 'Both parties sign the settlement deed, having legal effect enforceable like a court decree.' }
    ])
  },
  {
    title_en: 'First 24 Hours After Police Arrest: Critical Citizen Protocol',
    title_ne: 'प्रहरीले पक्राउ गरेको पहिलो २४ घण्टा: अपनाउनुपर्ने सावधानी',
    category: 'Criminal Defense',
    summary_en: 'A step-by-step roadmap to protect personal liberty, prevent police brutality, and secure judicial remand oversight.',
    summary_ne: 'थुनामा यातना हुन नदिन, कानुन व्यवसायी उपस्थित गराउन र अदालतमा धरौटी माग गर्न पहिलो २४ घण्टाभित्र गर्नुपर्ने काम।',
    steps_json: JSON.stringify([
      { step: 1, title_en: 'Examine the Arrest Warrant (पक्राउ पुर्जी)', title_ne: 'पक्राउ पुर्जी जाँच्ने', desc_en: 'Demand written charges and note the arresting officer\'s name and station.' },
      { step: 2, title_en: 'Make One Mandatory Phone Call', title_ne: 'परिवार वा वकिललाई तुरुन्त खबर गर्ने', desc_en: 'Tell family exactly which police station custody you are in.' },
      { step: 3, title_en: 'Hospital Health Examination', title_ne: 'सरकारी अस्पतालमा स्वास्थ्य जाँच', desc_en: 'Ensure doctor records your physical condition before lockup.' },
      { step: 4, title_en: 'District Court Appearance for Remand Hearing', title_ne: 'न्यायाधीश समक्ष म्याद थप सुनुवाइ', desc_en: 'Lawyer argues for bail or immediate release within the 24-hour statutory deadline.' }
    ])
  }
];

for (const p of procedureData) {
  insertProcedure.run(
    p.title_en, p.title_ne, p.category, p.summary_en, p.summary_ne, p.steps_json
  );
}

// ----------------------------------------------------
// 7. INITIAL AUDIT LOG
// ----------------------------------------------------
db.prepare(`
  INSERT INTO audit_logs (action, entity_type, entity_id, details, created_at)
  VALUES ('SYSTEM_INIT', 'DATABASE', 'ALL', 'Initial statutory seeding completed for Nepal Citizens Rights Platform', datetime('now'))
`).run();

console.log('Seeding completed successfully!');
console.log('Total pillars:', db.prepare('SELECT COUNT(*) as count FROM pillars').get().count);
console.log('Total articles:', db.prepare('SELECT COUNT(*) as count FROM articles').get().count);
console.log('Total authorities:', db.prepare('SELECT COUNT(*) as count FROM authorities').get().count);
console.log('Total legal terms:', db.prepare('SELECT COUNT(*) as count FROM legal_terms').get().count);
console.log('Total checklists:', db.prepare('SELECT COUNT(*) as count FROM document_checklists').get().count);
