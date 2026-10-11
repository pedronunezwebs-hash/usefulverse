const DAY_MS = 86_400_000;
const MIN_JD = 1_721_425.5; // 0001-01-01 00:00 UTC, proleptic Gregorian
const MAX_JD_EXCLUSIVE = 5_373_484.5; // 10000-01-01 00:00 UTC

function bounded(name, value, min, maxExclusive) {
  if (typeof value === 'boolean' || value === null || value === '' || !Number.isFinite(Number(value))) throw new TypeError(`${name} must be a finite number.`);
  const number = Number(value);
  if (number < min || number >= maxExclusive) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function gregorianJdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function parseUtcDateTime(value) {
  if (typeof value !== 'string') throw new TypeError('UTC date and time must be text.');
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?Z?$/u.exec(value);
  if (!match) throw new TypeError('Enter UTC as YYYY-MM-DDTHH:mm:ss.sss (the Z suffix is optional).');
  const [, yearText, monthText, dayText, hourText, minuteText, secondText = '0', fractionText = '0'] = match;
  const year = Number(yearText); const month = Number(monthText); const day = Number(dayText);
  const hour = Number(hourText); const minute = Number(minuteText); const second = Number(secondText);
  const millisecond = Number(fractionText.padEnd(3, '0'));
  if (year < 1 || month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) throw new RangeError('Use a valid Gregorian UTC date and time; leap seconds are not supported.');
  const monthLength = [31, ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (day < 1 || day > monthLength) throw new RangeError('Use a valid Gregorian UTC date and time.');
  return { year, month, day, hour, minute, second, millisecond };
}

function gregorianFromJdn(jdn) {
  let l = jdn + 68569;
  const n = Math.floor(4 * l / 146097);
  l -= Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (l + 1) / 1461001);
  l -= Math.floor(1461 * i / 4) - 31;
  const j = Math.floor(80 * l / 2447);
  const day = l - Math.floor(2447 * j / 80);
  l = Math.floor(j / 11);
  const month = j + 2 - 12 * l;
  const year = 100 * (n - 49) + i + l;
  if (year < 1 || year > 9999) throw new RangeError('The resulting date must be between years 0001 and 9999.');
  return { year, month, day };
}

function formatUtc(date) {
  const pad = (value, width = 2) => String(value).padStart(width, '0');
  return `${pad(date.year, 4)}-${pad(date.month)}-${pad(date.day)}T${pad(date.hour)}:${pad(date.minute)}:${pad(date.second)}.${pad(date.millisecond, 3)}Z`;
}

export function utcToJulianDate(value) {
  const date = parseUtcDateTime(value);
  const dayFraction = (date.hour * 3_600_000 + date.minute * 60_000 + date.second * 1_000 + date.millisecond) / DAY_MS;
  const jd = gregorianJdn(date.year, date.month, date.day) - 0.5 + dayFraction;
  return Object.freeze({ jd, mjd: jd - 2_400_000.5, dayFraction, calendar: 'proleptic-gregorian', timeScale: 'UTC' });
}

export function julianDateToUtc({ value, kind = 'jd' } = {}) {
  if (!['jd', 'mjd'].includes(kind)) throw new TypeError('Choose Julian Date (JD) or Modified Julian Date (MJD).');
  const jd = kind === 'mjd'
    ? bounded('MJD', value, MIN_JD - 2_400_000.5, MAX_JD_EXCLUSIVE - 2_400_000.5) + 2_400_000.5
    : bounded('JD', value, MIN_JD, MAX_JD_EXCLUSIVE);
  let jdn = Math.floor(jd + 0.5);
  let milliseconds = Math.round((jd + 0.5 - jdn) * DAY_MS);
  if (milliseconds >= DAY_MS) { jdn += 1; milliseconds -= DAY_MS; }
  if (milliseconds < 0) { jdn -= 1; milliseconds += DAY_MS; }
  const civil = gregorianFromJdn(jdn);
  const hour = Math.floor(milliseconds / 3_600_000);
  milliseconds -= hour * 3_600_000;
  const minute = Math.floor(milliseconds / 60_000);
  milliseconds -= minute * 60_000;
  const second = Math.floor(milliseconds / 1_000);
  const millisecond = milliseconds - second * 1_000;
  const utc = formatUtc({ ...civil, hour, minute, second, millisecond });
  const normalized = utcToJulianDate(utc);
  return Object.freeze({ utc, jd: normalized.jd, mjd: normalized.mjd, calendar: 'proleptic-gregorian', timeScale: 'UTC', precisionMilliseconds: 1 });
}
