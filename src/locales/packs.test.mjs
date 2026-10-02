import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { renderToolPage } from '../template.mjs';
import { packs, runtimeMessages } from '../locales.mjs';
import { imageFormatLocales } from './image-formats.mjs';
import { imageCaptureUiLocales } from './image-capture.mjs';
import { officePackageLocales, tiffHints } from './office-package.mjs';
import { htmlToPdfLocales } from './html-to-pdf.mjs';
import { pdfToPdfaLocales } from './pdf-to-pdfa.mjs';
import { pageKeys, templateKeys } from './template-keys.mjs';
import { numberToWordsHook } from './test-harness.mjs';

// Every English message app.js shows through translate()/setStatus() must exist in each pack.
const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const runtimeLiterals = new Set([
  ...[...appSource.matchAll(/setStatus\([^,]+,\s*'([^']+)'/gu)].map((match) => match[1]),
  ...[...appSource.matchAll(/setStatus\([^,]+,\s*[\w.]+ \? '([^']+)' : '([^']+)'/gu)].flatMap((match) => [match[1], match[2]]),
  ...[...appSource.matchAll(/ : '([^']+)', (?:'(?:success|error)'|\w+\.length \?)/gu)].map((match) => match[1]),
  ...[...appSource.matchAll(/translate\(([^()]*)\)/gu)].flatMap((match) => [...match[1].matchAll(/'([^']+)'/gu)].map((literal) => literal[1])),
  ...[...appSource.matchAll(/\w+: \['([^']+)', (?:[\d.]+|null)\]/gu)].map((match) => match[1]),
].filter((text) => /\p{L}{2}/u.test(text) && !['encode', 'upper'].includes(text)));

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort();
const saveUsefulVerseUi = [
  'Want to find UsefulVerse again?',
  'Free tools, no account or subscription. Save this page in your notes or send it to yourself for next time.',
  'Save UsefulVerse',
  'Link copied. Keep it in your notes or send it to yourself for next time.',
  'Share options opened. Choose where you want to keep the link.',
  'Copy was blocked. Select the link below and copy it manually.',
  'Page link',
];

for (const [language, pack] of Object.entries(packs)) {
  const keepEnglish = new Set(pack.meta.keepEnglish ?? []);
  const pluralCategories = new Intl.PluralRules(pack.meta.tag).resolvedOptions().pluralCategories;

  test(`${language}: meta is complete`, () => {
    for (const field of ['code', 'name', 'prefix', 'tag', 'homeTitle', 'homeDescription', 'homeLabel', 'homeMarker']) assert.ok(pack.meta[field], `meta.${field}`);
    assert.ok(pack.meta.homeTitle.length >= 15 && pack.meta.homeTitle.length <= 65, 'homeTitle length');
    assert.ok(pack.meta.homeDescription.length >= 25 && pack.meta.homeDescription.length <= 155, 'homeDescription length');
    assert.notEqual(pack.meta.homeTitle, 'UsefulVerse — Simple tools for everyday tasks');
  });

  test(`${language}: ui and runtime messages are translated`, () => {
    for (const [group, dictionary] of [['ui', pack.ui], ['runtimeMessages', pack.runtimeMessages]]) {
      for (const [key, value] of Object.entries(dictionary)) {
        assert.equal(typeof value, 'string', `${group}[${key}] must be a string`);
        assert.ok(value.trim(), `${group}[${key}] is empty`);
        if (value === key && /\p{Ll}{2}/u.test(key)) assert.ok(keepEnglish.has(key), `${group}[${JSON.stringify(key)}] is still English (add to meta.keepEnglish only if that is correct in ${language})`);
      }
    }
  });

  test(`${language}: UsefulVerse save/share prompt is translated`, () => {
    for (const key of saveUsefulVerseUi) {
      assert.ok(pack.ui[key], `ui[${JSON.stringify(key)}]`);
      assert.notEqual(pack.ui[key], key, `ui[${JSON.stringify(key)}] is still English`);
    }
  });

  test(`${language}: every runtime message used by app.js is translated`, () => {
    const missing = [...runtimeLiterals].filter((text) => !pack.runtimeMessages[text] && !pack.ui[text]);
    assert.deepEqual(missing, [], `missing in ui/runtimeMessages: ${missing.map((text) => JSON.stringify(text)).join(', ')}`);
  });

  test(`${language}: page strings and runtime templates keep their placeholders`, () => {
    for (const [key, spec] of Object.entries(pageKeys)) {
      assert.equal(typeof pack.page[key], 'string', `page.${key}`);
      assert.deepEqual(placeholders(pack.page[key]), [...spec.vars].sort(), `page.${key} placeholders`);
      assert.notEqual(pack.page[key], spec.en, `page.${key} is still English`);
    }
    for (const [key, spec] of Object.entries(templateKeys)) {
      const entry = pack.templates[key];
      assert.ok(entry, `templates.${key} is missing`);
      const forms = typeof entry === 'string' ? { other: entry } : entry;
      assert.ok(forms.other, `templates.${key}.other is required`);
      for (const [category, text] of Object.entries(forms)) {
        assert.ok(pluralCategories.includes(category), `templates.${key}.${category} is not a plural category of ${pack.meta.tag}`);
        assert.deepEqual([...new Set(placeholders(text))].sort(), [...spec.vars].sort(), `templates.${key}.${category} placeholders`);
      }
      const english = typeof spec.en === 'string' ? spec.en : spec.en.other;
      assert.notEqual(forms.other, english, `templates.${key} is still English`);
    }
  });

  test(`${language}: every tool has localized copy, SEO title/description and FAQ`, () => {
    const titles = new Set();
    for (const tool of tools) {
      const values = pack.copy[tool.id];
      assert.ok(Array.isArray(values) && values.length === 6 && values.every((value) => typeof value === 'string' && value.trim()), `copy.${tool.id}`);
      assert.notEqual(values[0], tool.title, `copy.${tool.id} title is still English`);
      assert.notEqual(values[5], tool.body, `copy.${tool.id} body is still English`);
      const seo = pack.seo[tool.id];
      assert.ok(seo?.title && seo?.description, `seo.${tool.id}`);
      assert.equal(seo.title, imageFormatLocales[language]?.seoTitles?.[tool.id] ?? seo.title, `seo.${tool.id} should name its localized format intent`);
      const title = `${seo.title} | UsefulVerse`;
      assert.ok(title.length >= 15 && title.length <= 65, `seo.${tool.id}.title length ${title.length}`);
      assert.ok(seo.description.length >= 25 && seo.description.length <= 155, `seo.${tool.id}.description length ${seo.description.length}`);
      assert.ok(!titles.has(title), `duplicate title ${title}`);
      titles.add(title);
      const faq = pack.faq[tool.id];
      assert.ok(Array.isArray(faq) && faq.length >= 2, `faq.${tool.id}`);
      for (const item of faq) assert.ok(item.question?.trim() && item.answer?.trim(), `faq.${tool.id} item`);
      for (const [id, question] of Object.entries(imageFormatLocales[language]?.faqQuestions ?? {})) {
        assert.equal(pack.faq[id]?.[0]?.question, question, `faq.${id} should target its localized image-format search intent`);
      }
    }
  });

  test(`${language}: number-to-words hook returns words for the whole supported range`, async () => {
    const toWords = await numberToWordsHook(language);
    assert.equal(typeof toWords, 'function', 'src/locales/<language>/runtime.js must define window.usefulverseLocale.numberToWords');
    for (const value of [0n, 1n, 7n, 10n, 11n, 21n, 99n, 100n, 101n, 1000n, 10000n, 100000n, 1000000n, 10000000n, 123456789n, 999999999999n, -42n]) {
      const words = toWords(value);
      assert.equal(typeof words, 'string');
      assert.ok(words.trim() && !/\d/u.test(words), `numberToWords(${value}) = ${JSON.stringify(words)}`);
    }
  });
}

test('image-format SEO titles and intent FAQs reach the generated static pages in every localized language', () => {
  for (const [language, data] of Object.entries(imageFormatLocales)) {
    for (const id of ['image-format-converter', 'image-resizer-compressor', 'image-to-pdf']) {
      const source = tools.find((tool) => tool.id === id);
      const [title, shortTitle, description, keywords, intro, body] = data.copy[id];
      const localizedTool = { ...source, title, shortTitle, description, keywords, intro, body };
      const html = renderToolPage(localizedTool, 'test', language, tools);
      const publishedTitle = html.match(/<title>([^<]+)<\/title>/u)?.[1] ?? '';
      assert.ok(publishedTitle.startsWith(data.seoTitles[id]), `${language}/${id} should keep its localized keyword at the start of the SEO title`);
      assert.ok(publishedTitle.endsWith(' | UsefulVerse'), `${language}/${id} should keep the UsefulVerse brand in the title`);
      assert.ok(html.includes(data.faqQuestions[id]), `${language}/${id} should publish its localized search-intent FAQ`);
    }
  }
});

test('image-to-PDF empty-state file-size and pixel guidance is translated in every language', () => {
  const key = 'Add up to 20 images. No fixed file-size cap; 20 megapixels per image. Large batches depend on your device memory.';
  for (const [language, data] of Object.entries(imageFormatLocales)) {
    const translated = data.ui[key];
    assert.ok(translated, `${language} should translate the image-to-PDF limits`);
    assert.notEqual(translated, key, `${language} should not show the English image-to-PDF limits`);
    assert.equal(runtimeMessages[language]?.[key], translated, `${language} runtime should use the same translated guidance`);
  }
});

test('image-to-PDF camera capture copy is localized in every shipped language', () => {
  const keys = [
    'Take a photo',
    'On supported phones, this opens the rear camera. The photo is added locally; it is not automatically cropped or perspective-corrected.',
    'Photo added. Review the page order below.',
    'Camera could not be opened. Choose images above instead.',
  ];
  for (const language of Object.keys(packs)) {
    const translations = imageCaptureUiLocales[language];
    assert.ok(translations, `${language} camera copy`);
    for (const key of keys) {
      assert.ok(translations[key], `${language} must translate: ${key}`);
      if (language !== 'en') assert.notEqual(translations[key], key, `${language} should not show English copy: ${key}`);
      assert.equal(runtimeMessages[language]?.[key], translations[key], `${language} runtime copy: ${key}`);
    }
  }
});

test('Office compressor copy, FAQs and local-processing limits exist in every shipped language', () => {
  for (const language of Object.keys(imageFormatLocales)) {
    const data = officePackageLocales[language];
    assert.ok(data, `${language} Office copy`);
    assert.equal(data.copy['office-file-compressor'].length, 6, `${language} Office page copy`);
    assert.ok(data.copy['office-file-compressor'][3].includes('DOCX') && data.copy['office-file-compressor'][3].includes('XLSX') && data.copy['office-file-compressor'][3].includes('PPTX'));
    assert.match(data.copy['office-file-compressor'][5], /100\s?(?:MB|Mo|МБ)/u);
    assert.ok(data.faq['office-file-compressor'].length >= 2, `${language} Office FAQs`);
    for (const key of ['Choose a DOCX, XLSX or PPTX file', 'Try to reduce file size', 'Processing runs locally in this browser. No upload.']) {
      assert.ok(data.ui[key], `${language} UI: ${key}`);
      assert.notEqual(data.ui[key], key, `${language} UI remains English: ${key}`);
    }
  }
});

test('TIFF/TIF support and its first-page limitation are explicit on every localized image page', () => {
  const ids = ['image-format-converter', 'image-resizer-compressor', 'image-to-pdf'];
  for (const [language, data] of Object.entries(imageFormatLocales)) {
    assert.ok(tiffHints[language], `${language} TIFF limitation`);
    for (const id of ids) {
      assert.match(data.copy[id][3], /TIFF|TIF/u, `${language}/${id} keywords`);
      assert.ok(data.copy[id][5].includes(tiffHints[language]), `${language}/${id} explains TIFF behavior`);
      const tool = tools.find((item) => item.id === id);
      const values = data.copy[id];
      const html = renderToolPage({ ...tool, title: values[0], shortTitle: values[1], description: values[2], keywords: values[3], intro: values[4], body: values[5] }, 'test', language, tools);
      assert.ok(html.includes(tiffHints[language]), `${language}/${id} published TIFF guidance`);
    }
  }
});

test('HTML-to-PDF controls, SEO copy and safe-use limits are localized in every current language', () => {
  const keys = Object.keys(htmlToPdfLocales.en.ui).sort();
  const tool = tools.find((item) => item.id === 'html-to-pdf');
  assert.ok(tool, 'HTML-to-PDF tool is in the catalog');
  for (const [language, data] of Object.entries(htmlToPdfLocales)) {
    assert.deepEqual(Object.keys(data.ui).sort(), keys, `${language} UI keys`);
    assert.equal(data.copy['html-to-pdf'].length, 6, `${language} page copy`);
    const [title, , description, keywords, intro, body] = data.copy['html-to-pdf'];
    assert.ok(title && description.length >= 25 && description.length <= 155 && keywords && intro && body, `${language} SEO content`);
    assert.ok(body.length > 120, `${language} explains browser-print limitations`);
    if (language !== 'en') assert.notEqual(title, htmlToPdfLocales.en.copy['html-to-pdf'][0], `${language} page title must be translated`);
    for (const [key, value] of Object.entries(data.ui)) {
      assert.ok(value.trim(), `${language} UI ${key}`);
      if (language !== 'en') assert.notEqual(value, key, `${language} should not leave ${key} in English`);
      assert.equal(runtimeMessages[language]?.[key], value, `${language} runtime mapping ${key}`);
    }
    const html = renderToolPage({ ...tool, title, shortTitle: data.copy['html-to-pdf'][1], description, keywords, intro, body }, 'test', language, tools);
    assert.ok(html.includes(`data-tool="html-to-pdf"`), `${language} has the converter UI`);
    assert.ok(html.includes(data.ui['HTML content is limited to 250,000 characters. Website URLs are not fetched.']), `${language} has its input cap`);
  }
});

test('PDF/A visual-copy UI and page copy are complete in every current locale', () => {
  const supported = ['en', 'es', 'fr', 'pt', 'de', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'ur', 'tr', 'vi'];
  assert.deepEqual(Object.keys(pdfToPdfaLocales).sort(), [...supported].sort());
  const uiKeys = Object.keys(pdfToPdfaLocales.en.ui).sort();
  const deviceMetaKey = 'This PDF is processed on your device and is not uploaded. A computer is recommended for this memory-intensive conversion.';
  for (const language of supported) {
    const localized = pdfToPdfaLocales[language];
    assert.deepEqual(Object.keys(localized.ui).sort(), uiKeys, `${language} UI keys`);
    assert.equal(localized.copy['pdf-to-pdfa'].length, 6, `${language} SEO copy fields`);
    assert.ok(localized.ui[deviceMetaKey]?.trim(), `${language} local-processing meta`);
    for (const [index, value] of localized.copy['pdf-to-pdfa'].entries()) {
      assert.ok(value.trim(), `${language} copy field ${index} is empty`);
      if (language !== 'en') assert.notEqual(value, pdfToPdfaLocales.en.copy['pdf-to-pdfa'][index], `${language} copy field ${index} fell back to English`);
    }
    if (language !== 'en') for (const key of uiKeys) assert.notEqual(localized.ui[key], pdfToPdfaLocales.en.ui[key], `${language} UI string ${key} fell back to English`);
    if (language !== 'en') assert.notEqual(localized.ui[deviceMetaKey], deviceMetaKey, `${language} local-processing meta fell back to English`);
  }
});
