import assert from 'node:assert/strict';
import test from 'node:test';
import { guides, guidesForLocale, guideCanonical, guidePath } from '../guides.mjs';
import { packs, ui } from '../locales.mjs';
import { renderGuidePage } from '../template.mjs';

test('Swedish corrections remove repeated draft artifacts without changing tool meaning', () => {
  assert.equal(packs.sv.ui['Why UsefulVerse'], 'Varför UsefulVerse?');
  assert.equal(packs.sv.ui.London, 'London');
  assert.equal(packs.sv.ui['Your HTML snippet will appear here…'], 'HTML-kodsnutten visas här…');
  assert.equal(packs.sv.ui.Free, 'Gratis');
  assert.equal(packs.sv.templates['reading.minutes'], '{count} minuter');
  assert.match(packs.sv.copy['xml-formatter'][5], /välformat/u);
  assert.match(packs.sv.copy['xml-formatter'][5], /lokalt/u);
});

test('Bulgarian Markdown and Catalan Excel guidance replace corrupted drafts', () => {
  const bulgarian = packs.bg.copy['markdown-html-converter'][5];
  assert.match(bulgarian, /Преобразувайте/u);
  assert.match(bulgarian, /локално/u);
  assert.doesNotMatch(bulgarian, /♪|\bHTML♪|MarkdownВ/u);

  const catalan = packs.ca.copy['remove-duplicate-lines'][5];
  assert.match(catalan, /coincidència/u);
  assert.match(catalan, /comprova el resultat/u);
  assert.equal(packs.ca.seo['sql-formatter'].title, 'Formatador SQL en línia');
});

test('Malay and Swahili shared strings and templates preserve placeholders without translation artifacts', () => {
  assert.equal(packs.ms.ui['About this tool'], 'Tentang alat ini');
  assert.equal(packs.ms.ui['Start typing or paste your text here...'], 'Mula menaip atau tampal teks anda di sini…');
  assert.equal(packs.ms.templates.summary, 'Perkataan: {words}\nAksara: {characters}\nAksara tanpa ruang: {noSpaces}\nBaris: {lines}\nMasa membaca: {reading}');
  assert.equal(packs.sw.ui.White, 'Nyeupe');
  assert.equal(packs.sw.ui.Black, 'Nyeusi');
  assert.equal(packs.sw.templates['reading.minutes'], '{count} dakika');

  const contamination = /♪|\[Firki\]|Font color\s*=|\bE(?:\s+E){2,}\b|(?:\b([\p{L}]{2,})\b)(?:\s+\1\b){2,}/giu;
  for (const language of ['ms', 'sw']) {
    const scan = (value, path = language) => {
      if (typeof value === 'string') {
        contamination.lastIndex = 0;
        assert.equal(contamination.test(value), false, `${path} contains a known draft artifact`);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => scan(item, `${path}[${index}]`));
      } else if (value && typeof value === 'object') {
        for (const [key, item] of Object.entries(value)) scan(item, `${path}.${key}`);
      }
    };
    for (const field of ['templates', 'ui', 'copy', 'seo', 'faq', 'guides']) scan(packs[language][field]);
  }
});

const protectedFields = new Set(['slug', 'toolId', 'type', 'value', 'url']);
function compareLocalizedShape(source, translated, field = '') {
  assert.equal(typeof translated, typeof source, `${field || 'guide'} type`);
  if (field === 'sources') {
    assert.deepEqual(translated, source, 'source names and URLs must remain unchanged');
    return;
  }
  if (Array.isArray(source)) {
    assert.equal(translated.length, source.length, `${field} item count`);
    source.forEach((item, index) => compareLocalizedShape(item, translated[index], `${field}[${index}]`));
    return;
  }
  if (source && typeof source === 'object') {
    assert.deepEqual(Object.keys(translated), Object.keys(source), `${field} shape`);
    for (const key of Object.keys(source)) compareLocalizedShape(source[key], translated[key], key);
    return;
  }
  if (typeof source !== 'string') {
    assert.equal(translated, source, `${field} value`);
    return;
  }
  if (protectedFields.has(field) || /^[0-9A-F]+$/u.test(source)) {
    assert.equal(translated, source, `${field} must remain unchanged`);
    return;
  }
  assert.ok(translated.trim(), `${field} must not be empty`);
  assert.notEqual(translated, source, `${field} still matches the English source`);
}

test('Swahili guides translate every prose field and preserve formulas, tables, routes and sources', () => {
  const translated = guidesForLocale('sw');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'Unganisha makundi kwa mpangilio uleule: 24D₁₆ = 0010 0100 1101₂.');
  assert.deepEqual(translated[3].sections[0].blocks[1].rows[5], ['5', '0101', 'D', '1101']);
});

test('Malay guides translate every prose field and preserve formulas, tables, routes and sources', () => {
  const translated = guidesForLocale('ms');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'Cantumkan kumpulan dalam susunan yang sama: 24D₁₆ = 0010 0100 1101₂.');
  assert.deepEqual(translated[3].sections[0].blocks[1].rows[6], ['6', '0110', 'E', '1110']);
});

test('Swahili guide pages render localized metadata with canonical and hreflang URLs', () => {
  for (const guide of guidesForLocale('sw')) {
    const html = renderGuidePage(guide, 'test-version', 'sw');
    const title = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const description = html.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(title.length >= 15 && title.length <= 65, `${guide.slug} title length ${title.length}`);
    assert.ok(description.length >= 25 && description.length <= 155, `${guide.slug} description length ${description.length}`);
    assert.ok(html.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'sw')}">`));
    assert.ok(html.includes(`hreflang="sw-KE" href="https://usefulverse.com${guidePath(guide.slug, 'sw')}"`));
  }
  assert.ok(ui.sw['Sources and further reading']);
});

test('Malay guide pages render localized metadata with canonical and hreflang URLs', () => {
  for (const guide of guidesForLocale('ms')) {
    const html = renderGuidePage(guide, 'test-version', 'ms');
    const title = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const description = html.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(title.length >= 15 && title.length <= 65, `${guide.slug} title length ${title.length}`);
    assert.ok(description.length >= 25 && description.length <= 155, `${guide.slug} description length ${description.length}`);
    assert.ok(html.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'ms')}">`));
    assert.ok(html.includes(`hreflang="ms-MY" href="https://usefulverse.com${guidePath(guide.slug, 'ms')}"`));
  }
});
