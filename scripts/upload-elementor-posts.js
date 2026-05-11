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
  let result = str;
  ids.forEach(id => { result = result.split(id).join(uid()); });
  return JSON.parse(result);
}

function patch(postId, body) {
  const payload = JSON.stringify(body);
  return new Promise((r) => {
    const req = https.request({
      hostname:'liftygo.co.il', path:'/wp-json/wp/v2/posts/'+postId,
      method:'PATCH',
      headers:{'Authorization':'Basic '+creds,'Content-Type':'application/json','Content-Length':Buffer.byteLength(payload)}
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>r(JSON.parse(d))); });
    req.write(payload); req.end();
  });
}

function makeHeroHTML(title, category, categorySlug, dateStr, readTime, intro, coverImage) {
  const imgHtml = coverImage ? `
  <div class="lg-cover-wrap">
    <img class="lg-cover-img" src="${coverImage}" alt="${title}" />
  </div>` : '';

  return `<div class="lg-article-hero">
  <div class="lg-article-meta">
    <a href="https://liftygo.co.il/blog/category/${categorySlug}/" class="lg-tag">${category}</a>
    <span class="lg-meta-sep">·</span><span>${dateStr}</span>
    <span class="lg-meta-sep">·</span><span>${readTime} דקות קריאה</span>
  </div>
  <h1 class="lg-article-title">${title}</h1>
  <p class="lg-article-intro">${intro}</p>${imgHtml}
</div>
<style>
.lg-article-hero{padding:36px 0 20px}
.lg-article-meta{display:flex;align-items:center;gap:8px;font-size:13px;color:#6b7280;margin-bottom:14px;flex-wrap:wrap;font-family:'Rubik',sans-serif}
.lg-tag{background:#E2CCFF;color:#7434DB;padding:3px 12px;border-radius:100px;font-size:12px;font-weight:700;text-decoration:none}
.lg-meta-sep{color:#d1d5db}
.lg-article-title{font-size:clamp(22px,4vw,38px);font-weight:900;color:#2D2152;line-height:1.25;margin-bottom:14px;font-family:'Rubik',sans-serif}
.lg-article-intro{font-size:16px;color:#374151;line-height:1.75;max-width:680px;font-family:'Rubik',sans-serif;margin-bottom:24px}
.lg-cover-wrap{width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(79,29,158,.12);margin-bottom:8px}
.lg-cover-img{width:100%;height:auto;display:block;max-height:460px;object-fit:cover}
</style>`;
}

