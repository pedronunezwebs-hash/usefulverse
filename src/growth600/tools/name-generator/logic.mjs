const MAX_SEED_LENGTH = 80;
const MAX_KEYWORD_LENGTH = 40;
const MAX_NAMES = 20;

const FANTASY_ONSETS = ['br', 'c', 'd', 'dr', 'f', 'g', 'gr', 'k', 'l', 'm', 'n', 'r', 's', 'sh', 'th', 'v', 'w', 'z'];
const FANTASY_VOWELS = ['a', 'ae', 'e', 'ia', 'i', 'o', 'ou', 'u'];
const FANTASY_CODAS = ['', 'n', 'r', 's', 'th', 'l', 'm'];
const BRAND_ADJECTIVES = ['bright', 'calm', 'clear', 'clever', 'ember', 'fresh', 'golden', 'kind', 'little', 'northern', 'open', 'swift', 'true', 'wild'];
const BRAND_NOUNS = ['anchor', 'arc', 'bloom', 'bridge', 'field', 'forge', 'grove', 'harbor', 'maple', 'meadow', 'orbit', 'path', 'signal', 'spark', 'stone', 'summit', 'thread', 'willow'];
const BRAND_ENDINGS = ['co', 'collective', 'company', 'craft', 'works', 'studio', 'supply', 'house', 'lab'];
const USERNAME_WORDS = ['amber', 'blue', 'comet', 'copper', 'dawn', 'echo', 'fern', 'fox', 'jade', 'lunar', 'moss', 'nova', 'pixel', 'river', 'solar', 'sparrow', 'violet', 'wolf'];

export class NameGeneratorInputError extends RangeError {
  constructor(code) {
    super(code);
    this.name = 'NameGeneratorInputError';
    this.code = code;
  }
}

function hashSeed(seed) {
  let value = 2166136261;
  for (const char of seed) {
    value ^= char.codePointAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0 || 0x9e3779b9;
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

function pick(list, random) {
  return list[Math.floor(random() * list.length)];
}

function validate({ type = 'fantasy', count = 10, keyword = '', seed } = {}) {
  if (!['fantasy', 'business', 'username'].includes(type)) throw new NameGeneratorInputError('invalid-type');
  if (!Number.isInteger(count) || count < 1 || count > MAX_NAMES) throw new NameGeneratorInputError('invalid-count');
  if (typeof keyword !== 'string' || keyword.trim().length > MAX_KEYWORD_LENGTH || /[\u0000-\u001f\u007f]/u.test(keyword)) {
    throw new NameGeneratorInputError('invalid-keyword');
  }
  if (typeof seed !== 'string' || !seed.trim() || seed.length > MAX_SEED_LENGTH || /[\u0000-\u001f\u007f]/u.test(seed)) {
    throw new NameGeneratorInputError('invalid-seed');
  }
  return { type, count, keyword: keyword.trim().replace(/\s+/gu, ' '), seed: seed.trim() };
}

function fantasyName(random) {
  const syllable = () => `${pick(FANTASY_ONSETS, random)}${pick(FANTASY_VOWELS, random)}${pick(FANTASY_CODAS, random)}`;
  const first = `${syllable()}${syllable()}`;
  return `${first[0].toLocaleUpperCase()}${first.slice(1)}`;
}

function createCandidate(type, keyword, random, index) {
  if (type === 'fantasy') return fantasyName(random);
  if (type === 'business') {
    const lead = keyword ? `${keyword} ` : '';
    const format = Math.floor(random() * 3);
    if (format === 0) return `${lead}${pick(BRAND_ADJECTIVES, random)} ${pick(BRAND_NOUNS, random)}`.trim();
    if (format === 1) return `${lead}${pick(BRAND_NOUNS, random)} ${pick(BRAND_ENDINGS, random)}`.trim();
    return `${lead}${pick(BRAND_ADJECTIVES, random)} ${pick(BRAND_NOUNS, random)} ${pick(BRAND_ENDINGS, random)}`.trim();
  }
  const word = pick(USERNAME_WORDS, random);
  const format = Math.floor(random() * 3);
  const prefix = keyword ? `${keyword.replace(/\s+/gu, '')}` : '';
  if (format === 0) return `${prefix}${word}`;
  if (format === 1) return `${word}${prefix}`;
  return `${prefix}${word}${String(10 + Math.floor(random() * 990))}${index ? '' : ''}`;
}

/** Generates reproducible, original suggestions. It does not check trademarks, handles, or domains. */
export function generateNames(options = {}) {
  const input = validate(options);
  const random = seededRandom(input.seed);
  const names = [];
  const seen = new Set();
  const attemptLimit = input.count * 100;
  for (let attempt = 0; attempt < attemptLimit && names.length < input.count; attempt += 1) {
    let candidate = createCandidate(input.type, input.keyword, random, names.length);
    if (input.type === 'username' && candidate.length > 24) candidate = candidate.slice(0, 24);
    const key = candidate.toLocaleLowerCase();
    if (!candidate || seen.has(key)) continue;
    seen.add(key);
    names.push(candidate);
  }
  return { type: input.type, seed: input.seed, names };
}

export function createNameGeneratorSeed(cryptoApi = globalThis.crypto) {
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') throw new Error('secure-random-unavailable');
  const bytes = new Uint32Array(2);
  cryptoApi.getRandomValues(bytes);
  return [...bytes].map((value) => value.toString(16).padStart(8, '0')).join('');
}
