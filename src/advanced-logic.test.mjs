import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateContrastRatio,
  calculateDiscount,
  calculateFloorArea,
  calculateGpa,
  calculateRequiredFinalGrade,
  calculateStandardDeviation,
  calculateTipSplit,
  detectCsvDelimiter,
  parseCsv,
  parseHexColor,
  parseLocalizedNumber,
  parsePageRanges,
  findDiscount,
  normalizeRetailBarcode,
} from './advanced-logic.mjs';

test('standard deviation distinguishes sample from population and handles constant data', () => {
  assert.deepEqual(calculateStandardDeviation([1, 2, 3]), {
    count: 3, mean: 2, variance: 2 / 3, standardDeviation: Math.sqrt(2 / 3), type: 'population',
  });
  assert.deepEqual(calculateStandardDeviation([1, 2, 3], 'sample'), {
    count: 3, mean: 2, variance: 1, standardDeviation: 1, type: 'sample',
  });
  assert.equal(calculateStandardDeviation([7, 7, 7]).standardDeviation, 0);
  assert.throws(() => calculateStandardDeviation([1], 'sample'), /at least two/);
  assert.throws(() => calculateStandardDeviation([1, Number.NaN]), /finite numbers/);
});

test('discount calculator handles sale and reverse percentage calculations with bounds', () => {
  assert.deepEqual(calculateDiscount(100, 20), { originalPrice: 100, discountPercent: 20, saved: 20, salePrice: 80 });
  assert.deepEqual(findDiscount(100, 80), { originalPrice: 100, salePrice: 80, saved: 20, discountPercent: 20 });
  assert.deepEqual(calculateDiscount(0, 0), { originalPrice: 0, discountPercent: 0, saved: 0, salePrice: 0 });
  assert.throws(() => calculateDiscount(100, 101), /between 0 and 100/);
  assert.throws(() => findDiscount(100, 101), /between zero and the original/);
});

test('floor area converts dimensions and adds a configurable waste allowance', () => {
  const area = calculateFloorArea(12, 10, 'ft', 10);
  assert.equal(area.areaSquareFeet, 120);
  assert.equal(Number(area.areaSquareMeters.toFixed(6)), 11.148365);
  assert.equal(area.areaWithWasteSquareFeet, 132);
  assert.equal(calculateFloorArea(120, 100, 'in').areaSquareFeet, 83.33333333333333);
  assert.throws(() => calculateFloorArea(0, 10), /greater than zero/);
  assert.throws(() => calculateFloorArea(10, 10, 'ft', 101), /between 0 and 100/);
});

test('retail barcode normalization adds or validates EAN-13 and UPC-A check digits', () => {
  assert.equal(normalizeRetailBarcode('400638133393', 'EAN13'), '4006381333931');
  assert.equal(normalizeRetailBarcode('4006381333931', 'EAN13'), '4006381333931');
  assert.equal(normalizeRetailBarcode('03600029145', 'UPC'), '036000291452');
  assert.throws(() => normalizeRetailBarcode('4006381333932', 'EAN13'), /check digit/);
  assert.throws(() => normalizeRetailBarcode('123', 'UPC'), /needs 11 digits/);
});

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

test('required final grade accounts for exam weight and reports unattainable targets', () => {
  assert.deepEqual(calculateRequiredFinalGrade(80, 40, 90), { required: 105, alreadyReached: false, attainable: false });
  assert.deepEqual(calculateRequiredFinalGrade(80, 40, 80), { required: 80, alreadyReached: false, attainable: true });
  assert.deepEqual(calculateRequiredFinalGrade(90, 20, 80), { required: 40, alreadyReached: false, attainable: true });
  assert.deepEqual(calculateRequiredFinalGrade(90, 20, 70), { required: 0, alreadyReached: true, attainable: true });
  assert.throws(() => calculateRequiredFinalGrade(80, 0, 90), /final exam weight/);
  assert.throws(() => calculateRequiredFinalGrade(101, 20, 90), /Grades must/);
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
