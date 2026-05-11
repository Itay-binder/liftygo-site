<?php
/**
 * LiftyGo SEO - Meta Tags
 * Code Snippets ID: 8
 *
 * מוסיף לדפים המקודמים:
 * - Title tag מותאם
 * - Meta description
 * - OG tags (פייסבוק / וואטסאפ)
 * - Twitter card
 * - Schema JSON-LD (LocalBusiness) לדף הבית
 *
 * הערה: עברית מקודדת כ-PHP Unicode escapes (\u{XXXX})
 * כדי למנוע בעיות encoding במסד הנתונים.
 */

// ─── Custom Title Tags ────────────────────────────────────────────────────────
add_filter("pre_get_document_title", function($title) {
    $custom_titles = [
        30   => "\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05EA} \u{05D3}\u{05D9}\u{05E8}\u{05D4} | \u{05D4}\u{05E9}\u{05D5}\u{05D5}\u{05D0}\u{05EA} \u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} \u{05DE}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} \u{05DE}\u{05E7}\u{05E6}\u{05D5}\u{05E2}\u{05D9}\u{05D9}\u{05DD} | LiftyGo",
        1911 => "\u{05D4}\u{05E6}\u{05D8}\u{05E8}\u{05E4}\u{05D5}\u{05EA} \u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} | \u{05DC}\u{05E7}\u{05D1}\u{05DC} \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D7}\u{05DE}\u{05D9}\u{05DD} \u{05DC}\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} | LiftyGo",
        2884 => "\u{05DE}\u{05E1}\u{05DC}\u{05D5}\u{05DC} \u{05E1}\u{05D9}\u{05D8}\u{05D5}\u{05E0}\u{05D0}\u{05D9} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} | \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D1}\u{05E0}\u{05E4}\u{05D7} \u{05D2}\u{05D1}\u{05D5}\u{05D4} | LiftyGo",
        1792 => "\u{05D0}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05E6}\u{05D5}\u{05D0} \u{05E2}\u{05D1}\u{05D5}\u{05D3}\u{05D5}\u{05EA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{2014} \u{05D4}\u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05D4}\u{05DE}\u{05EA}\u{05D7}\u{05D9}\u{05DC} | LiftyGo",
        2894 => "\u{05DB}\u{05DE}\u{05D4} \u{05E2}\u{05D5}\u{05DC}\u{05D4} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05EA} \u{05D3}\u{05D9}\u{05E8}\u{05D4}? \u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} \u{05E2}\u{05D3}\u{05DB}\u{05E0}\u{05D9} 2026 | LiftyGo",
    ];
    $id = get_queried_object_id();
    return isset($custom_titles[$id]) ? $custom_titles[$id] : $title;
}, 20);