// ── Post 1792 content ──────────────────────────────────────────────
const content1792 = `<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
.ab{font-family:'Rubik',sans-serif;color:#374151;line-height:1.8;font-size:16px}
.ab h2{font-size:clamp(18px,2.5vw,24px);font-weight:800;color:#2D2152;margin:32px 0 10px}
.ab p{margin-bottom:14px}
.ab ul,.ab ol{padding-right:22px;margin-bottom:14px}
.ab li{margin-bottom:7px}
.ab .note{background:#f9f6fd;border-right:4px solid #A379E7;border-radius:0 10px 10px 0;padding:14px 18px;margin:18px 0;font-size:15px}
.ab table{width:100%;border-collapse:collapse;margin:18px 0;font-size:15px}
.ab th{background:#2D2152;color:#fff;padding:11px 15px;text-align:right;font-weight:700}
.ab td{padding:11px 15px;border-bottom:1px solid #e5e7eb}
.ab tr:nth-child(even) td{background:#f9f6fd}
.cta-box{background:linear-gradient(135deg,#4f1d9e,#7434db);border-radius:14px;padding:28px;text-align:center;margin:28px 0;color:#fff}
.cta-box h3{font-size:19px;font-weight:800;margin-bottom:8px;color:#fff;font-family:'Rubik',sans-serif}
.cta-box p{opacity:.88;margin-bottom:16px;font-size:14px}
.cta-box a{background:#fff;color:#4f1d9e;font-weight:800;font-size:15px;padding:11px 28px;border-radius:10px;text-decoration:none;display:inline-block}
</style>
<div class="ab">

<h2>למה כדאי להצטרף ל-LiftyGo כמוביל?</h2>
<p>LiftyGo היא פלטפורמה שמחברת בין לקוחות שמחפשים הובלה לבין מובילים מקצועיים. במקום לבזבז כסף על פרסום ולהתמודד עם שיחות סרק — אתה מקבל לידים מסוננים עם כל הפרטים שצריך.</p>

<div class="note">כל ליד מגיע עם מפרט מלא: גודל דירה, קומה, עיר מוצא ויעד, תאריך ושם הלקוח. לא ניחושים — מידע אמיתי.</div>

<h2>מה מייחד את הלידים של LiftyGo?</h2>
<ul>
  <li>לידים מסוננים — רק לקוחות שמוכנים להזמין</li>
  <li>מפרט מלא עם כל הפרטים לפני שמחליטים</li>
  <li>אחריות מלאה — ליד שלא עמד בהבטחה מוחזר</li>
  <li>ללא דמי פרסום מראש</li>
</ul>

<h2>כמה מרוויח מוביל ב-LiftyGo?</h2>
<table>
  <tr><th>מסלול</th><th>הכנסה ממוצעת לחודש</th></tr>
  <tr><td>מוביל חלקי (5–10 הובלות/חודש)</td><td>6,000–12,000 ₪</td></tr>
  <tr><td>מוביל מלאכותי (15–25 הובלות/חודש)</td><td>15,000–30,000 ₪</td></tr>
</table>

<h2>איך להצטרף?</h2>
<ol>
  <li>נכנסים לדף ההצטרפות ומגישים פרטים בסיסיים</li>
  <li>עוברים אימות — LiftyGo בודקת ציוד וניסיון</li>
  <li>מתחילים לקבל לידים לאזורכם תוך 48 שעות</li>
  <li>בוחרים אילו לידים לקחת ואילו לדחות</li>
</ol>

<div class="cta-box">
  <h3>מוכן להצטרף?</h3>
  <p>מובילים שמצטרפים היום מתחילים לקבל לידים תוך 48 שעות.</p>
  <a href="https://liftygo.co.il/joinus/">הצטרפו כמוביל ←</a>
</div>

<h2>שאלות נפוצות</h2>
<table>
  <tr><th>שאלה</th><th>תשובה</th></tr>
  <tr><td>כמה עולה ליד?</td><td>תלוי במסלול — צרו קשר לפרטים</td></tr>
  <tr><td>מה הטריטוריה שלי?</td><td>אתה בוחר את האזורים המתאימים</td></tr>
  <tr><td>מה אם הליד לא רלוונטי?</td><td>מוחזר — LiftyGo מתחייבת</td></tr>
</table>

</div>`;

