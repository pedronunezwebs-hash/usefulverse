import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateStoichiometry } from './logic.mjs';

test('stoichiometry calculates the limiting reactant and theoretical product from moles', () => {
  const result = calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'moles', reactantAmounts: [2, 1] });
  assert.equal(result.balancedEquation, '2H2 + O2 → 2H2O');
  assert.deepEqual(result.limitingReactants, ['H2', 'O2']);
  assert.equal(result.theoreticalProductMoles, 2);
  assert.ok(Math.abs(result.theoreticalProductMass - 36.03) < 1e-10);
});

test('stoichiometry converts gram amounts to moles and identifies the excess reactant', () => {
  const result = calculateStoichiometry({ equation: 'H2 + O2 -> H2O', reactantAmounts: [2.016, 63.996] });
  assert.equal(result.limitingReactants[0], 'H2');
  assert.ok(Math.abs(result.reactants[0].moles - 1) < 1e-10);
  assert.ok(Math.abs(result.reactants[1].moles - 2) < 1e-10);
  assert.ok(Math.abs(result.theoreticalProductMoles - 1) < 1e-10);
});

test('stoichiometry estimates percent yield for a selected product', () => {
  const result = calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'moles', reactantAmounts: [2, 1], selectedProduct: 'H2O', actualProductMass: 18.015 });
  assert.equal(result.percentYield, 50);
  assert.equal(result.actualProductMass, 18.015);
  assert.equal(calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'moles', reactantAmounts: [2, 1], actualProductMass: 0 }).percentYield, 0);
});

test('stoichiometry handles multiple products and rejects invalid or incomplete quantities', () => {
  const result = calculateStoichiometry({ equation: 'CH4 + O2 -> CO2 + H2O', inputMode: 'moles', reactantAmounts: [1, 2] });
  assert.equal(result.balancedEquation, 'CH4 + 2O2 → CO2 + 2H2O');
  assert.deepEqual(result.products.map(({ formula, moles }) => [formula, moles]), [['CO2', 1], ['H2O', 2]]);
  assert.throws(() => calculateStoichiometry({ equation: 'H2 + O2 -> H2O', reactantAmounts: [1] }), /one amount/u);
  assert.throws(() => calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'moles', reactantAmounts: [0, 1] }), /greater than zero/u);
  assert.throws(() => calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'mass', reactantAmounts: [1, 1], selectedProduct: 'H2' }), /Choose one product/u);
  assert.deepEqual(calculateStoichiometry({ equation: 'H2 + O2 -> H2O', inputMode: 'moles', reactantAmounts: [2e-12, 2e-12] }).limitingReactants, ['H2']);
});
