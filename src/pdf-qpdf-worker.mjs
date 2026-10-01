import createQpdfModule from '@neslinesli93/qpdf-wasm';
import { runQpdfTask } from './pdf-qpdf-logic.mjs';

self.onmessage = async ({ data }) => {
  const request = data ?? {};
  try {
    if (request.bytes instanceof ArrayBuffer) request.bytes = new Uint8Array(request.bytes);
    const workerUrl = new URL(self.location.href);
    const wasmUrl = new URL('./qpdf.wasm', workerUrl);
    wasmUrl.search = workerUrl.search;
    const qpdf = await createQpdfModule({ locateFile: () => wasmUrl.href, noInitialRun: true });
    const result = runQpdfTask(qpdf, request);
    const transferable = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength);
    self.postMessage({ type: 'result', bytes: transferable, action: request.action }, [transferable]);
  } catch (error) {
    const messages = {
      unlock: 'The password may be incorrect, or this PDF may use an unsupported feature.',
      repair: 'This PDF could not be rebuilt. The original file has not changed.',
      protect: 'This PDF could not be protected. Check the file and try again.',
    };
    self.postMessage({ type: 'error', message: messages[request.action] ?? 'This PDF could not be processed.' });
  } finally {
    request.password = '';
    request.confirmPassword = '';
    request.ownerPassword = '';
    if (data) {
      data.password = '';
      data.confirmPassword = '';
      data.ownerPassword = '';
    }
  }
};
