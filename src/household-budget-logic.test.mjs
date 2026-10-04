import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetCsvCell, parseBudgetAmount, summarizeBudget, validateBudgetTransaction } from './household-budget-logic.mjs';

const row = (overrides = {}) => ({ date: '2026-10-05', type: 'expense', amount: 12.34, category: 'Food', note: '', ...overrides });

test('household budget validates local monthly transactions and sums income, expenses, balance, and categories', () => {
  const summary = summarizeBudget([
    row({ type: 'income', amount: 2000, category: 'Salary' }),
    row({ amount: 10.1 }),
    row({ amount: 2.99, category: 'Food' }),
  ]);
  assert.equal(summary.income, 2000);
  assert.equal(summary.expenses, 13.09);
  assert.equal(summary.balance, 1986.91);
  assert.deepEqual(summary.categories, [
    { type: 'expense', category: 'Food', amount: 13.09 },
    { type: 'income', category: 'Salary', amount: 2000 },
  ]);
  assert.equal(validateBudgetTransaction(row({ amount: 0.29 }), '2026-10').amount, 0.29);
});

test('household budget rejects invalid dates, other months, bad amounts, and oversized input', () => {
  assert.throws(() => validateBudgetTransaction(row({ date: '2026-02-29' }), '2026-02'), /valid date/u);
  assert.throws(() => validateBudgetTransaction(row(), '2026-09'), /selected month/u);
  assert.throws(() => validateBudgetTransaction(row({ amount: -1 }), '2026-10'), /amount greater than zero/u);
  assert.throws(() => validateBudgetTransaction(row({ amount: 1.234 }), '2026-10'), /two decimal places/u);
  assert.throws(() => summarizeBudget(Array.from({ length: 301 }, () => row())), /no more than 300/u);
});

test('household budget CSV quotes fields and neutralizes spreadsheet formula prefixes', () => {
  assert.equal(budgetCsvCell('=SUM(A1:A2)'), '"\'=SUM(A1:A2)"');
  assert.equal(budgetCsvCell('Food, groceries'), '"Food, groceries"');
  assert.equal(budgetCsvCell('a "note"'), '"a ""note"""');
});

test('household budget parses localized and ASCII decimal input without accepting malformed strings', () => {
  assert.equal(parseBudgetAmount('1,234.56', 'en-US'), 1234.56);
  assert.equal(parseBudgetAmount('1.234,56', 'de-DE'), 1234.56);
  assert.equal(parseBudgetAmount('١٬٢٣٤٫٥٦', 'ar'), 1234.56);
  assert.equal(parseBudgetAmount('1234.56', 'de-DE'), 1234.56);
  assert.ok(Number.isNaN(parseBudgetAmount('$12.50', 'en-US')));
  assert.ok(Number.isNaN(parseBudgetAmount('1.2.3', 'en-US')));
});
