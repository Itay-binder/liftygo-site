# liftygo-design — Brand & Design Skill

## Brand DNA
LiftyGo הוא מותג טכנולוגי מודרני בעולם ההובלות בישראל.
המותג צריך להרגיש כמו **tech startup מתקדם** — לא כמו עסק הובלות מסורתי.

**ערכי ליבה:** חדשנות · אמינות · שקיפות · מהירות · סקייל

---

## צבעים

```
Primary dark:   #4f1d9e
Primary mid:    #7434db
Primary light:  #a855f7  (accents only)
White:          #ffffff
Gray-50:        #f8f7ff
Gray-100:       #f0edf9
Gray-200:       #e5e0f0
Text dark:      #1a1030
Text body:      #374151
Text muted:     #6b7280
```

**גרדיאנט כפתורים:** `linear-gradient(135deg, #7434db, #4f1d9e)`
**גרדיאנט CTA section:** `linear-gradient(135deg, #4f1d9e, #7434db)`

---

## פונטים
- **עברית:** Heebo (ראשי), Rubik (משנה)
- **כותרות:** Bold/ExtraBold (700–800)
- **גוף:** Regular (400), 16–17px, line-height 1.8
- **RTL תמיד**

---

## רקע ברירת מחדל — בהיר

**ברירת המחדל היא רקע לבן/בהיר.** רקע כהה מותר רק בסקשנים ספציפיים (hero, CTA), לא כרקע עמוד שלם.

```
רקע עמוד:    #ffffff
רקע surface: #f8f7ff
רקע section: #f0edf9
```

---

## שפת עיצוב

### כרטיסיות (ברירת מחדל)
```css
background: #ffffff;
border: 1px solid rgba(116, 52, 219, 0.14);
border-radius: 16px;
box-shadow: 0 4px 20px rgba(79, 29, 158, 0.07);
transition: transform 0.2s, box-shadow 0.2s;
/* hover: translateY(-2px) + box-shadow גדול יותר */
```

### Soft shadows (כלל)
```css
/* רגיל */   box-shadow: 0 4px 20px rgba(79, 29, 158, 0.07);
/* hover */  box-shadow: 0 8px 28px rgba(79, 29, 158, 0.14);
```

### סקשן Hero / CTA (dark sections בלבד)
```css
background: linear-gradient(135deg, #4f1d9e, #7434db);
color: #fff;
```

---

## קומפוננטים

### Nav (Sticky)
- רקע: `rgba(255,255,255,0.96)` + `backdrop-filter: blur(16px)`
- גובה: 64px
- לוגו LiftyGo בצד ימין (RTL) — gradient text סגול
- לינקים: הזמנת הובלה | הצטרפות מובילים | בלוג
- כפתור CTA: gradient סגול

### Hero Section
- רקע: gradient כהה `#4f1d9e` → `#7434db` (dark section בלבד)
- Category badge: pill עם border בהיר
- H1: לבן, clamp(28px, 5vw, 52px), font-weight 900
- `.hl` highlight: `background: rgba(255,255,255,0.15)`, border-radius 8px

### Factor / Content Cards
- רקע לבן, border סגול עדין
- מספר: circle עם gradient סגול
- hover: lift קל + shadow

### Pricing Table
- thead: gradient סגול
- ערכי מחיר: `#7434db`, bold
- שורות: סירוג `#f8f7ff`

### CTA Sections (inline + bottom)
- רקע: gradient סגול כהה
- כפתור: לבן עם טקסט סגול

### FAQ Accordion
- כרטיסיות לבנות עם border עדין
- icon: circle עם border סגול

---

## כללי עיצוב

### מותר ✅
- Minimalism נקי עם הרבה whitespace
- רקע בהיר כברירת מחדל
- Soft shadows עדינים
- Gradients חלקים בסגול
- מילים: premium, elegant, clean, modern

### אסור ❌
- Glow effects / זוהרים / radial glow
- רקע כהה לעמוד שלם
- ניאון אגרסיבי
- עיצוב "פלייר זול"
- אייקונים מצוירים / childish
- עומס ויזואלי
- עיצוב גיימינג
- לוגיסטיקה ישנה

---

## Slugs
- **אנגלית בלבד**, ללא תעתיק עברי
- דוגמאות: `moving-cost-guide`, `tel-aviv-movers`, `apartment-moving-tips`
- ❌ אסור: `havalat-dira-mehir`, `kama-ole-havalat-dira`

---

## Upload לוורדפרס
- Template: `elementor_canvas`
- Font: `@import` בתוך `<style>` בגוף התוכן
- Override theme: `body, body * { font-family: 'Heebo', sans-serif !important; }`
- Hide comments: `.comments-area, #comments { display: none !important; }`
