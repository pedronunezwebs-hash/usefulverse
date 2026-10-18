const WGS84_A = 6378137;
const WGS84_F = 1 / 298.257223563;
const WGS84_E2 = WGS84_F * (2 - WGS84_F);
const UTM_K0 = 0.9996;
const SWISS_BOUNDS = Object.freeze({ minLat: 44, maxLat: 49, minLon: 5, maxLon: 11.5 });

const finite = (value, name) => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new RangeError(`${name} must be a finite number.`);
  return number;
};

export function parseAngle(input, axis = 'latitude') {
  const raw = String(input ?? '').trim();
  if (!raw) throw new RangeError(`Enter a ${axis}.`);
  const hemisphere = raw.match(/[NSEW]/iu)?.[0]?.toUpperCase();
  const numeric = raw.replace(/[NSEW]/giu, '').trim();
  let value;
  if (/^[+-]?\d+(?:[.,]\d+)?$/u.test(numeric)) {
    value = Number(numeric.replace(',', '.'));
  } else {
    const parts = numeric.match(/[+-]?\d+(?:[.,]\d+)?/gu)?.map((part) => Number(part.replace(',', '.')));
    if (!parts?.length || parts.length > 3) throw new RangeError(`Use decimal degrees or degrees, minutes and seconds for ${axis}.`);
    const sign = parts[0] < 0 || /^[\s-]/u.test(numeric) ? -1 : 1;
    const degrees = Math.abs(parts[0]);
    const minutes = parts[1] ?? 0;
    const seconds = parts[2] ?? 0;
    if (minutes >= 60 || seconds >= 60 || minutes < 0 || seconds < 0) throw new RangeError('Minutes and seconds must be below 60.');
    value = sign * (degrees + minutes / 60 + seconds / 3600);
  }
  const expected = axis === 'latitude' ? ['N', 'S'] : ['E', 'W'];
  if (hemisphere && !expected.includes(hemisphere)) throw new RangeError(`Use ${expected.join(' or ')} for ${axis}.`);
  if (hemisphere === 'S' || hemisphere === 'W') value = -Math.abs(value);
  if (hemisphere === 'N' || hemisphere === 'E') value = Math.abs(value);
  const max = axis === 'latitude' ? 90 : 180;
  if (Math.abs(value) > max) throw new RangeError(`${axis} must be between ${-max} and ${max} degrees.`);
  return value;
}

export function formatDms(angle, axis = 'latitude', decimals = 2) {
  const value = finite(angle, axis);
  const hemisphere = axis === 'latitude' ? (value < 0 ? 'S' : 'N') : (value < 0 ? 'W' : 'E');
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minuteValue = (absolute - degrees) * 60;
  const minutes = Math.floor(minuteValue);
  const seconds = (minuteValue - minutes) * 60;
  return `${degrees}° ${String(minutes).padStart(2, '0')}′ ${seconds.toFixed(decimals).padStart(decimals + 3, '0')}″ ${hemisphere}`;
}

function assertSwissArea(latitude, longitude) {
  if (latitude < SWISS_BOUNDS.minLat || latitude > SWISS_BOUNDS.maxLat || longitude < SWISS_BOUNDS.minLon || longitude > SWISS_BOUNDS.maxLon) {
    throw new RangeError('Swiss LV95/LV03 approximation is limited to the stated Swiss-area bounds (44–49° N, 5–11.5° E).');
  }
}

