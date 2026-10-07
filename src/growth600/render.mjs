import { localePath } from '../locales.mjs';

export function escapeGrowthHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function safeOrigin(origin) {
  const parsed = new URL(origin);
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.pathname !== '/' || parsed.search || parsed.hash) throw new TypeError('Growth pages require a clean HTTPS origin.');
  return parsed.origin;
}

function safeJsonLd(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
}

function growthHreflang(locale) {
  // Keep the site's established /tl route and BCP 47 fil-PH page language,
  // but use ISO 639-1 `tl` in hreflang (Google does not accept ISO 639-3 `fil`).
  return locale.key === 'tl' ? 'tl' : locale.hreflang ?? locale.code;
}

export function renderGrowthToolPage({ tool, locale, localeEntries, copy, origin, assetVersion, formHtml }) {
  if (!tool?.id || !locale?.key || !copy?.title || !formHtml) throw new TypeError('Tool, locale, localized copy and form markup are required.');
  const base = safeOrigin(origin);
  const canonical = `${base}${localePath(locale.key, tool.id)}`;
  const alternates = localeEntries.map((entry) => `<link rel="alternate" hreflang="${escapeGrowthHtml(growthHreflang(entry))}" href="${base}${localePath(entry.key, tool.id)}">`).join('\n    ');
  const homeHref = localePath(locale.key);
  const direction = ['ar', 'fa', 'ur'].includes(locale.key) ? 'rtl' : 'ltr';
  const faq = [
    { question: copy.howQuestion, answer: copy.howAnswer },
    { question: copy.privacyQuestion, answer: copy.privacyAnswer },
    ...(Array.isArray(copy.additionalFaqs) ? copy.additionalFaqs : []),
  ];
  const relatedTools = [
    ['relatedRedactor', 'image-region-redactor'],
    ['relatedMosaic', 'photo-mosaic-maker'],
    ['relatedCropper', 'image-cropper'],
    ['relatedUnitConverter', 'unit-converter'],
    ['relatedConcreteCalculator', 'concrete-calculator'],
    ['relatedPaintCalculator', 'paint-calculator'],
  ].filter(([field]) => copy.fields?.[field]);
  const relatedTool = relatedTools.map(([field, id]) => `<p class="related-tool"><a href="https://usefulverse.com${localePath(locale.key, id)}">${escapeGrowthHtml(copy.fields[field])}</a></p>`).join('');
  const suffix = assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : '';
  const schema = safeJsonLd({
    '@context': 'https://schema.org', '@type': 'WebApplication', name: copy.name, url: canonical,
    description: copy.description, inLanguage: locale.code, applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });
  const faqSchema = safeJsonLd({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(({ question, answer }) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) });
  return `<!doctype html>
<html lang="${escapeGrowthHtml(locale.code)}" dir="${direction}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeGrowthHtml(copy.title)}</title>
  <meta name="description" content="${escapeGrowthHtml(copy.description)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="canonical" href="${canonical}">
  ${alternates}
  <link rel="alternate" hreflang="x-default" href="${base}${localePath('en', tool.id)}">
  <link rel="stylesheet" href="/assets/growth600.css${suffix}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeGrowthHtml(copy.title)}">
  <meta property="og:description" content="${escapeGrowthHtml(copy.description)}">
  <meta property="og:url" content="${canonical}">
  <script type="application/ld+json">${schema}</script>
  <script type="application/ld+json">${faqSchema}</script>
</head>
<body>
  <a class="skip-link" href="#tool">${escapeGrowthHtml(copy.skipToTool)}</a>
  <header class="site-header"><a class="brand" href="${homeHref}" aria-label="UsefulVerse — ${escapeGrowthHtml(copy.home)}">UsefulVerse<span aria-hidden="true">.</span></a>
    <details class="language-menu"><summary>${escapeGrowthHtml(copy.languageLabel)} · ${escapeGrowthHtml(locale.name)}</summary><nav aria-label="${escapeGrowthHtml(copy.languageLabel)}"><ul>${localeEntries.map(({ key, name }) => `<li><a lang="${escapeGrowthHtml(localeEntries.find((entry) => entry.key === key)?.code ?? key)}" href="${localePath(key, tool.id)}"${key === locale.key ? ' aria-current="page"' : ''}>${escapeGrowthHtml(name)}</a></li>`).join('')}</ul></nav></details>
  </header>
  <main id="tool" class="page-shell" data-tool="${escapeGrowthHtml(tool.id)}">
    <nav class="breadcrumbs" aria-label="${escapeGrowthHtml(copy.breadcrumbLabel)}"><a href="${homeHref}">${escapeGrowthHtml(copy.home)}</a><span aria-hidden="true">/</span><span>${escapeGrowthHtml(copy.name)}</span></nav>
    <section class="tool-intro"><p class="eyebrow">${escapeGrowthHtml(copy.freeLabel)}</p><h1>${escapeGrowthHtml(copy.name)}</h1><p>${escapeGrowthHtml(copy.intro)}</p></section>
    <section class="tool-panel" aria-label="${escapeGrowthHtml(copy.name)}">${formHtml}</section>
    <section class="tool-explainer"><h2>${escapeGrowthHtml(copy.howQuestion)}</h2><p>${escapeGrowthHtml(copy.howAnswer)}</p></section>
    ${relatedTool}
    <section class="tool-faq" aria-label="${escapeGrowthHtml(copy.faqLabel)}"><h2>${escapeGrowthHtml(copy.faqLabel)}</h2>${faq.map(({ question, answer }) => `<details><summary>${escapeGrowthHtml(question)}</summary><p>${escapeGrowthHtml(answer)}</p></details>`).join('')}</section>
  </main>
  <footer><a href="${homeHref}">${escapeGrowthHtml(copy.home)}</a><p>${escapeGrowthHtml(copy.footerFree)}</p></footer>
  <script type="module" src="/assets/${escapeGrowthHtml(tool.id)}.js${suffix}"></script>
</body>
</html>`;
}

