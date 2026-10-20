import assert from 'node:assert/strict';
import test from 'node:test';
import { growthPilotTools } from './catalog.mjs';
import { growthReleasePlan } from './release-plan.mjs';

test('normal release preserves all 217 public hub tools and excludes the 300 staged drafts', () => {
  const plan = growthReleasePlan(growthPilotTools);
  assert.equal(plan.tools.length, 217);
  assert.equal(plan.noindexHome, false);
  assert.deepEqual(plan.noindexToolIds, []);
  assert.deepEqual(plan.allowUnapprovedToolIds, []);
});

test('isolated preview contains only the 300 noindex tools and cannot exempt existing tools from linguistic review', () => {
  const plan = growthReleasePlan(growthPilotTools, { previewOnly: true });
  assert.equal(plan.tools.length, 300);
  assert.equal(plan.noindexHome, true);
  assert.equal(plan.noindexToolIds.length, 300);
  assert.deepEqual(plan.allowUnapprovedToolIds, plan.noindexToolIds);
  assert.ok(plan.tools.every((tool) => tool.indexable === false));
});

test('an empty selected release fails closed', () => {
  assert.throws(() => growthReleasePlan([], {}), /no tools/u);
  assert.throws(() => growthReleasePlan([{ id: 'existing' }], { previewOnly: true }), /no tools/u);
});
