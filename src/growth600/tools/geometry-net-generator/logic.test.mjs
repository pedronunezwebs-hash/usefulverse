import test from 'node:test';
import assert from 'node:assert/strict';
import { createCuboidNet } from './logic.mjs';

test('creates six connected cuboid faces and consistent measurements', () => {
  const result = createCuboidNet({ length: 4, width: 3, height: 2, unit: 'cm' });
  assert.equal(result.area, 52);
  assert.equal(result.volume, 24);
  assert.equal(result.unit, 'cm');
  assert.equal((result.svg.match(/<rect\b/gu) ?? []).length, 7);
  assert.match(result.svg, /width="210mm" height="180mm"/u);
  assert.match(result.svg, /4 × 3 cm/u);
  assert.match(result.svg, /2 × 3 cm/u);
  assert.match(result.svg, /4 × 2 cm/u);
  assert.ok(Object.isFrozen(result));
});

test('bounds dimensions and rejects non-finite values', () => {
  for (const dimensions of [
    { length: 0, width: 2, height: 3 },
    { length: 0.09, width: 2, height: 3 },
    { length: 10001, width: 2, height: 3 },
    { length: Infinity, width: 2, height: 3 },
    { length: 'not a number', width: 2, height: 3 },
  ]) {
    assert.throws(() => createCuboidNet(dimensions), { code: 'invalid-dimensions' });
  }
});

test('sanitizes custom labels and rejects unsafe unit labels', () => {
  const result = createCuboidNet({ length: 1, width: 2, height: 3, unit: ' mm ', labels: { base: '<script>alert(1)</script>' } });
  assert.match(result.svg, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/u);
  assert.doesNotMatch(result.svg, /<script>/u);
  assert.equal(result.unit, 'mm');
  assert.throws(() => createCuboidNet({ length: 1, width: 2, height: 3, unit: 'millimeters' }), { code: 'invalid-unit' });
  assert.throws(() => createCuboidNet({ length: 1, width: 2, height: 3, unit: 'm\n' }), { code: 'invalid-unit' });
});

test('unit labels and SVG remain bounded at maximum dimensions', () => {
  const result = createCuboidNet({ length: 10000, width: 10000, height: 10000, unit: 'u' });
  assert.equal(result.area, 600_000_000);
  assert.equal(result.volume, 1_000_000_000_000);
  assert.ok(result.svg.length < 5000);
  assert.doesNotMatch(result.svg, /NaN|Infinity/u);
});
