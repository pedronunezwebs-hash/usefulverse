import test from 'node:test';
import assert from 'node:assert/strict';
import { checkElementAnswer, chooseQuizElement, compareElements, elements, filterElements } from './periodic-table-logic.mjs';

test('periodic dataset contains 118 uniquely numbered and symbolized elements', () => {
  assert.equal(elements.length, 118);
  assert.deepEqual(elements.map(({ number }) => number), Array.from({ length: 118 }, (_, i) => i + 1));
  assert.equal(new Set(elements.map(({ symbol }) => symbol)).size, 118);
  assert.deepEqual([elements[0].symbol, elements[0].group, elements[0].period], ['H', 1, 1]);
  assert.deepEqual([elements[5].symbol, elements[5].group, elements[5].period], ['C', 14, 2]);
  assert.deepEqual([elements[117].symbol, elements[117].group, elements[117].period], ['Og', 18, 7]);
  assert.deepEqual([elements[56].family, elements[88].family], ['Lanthanide', 'Actinide']);
});

test('search matches atomic number, symbol, English or supplied localized names', () => {
  assert.deepEqual(filterElements({ query: '26' }).map(({ symbol }) => symbol), ['Fe']);
  assert.deepEqual(filterElements({ query: 'oxygen' }).map(({ number }) => number), [8]);
  assert.deepEqual(filterElements({ query: 'оксиген', family: 'Nonmetal' }, { Oxygen: 'Оксиген' }).map(({ symbol }) => symbol), ['O']);
  assert.deepEqual(filterElements({ query: 'h', group: 18 }).map(({ symbol }) => symbol), ['He']);
});

test('comparison is bounded, unique and returns exact element records', () => {
  assert.deepEqual(compareElements([1, 8]).map(({ symbol }) => symbol), ['H', 'O']);
  assert.throws(() => compareElements([1]), /two or three/u);
  assert.throws(() => compareElements([1, 1]), /different/u);
  assert.throws(() => compareElements([0, 2]), /1 to 118/u);
});

test('quiz selection and symbol answers are deterministic under injected random values', () => {
  assert.equal(chooseQuizElement(() => 0).symbol, 'H');
  assert.equal(chooseQuizElement(() => 0.999999).symbol, 'Og');
  assert.throws(() => chooseQuizElement(() => 1), /Random source/u);
  assert.equal(checkElementAnswer(elements[7], ' o '), true);
  assert.equal(checkElementAnswer(elements[7], '8'), false);
});
