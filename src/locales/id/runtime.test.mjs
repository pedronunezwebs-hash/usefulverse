// Bahasa Indonesia: localized runtime output of src/app.js with the published id bundle (statuses, plurals,
// copied summaries, Indonesian number input 1.000,5 and id-ID number/date formatting).
import assert from 'node:assert/strict';
import nodeTest from 'node:test';
import { packs } from '../../locales.mjs';
// USEFULVERSE_PACKS without id (e.g. =ja) leaves this pack unloaded: skip instead of failing on its missing locale.
const test = packs.id ? nodeTest : nodeTest.skip;
import { runTool } from '../test-harness.mjs';

process.env.TZ = 'Asia/Jakarta'; // WIB, no DST: local-time outputs below are deterministic.
const tick = () => new Promise((resolve) => setImmediate(resolve));
// The harness context has no Web Crypto; give the page the real one before pressing the button.
async function runWithCrypto(toolId, action, values, options) {
  const get = await runTool('id', toolId, null, values, options);
  get.context.crypto = globalThis.crypto;
  get.click(action);
  return get;
}

test('id word counter: metrics, reading time and the copied summary', async () => {
  const get = await runTool('id', 'word-counter', null, { '#tool-input': 'Saya suka membaca buku di perpustakaan.\nBuku itu sangat menarik.' });
  get.fire('#tool-input', 'input');
  assert.deepEqual(['#metric-words', '#metric-characters', '#metric-characters-no-spaces', '#metric-lines', '#metric-reading-time'].map((id) => String(get(id).textContent)), ['10', '64', '55', '2', '1 menit']);
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, 'Kata: 10\nKarakter: 64\nKarakter tanpa spasi: 55\nBaris: 2\nWaktu baca: 1 menit');
  assert.equal(get('#tool-status').textContent, 'Tersalin ke papan klip.');

  get('#tool-input').value = Array(450).fill('kata').join(' ');
  get.fire('#tool-input', 'input');
  assert.equal(get('#metric-reading-time').textContent, '3 menit', '200 kata per menit');
  get.click('clear');
  assert.equal(get('#metric-reading-time').textContent, '0 menit');
});

test('id remove duplicate lines: kept-lines status with id-ID grouping', async () => {
  const list = { '#tool-input': ' apel\nApel\njeruk\napel \n\nmangga' };
  const caseSensitive = await runTool('id', 'remove-duplicate-lines', 'dedupe', list, { checked: { '#trim-lines': true, '#remove-empty': true } });
  assert.equal(caseSensitive('#tool-output').value, 'apel\nApel\njeruk\nmangga');
  assert.equal(caseSensitive('#tool-status').textContent, '4 baris unik dipertahankan.');
  const ignoreCase = await runTool('id', 'remove-duplicate-lines', 'dedupe', list, { checked: { '#trim-lines': true, '#remove-empty': true, '#ignore-case': true } });
  assert.equal(ignoreCase('#tool-status').textContent, '3 baris unik dipertahankan.');
  const many = await runTool('id', 'remove-duplicate-lines', 'dedupe', { '#tool-input': Array.from({ length: 1200 }, (_, index) => `peserta ${index}`).join('\n') });
  assert.equal(many('#tool-status').textContent, '1.200 baris unik dipertahankan.');
});

test('id CSV/JSON converters: row statuses and errors', async () => {
  const csv = await runTool('id', 'csv-to-json', 'csv-to-json', { '#tool-input': 'nama,usia\nSiti,36\nBudi,55' });
  assert.deepEqual(JSON.parse(csv('#tool-output').value), [{ nama: 'Siti', usia: '36' }, { nama: 'Budi', usia: '55' }]);
  assert.equal(csv('#tool-status').textContent, '2 baris berhasil dikonversi.');
  const badCsv = await runTool('id', 'csv-to-json', 'csv-to-json', { '#tool-input': 'nama;usia' });
  assert.equal(badCsv('#tool-status').textContent, 'CSV tidak bisa dikonversi. Periksa baris header, koma, dan tanda kutip.');
  const json = await runTool('id', 'json-to-csv', 'json-to-csv', { '#tool-input': '[{"nama":"Siti","kota":"Bandung, Jawa Barat"}]' });
  assert.equal(json('#tool-output').value, 'nama,kota\nSiti,"Bandung, Jawa Barat"');
  assert.equal(json('#tool-status').textContent, '1 baris berhasil dikonversi.');
  const badJson = await runTool('id', 'json-formatter', 'format-json', { '#tool-input': "{'nama':'Siti',}" });
  assert.equal(badJson('#tool-status').textContent, 'JSON tidak valid. Periksa tanda kutip, koma, dan tanda kurung.');
});

