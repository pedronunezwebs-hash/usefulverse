import assert from 'node:assert/strict';
import test from 'node:test';
import { guides, guidesForLocale, guideCanonical, guidePath } from '../guides.mjs';
import { ui } from '../locales.mjs';
import { renderGuidePage, renderGuidesIndex } from '../template.mjs';

const protectedFields = new Set(['slug', 'toolId', 'type', 'value', 'url']);

function compareLocalizedShape(source, translated, field = '') {
  if (field === 'sources') { assert.deepEqual(translated, source, 'source citation names and URLs stay original'); return; }
  assert.equal(typeof translated, typeof source, `${field || 'guide'} type`);
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

test('Turkish guides translate every prose field while preserving formulas, routes, tables and source URLs', () => {
  const translated = guidesForLocale('tr');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'Grupları aynı sırayla birleştirin: 24D₁₆ = 0010 0100 1101₂.');
});

test('Turkish guide pages localize metadata, canonical, hreflang and index copy', () => {
  const index = renderGuidesIndex(guidesForLocale('tr'), 'test-version', 'tr');
  assert.ok(index.includes('<html lang="tr" dir="ltr"'));
  assert.ok(index.includes(`<link rel="canonical" href="${guideCanonical('', 'tr')}">`));
  assert.ok(index.includes(`hreflang="tr" href="https://usefulverse.com${guidePath('', 'tr')}"`));
  assert.ok(index.includes('<h1>Adımları öğrenin.<br><span>Sonra hemen uygulayın.</span></h1>'));
  const title = index.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = index.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
  assert.ok(title.length >= 15 && title.length <= 65, `index title length ${title.length}`);
  assert.ok(description.length >= 25 && description.length <= 155, `index description length ${description.length}`);
  assert.equal(ui.tr['Sources and further reading'], 'Kaynaklar ve ek okuma');
  for (const guide of guidesForLocale('tr')) {
    const article = renderGuidePage(guide, 'test-version', 'tr');
    const articleTitle = article.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const articleDescription = article.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(articleTitle.length >= 15 && articleTitle.length <= 65, `${guide.slug} title length ${articleTitle.length}`);
    assert.ok(articleDescription.length >= 25 && articleDescription.length <= 155, `${guide.slug} description length ${articleDescription.length}`);
    assert.ok(article.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'tr')}">`));
  }
});

test('Turkish Google Docs guide has localized menu steps and source attribution', () => {
  const guide = guidesForLocale('tr')[1];
  const html = renderGuidePage(guide, 'test-version', 'tr');
  assert.ok(html.includes('<h1>Google Dokümanlar’da kelime sayısı</h1>'));
  assert.ok(html.includes('Araçlar → Kelime sayısı'));
  assert.ok(html.includes(`href="${guidePath(guide.slug, 'en')}"`));
  assert.ok(html.includes('https://support.google.com/docs/answer/39003?hl=en'));
  assert.ok(html.includes('Metin yüklenmez ve Google Dokümanı değiştirilmez.'));
});
