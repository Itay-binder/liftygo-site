const fs = require('fs');
const https = require('https');
const creds = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64');
const POST_ID = 2915;

const template = JSON.parse(
  fs.readFileSync('C:/Users/itay/liftygo-site/posts/blog-article.elementor.json','utf8')
    .replace(/972500000000/g, '972553005865')
);

function uid() { return Math.random().toString(16).slice(2,9); }

function cloneWithNewIds(obj) {
  const str = JSON.stringify(obj);
  const ids = [...new Set([...str.matchAll(/"id":"([a-f0-9]{7})"/g)].map(m=>m[1]))];
  let result = str;
  ids.forEach(id => { result = result.split(id).join(uid()); });
  return JSON.parse(result);
}

function apiReq(method, path, body) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname:'liftygo.co.il', path, method,
      headers:{
        'Authorization':'Basic '+creds,
        'Content-Type':'application/json',
        ...(payload ? {'Content-Length':Buffer.byteLength(payload)} : {})
      }
    }, res => {
      let d='';
      res.on('data',c=>d+=c);
      res.on('end',()=>{ try{resolve(JSON.parse(d));}catch(e){resolve({raw:d.substring(0,500)});} });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function makeHeroHTML(title, category, dateStr, readTime, intro) {
  return `<div class="lg-article-hero">
  <div class="lg-article-meta">
    <a href="https://liftygo.co.il/blog/" class="lg-tag">${category}</a>
    <span class="lg-meta-sep">·</span><span>${dateStr}</span>
    <span class="lg-meta-sep">·</span><span>${readTime} דקות קריאה</span>
  </div>
  <h1 class="lg-article-title">${title}</h1>
  <p class="lg-article-intro">${intro}</p>
</div>
<style>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap');
.lg-article-hero{padding:36px 0 20px;font-family:'Heebo',sans-serif;direction:rtl;text-align:right}
.lg-article-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin-bottom:14px;flex-wrap:wrap}
.lg-tag{background:#E2CCFF;color:#7434DB;padding:3px 12px;border-radius:100px;font-size:12px;font-weight:700;text-decoration:none}
.lg-meta-sep{color:#d1d5db}
.lg-article-title{font-size:clamp(22px,4vw,38px);font-weight:900;color:#2D2152;line-height:1.25;margin-bottom:14px}
.lg-article-intro{font-size:16px;color:#374151;line-height:1.75;max-width:680px;margin-bottom:8px}
</style>`;
}

const articleContent = `<style>
@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800;900&display=swap');
.ab{font-family:'Heebo',sans-serif;color:#374151;line-height:1.8;font-size:16px;direction:rtl;text-align:right}
.ab h2{font-size:clamp(18px,2.5vw,24px);font-weight:800;color:#2D2152;margin:32px 0 10px}
.ab p{margin-bottom:14px}
.ab ul,.ab ol{padding-right:22px;margin-bottom:14px}
.ab li{margin-bottom:8px}
.qbox{background:#f9f6fd;border-right:4px solid #7434DB;border-radius:0 12px 12px 0;padding:20px 24px;margin:0 0 32px;font-size:16px;line-height:1.8;font-family:'Heebo',sans-serif;direction:rtl;text-align:right}
.qbox strong{color:#4f1d9e}
.screening-box{background:linear-gradient(135deg,#f3eeff,#ede8fc);border:1px solid rgba(116,52,219,.18);border-radius:13px;padding:20px 22px;margin:0 0 32px;direction:rtl;text-align:right;display:flex;gap:16px;align-items:flex-start}
.screening-icon{font-size:28px;flex-shrink:0;margin-top:2px}
.screening-box h3{font-size:15px;font-weight:800;color:#4f1d9e;margin-bottom:5px;font-family:'Heebo',sans-serif}
.screening-box p{font-size:14px;color:#374151;line-height:1.6;margin:0}
.screening-box strong{color:#4f1d9e}
.checklist{display:grid;gap:12px;margin-bottom:32px}
.chk{display:flex;gap:14px;padding:16px 18px;border:1px solid rgba(116,52,219,.13);border-radius:13px;background:#fff;box-shadow:0 2px 12px rgba(79,29,158,.05);align-items:flex-start}
.chk-num{width:34px;height:34px;min-width:34px;border-radius:50%;background:linear-gradient(135deg,#7434db,#4f1d9e);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;flex-shrink:0}
.chk-num.rec{background:linear-gradient(135deg,#9ca3af,#6b7280)}
.chk-body h3{font-size:15px;font-weight:700;color:#2D2152;margin-bottom:3px;font-family:'Heebo',sans-serif}
.chk-body p{font-size:14px;color:#374151;margin:0;line-height:1.6}
.chk-badge{display:inline-block;font-size:11px;font-weight:700;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:100px;margin-right:6px;vertical-align:middle}
.red-flags{background:#fff5f5;border-right:4px solid #ef4444;border-radius:0 12px 12px 0;padding:18px 22px;margin:0 0 28px;direction:rtl;text-align:right}
.red-flags h3{font-size:15px;font-weight:800;color:#dc2626;margin-bottom:10px;font-family:'Heebo',sans-serif}
.red-flags ul{padding-right:22px;margin:0}
.red-flags li{font-size:14px;color:#374151;margin-bottom:6px;line-height:1.6}
.compare-wrap{border-radius:13px;overflow:hidden;border:1px solid rgba(116,52,219,.13);margin-bottom:28px;box-shadow:0 2px 12px rgba(79,29,158,.05)}
.compare-wrap table{width:100%;border-collapse:collapse;font-size:14px;font-family:'Heebo',sans-serif}
.compare-wrap thead th{background:linear-gradient(135deg,#4f1d9e,#7434db);color:#fff;font-weight:700;padding:12px 16px;text-align:right;font-size:13px}
.compare-wrap tbody td{padding:11px 16px;border-bottom:1px solid rgba(116,52,219,.07)}
.compare-wrap tbody tr:nth-child(even){background:#f8f7ff}
.compare-wrap tbody tr:last-child td{border-bottom:none}
.cta-box{background:linear-gradient(135deg,#4f1d9e,#7434db);border-radius:14px;padding:28px;text-align:center;margin:28px 0;color:#fff;font-family:'Heebo',sans-serif}
.cta-box h3{font-size:19px;font-weight:800;margin-bottom:8px;color:#fff}
.cta-box p{opacity:.88;margin-bottom:16px;font-size:14px}
.cta-box a{background:#fff;color:#4f1d9e;font-weight:800;font-size:15px;padding:11px 28px;border-radius:10px;text-decoration:none;display:inline-block}
.tips-grid{display:grid;gap:9px;margin-bottom:28px}
.tip-row{display:flex;gap:12px;padding:13px 16px;background:#f8f7ff;border-radius:9px;align-items:flex-start;font-family:'Heebo',sans-serif;direction:rtl}
.tip-dot{width:7px;height:7px;min-width:7px;border-radius:50%;background:linear-gradient(135deg,#7434db,#4f1d9e);margin-top:8px;flex-shrink:0}
.tip-txt{font-size:14px;line-height:1.6}
.tip-txt strong{color:#2D2152;display:block;margin-bottom:1px}
.faqlist{display:grid;gap:8px;margin-bottom:28px;font-family:'Heebo',sans-serif}
.fi{border:1px solid rgba(116,52,219,.13);border-radius:11px;overflow:hidden}
.fq{width:100%;background:#fff;border:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 18px;font-family:'Heebo',sans-serif;font-size:14px;font-weight:700;color:#2D2152;text-align:right;direction:rtl;cursor:pointer}
.fi-icon{width:22px;height:22px;min-width:22px;border-radius:50%;border:2px solid #7434db;display:flex;align-items:center;justify-content:center;color:#7434db;font-size:16px;font-weight:300;line-height:1;flex-shrink:0}
.fa{display:none;padding:0 18px 14px;font-size:14px;color:#374151;line-height:1.65;border-top:1px solid rgba(116,52,219,.07);background:#f8f7ff;direction:rtl;text-align:right}
.fa.open{display:block}
.fq.open .fi-icon{background:#7434db;color:#fff}
</style>
<div class="ab">

<div class="qbox">
מוביל טוב מוביל דירה בלי לשבור ריהוט, בלי הפתעות במחיר, ועם ביטוח על המטען. כדי לבחור נכון — <strong>בדקו ביקורות, מחיר מפורט כולל הכל, וביטוח מטען</strong> לפני שמשלמים שקל.
</div>

<h2>5 דברים שחייבים לבדוק לפני שבוחרים מוביל</h2>
<p style="color:#6b7280;font-size:15px;margin-bottom:18px">לא כל המובילים שווים. ההבדל בין הובלה חלקה לטרגדיה יכול להיות בבדיקה אחת קטנה שלא עשיתם מראש.</p>

<div class="checklist">

<div class="chk"><div class="chk-num">1</div><div class="chk-body"><h3>ביקורות והמלצות אמיתיות</h3><p>זה הדבר הכי חשוב. חפשו את שם המוביל ב-Google Maps, פייסבוק וב-LiftyGo. ביקורות עם פרטים ספציפיים — גודל דירה, עיר, אתגר שנפתר — הן אמינות. ביקורות גנריות וקצרות יכולות להיות מזויפות. שאלו חברים ומשפחה שעברו לאחרונה — המלצה אישית שווה יותר מכל.</p></div></div>

<div class="chk"><div class="chk-num">2</div><div class="chk-body"><h3>מחיר מפורט בכתב — כולל הכל, ללא תוספות</h3><p>ודאו שהצעת המחיר <strong>כוללת הכל</strong>: עלות בסיס, דלק, מספר פועלים, פירוק והרכבה, קומות, מרחק, וכל חפץ כבד. שאלו ישירות: "האם זה המחיר הסופי? האם יהיו תוספות?" — מוביל ישר ישיב בחיוב. מוביל שמסרב לפרט או מותיר "אולי" על תוספות — עברו הלאה.</p></div></div>

<div class="chk"><div class="chk-num">3</div><div class="chk-body"><h3>ביטוח מטען</h3><p>שאלו ישירות: "יש לכם ביטוח על המטען?". מוביל רציני ישיב בחיוב ויוכל לספק פרטי פוליסה. שבירת ריהוט יקר קורה — הביטוח חוסך עוגמת נפש ומריבות.</p></div></div>

<div class="chk"><div class="chk-num">4</div><div class="chk-body"><h3>ניסיון עם הפריטים שלכם</h3><p>יש פסנתר? כספת? ארונות מורכבים? אמנות יקרה? שאלו מראש אם יש ניסיון עם פריטים כאלה. לא כל מוביל מתאים לכל עבודה — ומוביל שמציג ביטחון עצמי בלי ניסיון מוכח עלול לגרום נזק.</p></div></div>

<div class="chk"><div class="chk-num rec">5</div><div class="chk-body"><h3>רישיון ותעודת מוביל <span class="chk-badge">המלצה</span></h3><p>בישראל מוביל חייב ברישיון מטעם משרד התחבורה — זו נקודת מינימום. בפועל, ביקורות אמיתיות וחוויית לקוחות קודמים הן הבדיקה המשמעותית יותר. אפשר לבדוק דרך אתר gov.il.</p></div></div>

</div>

<div class="screening-box">
  <div class="screening-icon">🛡️</div>
  <div>
    <h3>איך LiftyGo מוודאת שהמובילים אמינים?</h3>
    <p>כל מוביל ב-LiftyGo עובר <strong>תהליך סינון מלא</strong> לפני שמצטרף — בדיקת רישיון, ציוד, ניסיון וביטוח. אנחנו <strong>מקפידים מאוד על ביקורות לקוחות</strong> ומנטרים אותן לאחר כל הובלה. מוביל שמקבל משוב שלילי מוסר מהמערכת. כך אתם מקבלים רשימת מובילים שכבר עברו סינון — ולא צריכים לגלות את זה בעצמכם.</p>
  </div>
</div>

<div class="red-flags">
<h3>דגלים אדומים — מתי לסרב</h3>
<ul>
<li>דורש תשלום במזומן מלא מראש</li>
<li>לא מוכן לתת הצעת מחיר מפורטת בכתב</li>
<li>מותיר "תלוי" על תוספות בלי לפרט</li>
<li>אין מספר טלפון קבוע — רק וואטסאפ</li>
<li>אין ביקורות ברשת מהשנה האחרונה</li>
<li>מסרב לאשר שיש ביטוח מטען</li>
<li>מחיר נמוך בצורה חריגה (50% מתחת לשוק)</li>
</ul>
</div>

<h2>השוואה: LiftyGo לעומת חיפוש עצמאי</h2>
<div class="compare-wrap"><table>
<thead><tr><th>קריטריון</th><th>LiftyGo</th><th>חיפוש עצמאי</th></tr></thead>
<tbody>
<tr><td>סינון מובילים</td><td>✅ בדיקה מלאה לפני הצטרפות</td><td>❌ אחריות עליכם</td></tr>
<tr><td>ניטור ביקורות</td><td>✅ אחרי כל הובלה</td><td>❌ פזורות ברשת</td></tr>
<tr><td>השוואת מחירים</td><td>✅ 3 הצעות בקליק</td><td>❌ שיחות טלפון רבות</td></tr>
<tr><td>ביטוח מטען</td><td>✅ דרישת חובה</td><td>❌ תלוי במוביל</td></tr>
<tr><td>זמן חיפוש</td><td>✅ 3 דקות</td><td>❌ שעות</td></tr>
</tbody>
</table></div>

<div class="cta-box">
<h3>קבלו 3 הצעות מחיר ממובילים שעברו סינון</h3>
<p>שאלון קצר → מובילים מאומתים מגיעים אליכם → בוחרים ונעים. ללא עמלה, ללא התחייבות.</p>
<a href="https://liftygo.co.il/">קבלו הצעת מחיר חינם ←</a>
</div>

<h2>5 טיפים לפני ההובלה עצמה</h2>
<div class="tips-grid">
<div class="tip-row"><div class="tip-dot"></div><div class="tip-txt"><strong>צלמו את הריהוט לפני ההובלה</strong>תיעוד ויזואלי = הגנה מלאה אם יש נזק.</div></div>
<div class="tip-row"><div class="tip-dot"></div><div class="tip-txt"><strong>הכינו רשימת חפצים מיוחדים</strong>פסנתר, אמנות, אלקטרוניקה רגישה — עדכנו את המוביל מראש.</div></div>
<div class="tip-row"><div class="tip-dot"></div><div class="tip-txt"><strong>ארזו לבד את מה שאפשר</strong>כל שעת עבודה שחוסכים = כסף. קרטונים + עיטוף = הובלה מהירה יותר.</div></div>
<div class="tip-row"><div class="tip-dot"></div><div class="tip-txt"><strong>ודאו חניה בשני הצדדים</strong>מוביל שחונה רחוק = שעת עבודה נוספת. תאמו מראש עם הבניין.</div></div>
<div class="tip-row"><div class="tip-dot"></div><div class="tip-txt"><strong>הגדירו כל "תוספת" בכתב לפני שמתחילים</strong>אם מוסיפים שירות ברגע האחרון — הסכימו על מחיר לפני, לא אחרי.</div></div>
</div>

<h2>שאלות נפוצות</h2>
<div class="faqlist">
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>כמה הצעות מחיר צריך לקבל?</span><span class="fi-icon">+</span></button><div class="fa">לפחות 3. פער של 50% בין הצעות לאותה עבודה הוא נפוץ. דרך <a href="https://liftygo.co.il/" style="color:#7434db;font-weight:700">LiftyGo</a> מקבלים 3 הצעות ממובילים שעברו סינון בלי להתקשר לאף אחד.</div></div>
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>האם מוביל זול הוא תמיד גרוע?</span><span class="fi-icon">+</span></button><div class="fa">לא בהכרח — אבל מחיר נמוך בצורה חריגה הוא סימן אזהרה. לעיתים עולות "תוספות" בסוף שלא הוזכרו מראש. השוואה נכונה היא רק על בסיס הצעה מפורטת שכוללת הכל — דלק, פועלים, קומות, פירוק.</div></div>
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>מה עושים אם נגרם נזק במהלך ההובלה?</span><span class="fi-icon">+</span></button><div class="fa">תעדו מיד בצילום ודרשו אחריות בכתב. אם המוביל מסרב — פנו לפוליסת הביטוח שלו. לכן חשוב לוודא ביטוח מטען לפני ההובלה ולא לאחר הנזק.</div></div>
</div>

</div>`;

async function run() {
  // ── 1. Re-apply Elementor template with updated content ──────────────
  console.log('Updating post', POST_ID, '...');
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
  if (!mainCol?.elements) { console.error('Cannot find main column'); return; }

  const cardCssWidget = mainCol.elements[0];
  const reactionsWidget = mainCol.elements[mainCol.elements.length - 2];
  const lastWidget = mainCol.elements[mainCol.elements.length - 1];

  const heroWidget = {
    id: uid(), elType: 'widget', widgetType: 'html', isInner: false, elements: [],
    settings: {
      html: makeHeroHTML(
        title, 'מדריך לקוח', 'מאי 2026', 6,
        'כמה דברים פשוטים לבדוק לפני שחותמים — ומה לעשות כדי שההובלה תעבור בשלום.'
      )
    }
  };

  const contentWidget = {
    id: uid(), elType: 'widget', widgetType: 'html', isInner: false, elements: [],
    settings: { html: articleContent }
  };

  mainCol.elements = [cardCssWidget, heroWidget, contentWidget, reactionsWidget, lastWidget];

  const upd = await apiReq('PATCH', '/wp-json/wp/v2/posts/' + POST_ID, {
    meta: {
      _elementor_data: JSON.stringify(tmpl.content),
      _elementor_edit_mode: 'builder',
      _elementor_template_type: 'post',
      _elementor_version: '3.0.0'
    },
    template: 'elementor_canvas'
  });

  if (upd.id) console.log('✓ Article updated | link:', upd.link);
  else { console.error('✗ Update failed:', JSON.stringify(upd).substring(0,300)); return; }

  // ── 2. Remove 2915 from noindex (publish to Google) ─────────────────
  console.log('Removing from noindex...');
  const noindexPath = 'C:/Users/itay/liftygo-site/seo/snippets/noindex.php';
  let noindexCode = fs.readFileSync(noindexPath, 'utf8');
  noindexCode = noindexCode.replace(
    `\n        ${POST_ID}, // איך לבחור מוביל דירה — ממתין לאישור אינדוקס`,
    ''
  );
  fs.writeFileSync(noindexPath, noindexCode);

  const snap5 = await apiReq('PATCH', '/wp-json/code-snippets/v1/snippets/5', { code: noindexCode });
  console.log('✓ Snippet 5 updated (2915 removed from noindex) — active:', snap5.active);

  console.log('\n=== DONE ===');
  console.log('Article: https://liftygo.co.il/how-to-choose-movers/');
  console.log('Status: indexed (robots follow)');
}

run().catch(console.error);
