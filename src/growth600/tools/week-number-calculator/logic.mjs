const WEEKDAY_OFFSETS = Object.freeze({ sunday: 0, monday: 1, saturday: 6 });

function parseCivilDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) throw new TypeError('Enter a valid calendar date.');
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError('Enter a valid calendar date.');
  return date;
}

function startOfWeek(date, startDay) {
  const result = new Date(date);
  const offset = (date.getUTCDay() - startDay + 7) % 7;
  result.setUTCDate(result.getUTCDate() - offset);
  return result;
}

function isoWeek(date) {
  const thursday = new Date(date);
  thursday.setUTCDate(date.getUTCDate() + 3 - ((date.getUTCDay() + 6) % 7));
  const weekYear = thursday.getUTCFullYear();
  const firstThursday = new Date(0);
  firstThursday.setUTCHours(0, 0, 0, 0);
  firstThursday.setUTCFullYear(weekYear, 0, 4);
  const firstWeekMonday = startOfWeek(firstThursday, 1);
  const weekStart = startOfWeek(date, 1);
  return { week: Math.floor((weekStart - firstWeekMonday) / 604_800_000) + 1, weekYear, weekStart };
}

export function calculateWeekNumber({ date: input, mode = 'iso', weekStart = 'sunday' } = {}) {
  const date = parseCivilDate(input);
  if (mode === 'iso') {
    const result = isoWeek(date);
    const weekEnd = new Date(result.weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    return Object.freeze({ ...result, weekEnd, mode: 'iso', calendarYear: date.getUTCFullYear(), weekStartDay: 'monday' });
  }
  if (mode !== 'custom') throw new TypeError('Choose ISO 8601 or a supported calendar-week system.');
  if (!Object.hasOwn(WEEKDAY_OFFSETS, weekStart)) throw new TypeError('Choose Sunday, Monday, or Saturday as the first day of the week.');

  const startDay = WEEKDAY_OFFSETS[weekStart];
  const currentWeekStart = startOfWeek(date, startDay);
  const janFirst = new Date(0);
  janFirst.setUTCHours(0, 0, 0, 0);
  janFirst.setUTCFullYear(date.getUTCFullYear(), 0, 1);
  const firstWeekStart = startOfWeek(janFirst, startDay);
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  return Object.freeze({
    week: Math.floor((currentWeekStart - firstWeekStart) / 604_800_000) + 1,
    weekYear: date.getUTCFullYear(),
    calendarYear: date.getUTCFullYear(),
    weekStart: currentWeekStart,
    weekEnd,
    mode: 'custom',
    weekStartDay: weekStart,
  });
}
