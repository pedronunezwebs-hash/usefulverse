export const FIVE_LETTER_MAX_GUESSES = 6;

export function splitLetters(word, locale = undefined) {
  const normalized = String(word ?? '').normalize('NFC').toLocaleLowerCase(locale);
  if (typeof Intl.Segmenter === 'function') return [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(normalized)].map(({ segment }) => segment);
  const graphemes = [];
  for (const character of normalized) {
    if (/^[\p{M}\uFE0E\uFE0F]$/u.test(character) && graphemes.length) graphemes[graphemes.length - 1] += character;
    else graphemes.push(character);
  }
  return graphemes;
}

function isAlphabeticWord(word) { return /^\p{L}[\p{L}\p{M}]*$/u.test(word); }

export function normalizeWord(word, locale = undefined) {
  return splitLetters(word.trim(), locale).join('');
}

export function validateWordBank(words, locale = undefined) {
  if (!Array.isArray(words)) throw new TypeError('Word bank must be a list.');
  const normalized = [...new Set(words.map((word) => normalizeWord(word, locale)).filter((word) => splitLetters(word, locale).length === 5 && isAlphabeticWord(word)))];
  if (normalized.length < 2) throw new RangeError('Add at least two distinct five-letter words.');
  return Object.freeze(normalized.sort());
}

export function scoreWordGuess(answer, guess, locale = undefined) {
  const target = splitLetters(answer, locale);
  const proposed = splitLetters(guess, locale);
  if (target.length !== 5 || proposed.length !== 5) throw new RangeError('Words must contain five letters.');
  const marks = Array(5).fill('absent');
  const remaining = new Map();
  for (let index = 0; index < 5; index += 1) {
    if (proposed[index] === target[index]) marks[index] = 'correct';
    else remaining.set(target[index], (remaining.get(target[index]) ?? 0) + 1);
  }
  for (let index = 0; index < 5; index += 1) {
    if (marks[index] === 'correct') continue;
    const count = remaining.get(proposed[index]) ?? 0;
    if (count > 0) { marks[index] = 'present'; remaining.set(proposed[index], count - 1); }
  }
  return Object.freeze(marks);
}

export function dailyWordIndex(date = new Date(), bankLength, bankId = 'custom') {
  const isoDay = date instanceof Date ? date.toISOString().slice(0, 10) : String(date);
  if (!Number.isInteger(bankLength) || bankLength < 1) throw new RangeError('Word bank is empty.');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(isoDay) || new Date(`${isoDay}T00:00:00.000Z`).toISOString().slice(0, 10) !== isoDay) throw new RangeError('Use a valid calendar date.');
  const indexForDay = (day) => {
    let hash = 0x811c9dc5;
    for (const character of `five-letter-v1:${bankId}:${day}`) hash = Math.imul(hash ^ character.codePointAt(0), 0x01000193);
    return (hash >>> 0) % bankLength;
  };
  const today = indexForDay(isoDay);
  const previousDate = new Date(Date.parse(`${isoDay}T00:00:00.000Z`) - 86400000);
  const previousDay = previousDate.toISOString().slice(0, 10);
  const twoDaysBack = new Date(previousDate.getTime() - 86400000).toISOString().slice(0, 10);
  const previousRaw = indexForDay(previousDay);
  const previousFinal = previousRaw === indexForDay(twoDaysBack) && bankLength > 1 ? (previousRaw + 1) % bankLength : previousRaw;
  return today === previousFinal && bankLength > 1 ? (today + 1) % bankLength : today;
}

export function wordBankFingerprint(words) {
  let hash = 0x811c9dc5;
  for (const character of [...words].sort().join('\u0000')) hash = Math.imul(hash ^ character.codePointAt(0), 0x01000193);
  return `custom-${(hash >>> 0).toString(16)}`;
}

export function createWordGame({ answer, acceptedWords, maxGuesses = FIVE_LETTER_MAX_GUESSES, locale } = {}) {
  const accepted = validateWordBank(acceptedWords, locale);
  const normalizedAnswer = normalizeWord(answer, locale);
  if (!accepted.includes(normalizedAnswer)) throw new RangeError('Answer must be in the selected word bank.');
  if (!Number.isInteger(maxGuesses) || maxGuesses < 1 || maxGuesses > 12) throw new RangeError('Choose between 1 and 12 guesses.');
  return Object.freeze({ answer: normalizedAnswer, accepted, maxGuesses, guesses: Object.freeze([]), status: 'playing', locale });
}

export function submitWordGuess(game, value) {
  if (!game || game.status !== 'playing') throw new Error('The game is not accepting guesses.');
  const guess = normalizeWord(value, game.locale);
  if (splitLetters(guess, game.locale).length !== 5 || !isAlphabeticWord(guess)) throw new RangeError('Enter five letters.');
  if (!game.accepted.includes(guess)) throw new RangeError('That word is not in the selected word bank.');
  const guesses = Object.freeze([...game.guesses, Object.freeze({ word: guess, marks: scoreWordGuess(game.answer, guess, game.locale) })]);
  const status = guess === game.answer ? 'won' : guesses.length >= game.maxGuesses ? 'lost' : 'playing';
  return Object.freeze({ ...game, guesses, status });
}
