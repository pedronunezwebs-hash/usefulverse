export const CODEBREAKER_MAX_LENGTH = 6;
export const CODEBREAKER_MIN_LENGTH = 3;
export const CODEBREAKER_MAX_SYMBOLS = 10;
export const CODEBREAKER_MIN_SYMBOLS = 4;

function assertConfig({ length, paletteSize, duplicates, maxAttempts }) {
  if (!Number.isInteger(length) || length < CODEBREAKER_MIN_LENGTH || length > CODEBREAKER_MAX_LENGTH) throw new RangeError('Code length must be between 3 and 6.');
  if (!Number.isInteger(paletteSize) || paletteSize < CODEBREAKER_MIN_SYMBOLS || paletteSize > CODEBREAKER_MAX_SYMBOLS) throw new RangeError('Choose between 4 and 10 symbols.');
  if (!duplicates && length > paletteSize) throw new RangeError('The code cannot be longer than its symbol set when repeats are off.');
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 20) throw new RangeError('Choose between 1 and 20 attempts.');
}

function seededRandom(seed) {
  let state = Number(seed) >>> 0;
  if (state === 0) state = 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function createSecret({ length, paletteSize, duplicates = false, seed = 1 } = {}) {
  assertConfig({ length, paletteSize, duplicates: Boolean(duplicates), maxAttempts: 1 });
  const random = seededRandom(seed);
  const pool = Array.from({ length: paletteSize }, (_, index) => index);
  if (duplicates) return Array.from({ length }, () => Math.floor(random() * paletteSize));
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [pool[index], pool[other]] = [pool[other], pool[index]];
  }
  return pool.slice(0, length);
}

export function scoreCodebreakerGuess(secret, guess) {
  if (!Array.isArray(secret) || !Array.isArray(guess) || secret.length < CODEBREAKER_MIN_LENGTH || secret.length !== guess.length) throw new TypeError('The guess must match the code length.');
  if ([...secret, ...guess].some((index) => !Number.isInteger(index) || index < 0 || index >= CODEBREAKER_MAX_SYMBOLS)) throw new RangeError('A code contains an unsupported symbol.');
  let exact = 0;
  const secretCounts = Array(CODEBREAKER_MAX_SYMBOLS).fill(0);
  const guessCounts = Array(CODEBREAKER_MAX_SYMBOLS).fill(0);
  for (let position = 0; position < secret.length; position += 1) {
    if (secret[position] === guess[position]) exact += 1;
    secretCounts[secret[position]] += 1;
    guessCounts[guess[position]] += 1;
  }
  const shared = secretCounts.reduce((sum, count, index) => sum + Math.min(count, guessCounts[index]), 0);
  return Object.freeze({ exact, misplaced: shared - exact });
}

export function dailyCodebreakerSeed(date = new Date()) {
  const isoDay = date instanceof Date ? date.toISOString().slice(0, 10) : String(date);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(isoDay) || new Date(`${isoDay}T00:00:00.000Z`).toISOString().slice(0, 10) !== isoDay) throw new RangeError('Use a valid calendar date.');
  let hash = 0x811c9dc5;
  for (const character of `codebreaker-v1:${isoDay}`) hash = Math.imul(hash ^ character.charCodeAt(0), 0x01000193);
  return hash >>> 0;
}

export function createCodebreakerGame({ length = 4, paletteSize = 6, duplicates = false, maxAttempts = 10, seed = 1 } = {}) {
  assertConfig({ length, paletteSize, duplicates: Boolean(duplicates), maxAttempts });
  const secret = createSecret({ length, paletteSize, duplicates, seed });
  return Object.freeze({
    length, paletteSize, duplicates: Boolean(duplicates), maxAttempts,
    secret: Object.freeze(secret), guesses: Object.freeze([]), status: 'playing',
  });
}

export function submitCodebreakerGuess(game, guess) {
  if (!game || game.status !== 'playing') throw new Error('The game is not accepting guesses.');
  if (!Array.isArray(guess) || guess.length !== game.length || guess.some((index) => !Number.isInteger(index) || index < 0 || index >= game.paletteSize)) throw new RangeError('Complete the code with available symbols.');
  if (!game.duplicates && new Set(guess).size !== guess.length) throw new RangeError('Repeated symbols are disabled.');
  const feedback = scoreCodebreakerGuess(game.secret, guess);
  const guesses = Object.freeze([...game.guesses, Object.freeze({ code: Object.freeze([...guess]), ...feedback })]);
  const status = feedback.exact === game.length ? 'won' : guesses.length >= game.maxAttempts ? 'lost' : 'playing';
  return Object.freeze({ ...game, guesses, status });
}
