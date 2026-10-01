import test from 'node:test';
import assert from 'node:assert/strict';
import { degrees, PDFDocument } from 'pdf-lib';
import { cropPdfLocally, MAX_PDF_CROP_BYTES } from './pdf-crop-logic.mjs';

async function makePdf(size = [612, 792]) {
  const document = await PDFDocument.create();
  document.addPage(size);
  return new Uint8Array(await document.save());
}

test('PDF crop applies millimeter margins to every page and keeps the source unchanged', async () => {
  const source = await makePdf();
  const original = source.slice();
  const output = await cropPdfLocally(PDFDocument, source, { top: 10, right: 5, bottom: 10, left: 5 });
  const cropped = await PDFDocument.load(output);
  const box = cropped.getPage(0).getCropBox();
  const points = (mm) => (mm * 72) / 25.4;
  assert.ok(Math.abs(box.width - (612 - points(10))) < 0.01);
  assert.ok(Math.abs(box.height - (792 - points(20))) < 0.01);
  assert.deepEqual(source, original);
});

test('PDF crop rejects bad PDF, invalid margins, rotated pages and margins that consume the page', async () => {
  await assert.rejects(cropPdfLocally(PDFDocument, new Uint8Array(16), { top: 0, right: 0, bottom: 0, left: 0 }), /does not look like a PDF/u);
  const source = await makePdf([20, 20]);
  await assert.rejects(cropPdfLocally(PDFDocument, source, { top: -1, right: 0, bottom: 0, left: 0 }), /0 to 500/u);
  await assert.rejects(cropPdfLocally(PDFDocument, source, { top: 0, right: 0, bottom: 0, left: 100 }), /too large/u);
  const rotated = await PDFDocument.load(source);
  rotated.getPage(0).setRotation(degrees(90));
  await assert.rejects(cropPdfLocally(PDFDocument, new Uint8Array(await rotated.save()), { top: 0, right: 0, bottom: 0, left: 0 }), /Rotate pages to 0/u);
  await assert.rejects(cropPdfLocally(PDFDocument, new Uint8Array(MAX_PDF_CROP_BYTES + 1), {}), /up to 100 MB/u);
});
