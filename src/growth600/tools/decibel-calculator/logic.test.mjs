import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDecibels } from './logic.mjs';

test('power ratio uses 10 log10 and tenfold power is 10 dB', () => {
  assert.equal(calculateDecibels({ mode: 'power-ratio', ratio: '10' }).db, 10);
  assert.equal(calculateDecibels({ mode: 'power-ratio', ratio: '0.1' }).db, -10);
});

test('amplitude ratio uses 20 log10', () => {
  assert.equal(calculateDecibels({ mode: 'amplitude-ratio', ratio: 10 }).db, 20);
  assert.equal(calculateDecibels({ mode: 'amplitude-ratio', ratio: 0.5 }).db, 20 * Math.log10(0.5));
});

test('dB-to-ratio modes invert their corresponding ratio-to-dB formula', () => {
  assert.equal(calculateDecibels({ mode: 'db-to-power', inputDb: 10 }).ratio, 10);
  assert.equal(calculateDecibels({ mode: 'db-to-amplitude', inputDb: 20 }).ratio, 10);
  assert.equal(calculateDecibels({ mode: 'db-to-power', inputDb: '-10' }).ratio, 0.1);
});

test('summing incoherent levels handles equal levels and large level differences stably', () => {
  assert.ok(Math.abs(calculateDecibels({ mode: 'sum-levels', levels: '0\n0' }).db - 3.01029995664) < 1e-9);
  assert.ok(Math.abs(calculateDecibels({ mode: 'sum-levels', levels: '1000\n-3000' }).db - 1000) < 1e-9);
  assert.equal(calculateDecibels({ mode: 'sum-levels', levels: '0;0;0' }).count, 3);
});

test('gain and attenuation add to an input level without confusing dB and linear ratios', () => {
  assert.equal(calculateDecibels({ mode: 'apply-gain', inputLevel: 72, gainDb: -6 }).db, 66);
  assert.equal(calculateDecibels({ mode: 'apply-gain', inputLevel: -20, gainDb: 3 }).db, -17);
});

test('ratio, level, mode and list boundaries reject invalid inputs', () => {
  for (const ratio of ['', 0, -1, 'NaN', Infinity, 1e301, 1e-301]) assert.throws(() => calculateDecibels({ mode: 'power-ratio', ratio }));
  assert.equal(calculateDecibels({ mode: 'power-ratio', ratio: 1e-300 }).db, -3000);
  assert.equal(calculateDecibels({ mode: 'amplitude-ratio', ratio: 1e300 }).db, 6000);
  for (const inputDb of ['NaN', 3001, -3001]) assert.throws(() => calculateDecibels({ mode: 'db-to-power', inputDb }));
  for (const levels of ['', '0', `${Array.from({ length: 21 }, () => '0').join('\n')}`, '0\nnope']) assert.throws(() => calculateDecibels({ mode: 'sum-levels', levels }));
  assert.equal(calculateDecibels({ mode: 'apply-gain', inputLevel: 3000, gainDb: 1 }).db, 3001);
  assert.throws(() => calculateDecibels({ mode: 'unknown' }));
});