// ── Post 2894 content ──────────────────────────────────────────────
const content2894 = `<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
.ab{font-family:'Rubik',sans-serif;color:#374151;line-height:1.8;font-size:16px}
.ab h2{font-size:clamp(18px,2.5vw,24px);font-weight:800;color:#2D2152;margin:32px 0 10px}
.ab h3{font-size:16px;font-weight:700;color:#2D2152;margin-bottom:4px}
.ab p{margin-bottom:14px}
.qbox{background:#f9f6fd;border-right:4px solid #7434DB;border-radius:0 10px 10px 0;padding:18px 22px;margin:0 0 32px;font-size:16px;line-height:1.8}
.qbox strong{color:#4f1d9e}
.factors{display:grid;gap:10px;margin-bottom:32px}
.fc{display:flex;gap:14px;padding:16px 18px;border:1px solid rgba(116,52,219,.13);border-radius:13px;background:#fff;box-shadow:0 2px 12px rgba(79,29,158,.05)}
.fn{width:34px;height:34px;min-width:34px;border-radius:50%;background:linear-gradient(135deg,#7434db,#4f1d9e);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;flex-shrink:0}
.fb h3{font-size:15px;font-weight:700;color:#2D2152;margin-bottom:3px}
.fb p{font-size:14px;color:#374151;margin:0;line-height:1.6}
.ptw{border-radius:13px;overflow:hidden;border:1px solid rgba(116,52,219,.13);margin-bottom:32px;box-shadow:0 2px 12px rgba(79,29,158,.05)}
.ptw table{width:100%;border-collapse:collapse;font-size:14px}
.ptw thead th{background:linear-gradient(135deg,#4f1d9e,#7434db);color:#fff;font-weight:700;padding:12px 16px;text-align:right;font-size:13px}
.ptw tbody td{padding:11px 16px;border-bottom:1px solid rgba(116,52,219,.07)}
.ptw tbody tr:nth-child(even){background:#f8f7ff}
.ptw tbody tr:last-child td{border-bottom:none}
.pv{font-weight:800;color:#7434db}
.tnote{font-size:12px;color:#6b7280;margin-top:8px;margin-bottom:28px}
.tips{display:grid;gap:9px;margin-bottom:32px}
.tr{display:flex;gap:12px;padding:13px 16px;background:#f8f7ff;border-radius:9px;align-items:flex-start}
.td{width:7px;height:7px;min-width:7px;border-radius:50%;background:linear-gradient(135deg,#7434db,#4f1d9e);margin-top:7px}
.tc{font-size:14px;line-height:1.6}
.tc strong{color:#2D2152;display:block;margin-bottom:1px}
.cta-box{background:linear-gradient(135deg,#4f1d9e,#7434db);border-radius:14px;padding:28px;text-align:center;margin:28px 0;color:#fff}
.cta-box h3{font-size:19px;font-weight:800;margin-bottom:8px;color:#fff;font-family:'Rubik',sans-serif}
.cta-box p{opacity:.88;margin-bottom:16px;font-size:14px}
.cta-box a{background:#fff;color:#4f1d9e;font-weight:800;font-size:15px;padding:11px 28px;border-radius:10px;text-decoration:none;display:inline-block}
.faqlist{display:grid;gap:8px;margin-bottom:28px}
.fi{border:1px solid rgba(116,52,219,.13);border-radius:11px;overflow:hidden}
.fq{width:100%;background:#fff;border:none;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:14px 18px;font-family:'Rubik',sans-serif;font-size:14px;font-weight:700;color:#2D2152;text-align:right;direction:rtl;cursor:pointer}
.fi-icon{width:22px;height:22px;min-width:22px;border-radius:50%;border:2px solid #7434db;display:flex;align-items:center;justify-content:center;color:#7434db;font-size:16px;font-weight:300;line-height:1}
.fa{display:none;padding:0 18px 14px;font-size:14px;color:#374151;line-height:1.65;border-top:1px solid rgba(116,52,219,.07);background:#f8f7ff}
.fa.open{display:block}
.fq.open .fi-icon{background:#7434db;color:#fff}
</style>
<div class="ab">

<div class="qbox">
מחיר הובלת דירה נע בין <strong>1,200 ₪ לסטודיו</strong> לבין <strong>8,000 ₪ ומעלה לבית פרטי</strong>. המחיר נקבע בעיקר לפי <strong>זמן העבודה בפועל</strong>, בתוספת דלק, ביטוח, בלאי, ועלויות נגישות ומורכבות. הפער בין הצעות שונות יכול להגיע ל-50% — לכן חשוב להשוות.
</div>

<h2>מה משפיע על מחיר ההובלה?</h2>
<p style="color:#6b7280;font-size:15px;margin-bottom:18px">הגורם המרכזי הוא <strong>זמן העבודה</strong> — כל שעה עולה. לכך מתווספות עלויות קבועות (דלק, ביטוח, בלאי) ועלויות משתנות לפי הנסיבות.</p>
<div class="factors">
<div class="fc"><div class="fn">1</div><div class="fb"><h3>זמן העבודה</h3><p>הגורם הדומיננטי. גודל הדירה, נפח החפצים וכמות הפועלים קובעים כמה שעות תימשך ההובלה.</p></div></div>
<div class="fc"><div class="fn">2</div><div class="fb"><h3>נגישות ונגישות</h3><p>קומה גבוהה בלי מעלית, מרחק מהמשאית לכניסה, חניה — כולם מוסיפים זמן ועלות.</p></div></div>
<div class="fc"><div class="fn">3</div><div class="fb"><h3>פירוק, הרכבה וחפצים כבדים</h3><p>ארונות מורכבים, כספות, פסנתר, ממ"דים — כל פריט כבד או מורכב מייקר משמעותית.</p></div></div>
<div class="fc"><div class="fn">4</div><div class="fb"><h3>דלק, ביטוח ובלאי</h3><p>עלויות קבועות שכל מוביל מחשב: שחיקת רכב, דלק, ביטוח מטען. משתנות לפי מרחק.</p></div></div>
<div class="fc"><div class="fn">5</div><div class="fb"><h3>עיתוי ועונתיות</h3><p>סוף חודש (28–1) = שיא ביקוש = +15–30%. אמצע חודש בימות החול = הכי זול.</p></div></div>
<div class="fc"><div class="fn">6</div><div class="fb"><h3>שירותים נוספים</h3><p>אריזה, עגורן, פינוי פסולת, אחסון — כל שירות מחוץ ל"הוצאה-טעינה-פריקה" מוסיף לחשבון.</p></div></div>
</div>

<h2>טווחי מחירים — 2026</h2>
<div class="ptw"><table>
<thead><tr><th>גודל הדירה</th><th>טווח מחירים</th><th>זמן עבודה משוער</th></tr></thead>
<tbody>
<tr><td>סטודיו / חדר + מטבחון</td><td class="pv">1,200 – 1,800 ₪</td><td>2–4 שעות</td></tr>
<tr><td>2 חדרים</td><td class="pv">2,300 – 3,000 ₪</td><td>4–6 שעות</td></tr>
<tr><td>3 חדרים</td><td class="pv">2,800 – 3,500 ₪</td><td>6–8 שעות</td></tr>
<tr><td>4 חדרים</td><td class="pv">3,500 – 5,000 ₪</td><td>8–10 שעות</td></tr>
<tr><td>5 חדרים</td><td class="pv">6,000 – 8,000 ₪</td><td>10–14 שעות</td></tr>
<tr><td>בית פרטי / קוטג'</td><td class="pv">8,000 ₪ ומעלה</td><td>יום ומעלה</td></tr>
</tbody>
</table></div>
<p class="tnote">* הערכה בלבד — המחיר הסופי משתנה לפי קומה, נגישות, מרחק, פירוק/הרכבה, חפצים כבדים, ביטוח ועיתוי ההובלה.</p>

<div class="cta-box">
<h3>במקום לנחש — קבלו הצעות מחיר אמיתיות</h3>
<p>שאלון קצר אחד → הצעות מ-3 מובילים מאומתים → בוחרים ונעים.</p>
<a href="https://liftygo.co.il/">קבלו הצעת מחיר חינם ←</a>
</div>

<h2>5 דרכים לחסוך</h2>
<div class="tips">
<div class="tr"><div class="td"></div><div class="tc"><strong>הזמינו באמצע החודש</strong>תאריכים 10–20 — הזולים ביותר.</div></div>
<div class="tr"><div class="td"></div><div class="tc"><strong>קבלו 3 הצעות מחיר לפחות</strong>פערים של עד 50% לאותה עבודה.</div></div>
<div class="tr"><div class="td"></div><div class="tc"><strong>ארזו לבד את מה שאפשר</strong>כל שעה שחוסכים = כסף.</div></div>
<div class="tr"><div class="td"></div><div class="tc"><strong>פנו רהיטים שלא עוברים</strong>פחות נפח = עלות נמוכה יותר.</div></div>
<div class="tr"><div class="td"></div><div class="tc"><strong>הגדירו הכל בכתב</strong>מה שלא מפורט בהסכם יכול להפוך לתוספת.</div></div>
</div>

<h2>שאלות נפוצות</h2>
<div class="faqlist">
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>האם מובילים גובים לפי שעה או לפי הובלה?</span><span class="fi-icon">+</span></button><div class="fa">רוב המובילים מתמחרים לפי הובלה שלמה — ודאות על המחיר הסופי.</div></div>
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>מתי הכי יקר לעשות הובלה?</span><span class="fi-icon">+</span></button><div class="fa">סוף חודש (28–1), קיץ (יולי–אוגוסט) וערב חגים. אמצע חודש בחורף = הכי זול.</div></div>
<div class="fi"><button class="fq" onclick="var a=this.nextElementSibling,o=a.classList.toggle('open');this.classList.toggle('open');this.querySelector('.fi-icon').textContent=o?'−':'+';"><span>האם הביטוח כלול?</span><span class="fi-icon">+</span></button><div class="fa">לרוב לא אוטומטית. שאלו מראש וודאו שיש אחריות בכתב.</div></div>
</div>

</div>`;

