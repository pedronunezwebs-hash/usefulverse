import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWeekNumber } from './logic.mjs';

test('ISO week uses the ISO week-year and spans civil-year boundaries correctly', () => {
  const result = calculateWeekNumber({ date: '2021-01-01' });
  assert.equal(result.week, 53);
  assert.equal(result.weekYear, 2020);
  assert.equal(result.weekStart.toISOString().slice(0, 10), '2020-12-28');
  assert.equal(result.weekEnd.toISOString().slice(0, 10), '2021-01-03');
  assert.equal(calculateWeekNumber({ date: '2021-01-04' }).week, 1);
});

test('custom week starts use week 1 containing January 1, and identify their rule', () => {
  const sunday = calculateWeekNumber({ date: '2021-01-01', mode: 'custom', weekStart: 'sunday' });
  assert.equal(sunday.week, 1);
  assert.equal(sunday.weekStart.toISOString().slice(0, 10), '2020-12-27');
  assert.equal(sunday.weekEnd.toISOString().slice(0, 10), '2021-01-02');
  const saturday = calculateWeekNumber({ date: '2021-01-01', mode: 'custom', weekStart: 'saturday' });
  assert.equal(saturday.weekStart.toISOString().slice(0, 10), '2020-12-26');
  assert.equal(saturday.week, 1);
});

test('date parsing rejects impossible and unsupported week inputs', () => {
  assert.throws(() => calculateWeekNumber({ date: '2023-02-29' }), /valid calendar date/u);
  assert.throws(() => calculateWeekNumber({ date: '2021-2-01' }), /valid calendar date/u);
  assert.throws(() => calculateWeekNumber({ date: '2021-01-01', mode: 'fiscal' }), /Choose ISO/u);
  assert.throws(() => calculateWeekNumber({ date: '2021-01-01', mode: 'custom', weekStart: 'tuesday' }), /Sunday/u);
});
