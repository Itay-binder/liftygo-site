# LiftyGo Site — CLAUDE.md

## מה האתר
**liftygo.co.il** — פלטפורמה ישראלית להזמנת הובלות.
- לקוחות: ממלאים שאלון → מקבלים הצעות מחיר ממובילים → בוחרים הצעה
- מובילים: מצטרפים, מקבלים לידים חמים, משלמים לפי מסלול

## גישה ל-WordPress
- **URL:** https://liftygo.co.il
- **API user:** claudeSeo
- **Application Password:** שמור ב-`memory/project_wordpress_access.md`
- **Auth header:** `Authorization: Basic $(echo -n "claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9" | base64)`

## ארכיטקטורת ה-SEO

### פלאגינים שהותקנו
| פלאגין | מטרה |
|--------|-------|
| Code Snippets (ID בוורדפרס) | הרצת PHP snippets ללא עריכת files |

### Snippets פעילים (Code Snippets)
| ID | שם | מטרה |
|----|----|----- |
| 5 | LiftyGo SEO - Noindex | `noindex, nofollow` על 16 דפים פנימיים |
| 8 | LiftyGo SEO - Meta Tags | Title, meta description, OG tags, Schema JSON-LD |

### דפים מקודמים (index)
| ID | URL | מטרה |
|----|-----|-------|
| 30 | `/` | דף הבית — לקוחות שמחפשים הובלה |
| 1911 | `/joinus/` | הצטרפות מובילים — מסלול רגיל |
| 2884 | `/joinus-wholesaler/` | הצטרפות מובילים — מסלול סיטונאי |
| 1792 | `/moving-jobs-israel/` | פוסט בלוג SEO (ממוקד מובילים) |

### דפים noindex (לא לקדם)
883, 868, 1, 2, 663, 1666, 1777, 1771, 1765, 1896, 1950, 2039, 2078, 2087, 2362, 2869

## כללים חשובים
- **אסור לשנות תוכן דפים** — רק meta tags, alt text, snippets
- לפני שינוי snippet — לבדוק תחילה דרך API
- כל snippet PHP חדש → לעדכן את הטבלה למעלה
- כתיבת מאמרים → רק כ-posts חדשים, לא עריכת עמודים קיימים

## כלים שבשימוש
```bash
CREDS=$(echo -n "claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9" | base64)

# קריאה
curl -s -H "Authorization: Basic $CREDS" "https://liftygo.co.il/wp-json/wp/v2/pages"

# עדכון snippet
curl -s -H "Authorization: Basic $CREDS" -H "Content-Type: application/json" \
  -X PATCH "https://liftygo.co.il/wp-json/code-snippets/v1/snippets/5" \
  --data-raw '{"code": "..."}'

# עדכון alt text תמונה
curl -s -H "Authorization: Basic $CREDS" -H "Content-Type: application/json" \
  -X POST "https://liftygo.co.il/wp-json/wp/v2/media/302" \
  --data-raw '{"alt_text": "לוגו LiftyGo"}'
```

## תוכנית תוכן — מאמרים עתידיים
ראה `seo/content-plan.md`

## מבנה הריפו
```
liftygo-site/
├── CLAUDE.md              # המדריך הזה
├── seo/
│   ├── snippets/          # קוד PHP של ה-snippets
│   │   ├── noindex.php
│   │   └── meta-tags.php
│   ├── content-plan.md    # גאנט תוכן ומאמרים
│   └── audit.md           # ניתוח SEO ראשוני
└── memory/                # זיכרון בין שיחות
```
