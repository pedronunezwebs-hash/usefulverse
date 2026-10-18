import test from 'node:test';
import assert from 'node:assert/strict';
import { translationsByLocale } from './translations.mjs';
import { grisCardGameEnglish } from './gris-card-game-copy-en.mjs';
import { grisCardGameTranslationsByLocale } from './gris-card-game-translations.mjs';
import { grisCardGameTranslationOverrides } from './gris-card-game-translation-overrides.mjs';

function flatten(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
}

test('Gris has a complete static translation for every non-English site locale', () => {
  const sources = [...new Set(flatten(grisCardGameEnglish))];
  const localSources = sources.filter((source) => !Object.hasOwn(translationsByLocale.es, source));
  assert.equal(localSources.length, 79);
  assert.deepEqual(Object.keys(grisCardGameTranslationsByLocale).sort(), Object.keys(translationsByLocale).filter((locale) => locale !== 'en').sort());
  for (const locale of Object.keys(grisCardGameTranslationsByLocale)) {
    const dictionary = { ...grisCardGameTranslationsByLocale[locale], ...grisCardGameTranslationOverrides[locale] };
    assert.equal(Object.keys(dictionary).length, localSources.length, `${locale} has exactly the required tool-specific strings`);
    for (const source of localSources) {
      const translated = dictionary[source];
      assert.equal(typeof translated, 'string', `${locale} is missing ${source}`);
      assert.ok(translated.trim(), `${locale} has an empty ${source}`);
      for (const token of source.match(/\{[^{}]+\}/gu) ?? []) assert.ok(translated.includes(token), `${locale} lost ${token} in ${source}`);
      assert.doesNotMatch(translated, /QZX\d{3}QZX|ZXQ[A-Z]+ZXQ/u, `${locale} leaked a capture marker`);
    }
  }
});

test('regional name overrides keep Gris identifiable and locale nb is Norwegian Bokmål', () => {
  for (const locale of ['fa', 'gu', 'ha', 'ko', 'sw', 'ur', 'zh_tw']) {
    const dictionary = { ...grisCardGameTranslationsByLocale[locale], ...grisCardGameTranslationOverrides[locale] };
    assert.match(dictionary['Norwegian Gris Card Game'], /Gris/u, `${locale} preserves the named game`);
    assert.match(dictionary['Gris Card Game — Learn and Play the Norwegian Suit-Collecting Variant'], /Gris/u, `${locale} preserves the named game in the title`);
  }
  const bokmal = { ...grisCardGameTranslationsByLocale.nb, ...grisCardGameTranslationOverrides.nb };
  assert.equal(bokmal['Game status'], 'Spillstatus');
  assert.match(bokmal['Norwegian Gris Card Game'], /kortspillet Gris/u);
});
