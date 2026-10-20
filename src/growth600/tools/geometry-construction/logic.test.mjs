import test from 'node:test';
import assert from 'node:assert/strict';
import { addConstructionObject, addFreePoint, createConstruction, evaluateConstruction, moveFreePoint } from './logic.mjs';

test('keeps segments, circles, midpoints and bisectors linked to their source points', () => {
  const state = createConstruction();
  const a = addFreePoint(state, 100, 100), b = addFreePoint(state, 300, 100);
  addConstructionObject(state, 'segment', [a, b]);
  addConstructionObject(state, 'circle', [a, b]);
  const midpoint = addConstructionObject(state, 'midpoint', [a, b]);
  addConstructionObject(state, 'circle', [midpoint, a]);
  addConstructionObject(state, 'perpendicular-bisector', [a, b]);
  let evaluated = evaluateConstruction(state);
  assert.equal(evaluated.points.find((point) => point.id === midpoint).x, 200);
  assert.equal(evaluated.objects.find((object) => object.kind === 'circle').radius, 200);
  assert.equal(evaluated.objects.filter((object) => object.kind === 'circle')[1].radius, 100);
  assert.equal(evaluated.objects.find((object) => object.kind === 'perpendicular-bisector').x1, 200);
  moveFreePoint(state, b, 300, 300);
  evaluated = evaluateConstruction(state);
  assert.equal(evaluated.points.find((point) => point.id === midpoint).y, 200);
  assert.equal(evaluated.objects.find((object) => object.kind === 'circle').radius, Math.hypot(200, 200));
  assert.equal(evaluated.objects.filter((object) => object.kind === 'circle')[1].radius, Math.hypot(100, 100));
});

test('rejects invalid, duplicate and over-limit constructions', () => {
  const state = createConstruction();
  const a = addFreePoint(state, 12, 15);
  assert.throws(() => addConstructionObject(state, 'line', [a, a]), RangeError);
  assert.throws(() => addFreePoint(state, 801, 20), RangeError);
  assert.throws(() => moveFreePoint(state, 999, 0, 0), RangeError);
});
