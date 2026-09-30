import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFraction, calculateFuelCost, calculateSubnet, calculateTimeCard,
  createZip, formatSql, formatTimer, generateLorem, parseFraction,
  parsePdfPageRanges, typingMetrics,
} from './new-tool-logic.mjs';
import { browserBatchLocales } from './locales/browser-batch.mjs';

test('new-tool runtime status messages are localized in every supported language', () => {
  const statusKeys = Object.keys(browserBatchLocales.es.ui).filter((key) => key.startsWith('status.'));
  const dynamicLabels = ['Shift', 'Countdown', 'Stopwatch', 'Add', 'Start', 'Reset', 'Efficiency (L/100 km)', 'Efficiency (MPG)', 'Fuel price per liter', 'Fuel price per gallon'];
  assert.ok(statusKeys.length >= 25, 'Status translation coverage should include every interactive tool state.');
  for (const [language, data] of Object.entries(browserBatchLocales)) {
    for (const key of statusKeys) assert.ok(data.ui[key] && data.ui[key] !== key, `Missing ${key} in ${language}.`);
    for (const key of dynamicLabels) assert.ok(data.ui[key], `Missing dynamically updated label ${key} in ${language}.`);
  }
});

test('fractions preserve exact arithmetic and accept common forms', () => {
  assert.deepEqual(parseFraction('2 1/3'), { n: 7n, d: 3n });
  assert.deepEqual(parseFraction('-2 1/3'), { n: -7n, d: 3n });
  assert.deepEqual(parseFraction('0.125'), { n: 1n, d: 8n });
  assert.equal(calculateFraction('3/4', '2/3', 'add').fraction, '17/12');
  assert.equal(calculateFraction('3/4', '2/3', 'add').mixed, '1 5/12');
  assert.equal(calculateFraction('3/4', '2/3', 'multiply').fraction, '1/2');
  assert.equal(calculateFraction('0.1', '0.2', 'add').fraction, '3/10');
  assert.throws(() => calculateFraction('1/2', '0', 'divide'), /zero/u);
  assert.throws(() => parseFraction('1/0'), /zero/u);
});

test('time card totals breaks and overnight shifts correctly', () => {
  assert.deepEqual(calculateTimeCard([{ start: '09:00', end: '17:00', breakMinutes: 30 }, { start: '22:00', end: '06:00', breakMinutes: 60 }]), { minutes: 870, breakMinutes: 90 });
  assert.throws(() => calculateTimeCard([{ start: '09:00', end: '10:00', breakMinutes: 60 }]), /shorter/u);
  assert.throws(() => calculateTimeCard([{ start: '', end: '', breakMinutes: 0 }]), /at least one/u);
});

test('IPv4 CIDR calculations handle regular, point-to-point and single-host networks', () => {
  assert.deepEqual(calculateSubnet('192.168.1.10/24'), { prefix: 24, network: '192.168.1.0', mask: '255.255.255.0', wildcard: '0.0.0.255', broadcast: '192.168.1.255', firstHost: '192.168.1.1', lastHost: '192.168.1.254', totalAddresses: 256, usableHosts: 254 });
  assert.equal(calculateSubnet('10.0.0.4/31').usableHosts, 2);
  assert.equal(calculateSubnet('10.0.0.4/31').broadcast, 'N/A (/31 point-to-point)');
  assert.equal(calculateSubnet('10.0.0.4/32').usableHosts, 1);
  assert.equal(calculateSubnet('0.0.0.0/0').totalAddresses, 4_294_967_296);
  assert.throws(() => calculateSubnet('256.0.0.1/24'), /IPv4/u);
  assert.throws(() => calculateSubnet('10.0.0.1/33'), /prefix/u);
});

test('fuel estimates respect US and metric efficiency units', () => {
  assert.deepEqual(calculateFuelCost({ distance: 100, efficiency: 25, price: 4, passengers: 2, system: 'us', roundTrip: true }), { distance: 200, fuel: 8, cost: 32, perPassenger: 16, fuelUnit: 'gal' });
  assert.deepEqual(calculateFuelCost({ distance: 100, efficiency: 8, price: 1.5, system: 'metric' }), { distance: 100, fuel: 8, cost: 12, perPassenger: 12, fuelUnit: 'L' });
  assert.throws(() => calculateFuelCost({ distance: 0, efficiency: 8, price: 1 }), /positive/u);
});

