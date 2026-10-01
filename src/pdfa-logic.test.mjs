import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { MAX_PDFA_BYTES, MAX_PDFA_PIXELS, pdfaPixelPlan, validatePdfAInput } from './pdfa-logic.mjs';

test('PDF/A raster plan supports only the published resolutions and applies pixel budgets', () => {
  const plan = pdfaPixelPlan([{ width: 612, height: 792 }, { width: 841.89, height: 595.28 }], 150);
  assert.equal(plan.pages.length, 2);
  assert.ok(plan.totalPixels < MAX_PDFA_PIXELS);
  assert.equal(plan.pages[0].width, 1275);
  assert.equal(plan.pages[0].height, 1650);
  assert.throws(() => pdfaPixelPlan([{ width: 612, height: 792 }], 300), /resolution/u);
  assert.throws(() => pdfaPixelPlan(Array.from({ length: 101 }, () => ({ width: 612, height: 792 })), 150), /100 pages/u);
  assert.throws(() => pdfaPixelPlan([{ width: 100_000, height: 100_000 }], 100), /too large/u);
  assert.throws(() => pdfaPixelPlan(Array.from({ length: 15 }, () => ({ width: 612, height: 792 })), 200), /too much memory/u);
});

test('PDF/A input validation accepts a PDF header and rejects wrong type and oversize input', () => {
  const valid = new Uint8Array(16);
  valid.set(new TextEncoder().encode('%PDF-1.7'));
  assert.doesNotThrow(() => validatePdfAInput(valid));
  assert.throws(() => validatePdfAInput(new Uint8Array(16)), /valid PDF/u);
  assert.throws(() => validatePdfAInput(new Uint8Array(MAX_PDFA_BYTES + 1)), /50 MB/u);
});

test('PDF/A worker registers the font data required by current PDFKit browser builds', async () => {
  const worker = await readFile(new URL('./pdfa-worker.mjs', import.meta.url), 'utf8');
  assert.match(worker, /registerStdFonts\(Helvetica\)/u);
  assert.match(worker, /subset:\s*'PDF\/A-1b'/u);
  assert.match(worker, /document\.image\(/u);
});
