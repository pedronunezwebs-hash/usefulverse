const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

function secureInteger(min, max) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(min) || !Number.isInteger(max) || max < min) throw new TypeError('Secure random selection is unavailable.');
  const size = max - min + 1; const ceiling = Math.floor(0x1_0000_0000 / size) * size; const value = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(value); } while (value[0] >= ceiling);
  return min + value[0] % size;
}

export function spinRoulette(previous = Object.freeze({ history: Object.freeze([]), spins: 0, hits: 0 }), { betType, betValue } = {}) {
  if (!['number', 'color', 'parity'].includes(betType)) throw new RangeError('Choose a supported practice bet.');
  if (betType === 'number' && (!Number.isInteger(Number(betValue)) || Number(betValue) < 0 || Number(betValue) > 36)) throw new RangeError('Choose a number from 0 to 36.');
  if (betType === 'color' && !['red', 'black'].includes(betValue)) throw new RangeError('Choose red or black.');
  if (betType === 'parity' && !['odd', 'even'].includes(betValue)) throw new RangeError('Choose odd or even.');
  const number = secureInteger(0, 36);
  const color = number === 0 ? 'green' : RED.has(number) ? 'red' : 'black';
  const parity = number === 0 ? 'none' : number % 2 ? 'odd' : 'even';
  const hit = betType === 'number' ? number === Number(betValue) : betType === 'color' ? color === betValue : parity === betValue;
  const round = Object.freeze({ number, color, parity, betType, betValue: String(betValue), hit });
  const history = Object.freeze([round, ...previous.history].slice(0, 20));
  return Object.freeze({ history, spins: previous.spins + 1, hits: previous.hits + Number(hit), last: round });
}