// ─── Meta Description + OG Tags ───────────────────────────────────────────────
add_action("wp_head", function() {
    $pages = [
        30 => [
            "desc"     => "\u{05DE}\u{05D7}\u{05E4}\u{05E9}\u{05D9}\u{05DD} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4}? LiftyGo \u{05DE}\u{05EA}\u{05D0}\u{05D9}\u{05DE}\u{05D4} \u{05DC}\u{05DB}\u{05DD} \u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} \u{05DE}\u{05E7}\u{05E6}\u{05D5}\u{05E2}\u{05D9}\u{05D9}\u{05DD} \u{05D5}\u{05D0}\u{05DE}\u{05D9}\u{05E0}\u{05D9}\u{05DD}, \u{05E2}\u{05DD} \u{05D4}\u{05E9}\u{05D5}\u{05D5}\u{05D0}\u{05EA} \u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} \u{05E9}\u{05E7}\u{05D5}\u{05E4}\u{05D4} \u{05D5}\u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} \u{05DC}\u{05DB}\u{05DC} \u{05DB}\u{05D9}\u{05E1}. \u{05E7}\u{05D1}\u{05DC}\u{05D5} \u{05D4}\u{05E6}\u{05E2}\u{05D5}\u{05EA} \u{05DE}\u{05D7}\u{05D9}\u{05E8} \u{05D1}\u{05E7}\u{05DC}\u{05D9}\u{05E7}!",
            "og_title" => "LiftyGo - \u{05DE}\u{05EA}\u{05D0}\u{05D9}\u{05DE}\u{05D9}\u{05DD} \u{05DC}\u{05DA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{05D1}\u{05E7}\u{05DC}\u{05D9}\u{05E7}",
            "og_url"   => "https://liftygo.co.il/",
        ],
        1911 => [
            "desc"     => "\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05DE}\u{05E7}\u{05E6}\u{05D5}\u{05E2}\u{05D9}? \u{05D4}\u{05E6}\u{05D8}\u{05E8}\u{05E3} \u{05DC}\u{05E8}\u{05E9}\u{05EA} LiftyGo \u{05D5}\u{05E7}\u{05D1}\u{05DC} \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D0}\u{05D9}\u{05DB}\u{05D5}\u{05EA}\u{05D9}\u{05D9}\u{05DD} \u{05E9}\u{05DC} \u{05DC}\u{05E7}\u{05D5}\u{05D7}\u{05D5}\u{05EA} \u{05E9}\u{05DE}\u{05D7}\u{05E4}\u{05E9}\u{05D9}\u{05DD} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{05D1}\u{05D0}\u{05D6}\u{05D5}\u{05E8}\u{05DA}. \u{05D4}\u{05D2}\u{05D3}\u{05DC} \u{05D0}\u{05EA} \u{05D4}\u{05D4}\u{05DB}\u{05E0}\u{05E1}\u{05D5}\u{05EA} \u{05E9}\u{05DC}\u{05DA} \u{05E2}\u{05D5}\u{05D3} \u{05D4}\u{05D9}\u{05D5}\u{05DD}.",
            "og_title" => "\u{05D4}\u{05E6}\u{05D8}\u{05E8}\u{05E3} \u{05DB}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05DC}-LiftyGo | \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D7}\u{05DE}\u{05D9}\u{05DD} \u{05DC}\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4}",
            "og_url"   => "https://liftygo.co.il/joinus/",
        ],
        2884 => [
            "desc"     => "\u{05DE}\u{05E1}\u{05DC}\u{05D5}\u{05DC} \u{05E1}\u{05D9}\u{05D8}\u{05D5}\u{05E0}\u{05D0}\u{05D9} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} \u{2014} \u{05E7}\u{05D1}\u{05DC} \u{05E0}\u{05E4}\u{05D7} \u{05D2}\u{05D1}\u{05D5}\u{05D4} \u{05E9}\u{05DC} \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D0}\u{05D9}\u{05DB}\u{05D5}\u{05EA}\u{05D9}\u{05D9}\u{05DD} \u{05DC}\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{05D1}\u{05DE}\u{05D7}\u{05D9}\u{05E8} \u{05DE}\u{05D5}\u{05D6}\u{05DC}. \u{05D4}\u{05E6}\u{05D8}\u{05E8}\u{05E3} \u{05DC}-LiftyGo \u{05D5}\u{05DE}\u{05DC}\u{05D0} \u{05D0}\u{05EA} \u{05DC}\u{05D5}\u{05D7} \u{05D4}\u{05D6}\u{05DE}\u{05E0}\u{05D9}\u{05DD} \u{05E9}\u{05DC}\u{05DA}.",
            "og_title" => "\u{05DE}\u{05E1}\u{05DC}\u{05D5}\u{05DC} \u{05E1}\u{05D9}\u{05D8}\u{05D5}\u{05E0}\u{05D0}\u{05D9} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC}\u{05D9}\u{05DD} | \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD} \u{05D1}\u{05E0}\u{05E4}\u{05D7} \u{05D2}\u{05D1}\u{05D5}\u{05D4} | LiftyGo",
            "og_url"   => "https://liftygo.co.il/joinus-wholesaler/",
        ],
        1792 => [
            "desc"     => "\u{05DE}\u{05D7}\u{05E4}\u{05E9} \u{05E2}\u{05D1}\u{05D5}\u{05D3}\u{05D5}\u{05EA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4}? \u{05D4}\u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05D4}\u{05DE}\u{05DC}\u{05D0} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05D4}\u{05DE}\u{05EA}\u{05D7}\u{05D9}\u{05DC} \u{2014} \u{05D0}\u{05D9}\u{05DA} \u{05DC}\u{05D4}\u{05E9}\u{05D9}\u{05D2} \u{05DC}\u{05D9}\u{05D3}\u{05D9}\u{05DD}, \u{05D4}\u{05E9}\u{05D5}\u{05D5}\u{05D0}\u{05EA} \u{05E4}\u{05DC}\u{05D8}\u{05E4}\u{05D5}\u{05E8}\u{05DE}\u{05D5}\u{05EA}, \u{05D5}\u{05D8}\u{05D9}\u{05E4}\u{05D9}\u{05DD} \u{05DC}\u{05D1}\u{05E0}\u{05D9}\u{05D9}\u{05EA} \u{05D4}\u{05DB}\u{05E0}\u{05E1}\u{05D4} \u{05E7}\u{05D1}\u{05D5}\u{05E2}\u{05D4} \u{05DE}\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D5}\u{05EA}.",
            "og_title" => "\u{05D0}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05E6}\u{05D5}\u{05D0} \u{05E2}\u{05D1}\u{05D5}\u{05D3}\u{05D5}\u{05EA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} | \u{05D4}\u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} | LiftyGo",
            "og_url"   => "https://liftygo.co.il/moving-jobs-israel/",
        ],
        2894 => [
            "desc"     => "\u{05DB}\u{05DE}\u{05D4} \u{05E2}\u{05D5}\u{05DC}\u{05D4} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05EA} \u{05D3}\u{05D9}\u{05E8}\u{05D4}? 3 \u{05D7}\u{05D3}\u{05E8}\u{05D9}\u{05DD} 1,000\u{2013}2,200\u{20AA} | 4 \u{05D7}\u{05D3}\u{05E8}\u{05D9}\u{05DD} 1,800\u{2013}3,500\u{20AA}. \u{05DE}\u{05D4} \u{05DE}\u{05E9}\u{05E4}\u{05D9}\u{05E2} \u{05E2}\u{05DC} \u{05D4}\u{05DE}\u{05D7}\u{05D9}\u{05E8}, \u{05D8}\u{05D9}\u{05E4}\u{05D9}\u{05DD} \u{05DC}\u{05D7}\u{05D9}\u{05E1}\u{05DB}\u{05D5}\u{05DF}, \u{05D5}\u{05D4}\u{05E9}\u{05D5}\u{05D5}\u{05D0}\u{05EA} \u{05D4}\u{05E6}\u{05E2}\u{05D5}\u{05EA} \u{05DE}\u{05D7}\u{05D9}\u{05E8} \u{05D1}\u{05D7}\u{05D9}\u{05E0}\u{05DD}.",
            "og_title" => "\u{05DB}\u{05DE}\u{05D4} \u{05E2}\u{05D5}\u{05DC}\u{05D4} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05EA} \u{05D3}\u{05D9}\u{05E8}\u{05D4}? \u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} 2026 | LiftyGo",
            "og_url"   => "https://liftygo.co.il/moving-cost-guide/",
        ],
    ];
    $id = get_queried_object_id();
    if (!isset($pages[$id])) return;
    $p = $pages[$id];
    echo '<meta name="description" content="' . esc_attr($p["desc"]) . '" />' . "\n";
    echo '<meta property="og:type" content="website" />' . "\n";
    echo '<meta property="og:site_name" content="LiftyGo" />' . "\n";
    echo '<meta property="og:locale" content="he_IL" />' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($p["og_title"]) . '" />' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($p["desc"]) . '" />' . "\n";
    echo '<meta property="og:url" content="' . esc_attr($p["og_url"]) . '" />' . "\n";
    echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($p["og_title"]) . '" />' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($p["desc"]) . '" />' . "\n";
}, 5);

