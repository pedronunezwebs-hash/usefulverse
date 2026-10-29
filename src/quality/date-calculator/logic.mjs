// Civil Gregorian dates, represented at UTC midnight. No local timezone math.
const DAY = 86_400_000;
const fail = code => { throw new RangeError(code); };
export const isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
export const daysInMonth = (year, month) => [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];

function civil(year, month, day) {
  if (!Number.isSafeInteger(year) || year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) fail('DATE_INVALID');
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  if (!Number.isFinite(date.getTime())) fail('DATE_RANGE');
  return date;
}
export function parseCivil(value) {
  if (typeof value !== 'string' || !/^\d{4,6}-\d{2}-\d{2}$/u.test(value)) fail('DATE_INVALID');
  const [year, month, day] = value.split('-').map(Number);
  return civil(year, month, day);
}
export function isoCivil(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()) || date.getUTCFullYear() < 1) fail('DATE_RANGE');
  return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}
function integer(value) {
  if (value === '' || value === undefined) return 0;
  if ((typeof value !== 'number' && typeof value !== 'string') || typeof value === 'string' && !/^\d+$/u.test(value)) fail('OFFSET_INTEGER');
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) fail('OFFSET_INTEGER');
  return number;
}
export function shiftCivil(start, units = {}, direction = 1, overflow = 'constrain') {
  if (![1, -1].includes(direction) || !['constrain', 'reject'].includes(overflow)) fail('OPTIONS_INVALID');
  const base = parseCivil(start);
  const years = integer(units.years), months = integer(units.months), weeks = integer(units.weeks), days = integer(units.days);
  const monthOffset = years * 12 + months, dayOffset = weeks * 7 + days;
  if (!Number.isSafeInteger(monthOffset) || !Number.isSafeInteger(dayOffset)) fail('DATE_RANGE');
  const index = base.getUTCFullYear() * 12 + base.getUTCMonth() + direction * monthOffset;
  const targetYear = Math.floor(index / 12), targetMonth = ((index % 12) + 12) % 12 + 1;
  const lastDay = daysInMonth(targetYear, targetMonth), sourceDay = base.getUTCDate();
  if (overflow === 'reject' && sourceDay > lastDay) fail('MONTH_END');
  const anchor = civil(targetYear, targetMonth, Math.min(sourceDay, lastDay));
  const result = new Date(anchor.getTime() + direction * dayOffset * DAY);
  const iso = isoCivil(result);
  return { iso, clipped: sourceDay > lastDay, weekday: result.getUTCDay() };
}
export function betweenCivil(start, end, inclusive = false) {
  if (typeof inclusive !== 'boolean') fail('OPTIONS_INVALID');
  const a = parseCivil(start), b = parseCivil(end), signedDays = Math.round((b - a) / DAY);
  const lower = a <= b ? a : b, upper = a <= b ? b : a;
  const low = isoCivil(lower);
  let months = (upper.getUTCFullYear() - lower.getUTCFullYear()) * 12 + upper.getUTCMonth() - lower.getUTCMonth();
  let anchor;
  // At the Date ceiling, the first same-month anchor can exceed its final day.
  try { anchor = parseCivil(shiftCivil(low, { months }).iso); } catch (error) { if (error.message !== 'DATE_RANGE') throw error; months--; }
  if (!anchor || anchor > upper) { if (anchor) months--; anchor = parseCivil(shiftCivil(low, { months }).iso); }
  const period = { years: Math.floor(months / 12), months: months % 12, days: Math.round((upper - anchor) / DAY) };
  const days = Math.abs(signedDays) + Number(inclusive);
  return { days, signedDays, weeks: Math.floor(days / 7), remainder: days % 7, period, reversed: signedDays < 0 };
}
export function longDate(value, locale = 'en') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' }).format(parseCivil(value));
}
export function localToday(now = new Date()) {
  return `${String(now.getFullYear()).padStart(4, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function stateFromURL(search) {
  const q = new URLSearchParams(search), mode = q.get('mode') ?? 'between';
  if (!['between', 'shift'].includes(mode)) fail('OPTIONS_INVALID');
  if (!q.has('start')) return null;
  const start = q.get('start'); parseCivil(start);
  if (mode === 'between') {
    const end = q.get('end'); parseCivil(end);
    const inclusive = q.get('inclusive') ?? '0'; if (!['0', '1'].includes(inclusive)) fail('OPTIONS_INVALID');
    return { mode, start, end, inclusive: inclusive === '1' };
  }
  const direction = q.get('direction') === 'subtract' ? -1 : q.get('direction') === 'add' || !q.has('direction') ? 1 : fail('OPTIONS_INVALID');
  const overflow = q.get('overflow') ?? 'constrain';
  const units = Object.fromEntries(['years', 'months', 'weeks', 'days'].map(key => [key, integer(q.get(key) ?? '0')]));
  shiftCivil(start, units, direction, overflow);
  return { mode, start, units, direction, overflow };
}
export function stateToURL(state) {
  if (!['between','shift'].includes(state.mode)) fail('OPTIONS_INVALID');
  const q = new URLSearchParams({ mode: state.mode, start: state.start });
  if (state.mode === 'between') { betweenCivil(state.start, state.end, state.inclusive); q.set('end', state.end); if (state.inclusive) q.set('inclusive', '1'); }
  else { shiftCivil(state.start, state.units, state.direction, state.overflow); q.set('direction', state.direction === -1 ? 'subtract' : 'add'); for (const [key, value] of Object.entries(state.units)) if (Number(value)) q.set(key, String(value)); if (state.overflow === 'reject') q.set('overflow', 'reject'); }
  return '?' + q;
}
