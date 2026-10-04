import assert from 'node:assert/strict';
import test from 'node:test';
import { buildStudyPlan } from './study-planner-logic.mjs';

const today = new Date(2026, 9, 4);

test('study plan splits estimated work into 25-minute sessions before each exam', () => {
  const plan = buildStudyPlan([
    { name: 'Math', examDate: '2026-10-07', minutesPerDay: 50, tasks: 'Fractions | 50\nAlgebra' },
  ], today);
  assert.equal(plan.totalSessions, 3);
  assert.equal(plan.studyMinutes, 75);
  assert.deepEqual(plan.schedule.map((session) => session.date), ['2026-10-04', '2026-10-04', '2026-10-05']);
  assert.equal(plan.unfinished.length, 0);
});

test('study plan respects per-subject daily availability, exam dates, and reports overload', () => {
  const plan = buildStudyPlan([
    { name: 'Physics', examDate: '2026-10-06', minutesPerDay: 25, tasks: 'Mechanics | 100' },
    { name: 'History', examDate: '2026-10-09', minutesPerDay: 50, tasks: 'Chapter 1 | 75' },
  ], today);
  assert.equal(plan.schedule.filter((session) => session.subject === 'Physics' && session.date === '2026-10-04').length, 1);
  assert.ok(plan.schedule.every((session) => session.date < (session.subject === 'Physics' ? '2026-10-06' : '2026-10-09')));
  assert.ok(plan.unfinished.some((task) => task.subject === 'Physics'));
});

test('study plan rejects impossible dates, empty topics, and unsafe estimates', () => {
  assert.throws(() => buildStudyPlan([{ name: 'Math', examDate: '2026-02-30', minutesPerDay: 25, tasks: 'Topic' }], today), /valid exam date/u);
  assert.throws(() => buildStudyPlan([{ name: 'Math', examDate: '2026-10-05', minutesPerDay: 25, tasks: '' }], today), /at least one/u);
  assert.throws(() => buildStudyPlan([{ name: 'Math', examDate: '2026-10-05', minutesPerDay: 25, tasks: 'Topic | 2401' }], today), /1–2400/u);
});
