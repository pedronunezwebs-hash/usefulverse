import assert from 'node:assert/strict';
import test from 'node:test';
import { addWeeklyBlock, createWeeklyBlock, exportWeeklyPlan, findWeeklyOverlaps, importWeeklyPlan, removeWeeklyBlock } from './logic.mjs';

const block = (id, day, start, end, title = id) => createWeeklyBlock({ day, start, end, title, category: 'work' }, id);

test('creates bounded weekly blocks and correctly represents overnight duration', () => {
  const night = block('night', 1, '22:00', '06:00');
  assert.equal(night.overnight, true);
  assert.equal(night.durationMinutes, 480);
  assert.equal(addWeeklyBlock([], { day: 2, start: '09:00', end: '10:00', title: 'Focus', category: 'study' })[0].id, 'block-1');
});

test('flags same-day, overnight, and Sunday-to-Monday overlaps but not adjacent blocks', () => {
  const plan = [block('a', 1, '09:00', '10:00'), block('b', 1, '10:00', '11:00'), block('c', 1, '09:30', '10:30'), block('night', 0, '23:00', '02:00'), block('early', 1, '01:00', '03:00')];
  const overlaps = findWeeklyOverlaps(plan);
  assert.ok(overlaps.some(({ blockIds }) => blockIds.join(',') === 'a,c'));
  assert.ok(overlaps.some(({ blockIds }) => blockIds.join(',') === 'b,c'));
  assert.ok(overlaps.some(({ blockIds }) => blockIds.join(',') === 'early,night'));
  assert.equal(overlaps.some(({ blockIds }) => blockIds.join(',') === 'a,b'), false);
});

test('validates block fields, duration, count and category', () => {
  assert.throws(() => block('x', 7, '09:00', '10:00'), /day/u);
  assert.throws(() => block('x', 1, '25:00', '10:00'), /24-hour/u);
  assert.throws(() => block('x', 1, '09:00', '09:00'), /18 hours/u);
  assert.throws(() => block('x', 1, '09:00', '04:00'), /18 hours/u);
  assert.throws(() => createWeeklyBlock({ day: 1, start: '09:00', end: '10:00', title: 'x', category: 'unknown' }, 'x'), /category/u);
  assert.throws(() => addWeeklyBlock(Array.from({ length: 100 }, (_, index) => block(`b${index}`, 0, '09:00', '09:30')), { day: 0, start: '10:00', end: '10:30', title: 'Extra' }), /100/u);
});

test('exports and validates bounded JSON backups without changing the in-memory plan', () => {
  const source = [block('a', 6, '23:00', '01:00', 'Sunday night')];
  const restored = importWeeklyPlan(exportWeeklyPlan(source));
  assert.equal(restored[0].title, 'Sunday night');
  assert.equal(restored[0].day, 6);
  assert.equal(restored[0].durationMinutes, 120);
  assert.throws(() => importWeeklyPlan('{'), /valid JSON/u);
  assert.throws(() => importWeeklyPlan(JSON.stringify({ schema: 'other', version: 1, blocks: [] })), /supported/u);
  assert.equal(removeWeeklyBlock(source, 'a').length, 0);
});
