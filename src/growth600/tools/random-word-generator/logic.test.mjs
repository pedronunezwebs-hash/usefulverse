import assert from 'node:assert/strict';
import test from 'node:test';
import { createRandomWordSeed, generateRandomWords, RANDOM_WORD_LIMITS } from './logic.mjs';
import { RANDOM_WORD_CATEGORIES, RANDOM_WORD_DICTIONARIES } from './dictionaries.mjs';
import randomWordGeneratorCopies from '../../locales/random-word-generator-final.mjs';

const dictionary = Object.freeze([
  ...['apple', 'river', 'planet', 'quiet', 'forest', 'window', 'silver', 'garden'].map((word) => Object.freeze({ word, category: 'general' })),
  ...['orbit', 'comet', 'galaxy'].map((word) => Object.freeze({ word, category: 'science' })),
]);

test('same seed and filters reproduce an exact, unique selection', () => {
  const options = { words: dictionary, count: 6, minLength: 4, maxLength: 8, seed: 'sample-🌙' };
  const first = generateRandomWords(options);
  assert.deepEqual(generateRandomWords(options), first);
  assert.equal(first.words.length, 6);
  assert.equal(new Set(first.words.map((word) => word.toLocaleLowerCase())).size, 6);
  assert.ok(first.words.every((word) => [...word].length >= 4 && [...word].length <= 8));
});

test('a selected category never leaks words from other categories', () => {
  const result = generateRandomWords({ words: dictionary, count: 3, category: 'science', seed: 'stars' });
  assert.deepEqual(new Set(result.words), new Set(['orbit', 'comet', 'galaxy']));
  assert.equal(result.available, 3);
});

test('duplicate entries are removed case-insensitively and Unicode is normalized', () => {
  const words = [{ word: 'café', category: 'general' }, { word: 'cafe\u0301', category: 'general' }, { word: 'CAFÉ', category: 'general' }];
  assert.throws(() => generateRandomWords({ words, count: 2 }), { code: 'not-enough-matches' });
  assert.deepEqual(generateRandomWords({ words, count: 1 }).words, ['café']);
});

test('case-insensitive duplicate checks use the selected language rules', () => {
  const words = [
    { word: 'İzmir', category: 'places' },
    { word: 'izmir', category: 'places' },
    { word: 'Ankara', category: 'places' },
  ];
  assert.equal(generateRandomWords({ words, count: 2, category: 'places', minLength: 1, maxLength: 20, seed: 'tr', locale: 'tr' }).available, 2);
  assert.throws(() => generateRandomWords({ words, count: 3, category: 'places', minLength: 1, maxLength: 20, seed: 'tr', locale: 'bad_tag!' }), /invalid-locale/u);
});

test('internal Traditional Chinese locale keys are normalized for Unicode casing', () => {
  const words = RANDOM_WORD_DICTIONARIES.zh_tw;
  const result = generateRandomWords({ words, count: 3, category: 'nature', seed: 'zh-tw', locale: 'zh_tw' });
  assert.equal(result.words.length, 3);
  assert.ok(result.words.every((word) => words.some((entry) => entry.word === word)));
});

test('missing locale dictionary and impossible filters fail instead of falling back to English', () => {
  assert.throws(() => generateRandomWords({}), { code: 'dictionary-unavailable' });
  assert.throws(() => generateRandomWords({ words: dictionary, count: 2, minLength: 30 }), { code: 'not-enough-matches' });
});

test('count, lengths, category and seed are bounded and validated', () => {
  assert.throws(() => generateRandomWords({ words: dictionary, count: 0 }), { code: 'invalid-count' });
  assert.throws(() => generateRandomWords({ words: dictionary, count: RANDOM_WORD_LIMITS.maxWords + 1 }), { code: 'invalid-count' });
  assert.throws(() => generateRandomWords({ words: dictionary, minLength: 5, maxLength: 4 }), { code: 'invalid-length-range' });
  assert.throws(() => generateRandomWords({ words: dictionary, category: '' }), { code: 'invalid-category' });
  assert.throws(() => generateRandomWords({ words: dictionary, seed: 'x'.repeat(RANDOM_WORD_LIMITS.maxSeedLength + 1) }), { code: 'invalid-seed' });
});

test('new random seed requires and uses the secure random API', () => {
  assert.throws(() => createRandomWordSeed({}), /secure-random-unavailable/u);
  assert.equal(createRandomWordSeed({ getRandomValues(values) { values.set([15, 255]); return values; } }), '0000000f000000ff');
});

test('available language dictionaries contain localized words and filter categories', () => {
  assert.deepEqual(Object.keys(RANDOM_WORD_DICTIONARIES), ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'id', 'hi', 'ar', 'zh', 'bn', 'ru', 'tr', 'vi', 'it', 'zh_tw', 'bg', 'ca', 'nl', 'el', 'ms', 'pl', 'sv', 'th', 'uk', 'sw', 'mr', 'te', 'ha', 'tl', 'ur', 'ta', 'fa', 'am', 'gu']);
  assert.ok(RANDOM_WORD_CATEGORIES.includes('nature'));
  for (const [locale, words] of Object.entries(RANDOM_WORD_DICTIONARIES)) {
    assert.ok(words.length >= 100, `${locale} has a useful starter pool`);
    for (const category of RANDOM_WORD_CATEGORIES.slice(1)) {
      const matches = words.filter((entry) => entry.category === category);
      assert.ok(matches.length >= 20, `${locale}/${category} has enough choices`);
      assert.equal(generateRandomWords({ words, count: 12, category, seed: `${category}-${locale}`, locale }).words.length, 12);
    }
    const canonicalLocale = Intl.getCanonicalLocales(locale.replaceAll('_', '-'))[0];
    assert.equal(new Set(words.map(({ word }) => word.toLocaleLowerCase(canonicalLocale))).size, words.length, `${locale} has no duplicate words`);
    assert.ok(words.every(({ word }) => word === word.normalize('NFC') && word.trim() === word), `${locale} words are normalized`);
  }
  assert.deepEqual(generateRandomWords({ words: RANDOM_WORD_DICTIONARIES.es, count: 1, category: 'places', seed: 'es-place' }).words.length, 1);
});

test('the localized example generates successfully in every supported language', () => {
  for (const [locale, copy] of Object.entries(randomWordGeneratorCopies)) {
    assert.ok(copy, `missing localized copy for ${locale}`);
    const result = generateRandomWords({ words: RANDOM_WORD_DICTIONARIES[locale], locale, ...copy.example });
    assert.equal(result.words.length, copy.example.count, locale);
    assert.equal(new Set(result.words.map((word) => word.toLocaleLowerCase(locale.replaceAll('_', '-')))).size, copy.example.count, locale);
  }
});
