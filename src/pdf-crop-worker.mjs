import { PDFDocument } from 'pdf-lib';
import { cropPdfLocally } from './pdf-crop-logic.mjs';

self.onmessage = async ({ data }) => {
  try {
    const bytes = data?.bytes instanceof ArrayBuffer ? new Uint8Array(data.bytes) : data?.bytes;
    const result = await cropPdfLocally(PDFDocument, bytes, data?.margins);
    const transferable = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
    self.postMessage({ type: 'result', bytes: transferable }, [transferable]);
  } catch (error) {
    const publicErrors = new Set([
      'Rotate pages to 0° before cropping this PDF.',
      'The margins are too large for at least one page.',
    ]);
    const message = error instanceof Error && publicErrors.has(error.message) ? error.message : 'This PDF could not be cropped.';
    self.postMessage({ type: 'error', message });
  }
};
