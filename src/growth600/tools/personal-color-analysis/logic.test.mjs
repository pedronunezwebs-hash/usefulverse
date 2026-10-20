import test from 'node:test';
import assert from 'node:assert/strict';
import { getPersonalPalette, photoCanvasDimensions, nearestPaletteSwatch } from './logic.mjs';

test('personal palette comparison uses bounded local image dimensions and four fixed palettes', () => {
  assert.deepEqual(photoCanvasDimensions(2400, 1200), { width: 720, height: 360 });
  assert.equal(Object.keys({ spring: getPersonalPalette('spring'), summer: getPersonalPalette('summer'), autumn: getPersonalPalette('autumn'), winter: getPersonalPalette('winter') }).length, 4);
  assert.equal(nearestPaletteSwatch('#FFFFFF', getPersonalPalette('winter')).length, 3);
});

test('personal palette utilities reject malformed inputs', () => {
  assert.throws(() => getPersonalPalette('unknown'));
  assert.throws(() => photoCanvasDimensions(0, 4));
  assert.throws(() => nearestPaletteSwatch('white', ['#fff']));
});