// swisstopo's published Dec-2016 approximate navigation formulas; not FINELTRA/CHENyx06.
export function wgs84ToLv95(latitude, longitude) {
  const lat = parseAngle(latitude, 'latitude');
  const lon = parseAngle(longitude, 'longitude');
  assertSwissArea(lat, lon);
  const phi = (lat * 3600 - 169028.66) / 10000;
  const lambda = (lon * 3600 - 26782.5) / 10000;
  const easting = 2600072.37 + 211455.93 * lambda - 10938.51 * lambda * phi - 0.36 * lambda * phi ** 2 - 44.54 * lambda ** 3;
  const northing = 1200147.07 + 308807.95 * phi + 3745.25 * lambda ** 2 + 76.63 * phi ** 2 - 194.56 * lambda ** 2 * phi + 119.79 * phi ** 3;
  return { easting, northing, accuracy: 'better-than-1-metre', method: 'swisstopo approximate WGS84→LV95 formula (Dec 2016)' };
}

export function lv95ToWgs84(eastingInput, northingInput) {
  const easting = finite(eastingInput, 'Easting');
  const northing = finite(northingInput, 'Northing');
  if (easting < 2400000 || easting > 2900000 || northing < 1000000 || northing > 1300000) throw new RangeError('LV95 values are outside the supported Swiss-area range.');
  const y = (easting - 2600000) / 1000000;
  const x = (northing - 1200000) / 1000000;
  const longitudeAux = 2.6779094 + 4.728982 * y + 0.791484 * y * x + 0.1306 * y * x ** 2 - 0.0436 * y ** 3;
  const latitudeAux = 16.9023892 + 3.238272 * x - 0.270978 * y ** 2 - 0.002528 * x ** 2 - 0.0447 * y ** 2 * x - 0.0140 * x ** 3;
  const longitude = longitudeAux * 100 / 36;
  const latitude = latitudeAux * 100 / 36;
  assertSwissArea(latitude, longitude);
  return { latitude, longitude, accuracy: 'better-than-0.12-arcsecond', method: 'swisstopo approximate LV95→WGS84 formula (Dec 2016)' };
}

export function lv03ToLv95(easting, northing) {
  const x = finite(easting, 'Easting');
  const y = finite(northing, 'Northing');
  if (x < 400000 || x > 900000 || y < 0 || y > 300000) throw new RangeError('LV03 values are outside the supported Swiss-area range.');
  return { easting: x + 2000000, northing: y + 1000000, accuracy: 'up-to-1.6-metres-distortion', method: 'simple LV03/LV95 false-origin offset; not CHENyx06' };
}

export function lv95ToLv03(easting, northing) {
  const result = lv03ToLv95(finite(easting, 'Easting') - 2000000, finite(northing, 'Northing') - 1000000);
  return { easting: result.easting - 2000000, northing: result.northing - 1000000, accuracy: result.accuracy, method: result.method };
}

export function wgs84ToUtm(latitudeInput, longitudeInput) {
  const latitude = parseAngle(latitudeInput, 'latitude');
  const longitude = parseAngle(longitudeInput, 'longitude');
  if (latitude < -80 || latitude > 84) throw new RangeError('UTM covers latitudes from 80° S to 84° N; polar points need UPS.');
  const zone = longitude === 180 ? 60 : Math.floor((longitude + 180) / 6) + 1;
  const zoneForBand = (() => {
    if (latitude >= 72 && latitude < 84) {
      if (longitude >= 0 && longitude < 9) return 31;
      if (longitude < 21 && longitude >= 9) return 33;
      if (longitude < 33 && longitude >= 21) return 35;
      if (longitude < 42 && longitude >= 33) return 37;
    }
    if (latitude >= 56 && latitude < 64 && longitude >= 3 && longitude < 12) return 32;
    return zone;
  })();
  const lambda0 = ((zoneForBand - 1) * 6 - 180 + 3) * Math.PI / 180;
  const phi = latitude * Math.PI / 180;
  const lambda = longitude * Math.PI / 180;
  const ep2 = WGS84_E2 / (1 - WGS84_E2);
  const n = WGS84_A / Math.sqrt(1 - WGS84_E2 * Math.sin(phi) ** 2);
  const t = Math.tan(phi) ** 2;
  const c = ep2 * Math.cos(phi) ** 2;
  const a = Math.cos(phi) * (lambda - lambda0);
  const m = WGS84_A * ((1 - WGS84_E2 / 4 - 3 * WGS84_E2 ** 2 / 64 - 5 * WGS84_E2 ** 3 / 256) * phi
    - (3 * WGS84_E2 / 8 + 3 * WGS84_E2 ** 2 / 32 + 45 * WGS84_E2 ** 3 / 1024) * Math.sin(2 * phi)
    + (15 * WGS84_E2 ** 2 / 256 + 45 * WGS84_E2 ** 3 / 1024) * Math.sin(4 * phi)
    - (35 * WGS84_E2 ** 3 / 3072) * Math.sin(6 * phi));
  const easting = 500000 + UTM_K0 * n * (a + (1 - t + c) * a ** 3 / 6 + (5 - 18 * t + t ** 2 + 72 * c - 58 * ep2) * a ** 5 / 120);
  let northing = UTM_K0 * (m + n * Math.tan(phi) * (a ** 2 / 2 + (5 - t + 9 * c + 4 * c ** 2) * a ** 4 / 24 + (61 - 58 * t + t ** 2 + 600 * c - 330 * ep2) * a ** 6 / 720));
  const hemisphere = latitude < 0 ? 'S' : 'N';
  if (hemisphere === 'S') northing += 10000000;
  return { easting, northing, zone: zoneForBand, hemisphere, accuracy: 'standard-wgs84-utm', method: 'WGS84 Transverse Mercator series; standard UTM zone exceptions applied' };
}

