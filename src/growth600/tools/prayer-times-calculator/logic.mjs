const METHODS = Object.freeze({
  mwl: { fajrAngle: 18, ishaAngle: 17 },
  isna: { fajrAngle: 15, ishaAngle: 15 },
  egypt: { fajrAngle: 19.5, ishaAngle: 17.5 },
  makkah: { fajrAngle: 18.5, ishaMinutes: 90 },
  makkahRamadan: { fajrAngle: 18.5, ishaMinutes: 120 },
  karachi: { fajrAngle: 18, ishaAngle: 18 },
  france: { fajrAngle: 12, ishaAngle: 12 },
  russia: { fajrAngle: 16, ishaAngle: 15 },
  singapore: { fajrAngle: 20, ishaAngle: 18 },
});
const HIGH_LATITUDE_METHODS = new Set(['none', 'middle', 'seventh', 'angle']);
const MAX_SUPPORTED_YEAR = 2100;
const MIN_SUPPORTED_YEAR = 1900;
const DEG = Math.PI / 180;

function finite(value, name, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
}

function julianDay(year, month, day) {
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function solarCoordinates(jd) {
  const d = jd - 2451545;
  const radians = (degrees) => degrees * DEG;
  const g = radians(357.529 + 0.98560028 * d);
  const q = 280.459 + 0.98564736 * d;
  const longitude = radians(q + (1.915 * Math.sin(g)) + (0.02 * Math.sin(2 * g)));
  const obliquity = radians(23.439 - (0.00000036 * d));
  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(longitude), Math.cos(longitude)) / (15 * DEG);
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(longitude));
  const equationOfTimeHours = (q / 15) - rightAscension;
  return { declination, equationOfTimeHours };
}

function hourAngleHours(latitude, declination, altitudeDegrees) {
  const lat = latitude * DEG;
  const altitude = altitudeDegrees * DEG;
  const cosine = (Math.sin(altitude) - (Math.sin(lat) * Math.sin(declination))) / (Math.cos(lat) * Math.cos(declination));
  if (cosine < -1 || cosine > 1 || !Number.isFinite(cosine)) return null;
  return Math.acos(cosine) / (15 * DEG);
}

function solarDay({ year, month, day, latitude, longitude, utcOffsetHours, fajrAngle, ishaAngle, ishaMinutes, asrFactor, highLatitudeMethod, ishaFollowsMaghrib }) {
  const { declination, equationOfTimeHours } = solarCoordinates(julianDay(year, month, day));
  const noon = 12 + utcOffsetHours - (longitude / 15) - equationOfTimeHours;
  const sunriseAngle = hourAngleHours(latitude, declination, -0.833);
  const fajrAngleHours = hourAngleHours(latitude, declination, -fajrAngle);
  const ishaAngleHours = ishaAngle == null ? null : hourAngleHours(latitude, declination, -ishaAngle);
  const asrAltitude = Math.atan(1 / (asrFactor + Math.tan(Math.abs(latitude * DEG - declination)))) / DEG;
  const asrHours = hourAngleHours(latitude, declination, asrAltitude);
  const sunset = sunriseAngle == null ? null : noon + sunriseAngle;
  const sunrise = sunriseAngle == null ? null : noon - sunriseAngle;
  const fajr = fajrAngleHours == null ? null : noon - fajrAngleHours;
  const isha = ishaMinutes == null
    ? (ishaAngleHours == null ? null : noon + ishaAngleHours)
    : (sunset == null ? null : sunset + (ishaMinutes / 60));
  const maghrib = sunset;
  return {
    fajr, sunrise, dhuhr: noon, asr: asrHours == null ? null : noon + asrHours,
    sunset, maghrib, isha, declination,
    rawFajrUnavailable: fajr == null,
    rawIshaUnavailable: isha == null,
    ishaFollowsMaghrib,
  };
}

