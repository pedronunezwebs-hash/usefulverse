import assert from 'node:assert/strict';
import test from 'node:test';
import { createGoalPlan, goalDaysRemaining, parseGoalMilestones, recordGoalProgress, restoreGoalPlan, setGoalMilestoneComplete } from './logic.mjs';

const sample = {
  title: 'Run a 10K', outcome: 'Finish a 10K race in under 60 minutes', metric: 'Race time', unit: 'minutes',
  startValue: 75, targetValue: 60, currentValue: 67.5, startDate: '2026-02-01', currentDate: '2026-04-01', dueDate: '2026-06-01',
  milestones: '2026-03-01 | Complete a 5K\n2026-04-01 | Complete an 8K',
};

test('goal planner builds a measurable plan and calculates progress toward an improvement target', () => {
  const plan = createGoalPlan(sample);
  assert.equal(plan.progressPercent, 50);
  assert.equal(plan.daysTotal, 120);
  assert.equal(plan.milestones.length, 2);
  assert.equal(plan.milestones[0].date, '2026-03-01');
  assert.equal(goalDaysRemaining(plan, '2026-05-01'), 31);
});

test('goal planner handles increasing and decreasing targets and clamps progress for display', () => {
  const increasing = createGoalPlan({ ...sample, startValue: 10, targetValue: 20, currentValue: 15 });
  const decreasing = createGoalPlan({ ...sample, startValue: 20, targetValue: 10, currentValue: 15 });
  const beyond = createGoalPlan({ ...sample, startValue: 10, targetValue: 20, currentValue: 25 });
  assert.equal(increasing.progressPercent, 50);
  assert.equal(decreasing.progressPercent, 50);
  assert.equal(beyond.progressPercent, 100);
});

test('milestones must have valid dates inside the plan and unique descriptions', () => {
  assert.deepEqual(parseGoalMilestones('2026-03-01 | First\n2026-03-01 | Second', '2026-02-01', '2026-06-01').length, 2);
  for (const milestones of [
    '2026-01-31 | Too early', '2026-06-02 | Too late', '2026-02-30 | Invalid date',
    '2026-03-01 First', '2026-03-01 | Same\n2026-03-01 | Same',
  ]) assert.throws(() => parseGoalMilestones(milestones, '2026-02-01', '2026-06-01'));
});

test('goal plan rejects invalid dates, equal targets, reversed dates and out-of-range values', () => {
  for (const changes of [
    { startDate: '2026-02-29' }, { dueDate: '2026-01-01' }, { startValue: 10, targetValue: 10 }, { currentDate: '2026-01-31' },
    { currentValue: 'NaN' }, { title: '' }, { outcome: 'x'.repeat(241) },
  ]) assert.throws(() => createGoalPlan({ ...sample, ...changes }));
});

test('dated progress updates the current value, replaces same-day entries and rejects outside-plan dates', () => {
  const plan = createGoalPlan(sample);
  const updated = recordGoalProgress(plan, 66, '2026-05-01');
  const replaced = recordGoalProgress(updated, 65, '2026-05-01');
  assert.equal(replaced.currentValue, 65);
  assert.equal(replaced.progressEntries.filter(({ date }) => date === '2026-05-01').length, 1);
  assert.equal(replaced.progressPercent, 66.66666666666666);
  assert.throws(() => recordGoalProgress(plan, 65, '2026-01-31'));
  assert.throws(() => recordGoalProgress(plan, 65, '2026-06-02'));
});

test('backdated progress preserves the latest measurement as current and survives backup restore', () => {
  const plan = createGoalPlan(sample);
  const latest = recordGoalProgress(plan, 65, '2026-05-01');
  const backdated = recordGoalProgress(latest, 70, '2026-03-01');
  assert.equal(backdated.currentDate, '2026-05-01');
  assert.equal(backdated.currentValue, 65);
  assert.equal(restoreGoalPlan(JSON.parse(JSON.stringify(backdated))).currentValue, 65);
});

test('milestone completion and JSON backup restore preserve user data safely', () => {
  let plan = createGoalPlan(sample);
  plan = setGoalMilestoneComplete(plan, 0, true);
  const updated = recordGoalProgress(plan, 66, '2026-05-01');
  const restored = restoreGoalPlan(JSON.parse(JSON.stringify(updated)));
  assert.equal(restored.title, sample.title);
  assert.equal(restored.currentValue, 66);
  assert.equal(restored.milestones[0].complete, true);
  assert.deepEqual(restored.progressEntries, updated.progressEntries);
  assert.throws(() => setGoalMilestoneComplete(plan, -1, true));
  assert.throws(() => restoreGoalPlan({ schemaVersion: 99 }));
  assert.throws(() => restoreGoalPlan({ ...updated, progressEntries: [...updated.progressEntries, updated.progressEntries[0]] }));
});
