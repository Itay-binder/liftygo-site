# LiftyGo Post Designer — Article Template Skill

## Purpose
Generate a complete, branded HTML article page for liftygo.co.il.
Each invocation writes a new dated file in `posts/` and uploads it to WordPress.

## When Invoked
User types `/post-design` with a topic, keyword, or audience.

---

## WordPress Upload Approach

Articles go into WordPress via REST API as **self-contained HTML** inside a post with:
- Template: `elementor_canvas` — strips all WordPress theme chrome (no header/footer/comment form)
- Font: Rubik loaded via `@import url(...)` inside a `<style>` tag at top of content (NOT a `<link>` tag — WordPress strips those from body)
- CSS: all styles embedded in the content `<style>` block. Use `!important` on `font-family` declarations to override theme fallbacks.

The standalone preview file (`posts/*.html`) has a full `<html>/<head>/<body>` shell.
The WordPress content version strips `<html>/<head>/<body>` and adds the font override at top.

Upload command (Node.js via Bash):
```js
const html = fs.readFileSync('posts/YYYY-MM-DD-slug.html', 'utf8');
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
const fontOverride = `<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
body, body *, .entry-content, .entry-content * { font-family: 'Rubik', sans-serif !important; }
.comments-area, #comments, .comment-respond, .entry-footer { display: none !important; }
</style>`;
const wpContent = fontOverride + body;
// PATCH /wp-json/wp/v2/posts/{ID} with { content: wpContent, slug: 'slug-here', template: 'elementor_canvas' }
```

---

## Brand Design System (Apply Exactly)

### Colors
| Token        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| --brand      | #A379E7   | Accents, borders, highlights   |
| --brand-2    | #7434DB   | CTA buttons, links             |
| --brand-light| #E2CCFF   | Section backgrounds, tags      |
| --brand-mid  | #D3BEF4   | Gradient light, table headers  |
| --brand-dark | #2D2152   | All headings                   |
| body text    | #374151   | Paragraphs                     |
| muted        | #6b7280   | Meta, labels, notes            |
| surface      | #f9f6fd   | Card/callout backgrounds       |
| border       | #e8e2f0   | Card and table borders         |

**Hero gradient:** `linear-gradient(175deg, #fff 40%, #ede3ff 100%)`
**Button gradient:** `linear-gradient(135deg, #A379E7, #7434DB)`
**Inline highlight `.hl`:** `background: linear-gradient(135deg, #d3bef4, #b795ec)` + color `#2D2152`

### Typography
- Font: **Rubik** (loaded via @import, wght 300–900)
- H1: Rubik 900, `clamp(28px, 5vw, 48px)`, color `#2D2152`
- H2: Rubik 800, `clamp(20px, 3vw, 26px)`, color `#2D2152`
- H3: Rubik 700, 17px, color `#2D2152`
- Body: Rubik 400, 16px, color `#374151`, line-height 1.8
- Direction: **RTL** always (`lang="he" dir="rtl"`)

### Design Rules — CRITICAL
1. **NO emoji icons in section cards or factor lists** — use numbered circles (CSS `.factor-num`) or colored dots
2. **Emojis allowed only in hero/CTA** — max 1–2 total per article, only if truly fitting
3. **Factor cards**: numbered purple circle + heading + paragraph. Clean, no icons.
4. **Cards**: `border-radius: 14px`, `border: 1px solid #e8e2f0`, hover effect `border-color: #A379E7`
5. **Category badge**: pill shape, `background: #E2CCFF`, `color: #7434DB`
6. **Tables**: `thead` with `background: #2D2152` (dark heading), price values in `color: #7434DB; font-weight: 700`

### Components
| Component          | Class                   | When to Use                        |
|-------------------|-------------------------|------------------------------------|
| Factor card grid  | `.factors-grid > .factor-card` | Explaining causes/factors   |
| Callout info      | `.callout.info`         | Key takeaways, important notes     |
| Callout tip       | `.callout.tip`          | Best practices (green accent)      |
| Pricing table     | `.table-wrapper > table` | Price comparisons                 |
| Tips list         | `.tips-list > .tip-row` | Actionable tips with dot accent    |
| Inline CTA        | `.cta-inline`           | Mid-article conversion (gradient)  |
| FAQ accordion     | `.faq-list > .faq-item` | 3 real Google search questions     |
| Bottom CTA        | `.post-cta`             | Always at end of every article     |
| Highlight span    | `<span class="hl">`     | Key phrase in H1                   |

