import assert from 'node:assert/strict';
import test from 'node:test';
import { renderGrowthHomePage, renderGrowthToolPage } from './render.mjs';

const locales = [{ key: 'en', code: 'en', name: 'English' }, { key: 'ar', code: 'ar', name: 'العربية' }];
const copy = { name: 'Gravel calculator', title: 'Gravel calculator free | UsefulVerse', description: 'Estimate gravel volume in your browser.', intro: 'Enter area and depth.', howQuestion: 'How to use this tool', howAnswer: 'Add area and depth, then calculate.', privacyQuestion: 'Is my data uploaded?', privacyAnswer: 'No. This runs locally.', skipToTool: 'Skip to tool', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', freeLabel: 'Free, no usage limit', faqLabel: 'Questions', footerFree: 'Free browser tool.' };

test('growth renderer emits origin-scoped canonical/hreflang, language direction and escaped copy', () => {
  const html = renderGrowthToolPage({ tool: { id: 'gravel-calculator' }, locale: locales[1], localeEntries: locales, copy: { ...copy, name: '</script><script>alert(1)</script>' }, origin: 'https://tools.usefulverse.com', assetVersion: 'abcdef123456', formHtml: '<form id="tool-form"></form>' });
  assert.match(html, /<html lang="ar" dir="rtl">/u);
  assert.match(html, /canonical" href="https:\/\/tools\.usefulverse\.com\/ar\/tools\/gravel-calculator\//u);
  assert.match(html, /hreflang="en" href="https:\/\/tools\.usefulverse\.com\/tools\/gravel-calculator\//u);
  assert.match(html, /hreflang="x-default" href="https:\/\/tools\.usefulverse\.com\/tools\/gravel-calculator\//u);
  assert.match(html, /&lt;\/script&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;/u);
  assert.doesNotMatch(html, /<\/script><script>alert/u);
  assert.match(html, /\\u003c\/script\\u003e\\u003cscript\\u003ealert/u);
  assert.doesNotMatch(html, /href="https:\/\/usefulverse\.com\//u);
  assert.match(html, /assets\/gravel-calculator\.js\?v=abcdef123456/u);
  assert.throws(() => renderGrowthToolPage({ tool: { id: 'x' }, locale: locales[0], localeEntries: locales, copy, origin: 'http://tools.usefulverse.com', formHtml: '<form></form>' }), /HTTPS origin/);
});

test('Filipino route keeps its established BCP 47 page language while hreflang uses ISO 639-1', () => {
  const filipino = { key: 'tl', code: 'fil-PH', name: 'Filipino' };
  const entries = [{ key: 'en', code: 'en', name: 'English' }, filipino];
  const toolHtml = renderGrowthToolPage({ tool: { id: 'gravel-calculator' }, locale: filipino, localeEntries: entries, copy, origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>' });
  assert.match(toolHtml, /<html lang="fil-PH" dir="ltr">/u);
  assert.match(toolHtml, /hreflang="tl" href="https:\/\/tools\.usefulverse\.com\/tl\/tools\/gravel-calculator\//u);
  assert.doesNotMatch(toolHtml, /hreflang="fil-PH"/u);

  const homeHtml = renderGrowthHomePage({ tools: [{ id: 'gravel-calculator' }], locale: filipino, localeEntries: entries, copy: { ...copy, title: 'Tools | UsefulVerse', directoryLabel: 'Tools', tools: { 'gravel-calculator': copy } }, origin: 'https://tools.usefulverse.com' });
  assert.match(homeHtml, /hreflang="tl" href="https:\/\/tools\.usefulverse\.com\/tl\//u);
});
