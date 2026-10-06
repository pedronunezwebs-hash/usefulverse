import test from 'node:test';
import assert from 'node:assert/strict';
import { createHabit, habitCalendarDays, habitStats, isHabitDateKey, localDateKey, normalizeHabitName, parseHabitBackup, removeHabit, shiftHabitDate, toggleHabitCheckIn, validateHabitState } from './habit-tracker-logic.mjs';

const today = '2026-10-05';
const empty = { version: 1, habits: [] };

test('habit names normalize whitespace and Unicode and reject empty or excessive names', () => {
  assert.equal(normalizeHabitName('  Café\t水  '), 'Café 水');
  assert.throws(() => normalizeHabitName('  '), /Enter a habit name/u);
  assert.throws(() => normalizeHabitName('x'.repeat(81)), /80 characters/u);
});

test('local date keys and day shifting use calendar dates without UTC day drift', () => {
  assert.equal(isHabitDateKey('2024-02-29'), true);
  assert.equal(isHabitDateKey('2025-02-29'), false);
  assert.equal(shiftHabitDate('2026-03-01', -1), '2026-02-28');
  assert.equal(shiftHabitDate('2026-12-31', 1), '2027-01-01');
  const local = new Date(2026, 9, 5, 0, 15);
  assert.equal(localDateKey(local), '2026-10-05');
  assert.deepEqual(habitCalendarDays(today, 3), ['2026-10-03', '2026-10-04', today]);
});

test('habit creation trims names, keeps Unicode, and rejects duplicates and excess entries', () => {
  const first = createHabit(empty, 'Leer 10 páginas', 'habit-1', today);
  assert.deepEqual(first.habits[0], { id: 'habit-1', name: 'Leer 10 páginas', checkIns: [] });
  assert.throws(() => createHabit(first, '  leer 10 PÁGINAS ', 'habit-2', today), /unique/u);
  const full = { version: 1, habits: Array.from({ length: 20 }, (_, index) => ({ id: `habit-${index}`, name: `Habit ${index}`, checkIns: [] })) };
  assert.throws(() => createHabit(full, 'Another habit', 'habit-21', today), /no more than 20/u);
});

test('check-ins toggle idempotently by calendar date and reject future or unknown dates', () => {
  const state = createHabit(empty, 'Walk', 'walk', today);
  const checked = toggleHabitCheckIn(state, 'walk', today, today);
  assert.deepEqual(checked.habits[0].checkIns, [today]);
  assert.deepEqual(toggleHabitCheckIn(checked, 'walk', today, today).habits[0].checkIns, []);
  assert.throws(() => toggleHabitCheckIn(state, 'walk', '2026-10-06', today), /date/u);
  assert.throws(() => toggleHabitCheckIn(state, 'missing', today, today), /exists/u);
});

test('streak stats handle today incomplete, gaps, and the last 30 calendar days', () => {
  const habit = { id: 'read', name: 'Read', checkIns: ['2026-09-01', '2026-10-02', '2026-10-03', '2026-10-04'] };
  assert.deepEqual(habitStats(habit, today), { completedToday: false, completedLast30Days: 3, currentStreak: 3, bestStreak: 3 });
  const checkedToday = { ...habit, checkIns: [...habit.checkIns, today] };
  assert.deepEqual(habitStats(checkedToday, today), { completedToday: true, completedLast30Days: 4, currentStreak: 4, bestStreak: 4 });
  assert.equal(habitStats({ ...habit, checkIns: ['2026-10-01'] }, today).currentStreak, 0);
});

test('habit backups round-trip, remove safely, and reject corrupt, future, duplicate, and oversized data', () => {
  const habit = { version: 1, habits: [{ id: 'walk', name: 'Caminata 日', checkIns: ['2026-10-03', '2026-10-04'] }] };
  const restored = parseHabitBackup(JSON.stringify(habit), today);
  assert.deepEqual(restored, habit);
  assert.deepEqual(removeHabit(restored, 'walk', today), empty);
  assert.throws(() => parseHabitBackup('{', today), /valid JSON/u);
  assert.throws(() => validateHabitState({ ...habit, habits: [{ ...habit.habits[0], checkIns: ['2026-10-06'] }] }, today), /future/u);
  assert.throws(() => validateHabitState({ ...habit, habits: [...habit.habits, ...habit.habits] }, today), /unique|ID/u);
  assert.throws(() => parseHabitBackup(' '.repeat(1_000_001), today), /1 MB/u);
});
