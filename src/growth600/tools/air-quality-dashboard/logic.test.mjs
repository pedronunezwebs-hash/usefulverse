import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAirQualityCsv } from './logic.mjs';

test('groups measurements by pollutant and unit without mixing units', () => {
  const result = parseAirQualityCsv([
    'timestamp,pollutant,value,unit,station',
    '2026-10-19T10:00:00Z,PM2.5,12,µg/m³,North',
    '2026-10-19T11:00:00+01:00,PM2.5,18,µg/m³,North',
    '2026-10-19T11:30:00Z,PM2.5,0.02,mg/m³,South',
    '2026-10-19T12:00:00Z,NO2,24,µg/m³,South',
  ].join('\n'));
  assert.equal(result.recordCount, 4);
  assert.equal(result.stationCount, 2);
  assert.equal(result.summaries.length, 3);
  const pmMicrograms = result.summaries.find(group => group.pollutant === 'PM2.5' && group.unit === 'µg/m³');
  assert.equal(pmMicrograms.count, 2);
  assert.equal(pmMicrograms.average, 15);
  assert.equal(pmMicrograms.minimum, 12);
  assert.equal(pmMicrograms.maximum, 18);
  assert.equal(pmMicrograms.latestStation, 'North');
});

test('accepts quoted CSV values and common timestamp header aliases', () => {
  const result = parseAirQualityCsv('Measured at,Parameter,Concentration,Units,Site\r\n"2026-10-19T08:00:00-04:00","Fine, particles",3.5,µg/m³,"Station, East"');
  assert.equal(result.recordCount, 1);
  assert.equal(result.summaries[0].pollutant, 'Fine, particles');
  assert.equal(result.recentRecords[0].station, 'Station, East');
});

test('sorts recent readings and caps the detailed table at 100 records', () => {
  const rows = ['timestamp,pollutant,value,unit'];
  for (let i = 0; i < 140; i++) rows.push(`2026-10-19T${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:00Z,PM10,${i},µg/m³`);
  const result = parseAirQualityCsv(rows.join('\n'));
  assert.equal(result.recordCount, 140);
  assert.equal(result.recentRecords.length, 100);
  assert.ok(result.recentRecords[0].time >= result.recentRecords[1].time);
});

test('rejects a missing required column and an ambiguous timestamp', () => {
  assert.throws(() => parseAirQualityCsv('timestamp,pollutant,value\n2026-10-19T10:00:00Z,PM2.5,1'), { code: 'missing-unit' });
  assert.throws(() => parseAirQualityCsv('timestamp,pollutant,value,unit\n2026-10-19 10:00,PM2.5,1,µg/m³'), { code: 'invalid-timestamp' });
  assert.throws(() => parseAirQualityCsv('timestamp,pollutant,value,unit\n2026-02-30T10:00:00Z,PM2.5,1,µg/m³'), { code: 'invalid-timestamp' });
});

test('rejects negative, non-finite, empty and invalid data values', () => {
  for (const value of ['-1', 'Infinity', '', 'abc']) {
    assert.throws(() => parseAirQualityCsv(`timestamp,pollutant,value,unit\n2026-10-19T10:00:00Z,PM2.5,${value},µg/m³`), { code: 'invalid-value' });
  }
});

test('rejects oversized input and incomplete records', () => {
  assert.throws(() => parseAirQualityCsv('x'.repeat(100_001)), { code: 'file-too-large' });
  assert.throws(() => parseAirQualityCsv('timestamp,pollutant,value,unit\n2026-10-19T10:00:00Z,PM2.5,1,'), { code: 'invalid-unit' });
});
