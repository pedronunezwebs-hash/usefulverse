import test from 'node:test';
import assert from 'node:assert/strict';
import { translationsByLocale } from './translations.mjs';
import { snakesAndLaddersEnglish } from './snakes-and-ladders-copy-en.mjs';
import { snakesAndLaddersTranslationsByLocale } from './snakes-and-ladders-translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};

test('Snakes and Ladders has complete static copy in all 36 non-English locales', () => {
  const sources = [...new Set(flatten(snakesAndLaddersEnglish))];
  assert.equal(sources.length, 68);
  assert.deepEqual(Object.keys(snakesAndLaddersTranslationsByLocale).sort(), Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort());
  for (const [locale, dictionary] of Object.entries(snakesAndLaddersTranslationsByLocale)) {
    assert.equal(Object.keys(dictionary).length, sources.length, `${locale} has a translation for each unique source`);
    for (const source of sources) {
      assert.ok(dictionary[source]?.trim(), `${locale} is missing: ${source}`);
      for (const placeholder of source.match(/\{[^{}]+\}/gu) ?? []) assert.ok(dictionary[source].includes(placeholder), `${locale} lost ${placeholder} in ${source}`);
      assert.doesNotMatch(dictionary[source], /QZX\d{3}QZX|⟪UV_[A-Z]+⟫/u, `${locale} contains a translation capture marker`);
    }
  }
});

test('translated game is presented as globally playable with its selected edition rules', () => {
  for (const locale of ['es', 'nb', 'fa', 'gu', 'ar']) {
    const dictionary = snakesAndLaddersTranslationsByLocale[locale];
    assert.ok(Object.keys(dictionary).some((source) => source.startsWith('No. Boards and finishing rules vary.')));
    assert.ok(Object.keys(dictionary).some((source) => source.startsWith('Snakes and Ladders is played in many places')));
  }
  assert.match(snakesAndLaddersTranslationsByLocale.nb['Snakes and Ladders'], /Slanger og stiger/u);
  assert.match(snakesAndLaddersTranslationsByLocale.es['Snakes and Ladders'], /Serpientes y escaleras/u);
});
