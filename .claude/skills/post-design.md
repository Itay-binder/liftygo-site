# LiftyGo Post Designer — Article Template Skill

## Purpose
Generate a complete, branded HTML article page for liftygo.co.il.
Each invocation fills the template (`posts/article-template.html`) with new content,
saves it as a new dated file, and sends a WhatsApp notification via GreenAPI.

## When Invoked
User types `/post-design` with a topic, keyword, or audience.

---

## Brand Design System (Apply Exactly)

### Colors
| Token        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| --brand      | #A379E7   | Accents, borders, highlights   |
| --brand-2    | #7434DB   | CTA buttons, links             |
| --brand-light| #E2CCFF   | Section backgrounds, tags      |
| --brand-mid  | #D3BEF4   | Gradient light stop            |
| --brand-dark | #2D2152   | All headings                   |
| body text    | #374151   | Paragraphs                     |
| muted        | #6b7280   | Meta, labels                   |
| surface      | #f9f6fd   | Card/callout backgrounds       |

**Gradient (hero/sections):** `linear-gradient(180deg, #FFFFFF 0%, #E2CCFF 100%)`
**Gradient (buttons/CTA):** `linear-gradient(135deg, #A379E7, #7434DB)`
**Inline highlight (mm-hl):** `linear-gradient(135deg, #d3bef4, #b795ec)` + color `#2D2152`

### Typography
- Font: **Rubik** (Google Fonts, Hebrew-ready, wght 400–900)
- H1: Rubik 900, `clamp(28px, 5vw, 52px)`, color `#2D2152`
- H2: Rubik 800, `clamp(20px, 3vw, 28px)`, color `#2D2152`
- H3: Rubik 700, `clamp(17px, 2.2vw, 22px)`, color `#2D2152`
- Body: Rubik 400, 17px, color `#374151`, line-height 1.75
- Direction: **RTL** always (`dir="rtl"`, `text-align: right`)

### Components Available in Template
| Component      | Class / Element        | When to Use                        |
|---------------|------------------------|------------------------------------|
| Info callout  | `.callout.info`        | Key takeaways, important notes     |
| Tip callout   | `.callout.tip`         | Best practices, recommendations    |
| Warn callout  | `.callout.warn`        | Cautions, warnings                 |
| Stat strip    | `.stat-strip > .stat-card` | 2–4 key numbers                |
| Inline CTA    | `.cta-inline`          | Mid-article conversion point       |
| Table         | `.table-wrapper > table` | Comparisons                      |
| Highlight text| `<span class="hl">`    | Key terms inline in paragraphs     |
| FAQ accordion | `.faq-section`         | 3–6 common questions               |
| Bottom CTA    | `.post-cta-section`    | Always at end of every article     |

---

## Workflow

### Step 1 — Gather inputs (ask if missing)
- **Keyword / Topic** (e.g. "כמה עולה הובלת דירה")
- **Audience**: לקוחות (מזמינים הובלה) OR מובילים (נהגים/חברות)
- **Article length**: קצר (500 מילה) / רגיל (800–1,000) / מורחב (1,200+)

### Step 2 — Generate content
Fill ALL `{{PLACEHOLDER}}` tokens with real Hebrew content:
- `{{ARTICLE_TITLE}}` — title tag (no site name)
- `{{ARTICLE_TITLE_WITH_HL}}` — H1 with `<span class="hl">key phrase</span>` wrapping the keyword
- `{{CATEGORY}}` — e.g. "מדריך לקוח" / "טיפ למוביל" / "מחירון"
- `{{ARTICLE_SUBTITLE}}` — one sentence describing who this is for + the value
- `{{PUBLISH_DATE}}` — today's date (DD.MM.YYYY)
- `{{READ_TIME}}` — estimated reading time in minutes
- All `{{H2_N}}`, `{{BODY_SECTION_N}}` — full Hebrew content per SEO guidelines
- `{{STAT_N_NUM}}` / `{{STAT_N_LABEL}}` — real market data (see keyword-research.md)
- `{{CTA_INLINE_*}}` — audience-specific CTA (customers → "קבלו הצעת מחיר" / movers → "הצטרפו כמוביל")
- `{{CTA_BOTTOM_*}}` — strong closing CTA with guarantee-style note
- `{{FAQ_*}}` — 3 real questions users search on Google
- Remove any unused sections from the output HTML (don't leave empty placeholders)

### Step 3 — Choose components
Not every article needs every component. Use judgment:
- **Pricing articles** → always include stat strip + comparison table
- **How-to articles** → ordered lists + tip callouts
- **Lead-gen articles (movers)** → aggressive inline CTA after second H2
- **City/geo articles** → stat strip with city-specific data + bottom CTA

### Step 4 — Save file
Output file: `posts/YYYY-MM-DD-{keyword-slug}.html`
(slug = keyword in Hebrew transliterated to latin or key word in English)

### Step 5 — Report and notify
1. Print the file path
2. Print: "פתח בדפדפן — הקש F12 → Toggle Device Toolbar → הגדר לרוחב 390px למובייל / 1200px לדסקטופ"
3. Send WhatsApp notification via GreenAPI:

```bash
curl -s -X POST \
  "https://api.green-api.com/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd" \
  -H "Content-Type: application/json" \
  -d "{\"chatId\":\"972553005865@c.us\",\"message\":\"📝 *מאמר חדש מוכן!*\n\n*כותרת:* TITLE\n*קובץ:* posts/FILENAME\n*קהל:* AUDIENCE\n\nפתח בדפדפן לצפייה בעיצוב.\"}"
```

---

## SEO Rules (Apply in Every Article)
- H1 contains the primary keyword exactly once
- First paragraph answers the title question directly (40–60 words) — for featured snippet
- Each H2 is a real sub-question users search (use `seo/keyword-research.md`)
- Internal link to `https://liftygo.co.il/` with anchor text related to getting a quote
- Meta description placeholder: add as HTML comment `<!-- META: ... -->` at top of `<head>`

---

## Responsive Checklist (built into template CSS)
- Mobile (≤480px): font sizes scale down, nav CTA text hides, stat strip 2-col
- Tablet (≤768px): padding reduced, hero text smaller
- Desktop: full design with max-width 740px content column

---

## Template Location
Base template: `posts/article-template.html`
Do NOT modify the base template — always copy it to a new dated file.
