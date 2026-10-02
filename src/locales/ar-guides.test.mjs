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

test('Arabic guides translate all prose while preserving routes, formulas, tables and source URLs', () => {
  const translated = guidesForLocale('ar');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], 'صِل المجموعات بالترتيب نفسه: 24D₁₆ = 0010 0100 1101₂.');
});

test('Arabic guide pages set RTL and localize metadata, canonical and hreflang', () => {
  const index = renderGuidesIndex(guidesForLocale('ar'), 'test-version', 'ar');
  assert.ok(index.includes('<html lang="ar" dir="rtl"'));
  assert.ok(index.includes(`<link rel="canonical" href="${guideCanonical('', 'ar')}">`));
  assert.ok(index.includes(`hreflang="ar" href="https://usefulverse.com${guidePath('', 'ar')}"`));
  assert.ok(index.includes('<h1>تعرّف على الخطوات.<br><span>ثم أنجز المهمة.</span></h1>'));
  const title = index.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = index.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
  assert.ok(title.length >= 15 && title.length <= 65, `index title length ${title.length}`);
  assert.ok(description.length >= 25 && description.length <= 155, `index description length ${description.length}`);
  assert.equal(ui.ar['Sources and further reading'], 'المصادر ومراجع إضافية');
  for (const guide of guidesForLocale('ar')) {
    const article = renderGuidePage(guide, 'test-version', 'ar');
    const articleTitle = article.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const articleDescription = article.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(articleTitle.length >= 15 && articleTitle.length <= 65, `${guide.slug} title length ${articleTitle.length}`);
    assert.ok(articleDescription.length >= 25 && articleDescription.length <= 155, `${guide.slug} description length ${articleDescription.length}`);
    assert.ok(article.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'ar')}">`));
  }
});

test('Arabic mathematical notation stays left-to-right inside the RTL article', () => {
  const html = renderGuidePage(guidesForLocale('ar')[0], 'test-version', 'ar');
  assert.ok(html.includes('<code dir="ltr">grade₁ × weight₁ + grade₂ × weight₂ + …</code>'));
  assert.ok(html.includes('<bdi dir="ltr">(92 × 0.40) + (84 × 0.60) = 87.2%</bdi>'));
  const hexGuide = renderGuidePage(guidesForLocale('ar')[3], 'test-version', 'ar');
  assert.ok(hexGuide.includes('<td dir="ltr">0010</td>'));
});

test('Arabic Google Docs article keeps its source link and says text stays local', () => {
  const guide = guidesForLocale('ar')[1];
  const html = renderGuidePage(guide, 'test-version', 'ar');
  assert.ok(html.includes('<h1>طريقة معرفة عدد الكلمات في Google Docs</h1>'));
  assert.ok(html.includes('أدوات → عدد الكلمات'));
  assert.ok(html.includes(`href="${guidePath(guide.slug, 'en')}"`));
  assert.ok(html.includes('https://support.google.com/docs/answer/39003?hl=en'));
  assert.ok(html.includes('لا يُرفع النص ولا يتغير مستند Google.'));
});
