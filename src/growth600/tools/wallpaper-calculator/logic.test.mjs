import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWallpaper } from './logic.mjs';

const room = { perimeter: 12, wallHeight: 2.4, rollWidth: 0.53, rollLength: 10.05, wastePercent: 0, unit: 'm' };

test('estimates whole wallpaper rolls and rounds drops to pattern repeats', () => {
  const plain = calculateWallpaper(room);
  assert.equal(plain.stripsNeeded, 23);
  assert.equal(plain.dropsPerRoll, 4);
  assert.equal(plain.rollsNeeded, 6);

  const patterned = calculateWallpaper({ ...room, patternRepeat: 0.32 });
  assert.equal(patterned.dropLengthM, 2.56);
  assert.equal(patterned.dropsPerRoll, 3);
  assert.equal(patterned.rollsNeeded, 8);
});

test('converts imperial dimensions and deducts openings as equivalent full-height width', () => {
  const metric = calculateWallpaper({ ...room, openingsArea: 2.4 });
  const imperial = calculateWallpaper({
    perimeter: room.perimeter / 0.3048,
    wallHeight: room.wallHeight / 0.3048,
    openingsArea: 2.4 / (0.3048 ** 2),
    rollWidth: room.rollWidth / 0.3048,
    rollLength: room.rollLength / 0.3048,
    wastePercent: 0,
    unit: 'ft',
  });
  assert.equal(metric.stripsNeeded, 21);
  assert.equal(imperial.stripsNeeded, metric.stripsNeeded);
  assert.equal(imperial.rollsNeeded, metric.rollsNeeded);
  assert.ok(Math.abs(imperial.netWallAreaM2 - metric.netWallAreaM2) < 1e-10);
});

test('adds material allowance and rejects invalid measurements or unsupported units', () => {
  assert.ok(calculateWallpaper({ ...room, wastePercent: 10 }).rollsNeeded > calculateWallpaper(room).rollsNeeded);
  for (const input of [
    { ...room, perimeter: 0 },
    { ...room, openingsArea: 30 },
    { ...room, rollLength: 2 },
    { ...room, patternRepeat: -1 },
    { ...room, wastePercent: 51 },
    { ...room, unit: 'yd' },
  ]) assert.throws(() => calculateWallpaper(input), RangeError);
});
