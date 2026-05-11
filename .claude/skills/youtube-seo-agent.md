# youtube-seo-agent — LiftyGo YouTube SEO Agent

## מטרה
סריקה מלאה של ערוץ YouTube של LiftyGo, זיהוי חוסרים SEO בכל סרטון,
התאמה למאמרי האתר, ועדכון אוטומטי של כותרות / תיאורים / תגיות / hashtags / קישורים.

---

## כלים ו-Credentials

```js
// מ-.env
CLIENT_ID     = process.env.GOOGLE_CLIENT_ID
CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
WA_TARGET     = "972526660006@c.us"
WP_CREDS      = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64')
```

---

## שלב 1 — קבל Access Token

```js
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&client_id={CLIENT_ID}
&client_secret={CLIENT_SECRET}
&refresh_token={REFRESH_TOKEN}

// → { access_token, expires_in }
// שמור: headers = { Authorization: 'Bearer ' + access_token }
```

---

## שלב 2 — שלוף את כל הסרטונים בערוץ

### 2א — נתוני ערוץ

```js
GET https://www.googleapis.com/youtube/v3/channels
  ?part=snippet,contentDetails,statistics
  &mine=true
  &{Authorization}

// → channelId, uploadsPlaylistId, subscriberCount, viewCount, videoCount
```

### 2ב — כל הסרטונים (עד 50, אחרת pageToken)

```js
GET https://www.googleapis.com/youtube/v3/playlistItems
  ?part=snippet,contentDetails
  &playlistId={uploadsPlaylistId}
  &maxResults=50
  &pageToken={nextPageToken if exists}

// → videoIds[]
```

### 2ג — פרטים מלאים לכל סרטון

```js
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,statistics,contentDetails
  &id={videoIds.join(',')}

// snippet: title, description, tags[], categoryId, defaultLanguage
// statistics: viewCount, likeCount, commentCount
// contentDetails: duration
```

---

## שלב 3 — זהה קהל יעד לכל סרטון

### כללי זיהוי (בדוק כותרת + תיאור + תגיות):

**מובילים (audience: "mover")**
- מילות מפתח: `מוביל`, `להרוויח`, `לידים`, `הכנסה`, `עבודה בהובלה`, `לצטרף`, `joinus`, `מסלול`, `פועלים`

**לקוחות (audience: "customer")**  
- מילות מפתח: `הובלת דירה`, `כמה עולה`, `לבחור מוביל`, `טיפים להובלה`, `מחיר`, `לקוח`, `דירה`

**כללי (audience: "general")**
- LiftyGo, מה זה LiftyGo, חברה, פלטפורמה

> אם לא ברור — נסה לפי ה-thumbnail/כותרת ושים audience: "unclear"

---

## שלב 4 — בדוק מאמרי אתר קיימים

שלוף את כל הפוסטים המפורסמים מ-WordPress:

```js
GET https://liftygo.co.il/wp-json/wp/v2/posts
  ?status=publish&per_page=100&_fields=id,title,slug,link
  &Authorization: Basic {WP_CREDS}

// בנה מפה: [{ id, title, slug, url }]
```

### כללי התאמה — לכל סרטון מצא מאמר קשור:

| נושא סרטון | מאמר מתאים | slug |
|-----------|------------|------|
| מחירי הובלה, כמה עולה | כמה עולה הובלת דירה | `moving-cost-guide` |
| איך לבחור מוביל | איך לבחור מוביל דירה | `how-to-choose-movers` |
| עבודה בהובלה, לידים, מובילים | איך למצוא עבודות הובלה | `moving-jobs-israel` |
| הצטרפות מובילים | דף הצטרפות | `joinus` |

> אם אין מאמר מתאים → סמן `relatedArticle: null` וציין כהזדמנות למאמר עתידי

---

## שלב 5 — בדיקת SEO לכל סרטון

### 5א — ציון לכל פריט (pass / warn / fail)

#### כותרת
- ✅ pass: מכילה מילת מפתח ראשית, 50–70 תווים, עברית ברורה
- ⚠️ warn: קצרה מדי (<30 תווים) או ללא מילת מפתח
- ❌ fail: גנרית, אנגלית בלבד, ריקה

#### תיאור
- ✅ pass: 150+ תווים, יש קישור לאתר, יש hashtags, מזכיר את מילת המפתח
- ⚠️ warn: קצר (50-150 תווים), קישור חסר או אחד בלבד
- ❌ fail: ריק או פחות מ-50 תווים

#### תגיות (tags)
- ✅ pass: 8+ תגיות, כוללות את מילות המפתח הראשיות
- ⚠️ warn: 3–7 תגיות
- ❌ fail: פחות מ-3 תגיות או ריק

