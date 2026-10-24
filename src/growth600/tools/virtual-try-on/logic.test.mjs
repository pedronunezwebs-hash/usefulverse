import test from 'node:test';
import assert from 'node:assert/strict';
import { computeGarmentOverlay } from './logic.mjs';

test('preserves garment aspect ratio and uses percentage placement', () => {
  assert.deepEqual(computeGarmentOverlay(1000, 800, 400, 600, 25, 20, 40), { left: 250, top: 160, width: 400, height: 600 });
});
test('rejects invalid geometry and controls', () => {
  assert.throws(() => computeGarmentOverlay(0, 800, 400, 600, 25, 20, 40), { code: 'invalid-layout' });
  assert.throws(() => computeGarmentOverlay(1000, 800, 400, 600, 25, 20, 0), { code: 'invalid-layout' });
});
