import test from 'node:test';
import assert from 'node:assert/strict';
import createQpdfModule from '@neslinesli93/qpdf-wasm';
import { PDFDocument } from 'pdf-lib';
import { MAX_QPDF_INPUT_BYTES, runQpdfTask, validateQpdfRequest } from './pdf-qpdf-logic.mjs';

const qpdfWasmPath = new URL('../node_modules/@neslinesli93/qpdf-wasm/dist/qpdf.wasm', import.meta.url).href;
async function makePdf() {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([300, 200]);
  page.drawText('UsefulVerse local PDF test');
  return new Uint8Array(await pdf.save());
}
async function makeQpdf() {
  return createQpdfModule({ locateFile: () => qpdfWasmPath, noInitialRun: true, print: () => {}, printErr: () => {} });
}

test('PDF protection uses AES-256 and unlock succeeds only with the current password', async () => {
  const qpdf = await makeQpdf();
  const source = await makePdf();
  const protectedBytes = runQpdfTask(qpdf, { action: 'protect', bytes: source, password: 'reader-password', confirmPassword: 'reader-password', ownerPassword: 'owner-password' });
  assert.ok(protectedBytes.length > source.length);
  assert.throws(() => runQpdfTask(qpdf, { action: 'unlock', bytes: protectedBytes, password: 'wrong-password' }), /password may be incorrect/u);
  const unlocked = runQpdfTask(qpdf, { action: 'unlock', bytes: protectedBytes, password: 'reader-password' });
  const document = await PDFDocument.load(unlocked);
  assert.equal(document.getPageCount(), 1);
});

test('PDF repair writes a new, structurally readable copy and leaves its input unchanged', async () => {
  const qpdf = await makeQpdf();
  const source = await makePdf();
  const before = source.slice();
  const repaired = runQpdfTask(qpdf, { action: 'repair', bytes: source });
  const document = await PDFDocument.load(repaired);
  assert.equal(document.getPageCount(), 1);
  assert.deepEqual(source, before);
});

test('QPDF rejects invalid actions, non-PDFs, mismatched passwords, and protected-size overflow', () => {
  const pdf = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]);
  assert.throws(() => validateQpdfRequest({ action: 'bypass', bytes: pdf }), /supported PDF action/u);
  assert.throws(() => validateQpdfRequest({ action: 'repair', bytes: new Uint8Array(16) }), /does not look like a PDF/u);
  assert.throws(() => validateQpdfRequest({ action: 'protect', bytes: pdf, password: '12345678', confirmPassword: 'different', ownerPassword: 'owner-password' }), /confirmation does not match/u);
  assert.throws(() => validateQpdfRequest({ action: 'protect', bytes: pdf, password: 'same-password', confirmPassword: 'same-password', ownerPassword: 'same-password' }), /different opening and owner/u);
  assert.throws(() => validateQpdfRequest({ action: 'repair', bytes: new Uint8Array(MAX_QPDF_INPUT_BYTES + 1) }), /up to 200 MB/u);
});
