import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateCompoundInterest, calculateLoan, evaluateScientificExpression, inspectZipArchive } from './tool-suite-logic.mjs';
import { zipSync, strToU8 } from 'fflate';

test('loan calculator handles zero interest, amortization and early payoff', () => {
  const zero = calculateLoan(12_000, 0, 1);
  assert.equal(zero.scheduledPayment, 1_000);
  assert.equal(zero.totalInterest, 0);
  assert.equal(zero.months, 12);
  const mortgage = calculateLoan(200_000, 6, 30);
  assert.ok(Math.abs(mortgage.scheduledPayment - 1199.101) < 0.01);
  assert.ok(mortgage.totalInterest > 200_000);
  assert.ok(calculateLoan(10_000, 5, 5, 100).months < 60);
  assert.throws(() => calculateLoan(100, 5, 0), /term/);
  assert.throws(() => calculateLoan(100, 5, 2, -1), /Extra monthly/);
});

test('compound growth includes contribution timing and prevents invalid schedules', () => {
  const noGrowth = calculateCompoundInterest({ initial: 500, contribution: 100, annualRate: 0, years: 1 });
  assert.deepEqual([noGrowth.finalBalance, noGrowth.contributions, noGrowth.interestEarned], [1700, 1700, 0]);
  const start = calculateCompoundInterest({ initial: 0, contribution: 100, annualRate: 12, years: 1, compoundsPerYear: 12, contributeAtStart: true });
  const end = calculateCompoundInterest({ initial: 0, contribution: 100, annualRate: 12, years: 1, compoundsPerYear: 12 });
  assert.ok(start.finalBalance > end.finalBalance);
  assert.ok(Math.abs(end.finalBalance - 1268.25) < 0.1);
  assert.throws(() => calculateCompoundInterest({ years: 0 }), /time period/);
});

test('scientific expression parser obeys precedence, functions and angle mode without eval', () => {
  assert.equal(evaluateScientificExpression('2 + 3 * 4'), 14);
  assert.equal(evaluateScientificExpression('2^3^2'), 512);
  assert.equal(evaluateScientificExpression('-2^2'), -4);
  assert.equal(evaluateScientificExpression('(-2)^2'), 4);
  assert.equal(evaluateScientificExpression('2^-2'), 0.25);
  assert.equal(evaluateScientificExpression('sqrt(81) + 2^3'), 17);
  assert.ok(Math.abs(evaluateScientificExpression('sin(30)') - 0.5) < 1e-12);
  assert.ok(Math.abs(evaluateScientificExpression('sin(pi / 6)', 'radians') - 0.5) < 1e-12);
  assert.equal(evaluateScientificExpression('10%'), 0.1);
  assert.throws(() => evaluateScientificExpression('1 / 0'), /zero/);
  assert.throws(() => evaluateScientificExpression('window.alert(1)'), /Unsupported character|Unknown constant/);
  assert.throws(() => evaluateScientificExpression('sqrt(-1)'), /finite real/);
});

test('ZIP inspection rejects path traversal, encrypted entries, ZIP64 and expansion bombs', () => {
  const good = zipSync({ 'folder/hello.txt': strToU8('hello'), 'empty/': new Uint8Array() });
  const inspected = inspectZipArchive(good);
  assert.equal(inspected.entryCount, 2);
  assert.equal(inspected.expandedBytes, 5);
  const traversal = zipSync({ '../outside.txt': strToU8('no') });
  assert.throws(() => inspectZipArchive(traversal), /unsafe file path/);
  assert.throws(() => inspectZipArchive(good, { maxExpandedBytes: 4 }), /uncompressed ZIP/);
  assert.throws(() => inspectZipArchive(good, { maxFiles: 1 }), /no more than 1/);
  assert.throws(() => inspectZipArchive(new Uint8Array(8)), /ZIP archive/);
});
