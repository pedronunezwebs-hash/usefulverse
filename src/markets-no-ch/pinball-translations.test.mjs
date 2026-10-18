import test from 'node:test';
import assert from 'node:assert/strict';
import { translationsByLocale } from './translations.mjs';
import { pinballEnglish } from './pinball-copy-en.mjs';
import { pinballTranslationsByLocale } from './pinball-translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};

test('Pinball has complete static translations in every non-English locale', () => {
  const sources = [...new Set(flatten(pinballEnglish))];
  const toolSources = sources.filter((source) => !Object.hasOwn(translationsByLocale.es ?? {}, source));
  assert.equal(sources.length, 56);
  assert.deepEqual(Object.keys(pinballTranslationsByLocale).sort(), Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort());
  for (const [locale, dictionary] of Object.entries(pinballTranslationsByLocale)) {
    assert.equal(Object.keys(dictionary).length, toolSources.length, `${locale} has all tool-specific strings`);
    for (const source of toolSources) {
      assert.ok(dictionary[source]?.trim(), `${locale} is missing: ${source}`);
      for (const placeholder of source.match(/\{[^{}]+\}/gu) ?? []) assert.ok(dictionary[source].includes(placeholder), `${locale} lost ${placeholder}`);
      assert.doesNotMatch(dictionary[source], /QZX\d{3}QZX|⟪UV_[A-Z]+⟫|987654321/u, `${locale} has a capture marker`);
    }
    const mergedDictionary = { ...(translationsByLocale[locale] ?? {}), ...dictionary };
    assert.ok(mergedDictionary['Pinball Game — Free Local Flipper and Bumper Table'].startsWith(mergedDictionary['Pinball Game']), `${locale} title begins with the localized game name`);
  }
});

test('Pinball copy describes a globally playable local score game without commercial or online claims', () => {
  assert.match(pinballEnglish.details, /casual score game/u);
  assert.match(pinballEnglish.details, /no wagers, cash prizes, accounts or online opponents/u);
  assert.match(pinballEnglish.privacy, /nothing is uploaded/u);
  assert.match(pinballEnglish.fields.tableLabel, /Original local/u);
});
