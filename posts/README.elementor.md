# LiftyGo — Blog Article Template (Elementor)

טמפלייט אלמנטור למאמרי בלוג, בנוי על מערכת המותג של `posts/article-template.html` (Rubik, ‎`#7434DB`/`#A379E7`/‎`#E2CCFF`, ‎`#2D2152`).

## הקבצים

| קובץ | מטרה |
|------|------|
| `posts/blog-article-template.html` | קובץ HTML עצמאי לתצוגה מקדימה / להעתקה ל-Custom HTML | 
| `posts/blog-article.elementor.json` | ייצוא טמפלייט אלמנטור — מייבאים דרך WP Admin |

## ייבוא לאלמנטור

1. WP Admin → **Templates → Saved Templates → Import Templates**
2. בחרו את `posts/blog-article.elementor.json` ולחצו **Import Now**
3. בעריכת פוסט חדש: **+** → **My Templates** → **LiftyGo — Blog Article Template** → **Insert**

## מבנה הטמפלייט

| מקטע | סוג | עריכה |
|------|-----|------|
| Nav (לוגו + תפריט + CTA) | HTML widget (Full Width) | ערוך ב-HTML widget |
| Breadcrumb | HTML widget | ערוך ב-HTML widget |
| Article — תגית, H1, מטא, hero | HTML widget | ערוך ב-HTML widget |
| **H2 "למה חשוב לבחור מוביל אמין?"** | Heading widget | **לחיץ ועריך בכלי אלמנטור** |
| **פסקת פתיחה** | Text Editor widget | **לחיץ ועריך בעורך עשיר** |
| 5 טיפים (רשימה ממוספרת) | HTML widget | ערוך ב-HTML widget |
| **H2 "סיכום"** | Heading widget | **עריך** |
| **פסקת סיכום** | Text Editor widget | **עריך** |
| Reactions + Share | HTML widget (כפתורים פעילים) | ערוך ב-HTML widget |
| Sidebar (חיפוש, קטגוריות, פופולריים) | HTML widget בעמודה ימנית | ערוך ב-HTML widget |
| Footer | HTML widget (Full Width) | ערוך ב-HTML widget |

הכפתורים והקישורים פעילים:
- **CTA בראש הדף** מקושר ל-`https://liftygo.co.il/`
- **קישורי תפריט/קטגוריות/פוטר** מקושרים ל-URLs האמיתיים שלך
- **שיתוף בפייסבוק/וואטסאפ** — לינקי שיתוף דינמיים (יוסיף URL נוכחי)
- **העתק קישור** — כפתור JS שמעתיק `location.href`
- **לייק/דיסלייק** — מבליטים את הבחירה (TODO: לחבר ל-REST endpoint)

## דחיפה לריפו

יש לי גישת קריאה בלבד ל-GitHub, אז אני לא יכול לדחוף ישירות. שתי דרכים:

**A. דחיפה מקומית (קלאסי)**
```bash
git clone git@github.com:Itay-binder/liftygo-site.git
cd liftygo-site
# העתיקי לתוך posts/ את:
#   posts/blog-article-template.html
#   posts/blog-article.elementor.json
#   posts/README.elementor.md
git add posts/
git commit -m "feat(posts): add Elementor blog-article template"
git push
```

**B. מהפרויקט הזה**: לחצי "הורד פרויקט" ואז העתיקי את `posts/` לריפו המקומי שלך.