test('typing metrics count Unicode code points and expose accuracy independently', () => {
  assert.deepEqual(typingMetrics('hello', 'hello', 60_000), { wpm: 1, accuracy: 100, correctCharacters: 5, typedCharacters: 5 });
  assert.deepEqual(typingMetrics('café', 'cafèx', 30_000), { wpm: 2, accuracy: 60, correctCharacters: 3, typedCharacters: 5 });
  assert.equal(typingMetrics('你好', '你', 0).wpm, 0);
});

test('Lorem Ipsum generation enforces output limits and modes', () => {
  assert.equal(generateLorem('words', 4).split(' ').length, 4);
  assert.equal(generateLorem('sentences', 2).split('.').filter(Boolean).length, 2);
  assert.equal(generateLorem('paragraphs', 2).split('\n\n').length, 2);
  assert.throws(() => generateLorem('words', 5001), /limit/u);
});

test('PDF page ranges are validated, sorted and de-duplicated', () => {
  assert.deepEqual(parsePdfPageRanges('1-3, 5, 2', 6), [1, 2, 3, 5]);
  assert.deepEqual(parsePdfPageRanges('all', 3), [1, 2, 3]);
  assert.throws(() => parsePdfPageRanges('0, 2', 3), /between/u);
  assert.throws(() => parsePdfPageRanges('3-1', 5), /between/u);
  assert.throws(() => parsePdfPageRanges('1', 31), /30 pages/u);
});

test('the local ZIP writer creates a valid ZIP signature and rejects empty archives', async () => {
  const zip = createZip([{ name: 'page-001.txt', data: new TextEncoder().encode('hello') }]);
  const bytes = new Uint8Array(await zip.arrayBuffer());
  const view = new DataView(bytes.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  const filenameLength = view.getUint16(26, true); const dataStart = 30 + filenameLength + view.getUint16(28, true);
  assert.equal(new TextDecoder().decode(bytes.slice(30, 30 + filenameLength)), 'page-001.txt');
  assert.equal(new TextDecoder().decode(bytes.slice(dataStart, dataStart + view.getUint32(18, true))), 'hello');
  const centralStart = dataStart + view.getUint32(18, true);
  assert.equal(view.getUint32(centralStart, true), 0x02014b50);
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50);
  assert.throws(() => createZip([]), /between/u);
});

test('SQL formatter breaks clauses without changing quoted strings or comments', () => {
  const formatted = formatSql("select id,name from users where note='from where' and id>1 order by name; -- keep select", true);
  assert.match(formatted, /SELECT id,\n  name\nFROM users\nWHERE note = 'from where' AND id > 1\nORDER BY name;/u);
  assert.match(formatted, /-- keep select/u);
  assert.match(formatSql('select id from users -- trailing comment', true), /-- trailing comment$/u);
  assert.match(formatSql('select (a + (b)) from t', false), /select \(/u);
  assert.equal(formatSql('select name,count(*) from users', true), 'SELECT name,\n  count(*)\nFROM users');
  assert.equal(formatSql('select count(*) from users', true), 'SELECT count(*)\nFROM users');
  assert.equal(formatSql('select coalesce(name,\'unknown\') from users', true), "SELECT coalesce(name, 'unknown')\nFROM users");
  assert.match(formatSql('select id from users where id in (select user_id from orders)', true), /IN \(\n  SELECT user_id\n  FROM orders\)/u);
  assert.throws(() => formatSql(' '.repeat(200_001)), /200 KB/u);
});

test('timer formatting rounds up and supports hours', () => {
  assert.equal(formatTimer(1), '00:01');
  assert.equal(formatTimer(61_000), '01:01');
  assert.equal(formatTimer(3_661_000), '01:01:01');
  assert.equal(formatTimer(Number.NaN), '00:00');
});
