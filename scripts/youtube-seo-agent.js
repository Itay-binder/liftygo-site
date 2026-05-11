const fs = require('fs');
const https = require('https');

// ── Load .env ─────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  fs.readFileSync('C:/Users/itay/liftygo-site/.env','utf8').split('\n')
    .filter(l => l.includes('=')).map(l => { const i=l.indexOf('='); return [l.slice(0,i).trim(), l.slice(i+1).trim()]; })
);

const WP_CREDS = Buffer.from('claudeSeo:yfJ0gL57BcXF3ljEBNahGDf9').toString('base64');

function httpsReq(options, body) {
  return new Promise((resolve, reject) => {
    const payload = body
      ? (typeof body === 'string' ? body : JSON.stringify(body))
      : null;
    if (payload && !options.headers) options.headers = {};
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload);
    const req = https.request(options, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve({ raw: d.substring(0,500) }); } });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function ytGet(path, token) {
  return httpsReq({
    hostname: 'www.googleapis.com', path, method: 'GET',
    headers: { Authorization: 'Bearer ' + token }
  });
}

function ytPut(path, token, body) {
  return httpsReq({
    hostname: 'www.googleapis.com', path, method: 'PUT',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  }, body);
}

function wpGet(path) {
  return httpsReq({
    hostname: 'liftygo.co.il', path, method: 'GET',
    headers: { Authorization: 'Basic ' + WP_CREDS }
  });
}

// ── Audience detection ─────────────────────────────────────────────────────────
function detectAudience(title, description, tags) {
  const text = [title, description, ...(tags||[])].join(' ').toLowerCase();
  const moverKw  = ['מוביל','להרוויח','לידים','הכנסה','עבודה בהובלה','לצטרף','joinus','מסלול','פועלים','הצטרף'];
  const custKw   = ['הובלת דירה','כמה עולה','לבחור מוביל','טיפים להובלה','מחיר','לקוח'];
  const mScore   = moverKw.filter(k => text.includes(k)).length;
  const cScore   = custKw.filter(k => text.includes(k)).length;
  if (mScore > cScore && mScore > 0) return 'mover';
  if (cScore > mScore && cScore > 0) return 'customer';
  if (mScore === 0 && cScore === 0) return 'general';
  return 'unclear';
}

// ── Article matching ─────────────────────────────────────────────────────────
function matchArticle(title, description, articles) {
  const text = (title + ' ' + description).toLowerCase();
  const rules = [
    { keywords: ['כמה עולה','מחיר הובלה','עלות הובלה','moving cost'], slug: 'moving-cost-guide' },
    { keywords: ['לבחור מוביל','how to choose','choose mover','בחירת מוביל'], slug: 'how-to-choose-movers' },
    { keywords: ['עבודות הובלה','moving jobs','לידים','עצמאי בהובלה','הצטרף כמוביל'], slug: 'moving-jobs-israel' },
  ];
  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k))) {
      const art = articles.find(a => a.slug === rule.slug);
      if (art) return { slug: art.slug, url: art.link, title: art.title.rendered };
    }
  }
  return null;
}

