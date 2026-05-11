# article-writer — LiftyGo Automated Article Agent

## מטרה
כתיבה, עיצוב והעלאה של מאמר SEO חדש לאתר liftygo.co.il,
בהתבסס על המלצת Agent 2 (`reports/content-recommendation-latest.json`).

---

## שלב 1 — קרא את המלצת Agent 2

```js
const rec = JSON.parse(fs.readFileSync('reports/content-recommendation-latest.json', 'utf8'));
const article = rec.article;          // { title, slug }
const keyword  = rec.recommendation.opportunity.query;
const opps     = rec.opportunities;   // keyword opportunities array
```

---

## שלב 2 — בדוק אם מאמר על הנושא כבר קיים

```bash
curl -s -H "Authorization: Basic $(echo -n 'claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9' | base64 -w0)" \
  "https://liftygo.co.il/wp-json/wp/v2/posts?slug={SLUG}&_fields=id,slug"
```

- אם קיים → קח את ה-keyword הבא ב-`opps[]` שאין לו מאמר
- חזור על הבדיקה עד שמוצאים keyword ללא מאמר

---

## שלב 3 — מחקר (WebFetch)

לפני כתיבת התוכן, בצע WebFetch על הנושא:

### מקורות לבדוק:
1. גוגל Search Console: קרא את `rec.opportunities` לנתוני חשיפות/מיקום
2. קובץ מחקר מילים: `seo/keyword-research.md`
3. מחקר מתחרים: קרא מאמר של מתחרה בנושא דומה (GetMoving / hvl / GetPacking) דרך WebFetch
4. נתוני שוק: אם רלוונטי — WebFetch לאתר של הלמ"ס (www.cbs.gov.il) לנתוני הגירה/דיור

### מה לחפש:
- מחירים עדכניים לפי גודל דירה / עיר
- עובדות מוכחות על שוק ההובלות בישראל
- שאלות שאנשים שואלים (מ-GSC data)

---

## שלב 4 — בנה slug תקין

### כללי slug:
- **אנגלית בלבד** — אין עברית, אין תעתיק (kama-ole = אסור)
- פורמט: `kebab-case`, lowercase, a-z ו-0-9 בלבד
- דוגמאות תקינות: `tel-aviv-moving-guide`, `how-to-choose-movers`, `apartment-moving-checklist`
- דוגמאות אסורות: `havalat-dira-mehir`, `kama-ole-havalat-dira`, `Tel-Aviv-Moving`

### מיפוי נושאים ל-slugs:
| נושא | Slug |
|------|------|
| הובלת דירה תל אביב | `tel-aviv-moving-guide` |
| הובלת דירה ירושלים | `jerusalem-moving-guide` |
| הובלת דירה חיפה | `haifa-moving-guide` |
| הובלת דירה ראשון לציון | `rishon-lezion-moving` |
| הובלת דירה פתח תקווה | `petah-tikva-moving` |
| איך לבחור מוביל | `how-to-choose-movers` |
| כמה מרוויח מוביל | `mover-income-israel` |
| עבודות הובלה למובילים | `moving-jobs-tips` |
| הכנה להובלת דירה | `apartment-moving-checklist` |
| הובלת רהיטים | `furniture-moving-guide` |
| הובלת פסנתר | `piano-moving-guide` |
| הובלת מרקטפלייס | `marketplace-item-delivery` |

---

## שלב 5 — קבע קטגוריות WordPress

| סוג מאמר | קטגוריות (IDs) |
|----------|----------------|
| מדריך לקוח (מחירים, טיפים) | 5 (טיפים להובלה), 7 (מדריכים) |
| מדריך גאוגרפי (עיר ספציפית) | 7 (מדריכים) |
| מדריך למוביל (עבודה, לידים) | 7 (מדריכים) |
| שירותי הובלה מיוחדים | 6 (שירותי הובלה), 7 (מדריכים) |

---

## שלב 6 — כתוב את המאמר

### מבנה חובה לכל מאמר:

```
[hero image placeholder — אם יש]
[quick-box] — תשובה ישירה לשאלה בכותרת (40-60 מילים, לפיצ'רד סניפט)
[H2] מה משפיע על... / איך לבחור... / מה מרוויחים...
  [factor cards OR ordered list]
[H2] נתונים/מחירים (טבלה אם רלוונטי)
[cta-box mid-article] — קבלו הצעת מחיר / הצטרפו כמוביל
[H2] טיפים מעשיים
[H2] שאלות נפוצות (3 שאלות — לכל שאלה תשובה מפורטת)
[bottom cta]
```

