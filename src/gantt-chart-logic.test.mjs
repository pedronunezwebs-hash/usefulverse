import test from 'node:test';
import assert from 'node:assert/strict';
import { ganttPlanToCsv, parseGanttTasks, positionGanttTasks } from './gantt-chart-logic.mjs';

test('parses Unicode tasks, dates, durations and earlier dependencies', () => {
  const plan = parseGanttTasks('Diseño / 設計 | 2026-10-05 | 3\nBuild | 2026-10-08 | 4 | 1');
  assert.equal(plan.tasks.length, 2);
  assert.equal(plan.tasks[0].name, 'Diseño / 設計');
  assert.equal(plan.tasks[1].dependency, 1);
  assert.equal(plan.tasks[0].end, '2026-10-07');
});

test('positions bars against the complete inclusive date range', () => {
  const plan = parseGanttTasks('One | 2026-10-01 | 2\nTwo | 2026-10-05 | 1');
  const [first, second] = positionGanttTasks(plan);
  assert.equal(plan.spanDays, 5);
  assert.equal(first.leftPercent, 0);
  assert.equal(first.widthPercent, 40);
  assert.equal(second.leftPercent, 80);
  assert.equal(second.widthPercent, 20);
});

test('rejects invalid dates, duration, dependency order, and dependency overlap', () => {
  assert.throws(() => parseGanttTasks('Task | 2026-02-30 | 1'), /valid calendar date/u);
  assert.throws(() => parseGanttTasks('Task | 2026-10-05 | 0'), /duration/u);
  assert.throws(() => parseGanttTasks('Task | 2026-10-05 | 1 | 1'), /earlier task/u);
  assert.throws(() => parseGanttTasks('A | 2026-10-05 | 3\nB | 2026-10-07 | 1 | 1'), /cannot start/u);
});

test('bounds task count, name length, and overall project horizon', () => {
  assert.throws(() => parseGanttTasks(`${'A'.repeat(101)} | 2026-10-05 | 1`), /100 characters/u);
  assert.throws(() => parseGanttTasks(Array.from({ length: 121 }, (_, index) => `Task ${index} | 2026-10-05 | 1`).join('\n')), /120 tasks/u);
  assert.throws(() => parseGanttTasks('A | 2026-10-05 | 1\nB | 2029-10-05 | 1'), /within/u);
});

test('CSV export quotes commas and quotation marks and preserves Unicode', () => {
  const plan = parseGanttTasks('"Design, “mañana”" | 2026-10-05 | 2');
  assert.equal(ganttPlanToCsv(plan), 'Task,Start,Duration (days),Finish,Depends on\r\n"""Design, “mañana”""","2026-10-05","2","2026-10-06",""');
});
