/**
 * LiftyGo — Content Strategy Agent
 * Reads SEO report → scans competitors → recommends next article
 * Run: node scripts/content-strategy-agent.js
 */

const https = require('https');
const http  = require('http');
const fs    = require('fs');
const path  = require('path');

// Load .env
fs.readFileSync(path.join(__dirname, '../.env'), 'utf8')
  .split('\n').forEach(line => {
    const [k, ...rest] = line.split('=');
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim();
  });

const CONFIG = {
  waInstance: process.env.GREENAPI_INSTANCE,
  waToken:    process.env.GREENAPI_TOKEN,
  waTarget:   process.env.WA_TARGET,
};

// ── Competitors to scan ────────────────────────────────────────────
const COMPETITORS = [
  { name: 'Top Hovolot (hvl)',  sitemap: 'https://hvl.co.il/sitemap.xml' },
  { name: 'GetMoving',          sitemap: 'https://getmoving.co.il/sitemap.xml' },
  { name: 'GetPacking',         sitemap: 'https://getpacking.co.il/sitemap.xml' },
  { name: 'Ask5',               sitemap: 'https://www.ask5.co.il/sitemap.xml' },
  { name: 'Midrag',             sitemap: 'https://www.midrag.co.il/sitemap.xml' },
];

// ── Keyword clusters for opportunity detection ─────────────────────
const KEYWORD_CLUSTERS = [
  { topic: 'מחירים',   keywords: ['כמה עולה הובלה', 'מחיר הובלת דירה', 'כמה עולה הובלת דירה'] },
  { topic: 'עיר',      keywords: ['הובלת דירה תל אביב', 'הובלת דירה ירושלים', 'הובלת דירה חיפה', 'הובלת דירה ראשון לציון', 'הובלת דירה פתח תקווה', 'הובלת דירה נתניה', 'הובלת דירה באר שבע'] },
  { topic: 'בחירה',    keywords: ['איך לבחור מוביל', 'מוביל מומלץ', 'חברת הובלות מומלצת'] },
  { topic: 'מובילים',  keywords: ['עבודות הובלה', 'לידים הובלה', 'איך להשיג לקוחות הובלה', 'כמה מרוויח מוביל'] },
  { topic: 'פריטים',   keywords: ['הובלת פריטים', 'הובלת רהיטים', 'הובלת מזגן', 'הובלת פסנתר'] },
  { topic: 'הכנה',     keywords: ['איך להכין לדירה להובלה', 'צ\'קליסט הובלה', 'אריזה להובלה'] },
];

// ── Helpers ────────────────────────────────────────────────────────

function fetchUrl(url, timeout = 8000) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return Promise.resolve('');
  return new Promise((resolve) => {
    let parsed;
    try { parsed = new URL(url); } catch { return resolve(''); }
    const lib = parsed.protocol === 'https:' ? https : http;
    try {
      const req = lib.get({
        hostname: parsed.hostname,
        path:     parsed.pathname + parsed.search,
        headers:  { 'User-Agent': 'Mozilla/5.0 (compatible; LiftyGoBot/1.0)', 'Accept-Encoding': 'identity' },
        timeout,
      }, res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch { resolve(''); }
  });
}

function extractSitemapUrls(xml) {
  // Extract <url> entries with <loc> and optional <lastmod>
  const entries = [];
  const urlMatches = xml.matchAll(/<url>([\s\S]*?)<\/url>/g);
  for (const m of urlMatches) {
    const block = m[1];
    const loc     = (block.match(/<loc>(.*?)<\/loc>/) || [])[1];
    const lastmod = (block.match(/<lastmod>(.*?)<\/lastmod>/) || [])[1];
    if (loc) entries.push({ url: loc, lastmod: lastmod || '' });
  }
  // Also handle sitemap index
  const sitemapMatches = xml.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g);
  for (const m of sitemapMatches) {
    const block = m[1];
    const loc = (block.match(/<loc>(.*?)<\/loc>/) || [])[1];
    if (loc) entries.push({ url: loc, lastmod: '', isSitemapIndex: true });
  }
  return entries;
}