export function utmToWgs84(eastingInput, northingInput, zoneInput, hemisphereInput = 'N') {
  const easting = finite(eastingInput, 'Easting');
  const northing = finite(northingInput, 'Northing');
  const zone = Number(zoneInput);
  const hemisphere = String(hemisphereInput).trim().toUpperCase();
  if (!Number.isInteger(zone) || zone < 1 || zone > 60) throw new RangeError('UTM zone must be an integer from 1 to 60.');
  if (!['N', 'S'].includes(hemisphere)) throw new RangeError('Choose UTM hemisphere N or S.');
  if (easting < 100000 || easting > 900000 || northing < 0 || northing > 10000000) throw new RangeError('UTM easting/northing are outside supported ranges.');
  const x = easting - 500000;
  const y = hemisphere === 'S' ? northing - 10000000 : northing;
  const ep2 = WGS84_E2 / (1 - WGS84_E2);
  const m = y / UTM_K0;
  const mu = m / (WGS84_A * (1 - WGS84_E2 / 4 - 3 * WGS84_E2 ** 2 / 64 - 5 * WGS84_E2 ** 3 / 256));
  const e1 = (1 - Math.sqrt(1 - WGS84_E2)) / (1 + Math.sqrt(1 - WGS84_E2));
  const phi1 = mu + (3 * e1 / 2 - 27 * e1 ** 3 / 32) * Math.sin(2 * mu)
    + (21 * e1 ** 2 / 16 - 55 * e1 ** 4 / 32) * Math.sin(4 * mu)
    + (151 * e1 ** 3 / 96) * Math.sin(6 * mu) + (1097 * e1 ** 4 / 512) * Math.sin(8 * mu);
  const n1 = WGS84_A / Math.sqrt(1 - WGS84_E2 * Math.sin(phi1) ** 2);
  const r1 = WGS84_A * (1 - WGS84_E2) / (1 - WGS84_E2 * Math.sin(phi1) ** 2) ** 1.5;
  const t1 = Math.tan(phi1) ** 2;
  const c1 = ep2 * Math.cos(phi1) ** 2;
  const d = x / (n1 * UTM_K0);
  const latitude = phi1 - (n1 * Math.tan(phi1) / r1) * (d ** 2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * ep2) * d ** 4 / 24 + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * ep2 - 3 * c1 ** 2) * d ** 6 / 720);
  const lambda0 = ((zone - 1) * 6 - 180 + 3) * Math.PI / 180;
  const longitude = lambda0 + (d - (1 + 2 * t1 + c1) * d ** 3 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * ep2 + 24 * t1 ** 2) * d ** 5 / 120) / Math.cos(phi1);
  const result = { latitude: latitude * 180 / Math.PI, longitude: longitude * 180 / Math.PI, zone, hemisphere, accuracy: 'standard-wgs84-utm', method: 'inverse WGS84 Transverse Mercator series' };
  if (result.latitude < -80 || result.latitude > 84) throw new RangeError('UTM result is outside the supported latitude band; polar points need UPS.');
  return result;
}

