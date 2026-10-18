import test from 'node:test';
import assert from 'node:assert/strict';
import { decodePhonetic, encodePhonetic, generateBinaryPuzzle, gradeFromPoints, graphPaperSvg, knittingGauge, norwayHolidayPay, validateBinaryGrid } from './logic.mjs';

test('knitting gauge scales dimensions and rounds to an explicit pattern multiple', () => {
  const result = knittingGauge({ stitches: 20, rows: 28, sampleWidthCm: 10, sampleHeightCm: 10, targetWidthCm: 51, targetHeightCm: 40, repeat: 4 });
  assert.equal(result.stitches, 104);
  assert.equal(result.rows, 112);
  assert.equal(result.widthAfterAdjustmentCm, 52);
  assert.throws(() => knittingGauge({ stitches: 0, rows: 28, sampleWidthCm: 10, sampleHeightCm: 10, targetWidthCm: 50, targetHeightCm: 40 }), /positive/u);
});

test('grade scale maps points by descending percentage thresholds', () => {
  const bands = [{ label: 'A', minimumPercent: 90 }, { label: 'B', minimumPercent: 80 }, { label: 'C', minimumPercent: 0 }];
  assert.equal(gradeFromPoints({ score: 45, maximum: 50, bands }).label, 'A');
  assert.equal(gradeFromPoints({ score: 40, maximum: 50, bands }).label, 'B');
  assert.throws(() => gradeFromPoints({ score: 51, maximum: 50, bands }), /between zero/u);
  assert.throws(() => gradeFromPoints({ score: 1, maximum: 2, bands: [{ label: 'A', minimumPercent: 50 }] }), /0%/u);
});

test('graph paper SVG retains physical size and bounds the page count', () => {
  const result = graphPaperSvg({ widthMm: 210, heightMm: 297, spacingMm: 5, marginMm: 10, style: 'grid', copies: 3 });
  assert.match(result.svg, /width="210mm" height="297mm"/u);
  assert.equal(result.innerWidthMm, 190);
  assert.equal(result.pages, 3);
  assert.throws(() => graphPaperSvg({ widthMm: 210, heightMm: 297, spacingMm: 5, marginMm: 110 }), /valid margins/u);
});

test('Binairo puzzle generation is reproducible, valid, and uniquely solvable', () => {
  for (const size of [6, 8, 10]) {
    const a = generateBinaryPuzzle({ size, seed: 9876, removals: Math.floor(size * size / 2) });
    const b = generateBinaryPuzzle({ size, seed: 9876, removals: Math.floor(size * size / 2) });
    assert.deepEqual(a.puzzle, b.puzzle);
    assert.equal(validateBinaryGrid(a.solution), true);
    assert.equal(a.blanks, Math.floor(size * size / 2));
  }
});

test('phonetic conversion follows NATO letter words, radio digits, preserves punctuation and flags nonstandard Norwegian letters', () => {
  const encoded = encodePhonetic('ABC 29. ÆØÅ');
  assert.equal(encoded.text, 'Alfa Bravo Charlie / Two Niner Stop / Æ Ø Å');
  assert.deepEqual(encoded.unsupported, ['Æ', 'Ø', 'Å']);
  assert.equal(decodePhonetic('Alfa Bravo Charlie / Two Niner Stop'), 'ABC 29.');
  assert.equal(decodePhonetic('mystery token'), 'mysterytoken');
});

test('Norway holiday pay uses the selected common rate and returns gross amounts only', () => {
  assert.equal(norwayHolidayPay({ holidayPayBasis: 500000 }).amount, 51000);
  assert.equal(norwayHolidayPay({ holidayPayBasis: 500000, fiveWeekAgreement: true }).rate, 12);
  assert.equal(norwayHolidayPay({ holidayPayBasis: 500000, age60Plus: true }).amount, 62500);
  assert.equal(norwayHolidayPay({ holidayPayBasis: 500000, age60Plus: true, fiveWeekAgreement: true }).amount, 71500);
  assert.throws(() => norwayHolidayPay({ holidayPayBasis: -1 }), /0 to/u);
});
