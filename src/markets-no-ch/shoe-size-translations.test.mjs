import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { translationsByLocale } from './translations.mjs';
import { shoeSizeEnglish } from './shoe-size-copy-en.mjs';
import { shoeSizeTranslationsByLocale } from './shoe-size-translations.mjs';
import { shoeSizeTranslationOverrides } from './shoe-size-translation-overrides.mjs';

const flattenStrings = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flattenStrings(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flattenStrings(item, output));
  return output;
};
const sources = [...new Set(flattenStrings(shoeSizeEnglish))].filter((source) => !Object.hasOwn(translationsByLocale.es, source));
const locales = [...localeEntries, { key: 'nb', code: 'nb-NO' }].filter(({ key }) => key !== 'en');

test('Shoe chart copy has a complete static pack for every non-English locale', () => {
  assert.equal(sources.length, 58);
  for (const { key } of locales) {
    const pack = shoeSizeTranslationsByLocale[key];
    assert.ok(pack, `${key} pack exists`);
    assert.equal(Object.keys(pack).length, sources.length, `${key} string coverage`);
    for (const source of sources) assert.ok(pack[source]?.trim(), `${key}: ${source}`);
    for (const [source, translated] of Object.entries(shoeSizeTranslationOverrides[key] ?? {})) {
      assert.deepEqual(translated.match(/\{[^{}]+\}/gu) ?? [], source.match(/\{[^{}]+\}/gu) ?? [], `${key}: override placeholders`);
    }
  }
});

test('Shoe size guidance stays global and asks the user for the exact current chart', () => {
  assert.match(shoeSizeEnglish.fields.scope, /Global length comparison/u);
  assert.match(shoeSizeEnglish.faq[0].a, /exact shoe/u);
  assert.match(shoeSizeEnglish.limits, /supplied by you/u);
  assert.doesNotMatch(shoeSizeEnglish.title, /Norway|Norwegian|Switzerland|Swiss/u);
});
