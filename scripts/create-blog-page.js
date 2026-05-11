const fs = require('fs');
const https = require('https');
const creds = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64');

const template = JSON.parse(
  fs.readFileSync('C:/Users/itay/liftygo-site/posts/blog-article.elementor.json','utf8')
    .replace(/972500000000/g, '972553005865')
);

function uid() { return Math.random().toString(16).slice(2,9); }
function cloneWithNewIds(obj) {
  const str = JSON.stringify(obj);
  const ids = [...new Set([...str.matchAll(/"id":"([a-f0-9]{7})"/g)].map(m=>m[1]))];
  let r = str;
  ids.forEach(id => { r = r.split(id).join(uid()); });
  return JSON.parse(r);
}

function apiReq(method, path, body) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise(r => {
    const req = https.request({
      hostname:'liftygo.co.il', path, method,
      headers:{'Authorization':'Basic '+creds,'Content-Type':'application/json',...(payload?{'Content-Length':Buffer.byteLength(payload)}:{})}
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{r(JSON.parse(d));}catch(e){r({raw:d.substring(0,300)});} }); });
    if (payload) req.write(payload);
    req.end();
  });
}

const BLOG_CONTENT = `<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
.blog-page{font-family:'Rubik',sans-serif;color:#374151;direction:rtl;background:#f8f7ff;min-height:60vh}

/* Hero */
.blog-hero{background:linear-gradient(135deg,#4f1d9e,#7434db);padding:56px 24px 48px;text-align:center}
.blog-hero h1{font-size:clamp(28px,5vw,44px);font-weight:900;color:#fff;margin-bottom:12px}
.blog-hero p{font-size:16px;color:rgba(255,255,255,.75);max-width:500px;margin:0 auto}

/* Category tabs */
.cat-tabs{background:#fff;border-bottom:2px solid #e5e0f0;position:sticky;top:64px;z-index:50;overflow-x:auto;scrollbar-width:none}
.cat-tabs::-webkit-scrollbar{display:none}
.cat-tabs-inner{display:flex;gap:0;max-width:1140px;margin:0 auto;padding:0 20px;white-space:nowrap}
.tab-btn{padding:14px 20px;font-family:'Rubik',sans-serif;font-size:14px;font-weight:600;color:#6b7280;background:none;border:none;border-bottom:3px solid transparent;cursor:pointer;transition:color .15s,border-color .15s;margin-bottom:-2px;white-space:nowrap}
.tab-btn:hover{color:#7434db}
.tab-btn.active{color:#7434db;border-bottom-color:#7434db}

/* Content area */
.blog-content{max-width:1140px;margin:0 auto;padding:40px 24px 80px}

/* Section title */
.cat-section{display:none}
.cat-section.visible{display:block}
.cat-section-title{font-size:13px;font-weight:700;color:#a855f7;letter-spacing:.07em;text-transform:uppercase;margin-bottom:24px;padding-bottom:10px;border-bottom:1px solid #e5e0f0}

/* Article grid */
.article-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;margin-bottom:48px}

/* Article card */
.article-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(116,52,219,.1);box-shadow:0 3px 16px rgba(79,29,158,.06);transition:transform .2s,box-shadow .2s;display:flex;flex-direction:column}
.article-card:hover{transform:translateY(-3px);box-shadow:0 8px 28px rgba(79,29,158,.14)}
.card-thumb{height:160px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.card-thumb.thumb-guides{background:linear-gradient(135deg,#4f1d9e 0%,#7434db 100%)}
.card-thumb.thumb-tips{background:linear-gradient(135deg,#7434db 0%,#a855f7 100%)}
.card-thumb .thumb-icon{font-size:48px;opacity:.4}
.card-cat{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.3);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px}
.card-body{padding:20px;flex:1;display:flex;flex-direction:column}
.card-meta{font-size:12px;color:#9ca3af;margin-bottom:10px;display:flex;gap:10px}
.card-title{font-size:17px;font-weight:800;color:#2D2152;line-height:1.35;margin-bottom:10px;flex:1}
.card-excerpt{font-size:14px;color:#6b7280;line-height:1.65;margin-bottom:16px}
.card-link{display:inline-flex;align-items:center;gap:6px;color:#7434db;font-size:13px;font-weight:700;text-decoration:none;margin-top:auto}
.card-link:hover{color:#4f1d9e}

/* Empty category */
.cat-empty{text-align:center;padding:56px 24px;background:#fff;border-radius:16px;border:1px solid rgba(116,52,219,.1)}
.cat-empty-icon{font-size:48px;margin-bottom:16px;opacity:.5}
.cat-empty h3{font-size:20px;font-weight:800;color:#2D2152;margin-bottom:8px}
.cat-empty p{font-size:15px;color:#6b7280;margin-bottom:28px;max-width:380px;margin-right:auto;margin-left:auto}
.cat-empty-ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{background:linear-gradient(135deg,#7434db,#4f1d9e);color:#fff;font-family:'Rubik',sans-serif;font-size:14px;font-weight:700;padding:11px 24px;border-radius:10px;text-decoration:none;transition:opacity .15s}
.btn-primary:hover{opacity:.88}
.btn-secondary{background:#fff;color:#7434db;font-family:'Rubik',sans-serif;font-size:14px;font-weight:700;padding:11px 24px;border-radius:10px;text-decoration:none;border:2px solid #7434db;transition:background .15s}
.btn-secondary:hover{background:#f3eeff}

@media(max-width:640px){
  .blog-hero{padding:40px 16px 36px}
  .blog-content{padding:28px 16px 60px}
  .article-grid{grid-template-columns:1fr}
  .cat-empty-ctas{flex-direction:column;align-items:center}
}
</style>

<div class="blog-page">

  <!-- Hero -->
  <div class="blog-hero">
    <h1>הבלוג של LiftyGo</h1>
    <p>מדריכים, טיפים וסיפורים מעולם ההובלות — לכם ולמובילים שלנו</p>
  </div>

  <!-- Category Tabs -->
  <div class="cat-tabs">
    <div class="cat-tabs-inner">
      <button class="tab-btn active" onclick="showCat('all',this)">כל המאמרים</button>
      <button class="tab-btn" onclick="showCat('moving-tips',this)">טיפים להובלה</button>
      <button class="tab-btn" onclick="showCat('moving-services',this)">שירותי הובלה</button>
      <button class="tab-btn" onclick="showCat('guides',this)">מדריכים</button>
      <button class="tab-btn" onclick="showCat('customer-stories',this)">סיפורי לקוחות</button>
      <button class="tab-btn" onclick="showCat('news',this)">חדשות ועדכונים</button>
    </div>
  </div>

  <!-- Content -->
  <div class="blog-content">

    <!-- ALL -->
    <div class="cat-section visible" id="cat-all">
      <div class="article-grid">

        <a href="https://liftygo.co.il/moving-cost-guide/" class="article-card" style="text-decoration:none">
          <div class="card-thumb" style="background:#4f1d9e;padding:0;overflow:hidden">
            <img src="https://liftygo.co.il/wp-content/uploads/2026/05/moving-cost-guide-cover.png" alt="כמה עולה הובלת דירה" style="width:100%;height:100%;object-fit:cover;display:block">
            <span class="card-cat">מדריכים · טיפים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>7 דקות קריאה</span></div>
            <div class="card-title">כמה עולה הובלת דירה? מדריך מחירים 2026</div>
            <div class="card-excerpt">מה משפיע על המחיר, טווחי מחירים לפי גודל דירה, ו-5 דרכים לחסוך בהובלה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

        <a href="https://liftygo.co.il/moving-jobs-israel/" class="article-card" style="text-decoration:none">
          <div class="card-thumb" style="background:#4f1d9e;padding:0;overflow:hidden">
            <img src="https://liftygo.co.il/wp-content/uploads/2026/05/moving-jobs-guide-cover.png" alt="מדריך למוביל המתחיל" style="width:100%;height:100%;object-fit:cover;display:block">
            <span class="card-cat">מדריכים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>פברואר 2026</span><span>·</span><span>6 דקות קריאה</span></div>
            <div class="card-title">איך למצוא עבודות הובלה — המדריך למוביל המתחיל</div>
            <div class="card-excerpt">המדריך המלא למוביל המתחיל — לידים, פלטפורמות, ובניית הכנסה קבועה מהובלות.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

        <a href="https://liftygo.co.il/how-to-choose-movers/" class="article-card" style="text-decoration:none">
          <div class="card-thumb thumb-guides" style="background:linear-gradient(135deg,#4f1d9e,#7434db)">
            <span class="card-cat">מדריכים · טיפים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>6 דקות קריאה</span></div>
            <div class="card-title">איך לבחור מוביל דירה — המדריך המלא 2026</div>
            <div class="card-excerpt">5 דברים שחייבים לבדוק לפני שחותמים: רישיון, ביטוח, חוות דעת, מחיר בכתב — וכל דגלי האזהרה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

      </div>
    </div>

    <!-- MOVING TIPS -->
    <div class="cat-section" id="cat-moving-tips">
      <div class="cat-section-title">טיפים להובלה</div>
      <div class="article-grid">
        <a href="https://liftygo.co.il/moving-cost-guide/" class="article-card" style="text-decoration:none">
          <div class="card-thumb" style="background:#4f1d9e;padding:0;overflow:hidden">
            <img src="https://liftygo.co.il/wp-content/uploads/2026/05/moving-cost-guide-cover.png" alt="כמה עולה הובלת דירה" style="width:100%;height:100%;object-fit:cover;display:block">
            <span class="card-cat">טיפים להובלה</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>7 דקות קריאה</span></div>
            <div class="card-title">כמה עולה הובלת דירה? מדריך מחירים 2026</div>
            <div class="card-excerpt">מה משפיע על המחיר, טווחי מחירים לפי גודל דירה, ו-5 דרכים לחסוך בהובלה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>
        <a href="https://liftygo.co.il/how-to-choose-movers/" class="article-card" style="text-decoration:none">
          <div class="card-thumb thumb-guides" style="background:linear-gradient(135deg,#4f1d9e,#7434db)">
            <span class="card-cat">טיפים להובלה</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>6 דקות קריאה</span></div>
            <div class="card-title">איך לבחור מוביל דירה — המדריך המלא 2026</div>
            <div class="card-excerpt">5 דברים שחייבים לבדוק לפני שחותמים: רישיון, ביטוח, חוות דעת, מחיר בכתב — וכל דגלי האזהרה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>
      </div>
    </div>

    <!-- MOVING SERVICES -->
    <div class="cat-section" id="cat-moving-services">
      <div class="cat-section-title">שירותי הובלה</div>
      <div class="cat-empty">
        <div class="cat-empty-icon">🚚</div>
        <h3>מאמרים בדרך...</h3>
        <p>אנחנו מכינים מדריכים מקיפים על שירותי הובלה — פינוי פסולת, עגורנים, אחסון ועוד. יעלו בקרוב!</p>
        <div class="cat-empty-ctas">
          <a href="https://liftygo.co.il/" class="btn-primary">הזמינו הובלה עכשיו</a>
          <a href="https://liftygo.co.il/joinus/" class="btn-secondary">הצטרפו כמוביל</a>
        </div>
      </div>
    </div>

    <!-- GUIDES -->
    <div class="cat-section" id="cat-guides">
      <div class="cat-section-title">מדריכים</div>
      <div class="article-grid">

        <a href="https://liftygo.co.il/moving-cost-guide/" class="article-card" style="text-decoration:none">
          <div class="card-thumb" style="background:#4f1d9e;padding:0;overflow:hidden">
            <img src="https://liftygo.co.il/wp-content/uploads/2026/05/moving-cost-guide-cover.png" alt="כמה עולה הובלת דירה" style="width:100%;height:100%;object-fit:cover;display:block">
            <span class="card-cat">מדריכים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>7 דקות קריאה</span></div>
            <div class="card-title">כמה עולה הובלת דירה? מדריך מחירים 2026</div>
            <div class="card-excerpt">מה משפיע על המחיר, טווחי מחירים לפי גודל דירה, ו-5 דרכים לחסוך בהובלה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

        <a href="https://liftygo.co.il/moving-jobs-israel/" class="article-card" style="text-decoration:none">
          <div class="card-thumb" style="background:#4f1d9e;padding:0;overflow:hidden">
            <img src="https://liftygo.co.il/wp-content/uploads/2026/05/moving-jobs-guide-cover.png" alt="מדריך למוביל המתחיל" style="width:100%;height:100%;object-fit:cover;display:block">
            <span class="card-cat">מדריכים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>פברואר 2026</span><span>·</span><span>6 דקות קריאה</span></div>
            <div class="card-title">איך למצוא עבודות הובלה — המדריך למוביל המתחיל</div>
            <div class="card-excerpt">המדריך המלא למוביל המתחיל — לידים, פלטפורמות, ובניית הכנסה קבועה מהובלות.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

        <a href="https://liftygo.co.il/how-to-choose-movers/" class="article-card" style="text-decoration:none">
          <div class="card-thumb thumb-guides" style="background:linear-gradient(135deg,#4f1d9e,#7434db)">
            <span class="card-cat">מדריכים</span>
          </div>
          <div class="card-body">
            <div class="card-meta"><span>מאי 2026</span><span>·</span><span>6 דקות קריאה</span></div>
            <div class="card-title">איך לבחור מוביל דירה — המדריך המלא 2026</div>
            <div class="card-excerpt">5 דברים שחייבים לבדוק לפני שחותמים: רישיון, ביטוח, חוות דעת, מחיר בכתב — וכל דגלי האזהרה.</div>
            <span class="card-link">קרא עוד ←</span>
          </div>
        </a>

      </div>
    </div>

    <!-- CUSTOMER STORIES -->
    <div class="cat-section" id="cat-customer-stories">
      <div class="cat-section-title">סיפורי לקוחות</div>
      <div class="cat-empty">
        <div class="cat-empty-icon">⭐</div>
        <h3>הסיפורים מגיעים...</h3>
        <p>אנחנו אוספים חוויות אמיתיות מלקוחות LiftyGo. כבר הזמנתם הובלה? ספרו לנו!</p>
        <div class="cat-empty-ctas">
          <a href="https://liftygo.co.il/" class="btn-primary">הזמינו הובלה עכשיו</a>
        </div>
      </div>
    </div>

    <!-- NEWS -->
    <div class="cat-section" id="cat-news">
      <div class="cat-section-title">חדשות ועדכונים</div>
      <div class="cat-empty">
        <div class="cat-empty-icon">📢</div>
        <h3>עדכונים בדרך...</h3>
        <p>חדשות על LiftyGo, שיפורים בפלטפורמה ועדכוני שוק — יעלו בקרוב.</p>
        <div class="cat-empty-ctas">
          <a href="https://liftygo.co.il/" class="btn-primary">הזמינו הובלה עכשיו</a>
          <a href="https://liftygo.co.il/joinus/" class="btn-secondary">הצטרפו כמוביל</a>
        </div>
      </div>
    </div>

  </div><!-- /blog-content -->
</div><!-- /blog-page -->

<script>
function showCat(cat, btn) {
  document.querySelectorAll('.cat-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('cat-' + cat).classList.add('visible');
  btn.classList.add('active');
}
</script>`;