### כללי כתיבה:
- **H1** = כולל מילת המפתח הראשית + שנה (2026)
- **פסקה ראשונה** = עונה ישירות על הכותרת (featured snippet)
- **H2s** = שאלות שאנשים מחפשים בגוגל
- **טון** = ידידותי, ישיר, עברית תקינה, ללא ז'רגון
- **אורך** = 900-1,200 מילים
- **internal link** = קישור אחד ל-`https://liftygo.co.il/` עם עוגן רלוונטי
- **RTL** = תמיד `dir="rtl"`, `text-align: right`
- **פונט** = Heebo דרך `@import` (לא `<link>`)

### CSS — השתמש בעיצוב מ-`liftygo-design.md`:
- רקע ברירת מחדל: לבן
- כותרות: `#2D2152`, Heebo 800-900
- כפתורים: `linear-gradient(135deg, #7434db, #4f1d9e)`
- כרטיסיות: border `rgba(116,52,219,.14)`, radius 14px, shadow רך
- CTA sections: gradient כהה סגול
- **אין glow/זוהרים**

---

## שלב 7 — העלה לוורדפרס

### 7א — צור את תוכן הפוסט

השתמש במבנה מ-`scripts/upload-elementor-posts.js`:
- clone template JSON מ-`posts/blog-article.elementor.json`
- `cloneWithNewIds()` — IDs חדשים לכל widget
- breadcrumb מעודכן עם שם המאמר
- hero widget: `makeHeroHTML(title, category, categorySlug, date, readTime, intro, coverImage)`
- content widget: כל HTML המאמר

### 7ב — צור פוסט חדש ב-WordPress

```bash
curl -s -X POST \
  "https://liftygo.co.il/wp-json/wp/v2/posts" \
  -H "Authorization: Basic $(echo -n 'claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9' | base64 -w0)" \
  -H "Content-Type: application/json" \
  -d '{"title":"TITLE","slug":"SLUG","status":"publish","categories":[CAT_IDS],"template":"elementor_canvas","meta":{"_elementor_data":"...","_elementor_edit_mode":"builder","_elementor_version":"3.0.0"}}'
```

### 7ג — הוסף לרשימת noindex (snippet 5)

הוסף את ה-post ID החדש ל-`seo/snippets/noindex.php`:
```php
XXXX, // [כותרת המאמר] — ממתין לאישור אינדוקס
```

ודחוף ל-WordPress:
```bash
PATCH https://liftygo.co.il/wp-json/code-snippets/v1/snippets/5
```

### 7ד — הוסף meta tags (snippet 8)

הוסף ל-`seo/snippets/meta-tags.php` תחת `$custom_titles` ו-`$pages[]`:
```php
XXXX => "TITLE | LiftyGo",
// ב-$pages[]:
XXXX => [
  "desc"     => "META DESCRIPTION 150 תווים",
  "og_title" => "TITLE | LiftyGo",
  "og_url"   => "https://liftygo.co.il/SLUG/",
  "og_image" => "IMAGE_URL_IF_EXISTS",
],
```

ודחוף ל-WordPress:
```bash
PATCH https://liftygo.co.il/wp-json/code-snippets/v1/snippets/8
```

---

## שלב 8 — עדכן עמוד בלוג

הוסף כרטיס מאמר חדש ל-`scripts/create-blog-page.js`:
- בסקשן "כל המאמרים" ובסקשן הקטגוריה המתאימה
- כרטיס עם: תמונה (אם יש) / gradient, קטגוריה badge, כותרת, תקציר, תאריך, זמן קריאה

הרץ את הסקריפט לעדכון עמוד הבלוג:
```bash
node scripts/create-blog-page.js
```

---

## שלב 9 — git commit ו-push

```bash
git add seo/snippets/ posts/ scripts/create-blog-page.js
git commit -m "feat: new article — TITLE (SLUG)"
git push origin master
```

---

## שלב 10 — שלח WhatsApp

שלח ל-972526660006 דרך GreenAPI:

```bash
curl -s -X POST \
  "https://api.green-api.com/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd" \
  -H "Content-Type: application/json" \
  -d '{"chatId":"972526660006@c.us","message":"מאמר חדש עלה לאוויר!\n\nכותרת: TITLE\nלינק: https://liftygo.co.il/SLUG/\nמילת מפתח: KEYWORD\n\nהמאמר כרגע noindex. השב \"תעלה\" לאנדקס."}'
```

---

## כללי חשובים

1. **slug — אנגלית בלבד**, ללא תעתיק עברי
2. **noindex תמיד בהתחלה** — מחכים ל"תעלה" מהמשתמש
3. **אם מאמר קיים על הנושא** → קח את ה-keyword הבא מ-`opps[]`
4. **תוכן מבוסס עובדות** — אל תמציא מחירים; השתמש בנתונים מ-`seo/keyword-research.md` ומהמחקר
5. **meta description** = 145-160 תווים, כולל מילת המפתח, עם CTA
6. **אל תשנה** דפים קיימים — רק פוסטים חדשים
