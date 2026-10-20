import assert from 'node:assert/strict';
import test from 'node:test';
import { ORIGAMI_MODELS, simulateOrigamiFold } from './logic.mjs';

test('original origami models expose bounded step sequences and a triangular paper mesh', () => {
  assert.deepEqual(ORIGAMI_MODELS.map(({ id, steps }) => [id, steps.length]), [['book-fold', 1], ['gate-fold', 2], ['accordion-fold', 3]]);
  const mesh = simulateOrigamiFold({ modelId: 'book-fold', progress: 0.5, resolution: 8 });
  assert.equal(mesh.vertices.length, 81);
  assert.equal(mesh.faces.length, 128);
  assert.ok(mesh.faces.every((face) => face.length === 3 && face.every((index) => index >= 0 && index < mesh.vertices.length)));
});

test('fold rotation preserves distances from the crease axis and leaves the hinge fixed', () => {
  const mesh = simulateOrigamiFold({ progress: 0.5, resolution: 8 });
  const moving = mesh.vertices.find(({ u, v }) => u === 1 && v === 0.5);
  assert.ok(Math.abs(Math.hypot(moving.x, moving.z) - 0.5) < 1e-12);
  const hinge = mesh.vertices.find(({ u, v }) => u === 0.5 && v === 0.5);
  assert.ok(Math.abs(hinge.x) < 1e-12);
  assert.ok(Math.abs(hinge.z) < 1e-12);
});

test('gate and accordion steps apply prior completed folds before the active fold', () => {
  const gate = simulateOrigamiFold({ modelId: 'gate-fold', stepIndex: 1, progress: 0.5, resolution: 8 });
  const accordion = simulateOrigamiFold({ modelId: 'accordion-fold', stepIndex: 2, progress: 1, resolution: 8 });
  assert.equal(gate.stepCount, 2);
  assert.equal(accordion.stepCount, 3);
  assert.ok(gate.vertices.some(({ z }) => Math.abs(z) > 0.1));
  assert.ok(accordion.vertices.every(({ x, y, z }) => [x, y, z].every(Number.isFinite)));
});

test('invalid models, steps, progress and mesh sizes fail closed', () => {
  assert.throws(() => simulateOrigamiFold({ modelId: 'unknown' }), RangeError);
  assert.throws(() => simulateOrigamiFold({ stepIndex: 1 }), RangeError);
  assert.throws(() => simulateOrigamiFold({ progress: 1.1 }), RangeError);
  assert.throws(() => simulateOrigamiFold({ resolution: 41 }), RangeError);
});
