import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { translationsByLocale } from './translations.mjs';
import { codebreakerEnglish } from './codebreaker-copy-en.mjs';
import { codebreakerTranslationsByLocale } from './codebreaker-translations.mjs';
import { codebreakerTranslationOverrides } from './codebreaker-translation-overrides.mjs';

const flattenStrings = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flattenStrings(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flattenStrings(item, output));
  return output;
};
const sources = [...new Set(flattenStrings(codebreakerEnglish))].filter((source) => !Object.hasOwn(translationsByLocale.es, source));
const locales = [...localeEntries, { key: 'nb', code: 'nb-NO' }].filter(({ key }) => key !== 'en');

test('Codebreaker has complete static translation packs and exact runtime placeholders in all 36 non-English locales', () => {
  assert.equal(sources.length, 69);
  for (const { key } of locales) {
    const pack = codebreakerTranslationsByLocale[key];
    assert.ok(pack, `${key} pack exists`);
    assert.equal(Object.keys(pack).length, sources.length, `${key} string coverage`);
    for (const source of sources) {
      assert.ok(pack[source]?.trim(), `${key}: ${source}`);
      assert.deepEqual(pack[source].match(/\{[^{}]+\}/gu) ?? [], source.match(/\{[^{}]+\}/gu) ?? [], `${key}: ${source} runtime variables`);
    }
    for (const [source, translated] of Object.entries(codebreakerTranslationOverrides[key] ?? {})) {
      assert.deepEqual(translated.match(/\{[^{}]+\}/gu) ?? [], source.match(/\{[^{}]+\}/gu) ?? [], `${key}: override runtime variables`);
    }
  }
});

test('Codebreaker copy describes the same language-neutral rules and global UTC daily challenge', () => {
  assert.match(codebreakerEnglish.fields.scope, /same worldwide/u);
  assert.match(codebreakerEnglish.faq[0].a, /same around the world/u);
  assert.match(codebreakerEnglish.limits, /UTC date/u);
  assert.doesNotMatch(codebreakerEnglish.intro, /Norway|Norwegian|Switzerland|Swiss/u);
});