export function convertCoordinate({ source, target, first, second, zone = 32, hemisphere = 'N' }) {
  const systems = ['wgs84', 'lv95', 'lv03', 'utm'];
  if (!systems.includes(source) || !systems.includes(target)) throw new RangeError('Choose a supported coordinate system.');
  const a = source === 'wgs84' ? parseAngle(first, 'latitude') : finite(first, source === 'utm' ? 'Easting' : 'Easting');
  const b = source === 'wgs84' ? parseAngle(second, 'longitude') : finite(second, 'Northing');
  if (source === target) {
    if (source === 'wgs84') return { latitude: a, longitude: b, accuracy: 'input-wgs84', method: 'WGS84 geographic coordinates; unchanged' };
    if (source === 'utm') {
      // Validate zone, hemisphere and coordinate ranges even when the requested
      // output is unchanged; otherwise invalid input would be reported as valid.
      utmToWgs84(a, b, zone, hemisphere);
      return { easting: a, northing: b, zone: Number(zone), hemisphere: String(hemisphere).toUpperCase(), accuracy: 'input-utm', method: 'UTM coordinates; unchanged' };
    }
    return { easting: a, northing: b, accuracy: `input-${source}`, method: `${source.toUpperCase()} coordinates; unchanged` };
  }
  let geographic;
  if (source === 'wgs84') geographic = { latitude: a, longitude: b, accuracy: 'input-wgs84', method: 'WGS84 geographic coordinates' };
  else if (source === 'utm') geographic = utmToWgs84(a, b, zone, hemisphere);
  else if (source === 'lv95') geographic = lv95ToWgs84(a, b);
  else {
    const lv95 = lv03ToLv95(a, b);
    geographic = lv95ToWgs84(lv95.easting, lv95.northing);
  }

  if (target === 'wgs84') return geographic;
  if (target === 'utm') return wgs84ToUtm(geographic.latitude, geographic.longitude);
  if (target === 'lv95') return source === 'lv03' ? lv03ToLv95(a, b) : wgs84ToLv95(geographic.latitude, geographic.longitude);
  if (source === 'lv95') return lv95ToLv03(a, b);
  if (source === 'lv03') return { easting: a, northing: b, accuracy: 'unchanged-lv03', method: 'same source and target reference frame' };
  const lv95 = wgs84ToLv95(geographic.latitude, geographic.longitude);
  return lv95ToLv03(lv95.easting, lv95.northing);
}

export function convertCoordinateBatch(text, options, maximum = 1000) {
  const lines = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (lines.length && /^(?:latitude|lat|easting|east|x)\s*[,;\t]/iu.test(lines[0])) lines.shift();
  if (!lines.length) throw new RangeError('Enter at least one coordinate pair.');
  if (lines.length > maximum) throw new RangeError(`Use no more than ${maximum} coordinate pairs per batch.`);
  return lines.map((line, index) => {
    const parts = line.split(/[,;\t]/u).map((part) => part.trim());
    if (parts.length < 2 || parts.length > 4) throw new RangeError(`Line ${index + 1}: use two coordinates, with optional UTM zone and hemisphere.`);
    return convertCoordinate({ ...options, first: parts[0], second: parts[1], zone: parts[2] || options.zone, hemisphere: parts[3] || options.hemisphere });
  });
}