async function main() {
  const tmpl = cloneWithNewIds(template);
  const sections = tmpl.content;

  // Use nav (section 0) and footer (section 3) from template
  // Build a simple 2-section Elementor page: nav + blog content + footer
  const navSection = sections[0];
  const footerSection = sections[3];

  const blogSection = {
    id: uid(), elType: 'section', isInner: false,
    settings: { stretch_section: 'section-stretched', layout: 'full_width', padding: { unit:'px', top:'0', right:'0', bottom:'0', left:'0', isLinked:true } },
    elements: [{
      id: uid(), elType: 'column', isInner: false,
      settings: { _column_size: 100, _inline_size: null },
      elements: [{
        id: uid(), elType: 'widget', widgetType: 'html', isInner: false, elements: [],
        settings: { html: BLOG_CONTENT }
      }]
    }]
  };

  const elementorData = [navSection, blogSection, footerSection];

  // Check if blog page already exists
  const existing = await apiReq('GET', '/wp-json/wp/v2/pages?slug=blog&_fields=id,slug');

  let result;
  if (existing.length > 0) {
    console.log('Blog page exists (ID:', existing[0].id, '), updating...');
    result = await apiReq('PATCH', '/wp-json/wp/v2/pages/' + existing[0].id, {
      title: 'הבלוג של LiftyGo',
      status: 'publish',
      template: 'elementor_canvas',
      meta: { _elementor_data: JSON.stringify(elementorData), _elementor_edit_mode: 'builder', _elementor_version: '3.0.0', _elementor_template_type: 'page' }
    });
  } else {
    console.log('Creating blog page...');
    result = await apiReq('POST', '/wp-json/wp/v2/pages', {
      title: 'הבלוג של LiftyGo',
      slug: 'blog',
      status: 'publish',
      template: 'elementor_canvas',
      meta: { _elementor_data: JSON.stringify(elementorData), _elementor_edit_mode: 'builder', _elementor_version: '3.0.0', _elementor_template_type: 'page' }
    });
  }

  if (result.id) {
    console.log('✓ Blog page ready | ID:', result.id, '| Link:', result.link);
  } else {
    console.log('Response:', JSON.stringify(result).substring(0, 300));
  }
}
main().catch(console.error);
