import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateChineseRemainder, CHINESE_REMAINDER_LIMITS } from './logic.mjs';

test('solves the plan acceptance example exactly', () => {
  const result = calculateChineseRemainder('2, 3\n3, 5');
  assert.equal(result.status, 'solved');
  assert.equal(result.residue, 8n);
  assert.equal(result.modulus, 15n);
  assert.equal(result.steps.length, 1);
});

test('supports negative remainders and standard congruence notation', () => {
  const result = calculateChineseRemainder('x ≡ -1 (mod 5)\n3, 7');
  assert.equal(result.residue, 24n);
  assert.equal(result.modulus, 35n);
});

test('combines compatible non-coprime moduli', () => {
  const result = calculateChineseRemainder('2, 4\n6, 8');
  assert.equal(result.status, 'solved');
  assert.equal(result.residue, 6n);
  assert.equal(result.modulus, 8n);
});

test('reports a conflict for incompatible non-coprime moduli', () => {
  const result = calculateChineseRemainder('1, 4\n2, 6');
  assert.equal(result.status, 'incompatible');
  assert.equal(result.conflictIndex, 1);
  assert.equal(result.conflictGcd, 2n);
});

test('combines several congruences and verifies every original condition', () => {
  const result = calculateChineseRemainder('2, 3\n3, 5\n2, 7');
  assert.equal(result.residue, 23n);
  assert.equal(result.modulus, 105n);
  for (const row of result.congruences) assert.equal(result.residue % row.modulus, row.remainder);
});

test('normalizes Arabic and Persian digits', () => {
  const arabic = calculateChineseRemainder('٢، ٣\n٣، ٥');
  assert.equal(arabic.status, 'solved');
  assert.equal(arabic.residue, 8n);
});

test('keeps values exact beyond Number safe integer precision', () => {
  const result = calculateChineseRemainder('999999999999, 1000000000000\n999999999998, 999999999999');
  assert.equal(result.status, 'solved');
  assert.equal(result.residue, 999999999998999999999999n);
  assert.equal(result.modulus, 999999999999000000000000n);
});

test('rejects malformed, out-of-range, or undersized systems', () => {
  assert.throws(() => calculateChineseRemainder('2, 3'), /2–20/u);
  assert.throws(() => calculateChineseRemainder('2, 3\nnope'), /Row 2/u);
  assert.throws(() => calculateChineseRemainder('2, 1\n3, 5'), /at least 2/u);
  assert.throws(() => calculateChineseRemainder('1000000000001, 3\n3, 5'), /supported range/u);
  assert.throws(() => calculateChineseRemainder(Array.from({ length: 21 }, () => '1, 2').join('\n')), /2–20/u);
});

test('publishes intentional work limits', () => {
  assert.deepEqual(CHINESE_REMAINDER_LIMITS, { maxAbsoluteInput: 1_000_000_000_000, minModulus: 2, maxRows: 20 });
});
