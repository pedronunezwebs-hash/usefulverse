const DAY_MS = 86_400_000;
const GREGORIAN_EPOCH = Math.floor(Date.UTC(622, 6, 19) / DAY_MS);
const MAX_GREGORIAN_YEAR = 9999;
const MAX_HIJRI_YEAR = 10000;
const LEAP_REMAINDERS = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29]);

function integer(value, name, min, max) {
  const parsed = typeof value === 'number' ? value : Number(String(value).trim());
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) throw new RangeError(`${name} is outside the supported range.`);
  return parsed;
}

function hijriLeap(year) {
  return LEAP_REMAINDERS.has(year % 30 || 30);
}

function daysBeforeHijriYear(year) {
  return 354 * (year - 1) + Math.floor((3 + 11 * year) / 30);
}

function hijriMonthStart(month) {
  return Math.floor((59 * (month - 1) + 1) / 2);
}

function daysInHijriMonth(year, month) {
  return month === 12 && hijriLeap(year) ? 30 : month % 2 === 1 ? 30 : 29;
}

function gregorianSerial({ year, month, day }) {
  const y = integer(year, 'Gregorian year', 622, MAX_GREGORIAN_YEAR);
  const m = integer(month, 'Gregorian month', 1, 12);
  const d = integer(day, 'Gregorian day', 1, 31);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) throw new RangeError('Enter a valid Gregorian date.');
  return Math.floor(date.getTime() / DAY_MS);
}

export function gregorianToHijri({ year, month, day } = {}) {
  const serial = gregorianSerial({ year, month, day });
  let offset = serial - GREGORIAN_EPOCH;
  if (offset < 0) throw new RangeError('Date is before the supported Hijri epoch.');
  let hijriYear = Math.floor((offset * 30) / 10631) + 1;
  hijriYear = Math.max(1, Math.min(MAX_HIJRI_YEAR, hijriYear));
  while (hijriYear < MAX_HIJRI_YEAR && daysBeforeHijriYear(hijriYear + 1) <= offset) hijriYear += 1;
  while (daysBeforeHijriYear(hijriYear) > offset) hijriYear -= 1;
  offset -= daysBeforeHijriYear(hijriYear);
  let hijriMonth = 1;
  while (hijriMonth < 12) {
    const nextStart = hijriMonthStart(hijriMonth + 1);
    if (nextStart > offset) break;
    hijriMonth += 1;
  }
  const hijriDay = offset - hijriMonthStart(hijriMonth) + 1;
  if (hijriYear > MAX_HIJRI_YEAR || hijriDay > daysInHijriMonth(hijriYear, hijriMonth)) throw new RangeError('Date is outside the supported Hijri range.');
  return Object.freeze({ year: hijriYear, month: hijriMonth, day: hijriDay });
}

export function hijriToGregorian({ year, month, day } = {}) {
  const hijriYear = integer(year, 'Hijri year', 1, MAX_HIJRI_YEAR);
  const hijriMonth = integer(month, 'Hijri month', 1, 12);
  const hijriDay = integer(day, 'Hijri day', 1, daysInHijriMonth(hijriYear, hijriMonth));
  const serial = GREGORIAN_EPOCH + daysBeforeHijriYear(hijriYear) + hijriMonthStart(hijriMonth) + hijriDay - 1;
  const date = new Date(serial * DAY_MS);
  const result = Object.freeze({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });
  if (result.year < 622 || result.year > MAX_GREGORIAN_YEAR) throw new RangeError('Date is outside the supported Gregorian range.');
  return result;
}

export function isHijriLeapYear(year) {
  return hijriLeap(integer(year, 'Hijri year', 1, MAX_HIJRI_YEAR));
}

export const HIJRI_METHOD = 'Tabular Islamic civil calendar (30-year arithmetic cycle; not a moon-sighting calendar).';