function daysSince(dateStr) {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  if (isNaN(d)) return 999;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function isMovingRelated(url) {
  const keywords = ['hobol', 'hovel', 'moving', 'mover', 'haval', 'dira', 'remez', 'cargo', 'truck', 'משא', 'הובל', 'עבר', 'דירה'];
  const u = url.toLowerCase();
  return keywords.some(k => u.includes(k));
}

// ── Competitor scanning ────────────────────────────────────────────

async function scanCompetitor(comp) {
  console.log(`Scanning ${comp.name}...`);
  const xml = await fetchUrl(comp.sitemap);
  if (!xml) return { name: comp.name, recent: [], strength: null };

  let entries = extractSitemapUrls(xml);

  // If sitemap index — fetch all content sitemaps (posts, blog, article)
  const allIndexEntries = entries.filter(e => e.isSitemapIndex);
  if (allIndexEntries.length > 0) {
    const contentSitemaps = allIndexEntries.filter(e =>
      /post|blog|article|content|page/i.test(e.url)
    );
    const toFetch = (contentSitemaps.length > 0 ? contentSitemaps : allIndexEntries).slice(0, 3);
    const subResults = await Promise.all(toFetch.map(e => fetchUrl(e.url)));
    subResults.forEach(subXml => {
      if (subXml) entries = [...entries, ...extractSitemapUrls(subXml)];
    });
  }

  const contentEntries = entries.filter(e => !e.isSitemapIndex);
  const movingEntries  = contentEntries.filter(e => isMovingRelated(e.url));
  const withDate       = contentEntries.filter(e => e.lastmod);

  // Strength metrics
  const recentAll     = withDate.filter(e => daysSince(e.lastmod) <= 30).length;
  const recent90      = withDate.filter(e => daysSince(e.lastmod) <= 90).length;
  const totalPages    = contentEntries.length;
  const totalMoving   = movingEntries.length;
  const lastestDate   = withDate.length > 0
    ? withDate.sort((a,b) => new Date(b.lastmod)-new Date(a.lastmod))[0].lastmod.slice(0,10)
    : null;

  // Strength score (0–100)
  let score = 0;
  if (totalPages > 500)  score += 30;
  else if (totalPages > 200) score += 20;
  else if (totalPages > 50)  score += 10;
  if (totalMoving > 50)  score += 25;
  else if (totalMoving > 20) score += 15;
  else if (totalMoving > 5)  score += 8;
  if (recentAll >= 8)    score += 25;
  else if (recentAll >= 3) score += 15;
  else if (recentAll >= 1) score += 8;
  if (recent90 >= 20)    score += 20;
  else if (recent90 >= 8)  score += 12;
  else if (recent90 >= 2)  score += 6;

  const strengthLabel = score >= 70 ? '🔴 חזק מאוד' :
                        score >= 45 ? '🟠 חזק' :
                        score >= 25 ? '🟡 בינוני' : '🟢 חלש';

  const strength = { score, label: strengthLabel, totalPages, totalMoving, recentAll, recent90, lastestDate };

  // Recent moving-related posts (< 30 days)
  const recent = movingEntries
    .filter(e => daysSince(e.lastmod) <= 30)
    .sort((a, b) => daysSince(a.lastmod) - daysSince(b.lastmod))
    .slice(0, 4)
    .map(e => ({
      competitor: comp.name,
      url: e.url,
      days: daysSince(e.lastmod),
      slug: decodeURIComponent(e.url.split('/').filter(Boolean).pop() || e.url).substring(0, 60),
    }));

  return { name: comp.name, recent, strength };
}

// ── Keyword opportunity analysis ───────────────────────────────────

function findOpportunities(gscMap) {
  // Keywords with impressions but low ranking = opportunity
  const opportunities = [];

  for (const [query, data] of Object.entries(gscMap)) {
    if (data.impressions >= 5 && data.position > 10) {
      opportunities.push({ query, ...data, gap: Math.round(data.position - 10) });
    }
  }

  // Also add tracked keywords with no data (not yet ranking)
  KEYWORD_CLUSTERS.forEach(cluster => {
    cluster.keywords.forEach(kw => {
      if (!gscMap[kw.toLowerCase()]) {
        opportunities.push({ query: kw, position: 999, impressions: 0, clicks: 0, gap: 999, topic: cluster.topic });
      }
    });
  });

  // Sort: those with impressions first (more data = better signal), then by position
  return opportunities
    .sort((a, b) => (b.impressions - a.impressions) || (a.position - b.position))
    .slice(0, 10);
}

function pickBestArticle(opportunities, competitorPosts) {
  // Match opportunities with competitor topics
  const competitorSlugs = competitorPosts.map(p => p.slug.toLowerCase().replace(/-/g, ' '));

  for (const opp of opportunities) {
    const q = opp.query.toLowerCase();
    // Check if competitors are writing about this
    const competitorMatch = competitorSlugs.some(s =>
      s.split(' ').some(word => word.length > 3 && q.includes(word))
    );

    // Prioritize: has impressions (Google already sees us) OR competitors writing about it
    if (opp.impressions > 0 || competitorMatch) {
      return { opportunity: opp, competitorMatch };
    }
  }

  // Fallback: first opportunity
  return { opportunity: opportunities[0], competitorMatch: false };
}

function generateArticleRecommendation(opp, competitorMatch) {
  const q = opp.query;

  // Map to article templates
  const templates = {
    'תל אביב': { title: `הובלת דירה בתל אביב — מחירים, טיפים ומובילים מומלצים 2026`, slug: 'tel-aviv-moving-guide' },
    'ירושלים': { title: `הובלת דירה בירושלים — מחירים וטיפים 2026`, slug: 'jerusalem-moving-guide' },
    'חיפה':    { title: `הובלת דירה בחיפה — מחירים ומובילים מומלצים 2026`, slug: 'haifa-moving-guide' },
    'ראשון לציון': { title: `הובלת דירה בראשון לציון — מחירים 2026`, slug: 'rishon-lezion-moving' },
    'לבחור מוביל': { title: `איך לבחור מוביל דירה — 7 דברים שחייבים לבדוק`, slug: 'how-to-choose-movers' },
    'רהיטים':  { title: `הובלת רהיטים בודדים — מה לבדוק ומתי זה משתלם`, slug: 'furniture-moving-guide' },
    'פסנתר':   { title: `הובלת פסנתר — המדריך המלא למחיר ולוגיסטיקה`, slug: 'piano-moving-guide' },
    'מרוויח מוביל': { title: `כמה מרוויח מוביל דירות בישראל? מדריך הכנסות 2026`, slug: 'mover-income-guide' },
    'עבודות הובלה': { title: `איך להשיג עבודות הובלה — 5 שיטות שעובדות למובילים`, slug: 'moving-jobs-tips' },
    'הכנה':    { title: `איך להכין את הדירה להובלה — צ\'קליסט מלא`, slug: 'moving-checklist' },
  };

  for (const [keyword, template] of Object.entries(templates)) {
    if (q.includes(keyword)) return template;
  }

  // Generic
  return {
    title: `מדריך מקיף: ${q} — כל מה שצריך לדעת 2026`,
    slug: q.replace(/\s+/g, '-').replace(/[^\w֐-׿-]/g, '').substring(0, 40) || 'new-guide'
  };
}

// ── Build WhatsApp message ─────────────────────────────────────────

function buildStrategyMessage(opportunities, competitorPosts, strengthData, recommendation, dateStr) {
  const lines = [];
  lines.push(`*ניתוח תוכן אסטרטגי — LiftyGo*`);
  lines.push(`_${dateStr}_`);
  lines.push('');

  // Competitor strength ranking
  if (strengthData.length > 0) {
    lines.push(`*עוצמת המתחרים (נכון להיום):*`);
    strengthData.forEach(c => {
      const details = [];
      if (c.totalPages)  details.push(`${c.totalPages} דפים`);
      if (c.totalMoving) details.push(`${c.totalMoving} מאמרי הובלה`);
      if (c.recentAll)   details.push(`${c.recentAll} פרסומים השבוע`);
      else               details.push(`לא פרסמו ב-30 יום`);
      lines.push(`*${c.name}:* ${c.label} — ${details.join(', ')}`);
    });
    lines.push('');
  }

  // Recent competitor posts
  if (competitorPosts.length > 0) {
    lines.push(`*פרסומים חדשים ב-30 ימים האחרונים:*`);
    competitorPosts.slice(0, 6).forEach(p => {
      lines.push(`• ${p.competitor}: _${p.slug}_ (לפני ${p.days} ימים)`);
    });
    lines.push('');
  } else {
    lines.push(`*פרסומים חדשים:* לא נמצאו פרסומי הובלה חדשים אצל המתחרים`);
    lines.push('');
  }

  // Keyword opportunities
  const topOpps = opportunities.filter(o => o.impressions > 0).slice(0, 5);
  if (topOpps.length > 0) {
    lines.push(`*הזדמנויות ב-Search Console:*`);
    topOpps.forEach(o => {
      lines.push(`*${o.query}:* מיקום #${o.position}, ${o.impressions} חשיפות`);
    });
    lines.push('');
  }

  // Recommendation
  const opp = recommendation.opportunity;
  const article = generateArticleRecommendation(opp, recommendation.competitorMatch);
  lines.push(`*המלצה למאמר הבא:*`);
  lines.push(`*כותרת:* ${article.title}`);
  lines.push(`*Slug:* ${article.slug}`);
  lines.push(`*מילת מפתח:* ${opp.query}`);

  const reason = opp.impressions > 0
    ? `${opp.impressions} חשיפות בגוגל, מיקום #${opp.position} — פוטנציאל לעמוד ראשון`
    : recommendation.competitorMatch
      ? `המתחרים כבר כותבים על זה — חשוב להיות שם`
      : `מילת מפתח לא מכוסה, ערך SEO גבוה`;
  lines.push(`*סיבה:* ${reason}`);

  return lines.join('\n');
}

// ── Send WhatsApp ──────────────────────────────────────────────────

async function sendWhatsApp(message) {
  const payload = JSON.stringify({ chatId: CONFIG.waTarget, message });
  const url = new URL(`https://api.green-api.com/waInstance${CONFIG.waInstance}/sendMessage/${CONFIG.waToken}`);
  return new Promise(resolve => {
    const req = https.request({
      hostname: url.hostname, path: url.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(payload, 'utf8') }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))));
    });
    req.on('error', resolve);
    req.write(payload);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  console.log(`[${now.toISOString()}] Content Strategy Agent starting...`);

  // Load SEO report from Agent 1
  const reportPath = path.join(__dirname, '../reports/seo-latest.json');
  if (!fs.existsSync(reportPath)) {
    console.warn('No SEO report found. Run daily-seo-check.js first.');
    process.exit(0);
  }
  const report  = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const gscMap  = report.gscMap || {};
  console.log(`Loaded SEO report from ${report.date} | ${Object.keys(gscMap).length} queries`);

  // Find keyword opportunities
  const opportunities = findOpportunities(gscMap);
  console.log(`Found ${opportunities.length} keyword opportunities`);

  // Scan competitors in parallel
  console.log('Scanning competitors...');
  const competitorResults = await Promise.all(COMPETITORS.map(c => scanCompetitor(c)));
  const competitorPosts   = competitorResults.flatMap(r => r.recent).sort((a, b) => a.days - b.days);
  const strengthData      = competitorResults.map(r => ({ name: r.name, ...r.strength }))
    .filter(r => r.score !== undefined)
    .sort((a, b) => b.score - a.score);
  console.log(`Found ${competitorPosts.length} recent competitor posts`);

  // Pick best article recommendation
  const recommendation = pickBestArticle(opportunities, competitorPosts);
  console.log('Recommended article:', generateArticleRecommendation(recommendation.opportunity).title);

  // Build and send message
  const message = buildStrategyMessage(opportunities, competitorPosts, strengthData, recommendation, dateStr);
  console.log('\n--- Strategy message ---\n' + message + '\n---');

  const waResult = await sendWhatsApp(message);
  console.log('WhatsApp sent:', JSON.stringify(waResult));

  // Save recommendation for future use
  const recsPath = path.join(__dirname, '../reports/content-recommendation-latest.json');
  fs.writeFileSync(recsPath, JSON.stringify({
    date: now.toISOString(),
    opportunities: opportunities.slice(0, 5),
    competitorPosts: competitorPosts.slice(0, 10),
    recommendation,
    article: generateArticleRecommendation(recommendation.opportunity),
  }, null, 2), 'utf8');
  console.log('Recommendation saved to reports/content-recommendation-latest.json');
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
