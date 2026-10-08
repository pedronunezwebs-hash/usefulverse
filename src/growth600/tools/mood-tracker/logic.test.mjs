import assert from 'node:assert/strict';
import test from 'node:test';
import { createMoodEntry, getMoodCalendar, getMoodSummary, removeMoodEntry, restoreMoodLog, upsertMoodEntry } from './logic.mjs';

const entry = (date, mood, tags = [], note = '') => createMoodEntry({ date, mood, tags, note });

test('check-ins are normalized and one entry per date is updated rather than duplicated', () => {
  let entries = upsertMoodEntry([], entry('2026-10-08', 3, ['calm', 'focused', 'calm'], '  A note  '));
  assert.deepEqual(entries[0], { date: '2026-10-08', mood: 3, tags: ['calm', 'focused'], note: 'A note' });
  entries = upsertMoodEntry(entries, entry('2026-10-08', 4, ['hopeful']));
  assert.equal(entries.length, 1);
  assert.equal(entries[0].mood, 4);
});

test('dates, mood scale, tags and note length are validated', () => {
  for (const date of ['2026-02-29', '2026-13-01', '8 October 2026']) assert.throws(() => entry(date, 3));
  for (const date of ['1899-12-31', '2101-01-01']) assert.throws(() => entry(date, 3));
  for (const mood of [0, 6, 2.5, 'bad']) assert.throws(() => entry('2026-10-08', mood));
  assert.throws(() => entry('2026-10-08', 2, ['diagnosis']));
  assert.throws(() => entry('2026-10-08', 2, [], 'x'.repeat(501)));
});

test('calendar spans complete weeks and includes dated saved check-ins', () => {
  const entries = [entry('2026-10-04', 5, ['happy'])];
  const days = getMoodCalendar(entries, 2026, 9);
  assert.equal(days.length % 7, 0);
  assert.equal(days.filter(Boolean).length, 31);
  assert.deepEqual(days.find((cell) => cell?.date === '2026-10-04').entry, entries[0]);
  assert.equal(days[0], null);
});

test('weekly summary only describes entered days and returns a transparent distribution', () => {
  const entries = [entry('2026-10-02', 2), entry('2026-10-08', 4), entry('2026-09-30', 5)];
  const summary = getMoodSummary(entries, '2026-10-08');
  assert.equal(summary.count, 2);
  assert.equal(summary.average, 3);
  assert.deepEqual(summary.distribution, [0, 1, 0, 1, 0]);
  assert.equal(getMoodSummary(entries, '2026-10-01').count, 1);
});

test('backup round-trip, duplicate rejection and deletion are safe', () => {
  const entries = upsertMoodEntry([], entry('2026-10-08', 3, ['tired'], 'Private note'));
  assert.deepEqual(restoreMoodLog(JSON.parse(JSON.stringify({ schemaVersion: 1, entries }))), { schemaVersion: 1, entries });
  assert.throws(() => restoreMoodLog({ schemaVersion: 1, entries: [...entries, ...entries] }), /duplicate dates/u);
  assert.throws(() => restoreMoodLog({ schemaVersion: 2, entries }), /supported/u);
  assert.deepEqual(removeMoodEntry(entries, '2026-10-08'), []);
});
