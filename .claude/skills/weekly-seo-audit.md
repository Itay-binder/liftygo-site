# weekly-seo-audit — LiftyGo Weekly SEO Agent

## מטרה
ביקורת SEO שבועית מקיפה: וורדפרס + יוטיוב + סיכום אסטרטגי.
רץ כל יום חמישי ב-09:15. שולח דוח WhatsApp ל-972526660006.

---

## כלים ו-Credentials

```js
// טען מ-.env
CREDS_WP    = base64("claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9")
REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
CLIENT_ID     = process.env.GOOGLE_CLIENT_ID
CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
GSC_SITE      = process.env.GSC_SITE
WA_TARGET     = "972526660006@c.us"
```

---

## חלק א — ביקורת פוסטים בוורדפרס

### א1 — שלוף את כל הפוסטים המפורסמים

```bash
curl -s -H "Authorization: Basic $CREDS_WP" \
  "https://liftygo.co.il/wp-json/wp/v2/posts?status=publish&per_page=100&_fields=id,title,slug,link,categories,meta,date"
```

### א2 — לכל פוסט בדוק את הנקודות הבאות

#### 🔍 אינדוקס
- בדוק אם ה-ID נמצא ב-`$noindex_ids` בקובץ `seo/snippets/noindex.php`
- אם כן → **מחוץ לאינדוקס** (תקין אם זה מכוון, חשוד אם לא)

#### 📝 Meta Tags (snippet 8)
בדוק ב-`seo/snippets/meta-tags.php`:
- קיים ב-`$custom_titles[]`? אם לא → **חסר title tag**
- קיים ב-`$pages[]` עם `desc`, `og_title`, `og_url`? אם לא → **חסר meta description / OG**
- `og_image` קיים? אם לא → **חסרה תמונת שיתוף**

#### 🏷️ Schema JSON-LD
בדוק אם ה-`wp_head` כולל BlogPosting schema לפוסט זה:
- `headline` = כותרת
- `datePublished`, `dateModified`
- `author`, `publisher`
- `mainEntityOfPage`
אם חסר → **הוסף schema**

#### 🔗 Internal Links
עבור את תוכן הפוסט ובדוק:
- יש לפחות קישור אחד ל-`https://liftygo.co.il/` עם anchor רלוונטי
- יש קישורים לפוסטים אחרים בבלוג (internal linking)
- אם אין → **סמן לתיקון**

#### 📣 CTA
בדוק שיש בתוכן:
- לפחות כפתור/קישור "קבלו הצעת מחיר" → `liftygo.co.il/`
- לפוסטי מובילים: לפחות "הצטרפו כמוביל" → `liftygo.co.il/joinus/`

#### 🏷️ URL Slug
- אין תעתיק עברית (כמו `havalat`, `kama-ole`)? אם יש → **slug בעייתי**
- slug הגיוני ומתאר את התוכן?

#### 🖼️ Featured Image
- `featured_media > 0`? אם לא → **חסרה תמונת נושא**

### א3 — בצע תיקונים אוטומטיים

**ניתן לתקן אוטומטית:**
1. הוסף title tag חסר ל-`$custom_titles[]`
2. הוסף meta description + OG tags חסרים ל-`$pages[]`
3. הוסף BlogPosting schema חסר
4. דחוף snippets 5 + 8 לאחר שינויים

**דורש סקירה ידנית (דגל לדוח):**
- internal links חסרים
- CTA חסר
- slug בעייתי
- featured image חסר

### א4 — GSC Data לכל URL

שאל את Search Console לכל slug:
```
POST /webmasters/v3/sites/{site}/searchAnalytics/query
{ dimensions: ["page"], startDate: "28daysAgo", endDate: "today" }
```

עבור כל פוסט הצג: clicks, impressions, position ממוצע.

---

## חלק ב — דוח יוטיוב

### ב1 — נתוני ערוץ

```js
GET /youtube/v3/channels?part=snippet,statistics&mine=true
```

שלוף: subscribers, totalViews, videoCount

### ב2 — נתוני סרטונים (30 ימים אחרונים)