**Reference file:** `posts/2026-05-11-havalat-dira-mehir.html` — this is the canonical design reference. Match its CSS and structure.

---

## Content Style (learned from feedback)

Model after getpacking.co.il's approach:
- **Explain WHY prices vary** (factors, not just numbers)
- Opening paragraph: direct answer to the title question (featured snippet bait, 40–60 words)
- H2s = real sub-questions users search on Google
- **Pricing tables**: always present ranges, not single prices
- CTAs: natural lead-in to getting quotes, not pushy
- **Tone**: ידידותי, ישיר — no jargon, no superlatives
- **Accuracy matters**: use real market data from `seo/keyword-research.md`

---

## Workflow

### Step 1 — Gather inputs (ask if missing)
- **Keyword / Topic** (e.g. "כמה עולה הובלת דירה")
- **Audience**: לקוחות (מזמינים הובלה) OR מובילים (נהגים/חברות)
- **Article length**: קצר (500 מילה) / רגיל (800–1,000) / מורחב (1,200+)

### Step 2 — Generate content
Structure every article as:
1. **Hero**: category badge, H1 with `.hl` on keyword, subtitle, meta (date, read time)
2. **Quick answer box** (`.quick-box`): 40–60 word direct answer for featured snippet
3. **Section 1**: Main explanatory content (factors/how-to/guide)
4. **Pricing table** (if applicable)
5. **Inline CTA** (mid-article)
6. **Tips section** (practical, actionable)
7. **FAQ** (3 questions, accordion)
8. **Bottom CTA** (`.post-cta`)

### Step 3 — Slug selection
Slug format: `{main-keyword-in-hebrew-transliteration}` or `{english-equivalent}`
- Good: `havalat-dira-mehir`, `moving-cost-guide`, `movers-join`
- Bad: full sentence transliterations like `kama-ole-havalat-dira`
- Check getpacking/competitors for slug patterns

### Step 4 — Save standalone preview file
Output: `posts/YYYY-MM-DD-{slug}.html`
Full HTML file with doctype/head/body for browser preview.

### Step 5 — Upload to WordPress
1. Create new post via `POST /wp-json/wp/v2/posts` (or update existing)
2. Set `template: 'elementor_canvas'`, `slug`, `status: 'publish'`
3. Strip `<html>/<head>/<body>` from content, prepend font override `<style>`
4. Add post ID to noindex list in snippet 5 (pending index authorization)
5. Add post ID to meta-tags.php snippet 8 (title, description, OG tags)

### Step 6 — Report and notify
1. Print the live WordPress URL
2. Send WhatsApp to **972526660006** (NOT 972553005865) via GreenAPI:

```bash
curl -s -X POST \
  "https://api.green-api.com/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd" \
  -H "Content-Type: application/json" \
  -d "{\"chatId\":\"972526660006@c.us\",\"message\":\"חדש! מאמר SEO עלה לאוויר\n\nכותרת: TITLE\nלינק: URL\n\nהמאמר כרגע noindex. השב 'תעלה' כדי לאנדקס לגוגל.\"}"
```

---

## SEO Rules (Apply in Every Article)
- H1 contains the primary keyword exactly once
- First paragraph (quick-box) answers the title question directly — 40–60 words
- Each H2 targets a real sub-query (use `seo/keyword-research.md`)
- One internal link to `https://liftygo.co.il/` in the inline or bottom CTA
- Add HTML comment `<!-- META: {description} -->` near top for meta description reference

---

## Responsive (built into every article)
- `@media (max-width: 600px)`: hero padding reduced, factor-card goes column, CTA padding smaller
- Font sizes use `clamp()` — scale automatically
- Max content width: `800px` centered
