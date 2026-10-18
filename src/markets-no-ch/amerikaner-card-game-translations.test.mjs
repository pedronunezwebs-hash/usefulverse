import test from 'node:test';
import assert from 'node:assert/strict';
import { localeEntries } from '../locales.mjs';
import { amerikanerCardGameEnglish } from './amerikaner-card-game-copy-en.mjs';
import { amerikanerCardGameTranslationsByLocale } from './amerikaner-card-game-translations.mjs';
import { translationsByLocale } from './translations.mjs';

const locales = [...localeEntries.map(({ key }) => key), 'nb'];
const strings = [];
const collect = (value) => {
  if (typeof value === 'string') strings.push(value);
  else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};
collect(amerikanerCardGameEnglish);
const sources = [...new Set(strings)];
const shared = new Set(Object.keys(translationsByLocale.es));
const toolSources = sources.filter((source) => !shared.has(source));
const variables = (text) => [...(text.matchAll(/\{[^{}]+\}/gu))].map(([token]) => token).sort();

test('Amerikaner has complete static tool-specific copy for every non-English locale', () => {
  assert.deepEqual(Object.keys(amerikanerCardGameTranslationsByLocale).sort(), locales.filter((key) => key !== 'en').sort());
  for (const locale of locales.filter((key) => key !== 'en')) {
    const dictionary = amerikanerCardGameTranslationsByLocale[locale];
    assert.deepEqual(Object.keys(dictionary).sort(), toolSources.sort(), `incomplete source coverage for ${locale}`);
    for (const source of toolSources) {
      assert.ok(dictionary[source]?.trim(), `empty ${locale} translation for ${source}`);
      assert.deepEqual(variables(dictionary[source]), variables(source), `placeholder mismatch for ${locale}: ${source}`);
    }
  }
});