function applyHighLatitude(today, tomorrow, { fajrAngle, ishaAngle, ishaMinutes, highLatitudeMethod }) {
  if (today.sunset == null || tomorrow.sunrise == null || highLatitudeMethod === 'none') return today;
  const nextSunrise = tomorrow.sunrise + 24 * Math.ceil((today.sunset - tomorrow.sunrise) / 24);
  const nightLength = nextSunrise - today.sunset;
  const fraction = (angle) => {
    if (highLatitudeMethod === 'middle') return 0.5;
    if (highLatitudeMethod === 'seventh') return 1 / 7;
    return Math.min(angle / 60, 0.5);
  };
  let fajr = today.fajr;
  let isha = today.isha;
  if (fajr == null) fajr = today.sunrise - (nightLength * fraction(fajrAngle));
  if (isha == null && ishaMinutes == null && ishaAngle != null) isha = today.sunset + (nightLength * fraction(ishaAngle));
  if (today.ishaFollowsMaghrib && isha == null) isha = today.sunset + (nightLength * fraction(ishaAngle ?? fajrAngle));
  return { ...today, fajr, isha, highLatitudeAdjusted: fajr !== today.fajr || isha !== today.isha };
}

function formatMinutes(minutes) {
  if (minutes == null || !Number.isFinite(minutes)) return null;
  const rounded = Math.round(minutes * 60);
  const dayMinutes = ((Math.floor(rounded / 60) % 24) + 24) % 24;
  const second = ((rounded % 60) + 60) % 60;
  return `${String(dayMinutes).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
}

export function calculatePrayerTimes({ date, latitude, longitude, utcOffsetHours, method = 'mwl', asrMethod = 'standard', highLatitudeMethod = 'angle', ramadan = false }) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(date ?? ''));
  if (!match) throw new RangeError('Enter a valid Gregorian date.');
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText); const month = Number(monthText); const day = Number(dayText);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (year < MIN_SUPPORTED_YEAR || year > MAX_SUPPORTED_YEAR || parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() !== month - 1 || parsedDate.getUTCDate() !== day) throw new RangeError('Date must be a real Gregorian date from 1900 through 2100.');
  const lat = finite(latitude, 'Latitude', -90, 90);
  const lon = finite(longitude, 'Longitude', -180, 180);
  const offset = finite(utcOffsetHours, 'UTC offset', -12, 14);
  const methodKey = method === 'makkah' && ramadan ? 'makkahRamadan' : method;
  const methodParameters = METHODS[methodKey];
  if (!methodParameters) throw new RangeError('Choose a supported calculation method.');
  if (!['standard', 'hanafi'].includes(asrMethod)) throw new RangeError('Choose a supported Asr method.');
  if (!HIGH_LATITUDE_METHODS.has(highLatitudeMethod)) throw new RangeError('Choose a supported high-latitude adjustment.');
  const input = { latitude: lat, longitude: lon, utcOffsetHours: offset, ...methodParameters, asrFactor: asrMethod === 'hanafi' ? 2 : 1, highLatitudeMethod, ishaFollowsMaghrib: methodParameters.ishaMinutes != null };
  const today = solarDay({ ...input, year, month, day });
  const tomorrowDate = new Date(Date.UTC(year, month - 1, day + 1));
  const tomorrow = solarDay({ ...input, year: tomorrowDate.getUTCFullYear(), month: tomorrowDate.getUTCMonth() + 1, day: tomorrowDate.getUTCDate() });
  const adjusted = applyHighLatitude(today, tomorrow, input);
  const names = ['fajr', 'sunrise', 'dhuhr', 'asr', 'sunset', 'maghrib', 'isha'];
  const times = Object.fromEntries(names.map((name) => [name, formatMinutes(adjusted[name])]));
  return Object.freeze({ date, latitude: lat, longitude: lon, utcOffsetHours: offset, method: methodKey, asrMethod, highLatitudeMethod, highLatitudeAdjusted: Boolean(adjusted.highLatitudeAdjusted), times: Object.freeze(times) });
}
