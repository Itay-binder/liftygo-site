const https = require('https');
const creds = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64');

function apiReq(method, path, body) {
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((r) => {
    const opts = {
      hostname: 'liftygo.co.il', path, method,
      headers: {
        'Authorization': 'Basic ' + creds,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };
    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r({ raw: d.substring(0, 200) }); } });
    });
    if (payload) req.write(payload);
    req.end();
  });
}

const NEW_TABLE = `<div class="ptw"><table>
<thead><tr><th>גודל הדירה</th><th>טווח מחירים</th><th>זמן עבודה משוער</th></tr></thead>
<tbody>
<tr><td>סטודיו / חדר + מטבחון</td><td class="pv">1,200 – 1,800 ₪</td><td>2–4 שעות</td></tr>
<tr><td>2 חדרים</td><td class="pv">2,300 – 3,000 ₪</td><td>4–6 שעות</td></tr>
<tr><td>3 חדרים</td><td class="pv">2,800 – 3,500 ₪</td><td>6–8 שעות</td></tr>
<tr><td>4 חדרים</td><td class="pv">3,500 – 5,000 ₪</td><td>8–10 שעות</td></tr>
<tr><td>5 חדרים</td><td class="pv">6,000 – 8,000 ₪</td><td>10–14 שעות</td></tr>
<tr><td>בית פרטי / קוטג'</td><td class="pv">8,000 ₪ ומעלה</td><td>יום ומעלה</td></tr>
</tbody>
</table></div>
<p class="tnote">* המחירים הם הערכה בלבד ומשתנים לפי: זמן העבודה בפועל, קומה ונגישות, מרחק, פירוק והרכבה, חפצים כבדים, ביטוח, דלק ובלאי. לקבלת מחיר מדויק — השוו הצעות.</p>`;

const NEW_FACTORS_INTRO = `<h2>מה משפיע על מחיר ההובלה?</h2>
<p class="sec-intro" style="color:#6b7280;font-size:15px;margin-bottom:20px">הגורם העיקרי הוא <strong>זמן העבודה</strong> — ככל שההובלה ארוכה יותר כך העלות עולה. לכך מתווספות עלויות קבועות של דלק, ביטוח ובלאי, ועלויות משתנות של נגישות, קומה, ומורכבות הציוד (פירוק/הרכבה, חפצים כבדים מאוד).</p>`;

async function main() {
  // Fetch current elementor data for post 2894
  console.log('Fetching post 2894 Elementor data...');
  const post = await apiReq('GET', '/wp-json/wp/v2/posts/2894?_fields=id,meta');

  let elementorData = post.meta?._elementor_data;
  if (!elementorData) {
    console.log('No _elementor_data found. Trying alternative...');
    return;
  }

  // Parse
  let data = typeof elementorData === 'string' ? JSON.parse(elementorData) : elementorData;
  let dataStr = JSON.stringify(data);

  // Replace old price table with new one
  const oldTablePattern = /<div class=\\"ptw\\">[\s\S]*?<\/div>\s*<p class=\\"tnote\\">[^<]*<\/p>/;
  const newTableEscaped = NEW_TABLE.replace(/\n/g, '\\n').replace(/"/g, '\\"');

  if (oldTablePattern.test(dataStr)) {
    dataStr = dataStr.replace(oldTablePattern, newTableEscaped.replace(/\n/g, ''));
    console.log('✓ Price table replaced');
  } else {
    // Try direct string search
    const searchStr = '<div class=\\"ptw\\">';
    const startIdx = dataStr.indexOf(searchStr);
    if (startIdx !== -1) {
      const endMarker = '</p>';
      // Find the tnote paragraph end
      const tnoteStart = dataStr.indexOf('<p class=\\"tnote\\">', startIdx);
      if (tnoteStart !== -1) {
        const tnoteEnd = dataStr.indexOf(endMarker, tnoteStart) + endMarker.length;
        const oldContent = dataStr.substring(startIdx, tnoteEnd);
        const escaped = NEW_TABLE
          .replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
        dataStr = dataStr.substring(0, startIdx) + escaped + dataStr.substring(tnoteEnd);
        console.log('✓ Price table replaced (direct)');
      }
    } else {
      console.log('⚠ Could not find price table in data. Injecting at content start...');
    }
  }

  // Also update the intro text for the factors section
  const oldH2 = '<h2>מה משפיע על מחיר ההובלה?<\\/h2>';
  const newH2Escaped = NEW_FACTORS_INTRO
    .replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');

  if (dataStr.includes('מה משפיע על מחיר ההובלה')) {
    // Find and add the intro paragraph after the h2
    const h2Pos = dataStr.indexOf('מה משפיע על מחיר ההובלה?<\\/h2>');
    if (h2Pos !== -1) {
      const afterH2 = h2Pos + 'מה משפיע על מחיר ההובלה?<\\/h2>'.length;
      const introEscaped = `\\n<p class=\\"sec-intro\\" style=\\"color:#6b7280;font-size:15px;margin-bottom:20px\\">הגורם העיקרי הוא <strong>זמן העבודה</strong> — ככל שההובלה ארוכה יותר כך העלות עולה. לכך מתווספות עלויות קבועות: דלק, ביטוח ובלאי. ועלויות משתנות: קומה, נגישות, פירוק\\/הרכבה, חפצים כבדים מאוד.<\\/p>`;
      // Check if intro already exists
      if (!dataStr.substring(afterH2, afterH2 + 50).includes('sec-intro')) {
        dataStr = dataStr.substring(0, afterH2) + introEscaped + dataStr.substring(afterH2);
        console.log('✓ Factors intro added');
      } else {
        console.log('ℹ Factors intro already exists');
      }
    }
  }

  // Re-upload
  console.log('Uploading updated data...');
  const result = await apiReq('PATCH', '/wp-json/wp/v2/posts/2894', {
    meta: { _elementor_data: dataStr }
  });

  if (result.id) {
    console.log('✓ Post 2894 updated successfully');
    console.log('Link:', result.link);
  } else {
    console.log('Response:', JSON.stringify(result).substring(0, 300));
  }
}

main().catch(console.error);
