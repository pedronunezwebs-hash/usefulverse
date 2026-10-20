import test from 'node:test';
import assert from 'node:assert/strict';
import { egfrCalculator, EGFR_MAINTENANCE } from '../pending-23/logic.mjs';

test('eGFR applies the official 2021 race-free adult CKD-EPI creatinine equation', () => {
  const result = egfrCalculator({ creatinine: 1, unit: 'mg-dl', age: 40, sex: 'male', asOf: '2026-10-19' });
  assert.ok(Math.abs(result.estimate - 97.575) < 0.001);
  assert.equal(result.effectiveFrom, '2021-01-01');
  assert.equal(result.checkedAt, '2026-10-19');
  assert.equal(result.reviewDue, '2026-11-19');
  const si = egfrCalculator({ creatinine: 88.4, unit: 'umol-l', age: 40, sex: 'male', asOf: '2026-10-19' });
  assert.equal(si.estimate, result.estimate);
});

test('eGFR rejects stale or not-yet-effective equation snapshots', () => {
  assert.equal(EGFR_MAINTENANCE.sourceUrl.includes('niddk.nih.gov'), true);
  assert.throws(() => egfrCalculator({ creatinine: 1, unit: 'mg-dl', age: 40, sex: 'male', asOf: '2020-12-31' }), { code: 'rules-not-effective' });
  assert.throws(() => egfrCalculator({ creatinine: 1, unit: 'mg-dl', age: 40, sex: 'male', asOf: '2026-11-20' }), { code: 'rules-expired' });
  assert.throws(() => egfrCalculator({ creatinine: 1, unit: 'mg-dl', age: 40, sex: 'male', asOf: 'not-a-date' }));
});
