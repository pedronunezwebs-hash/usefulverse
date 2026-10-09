import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateBeamDeflection } from './logic.mjs';

const base = { support: 'simply-supported', loadCase: 'point', span: 4, spanUnit: 'm', load: 1000, forceUnit: 'N', modulus: 200, modulusUnit: 'GPa', inertia: 8e-6, inertiaUnit: 'm⁴' };

test('simply supported central point load returns textbook maximum deflection and symmetric profile', () => {
  const result = calculateBeamDeflection(base);
  assert.ok(Math.abs(result.maxDeflection - 0.0008333333333333334) < 1e-15);
  assert.equal(result.maxLocation, 2);
  assert.equal(result.profile[0].deflection, 0);
  assert.equal(result.profile.at(-1).deflection, 0);
  assert.ok(Math.abs(result.profile[16].deflection - result.maxDeflection) < 1e-15);
  assert.ok(Math.abs(result.profile[8].deflection - result.profile[24].deflection) < 1e-15);
});

test('supports uniformly distributed load and cantilever point/uniform cases', () => {
  const simpleUniform = calculateBeamDeflection({ ...base, loadCase: 'uniform', load: 1, forceUnit: 'kN' });
  assert.ok(Math.abs(simpleUniform.maxDeflection - 0.0020833333333333333) < 1e-15);
  const cantileverPoint = calculateBeamDeflection({ ...base, support: 'cantilever' });
  assert.ok(Math.abs(cantileverPoint.maxDeflection - 0.013333333333333334) < 1e-15);
  const cantileverUniform = calculateBeamDeflection({ ...base, support: 'cantilever', loadCase: 'uniform', load: 1, forceUnit: 'kN' });
  assert.ok(Math.abs(cantileverUniform.maxDeflection - 0.02) < 1e-15);
});

test('zero applied load gives zero deflection and moment', () => {
  const result = calculateBeamDeflection({ ...base, load: 0 });
  assert.equal(result.maxDeflection, 0);
  assert.equal(result.maxMomentNm, 0);
  assert.ok(result.profile.every(({ deflection }) => deflection === 0));
});

test('unit conversions preserve the physical result', () => {
  const metric = calculateBeamDeflection(base);
  const imperial = calculateBeamDeflection({ ...base, span: 4 / 0.3048, spanUnit: 'ft', forceUnit: 'lbf', load: 1000 / 4.4482216152605, modulus: 200e9 / 6894757.293168, modulusUnit: 'ksi', inertia: 8e-6 / (0.0254 ** 4), inertiaUnit: 'in⁴' });
  assert.ok(Math.abs(imperial.maxDeflection * 0.3048 - metric.maxDeflection) < 1e-14);
});

test('rejects unknown cases, unsupported units, negative load and degenerate stiffness', () => {
  assert.throws(() => calculateBeamDeflection({ ...base, support: 'fixed-fixed' }), /supported beam/u);
  assert.throws(() => calculateBeamDeflection({ ...base, spanUnit: 'yard' }), /supported units/u);
  assert.throws(() => calculateBeamDeflection({ ...base, load: -1 }), /Load/u);
  assert.throws(() => calculateBeamDeflection({ ...base, inertia: 0 }), /Second moment/u);
});
