import test from 'node:test';
import assert from 'node:assert/strict';
import { createFingerJointBox } from './logic.mjs';

test('creates a bounded SVG box layout with dimensional and fit metadata', () => {
  const box = createFingerJointBox({ width: 120, depth: 80, height: 60, thickness: 3, clearance: 0.15, fingers: 4 });
  assert.equal(box.slotWidth, Number((box.fingerWidth + 0.15).toFixed(3)));
  assert.ok(box.sheetWidth > 0 && box.sheetHeight > 0);
  assert.match(box.svg, /<svg[^>]+width="\d+mm"/u);
  assert.match(box.svg, /Front wall/u);
  assert.match(box.svg, /fill-rule="evenodd"/u);
  assert.equal((box.svg.match(/M/g) ?? []).length, 1 + 4 * 4 + 4, 'base cutouts match four sets of finger tabs plus four walls');
});

test('rejects unsafe or geometrically impossible parameters', () => {
  assert.throws(() => createFingerJointBox({ width: 10, depth: 80, height: 60, thickness: 3, fingers: 4 }), RangeError);
  assert.throws(() => createFingerJointBox({ width: 20, depth: 20, height: 60, thickness: 8, fingers: 6 }), RangeError);
  assert.throws(() => createFingerJointBox({ width: 80, depth: 80, height: 60, thickness: 3, fingers: 13 }), RangeError);
});
