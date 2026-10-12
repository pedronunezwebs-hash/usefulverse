import assert from 'node:assert/strict';
import test from 'node:test';
import { createNameGeneratorSeed, generateNames } from './logic.mjs';

test('same seed and settings produce the same original fantasy suggestions', () => {
  const input = { type: 'fantasy', count: 12, seed: 'dragon-moon' };
  const first = generateNames(input);
  assert.deepEqual(generateNames(input), first);
  assert.equal(first.names.length, 12);
  assert.equal(new Set(first.names.map((name) => name.toLocaleLowerCase())).size, 12);
  assert.ok(first.names.every((name) => /^[A-Z][a-z]+$/u.test(name)));
});

test('business suggestions retain a user keyword and contain no availability claim', () => {
  const result = generateNames({ type: 'business', count: 8, keyword: 'Copper & Pine', seed: 'brand-seed' });
  assert.equal(result.names.length, 8);
  assert.ok(result.names.every((name) => name.startsWith('Copper & Pine ')));
});

test('username suggestions are unique and bounded', () => {
  const result = generateNames({ type: 'username', count: 20, keyword: 'star', seed: 'user-seed' });
  assert.equal(result.names.length, 20);
  assert.equal(new Set(result.names.map((name) => name.toLocaleLowerCase())).size, 20);
  assert.ok(result.names.every((name) => name.length <= 24));
});

test('invalid type, count, keyword, and seed fail explicitly', () => {
  const valid = { seed: 'valid' };
  assert.throws(() => generateNames({ ...valid, type: 'domain-checker' }), { code: 'invalid-type' });
  assert.throws(() => generateNames({ ...valid, count: 21 }), { code: 'invalid-count' });
  assert.throws(() => generateNames({ ...valid, keyword: 'x'.repeat(41) }), { code: 'invalid-keyword' });
  assert.throws(() => generateNames({ ...valid, seed: '' }), { code: 'invalid-seed' });
});

test('random seed generation requires and uses a secure random API', () => {
  assert.throws(() => createNameGeneratorSeed({}), /secure-random-unavailable/u);
  assert.equal(createNameGeneratorSeed({ getRandomValues(bytes) { bytes.set([15, 255]); return bytes; } }), '0000000f000000ff');
});
