const MAX_WORDS = 100;
const MAX_SEED_LENGTH = 80;
const MAX_WORD_LENGTH = 64;

export class RandomWordInputError extends RangeError {
  constructor(code) {
    super(code);
    this.name = 'RandomWordInputError';
    this.code = code;
  }
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 0x9e3779b9;
}

function seededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}

function validateOptions({ words, count = 10, minLength = 1, maxLength = MAX_WORD_LENGTH, category = 'all', seed = '', locale = 'en' } = {}) {
  if (!Array.isArray(words) || words.length === 0) throw new RandomWordInputError('dictionary-unavailable');
  if (!Number.isInteger(count) || count < 1 || count > MAX_WORDS) throw new RandomWordInputError('invalid-count');
  if (!Number.isInteger(minLength) || !Number.isInteger(maxLength) || minLength < 1 || maxLength > MAX_WORD_LENGTH || minLength > maxLength) {
    throw new RandomWordInputError('invalid-length-range');
  }
  if (typeof category !== 'string' || !category.trim()) throw new RandomWordInputError('invalid-category');
  if (typeof seed !== 'string' || seed.length > MAX_SEED_LENGTH || /[\u0000-\u001f\u007f]/u.test(seed)) throw new RandomWordInputError('invalid-seed');
  if (typeof locale !== 'string' || !locale.trim()) throw new RandomWordInputError('invalid-locale');
  let canonicalLocale;
  try { [canonicalLocale] = Intl.getCanonicalLocales(locale.replaceAll('_', '-')); }
  catch { throw new RandomWordInputError('invalid-locale'); }

  const normalizedWords = [];
  const seen = new Set();
  for (const entry of words) {
    if (!entry || typeof entry.word !== 'string' || typeof entry.category !== 'string') continue;
    const word = entry.word.normalize('NFC').trim();
    const wordCategory = entry.category.trim();
    if (!word || [...word].length > MAX_WORD_LENGTH || !wordCategory) continue;
    const key = word.toLocaleLowerCase(canonicalLocale);
    if (seen.has(key)) continue;
    seen.add(key);
    if (category !== 'all' && wordCategory !== category) continue;
    const length = [...word].length;
    if (length >= minLength && length <= maxLength) normalizedWords.push(Object.freeze({ word, category: wordCategory }));
  }
  if (normalizedWords.length < count) throw new RandomWordInputError('not-enough-matches');
  return { pool: normalizedWords, count, category, seed: seed.trim() };
}

/**
 * Selects unique words from a caller-supplied, locale-specific dictionary.
 * The dictionary is intentionally mandatory: the generator never silently
 * substitutes English for a missing locale.
 */
export function generateRandomWords(options = {}) {
  const { pool, count, category, seed } = validateOptions(options);
  const random = seededRandom(seed || 'usefulverse-random-word-generator');
  const shuffled = [...pool];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return Object.freeze({
    seed,
    category,
    words: Object.freeze(shuffled.slice(0, count).map(({ word }) => word)),
    available: pool.length,
  });
}

export function createRandomWordSeed(cryptoApi = globalThis.crypto) {
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') throw new Error('secure-random-unavailable');
  const values = new Uint32Array(2);
  cryptoApi.getRandomValues(values);
  return [...values].map((value) => value.toString(16).padStart(8, '0')).join('');
}

export const RANDOM_WORD_LIMITS = Object.freeze({ maxWords: MAX_WORDS, maxSeedLength: MAX_SEED_LENGTH, maxWordLength: MAX_WORD_LENGTH });
