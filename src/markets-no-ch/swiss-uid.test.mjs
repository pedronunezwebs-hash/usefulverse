import test from 'node:test';
import assert from 'node:assert/strict';
import { swissUidCheckDigit, validateSwissUid, validateSwissUidBatch } from './swiss-uid.mjs';

test('Swiss UID official modulo-11 example matches the eCH standard', () => {
  assert.equal(swissUidCheckDigit('10932255'), 1);
  assert.deepEqual(validateSwissUid('CHE109322551'), {
    original: 'CHE109322551', normalized: 'CHE-109.322.551', status: 'checksum-ok', expectedCheckDigit: 1,
  });
});

test('UID accepts common visual formats and ignores only known supplements', () => {
  for (const value of ['CHE-109.322.551', '109.322.551', 'CHE 109 322 551', 'CHE-109.322.551 MWST', 'CHE-109.322.551 HR/MWST']) {
    assert.equal(validateSwissUid(value).status, 'checksum-ok', value);
  }
  assert.equal(validateSwissUid('CH-109.322.551').status, 'format');
  assert.equal(validateSwissUid('CHE-109.322.551 MWST').normalized, 'CHE-109.322.551');
});

test('UID distinguishes malformed format, invalid checksum, empty input, and unassigned checksum 10', () => {
  assert.equal(validateSwissUid('').status, 'empty');
  assert.equal(validateSwissUid('not a UID').status, 'format');
  assert.equal(validateSwissUid('CHE-109.322.550').status, 'checksum-error');
  const unassigned = Array.from({ length: 100_000 }, (_, index) => String(index).padStart(8, '0'))
    .find((digits) => swissUidCheckDigit(digits) === null);
  assert.ok(unassigned);
  assert.equal(validateSwissUid(`CHE-${unassigned.slice(0, 3)}.${unassigned.slice(3, 6)}.${unassigned.slice(6)}0`).status, 'unassigned-check-digit');
  assert.throws(() => swissUidCheckDigit('123'), /eight body digits/u);
});

test('batch validator ignores blank lines, keeps input text, and enforces the row cap', () => {
  const result = validateSwissUidBatch('CHE-109.322.551\n\nCHE-109.322.550');
  assert.equal(result.length, 2);
  assert.equal(result[0].original, 'CHE-109.322.551');
  assert.equal(result[1].status, 'checksum-error');
  assert.throws(() => validateSwissUidBatch(Array(101).fill('CHE-109.322.551').join('\n')), /no more than 100/u);
});