// ─── Schema JSON-LD — דף הבית ─────────────────────────────────────────────────
add_action("wp_head", function() {
    if (!is_front_page()) return;
    $schema = [
        "@context"    => "https://schema.org",
        "@type"       => "LocalBusiness",
        "name"        => "LiftyGo",
        "url"         => "https://liftygo.co.il",
        "description" => "\u{05E4}\u{05DC}\u{05D8}\u{05E4}\u{05D5}\u{05E8}\u{05DE}\u{05D4} \u{05DC}\u{05D7}\u{05D9}\u{05E4}\u{05D5}\u{05E9} \u{05D5}\u{05D4}\u{05E9}\u{05D5}\u{05D5}\u{05D0}\u{05EA} \u{05DE}\u{05D7}\u{05D9}\u{05E8}\u{05D9}\u{05DD} \u{05E9}\u{05DC} \u{05E9}\u{05D9}\u{05E8}\u{05D5}\u{05EA}\u{05D9} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{05D1}\u{05D9}\u{05E9}\u{05E8}\u{05D0}\u{05DC}",
        "areaServed"  => "\u{05D9}\u{05E9}\u{05E8}\u{05D0}\u{05DC}",
        "serviceType" => "\u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D5}\u{05EA} \u{05D3}\u{05D9}\u{05E8}\u{05D4}",
    ];
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>' . "\n";
}, 10);

// ─── Schema JSON-LD — פוסט בלוג /moving-jobs-israel/ ──────────────────────────
add_action("wp_head", function() {
    if (get_queried_object_id() !== 1792) return;
    $schema = [
        "@context"         => "https://schema.org",
        "@type"            => "BlogPosting",
        "headline"         => "\u{05D0}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05E6}\u{05D5}\u{05D0} \u{05E2}\u{05D1}\u{05D5}\u{05D3}\u{05D5}\u{05EA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4} \u{2014} \u{05D4}\u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05D4}\u{05DE}\u{05EA}\u{05D7}\u{05D9}\u{05DC}",
        "url"              => "https://liftygo.co.il/moving-jobs-israel/",
        "datePublished"    => "2026-05-01",
        "dateModified"     => "2026-05-11",
        "inLanguage"       => "he-IL",
        "author"           => ["@type" => "Organization", "name" => "LiftyGo", "url" => "https://liftygo.co.il"],
        "publisher"        => ["@type" => "Organization", "name" => "LiftyGo", "url" => "https://liftygo.co.il"],
        "description"      => "\u{05DE}\u{05D7}\u{05E4}\u{05E9} \u{05E2}\u{05D1}\u{05D5}\u{05D3}\u{05D5}\u{05EA} \u{05D4}\u{05D5}\u{05D1}\u{05DC}\u{05D4}? \u{05D4}\u{05DE}\u{05D3}\u{05E8}\u{05D9}\u{05DA} \u{05D4}\u{05DE}\u{05DC}\u{05D0} \u{05DC}\u{05DE}\u{05D5}\u{05D1}\u{05D9}\u{05DC} \u{05D4}\u{05DE}\u{05EA}\u{05D7}\u{05D9}\u{05DC}",
        "mainEntityOfPage" => ["@type" => "WebPage", "@id" => "https://liftygo.co.il/moving-jobs-israel/"],
    ];
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>' . "\n";
}, 10);
