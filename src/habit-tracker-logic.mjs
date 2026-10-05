const MAX_HABITS = 20;
const MAX_NAME_LENGTH = 80;
const MAX_CHECK_INS = 3650;
const DAY_MS = 86_400_000;

export function localDateKey(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) throw new TypeError('Choose a valid date.');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isHabitDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function shiftHabitDate(value, offset) {
  if (!isHabitDateKey(value) || !Number.isSafeInteger(offset)) throw new TypeError('Choose a valid calendar date and whole-day offset.');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + offset));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function normalizeHabitName(value) {
  if (typeof value !== 'string') throw new TypeError('Enter a habit name.');
  const name = value.normalize('NFC').trim().replace(/\s+/gu, ' ');
  const length = Array.from(name).length;
  if (!length) throw new TypeError('Enter a habit name.');
  if (length > MAX_NAME_LENGTH) throw new RangeError('Habit names must be 80 characters or fewer.');
  return name;
}

export function validateHabitState(value, today = localDateKey()) {
  if (!isHabitDateKey(today) || !value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 || !Array.isArray(value.habits)) {
    throw new TypeError('This is not a supported habit-tracker backup.');
  }
  if (value.habits.length > MAX_HABITS) throw new RangeError(`Use no more than ${MAX_HABITS} habits.`);
  const ids = new Set();
  const names = new Set();
  const habits = value.habits.map((habit) => {
    if (!habit || typeof habit !== 'object' || Array.isArray(habit) || typeof habit.id !== 'string' || !/^[\w-]{1,80}$/u.test(habit.id) || !Array.isArray(habit.checkIns)) {
      throw new TypeError('A saved habit is not valid.');
    }
    if (ids.has(habit.id)) throw new TypeError('Saved habit IDs must be unique.');
    ids.add(habit.id);
    const name = normalizeHabitName(habit.name);
    const normalizedName = name.toLocaleLowerCase();
    if (names.has(normalizedName)) throw new TypeError('Habit names must be unique.');
    names.add(normalizedName);
    if (habit.checkIns.length > MAX_CHECK_INS) throw new RangeError('This habit has too many saved days.');
    const checkIns = new Set();
    for (const date of habit.checkIns) {
      if (!isHabitDateKey(date) || date > today) throw new TypeError('Saved check-in dates must be valid and cannot be in the future.');
      checkIns.add(date);
    }
    return { id: habit.id, name, checkIns: [...checkIns].sort() };
  });
  return { version: 1, habits };
}

export function createHabit(state, name, id, today = localDateKey()) {
  const current = validateHabitState(state, today);
  const cleanName = normalizeHabitName(name);
  if (current.habits.length >= MAX_HABITS) throw new RangeError(`Use no more than ${MAX_HABITS} habits.`);
  if (current.habits.some((habit) => habit.name.toLocaleLowerCase() === cleanName.toLocaleLowerCase())) throw new TypeError('Habit names must be unique.');
  if (typeof id !== 'string' || !/^[\w-]{1,80}$/u.test(id) || current.habits.some((habit) => habit.id === id)) throw new TypeError('A unique habit ID is required.');
  return { version: 1, habits: [...current.habits, { id, name: cleanName, checkIns: [] }] };
}

export function toggleHabitCheckIn(state, habitId, date = localDateKey(), today = localDateKey()) {
  const current = validateHabitState(state, today);
  if (!isHabitDateKey(date) || date > today || date < shiftHabitDate(today, -(MAX_CHECK_INS - 1))) throw new TypeError('Choose a date within the last ten years.');
  let found = false;
  const habits = current.habits.map((habit) => {
    if (habit.id !== habitId) return habit;
    found = true;
    const checkIns = new Set(habit.checkIns);
    if (checkIns.has(date)) checkIns.delete(date);
    else checkIns.add(date);
    return { ...habit, checkIns: [...checkIns].sort() };
  });
  if (!found) throw new TypeError('Choose a habit that exists.');
  return { version: 1, habits };
}

export function removeHabit(state, habitId, today = localDateKey()) {
  const current = validateHabitState(state, today);
  if (!current.habits.some((habit) => habit.id === habitId)) throw new TypeError('Choose a habit that exists.');
  return { version: 1, habits: current.habits.filter((habit) => habit.id !== habitId) };
}

export function habitCalendarDays(today = localDateKey(), count = 35) {
  if (!isHabitDateKey(today) || !Number.isSafeInteger(count) || count < 1 || count > 366) throw new TypeError('Choose a valid calendar range.');
  return Array.from({ length: count }, (_, index) => shiftHabitDate(today, index - count + 1));
}

export function habitStats(habit, today = localDateKey()) {
  if (!habit || !isHabitDateKey(today) || !Array.isArray(habit.checkIns)) throw new TypeError('Choose a valid habit and date.');
  const days = new Set(habit.checkIns.filter(isHabitDateKey));
  let completedLast30Days = 0;
  for (let offset = 0; offset > -30; offset -= 1) if (days.has(shiftHabitDate(today, offset))) completedLast30Days += 1;

  let currentStreak = 0;
  let cursor = days.has(today) ? today : shiftHabitDate(today, -1);
  while (days.has(cursor)) {
    currentStreak += 1;
    cursor = shiftHabitDate(cursor, -1);
  }

  let bestStreak = 0;
  let streak = 0;
  let previous = '';
  for (const date of [...days].sort()) {
    streak = previous && shiftHabitDate(previous, 1) === date ? streak + 1 : 1;
    bestStreak = Math.max(bestStreak, streak);
    previous = date;
  }
  return { completedToday: days.has(today), completedLast30Days, currentStreak, bestStreak };
}

export function parseHabitBackup(text, today = localDateKey()) {
  if (typeof text !== 'string' || text.length > 1_000_000) throw new RangeError('Choose a backup smaller than 1 MB.');
  try { return validateHabitState(JSON.parse(text), today); }
  catch (error) {
    if (error instanceof SyntaxError) throw new TypeError('This file is not valid JSON.');
    throw error;
  }
}
