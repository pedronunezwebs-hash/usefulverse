import { PDFDocument } from 'pdf-lib';
import { bookletPageOrder, bookletSheetSize, PDF_IMPOSITION_LIMITS } from './logic.mjs';
self.addEventListener('message', async ({ data }) => {
  if (data?.type !== 'impose') return;
  try {
    const bytes = data.bytes instanceof ArrayBuffer ? new Uint8Array(data.bytes) : new Uint8Array(data.bytes);
    if (!bytes.length || bytes.byteLength > PDF_IMPOSITION_LIMITS.bytes) throw Object.assign(new Error('file-limit'), { code: 'file-limit' });
    if (new TextDecoder().decode(bytes.subarray(0,5)) !== '%PDF-') throw Object.assign(new Error('invalid-pdf'), { code: 'invalid-pdf' });
    const source = await PDFDocument.load(bytes, { updateMetadata: false });
    const pages = source.getPages();
    if (!pages.length || pages.length > PDF_IMPOSITION_LIMITS.pages) throw Object.assign(new Error('page-limit'), { code: 'page-limit' });
    if (pages.some((page) => page.getRotation().angle !== 0)) throw Object.assign(new Error('rotated-pages'), { code: 'rotated-pages' });
    const order = bookletPageOrder(pages.length, data.binding);
    const sheet = bookletSheetSize(pages.map((page) => page.getSize()), data.gutterMm);
    const output = await PDFDocument.create();
    const copiedPages = await output.copyPages(source, pages.map((_, index) => index));
    const embedded = await output.embedPages(copiedPages);
    for (const side of order) {
      const page = output.addPage([sheet.width, sheet.height]);
      side.pages.forEach((sourceIndex, slot) => {
        if (sourceIndex === null) return;
        const image = embedded[sourceIndex];
        const slotWidth = (sheet.width - sheet.gutter) / 2;
        const scale = Math.min(slotWidth / image.width, sheet.height / image.height);
        const width = image.width * scale, height = image.height * scale;
        const x = slot === 0 ? (slotWidth - width) / 2 : slotWidth + sheet.gutter + (slotWidth - width) / 2;
        page.drawPage(image, { x, y: (sheet.height - height) / 2, xScale: scale, yScale: scale });
      });
    }
    const result = await output.save({ useObjectStreams: true });
    const resultBuffer = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
    self.postMessage({ ok: true, bytes: resultBuffer, pageCount: pages.length, sheetCount: order.length / 2 }, [resultBuffer]);
  } catch (error) {
    self.postMessage({ ok: false, code: error?.code || 'imposition-failed' });
  }
});
