import test from 'node:test';
import assert from 'node:assert/strict';
import { geographyQuizEnglish } from './geography-quiz-copy-en.mjs';
import { geographyQuizTranslationsByLocale } from './geography-quiz-translations.mjs';
import { translationsByLocale } from './translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(geographyQuizEnglish))];

test('geography copy is static and complete for all 36 non-English routes', () => {
  const expected = Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort();
  assert.deepEqual(Object.keys(geographyQuizTranslationsByLocale).sort(), expected);
  for (const locale of expected) {
    const dictionary = geographyQuizTranslationsByLocale[locale];
    assert.deepEqual(Object.keys(dictionary).sort(), sources.sort());
    for (const source of sources) {
      const translated = dictionary[source];
      assert.equal(typeof translated, 'string', `${locale}: ${source}`);
      assert.ok(translated.trim(), `${locale}: ${source}`);
      for (const token of source.match(/\{[^{}]+\}/gu) ?? []) assert.ok(translated.includes(token), `${locale} lost ${token}`);
    }
  }
});

test('Bokmål and Gujarati captures stay assigned to their own language routes', () => {
  const nb = Object.values(geographyQuizTranslationsByLocale.nb).join(' ');
  const gu = Object.values(geographyQuizTranslationsByLocale.gu).join(' ');
  assert.match(nb, /[æøå]/iu);
  assert.match(gu, /[અ-હ]/u);
  assert.doesNotMatch(nb, /[ऀ-෿]/u);
  assert.doesNotMatch(gu, /[æøå]/iu);
});

test('localized geography title begins with the localized tool name', () => {
  for (const dictionary of Object.values(geographyQuizTranslationsByLocale)) {
    assert.ok(dictionary[geographyQuizEnglish.title].startsWith(dictionary[geographyQuizEnglish.name]));
  }
});
