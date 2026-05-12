const fs = require('fs');
const https = require('https');
const creds = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64');
const POST_ID   = 2915;
const MEDIA_ID  = 2920;
const COVER_URL = 'https://liftygo.co.il/wp-content/uploads/2026/05/ChatGPT-Image-May-12-2026-11_50_08-AM.png';

const template = JSON.parse(
  fs.readFileSync('C:/Users/itay/liftygo-site/posts/blog-article.elementor.json','utf8')
    .replace(/972500000000/g, '972553005865')
);

function uid() { return Math.random().toString(16).slice(2,9); }
function cloneWithNewIds(obj) {
  const str = JSON.stringify(obj);
  const ids = [...new Set([...str.matchAll(/"id":"([a-f0-9]{7})"/g)].map(m=>m[1]))];
  let r = str; ids.forEach(id => { r = r.split(id).join(uid()); }); return JSON.parse(r);
}
function apiReq(method, path, body) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname:'liftygo.co.il', path, method,
      headers:{'Authorization':'Basic '+creds,'Content-Type':'application/json',...(payload?{'Content-Length':Buffer.byteLength(payload)}:{})}
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve(JSON.parse(d));}catch(e){resolve({raw:d.substring(0,300)});} }); });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}
function he(str) {
  return str.split('').map(c => { const code = c.codePointAt(0); return code>127?`\\u{${code.toString(16).toUpperCase()}}`:c; }).join('');
}

const heroHTML = `<div class="lg-article-hero">
  <div class="lg-article-meta">
    <a href="https://liftygo.co.il/blog/" class="lg-tag">מדריך לקוח</a>
    <span class="lg-meta-sep">·</span><span>מאי 2026</span>
    <span class="lg-meta-sep">·</span><span>6 דקות קריאה</span>
  </div>
  <h1 class="lg-article-title">איך לבחור מוביל דירה — המדריך המלא 2026</h1>
  <p class="lg-article-intro">כמה דברים פשוטים לבדוק לפני שחותמים — ומה לעשות כדי שההובלה תעבור בשלום.</p>
  <div class="lg-cover-wrap">
    <img class="lg-cover-img" src="${COVER_URL}" alt="איך לבחור מוביל דירה" />
  </div>
</div>
<style>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap');
.lg-article-hero{padding:36px 0 20px;font-family:'Heebo',sans-serif;direction:rtl;text-align:right}
.lg-article-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin-bottom:14px;flex-wrap:wrap}
.lg-tag{background:#E2CCFF;color:#7434DB;padding:3px 12px;border-radius:100px;font-size:12px;font-weight:700;text-decoration:none}
.lg-meta-sep{color:#d1d5db}
.lg-article-title{font-size:clamp(22px,4vw,38px);font-weight:900;color:#2D2152;line-height:1.25;margin-bottom:14px}
.lg-article-intro{font-size:16px;color:#374151;line-height:1.75;max-width:680px;margin-bottom:24px}
.lg-cover-wrap{width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,29,158,.12);margin-bottom:8px}
.lg-cover-img{width:100%;height:auto;display:block;max-height:460px;object-fit:cover}
</style>`;

// Read current article content from the update script
const articleContent = fs.readFileSync('C:/Users/itay/liftygo-site/scripts/update-how-to-choose-movers.js','utf8')
  .match(/const articleContent = `([\s\S]*?)`;[\s\S]*?async function run/)?.[1] || '';

async function run() {
  // 1. Set featured image
  console.log('Setting featured image...');
  const fi = await apiReq('POST', `/wp-json/wp/v2/posts/${POST_ID}`, { featured_media: MEDIA_ID });
  if (fi.id) console.log('✓ Featured image set (media', MEDIA_ID, ')');
  else console.log('✗ Featured image error:', JSON.stringify(fi).substring(0,200));

  // 2. Re-apply Elementor with cover image in hero
  console.log('Updating Elementor with cover image...');
  const title = 'איך לבחור מוביל דירה — המדריך המלא 2026';
  const tmpl = cloneWithNewIds(template);
  const sections = tmpl.content;

  const bcWidget = sections[1]?.elements?.[0]?.elements?.[0];
  if (bcWidget?.settings?.html) {
    bcWidget.settings.html = `<nav style="font-family:'Heebo',sans-serif;font-size:13px;color:#6b7280;padding:12px 0 4px;direction:rtl;text-align:right">
  <a href="https://liftygo.co.il/" style="color:#6b7280;text-decoration:none">LiftyGo</a>
  <span style="margin:0 6px;color:#d1d5db">›</span>
  <a href="https://liftygo.co.il/blog/" style="color:#6b7280;text-decoration:none">בלוג</a>
  <span style="margin:0 6px;color:#d1d5db">›</span>
  <span style="color:#374151;font-weight:500">${title}</span>
</nav>`;
  }

  const mainCol = sections[2].elements[0];
  const cardCssWidget  = mainCol.elements[0];
  const reactionsWidget = mainCol.elements[mainCol.elements.length - 2];
  const lastWidget     = mainCol.elements[mainCol.elements.length - 1];

  mainCol.elements = [
    cardCssWidget,
    { id:uid(), elType:'widget', widgetType:'html', isInner:false, elements:[], settings:{ html: heroHTML } },
    { id:uid(), elType:'widget', widgetType:'html', isInner:false, elements:[], settings:{ html: articleContent } },
    reactionsWidget,
    lastWidget
  ];

  const upd = await apiReq('PATCH', `/wp-json/wp/v2/posts/${POST_ID}`, {
    meta: {
      _elementor_data: JSON.stringify(tmpl.content),
      _elementor_edit_mode: 'builder',
      _elementor_template_type: 'post',
      _elementor_version: '3.0.0'
    },
    template: 'elementor_canvas'
  });
  if (upd.id) console.log('✓ Elementor updated with cover image');
  else console.log('✗ Elementor error:', JSON.stringify(upd).substring(0,200));

  // 3. Update og_image in meta-tags snippet 8
  console.log('Updating og_image in snippet 8...');
  const metaPath = 'C:/Users/itay/liftygo-site/seo/snippets/meta-tags.php';
  let metaCode = fs.readFileSync(metaPath, 'utf8');

  // Add og_image to post 2915 entry if not already there
  const ogImageLine = `\n            "og_image" => "${COVER_URL}",`;
  if (!metaCode.includes(COVER_URL)) {
    metaCode = metaCode.replace(
      new RegExp(`(${POST_ID} => \\[[\\s\\S]*?"og_url"\\s*=>\\s*"[^"]*",)`),
      `$1${ogImageLine}`
    );
    fs.writeFileSync(metaPath, metaCode);
    const snap8 = await apiReq('PATCH', '/wp-json/code-snippets/v1/snippets/8', { code: metaCode });
    console.log('✓ og_image added to snippet 8 — active:', snap8.active);
  } else {
    console.log('✓ og_image already in snippet 8');
  }

  console.log('\n✅ All done!');
  console.log('Article: https://liftygo.co.il/how-to-choose-movers/');
  console.log('Blog:    https://liftygo.co.il/blog/');
}

run().catch(console.error);
