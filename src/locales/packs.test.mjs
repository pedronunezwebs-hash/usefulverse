import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { packs } from '../locales.mjs';
import { pageKeys, templateKeys } from './template-keys.mjs';
import { numberToWordsHook } from './test-harness.mjs';

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/gu)].map((match) => match[1]).sort();

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
      const title = `${seo.title} | UsefulVerse`;
      assert.ok(title.length >= 15 && title.length <= 65, `seo.${tool.id}.title length ${title.length}`);
      assert.ok(seo.description.length >= 25 && seo.description.length <= 155, `seo.${tool.id}.description length ${seo.description.length}`);
      assert.ok(!titles.has(title), `duplicate title ${title}`);
      titles.add(title);
      const faq = pack.faq[tool.id];
      assert.ok(Array.isArray(faq) && faq.length >= 2, `faq.${tool.id}`);
      for (const item of faq) assert.ok(item.question?.trim() && item.answer?.trim(), `faq.${tool.id} item`);
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
