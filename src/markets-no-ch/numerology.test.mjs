import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNumerology, normalizeNumerologyName, reduceNumerologyNumber } from './numerology.mjs';

test('reduces digit sums deterministically and retains master numbers', () => {
  assert.deepEqual(reduceNumerologyNumber(29), { value: 11, steps: ['29', '11'] });
  assert.deepEqual(reduceNumerologyNumber(38), { value: 11, steps: ['38', '11'] });
  assert.equal(reduceNumerologyNumber(22).value, 22);
  assert.equal(reduceNumerologyNumber(33).value, 33);
  assert.equal(reduceNumerologyNumber(0).value, 0);
  assert.throws(() => reduceNumerologyNumber(-1), /non-negative/u);
  assert.throws(() => reduceNumerologyNumber(1.5), /whole number/u);
});

test('normalizes accented and selected Latin letters without silently dropping other scripts', () => {
  assert.deepEqual(normalizeNumerologyName('Élodie Groß Øst'), {
    letters: ['E', 'L', 'O', 'D', 'I', 'E', 'G', 'R', 'O', 'S', 'S', 'O', 'S', 'T'],
    unsupported: [],
  });
  assert.deepEqual(normalizeNumerologyName('李 Marie'), { letters: ['M', 'A', 'R', 'I', 'E'], unsupported: ['李'] });
});

test('calculates the declared Pythagorean name values and keeps input name out of result', () => {
  const result = calculateNumerology({ birthDate: '1990-06-15', name: 'Anna' });
  assert.equal(result.lifePath.value, 4);
  assert.equal(result.birthday.value, 6);
  assert.deepEqual(result.nameNumbers.expression, { value: 3, sum: 12, values: [1, 5, 5, 1], steps: ['12', '3'] });
  assert.deepEqual(result.nameNumbers.letterValues, [
    { letter: 'A', value: 1, kind: 'vowel' }, { letter: 'N', value: 5, kind: 'consonant' },
    { letter: 'N', value: 5, kind: 'consonant' }, { letter: 'A', value: 1, kind: 'vowel' },
  ]);
  assert.equal(result.nameNumbers.soulUrge.value, 2);
  assert.equal(result.nameNumbers.personality.value, 1);
  assert.equal(Object.hasOwn(result, 'name'), false);
});

test('date-only mode works and invalid calendar dates are rejected', () => {
  const result = calculateNumerology({ birthDate: '2000-02-29' });
  assert.equal(result.nameNumbers, null);
  assert.equal(result.nameWasProvided, false);
  assert.throws(() => calculateNumerology({ birthDate: '2025-02-29' }), /real calendar date/u);
  assert.throws(() => calculateNumerology({ birthDate: '' }), /valid date/u);
});

test('unsupported name scripts are reported and do not erase the date result', () => {
  const result = calculateNumerology({ birthDate: '1988-11-22', name: '李' });
  assert.equal(result.lifePath.value, 5);
  assert.equal(result.nameNumbers, null);
  assert.deepEqual(result.unsupportedLetters, ['李']);
  assert.equal(result.nameWasProvided, true);
});
