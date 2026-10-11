import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBooleanAlgebra } from './logic.mjs';

test('tautology A OR NOT A simplifies to one and every row is true', () => {
  const result = calculateBooleanAlgebra({ expression: 'A OR NOT A' });
  assert.equal(result.sop, '1');
  assert.equal(result.pos, '1');
  assert.ok(result.rows.every(({ result: value }) => value));
});

test('simplifies an absorbed expression and keeps every truth-table row equivalent', () => {
  const result = calculateBooleanAlgebra({ expression: '(A & B) | (A & !B)' });
  assert.equal(result.sop, 'A');
  assert.equal(calculateBooleanAlgebra({ expression: '!(A & B)' }).pos, '(!A | !B)');
  assert.ok(result.rows.every(({ assignment, result: value }) => value === assignment.A));
});

test('constant functions have exact zero/one sum and product forms', () => {
  assert.deepEqual([calculateBooleanAlgebra({ expression: 'A & !A' }).sop, calculateBooleanAlgebra({ expression: 'A & !A' }).pos], ['0', '0']);
  assert.deepEqual([calculateBooleanAlgebra({ expression: 'A | !A' }).sop, calculateBooleanAlgebra({ expression: 'A | !A' }).pos], ['1', '1']);
});

test('creates Gray-ordered Karnaugh cells and canonical minterms for two to four variables', () => {
  const result = calculateBooleanAlgebra({ expression: 'A ^ B' });
  assert.deepEqual(result.minterms, [1, 2]);
  assert.deepEqual(result.kmap.rowLabels, ['0', '1']);
  assert.deepEqual(result.kmap.columnLabels, ['0', '1']);
  assert.deepEqual(result.kmap.cells, [[false, true], [true, false]]);
  assert.equal(calculateBooleanAlgebra({ expression: 'A & B & C & D' }).kmap.cells.length, 4);
});

test('accepts constants, symbolic operators and implicit AND with standard precedence', () => {
  const result = calculateBooleanAlgebra({ expression: 'A B + !C' });
  assert.equal(result.rows.length, 8);
  assert.equal(result.rows.find(({ assignment }) => assignment.A && assignment.B && assignment.C).result, true);
  assert.equal(calculateBooleanAlgebra({ expression: 'A ^ B ^ A' }).sop, 'B');
});

test('rejects code injection, malformed expressions and expressions beyond configured limits', () => {
  for (const expression of ['globalThis.alert(1)', 'A &', '(A | B', `${'A & '.repeat(50)}A`, 'A'.repeat(181)]) {
    assert.throws(() => calculateBooleanAlgebra({ expression }));
  }
});

test('SOP and POS preserve all 256 Boolean functions of three variables', () => {
  const variables = ['A', 'B', 'C'];
  const formsEquivalent = (form, rows) => {
    if (form === '0') return rows.every(({ result }) => !result);
    if (form === '1') return rows.every(({ result }) => result);
    const simplified = calculateBooleanAlgebra({ expression: form });
    return rows.every(({ assignment, result }) => simplified.rows.find((candidate) => simplified.variables.every((name) => candidate.assignment[name] === assignment[name])).result === result);
  };
  for (let mask = 0; mask < 256; mask += 1) {
    const terms = Array.from({ length: 8 }, (_, index) => index).filter((index) => mask & (1 << index)).map((index) => `(${variables.map((name, bit) => index & (1 << (2 - bit)) ? name : `!${name}`).join(' & ')})`);
    const expression = terms.length ? terms.join(' | ') : '(A & !A)';
    const result = calculateBooleanAlgebra({ expression });
    assert.equal(formsEquivalent(result.sop, result.rows), true, `SOP mask ${mask}`);
    assert.equal(formsEquivalent(result.pos, result.rows), true, `POS mask ${mask}`);
  }
});
