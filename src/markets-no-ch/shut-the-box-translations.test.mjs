import test from 'node:test';
import assert from 'node:assert/strict';
import { shutTheBoxEnglish } from './shut-the-box-copy-en.mjs';
import { shutTheBoxTranslationsByLocale } from './shut-the-box-translations.mjs';
import { translationsByLocale } from './translations.mjs';

const flatten = (value, output = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => flatten(item, output));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flatten(item, output));
  return output;
};
const sources = [...new Set(flatten(shutTheBoxEnglish))];

test('Shut the Box has complete static copy and preserved variables for all 36 non-English locales', () => {
  const expected = Object.keys(translationsByLocale).sort();
  assert.deepEqual(Object.keys(shutTheBoxTranslationsByLocale).sort(), expected);
  for (const locale of expected) {
    const dictionary = shutTheBoxTranslationsByLocale[locale];
    assert.deepEqual(Object.keys(dictionary).sort(), [...sources].sort());
    for (const source of sources) {
      const translated = dictionary[source];
      assert.equal(typeof translated, 'string', `${locale}: ${source}`);
      assert.ok(translated.trim(), `${locale}: ${source}`);
      for (const token of source.match(/\{[^{}]+\}/gu) ?? []) assert.ok(translated.includes(token), `${locale} lost ${token}`);
      assert.doesNotMatch(translated, /ZXV\d+ZX/u, `${locale} has an unresolved protected marker`);
    }
    assert.ok(dictionary[shutTheBoxEnglish.title].startsWith(dictionary[shutTheBoxEnglish.name]), `${locale}: title should start with its localized tool name`);
    assert.notEqual(dictionary[shutTheBoxEnglish.name], shutTheBoxEnglish.name, `${locale}: name should include a useful local-language gloss`);
  }
});

test('the Spanish route teaches the same game without requiring Norwegian knowledge', () => {
  const spanish = Object.values(shutTheBoxTranslationsByLocale.es).join(' ');
  assert.match(spanish, /reglas para los dados/u);
  assert.match(spanish, /mismo dispositivo/u);
  assert.match(spanish, /No existe una modalidad multijugador/u);
  assert.doesNotMatch(spanish, /Noruega|noruego|corona noruega/iu);
});

test('Tamil uses consistent terms for dice and numbered tiles', () => {
  const tamil = shutTheBoxTranslationsByLocale.ta;
  assert.match(tamil[shutTheBoxEnglish.fields.diceRule], /பகடை/u);
  assert.match(tamil[shutTheBoxEnglish.fields.roll], /பகடைகளை/u);
  assert.match(tamil[shutTheBoxEnglish.fields.openTiles], /கட்டைகள்/u);
  assert.match(tamil[shutTheBoxEnglish.fields.tileLabel], /கட்டை \{number\}/u);
});