async function processPost(postId, meta) {
  console.log('Processing post', postId, '—', meta.title);

  const tmpl = cloneWithNewIds(template);
  const sections = tmpl.content;

  // Update breadcrumb (section 1, first html widget)
  const bcWidget = sections[1]?.elements?.[0]?.elements?.[0];
  if (bcWidget?.settings?.html) {
    bcWidget.settings.html = `<nav class="lg-breadcrumb" aria-label="נתיב ניווט" style="font-family:'Rubik',sans-serif;font-size:13px;color:#6b7280;padding:12px 0 4px">
  <a href="https://liftygo.co.il/" style="color:#6b7280;text-decoration:none">LiftyGo</a>
  <span style="margin:0 6px;color:#d1d5db">›</span>
  <a href="https://liftygo.co.il/blog/" style="color:#6b7280;text-decoration:none">בלוג</a>
  <span style="margin:0 6px;color:#d1d5db">›</span>
  <span style="color:#374151;font-weight:500">${meta.title}</span>
</nav>`;
  }

  // Section 2: elements[0] = main content column, elements[1] = sidebar column
  const mainSection = sections[2];
  const mainCol = mainSection.elements[0]; // main content column

  if (!mainCol || !mainCol.elements) { console.log('Cannot find main column'); return; }

  // Keep: card CSS widget (first), reactions widget (second to last), mystery widget (last)
  const cardCssWidget = mainCol.elements[0];
  const reactionsWidget = mainCol.elements[mainCol.elements.length - 2];
  const lastWidget = mainCol.elements[mainCol.elements.length - 1];

  // Hero widget
  const heroWidget = {
    id: uid(), elType: 'widget', widgetType: 'html', isInner: false, elements: [],
    settings: { html: makeHeroHTML(meta.title, meta.category, meta.categorySlug, meta.date, meta.readTime, meta.intro, meta.coverImage) }
  };

  // Content widget
  const contentWidget = {
    id: uid(), elType: 'widget', widgetType: 'html', isInner: false, elements: [],
    settings: { html: meta.contentHtml }
  };

  mainCol.elements = [cardCssWidget, heroWidget, contentWidget, reactionsWidget, lastWidget];

  const result = await patch(postId, {
    meta: {
      _elementor_data: JSON.stringify(tmpl.content),
      _elementor_edit_mode: 'builder',
      _elementor_template_type: 'post',
      _elementor_version: '3.0.0'
    },
    template: 'elementor_canvas'
  });

  if (result.id) {
    console.log('✓ Post', postId, 'updated | link:', result.link);
  } else {
    console.log('✗ Error:', JSON.stringify(result).substring(0, 300));
  }
}

const posts = [
  {
    id: 1792,
    title: 'איך למצוא עבודות הובלה — המדריך למוביל המתחיל',
    category: 'מדריך למוביל', categorySlug: 'movers-guide',
    date: 'פברואר 2026', readTime: 6,
    intro: 'המדריך המלא למוביל המתחיל — איך להשיג לידים, להשוות פלטפורמות, ולבנות הכנסה קבועה מהובלות.',
    coverImage: 'https://liftygo.co.il/wp-content/uploads/2026/05/moving-jobs-guide-cover.png',
    contentHtml: content1792
  },
  {
    id: 2894,
    title: 'כמה עולה הובלת דירה? מדריך מחירים 2026',
    category: 'מדריך לקוח', categorySlug: 'moving-guides',
    date: 'מאי 2026', readTime: 7,
    intro: 'מה משפיע על המחיר, איך לא לשלם יותר מדי, ואיך לקבל הצעות מחיר ממובילים מאומתים תוך דקות.',
    coverImage: 'https://liftygo.co.il/wp-content/uploads/2026/05/moving-cost-guide-cover.png',
    contentHtml: content2894
  }
];

async function main() {
  for (const p of posts) {
    await processPost(p.id, p);
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('\nDone.');
}
main().catch(console.error);