#### Hashtags (בתיאור)
- ✅ pass: 3–5 hashtags רלוונטיים (`#הובלתדירה`, `#מובילים` וכו')
- ⚠️ warn: 1–2 hashtags
- ❌ fail: אין hashtags

#### קישורים בתיאור
- ✅ pass: יש קישור ל-`liftygo.co.il` + קישור למאמר קשור (אם קיים)
- ⚠️ warn: יש רק קישור ראשי לאתר
- ❌ fail: אין קישורים

#### Shorts (duration < 60s)
- בנוסף לכל הנ"ל: בדוק אם הכותרת מסתיימת ב-`#Shorts` או `| Shorts`

---

## שלב 6 — בנה תוכן מעודכן לכל סרטון שצריך תיקון

### כללי כתיבה:

**כותרת:**
- פורמט: `[פעולה/שאלה מרכזית] — [מילת מפתח] [2026]`
- Shorts: הוסף `| #Shorts` בסוף
- דוגמאות:
  - לקוחות: `"כמה עולה הובלת דירה? | מדריך מחירים 2026"`
  - מובילים: `"כמה מרוויח מוביל ב-LiftyGo? | לידים חמים 2026"`

**תיאור — מבנה חובה:**

```
[שורה 1–2: תשובה ישירה לשאלה בכותרת — לפיצ'רד סניפט]

[גוף: 3-4 משפטים המרחיבים את הנושא, כולל מילות המפתח]

---
🔗 [קישור לאתר בהתאם לקהל]:

לקוחות:   קבלו הצעת מחיר חינם → https://liftygo.co.il/
מובילים:  הצטרפו כמוביל → https://liftygo.co.il/joinus/

📖 מאמר מורחב: [כותרת מאמר] → https://liftygo.co.il/[slug]/
   (רק אם קיים מאמר קשור)

---
#הובלתדירה #[hashtag ספציפי לנושא] #LiftyGo #מובילים #ישראל
```

**תגיות — בנה לפי קהל:**

לקוחות:
```
["הובלת דירה", "כמה עולה הובלה", "מחיר הובלה", "מובילים", "LiftyGo",
 "הובלה ישראל", "הובלת רהיטים", "בחירת מוביל", "טיפים להובלה", "השוואת מחירים"]
```

מובילים:
```
["עבודה בהובלה", "לידים להובלה", "מוביל LiftyGo", "הכנסה ממובילות",
 "הצטרפות מובילים", "עצמאי בהובלה", "LiftyGo", "הובלות ישראל",
 "לידים חמים", "עסק הובלה"]
```

כללי (הוסף לכל):
```
"LiftyGo", "הובלה", "ישראל", "דירה"
```

---

## שלב 7 — עדכן ב-YouTube API

עבור כל סרטון שיש לו לפחות פריט אחד ב-fail/warn:

```js
PUT https://www.googleapis.com/youtube/v3/videos?part=snippet
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "id": "{videoId}",
  "snippet": {
    "title":        "UPDATED_TITLE",
    "description":  "UPDATED_DESCRIPTION",
    "tags":         ["TAG1", "TAG2", ...],
    "categoryId":   "22",          // People & Blogs
    "defaultLanguage": "iw"        // Hebrew
  }
}
```

> **⚠️ חשוב:** YouTube API לא מאפשר לשנות categoryId אם אינו זהה — לכן קרא את הקטגוריה הנוכחית מהשלב הקודם ושמור אותה אם היא תקינה.

> **Shorts:** אל תשנה כותרת של Short שכבר מופיע ב-Trending — בדוק views > 1,000 לפני שינוי.

---

## שלב 8 — שמור דוח

```js
fs.writeFileSync('reports/youtube-seo-latest.json', JSON.stringify({
  date: new Date().toISOString(),
  channel: { id, name, subscribers, totalViews, videoCount },
  videos: [
    {
      id, title, url: `https://youtu.be/${id}`,
      duration, isShort,
      audience,           // "mover" | "customer" | "general" | "unclear"
      relatedArticle,     // { slug, url } | null
      seoScore: { title, description, tags, hashtags, links },
      updated: true/false,
      changes: { title?, description?, tags? }
    }
  ],
  summary: {
    total, updated, noChange, missingArticles: []
  }
}, null, 2));
```

---

## שלב 9 — שלח דוח WhatsApp

```
POST https://api.green-api.com/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd

{
  "chatId": "972526660006@c.us",
  "message": "..."
}
```

### פורמט הדוח:

```
*🎬 דוח YouTube SEO — LiftyGo*
_[תאריך]_

*ערוץ:*
👥 [X] מנויים | 👁️ [X] צפיות כולל | 🎥 [X] סרטונים

*סרטונים שעודכנו ([X]):*
• "[כותרת]" — עודכנו: תיאור + תגיות + hashtags
• "[כותרת]" — עודכנה: כותרת + נוסף קישור למאמר

*בעיות שנותרו (לבדיקה ידנית):*
• "[כותרת]" — חסרה תמונה ממוזערת מותאמת
• "[כותרת]" — views נמוכים מאוד, שקול לצלם מחדש

*מאמרים מומלצים שחסרים לסרטונים:*
• "[נושא סרטון]" → שקול לכתוב מאמר: "[suggested slug]"

*המלצה לשבוע הבא:*
[1-2 משפטים ממוקדים — מה לצלם / מה לשפר]
```

---

## כללי ביצוע

1. **תמיד קרא** את התיאור והתגיות הנוכחיים לפני שינוי — אל תחליף תוכן טוב בתוכן גנרי
2. **Shorts** — שינוי כותרת רק אם views < 500 (Shorts עם וויראליות — אל תיגע)
3. **categoryId** — תמיד שמור את הקטגוריה הקיימת אלא אם היא 0
4. **defaultLanguage** — תמיד "iw" (עברית) למעט אם הסרטון באנגלית מלאה
5. **קישורים** — לקוחות → `liftygo.co.il/`, מובילים → `liftygo.co.il/joinus/`
6. **hashtags** — תמיד 3–5, תמיד בסוף התיאור, תמיד כוללים `#LiftyGo`
7. **אל תמציא נתונים** — אם לא בטוח בנושא הסרטון, ציין audience: "unclear" ודגל לסקירה ידנית
8. **לא יותר מ-500 תווים לתיאור** אם הסרטון Short (מוצג קטוע במובייל)
