import assert from 'node:assert/strict';
import test from 'node:test';
import {
  addBusinessDays,
  addCalendarDays,
  buildIco,
  buildZip,
  calculateAge,
  calculateWeightedAverage,
  countBusinessDays,
  crc32,
  parseIsoDate,
  removeDuplicateLines,
  romanDate,
  toRomanNumeral,
} from './expanded-logic.mjs';

test('calendar date parsing rejects impossible dates and avoids time-zone drift', () => {
  assert.equal(addCalendarDays('2024-02-28', 1), '2024-02-29');
  assert.equal(addCalendarDays('2024-03-01', -1), '2024-02-29');
  assert.equal(addCalendarDays('0001-01-01', 1), '0001-01-02');
  assert.throws(() => parseIsoDate('2023-02-29'), /valid calendar date/);
  assert.throws(() => parseIsoDate('2024-13-01'), /valid calendar date/);
});

test('age calculator reports full calendar years, months and days', () => {
  assert.deepEqual(calculateAge('2000-01-15', '2024-03-20'), {
    years: 24, months: 2, days: 5, totalDays: 8831, nextBirthday: '2025-01-15',
  });
  assert.deepEqual(calculateAge('2004-02-29', '2021-02-28', 'feb28'), {
    years: 17, months: 0, days: 0, totalDays: 6209, nextBirthday: '2021-02-28',
  });
  assert.deepEqual(calculateAge('2004-02-29', '2021-02-28', 'march1'), {
    years: 16, months: 11, days: 30, totalDays: 6209, nextBirthday: '2021-03-01',
  });
  assert.throws(() => calculateAge('2025-01-01', '2024-12-31'), /before the birth date/);
});

test('business-day ranges support inclusive counting, custom weekends, and supplied holidays', () => {
  assert.equal(countBusinessDays('2026-09-25', '2026-09-28'), 2);
  assert.equal(countBusinessDays('2026-09-25', '2026-09-28', [0, 6], [], false), 1);
  assert.equal(countBusinessDays('2026-09-25', '2026-09-28', [0, 6], ['2026-09-25']), 1);
  assert.equal(countBusinessDays('2026-09-25', '2026-09-28', [5], []), 3);
  assert.throws(() => countBusinessDays('2026-09-29', '2026-09-28'), /on or after/);
  assert.throws(() => countBusinessDays('2026-09-25', '2026-09-28', [0, 1, 2, 3, 4, 5, 6]), /remain a working day/);
});

test('adding or subtracting business days excludes the start date and custom holidays', () => {
  assert.equal(addBusinessDays('2026-09-25', 1), '2026-09-28');
  assert.equal(addBusinessDays('2026-09-28', -1), '2026-09-25');
  assert.equal(addBusinessDays('2026-09-25', 1, [0, 6], ['2026-09-28']), '2026-09-29');
  assert.equal(addBusinessDays('2026-09-26', 0), '2026-09-26');
  assert.throws(() => addBusinessDays('2026-09-25', 1.5), /whole number/);
});

test('weighted average ignores neither zero weights nor decimal values and checks total weight', () => {
  assert.deepEqual(calculateWeightedAverage([{ value: 90, weight: 3 }, { value: 80, weight: 1 }]), {
    average: 87.5, weightedSum: 350, totalWeight: 4, count: 2, min: 80, max: 90,
  });
  assert.equal(calculateWeightedAverage([{ value: 100, weight: 0 }, { value: 75, weight: 2 }]).average, 75);
  assert.throws(() => calculateWeightedAverage([{ value: 90, weight: 0 }]), /total weight/);
  assert.throws(() => calculateWeightedAverage([{ value: 90, weight: -1 }]), /non-negative weight/);
});

test('duplicate-line removal preserves first-seen order and supports Excel tab-separated rows', () => {
  assert.deepEqual(removeDuplicateLines('Name\tScore\nAna\t8\nBob\t9\nAna\t8'), {
    lines: ['Name\tScore', 'Ana\t8', 'Bob\t9'], removed: 1,
  });
  assert.deepEqual(removeDuplicateLines(' A \na\nB', { trim: true, ignoreCase: true }), {
    lines: ['A', 'B'], removed: 1,
  });
  assert.equal(removeDuplicateLines('a\n\na').removed, 1);
});

test('Roman numeral conversion for dates is valid and follows an explicit date order', () => {
  assert.equal(toRomanNumeral(2026), 'MMXXVI');
  assert.equal(romanDate('2026-09-30', 'dmy'), 'XXX/IX/MMXXVI');
  assert.equal(romanDate('2026-09-30', 'mdy', '-'), 'IX-XXX-MMXXVI');
  assert.equal(romanDate('2026-09-30', 'ymd'), 'MMXXVI/IX/XXX');
  assert.throws(() => romanDate('5000-01-01'), /1 to 3,999/);
});

test('ICO builder writes a multi-size PNG icon directory', () => {
  const png = Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  const ico = buildIco([{ size: 16, bytes: png }, { size: 32, bytes: png }, { size: 48, bytes: png }]);
  const view = new DataView(ico.buffer);
  assert.equal(view.getUint16(0, true), 0);
  assert.equal(view.getUint16(2, true), 1);
  assert.equal(view.getUint16(4, true), 3);
  assert.equal(ico[6], 16);
  assert.equal(ico[22], 32);
  assert.equal(ico[38], 48);
  assert.throws(() => buildIco([{ size: 16, bytes: Uint8Array.of(1, 2, 3) }]), /not a PNG/);
});

test('ZIP builder writes stored UTF-8 entries with correct CRC and directory records', async () => {
  assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
  const archive = await buildZip([{ name: 'résultat.txt', data: 'hello' }, { name: 'image.bin', data: Uint8Array.of(0, 1, 2) }]);
  const view = new DataView(archive.buffer);
  assert.equal(view.getUint32(0, true), 0x04034b50);
  assert.equal(view.getUint32(archive.length - 22, true), 0x06054b50);
  assert.equal(view.getUint16(archive.length - 12, true), 2);
  assert.ok(new TextDecoder().decode(archive).includes('résultat.txt'));
});