export function renderGrowthHomePage({ tools, locale, localeEntries, copy, origin }) {
  if (!Array.isArray(tools) || !copy?.title || !copy?.description || !copy?.intro || !copy?.directoryLabel) throw new TypeError('Home copy and tool list are required.');
  const base = safeOrigin(origin);
  const canonical = `${base}${localePath(locale.key)}`;
  const direction = ['ar', 'fa', 'ur'].includes(locale.key) ? 'rtl' : 'ltr';
  const alternates = localeEntries.map((entry) => `<link rel="alternate" hreflang="${escapeGrowthHtml(growthHreflang(entry))}" href="${base}${localePath(entry.key)}">`).join('\n    ');
  const cards = tools.map((tool) => `<li><a href="${localePath(locale.key, tool.id)}"><h2>${escapeGrowthHtml(copy.tools[tool.id].name)}</h2><p>${escapeGrowthHtml(copy.tools[tool.id].description)}</p></a></li>`).join('\n');
  const schema = safeJsonLd({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'UsefulVerse', url: canonical, description: copy.description, inLanguage: locale.code });
  return `<!doctype html>
<html lang="${escapeGrowthHtml(locale.code)}" dir="${direction}"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeGrowthHtml(copy.title)}</title><meta name="description" content="${escapeGrowthHtml(copy.description)}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="canonical" href="${canonical}">${alternates}
  <link rel="alternate" hreflang="x-default" href="${base}${localePath('en')}">
  <link rel="stylesheet" href="/assets/growth600.css">
  <meta property="og:type" content="website"><meta property="og:title" content="${escapeGrowthHtml(copy.title)}"><meta property="og:description" content="${escapeGrowthHtml(copy.description)}"><meta property="og:url" content="${canonical}">
  <script type="application/ld+json">${schema}</script>
</head><body><header class="site-header"><a class="brand" href="${localePath(locale.key)}">UsefulVerse<span aria-hidden="true">.</span></a></header>
<main class="page-shell"><section class="tool-intro"><p class="eyebrow">${escapeGrowthHtml(copy.freeLabel)}</p><h1>${escapeGrowthHtml(copy.directoryLabel)}</h1><p>${escapeGrowthHtml(copy.intro)}</p></section><ul class="tool-directory">${cards}</ul></main>
<footer><p>${escapeGrowthHtml(copy.footerFree)}</p></footer></body></html>`;
}
