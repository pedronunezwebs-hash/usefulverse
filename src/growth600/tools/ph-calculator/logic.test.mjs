import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePh } from './logic.mjs';

test('hydrogen concentration 1e-7 gives pH 7 at the stated 25 C model', () => {
  const result = calculatePh({ mode: 'strong-acid', concentration: 1e-7 });
  assert.equal(result.pH, 7);
  assert.equal(result.pOH, 7);
  assert.equal(result.classification, 'neutral');
});

test('strong acid and strong base return expected ideal concentration values', () => {
  assert.equal(calculatePh({ mode: 'strong-acid', concentration: 1e-3 }).pH, 3);
  assert.equal(calculatePh({ mode: 'strong-base', concentration: 1e-4 }).pH, 10);
});

test('weak monoprotic acid equilibrium includes water autoionization', () => {
  const result = calculatePh({ mode: 'weak-acid', concentration: 0.1, equilibriumConstant: 1e-5 });
  assert.ok(Math.abs(result.pH - 3.00216) < 0.002);
  assert.ok(result.percentIonized > 0 && result.percentIonized < 100);
  assert.ok(Math.abs(result.hydrogen - result.concentration * result.percentIonized / 100 - result.hydroxide) < 1e-12);
});

test('weak monoprotic base returns a basic solution and percent ionization', () => {
  const result = calculatePh({ mode: 'weak-base', concentration: 0.1, equilibriumConstant: 1e-5 });
  assert.ok(Math.abs(result.pH - 10.998) < 0.01);
  assert.ok(result.percentIonized > 0 && result.percentIonized < 100);
  assert.equal(result.classification, 'basic');
});

test('very dilute weak species stays near neutral under water autoionization', () => {
  const result = calculatePh({ mode: 'weak-acid', concentration: 1e-12, equilibriumConstant: 1e-8 });
  assert.ok(Math.abs(result.pH - 7) < 0.001);
});

test('rejects invalid modes, concentrations, and missing equilibrium constants', () => {
  assert.throws(() => calculatePh({ mode: 'buffer', concentration: 1 }));
  assert.throws(() => calculatePh({ mode: 'strong-acid', concentration: 0 }));
  assert.throws(() => calculatePh({ mode: 'weak-acid', concentration: 0.1 }));
  assert.throws(() => calculatePh({ mode: 'weak-base', concentration: 0.1, equilibriumConstant: 2 }));
});
