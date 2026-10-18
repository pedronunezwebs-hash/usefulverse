import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertCoordinate,
  convertCoordinateBatch,
  formatDms,
  lv03ToLv95,
  lv95ToLv03,
  lv95ToWgs84,
  parseAngle,
  wgs84ToLv95,
  wgs84ToUtm,
  utmToWgs84,
} from './swiss-coordinate-converter.mjs';

const near = (actual, expected, tolerance, label) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: got ${actual}, expected ${expected} ±${tolerance}`);

test('parses decimal and DMS angles, hemisphere signs, and rejects invalid axes', () => {
  near(parseAngle('46° 02′ 38.87″ N', 'latitude'), 46.0441305556, 1e-9, 'DMS latitude');
  near(parseAngle('8 43 49.79 E', 'longitude'), 8.7304972222, 1e-9, 'space DMS longitude');
  assert.equal(parseAngle('46.2 S', 'latitude'), -46.2);
  assert.equal(formatDms(-8.7304972222, 'longitude'), '8° 43′ 49.79″ W');
  assert.throws(() => parseAngle('8° 70′ 1″ N', 'latitude'), /below 60/u);
  assert.throws(() => parseAngle('46 E', 'latitude'), /Use N or S/u);
});

test('matches swisstopo published approximate WGS84 to LV95 example and inverse', () => {
  const result = wgs84ToLv95('46° 02′ 38.87″ N', '8° 43′ 49.79″ E');
  near(result.easting, 2699999.76, 0.02, 'LV95 easting');
  near(result.northing, 1099999.97, 0.02, 'LV95 northing');
  assert.equal(result.accuracy, 'better-than-1-metre');
  const inverse = lv95ToWgs84(2700000, 1100000);
  near(inverse.latitude, 46.044127, 0.000001, 'inverse latitude');
  near(inverse.longitude, 8.7305, 0.000001, 'inverse longitude');
});

test('LV03/LV95 false-origin offset is explicit and reversible but marked approximate', () => {
  assert.deepEqual(lv03ToLv95(700000, 100000), {
    easting: 2700000, northing: 1100000, accuracy: 'up-to-1.6-metres-distortion',
    method: 'simple LV03/LV95 false-origin offset; not CHENyx06',
  });
  const result = lv95ToLv03(2700000, 1100000);
  assert.equal(result.easting, 700000);
  assert.equal(result.northing, 100000);
  assert.equal(result.accuracy, 'up-to-1.6-metres-distortion');
  assert.throws(() => lv03ToLv95(0, 0), /outside/u);
});

test('UTM forward/inverse round trip, zone boundaries, hemispheres and polar guard', () => {
  const bern = wgs84ToUtm(46.948, 7.4474);
  assert.equal(bern.zone, 32);
  assert.equal(bern.hemisphere, 'N');
  const back = utmToWgs84(bern.easting, bern.northing, bern.zone, bern.hemisphere);
  near(back.latitude, 46.948, 1e-7, 'UTM inverse latitude');
  near(back.longitude, 7.4474, 1e-7, 'UTM inverse longitude');
  const equator = wgs84ToUtm(0, 3);
  assert.equal(equator.zone, 31);
  near(equator.easting, 500000, 1e-6, 'central-meridian easting');
  near(equator.northing, 0, 1e-6, 'equator northing');
  assert.equal(wgs84ToUtm(60, 6).zone, 32, 'Norway zone exception');
  assert.equal(wgs84ToUtm(78, 20).zone, 33, 'Svalbard zone exception');
  assert.throws(() => wgs84ToUtm(85, 10), /UPS/u);
  assert.throws(() => utmToWgs84(500000, 0, 0, 'N'), /zone/u);
});

test('coordinate routes preserve same-system inputs and label Swiss approximation', () => {
  const unchanged = convertCoordinate({ source: 'lv95', target: 'lv95', first: 2600000, second: 1200000 });
  assert.equal(unchanged.easting, 2600000);
  assert.equal(unchanged.method, 'LV95 coordinates; unchanged');
  assert.throws(() => convertCoordinate({ source: 'utm', target: 'utm', first: 500000, second: 0, zone: 61 }), /zone/u);
  assert.throws(() => convertCoordinate({ source: 'utm', target: 'utm', first: 950000, second: 0, zone: 32 }), /ranges/u);
  const swiss = convertCoordinate({ source: 'wgs84', target: 'lv03', first: 46.0441305556, second: 8.7304972222 });
  near(swiss.easting, 699999.76, 0.02, 'LV03 easting');
  near(swiss.northing, 99999.97, 0.02, 'LV03 northing');
  assert.equal(swiss.accuracy, 'up-to-1.6-metres-distortion');
  const dms = convertCoordinate({ source: 'wgs84', target: 'utm', first: '46° 02′ 38.87″ N', second: '8° 43′ 49.79″ E' });
  assert.equal(dms.zone, 32);
});

test('batch conversion supports header, semicolon rows and per-row UTM hints with safe cap', () => {
  const output = convertCoordinateBatch('latitude;longitude\n46.948;7.4474\n46.04413;8.73049', { source: 'wgs84', target: 'lv95' });
  assert.equal(output.length, 2);
  near(output[0].easting, 2600000, 3000, 'Bern easting');
  assert.equal(convertCoordinateBatch('easting,northing,zone,hemisphere\n500000,0,31,N', { source: 'utm', target: 'wgs84' })[0].longitude, 3);
  assert.throws(() => convertCoordinateBatch('1,2\n'.repeat(1001), { source: 'wgs84', target: 'utm' }), /no more than 1000/u);
});