```js
GET /youtube/v3/videos?part=snippet,statistics,contentDetails&chart=mostPopular&regionCode=IL&maxResults=10
```

עבור כל סרטון LiftyGo: views, likes, comments, duration.

```js
// נתוני ה-channel עצמו
GET /youtube/v3/channels?part=contentDetails&mine=true
// → uploadsPlaylistId
GET /youtube/v3/playlistItems?playlistId={id}&part=snippet&maxResults=20
// → videoIds
GET /youtube/v3/videos?part=statistics,snippet&id={ids}
```

### ב3 — ניתוח

- איזה סרטון קיבל הכי הרבה צפיות?
- מה אחוז הסרטונים עם תגיות / תיאור מלא?
- האם יש shorts שמקבלים חשיפה גבוהה?
- SEO impact: האם סרטונים מדורגים לפי keywords?

---

## חלק ג — סיכום אסטרטגי SEO

### ג1 — ניתוח GSC כולל

```
POST searchAnalytics/query
{ dimensions: ["query"], startDate: "28daysAgo", endDate: "today", rowLimit: 50 }
```

- Keywords שהאתר מדורג עליהם (top 20)
- Keywords עם הרבה impressions אבל מיקום > 10 (הזדמנויות)
- CTR ממוצע לפי קטגוריה

### ג2 — הערכה ידנית (Claude מחליט)

על בסיס כל הנתונים, ענה על:

**מה עובד טוב:**
- אילו עמודים / keywords צוברים momentum?
- איזה תוכן מביא הכי הרבה traffic?

**מה צריך חיזוק:**
- תחומים שאין לנו תוכן עליהם
- ערים / long-tail שלא מכוסות

**ערוצים נוספים מומלצים לחיזוק SEO:**

בדוק לפי מה שכבר קיים ומה רלוונטי לשוק הישראלי:

| ערוץ | SEO Impact | מה לעשות |
|------|-----------|----------|
| YouTube Shorts | גבוה | להמשיך + לקשר לאתר בתיאור |
| Google Business Profile | גבוה מאוד לוקאלי | לאמת + לפרסם עדכונים |
| WhatsApp Business | בינוני | לינק לאתר בפרופיל |
| Instagram | נמוך ישיר, גבוה לbrand | bio link + reels |
| TikTok | נמוך ישיר, גבוה לvirality | שקול Shorts-first |
| פייסבוק | בינוני | קבוצות הובלה ישראליות |
| פודקאסט | נמוך, brand authority | לא דחוף |
| PR / אתרי נישה | גבוה מאוד (backlinks) | יד2, מדלן, ברוקרים |

---

## פורמט דוח WhatsApp

```
*🔍 דוח SEO שבועי — LiftyGo*
_[תאריך]_

*פוסטים באתר:*
✅ [מספר] פוסטים תקינים
⚠️ [מספר] פוסטים עם בעיות:
• [כותרת פוסט]: חסר meta description
• [כותרת פוסט]: חסרה תמונת שיתוף
• [כותרת פוסט]: slug בעייתי

*תיקונים שבוצעו אוטומטית:*
• הוספתי schema ל-[פוסט]
• עדכנתי meta description ל-[פוסט]

*יוטיוב — 30 ימים:*
📹 [X] סרטונים | 👁️ [X] צפיות
🏆 הכי חזק: "[שם סרטון]" — [X] צפיות
💡 המלצה: [מה כדאי להוסיף]

*הזדמנויות GSC:*
• "[keyword]": [X] חשיפות, מיקום #[X] — שווה מאמר
• "[keyword]": [X] חשיפות, מיקום #[X]

*המלצה לשבוע הבא:*
[1-2 משפטים ממוקדים מה הפעולה הכי חשובה]
```

---

## כללי ביצוע

1. **אל תשנה** פוסטים שלא בטוח מה הם — דגל אותם לדוח בלבד
2. **snippet 5 + 8** — דחוף רק אם שינית משהו
3. **git commit** בסוף אם היו שינויים בקבצי snippet
4. **WhatsApp** — שלח תמיד, גם אם הכל תקין
5. **זמן ריצה** — אל תבזבז יותר מ-5 דקות על חקירה של דף אחד
