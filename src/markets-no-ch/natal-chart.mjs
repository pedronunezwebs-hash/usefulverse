const ZODIAC = Object.freeze([
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]);

const BODIES = Object.freeze([
  ['Sun', 'Sun'], ['Moon', 'Moon'], ['Mercury', 'Mercury'], ['Venus', 'Venus'],
  ['Mars', 'Mars'], ['Jupiter', 'Jupiter'], ['Saturn', 'Saturn'],
  ['Uranus', 'Uranus'], ['Neptune', 'Neptune'], ['Pluto', 'Pluto'],
]);

const dateTimePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/u;

function parseLocalDateTime(value) {
  const match = dateTimePattern.exec(value ?? '');
  if (!match) throw new RangeError('Enter a valid birth date and time.');
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  if (year < 1800 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    throw new RangeError('The supported date range is 1800–2200.');
  }
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  const check = new Date(localAsUtc);
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day || check.getUTCHours() !== hour || check.getUTCMinutes() !== minute) {
    throw new RangeError('Enter a valid calendar date and time.');
  }
  return { year, month, day, hour, minute, localAsUtc };
}

function makeZonedFormatter(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-CA-u-ca-gregory-nu-latn', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
    });
  } catch {
    throw new RangeError('Enter a valid IANA time zone, such as Europe/Zurich.');
  }
}

function partsAt(formatter, instant) {
  return Object.fromEntries(formatter.formatToParts(new Date(instant)).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, Number(value)]));
}

function matchesLocal(parts, target) {
  return parts.year === target.year && parts.month === target.month && parts.day === target.day && parts.hour === target.hour && parts.minute === target.minute;
}

export function resolveBirthMoment({ localDateTime, timeZone, utcOffsetMinutes }) {
  const target = parseLocalDateTime(localDateTime);
  const formatter = makeZonedFormatter(timeZone);
  const offsets = new Set();
  for (let hours = -36; hours <= 36; hours += 3) {
    const instant = target.localAsUtc + hours * 3_600_000;
    const local = partsAt(formatter, instant);
    const localAsUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
    offsets.add(Math.round((localAsUtc - instant) / 60_000));
  }
  const candidates = [...offsets].map((offset) => ({ instant: target.localAsUtc - offset * 60_000, offset })).filter(({ instant }) => matchesLocal(partsAt(formatter, instant), target));
  if (!candidates.length) throw new RangeError('This local time does not exist because the clock changes for daylight saving time. Choose another time.');
  if (candidates.length > 1) {
    if (utcOffsetMinutes === '' || utcOffsetMinutes === undefined || utcOffsetMinutes === null) {
      throw new RangeError('This local time occurs twice when the clock changes. Choose the UTC offset that applied at birth.');
    }
    const selected = candidates.find(({ offset }) => offset === Number(utcOffsetMinutes));
    if (!selected) throw new RangeError('Choose one of the UTC offsets shown for this repeated local time.');
    return { date: new Date(selected.instant), utcOffsetMinutes: selected.offset };
  }
  if (utcOffsetMinutes !== '' && utcOffsetMinutes !== undefined && utcOffsetMinutes !== null && Number(utcOffsetMinutes) !== candidates[0].offset) {
    throw new RangeError('The selected UTC offset does not match this time zone and date.');
  }
  return { date: new Date(candidates[0].instant), utcOffsetMinutes: candidates[0].offset };
}

export function zodiacPosition(longitude) {
  if (!Number.isFinite(longitude)) throw new RangeError('Astronomical longitude must be finite.');
  const normalized = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  return Object.freeze({ signIndex: index, sign: ZODIAC[index], degree: normalized - index * 30, longitude: normalized });
}

function eclipticLongitude(Astronomy, body, date) {
  const vector = Astronomy.GeoVector(body, date, true);
  return Astronomy.Ecliptic(vector).elon;
}

function localSiderealRadians(Astronomy, date, longitude) {
  const degrees = ((Astronomy.SiderealTime(date) * 15 + longitude) % 360 + 360) % 360;
  return (degrees * Math.PI) / 180;
}

function anglesOfHouses(Astronomy, date, latitude, longitude) {
  const time = new Astronomy.AstroTime(date);
  const sidereal = localSiderealRadians(Astronomy, date, longitude);
  const obliquity = (Astronomy.e_tilt(time).tobl * Math.PI) / 180;
  const x = Math.sin(sidereal) * Math.cos(obliquity) + Math.tan((latitude * Math.PI) / 180) * Math.sin(obliquity);
  const y = -Math.cos(sidereal);
  let ascendant = (Math.atan(y / x) * 180) / Math.PI;
  ascendant += x < 0 ? 180 : 360;
  ascendant = ascendant < 180 ? ascendant + 180 : ascendant - 180;

  let midheaven = (Math.atan(Math.tan(sidereal) / Math.cos(obliquity)) * 180) / Math.PI;
  if (midheaven < 0) midheaven += 360;
  const siderealDegrees = (sidereal * 180) / Math.PI;
  if (midheaven > siderealDegrees) midheaven -= 180;
  if (midheaven < 0) midheaven += 180;
  if (midheaven < 180 && siderealDegrees >= 180) midheaven += 180;
  return { ascendant: ((ascendant % 360) + 360) % 360, midheaven: ((midheaven % 360) + 360) % 360 };
}

function wrappedDelta(next, previous) {
  return ((next - previous + 540) % 360) - 180;
}

export function calculateNatalChart({ Astronomy, localDateTime, timeZone, utcOffsetMinutes, latitude, longitude }) {
  if (!Astronomy || typeof Astronomy.GeoVector !== 'function' || typeof Astronomy.Rotation_HOR_EQJ !== 'function') {
    throw new TypeError('The local astronomy library is not available.');
  }
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    throw new RangeError('Latitude must be −90 to 90 and longitude −180 to 180.');
  }
  const moment = resolveBirthMoment({ localDateTime, timeZone, utcOffsetMinutes });
  const date = new Astronomy.AstroTime(moment.date);
  const positions = BODIES.map(([key, body]) => {
    const longitudeDegrees = eclipticLongitude(Astronomy, Astronomy.Body[body], date);
    const previous = eclipticLongitude(Astronomy, Astronomy.Body[body], new Astronomy.AstroTime(new Date(moment.date.getTime() - 43_200_000)));
    const next = eclipticLongitude(Astronomy, Astronomy.Body[body], new Astronomy.AstroTime(new Date(moment.date.getTime() + 43_200_000)));
    return Object.freeze({ body: key, ...zodiacPosition(longitudeDegrees), retrograde: !['Sun', 'Moon'].includes(key) && wrappedDelta(next, previous) < 0 });
  });
  const houses = anglesOfHouses(Astronomy, moment.date, lat, lon);
  const ascendant = zodiacPosition(houses.ascendant);
  const midheaven = zodiacPosition(houses.midheaven);
  return Object.freeze({ date: moment.date, timeZone, utcOffsetMinutes: moment.utcOffsetMinutes, latitude: lat, longitude: lon, positions: Object.freeze(positions), ascendant, midheaven });
}

export const zodiacSigns = ZODIAC;
export const natalBodies = Object.freeze(BODIES.map(([key]) => key));
