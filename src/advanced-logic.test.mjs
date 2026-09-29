import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateContrastRatio,
  calculateGpa,
  calculateTipSplit,
  detectCsvDelimiter,
  parseCsv,
  parseHexColor,
  parseLocalizedNumber,
  parsePageRanges,
} from './advanced-logic.mjs';

test('HEX parser accepts short and full colors and rejects invalid values', () => {
  assert.deepEqual(parseHexColor('#abc'), [170, 187, 204]);
  assert.deepEqual(parseHexColor('000000'), [0, 0, 0]);
  assert.throws(() => parseHexColor('#12xz'), /HEX/);
});

test('contrast follows WCAG luminance thresholds', () => {
  const blackOnWhite = calculateContrastRatio('#000', '#fff');
  assert.equal(Number(blackOnWhite.ratio.toFixed(2)), 21);
  assert.equal(blackOnWhite.aaNormal, true);
  assert.equal(blackOnWhite.aaaNormal, true);
  assert.equal(calculateContrastRatio('#777', '#fff').aaNormal, false);
});

test('tip split validates inputs and accounts for the tip in the total', () => {
  assert.deepEqual(calculateTipSplit(80, 15, 4), { tip: 12, total: 92, tipPerPerson: 3, totalPerPerson: 23, people: 4 });
  assert.throws(() => calculateTipSplit(0, 15, 2), /bill amount/);
  assert.throws(() => calculateTipSplit(20, 15, 0), /people/);
});

test('GPA is weighted by credits and rejects missing or invalid course values', () => {
  assert.deepEqual(calculateGpa([{ grade: 'A', credits: 3 }, { grade: 'B', credits: 1 }]), { gpa: 3.75, totalCredits: 4, courses: 2 });
  assert.throws(() => calculateGpa([]), /at least one course/);
  assert.throws(() => calculateGpa([{ grade: 'A', credits: 0 }]), /credits/);
});

test('localized bill inputs accept decimal and grouping marks without confusing either', () => {
  assert.equal(parseLocalizedNumber('1,234.56', 'en-US'), 1234.56);
  assert.equal(parseLocalizedNumber('1.234,56', 'de-DE'), 1234.56);
  assert.equal(parseLocalizedNumber('1,5', 'de-DE'), 1.5);
  assert.equal(parseLocalizedNumber('12,34,567.8', 'hi-IN'), 1234567.8);
  assert.equal(parseLocalizedNumber('12,34,567.8', 'en-US'), 1234567.8);
  assert.equal(parseLocalizedNumber('١٬٢٣٤٫٥', 'ar'), 1234.5);
  assert.equal(parseLocalizedNumber('invalid', 'en'), Number.NaN);
});

test('CSV parser handles quoted delimiters, escaped quotes, line breaks and alternate separators', () => {
  const csv = 'name;note;age\r\n"Ana; Lee";"says ""hello""\nand hi";8\r\nBob;plain;9\r\n';
  assert.equal(detectCsvDelimiter(csv), ';');
  assert.deepEqual(parseCsv(csv), {
    headers: ['name', 'note', 'age'],
    rows: [['Ana; Lee', 'says "hello"\nand hi', '8'], ['Bob', 'plain', '9']],
    delimiter: ';',
  });
  assert.deepEqual(parseCsv('a,b\n1,2').rows, [['1', '2']]);
  assert.throws(() => parseCsv('a,b\n"unfinished,2'), /closing quote/);
});

test('CSV parser applies row and column safety limits', () => {
  assert.throws(() => parseCsv('a\n1\n2', ',', { maxRows: 2 }), /more than 1 data rows/);
  assert.throws(() => parseCsv('a,b,c', ',', { maxColumns: 2 }), /more than 2 columns/);
  assert.throws(() => parseCsv('a,b\n1,2', ',', { maxCells: 3 }), /more than 3 cells/);
  assert.throws(() => parseCsv('a,b\n"1"oops,2'), /Unexpected text/);
  assert.throws(() => parseCsv('a,b\n1"oops,2'), /inside an unquoted CSV field/);
  assert.throws(() => parseCsv('a,b\n1,2,3'), /more values than the header/);
});

test('PDF page ranges are one-based, grouped, bounded and cannot duplicate pages', () => {
  assert.deepEqual(parsePageRanges('1-3, 5', 6), [[0, 1, 2], [4]]);
  assert.throws(() => parsePageRanges('0, 2', 5), /between 1 and 5/);
  assert.throws(() => parsePageRanges('1-3,3', 5), /more than once/);
  assert.throws(() => parsePageRanges('2-x', 5), /page numbers/);
  assert.throws(() => parsePageRanges('1,2,3', 5, 200, 2), /no more than 2 PDF files/);
});
