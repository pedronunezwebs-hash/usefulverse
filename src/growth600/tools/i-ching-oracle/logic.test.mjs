import test from 'node:test';
import assert from 'node:assert/strict';
import { castIChing } from './logic.mjs';

function fixedCoins(byte) {
  return { getRandomValues(array) { array.fill(byte); return array; } };
}

test('I Ching builds six changing yin lines from secure coin bits and transforms them', () => {
  const result = castIChing({ headsValue: '2', cryptoImpl: fixedCoins(1) });
  assert.equal(result.lines.length, 6);
  assert.ok(result.lines.every((line) => line.value === 6 && line.yin && line.changing));
  assert.deepEqual(result.changingLines, [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(result.primary, { lower: { name: 'earth', symbol: '☷' }, upper: { name: 'earth', symbol: '☷' } });
  assert.deepEqual(result.transformed, { lower: { name: 'heaven', symbol: '☰' }, upper: { name: 'heaven', symbol: '☰' } });
});

test('I Ching supports both coin conventions and rejects insecure or invalid input', () => {
  const result = castIChing({ headsValue: '3', cryptoImpl: fixedCoins(0) });
  assert.ok(result.lines.every((line) => line.value === 6 && line.yin && line.changing));
  assert.throws(() => castIChing({ headsValue: '4', cryptoImpl: fixedCoins(0) }), { code: 'invalid-convention' });
  assert.throws(() => castIChing({ cryptoImpl: {} }), { code: 'randomness-unavailable' });
});
