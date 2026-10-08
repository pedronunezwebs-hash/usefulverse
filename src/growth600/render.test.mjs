import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { renderGrowthHomePage, renderGrowthToolPage } from './render.mjs';

const locales = [{ key: 'en', code: 'en', name: 'English' }, { key: 'ar', code: 'ar', name: 'العربية' }];
const copy = { name: 'Gravel calculator', title: 'Gravel calculator free | UsefulVerse', description: 'Estimate gravel volume in your browser.', intro: 'Enter area and depth.', howQuestion: 'How to use this tool', howAnswer: 'Add area and depth, then calculate.', privacyQuestion: 'Is my data uploaded?', privacyAnswer: 'No. This runs locally.', skipToTool: 'Skip to tool', home: 'Home', languageLabel: 'Language', breadcrumbLabel: 'Breadcrumb', freeLabel: 'Free, no usage limit', faqLabel: 'Questions', footerFree: 'Free browser tool.' };

test('RTL skip-link override hides vertically without creating horizontal page overflow', async () => {
  const css = await readFile(new URL('./rtl-fixes.css', import.meta.url), 'utf8');
  assert.match(css, /\.skip-link\{position:fixed;left:auto;right:auto;inset-inline-start:1rem;inset-block-start:0;transform:translateY\(-150%\)\}/u);
  assert.match(css, /\.skip-link:focus\{left:auto;right:auto;transform:translateY\(0\)\}/u);
});

test('growth renderer emits origin-scoped canonical/hreflang, language direction and escaped copy', () => {
  const html = renderGrowthToolPage({ tool: { id: 'gravel-calculator' }, locale: locales[1], localeEntries: locales, copy: { ...copy, name: '</script><script>alert(1)</script>' }, origin: 'https://tools.usefulverse.com', assetVersion: 'abcdef123456', formHtml: '<form id="tool-form"></form>' });
  assert.match(html, /<html lang="ar" dir="rtl">/u);
  assert.match(html, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg">/u);
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
  assert.match(toolHtml, /href="\/favicon\.svg"/u);
  assert.match(toolHtml, /hreflang="tl" href="https:\/\/tools\.usefulverse\.com\/tl\/tools\/gravel-calculator\//u);
  assert.doesNotMatch(toolHtml, /hreflang="fil-PH"/u);

  const homeHtml = renderGrowthHomePage({ tools: [{ id: 'gravel-calculator' }], locale: filipino, localeEntries: entries, copy: { ...copy, title: 'Tools | UsefulVerse', directoryLabel: 'Tools', tools: { 'gravel-calculator': copy } }, origin: 'https://tools.usefulverse.com' });
  assert.match(homeHtml, /hreflang="tl" href="https:\/\/tools\.usefulverse\.com\/tl\//u);
  assert.match(homeHtml, /href="\/favicon\.svg"/u);
});

test('tool renderer includes additional localized FAQs in page content and schema plus localized related route', () => {
  const teamHtml = renderGrowthToolPage({
    tool: { id: 'random-team-generator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedNamePicker: 'Want to pick one winner? Try the random name picker.' } },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(teamHtml, /https:\/\/usefulverse\.com\/ar\/tools\/random-name-picker\//u);

  const mulchHtml = renderGrowthToolPage({
    tool: { id: 'mulch-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedGravelCalculator: 'Use gravel.', relatedSoilCalculator: 'Use soil.' }, additionalFaqs: [{ question: 'How many bags?', answer: 'Round up.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(mulchHtml, /https:\/\/tools\.usefulverse\.com\/ar\/tools\/gravel-calculator\//u);
  assert.match(mulchHtml, /https:\/\/tools\.usefulverse\.com\/ar\/tools\/soil-calculator\//u);

  const paverHtml = renderGrowthToolPage({
    tool: { id: 'paver-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedTileCalculator: 'Use tile calculator.', relatedGravelCalculator: 'Use gravel calculator.' }, additionalFaqs: [{ question: 'How many pavers?', answer: 'Round up modules.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(paverHtml, /https:\/\/usefulverse\.com\/ar\/tools\/tile-calculator\//u);
  assert.match(paverHtml, /https:\/\/tools\.usefulverse\.com\/ar\/tools\/gravel-calculator\//u);

  const html = renderGrowthToolPage({
    tool: { id: 'tire-size-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedUnitConverter: 'Convert measurements with the unit converter.' }, additionalFaqs: [{ question: 'Does this fit?', answer: 'This estimate cannot confirm fitment.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(html, /https:\/\/usefulverse\.com\/ar\/tools\/unit-converter\//u);
  assert.match(html, /<summary>Does this fit\?<\/summary>/u);
  assert.match(html, /"name":"Does this fit\?"/u);

  const stairHtml = renderGrowthToolPage({
    tool: { id: 'stair-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedUnitConverter: 'Convert measurements with the unit converter.' }, additionalFaqs: [{ question: 'Does it check codes?', answer: 'No, geometry only.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(stairHtml, /https:\/\/usefulverse\.com\/ar\/tools\/unit-converter\//u);
  assert.match(stairHtml, /<summary>Does it check codes\?<\/summary>/u);

  const asphaltHtml = renderGrowthToolPage({
    tool: { id: 'asphalt-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedConcreteCalculator: 'Planning a concrete slab? Try the concrete calculator.' }, additionalFaqs: [{ question: 'What density should I use?', answer: 'Ask your supplier.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(asphaltHtml, /https:\/\/usefulverse\.com\/ar\/tools\/concrete-calculator\//u);
  assert.match(asphaltHtml, /<summary>What density should I use\?<\/summary>/u);

  const wallpaperHtml = renderGrowthToolPage({
    tool: { id: 'wallpaper-calculator' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedPaintCalculator: 'Also need paint? Try the paint calculator.' } },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(wallpaperHtml, /https:\/\/usefulverse\.com\/ar\/tools\/paint-calculator\//u);

  const redactorHtml = renderGrowthToolPage({
    tool: { id: 'image-region-redactor' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedMosaic: 'Try a photo mosaic.', relatedCropper: 'Try the image cropper.' }, additionalFaqs: [{ question: 'Is blur enough?', answer: 'Use black for sensitive details.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(redactorHtml, /https:\/\/usefulverse\.com\/ar\/tools\/photo-mosaic-maker\//u);
  assert.match(redactorHtml, /https:\/\/usefulverse\.com\/ar\/tools\/image-cropper\//u);
  assert.match(redactorHtml, /<summary>Is blur enough\?<\/summary>/u);

  const sharpenerHtml = renderGrowthToolPage({
    tool: { id: 'image-sharpener' }, locale: locales[1], localeEntries: locales,
    copy: { ...copy, fields: { relatedRedactor: 'Hide sensitive areas with the image redactor.' }, additionalFaqs: [{ question: 'Can it restore details?', answer: 'No, sharpening cannot restore information that was not captured.' }] },
    origin: 'https://tools.usefulverse.com', formHtml: '<form id="tool-form"></form>',
  });
  assert.match(sharpenerHtml, /https:\/\/usefulverse\.com\/ar\/tools\/image-region-redactor\//u);
  assert.match(sharpenerHtml, /<summary>Can it restore details\?<\/summary>/u);
});
