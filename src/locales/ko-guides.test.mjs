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

test('Korean guides translate all prose while preserving routes, formulas, tables and source URLs', () => {
  const translated = guidesForLocale('ko');
  assert.equal(translated.length, guides.length);
  assert.deepEqual(translated.map(({ slug }) => slug), guides.map(({ slug }) => slug));
  guides.forEach((guide, index) => compareLocalizedShape(guide, translated[index]));
  assert.equal(translated[0].sections[1].blocks[0].value, guides[0].sections[1].blocks[0].value);
  assert.equal(translated[3].sections[1].blocks[0].items[2], '같은 순서로 그룹을 이어 붙입니다: 24D₁₆ = 0010 0100 1101₂.');
});

test('Korean guide pages localize index, metadata, canonical and hreflang', () => {
  const index = renderGuidesIndex(guidesForLocale('ko'), 'test-version', 'ko');
  assert.ok(index.includes('<html lang="ko" dir="ltr"'));
  assert.ok(index.includes(`<link rel="canonical" href="${guideCanonical('', 'ko')}">`));
  assert.ok(index.includes(`hreflang="ko" href="https://usefulverse.com${guidePath('', 'ko')}"`));
  assert.ok(index.includes('<h1>단계를 확인하세요.<br><span>이제 바로 실행해 보세요.</span></h1>'));
  const title = index.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
  const description = index.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
  assert.ok(title.length >= 15 && title.length <= 65, `index title length ${title.length}`);
  assert.ok(description.length >= 25 && description.length <= 155, `index description length ${description.length}`);
  assert.equal(ui.ko['Sources and further reading'], '출처 및 참고 자료');
  for (const guide of guidesForLocale('ko')) {
    const article = renderGuidePage(guide, 'test-version', 'ko');
    const articleTitle = article.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
    const articleDescription = article.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? '';
    assert.ok(articleTitle.length >= 15 && articleTitle.length <= 65, `${guide.slug} title length ${articleTitle.length}`);
    assert.ok(articleDescription.length >= 25 && articleDescription.length <= 155, `${guide.slug} description length ${articleDescription.length}`);
    assert.ok(article.includes(`<link rel="canonical" href="${guideCanonical(guide.slug, 'ko')}">`));
  }
});

test('Korean Google Docs article is readable and retains the original source URL', () => {
  const guide = guidesForLocale('ko')[1];
  const html = renderGuidePage(guide, 'test-version', 'ko');
  assert.ok(html.includes('<h1>Google Docs에서 단어 수 확인하는 방법</h1>'));
  assert.ok(html.includes('도구 → 단어 수'));
  assert.ok(html.includes(`href="${guidePath(guide.slug, 'en')}"`));
  assert.ok(html.includes('https://support.google.com/docs/answer/39003?hl=en'));
  assert.ok(html.includes('텍스트는 업로드되지 않으며 Google Docs 문서도 변경되지 않습니다.'));
});
