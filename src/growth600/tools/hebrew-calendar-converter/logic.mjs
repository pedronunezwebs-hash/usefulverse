const DAY_MS = 86_400_000;
const MIN_GREGORIAN_YEAR = 1;
const MAX_GREGORIAN_YEAR = 9999;
const COMMON_MONTHS = Object.freeze(['tishri', 'heshvan', 'kislev', 'tevet', 'shevat', 'adar', 'nisan', 'iyar', 'sivan', 'tammuz', 'av', 'elul']);
const LEAP_MONTHS = Object.freeze(['tishri', 'heshvan', 'kislev', 'tevet', 'shevat', 'adarI', 'adarII', 'nisan', 'iyar', 'sivan', 'tammuz', 'av', 'elul']);
const MONTH_KEYS = new Map([
  ['tishri', 'tishri'], ['tishrei', 'tishri'],
  ['heshvan', 'heshvan'], ['cheshvan', 'heshvan'], ['marcheshvan', 'heshvan'], ['marheshvan', 'heshvan'],
  ['kislev', 'kislev'], ['tevet', 'tevet'], ['tebeth', 'tevet'],
  ['shevat', 'shevat'], ['shvat', 'shevat'], ['shebat', 'shevat'],
  ['adar', 'adar'], ['adari', 'adarI'], ['adar1', 'adarI'], ['adaraleph', 'adarI'], ['adarfirst', 'adarI'],
  ['adarii', 'adarII'], ['adar2', 'adarII'], ['adarbet', 'adarII'], ['adarsecond', 'adarII'],
  ['nisan', 'nisan'], ['iyyar', 'iyar'], ['iyar', 'iyar'], ['sivan', 'sivan'],
  ['tammuz', 'tammuz'], ['tamuz', 'tammuz'], ['av', 'av'], ['ab', 'av'], ['elul', 'elul'],
]);

const hebrewFormatter = new Intl.DateTimeFormat('en-u-ca-hebrew-nu-latn', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});
const hasHebrewCalendar = hebrewFormatter.resolvedOptions().calendar === 'hebrew';

function assertHebrewCalendar() {
  if (!hasHebrewCalendar) throw new Error('This browser does not provide the Hebrew calendar through Intl.DateTimeFormat.');
}

function integer(value, name, min, max) {
  const parsed = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new RangeError(`${name} is outside the supported range.`);
  return parsed;
}

function gregorianDate(year, month, day) {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError('Enter a valid Gregorian date.');
  }
  return date;
}

function monthList(year) {
  return isHebrewLeapYear(year) ? LEAP_MONTHS : COMMON_MONTHS;
}

export function isHebrewLeapYear(value) {
  const year = integer(value, 'Hebrew year', 1, 15_000);
  return (7 * year + 1) % 19 < 7;
}

function hebrewParts(date) {
  assertHebrewCalendar();
  const parts = Object.fromEntries(hebrewFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  const year = Number(parts.year?.replaceAll(',', ''));
  const day = Number(parts.day?.replaceAll(',', ''));
  const monthKey = MONTH_KEYS.get((parts.month ?? '').toLocaleLowerCase('en').replace(/[^a-z0-9]/gu, ''));
  if (!Number.isInteger(year) || !Number.isInteger(day) || !monthKey) throw new Error('The browser returned an unsupported Hebrew calendar date.');
  const month = monthList(year).indexOf(monthKey) + 1;
  if (month < 1) throw new Error('The browser returned an inconsistent Hebrew calendar month.');
  return Object.freeze({ year, month, day, monthKey });
}

function gregorianSerial(year, month, day) {
  return Math.floor(gregorianDate(year, month, day).getTime() / DAY_MS);
}

function hebrewAtSerial(serial) {
  return hebrewParts(new Date(serial * DAY_MS));
}

function compareDate(a, b) {
  return a.year - b.year || a.month - b.month || a.day - b.day;
}

const MIN_SERIAL = gregorianSerial(MIN_GREGORIAN_YEAR, 1, 1);
const MAX_SERIAL = gregorianSerial(MAX_GREGORIAN_YEAR, 12, 31);

export function gregorianToHebrew({ year, month, day } = {}) {
  const gregorianYear = integer(year, 'Gregorian year', MIN_GREGORIAN_YEAR, MAX_GREGORIAN_YEAR);
  const gregorianMonth = integer(month, 'Gregorian month', 1, 12);
  const gregorianDay = integer(day, 'Gregorian day', 1, 31);
  const result = hebrewParts(gregorianDate(gregorianYear, gregorianMonth, gregorianDay));
  return Object.freeze({ ...result, leapYear: isHebrewLeapYear(result.year) });
}

export function hebrewToGregorian({ year, month, day } = {}) {
  const hebrewYear = integer(year, 'Hebrew year', 1, 15_000);
  const monthCount = monthList(hebrewYear).length;
  const hebrewMonth = integer(month, 'Hebrew month', 1, monthCount);
  const hebrewDay = integer(day, 'Hebrew day', 1, 30);
  const target = { year: hebrewYear, month: hebrewMonth, day: hebrewDay };
  let low = MIN_SERIAL;
  let high = MAX_SERIAL;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (compareDate(hebrewAtSerial(middle), target) < 0) low = middle + 1;
    else high = middle;
  }
  const found = hebrewAtSerial(low);
  if (compareDate(found, target) !== 0) throw new RangeError('That Hebrew date does not exist or is outside Gregorian years 1–9999.');
  const date = new Date(low * DAY_MS);
  return Object.freeze({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
}

export const HEBREW_CALENDAR_METHOD = 'Hebrew calendar dates are read from this browser’s built-in Intl calendar. The result is the civil Gregorian date; a Hebrew date begins at sunset.';
