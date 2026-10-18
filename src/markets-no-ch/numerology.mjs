const MASTER_NUMBERS = new Set([11, 22, 33]);
const LETTER_VALUES = Object.freeze(Object.fromEntries(
  Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter, index) => [letter, (index % 9) + 1]),
));
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
const LATIN_EXPANSIONS = Object.freeze({ 'ß': 'ss', 'æ': 'ae', 'ø': 'o', 'ł': 'l', 'đ': 'd', 'ð': 'd', 'þ': 'th', 'ı': 'i' });

function digitSum(value) {
  return String(value).split('').reduce((sum, digit) => sum + Number(digit), 0);
}

export function reduceNumerologyNumber(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Enter a non-negative whole number.');
  const steps = [String(value)];
  let current = value;
  while (current > 9 && !MASTER_NUMBERS.has(current)) {
    current = digitSum(current);
    steps.push(String(current));
  }
  return Object.freeze({ value: current, steps: Object.freeze(steps) });
}

export function normalizeNumerologyName(value) {
  if (typeof value !== 'string') throw new TypeError('Enter a name as text.');
  const expanded = [...value].map((character) => LATIN_EXPANSIONS[character] ?? LATIN_EXPANSIONS[character.toLowerCase()] ?? character).join('');
  const normalized = expanded.normalize('NFKD').replace(/[\u0300-\u036f]/gu, '').toUpperCase();
  const letters = [];
  const unsupported = [];
  for (const character of normalized) {
    if (/[A-Z]/u.test(character)) letters.push(character);
    else if (/\p{L}/u.test(character)) unsupported.push(character);
  }
  return Object.freeze({ letters: Object.freeze(letters), unsupported: Object.freeze([...new Set(unsupported)]) });
}

function sumLetters(letters) {
  const values = letters.map((letter) => LETTER_VALUES[letter]);
  const sum = values.reduce((total, value) => total + value, 0);
  const reduced = reduceNumerologyNumber(sum);
  return Object.freeze({ value: reduced.value, sum, values: Object.freeze(values), steps: reduced.steps });
}

export function calculateNumerology({ birthDate, name = '' }) {
  if (typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(birthDate)) throw new RangeError('Enter a valid date of birth.');
  const [year, month, day] = birthDate.split('-').map(Number);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (year < 1 || check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw new RangeError('Enter a real calendar date.');
  }
  if (year > 9999) throw new RangeError('Enter a valid date of birth.');
  const dateDigits = birthDate.replaceAll('-', '').split('').map(Number);
  const lifePath = reduceNumerologyNumber(dateDigits.reduce((sum, digit) => sum + digit, 0));
  const birthday = reduceNumerologyNumber(day);
  const normalizedName = normalizeNumerologyName(name);
  const nameNumbers = normalizedName.letters.length ? Object.freeze({
    expression: sumLetters(normalizedName.letters),
    soulUrge: sumLetters(normalizedName.letters.filter((letter) => VOWELS.has(letter))),
    personality: sumLetters(normalizedName.letters.filter((letter) => !VOWELS.has(letter))),
    letterValues: Object.freeze(normalizedName.letters.map((letter) => Object.freeze({
      letter,
      value: LETTER_VALUES[letter],
      kind: VOWELS.has(letter) ? 'vowel' : 'consonant',
    }))),
  }) : null;
  return Object.freeze({
    birthDate,
    lifePath,
    birthday,
    nameNumbers,
    supportedLetters: normalizedName.letters.length,
    unsupportedLetters: normalizedName.unsupported,
    nameWasProvided: name.trim().length > 0,
  });
}

export const numerologyRules = Object.freeze({
  system: 'Pythagorean letter cycle A=1 through I=9, then repeat.',
  vowels: 'A, E, I, O, U are vowels; Y is treated as a consonant.',
  masterNumbers: Object.freeze([11, 22, 33]),
});
