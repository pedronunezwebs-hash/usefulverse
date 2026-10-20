import { parseCsv } from '../spreadsheet-diff/logic.mjs';

const MAX_BYTES = 100_000;
const MAX_RECORDS = 4_999;
const MAX_UNIT_LENGTH = 24;

function fail(code) {
  throw Object.assign(new Error(code), { code });
}

function normalizeHeader(value) {
  return String(value ?? '').trim().normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]/gu, '');
}

const HEADERS = Object.freeze({
  timestamp: ['timestamp', 'measuredat', 'datetime', 'date', 'time', 'utcdate'],
  pollutant: ['pollutant', 'parameter', 'metric', 'indicator'],
  value: ['value', 'concentration', 'reading', 'measurement'],
  unit: ['unit', 'units'],
  station: ['station', 'stationname', 'site', 'location', 'sensor'],
});

function resolveColumns(headers) {
  const normalized = headers.map(normalizeHeader);
  if (normalized.some(value => !value)) fail('empty-header');
  if (new Set(normalized).size !== normalized.length) fail('duplicate-headers');
  const columns = {};
  for (const [field, aliases] of Object.entries(HEADERS)) {
    const matches = normalized.flatMap((header, index) => aliases.includes(header) ? [index] : []);
    if (matches.length > 1) fail('duplicate-field');
    if (matches.length) columns[field] = matches[0];
  }
  for (const required of ['timestamp', 'pollutant', 'value', 'unit']) {
    if (columns[required] === undefined) fail(`missing-${required}`);
  }
  return columns;
}

function readTimestamp(value) {
  const text = String(value ?? '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|[+-](\d{2}):(\d{2}))$/iu.exec(text);
  if (!match) return null;
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const hour = Number(hourText), minute = Number(minuteText), second = Number(secondText);
  const calendar = new Date(Date.UTC(year, month - 1, day));
  if (year < 1000 || calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return null;
  if (hour > 23 || minute > 59 || second > 59) return null;
  if (offsetHourText !== undefined && (Number(offsetHourText) > 23 || Number(offsetMinuteText) > 59)) return null;
  const time = Date.parse(text);
  return Number.isFinite(time) ? time : null;
}

export function parseAirQualityCsv(input) {
  const text = String(input ?? '');
  if (new TextEncoder().encode(text).byteLength > MAX_BYTES) fail('file-too-large');
  const table = parseCsv(text);
  if (table.length < 2) fail('no-data');
  if (table.length - 1 > MAX_RECORDS) fail('too-many-records');
  const headers = table[0].map(value => String(value).trim());
  const columns = resolveColumns(headers);
  const records = [];

  for (let index = 1; index < table.length; index++) {
    const row = table[index];
    if (row.every(value => !String(value).trim())) continue;
    const time = readTimestamp(row[columns.timestamp]);
    if (time === null) fail('invalid-timestamp');
    const pollutant = String(row[columns.pollutant] ?? '').trim();
    const unit = String(row[columns.unit] ?? '').trim();
    const valueText = String(row[columns.value] ?? '').trim();
    const value = Number(valueText);
    if (!pollutant || pollutant.length > 60) fail('invalid-pollutant');
    if (!unit || unit.length > MAX_UNIT_LENGTH) fail('invalid-unit');
    if (!valueText || !Number.isFinite(value) || value < 0 || value > 1_000_000_000) fail('invalid-value');
    const station = columns.station === undefined ? '' : String(row[columns.station] ?? '').trim().slice(0, 120);
    records.push(Object.freeze({ time, timestamp: new Date(time).toISOString(), pollutant, pollutantKey: normalizeHeader(pollutant), value, unit, unitKey: normalizeHeader(unit), station }));
  }
  if (!records.length) fail('no-data');

  const groups = new Map();
  for (const record of records) {
    const key = `${record.pollutantKey}\u0000${record.unitKey}`;
    let group = groups.get(key);
    if (!group) {
      group = { pollutant: record.pollutant, pollutantKey: record.pollutantKey, unit: record.unit, unitKey: record.unitKey, count: 0, sum: 0, minimum: record.value, maximum: record.value, latest: record };
      groups.set(key, group);
    }
    group.count++;
    group.sum += record.value;
    group.minimum = Math.min(group.minimum, record.value);
    group.maximum = Math.max(group.maximum, record.value);
    if (record.time > group.latest.time) group.latest = record;
  }
  const summaries = [...groups.values()].map(group => Object.freeze({
    pollutant: group.pollutant,
    unit: group.unit,
    count: group.count,
    average: group.sum / group.count,
    minimum: group.minimum,
    maximum: group.maximum,
    latestValue: group.latest.value,
    latestTime: group.latest.time,
    latestStation: group.latest.station,
  })).sort((a, b) => a.pollutant.localeCompare(b.pollutant) || a.unit.localeCompare(b.unit));
  const stations = new Set(records.map(record => record.station).filter(Boolean));
  return Object.freeze({
    recordCount: records.length,
    stationCount: stations.size,
    startTime: Math.min(...records.map(record => record.time)),
    endTime: Math.max(...records.map(record => record.time)),
    summaries: Object.freeze(summaries),
    recentRecords: Object.freeze([...records].sort((a, b) => b.time - a.time).slice(0, 100)),
  });
}
