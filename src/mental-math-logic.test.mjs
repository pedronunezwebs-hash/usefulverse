import test from 'node:test';
import assert from 'node:assert/strict';
import { createMentalMathProblem, parseMentalMathAnswer, validateMentalMathSettings } from './mental-math-logic.mjs';

test('mental-math problems are reproducible and stay inside the selected operation', () => {
  assert.deepEqual(createMentalMathProblem({ operation: 'addition', difficulty: 'easy' }, () => 0.5), { a: 10, b: 10, symbol: '+', answer: 20 });
  const subtraction = createMentalMathProblem({ operation: 'subtraction', difficulty: 'easy' }, () => 0.2);
  assert.equal(subtraction.a - subtraction.b, subtraction.answer);
  assert.ok(subtraction.answer >= 0);
  const division = createMentalMathProblem({ operation: 'division', difficulty: 'medium' }, () => 0.5);
  assert.equal(division.a / division.b, division.answer);
});

test('mental-math settings and answers reject unsupported or oversized input', () => {
  assert.deepEqual(validateMentalMathSettings({ operation: 'mixed', difficulty: 'hard', questions: '20' }), { operation: 'mixed', difficulty: 'hard', questions: 20 });
  assert.throws(() => validateMentalMathSettings({ operation: 'power', difficulty: 'easy', questions: 10 }), /operation/u);
  assert.throws(() => validateMentalMathSettings({ operation: 'mixed', difficulty: 'easy', questions: 21 }), /Questions/u);
  assert.equal(parseMentalMathAnswer(' -42 '), -42);
  assert.throws(() => parseMentalMathAnswer('1e9'), /whole-number/u);
  assert.throws(() => parseMentalMathAnswer('1.5'), /whole-number/u);
});
