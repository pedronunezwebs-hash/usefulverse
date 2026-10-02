import assert from 'node:assert/strict';
import test from 'node:test';
import { guides, guidesForLocale, guideCanonical, guidePath } from '../guides.mjs';
import { ui } from '../locales.mjs';
import { renderGuidePage, renderGuidesIndex } from '../template.mjs';

const protectedFields = new Set(['slug', 'toolId', 'type', 'value', 'url']);

function compareLocalizedShape(source, translated, field = '') {
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

test('Urdu guides translate every prose field while preserving formulas, routes, tables and source URLs', () => {
  const translated = guidesForLocale('ur');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'گروپس کو اسی ترتیب سے جوڑیں: 24D₁₆ = 0010 0100 1101₂۔');
});

test('Urdu guide pages set RTL, isolate math and localize metadata and index', () => {
  const index = renderGuidesIndex(guidesForLocale('ur'), 'test-version', 'ur');
  assert.ok(index.includes('<html lang="ur" dir="rtl"'));
  assert.ok(index.includes(`<link rel="canonical" href="${guideCanonical('', 'ur')}">`));
  assert.ok(index.includes(`hreflang="ur" href="https://usefulverse.com${guidePath('', 'ur')}"`));
  assert.ok(index.includes('<h1>طریقہ سمجھیں۔<br><span>پھر کام مکمل کریں۔</span></h1>'));
  const title = index.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = index.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
  assert.ok(title.length >= 15 && title.length <= 65, `index title length ${title.length}`);
  assert.ok(description.length >= 25 && description.length <= 155, `index description length ${description.length}`);
  assert.equal(ui.ur['Sources and further reading'], 'ذرائع اور مزید مطالعہ');
  for (const guide of guidesForLocale('ur')) {
    const article = renderGuidePage(guide, 'test-version', 'ur');
    const articleTitle = article.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const articleDescription = article.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(articleTitle.length >= 15 && articleTitle.length <= 65, `${guide.slug} title length ${articleTitle.length}`);
    assert.ok(articleDescription.length >= 25 && articleDescription.length <= 155, `${guide.slug} description length ${articleDescription.length}`);
    assert.ok(article.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'ur')}">`));
  }
});

test('Urdu mathematical notation is readable LTR and Google Docs guide retains its source URL', () => {
  const html = renderGuidePage(guidesForLocale('ur')[0], 'test-version', 'ur');
  assert.ok(html.includes('<code dir="ltr">grade₁ × weight₁ + grade₂ × weight₂ + …</code>'));
  assert.ok(html.includes('<bdi dir="ltr">(92 × 0.40) + (84 × 0.60) = 87.2%</bdi>'));
  const docsGuide = renderGuidePage(guidesForLocale('ur')[1], 'test-version', 'ur');
  assert.ok(docsGuide.includes('Tools → Word count'));
  assert.ok(docsGuide.includes('https://support.google.com/docs/answer/39003?hl=en'));
  assert.ok(docsGuide.includes('متن اپ لوڈ نہیں ہوتا'));
});
