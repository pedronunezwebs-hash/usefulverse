import PDFDocument from 'pdfkit';
import { registerStdFonts } from 'pdfkit';
import Helvetica from 'pdfkit/standard-fonts/Helvetica';

registerStdFonts(Helvetica);

let document = null;
let chunks = [];
let pageCount = 0;
let documentError = null;

function respond(requestId, result = {}) {
  self.postMessage({ requestId, ...result });
}

self.addEventListener('message', (event) => {
  const { requestId, type } = event.data ?? {};
  try {
    if (type === 'start') {
      if (document) throw new Error('A PDF/A export is already in progress.');
      chunks = [];
      pageCount = 0;
      documentError = null;
      document = new PDFDocument({
        autoFirstPage: false,
        compress: true,
        pdfVersion: '1.4',
        subset: 'PDF/A-1b',
        info: { Title: 'Visual PDF/A-1b copy', Creator: 'UsefulVerse' },
      });
      document.on('data', (chunk) => chunks.push(chunk));
      document.on('error', (error) => { documentError = error; });
      respond(requestId, { type: 'started' });
      return;
    }
    if (!document) throw new Error('The PDF/A export has not started.');
    if (type === 'page') {
      const { width, height, image } = event.data;
      if (!(image instanceof ArrayBuffer) || !image.byteLength) throw new Error('A rendered page image is missing.');
      if (![width, height].every((value) => Number.isFinite(value) && value > 0)) throw new Error('The rendered page size is invalid.');
      document.addPage({ size: [width, height], margin: 0 });
      document.image(new Uint8Array(image), 0, 0, { width, height });
      pageCount += 1;
      respond(requestId, { type: 'page-added', pageCount });
      return;
    }
    if (type === 'finish') {
      if (!pageCount) throw new Error('The PDF has no pages to export.');
      const output = document;
      const outputChunks = chunks;
      const finished = new Promise((resolve, reject) => {
        output.once('end', resolve);
        output.once('error', reject);
      });
      output.end();
      finished.then(() => {
        if (documentError) throw documentError;
        const length = outputChunks.reduce((total, chunk) => total + chunk.byteLength, 0);
        const bytes = new Uint8Array(length);
        let offset = 0;
        for (const chunk of outputChunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        const buffer = bytes.buffer;
        document = null;
        chunks = [];
        pageCount = 0;
        documentError = null;
        self.postMessage({ requestId, type: 'finished', buffer }, [buffer]);
      }).catch((error) => respond(requestId, { type: 'error', message: error.message }));
      return;
    }
    throw new Error('Unknown PDF/A export action.');
  } catch (error) {
    respond(requestId, { type: 'error', message: error instanceof Error ? error.message : 'PDF/A export failed.' });
  }
});