// ── SEO gap analysis ──────────────────────────────────────────────────────────
function analyzeSeo(video, relatedArticle) {
  const { title, description, tags } = video.snippet;
  const desc = description || '';
  const t = title || '';
  const tgs = tags || [];
  const isShort = parseDuration(video.contentDetails.duration) < 60;

  const issues = [];

  // Title
  const titleLen = t.length;
  if (titleLen < 20) issues.push({ field:'title', severity:'fail', reason:'כותרת קצרה מדי (<20 תווים)' });
  else if (titleLen < 35) issues.push({ field:'title', severity:'warn', reason:'כותרת קצרה (35-20 תווים)' });
  if (!t.match(/[֐-׿]/)) issues.push({ field:'title', severity:'warn', reason:'כותרת ללא עברית' });
  if (isShort && !t.toLowerCase().includes('short') && !desc.includes('#Shorts')) {
    issues.push({ field:'title', severity:'warn', reason:'Short ללא #Shorts בכותרת/תיאור' });
  }

  // Description
  if (!desc || desc.length < 50) issues.push({ field:'description', severity:'fail', reason:'תיאור ריק או קצר מדי' });
  else if (desc.length < 150) issues.push({ field:'description', severity:'warn', reason:'תיאור קצר (<150 תווים)' });
  if (!desc.includes('liftygo.co.il')) issues.push({ field:'links', severity:'fail', reason:'חסר קישור לאתר בתיאור' });
  if (relatedArticle && !desc.includes(relatedArticle.slug)) issues.push({ field:'links', severity:'warn', reason:'חסר קישור למאמר קשור' });

  // Hashtags
  const hashCount = (desc.match(/#\w+/g) || []).length;
  if (hashCount === 0) issues.push({ field:'hashtags', severity:'fail', reason:'אין hashtags בתיאור' });
  else if (hashCount < 3) issues.push({ field:'hashtags', severity:'warn', reason:`רק ${hashCount} hashtags (מומלץ 3-5)` });

  // Tags
  if (tgs.length === 0) issues.push({ field:'tags', severity:'fail', reason:'אין תגיות' });
  else if (tgs.length < 5) issues.push({ field:'tags', severity:'warn', reason:`רק ${tgs.length} תגיות (מומלץ 8+)` });

  return { issues, isShort };
}

function parseDuration(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 999;
  return (+(m[1]||0))*3600 + (+(m[2]||0))*60 + +(m[3]||0);
}

// ── Build updated content ─────────────────────────────────────────────────────
function buildUpdatedContent(video, audience, relatedArticle) {
  const { title, description, tags, categoryId } = video.snippet;
  const isShort = parseDuration(video.contentDetails.duration) < 60;
  const views = parseInt(video.statistics?.viewCount || 0);

  // Don't touch viral Shorts
  if (isShort && views > 1000) return null;

  const changes = {};
  const issues  = analyzeSeo(video, relatedArticle).issues;
  const failWarn = issues.filter(i => i.severity === 'fail' || i.severity === 'warn');
  if (failWarn.length === 0) return null;

  // Build tags
  const baseTags = ['LiftyGo','הובלה','ישראל','דירה'];
  const moverTags = ['עבודה בהובלה','לידים להובלה','מוביל LiftyGo','הכנסה ממובילות',
                     'הצטרפות מובילים','עצמאי בהובלה','לידים חמים','עסק הובלה'];
  const custTags  = ['הובלת דירה','כמה עולה הובלה','מחיר הובלה','מובילים',
                     'הובלה ישראל','הובלת רהיטים','בחירת מוביל','טיפים להובלה','השוואת מחירים'];

  const newTags = [...new Set([
    ...(tags || []),
    ...baseTags,
    ...(audience === 'mover' ? moverTags : custTags)
  ])].slice(0, 15);

  if (newTags.length > (tags||[]).length || (tags||[]).length < 5) {
    changes.tags = newTags;
  }

  // Build description
  const linkSection = audience === 'mover'
    ? '🔗 הצטרפו כמוביל → https://liftygo.co.il/joinus/'
    : '🔗 קבלו הצעת מחיר חינם → https://liftygo.co.il/';

  const articleSection = relatedArticle
    ? `📖 מאמר מורחב: ${relatedArticle.title} → https://liftygo.co.il/${relatedArticle.slug}/`
    : '';

  const hashtagSection = audience === 'mover'
    ? '#LiftyGo #מובילים #עבודהבהובלה #לידים #ישראל'
    : '#LiftyGo #הובלתדירה #מחירהובלה #טיפיםלהובלה #ישראל';

  if (isShort) {
    const shortDesc = `${description || ''}\n\n${linkSection}\n\n${hashtagSection}`.trim().substring(0, 500);
    if (!description || !description.includes('liftygo.co.il') || !description.includes('#LiftyGo')) {
      changes.description = shortDesc;
    }
  } else {
    const newDesc = [
      description && description.length > 50 ? description.split('---')[0].trim() : title,
      '',
      '---',
      linkSection,
      articleSection,
      '',
      hashtagSection
    ].filter(l => l !== undefined).join('\n');

    if (!description || !description.includes('liftygo.co.il') || !description.includes('#LiftyGo') || (relatedArticle && !description.includes(relatedArticle.slug))) {
      changes.description = newDesc;
    }
  }

  // Title: add year if missing and title is weak
  if (issues.some(i => i.field === 'title')) {
    const newTitle = title.includes('2026') ? title : `${title} — LiftyGo 2026`.substring(0, 100);
    if (newTitle !== title) changes.title = newTitle;
  }

  if (Object.keys(changes).length === 0) return null;
  return { changes, currentCategoryId: categoryId || '22' };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== YouTube SEO Agent — LiftyGo ===\n');

  // Step 1: Get token
  console.log('▶ Step 1: OAuth token...');
  const tokenPayload = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN
  }).toString();

  const tokenRes = await httpsReq({
    hostname:'oauth2.googleapis.com', path:'/token', method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  }, tokenPayload);

  if (!tokenRes.access_token) { console.error('Token failed:', tokenRes); return; }
  const token = tokenRes.access_token;
  console.log('  ✓ Token received\n');

  // Step 2a: Channel info
  console.log('▶ Step 2: Fetching channel...');
  const channelRes = await ytGet('/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true', token);
  if (!channelRes.items?.[0]) { console.error('No channel found:', channelRes); return; }
  const ch = channelRes.items[0];
  const uploadsPlaylistId = ch.contentDetails.relatedPlaylists.uploads;
  const channelInfo = {
    id: ch.id,
    name: ch.snippet.title,
    subscribers: ch.statistics.subscriberCount,
    totalViews: ch.statistics.viewCount,
    videoCount: ch.statistics.videoCount
  };
  console.log(`  ✓ Channel: ${channelInfo.name} | ${channelInfo.videoCount} videos | ${channelInfo.subscribers} subscribers\n`);

  // Step 2b: All video IDs
  console.log('▶ Step 2b: Fetching video list...');
  let videoIds = [];
  let pageToken = '';
  do {
    const ptParam = pageToken ? `&pageToken=${pageToken}` : '';
    const plRes = await ytGet(`/youtube/v3/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50${ptParam}`, token);
    if (!plRes.items) { console.error('Playlist error:', plRes); break; }
    videoIds.push(...plRes.items.map(i => i.contentDetails.videoId));
    pageToken = plRes.nextPageToken || '';
  } while (pageToken);
  console.log(`  ✓ Found ${videoIds.length} videos\n`);

  // Step 2c: Full video details
  console.log('▶ Step 2c: Fetching video details...');
  const videos = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i+50).join(',');
    const vRes = await ytGet(`/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${chunk}`, token);
    if (vRes.items) videos.push(...vRes.items);
  }
  console.log(`  ✓ Loaded details for ${videos.length} videos\n`);

  // Step 4: WordPress articles
  console.log('▶ Step 4: Fetching WordPress articles...');
  const wpRes = await wpGet('/wp-json/wp/v2/posts?status=publish&per_page=100&_fields=id,title,slug,link');
  const articles = Array.isArray(wpRes) ? wpRes : [];
  console.log(`  ✓ Found ${articles.length} WP articles: ${articles.map(a=>a.slug).join(', ')}\n`);

  // Step 3+5+6: Analyze and update each video
  console.log('▶ Step 3-7: Analyzing and updating videos...');
  const report = { videos: [], updated: [], noChange: [], missingArticles: [] };

  for (const video of videos) {
    const { title, description, tags } = video.snippet;
    const videoId = video.id;
    const url = `https://youtu.be/${videoId}`;
    const duration = parseDuration(video.contentDetails.duration);
    const isShort = duration < 62;
    const views = parseInt(video.statistics?.viewCount || 0);

    console.log(`\n  📹 "${title}" (${isShort?'Short':'Video'}, ${views} views)`);

    const audience = detectAudience(title, description, tags);
    const relatedArticle = matchArticle(title, description, articles);
    const { issues } = analyzeSeo(video, relatedArticle);

    console.log(`     Audience: ${audience} | Related: ${relatedArticle?.slug || 'none'}`);
    if (issues.length > 0) {
      console.log(`     Issues: ${issues.map(i=>`${i.severity}:${i.field}`).join(', ')}`);
    } else {
      console.log(`     ✅ No SEO issues`);
    }

    if (!relatedArticle) {
      report.missingArticles.push({ videoTitle: title, videoId, audience });
    }

    const update = buildUpdatedContent(video, audience, relatedArticle);

    const videoReport = {
      id: videoId, title, url, isShort, duration, views, audience,
      relatedArticle, issues,
      updated: false, changes: {}
    };

    if (update) {
      const snippetUpdate = {
        id: videoId,
        snippet: {
          title: update.changes.title || title,
          description: update.changes.description || description || '',
          tags: update.changes.tags || tags || [],
          categoryId: update.currentCategoryId,
          defaultLanguage: 'iw'
        }
      };

      try {
        const putRes = await ytPut('/youtube/v3/videos?part=snippet', token, snippetUpdate);
        if (putRes.id) {
          console.log(`     ✓ Updated: ${Object.keys(update.changes).join(', ')}`);
          videoReport.updated = true;
          videoReport.changes = update.changes;
          report.updated.push({ title: snippetUpdate.snippet.title, changes: Object.keys(update.changes) });
        } else {
          console.log(`     ✗ Update failed:`, JSON.stringify(putRes).substring(0,200));
          report.noChange.push({ title, reason: 'API error' });
        }
      } catch(e) {
        console.log(`     ✗ Error: ${e.message}`);
        report.noChange.push({ title, reason: e.message });
      }
    } else {
      if (issues.length === 0) {
        console.log(`     ✓ No changes needed`);
      } else {
        console.log(`     ⚠ Issues found but no auto-fix (viral Short or manual review needed)`);
      }
      report.noChange.push({ title, reason: issues.length === 0 ? 'already ok' : 'manual review' });
    }

    report.videos.push(videoReport);
    await new Promise(r => setTimeout(r, 500)); // rate limit
  }

  // Step 8: Save report
  console.log('\n▶ Step 8: Saving report...');
  if (!fs.existsSync('C:/Users/itay/liftygo-site/reports')) {
    fs.mkdirSync('C:/Users/itay/liftygo-site/reports', { recursive: true });
  }
  const fullReport = {
    date: new Date().toISOString(),
    channel: channelInfo,
    summary: {
      total: videos.length,
      updated: report.updated.length,
      noChange: report.noChange.length,
      missingArticles: report.missingArticles
    },
    videos: report.videos
  };
  fs.writeFileSync('C:/Users/itay/liftygo-site/reports/youtube-seo-latest.json', JSON.stringify(fullReport, null, 2));
  console.log('  ✓ Saved to reports/youtube-seo-latest.json\n');

  // Step 9: WhatsApp
  console.log('▶ Step 9: Sending WhatsApp...');

  const updatedLines = report.updated.map(v => `• "${v.title}" — עודכנו: ${v.changes.join(', ')}`).join('\n') || '(אין)';
  const missingLines = report.missingArticles.map(v => `• "${v.videoTitle}" (${v.audience}) → שקול מאמר`).join('\n') || '(אין)';
  const nochangeLines = report.noChange.filter(v=>v.reason==='manual review').map(v=>`• "${v.title}"`).join('\n') || '(אין)';

  const waMsg = JSON.stringify({
    chatId: '972526660006@c.us',
    message: `*🎬 דוח YouTube SEO — LiftyGo*\n_${new Date().toLocaleDateString('he-IL')}_\n\n` +
      `*ערוץ:*\n👥 ${channelInfo.subscribers} מנויים | 👁️ ${channelInfo.totalViews} צפיות כולל | 🎥 ${channelInfo.videoCount} סרטונים\n\n` +
      `*סרטונים שעודכנו (${report.updated.length}/${videos.length}):*\n${updatedLines}\n\n` +
      (nochangeLines !== '(אין)' ? `*לבדיקה ידנית:*\n${nochangeLines}\n\n` : '') +
      (missingLines !== '(אין)' ? `*הזדמנויות מאמרים:*\n${missingLines}\n\n` : '') +
      `*המלצה לשבוע הבא:*\nהמשיכו עם Shorts על נושאים עם ביקוש גבוה ב-GSC — בדקו את reports/youtube-seo-latest.json לפרטים.`
  });

  const waReq = https.request({
    hostname:'api.green-api.com',
    path:'/waInstance7105321145/sendMessage/0f30479f17624f9dbd6a05c2f779f6f11cac620e1e6e4f77bd',
    method:'POST',
    headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(waMsg,'utf8')}
  }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>console.log('  ✓ WhatsApp sent:', d.substring(0,80))); });
  waReq.write(waMsg); waReq.end();

  console.log('\n=== DONE ===');
  console.log(`Total: ${videos.length} | Updated: ${report.updated.length} | No change: ${report.noChange.length}`);
}

main().catch(console.error);