test('id UUID, random number and password: statuses and local number input', async () => {
  const uuids = await runWithCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '5' });
  assert.equal(uuids('#tool-output').value.split('\n').length, 5);
  assert.equal(uuids('#tool-status').textContent, '5 UUID berhasil dibuat di perangkat Anda.');
  const tooMany = await runWithCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '101' });
  assert.equal(tooMany('#tool-status').textContent, 'Masukkan jumlah dari 1 sampai 100.');

  const random = await runWithCrypto('random-number-generator', 'generate-number', { '#random-min': '1', '#random-max': '1.000' }, { checked: { '#random-integer': true } });
  const drawn = Number(random('#random-result').textContent);
  assert.ok(Number.isInteger(drawn) && drawn >= 1 && drawn <= 1000, `1.000 is one thousand, got ${drawn}`);
  assert.equal(random('#tool-status').textContent, 'Angka acak berhasil dibuat di perangkat Anda.');
  const hugeRange = await runWithCrypto('random-number-generator', 'generate-number', { '#random-min': '1', '#random-max': '5.000.000.000' }, { checked: { '#random-integer': true } });
  assert.equal(hugeRange('#tool-status').textContent, 'Gunakan rentang bilangan bulat di bawah 4,29 miliar.');

  const allTypes = { '#include-uppercase': true, '#include-lowercase': true, '#include-numbers': true, '#include-symbols': true };
  const strong = await runWithCrypto('password-generator', 'generate-password', { '#password-length': '20' }, { checked: allTypes });
  assert.equal(strong('#password-output').value.length, 20);
  assert.equal(strong('#password-strength').textContent, 'Kuat');
  assert.equal(strong('#tool-status').textContent, 'Password berhasil dibuat di perangkat Anda. Simpan di pengelola password.');
  const good = await runWithCrypto('password-generator', 'generate-password', { '#password-length': '16' }, { checked: allTypes });
  assert.equal(good('#password-strength').textContent, 'Cukup kuat');
});

test('id regex tester and text diff: plural statuses and empty states', async () => {
  const regex = await runTool('id', 'regex-tester', 'test-regex', { '#regex-pattern': 'Rp[\\d.]+', '#regex-flags': 'g', '#regex-test': 'Harga Rp15.000, diskon Rp3.000, total Rp12.000.' });
  assert.equal(regex('#regex-output').textContent, 'Rp15.000\nRp3.000\nRp12.000.');
  assert.equal(regex('#tool-status').textContent, '3 kecocokan ditemukan.');
  const none = await runTool('id', 'regex-tester', 'test-regex', { '#regex-pattern': 'z+', '#regex-flags': 'gi', '#regex-test': 'abc' });
  assert.equal(none('#regex-output').textContent, 'Tidak ada kecocokan.');
  assert.equal(none('#tool-status').textContent, 'Tidak ada kecocokan.');
  const invalid = await runTool('id', 'regex-tester', 'test-regex', { '#regex-pattern': '(', '#regex-flags': 'g', '#regex-test': 'abc' });
  assert.equal(invalid('#regex-output').textContent, 'Belum ada kecocokan.');
  assert.equal(invalid('#tool-status').textContent, 'Masukkan regex yang valid dan flag yang didukung.');

  const diff = await runTool('id', 'text-diff-checker', 'compare-text', { '#diff-original': 'Bab I\nBab II\nBab III', '#diff-changed': 'Bab I\nBab 2\nBab III\nLampiran' });
  assert.equal(diff('#diff-output').textContent, 'Baris 2:\n- Bab II\n+ Bab 2\n\nBaris 4:\n- (kosong)\n+ Lampiran');
  assert.equal(diff('#tool-status').textContent, '2 baris berbeda ditemukan.');
  const same = await runTool('id', 'text-diff-checker', 'compare-text', { '#diff-original': 'sama', '#diff-changed': 'sama' });
  assert.equal(same('#diff-output').textContent, 'Tidak ada perbedaan.');
  assert.equal(same('#tool-status').textContent, 'Kedua teks sama persis.');
});

