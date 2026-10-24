import test from 'node:test';
import assert from 'node:assert/strict';
import { assertRuleSnapshotsCurrent } from './rule-maintenance.mjs';

const current = { id: 'example-rule', effectiveFrom: '2026-04-01', checkedAt: '2026-10-19', reviewDue: '2026-11-19' };

test('dated rule snapshots pass before and on their review due date', () => {
  assert.doesNotThrow(() => assertRuleSnapshotsCurrent([current], '2026-11-19'));
  assert.doesNotThrow(() => assertRuleSnapshotsCurrent([{ id: 'local-tool' }], '2026-11-20'));
});

test('build gate rejects expired, incomplete, invalid or inconsistent rule dates', () => {
  assert.throws(() => assertRuleSnapshotsCurrent([current], '2026-11-20'), /rule snapshot expired/u);
  assert.throws(() => assertRuleSnapshotsCurrent([{ ...current, reviewDue: undefined }], '2026-10-19'), /incomplete/u);
  assert.throws(() => assertRuleSnapshotsCurrent([{ ...current, checkedAt: '2026-02-30' }], '2026-10-19'), /incomplete/u);
  assert.throws(() => assertRuleSnapshotsCurrent([{ ...current, checkedAt: '2026-11-20' }], '2026-10-19'), /inconsistent/u);
  assert.throws(() => assertRuleSnapshotsCurrent([], '2026-02-30'), TypeError);
});
