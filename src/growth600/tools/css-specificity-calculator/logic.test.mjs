import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCssSpecificity } from './logic.mjs';

const scores = input => calculateCssSpecificity(input).map(item => item.specificity);

test('counts IDs, classes, attributes, types and pseudo-elements', () => {
  assert.deepEqual(scores('#app .card[data-kind="x"]:hover h2::before'), [[1, 3, 2]]);
});

test(':where has zero specificity and selector lists use the strongest argument', () => {
  assert.deepEqual(scores(':where(#app), :is(.card, #notice), :not(article, main)'), [[0, 0, 0], [1, 0, 0], [0, 0, 1]]);
});

test('nth-child counts itself and the strongest selector in its of-list', () => {
  assert.deepEqual(scores('li:nth-child(2n of .item, #featured)'), [[1, 1, 1]]);
});

test('parses namespace selectors, comments and commas inside balanced functions', () => {
  assert.deepEqual(scores('svg|a /* selector */.icon, :is(.a, .b), *|a, *|*'), [[0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0]]);
});

test('preserves comment-like text inside quoted attribute values', () => {
  assert.deepEqual(scores('[data-note="/* keep */"]'), [[0, 1, 0]]);
});

test('rejects malformed selectors, unfinished comments and over-limit lists', () => {
  assert.throws(() => calculateCssSpecificity('.a, '), SyntaxError);
  assert.throws(() => calculateCssSpecificity('.a /* unfinished'), /Close the CSS comment/);
  assert.throws(() => calculateCssSpecificity(Array(31).fill('.a').join(',')), { code: 'too-many-selectors' });
  assert.throws(() => calculateCssSpecificity('a'.repeat(2001)), { code: 'invalid-selector' });
});
