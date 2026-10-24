import test from 'node:test';
import assert from 'node:assert/strict';
import { exportSurfaceObj, sampleHeightField } from './logic.mjs';

test('samples a square paraboloid and creates bounded valid faces', () => {
  const mesh = sampleHeightField({ expression: 'x^2+y^2', minimum: -1, maximum: 1, grid: 5 });
  assert.equal(mesh.vertices.length, 25);
  assert.equal(mesh.vertices[12].z, 0);
  assert.equal(mesh.vertices[0].z, 2);
  assert.equal(mesh.faces.length, 32);
  assert.ok(mesh.faces.flat().every((index) => index >= 0 && index < mesh.vertices.length));
});

test('supports safe functions and exports one-indexed OBJ faces', () => {
  const mesh = sampleHeightField({ expression: 'sin(x)+cos(y)', minimum: -1, maximum: 1, grid: 4 });
  const text = exportSurfaceObj(mesh);
  assert.match(text, /^v /mu);
  assert.match(text, /^f [1-9]\d* [1-9]\d* [1-9]\d*$/mu);
  assert.ok(mesh.vertices.every(({ z }) => z === null || Number.isFinite(z)));
});

test('rejects code, unsupported names, excessive grids and unordered ranges', () => {
  for (const expression of ['x.constructor', 'window.alert(1)', 'foo(x)', 'x;alert(1)']) assert.throws(() => sampleHeightField({ expression, minimum: -1, maximum: 1, grid: 5 }));
  assert.throws(() => sampleHeightField({ expression: 'x+y', minimum: 1, maximum: 1, grid: 5 }));
  assert.throws(() => sampleHeightField({ expression: 'x+y', minimum: -1, maximum: 1, grid: 51 }));
  assert.throws(() => sampleHeightField({ expression: 'sqrt(-1)', minimum: -1, maximum: 1, grid: 5 }));
});
