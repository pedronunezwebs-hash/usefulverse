const MAX_TEXT = 120;
const MAX_WORDS = 8;

const CONSONANTS = Object.freeze({
  B: 'b', CH: 'tʃ', D: 'd', DH: 'ð', F: 'f', G: 'ɡ', HH: 'h', JH: 'dʒ',
  K: 'k', L: 'l', M: 'm', N: 'n', NG: 'ŋ', P: 'p', R: 'ɹ', S: 's',
  SH: 'ʃ', T: 't', TH: 'θ', V: 'v', W: 'w', Y: 'j', Z: 'z', ZH: 'ʒ',
});

const VOWELS = Object.freeze({
  AA: ['ɑ', 'ɑ'], AE: ['æ', 'æ'], AH: ['ə', 'ʌ'], AO: ['ɔ', 'ɔ'],
  AW: ['aʊ', 'aʊ'], AY: ['aɪ', 'aɪ'], EH: ['ɛ', 'ɛ'], ER: ['ɚ', 'ɝ'], EY: ['eɪ', 'eɪ'],
  IH: ['ɪ', 'ɪ'], IY: ['i', 'i'], OW: ['oʊ', 'oʊ'], OY: ['ɔɪ', 'ɔɪ'],
  UH: ['ʊ', 'ʊ'], UW: ['u', 'u'],
});

export function parseCmuDictionary(source) {
  if (typeof source !== 'string' || source.length > 6 * 1024 * 1024) throw new RangeError('Pronunciation data exceeds its size limit.');
  const dictionary = new Map();
  for (const line of source.split(/\r?\n/u)) {
    const match = line.trim().match(/^([^\s]+)\s+(.+)$/u);
    if (!match) continue;
    const wordEntry = match[1].toUpperCase();
    const variantMatch = wordEntry.match(/^(.*)\((\d+)\)$/u);
    const word = variantMatch?.[1] ?? wordEntry;
    const variant = variantMatch ? Number(variantMatch[2]) : 1;
    const phones = match[2].trim().split(/\s+/u);
    if (!word || !Number.isSafeInteger(variant) || variant < 1 || !phones.length || phones.some((phone) => !isSupportedPhone(phone))) continue;
    const entries = dictionary.get(word) ?? [];
    entries.push(Object.freeze({ variant, phones: Object.freeze(phones) }));
    dictionary.set(word, entries);
  }
  for (const [word, entries] of dictionary) {
    dictionary.set(word, Object.freeze(entries.sort((left, right) => left.variant - right.variant)));
  }
  return dictionary;
}

export function validateTranscriptionInput(value) {
  const text = String(value ?? '').trim();
  if (!text || text.length > MAX_TEXT || !/^[A-Za-z'’\-.,!?;:() ]+$/u.test(text)) {
    const error = new RangeError('Enter up to 120 characters using English letters and punctuation.');
    error.code = 'invalid-input';
    throw error;
  }
  const words = text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/gu) ?? [];
  if (!words.length || words.length > MAX_WORDS) {
    const error = new RangeError('Enter between one and eight English words.');
    error.code = 'invalid-input';
    throw error;
  }
  return Object.freeze(words.map((word) => word.replaceAll('’', "'").toUpperCase()));
}

export function arpabetToIpa(phones) {
  if (!Array.isArray(phones) || !phones.length || phones.some((phone) => !isSupportedPhone(phone))) {
    const error = new TypeError('The pronunciation contains an unsupported phone.');
    error.code = 'invalid-pronunciation';
    throw error;
  }
  let output = '';
  let onset = '';
  for (const phone of phones) {
    const match = phone.match(/^([A-Z]+)([012])?$/u);
    const symbol = match[1];
    if (Object.hasOwn(VOWELS, symbol)) {
      const stress = match[2];
      const mark = stress === '1' ? 'ˈ' : stress === '2' ? 'ˌ' : '';
      const vowel = symbol === 'ER' ? (stress === '0' ? 'ɚ' : 'ɝ') : VOWELS[symbol][symbol === 'AH' && stress !== '0' ? 1 : 0];
      output += `${mark}${onset}${vowel}`;
      onset = '';
    } else {
      onset += CONSONANTS[symbol];
    }
  }
  return `${output}${onset}`;
}

export function lookupCmuWords(dictionary, value) {
  const words = validateTranscriptionInput(value);
  const results = words.map((word) => {
    const pronunciations = (dictionary.get(word) ?? []).slice(0, 4).map(({ variant, phones }) => Object.freeze({
      variant,
      arpabet: phones.join(' '),
      ipa: arpabetToIpa(phones),
    }));
    return Object.freeze({ word, pronunciations: Object.freeze(pronunciations) });
  });
  return Object.freeze({
    words: Object.freeze(results),
    unsupported: Object.freeze(results.filter(({ pronunciations }) => !pronunciations.length).map(({ word }) => word)),
  });
}

function isSupportedPhone(phone) {
  const match = String(phone).match(/^([A-Z]+)([012])?$/u);
  return Boolean(match && (Object.hasOwn(CONSONANTS, match[1]) || Object.hasOwn(VOWELS, match[1])));
}
