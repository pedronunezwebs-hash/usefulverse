export const HANGMAN_ATTEMPT_LIMITS = Object.freeze({ easy: 10, regular: 8, hard: 6 });

function graphemes(value) {
  if (typeof Intl.Segmenter === 'function') return [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value)].map(({ segment }) => segment);
  return Array.from(value.normalize('NFC'));
}

function normalizeLetter(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();
}

function validateWordBank(wordBank) {
  if (!Array.isArray(wordBank) || !wordBank.length || wordBank.length > 200 || wordBank.some((word) => typeof word !== 'string' || !word.trim() || [...word].length > 40 || !/[\p{L}\p{N}]/u.test(word))) {
    throw new TypeError('Provide between 1 and 200 words, each up to 40 characters.');
  }
}

export function createHangmanGame({ wordBank, random = Math.random, difficulty = 'regular' } = {}) {
  validateWordBank(wordBank);
  if (!(difficulty in HANGMAN_ATTEMPT_LIMITS)) throw new RangeError('Choose easy, regular or hard difficulty.');
  if (typeof random !== 'function') throw new TypeError('A random-number function is required.');
  const choice = random();
  if (!Number.isFinite(choice) || choice < 0 || choice >= 1) throw new RangeError('The random source must return a value from 0 inclusive to 1 exclusive.');
  const word = wordBank[Math.floor(choice * wordBank.length)].normalize('NFC').trim();
  const letters = graphemes(word);
  if (!letters.some((letter) => /[\p{L}\p{N}]/u.test(letter))) throw new TypeError('A word must contain at least one letter or number.');
  return Object.freeze({ word, letters: Object.freeze(letters), guessed: Object.freeze([]), wrong: 0, maxAttempts: HANGMAN_ATTEMPT_LIMITS[difficulty], status: 'playing', difficulty });
}

export function guessHangmanLetter(game, value) {
  if (!game || !Array.isArray(game.letters) || !Array.isArray(game.guessed)) throw new TypeError('Invalid hangman game state.');
  if (game.status !== 'playing') return Object.freeze({ game, accepted: false, reason: 'finished' });
  if (typeof value !== 'string') return Object.freeze({ game, accepted: false, reason: 'invalid' });
  const input = graphemes(value.trim().normalize('NFC'));
  if (input.length !== 1 || !/[\p{L}\p{N}]/u.test(input[0])) return Object.freeze({ game, accepted: false, reason: 'invalid' });
  const guess = input[0]; const normalized = normalizeLetter(guess);
  if (game.guessed.some((used) => normalizeLetter(used) === normalized)) return Object.freeze({ game, accepted: false, reason: 'duplicate' });
  const guessed = Object.freeze([...game.guessed, guess]);
  const hit = game.letters.some((letter) => /[\p{L}\p{N}]/u.test(letter) && normalizeLetter(letter) === normalized);
  const wrong = game.wrong + Number(!hit);
  const won = game.letters.every((letter) => !/[\p{L}\p{N}]/u.test(letter) || guessed.some((used) => normalizeLetter(used) === normalizeLetter(letter)));
  const status = won ? 'won' : wrong >= game.maxAttempts ? 'lost' : 'playing';
  const next = Object.freeze({ ...game, guessed, wrong, status });
  return Object.freeze({ game: next, accepted: true, hit, reason: hit ? 'hit' : 'miss' });
}

export function getHangmanVisibleWord(game) {
  if (!game || !Array.isArray(game.letters) || !Array.isArray(game.guessed)) throw new TypeError('Invalid hangman game state.');
  return Object.freeze(game.letters.map((letter) => !/[\p{L}\p{N}]/u.test(letter) || game.status === 'lost' || game.guessed.some((used) => normalizeLetter(used) === normalizeLetter(letter)) ? letter : '＿'));
}
