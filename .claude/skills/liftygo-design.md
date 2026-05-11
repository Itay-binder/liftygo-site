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
Primary light:  #a855f7  (glow, accents)
White:          #ffffff
Gray-50:        #f8f7ff
Gray-100:       #f0edf9
Gray-200:       #e5e0f0
Text dark:      #1a1030
Text body:      #374151
Text muted:     #6b7280
```

**גרדיאנט hero:** `linear-gradient(135deg, #0a0520 0%, #1a0a42 40%, #3d1a8e 100%)`
**גרדיאנט כפתורים:** `linear-gradient(135deg, #7434db, #4f1d9e)`
**גרדיאנט CTA section:** `linear-gradient(135deg, #1a0a42 0%, #4f1d9e 100%)`
**Glow:** `0 0 40px rgba(116, 52, 219, 0.35)`

---

## פונטים
- **עברית:** Heebo (ראשי), Rubik (משנה)
- **כותרות:** Bold/ExtraBold (700–800)
- **גוף:** Regular (400), 16–17px, line-height 1.8
- **RTL תמיד**

---

## שפת עיצוב

### Glassmorphism (חובה בכרטיסיות ואלמנטים מרחפים)
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 32px rgba(79, 29, 158, 0.25);
border-radius: 16px;
```

### כרטיסיות על רקע בהיר
```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(10px);
border: 1px solid rgba(116, 52, 219, 0.15);
box-shadow: 0 4px 24px rgba(79, 29, 158, 0.08);
border-radius: 16px;
transition: transform 0.2s, box-shadow 0.2s;
/* hover: translateY(-2px) + stronger shadow */
```

### Purple Glow (על אלמנטים dark)
```css
box-shadow: 0 0 40px rgba(116, 52, 219, 0.4);
/* radial-gradient בפסאודו-אלמנט לעומק */
```

### Soft shadows (כלל)
- לא צלל חד וכבד
- `box-shadow: 0 4px 24px rgba(79, 29, 158, 0.08)` — אלמנטים רגילים
- `box-shadow: 0 8px 32px rgba(79, 29, 158, 0.2)` — hover / focus

---

## קומפוננטים

### Nav (Sticky)
- רקע: `rgba(255,255,255,0.95)` + `backdrop-filter: blur(20px)`
- גובה: 64px
- לוגו LiftyGo בצד ימין (RTL)
- לינקים: הזמנת הובלה | הצטרפות מובילים | בלוג
- כפתור CTA: gradient + box-shadow glow

### Hero Section
- רקע: dark purple gradient
- Radial glow pseudoelements (::before / ::after)
- Category badge: glassmorphism pill
- H1: לבן, clamp(28px, 5vw, 52px), font-weight 900
- `.hl` highlight: `background: rgba(168, 85, 247, 0.3)`, border-radius 8px

### Factor Cards (על רקע בהיר)
- Glassmorphism style
- מספר סגול עם glow
- hover: lift + stronger shadow

### Pricing Table
- thead: dark gradient `#1a0a42` → `#4f1d9e`
- ערכי מחיר: `#7434db`, bold
- שורות: סירוג `rgba(79, 29, 158, 0.03)`

### CTA Sections (inline + bottom)
- dark purple gradient background
- radial glow pseudoelements
- כפתור: לבן עם טקסט סגול (inline) / gradient עם צל glow (bottom)

### FAQ Accordion
- glass cards
- border-bottom גרדיאנט סגול

---

## כללי עיצוב

### מותר ✅
- Minimalism נקי עם הרבה חללים
- Soft cinematic lighting
- Purple glow עדין ליצירת עומק
- Glassmorphism מדויק
- Gradients חלקים
- מילים: premium, elegant, futuristic, clean

### אסור ❌
- ניאון אגרסיבי
- עיצוב "פלייר זול"
- אייקונים מצוירים / childish
- עומס ויזואלי
- עיצוב גיימינג
- סמוך לוגיסטיקה ישנה

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
