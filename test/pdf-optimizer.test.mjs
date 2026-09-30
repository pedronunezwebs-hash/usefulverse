import assert from 'node:assert/strict';
import { test } from 'node:test';
import createQpdfModule from '@neslinesli93/qpdf-wasm';
import { PDFDocument } from 'pdf-lib';

test('QPDF structural optimization returns a smaller, readable PDF without mutating the source', async () => {
  const source = await PDFDocument.create();
  const page = source.addPage([612, 792]);
  for (let index = 0; index < 800; index += 1) {
    page.drawText('Repeated text exercises local PDF stream recompression.', {
      x: 30,
      y: 30 + (index % 700),
      size: 8,
    });
  }

  const original = await source.save({ useObjectStreams: false });
  const originalSnapshot = new Uint8Array(original);
  const qpdf = await createQpdfModule({
    locateFile: () => new URL('../node_modules/@neslinesli93/qpdf-wasm/dist/qpdf.wasm', import.meta.url).href,
    noInitialRun: true,
  });
  qpdf.FS.writeFile('/input.pdf', original);
  const exitCode = qpdf.callMain([
    '--object-streams=generate',
    '--recompress-flate',
    '--compression-level=9',
    '/input.pdf',
    '/output.pdf',
  ]);
  const optimized = qpdf.FS.readFile('/output.pdf');
  const reopened = await PDFDocument.load(optimized);

  assert.equal(exitCode, 0);
  assert.equal(reopened.getPageCount(), 1);
  assert.ok(optimized.byteLength < original.byteLength);
  assert.deepEqual(original, originalSnapshot);

  const inspectExitCode = qpdf.callMain([
    '--qdf',
    '--object-streams=disable',
    '/output.pdf',
    '/inspect.pdf',
  ]);
  const inspectablePdf = new TextDecoder('latin1').decode(qpdf.FS.readFile('/inspect.pdf'));
  assert.equal(inspectExitCode, 0);
  assert.match(inspectablePdf, /Repeated text exercises local PDF stream recompression\./u);
});
