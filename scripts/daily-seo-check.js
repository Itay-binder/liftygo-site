/**
 * LiftyGo — Daily SEO Rank Check
 * Queries Google Search Console and sends WhatsApp summary via GreenAPI
 * Run: node scripts/daily-seo-check.js
 */

const https = require('https');

// Load .env from project root
require('fs').readFileSync(require('path').join(__dirname, '../.env'), 'utf8')
  .split('\n').forEach(line => {
    const [k, v] = line.split('=');
    if (k && v) process.env[k.trim()] = v.trim();
  });

const CONFIG = {
  clientId:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  gscSite:      process.env.GSC_SITE || 'https://liftygo.co.il/',
  waInstance:   process.env.GREENAPI_INSTANCE,
  waToken:      process.env.GREENAPI_TOKEN,
  waTarget:     process.env.WA_TARGET,
};

// Keywords to track, organized by category
const KEYWORDS = {
  'מילות מפתח ראשיות': [
    'הובלת דירה',
    'מוביל דירה',
    'כמה עולה הובלת דירה',
    'מחיר הובלת דירה',
    'חברות הובלות',
    'השוואת מחירים הובלה',
  ],
  'גאוגרפיה': [
    'הובלת דירה תל אביב',
    'הובלת דירה ירושלים',
    'הובלת דירה חיפה',
    'הובלת דירה ראשון לציון',
  ],
  'זנב ארוך': [
    'כמה עולה הובלת דירה 3 חדרים',
    'כמה עולה הובלת דירה 4 חדרים',
    'איך לבחור מוביל דירה',
    'הובלת דירה זולה',
    'עבודות הובלה',
    'לידים הובלה',
    'איך למצוא עבודות הובלה',
  ],
};

// ── Helpers ────────────────────────────────────────────────────────

function post(hostname, path, body, headers) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname, path, method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload, 'utf8'),
        ...headers
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        try { resolve(JSON.parse(raw)); } catch { resolve({ raw }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function getAccessToken() {
  const params = new URLSearchParams({
    refresh_token: CONFIG.refreshToken,
    client_id:     CONFIG.clientId,
    client_secret: CONFIG.clientSecret,
    grant_type:    'refresh_token',
  }).toString();

  const req = https.request({
    hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(params) }
  }, res => {});

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(params) }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const r = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (r.access_token) resolve(r.access_token);
        else reject(new Error('Token error: ' + JSON.stringify(r)));
      });
    });
    req.on('error', reject);
    req.write(params);
    req.end();
  });
}

// ── Search Console ─────────────────────────────────────────────────

async function fetchGSCData(accessToken) {
  const today = new Date();
  const end   = today.toISOString().slice(0, 10);
  const start = new Date(today - 7 * 86400000).toISOString().slice(0, 10);

  const siteEncoded = encodeURIComponent(CONFIG.gscSite);
  const body = {
    startDate:  start,
    endDate:    end,
    dimensions: ['query'],
    rowLimit:   1000,
    dataState:  'final',
  };

  const result = await post(
    'searchconsole.googleapis.com',
    `/webmasters/v3/sites/${siteEncoded}/searchAnalytics/query`,
    body,
    { Authorization: 'Bearer ' + accessToken }
  );

  if (!result.rows) return {};

  // Build a map: query (lowercase) → { position, clicks, impressions }
  const map = {};
  result.rows.forEach(row => {
    const q = row.keys[0].toLowerCase();
    map[q] = {
      position:    Math.round(row.position),
      clicks:      row.clicks,
      impressions: row.impressions,
    };
  });
  return map;
}

// ── Format position ────────────────────────────────────────────────

function fmtPosition(data) {
  if (!data) return 'לא נמצא בTop 1000';
  const pos = data.position;
  const clicks = data.clicks;
  const clicksStr = clicks > 0 ? ` (${clicks} קליקים)` : '';
  if (pos <= 3)  return `מקום #${pos} ⭐${clicksStr}`;
  if (pos <= 10) return `מקום #${pos} ✅${clicksStr}`;
  if (pos <= 20) return `מקום #${pos} 📈${clicksStr}`;
  if (pos <= 50) return `מקום #${pos}${clicksStr}`;
  return `מקום #${pos} — מחוץ לTop 10${clicksStr}`;
}

// ── Build WhatsApp message ─────────────────────────────────────────

function buildMessage(gscMap, dateStr) {
  const lines = [];

  lines.push(`*דוח SEO יומי — LiftyGo*`);
  lines.push(`_${dateStr}_`);
  lines.push('');

  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    lines.push(`*${category}:*`);
    keywords.forEach(kw => {
      const data = gscMap[kw.toLowerCase()];
      lines.push(`*${kw}:* ${fmtPosition(data)}`);
    });
    lines.push('');
  }

  lines.push('_בדוק ב: https://liftygo.co.il/blog/_');
  return lines.join('\n');
}

// ── Send WhatsApp ──────────────────────────────────────────────────

async function sendWhatsApp(message) {
  // Build payload using JSON.stringify to ensure proper UTF-8 encoding
  const payload = JSON.stringify({
    chatId:  CONFIG.waTarget,
    message: message,
  });

  const url = `https://api.green-api.com/waInstance${CONFIG.waInstance}/sendMessage/${CONFIG.waToken}`;
  const parsed = new URL(url);

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: parsed.hostname,
      path:     parsed.pathname,
      method:   'POST',
      headers: {
        'Content-Type':   'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload, 'utf8'),
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────

async function main() {
  const now     = new Date();
  const dateStr = now.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  console.log(`[${now.toISOString()}] Starting SEO daily check...`);

  const accessToken = await getAccessToken();
  console.log('Access token OK');

  const gscMap = await fetchGSCData(accessToken);
  const totalRows = Object.keys(gscMap).length;
  console.log(`GSC data: ${totalRows} queries returned`);

  if (totalRows === 0) {
    console.warn('WARNING: No GSC data. Site may not be verified in Search Console or data not yet available.');
  }

  const message = buildMessage(gscMap, dateStr);
  console.log('\n--- Message preview ---\n' + message + '\n---');

  const waResult = await sendWhatsApp(message);
  console.log('WhatsApp sent:', JSON.stringify(waResult));
}

main().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