test('id percentage calculator: comma decimals, dot grouping and copied answers', async () => {
  const get = await runTool('id', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '10,5', '#percent-base': '1.000,5',
    '#percent-part': '30', '#percent-whole': '200',
    '#percent-old': '1.500.000', '#percent-new': '1.200.000',
  });
  assert.equal(get('#percent-result').textContent, '105,0525');
  assert.equal(get('#what-percent-result').textContent, '15%');
  assert.equal(get('#change-result').textContent, '-20%');
  assert.equal(get('#tool-status').textContent, 'Perhitungan selesai.');
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, '10,5% dari 1.000,5 = 105,0525\n30 adalah 15% dari 200\nPerubahan dari 1.500.000 ke 1.200.000 = -20%');
  const discount = await runTool('id', 'percentage-calculator', 'calculate-percentage', { '#percent-value': '20', '#percent-base': '150.000' });
  assert.equal(discount('#percent-result').textContent, '30.000', 'FAQ: diskon 20% dari Rp150.000 = Rp30.000');
  const nothing = await runTool('id', 'text-case-converter', 'copy-output');
  await tick();
  assert.equal(nothing('#tool-status').textContent, 'Belum ada yang bisa disalin.');
});

test('id average, ratio, prime and unit converter: Indonesian number input', async () => {
  const average = await runTool('id', 'average-calculator', 'calculate-average', { '#average-input': '85,5; 90; 78' });
  assert.deepEqual(['#average-result', '#average-sum', '#average-count', '#average-min', '#average-max'].map((id) => String(average(id).textContent)), ['84,5', '253,5', '3', '78', '90']);
  assert.equal(average('#tool-status').textContent, 'Rata-rata berhasil dihitung di browser Anda.');
  const grouped = await runTool('id', 'average-calculator', 'calculate-average', { '#average-input': '1.000,5\n10,5' });
  assert.equal(grouped('#average-result').textContent, '505,5');
  const commaList = await runTool('id', 'average-calculator', 'calculate-average', { '#average-input': '10,20,30' });
  assert.equal(commaList('#tool-status').textContent, 'Masukkan angka yang valid, dipisahkan spasi, titik koma, atau baris baru.', 'comma is the decimal mark, not a separator');

  const recipe = await runTool('id', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '4', '#ratio-b': '250', '#ratio-c': '6' });
  assert.equal(String(recipe('#ratio-result').textContent), '375', 'FAQ: 4:250 = 6:X');
  assert.equal(recipe('#ratio-simplified').textContent, '2:125');
  const decimal = await runTool('id', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '2,5', '#ratio-b': '5', '#ratio-c': '10' });
  assert.equal(String(decimal('#ratio-result').textContent), '20');
  assert.equal(decimal('#ratio-simplified').textContent, '2,5:5');

  const prime = await runTool('id', 'prime-number-checker', 'check-prime', { '#prime-input': '1.000.003' });
  assert.equal(prime('#prime-output').textContent, 'Bilangan prima');
  assert.equal(prime('#tool-status').textContent, 'Bilangan berhasil dicek di browser Anda.');
  const notPrime = await runTool('id', 'prime-number-checker', 'check-prime', { '#prime-input': '1' });
  assert.equal(notPrime('#prime-output').textContent, 'Bukan bilangan prima');
  const tooBig = await runTool('id', 'prime-number-checker', 'check-prime', { '#prime-input': '1.000.000.000.001' });
  assert.equal(tooBig('#tool-status').textContent, 'Masukkan bilangan bulat dari 0 sampai 1.000.000.000.000.');

  const units = await runTool('id', 'unit-converter', null, { '#unit-category': 'length', '#unit-from': 'inch', '#unit-to': 'centimeter', '#unit-input': '1.000' });
  const labels = units('#unit-to').options.map((option) => option.text);
  assert.deepEqual(labels, ['Meter', 'Kilometer', 'Sentimeter', 'Milimeter', 'Inci (in)', 'Kaki (ft)', 'Yard (yd)', 'Mil (mi)']);
  units('#unit-to').selectedIndex = labels.indexOf('Sentimeter');
  units.click('convert-unit');
  assert.equal(units('#unit-output').textContent, '2.540 Sentimeter');
  assert.equal(units('#tool-status').textContent, 'Satuan berhasil dikonversi di browser Anda.');
});

