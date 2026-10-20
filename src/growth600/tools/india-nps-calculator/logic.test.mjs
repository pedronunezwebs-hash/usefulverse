import test from 'node:test';
import assert from 'node:assert/strict';
import { projectIndiaNps, INDIA_NPS_MAINTENANCE } from './logic.mjs';

const base = { startingCorpus: 100000, monthlyContribution: 1000, years: 1, annualReturnPercent: 0, annualAnnuityRatePercent: 6, asOf: '2026-10-19' };

test('NPS projection compounds month-end contributions and applies the normal exit illustration', () => {
  const result = projectIndiaNps(base);
  assert.equal(result.projectedCorpus, 112000);
  assert.equal(result.totalContributions, 112000);
  assert.equal(result.lumpPercent, 80);
  assert.equal(result.annuityPercent, 20);
  assert.equal(result.estimatedMonthlyPension, 112);
  assert.equal(result.checkedAt, '2026-10-19');
});

test('NPS small-corpus options apply only to their selected scenario and exact ceilings', () => {
  const normal = projectIndiaNps({ ...base, startingCorpus: 788000, monthlyContribution: 0, smallBalanceOption: true });
  assert.equal(normal.projectedCorpus, 788000);
  assert.equal(normal.lumpPercent, 100);
  const premature = projectIndiaNps({ ...base, startingCorpus: 500000, monthlyContribution: 0, exitType: 'premature' });
  assert.equal(premature.lumpPercent, 100);
  const overPrematureLimit = projectIndiaNps({ ...base, startingCorpus: 500001, monthlyContribution: 0, exitType: 'premature' });
  assert.equal(overPrematureLimit.lumpPercent, 20);
  assert.equal(INDIA_NPS_MAINTENANCE.reviewDue, '2026-11-19');
});

test('NPS estimate stops before rule effective date and after the review deadline', () => {
  assert.throws(() => projectIndiaNps({ ...base, asOf: '2026-07-19' }), { code: 'rules-not-effective' });
  assert.throws(() => projectIndiaNps({ ...base, asOf: '2026-11-20' }), { code: 'rules-expired' });
  assert.throws(() => projectIndiaNps({ ...base, asOf: 'not-a-date' }));
});
