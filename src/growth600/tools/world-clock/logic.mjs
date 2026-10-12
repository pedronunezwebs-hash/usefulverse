export const MAX_WORLD_CLOCKS = 8;

export const WORLD_CLOCK_ZONES = Object.freeze([
  Object.freeze({ id: 'America/Los_Angeles', city: 'Los Angeles', country: 'US' }),
  Object.freeze({ id: 'America/Denver', city: 'Denver', country: 'US' }),
  Object.freeze({ id: 'America/Chicago', city: 'Chicago', country: 'US' }),
  Object.freeze({ id: 'America/New_York', city: 'New York', country: 'US' }),
  Object.freeze({ id: 'America/Toronto', city: 'Toronto', country: 'CA' }),
  Object.freeze({ id: 'America/Vancouver', city: 'Vancouver', country: 'CA' }),
  Object.freeze({ id: 'America/Mexico_City', city: 'Mexico City', country: 'MX' }),
  Object.freeze({ id: 'America/Sao_Paulo', city: 'São Paulo', country: 'BR' }),
  Object.freeze({ id: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'AR' }),
  Object.freeze({ id: 'Europe/London', city: 'London', country: 'GB' }),
  Object.freeze({ id: 'Europe/Paris', city: 'Paris', country: 'FR' }),
  Object.freeze({ id: 'Europe/Berlin', city: 'Berlin', country: 'DE' }),
  Object.freeze({ id: 'Europe/Madrid', city: 'Madrid', country: 'ES' }),
  Object.freeze({ id: 'Europe/Rome', city: 'Rome', country: 'IT' }),
  Object.freeze({ id: 'Europe/Istanbul', city: 'Istanbul', country: 'TR' }),
  Object.freeze({ id: 'Africa/Johannesburg', city: 'Johannesburg', country: 'ZA' }),
  Object.freeze({ id: 'Africa/Lagos', city: 'Lagos', country: 'NG' }),
  Object.freeze({ id: 'Asia/Dubai', city: 'Dubai', country: 'AE' }),
  Object.freeze({ id: 'Asia/Karachi', city: 'Karachi', country: 'PK' }),
  Object.freeze({ id: 'Asia/Kolkata', city: 'New Delhi', country: 'IN' }),
  Object.freeze({ id: 'Asia/Dhaka', city: 'Dhaka', country: 'BD' }),
  Object.freeze({ id: 'Asia/Bangkok', city: 'Bangkok', country: 'TH' }),
  Object.freeze({ id: 'Asia/Singapore', city: 'Singapore', country: 'SG' }),
  Object.freeze({ id: 'Asia/Shanghai', city: 'Shanghai', country: 'CN' }),
  Object.freeze({ id: 'Asia/Tokyo', city: 'Tokyo', country: 'JP' }),
  Object.freeze({ id: 'Asia/Seoul', city: 'Seoul', country: 'KR' }),
  Object.freeze({ id: 'Australia/Sydney', city: 'Sydney', country: 'AU' }),
  Object.freeze({ id: 'Pacific/Auckland', city: 'Auckland', country: 'NZ' }),
  Object.freeze({ id: 'UTC', city: 'UTC', country: '' }),
]);

function isValidZone(zone) {
  if (typeof zone !== 'string' || !zone.trim()) return false;
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone }).format(0);
    return true;
  } catch { return false; }
}

export function normalizeWorldClockZones(values, localZone = 'UTC') {
  if (!Array.isArray(values)) throw new TypeError('World-clock zones must be an array.');
  if (!isValidZone(localZone)) localZone = 'UTC';
  const zones = [localZone];
  for (const value of values) {
    if (typeof value !== 'string' || !isValidZone(value)) throw new RangeError('Choose a supported time zone.');
    if (!zones.includes(value)) zones.push(value);
    if (zones.length > MAX_WORLD_CLOCKS) throw new RangeError(`Choose no more than ${MAX_WORLD_CLOCKS} clocks.`);
  }
  return Object.freeze(zones);
}

export function getDefaultWorldClockZones(localZone = 'UTC') {
  return normalizeWorldClockZones(['America/New_York', 'Europe/London', 'Asia/Tokyo'], localZone);
}

function partsFor(date, timeZone, locale, hour12) {
  const format = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12,
  });
  return Object.fromEntries(format.formatToParts(date).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]));
}

export function getTimeZoneOffsetMinutes(date, timeZone) {
  const instant = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(instant.getTime())) throw new RangeError('Choose a valid instant.');
  if (!isValidZone(timeZone)) throw new RangeError('Choose a supported time zone.');
  const parts = partsFor(instant, timeZone, 'en-US', false);
  let hour = Number(parts.hour);
  if (hour === 24) hour = 0;
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), hour, Number(parts.minute), Number(parts.second));
  return Math.round((asUtc - instant.getTime()) / 60_000);
}

export function formatUtcOffset(offsetMinutes) {
  if (!Number.isInteger(offsetMinutes) || Math.abs(offsetMinutes) > 14 * 60) throw new RangeError('UTC offset is outside the supported range.');
  const sign = offsetMinutes < 0 ? '−' : '+';
  const absolute = Math.abs(offsetMinutes);
  return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
}

export function formatOffsetDifference(offsetMinutes, localOffsetMinutes, locale = 'en') {
  const difference = offsetMinutes - localOffsetMinutes;
  if (difference === 0) return new Intl.NumberFormat(locale, { signDisplay: 'always' }).format(0) + ' min';
  const sign = difference < 0 ? '−' : '+';
  const absolute = Math.abs(difference);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  return `${sign}${hours ? `${number.format(hours)} h` : ''}${hours && minutes ? ' ' : ''}${minutes ? `${number.format(minutes)} min` : ''}`;
}

export function createWorldClockSnapshot({ date = new Date(), zones, localZone = 'UTC', locale = 'en', hour12 = false } = {}) {
  const instant = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(instant.getTime())) throw new RangeError('Choose a valid instant.');
  const normalizedZones = normalizeWorldClockZones(zones ?? [], localZone);
  const localOffsetMinutes = getTimeZoneOffsetMinutes(instant, localZone);
  const clocks = normalizedZones.map((timeZone) => {
    const localParts = partsFor(instant, timeZone, locale, hour12);
    const offsetMinutes = getTimeZoneOffsetMinutes(instant, timeZone);
    const time = new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12 }).format(instant);
    const dateLabel = new Intl.DateTimeFormat(locale, { timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(instant);
    return Object.freeze({
      timeZone,
      time,
      date: dateLabel,
      parts: Object.freeze(localParts),
      offsetMinutes,
      utcOffset: formatUtcOffset(offsetMinutes),
      difference: timeZone === localZone ? '—' : formatOffsetDifference(offsetMinutes, localOffsetMinutes, locale),
      isLocal: timeZone === localZone,
    });
  });
  return Object.freeze({ instant: instant.toISOString(), localZone, clocks: Object.freeze(clocks) });
}