test('id duration and date calculators: Indonesian words, grouping and long dates', async () => {
  const shift = await runTool('id', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-29T22:00', '#duration-end': '2026-09-30T06:00' });
  assert.deepEqual(['#duration-days', '#duration-hours', '#duration-exact'].map((id) => shift(id).textContent), ['0,333333', '8', '0 hari 8 jam 0 menit 0 detik']);
  assert.equal(shift('#tool-status').textContent, 'Durasi berhasil dihitung di browser Anda.');
  const project = await runTool('id', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-01T08:00', '#duration-end': '2026-09-03T17:30:15' });
  assert.deepEqual(['#duration-days', '#duration-hours', '#duration-exact'].map((id) => project(id).textContent), ['2,396007', '57,504167', '2 hari 9 jam 30 menit 15 detik']);
  const backwards = await runTool('id', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-30T06:00', '#duration-end': '2026-09-29T22:00' });
  assert.equal(backwards('#tool-status').textContent, 'Pilih waktu yang valid, dengan waktu selesai setelah waktu mulai.');

  const january = await runTool('id', 'date-calculator', 'date-difference', { '#date-start': '2026-01-01', '#date-end': '2026-01-31' });
  assert.equal(january('#date-difference-result').textContent, '30 hari', 'FAQ: 1–31 Januari = 30 hari');
  assert.equal(january('#tool-status').textContent, 'Selisih tanggal berhasil dihitung.');
  const long = await runTool('id', 'date-calculator', 'date-difference', { '#date-start': '2000-01-01', '#date-end': '2026-09-29' });
  assert.equal(long('#date-difference-result').textContent, '9.768 hari');
  const ahead = await runTool('id', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '90' });
  assert.equal(ahead('#date-offset-result').textContent, 'Senin, 28 Desember 2026');
  const back = await runTool('id', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '-30' });
  assert.equal(back('#date-offset-result').textContent, 'Minggu, 30 Agustus 2026');
  assert.equal(back('#tool-status').textContent, 'Tanggal berhasil dihitung.');
});

test('id timestamp and time zone converters: WIB defaults and id-ID output', async () => {
  const stamp = await runTool('id', 'timestamp-converter', 'from-timestamp', { '#timestamp-unix': '1710000000' });
  assert.equal(stamp('#tool-status').textContent, 'Konversi ke tanggal selesai.');
  stamp.click('copy-summary');
  await tick();
  assert.equal(stamp.context.copied, 'UTC: 2024-03-09T16:00:00.000Z\nWaktu lokal: 9 Mar 2024, 23.00.00');

  const zones = await runTool('id', 'time-zone-converter', null);
  assert.deepEqual([zones('#timezone-from').value, zones('#timezone-to').value], ['Asia/Jakarta', 'UTC'], 'opens on WIB → UTC');
  zones('#timezone-date').value = '2026-09-29T15:00';
  zones.click('convert-timezone');
  assert.equal(zones('#timezone-from-result').textContent, 'Selasa, 29 September 2026 pukul 15.00.00 WIB');
  assert.equal(zones('#timezone-to-result').textContent, 'Selasa, 29 September 2026 pukul 08.00.00 UTC');
  assert.equal(zones('#tool-status').textContent, 'Waktu berhasil dikonversi di browser Anda, termasuk penyesuaian waktu musim panas.');
});
