const TRIGRAMS = Object.freeze({
  '111': { name: 'heaven', symbol: '☰' },
  '110': { name: 'lake', symbol: '☱' },
  '101': { name: 'fire', symbol: '☲' },
  '100': { name: 'thunder', symbol: '☳' },
  '011': { name: 'wind', symbol: '☴' },
  '010': { name: 'water', symbol: '☵' },
  '001': { name: 'mountain', symbol: '☶' },
  '000': { name: 'earth', symbol: '☷' },
});

export function castIChing({ headsValue = '2', cryptoImpl = globalThis.crypto } = {}) {
  const heads = Number(headsValue);
  if (heads !== 2 && heads !== 3) throw Object.assign(new RangeError('Choose a coin-value convention.'), { code: 'invalid-convention' });
  if (!cryptoImpl?.getRandomValues) throw Object.assign(new Error('Secure local randomness is unavailable.'), { code: 'randomness-unavailable' });
  const tosses = cryptoImpl.getRandomValues(new Uint8Array(18));
  const lines = Array.from({ length: 6 }, (_, index) => {
    const coins = Array.from({ length: 3 }, (_, coin) => (tosses[index * 3 + coin] & 1) ? 'H' : 'T');
    const value = coins.reduce((sum, side) => sum + (side === 'H' ? heads : 5 - heads), 0);
    const yin = value === 6 || value === 8;
    return Object.freeze({ number: index + 1, coins: Object.freeze(coins), value, yin, changing: value === 6 || value === 9 });
  });
  const primary = lines.map(({ yin }) => yin ? '0' : '1');
  const changed = lines.map(({ yin, changing }) => changing ? (yin ? '1' : '0') : (yin ? '0' : '1'));
  const trigramFor = (bits) => Object.freeze({ lower: TRIGRAMS[bits.slice(0, 3).join('')], upper: TRIGRAMS[bits.slice(3, 6).join('')] });
  return Object.freeze({ headsValue: heads, lines: Object.freeze(lines), changingLines: Object.freeze(lines.filter(({ changing }) => changing).map(({ number }) => number)), primary: trigramFor(primary), transformed: trigramFor(changed) });
}
