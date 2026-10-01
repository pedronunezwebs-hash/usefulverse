import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeVisualEditRect, PDF_VISUAL_EDIT_LIMITS, validateVisualEditInput, validateVisualReplacementImage, visualEditPixelPlan } from './pdf-visual-edit-logic.mjs';

test('visual edit rectangle normalizes reverse drags and clips selection to the page', () => {
  assert.deepEqual(normalizeVisualEditRect({ x: 180, y: 160 }, { x: -10, y: 10 }, 200, 150), { x: 0, y: 10, width: 180, height: 140 });
});

test('visual edit rejects invalid and tiny selections', () => {
  assert.throws(() => normalizeVisualEditRect({ x: 10, y: 10 }, { x: 15, y: 15 }, 200, 200), /larger area/u);
  assert.throws(() => normalizeVisualEditRect({ x: NaN, y: 10 }, { x: 50, y: 50 }, 200, 200), /not valid/u);
});

test('visual PDF editor enforces local file, page and replacement image limits', () => {
  assert.equal(validateVisualEditInput({ name: 'sample.pdf', type: 'application/pdf', size: 1 }, 2), true);
  assert.throws(() => validateVisualEditInput({ name: 'large.pdf', type: 'application/pdf', size: PDF_VISUAL_EDIT_LIMITS.inputBytes + 1 }, 2), /50 MB/u);
  assert.throws(() => validateVisualEditInput({ name: 'many.pdf', type: 'application/pdf', size: 1 }, 101), /1–100/u);
  assert.throws(() => validateVisualReplacementImage({ type: 'image/svg+xml', size: 1 }), /PNG or JPEG/u);
  assert.throws(() => validateVisualReplacementImage({ type: 'image/png', size: PDF_VISUAL_EDIT_LIMITS.imageBytes + 1 }), /10 MB/u);
});

test('visual edit render plan stays inside its aggregate pixel budget', () => {
  const plan = visualEditPixelPlan(Array.from({ length: 10 }, () => ({ width: 612, height: 792 })));
  assert.ok(plan.estimatedPixels <= PDF_VISUAL_EDIT_LIMITS.totalPixels);
  assert.ok(plan.scale <= 1.5);
  assert.throws(() => visualEditPixelPlan([{ width: 100_000, height: 100_000 }]), /too much memory/u);
});
