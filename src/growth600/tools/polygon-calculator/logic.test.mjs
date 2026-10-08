import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRegularPolygon } from './logic.mjs';

test('regular hexagon from side length returns perimeter, area, apothem and angles', () => {
  const result = calculateRegularPolygon({ sides: 6, mode: 'side', dimension: 1 });
  assert.equal(result.perimeter, 6);
  assert.ok(Math.abs(result.area - 3 * Math.sqrt(3) / 2) < 1e-12);
  assert.ok(Math.abs(result.apothem - Math.sqrt(3) / 2) < 1e-12);
  assert.equal(result.interiorAngleDegrees, 120);
  assert.equal(result.centralAngleDegrees, 60);
});

test('apothem and circumradius modes describe the same square', () => {
  const byApothem = calculateRegularPolygon({ sides: 4, mode: 'apothem', dimension: 1 });
  const byRadius = calculateRegularPolygon({ sides: 4, mode: 'circumradius', dimension: Math.SQRT2 });
  assert.ok(Math.abs(byApothem.side - 2) < 1e-12);
  assert.ok(Math.abs(byApothem.area - 4) < 1e-12);
  assert.ok(Math.abs(byRadius.perimeter - byApothem.perimeter) < 1e-12);
  assert.ok(Math.abs(byRadius.area - byApothem.area) < 1e-12);
});

test('supports a high side count and long floating-point result', () => {
  const result = calculateRegularPolygon({ sides: 360, mode: 'side', dimension: 2.5 });
  assert.equal(result.sides, 360);
  assert.ok(result.area > 0);
  assert.ok(Math.abs(result.interiorAngleDegrees - 179) < 1e-10);
});

test('rejects triangles to avoid overlap with the existing triangle calculator', () => {
  assert.throws(() => calculateRegularPolygon({ sides: 3, dimension: 1 }), /from 4 to 1000/);
});

test('rejects invalid, unsafe or unsupported parameters', () => {
  for (const input of [
    { sides: 3.2, dimension: 1 }, { sides: 1001, dimension: 1 }, { sides: 6, dimension: 0 },
    { sides: 6, dimension: Infinity }, { sides: 6, dimension: 1, mode: 'unknown' },
  ]) assert.throws(() => calculateRegularPolygon(input));
});
