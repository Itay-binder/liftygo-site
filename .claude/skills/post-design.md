# LiftyGo Post Designer

## Purpose
Design and export branded social media posts for liftygo.co.il. Generates HTML files that render as pixel-perfect branded posts, ready for screenshot/export.

## Brand System (Always Apply)

**Colors:**
- Hero gradient: `linear-gradient(135deg, #8952E0 0%, #4F1D9E 100%)`  
- Light gradient: `linear-gradient(180deg, #FFFFFF 0%, #E2CCFF 100%)`
- Primary blue: `#6EC1E4` | Accent green: `#61CE70` | Lavender: `#E2CCFF`
- Purple CTA: `#7434DB` | Dark text: `#2D2152` | Gray: `#7A7A7A`

**Fonts:** Rubik (Hebrew, wght 400–800) + Roboto (Latin). Always RTL (`dir="rtl"`).

**Voice:** ידידותי, ישיר, אמוג'י פה-ושם, CTAs ישירות.

## Workflow

When `/post-design` is invoked, ask for or use the provided:
1. **Topic / post goal** — what's this post about? (e.g. "מאמר חדש על מחיר הובלה" / "טיפ שבועי" / "קידום הצטרפות מובילים")
2. **Audience** — לקוחות (מזמינים הובלה) or מובילים (נהגים/חברות)
3. **Format** — Facebook (1200×630) or Instagram square (1080×1080)

Then:
1. Generate the HTML file to `posts/YYYY-MM-DD-slug.html`
2. Print the file path and tell the user to open it in a browser and screenshot it
3. Offer to send a preview message via WhatsApp (GreenAPI)

## HTML Template (Dark — for engagement posts)

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px; /* or 1080x1080 for Instagram */
  background: linear-gradient(135deg, #8952E0 0%, #4F1D9E 100%);
  font-family: 'Rubik', sans-serif;
  direction: rtl;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  position: relative;
}
.card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 24px;
  padding: 48px 56px;
  max-width: 900px;
  width: 100%;
  backdrop-filter: blur(10px);
}
.logo { color: #6EC1E4; font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px; }
.headline { color: #fff; font-size: 52px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
.sub { color: rgba(255,255,255,0.75); font-size: 24px; font-weight: 400; line-height: 1.5; margin-bottom: 32px; }
.cta {
  display: inline-block; background: #fff; color: #7434DB;
  font-size: 20px; font-weight: 700; padding: 14px 32px;
  border-radius: 10px; text-decoration: none;
}
.badge {
  position: absolute; bottom: 40px; left: 56px;
  background: rgba(255,255,255,0.12); border-radius: 8px;
  padding: 8px 16px; color: rgba(255,255,255,0.6); font-size: 16px;
}
.dots {
  position: absolute; top: -60px; right: -60px;
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(110,193,228,0.3) 0%, transparent 70%);
  border-radius: 50%;
}
</style>
</head>
<body>
<div class="dots"></div>
<div class="card">
  <div class="logo">LiftyGo ⚡</div>
  <div class="headline"><!-- HEADLINE HERE --></div>
  <div class="sub"><!-- SUBTEXT HERE --></div>
  <div class="cta"><!-- CTA TEXT --></div>
</div>
<div class="badge">liftygo.co.il</div>
</body>
</html>
```

## HTML Template (Light — for tips/info posts)

```html
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;800;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1200px; height: 630px;
  background: linear-gradient(180deg, #FFFFFF 0%, #E2CCFF 100%);
  font-family: 'Rubik', sans-serif;
  direction: rtl;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  position: relative;
}
.card { max-width: 860px; width: 100%; padding: 0 40px; }
.logo { color: #7434DB; font-size: 20px; font-weight: 700; letter-spacing: 1px; margin-bottom: 28px; }
.tag {
  display: inline-block; background: #E2CCFF; color: #7434DB;
  font-size: 16px; font-weight: 600; padding: 6px 16px;
  border-radius: 20px; margin-bottom: 20px;
}
.headline { color: #2D2152; font-size: 52px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
.sub { color: #54595F; font-size: 22px; font-weight: 400; line-height: 1.55; margin-bottom: 32px; }
.cta {
  display: inline-block; background: #7434DB; color: #fff;
  font-size: 20px; font-weight: 700; padding: 14px 32px;
  border-radius: 10px; text-decoration: none;
}
.blob {
  position: absolute; bottom: -100px; left: -80px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, #B795EC 0%, transparent 70%);
  border-radius: 50%; opacity: 0.4;
}
.badge { position: absolute; top: 36px; left: 48px; color: #7A7A7A; font-size: 15px; }
</style>
</head>
<body>
<div class="blob"></div>
<div class="badge">liftygo.co.il</div>
<div class="card">
  <div class="logo">LiftyGo</div>
  <div class="tag"><!-- TAG e.g. "טיפ שבועי" --></div>
  <div class="headline"><!-- HEADLINE --></div>
  <div class="sub"><!-- SUBTEXT --></div>
  <div class="cta"><!-- CTA --></div>
</div>
</body>
</html>
```

## GreenAPI — Send WhatsApp Notification

After generating a post, offer to send Itay a WhatsApp message:

```bash
curl -s -X POST \
  "https://api.green-api.com/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd" \
  -H "Content-Type: application/json" \
  -d "{\"chatId\":\"972553005865@c.us\",\"message\":\"MESSAGE_HERE\"}"
```

## Output Format

Always end with:
1. File saved at: `posts/YYYY-MM-DD-slug.html`
2. "פתח את הקובץ בדפדפן, הגדל לגודל מסך מלא (Ctrl+Shift+M בDevTools → 1200×630), וצלם screenshot"
3. Ask: "לשלוח הודעת WhatsApp על הפוסט?"
