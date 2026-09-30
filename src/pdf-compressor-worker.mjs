import createQpdfModule from '@neslinesli93/qpdf-wasm';

self.onmessage = async ({ data }) => {
  const messages = [];
  try {
    const workerUrl = new URL(self.location.href);
    const wasmUrl = new URL('./qpdf.wasm', workerUrl);
    wasmUrl.search = workerUrl.search;
    const qpdf = await createQpdfModule({
      locateFile: () => wasmUrl.href,
      noInitialRun: true,
      print: (message) => messages.push(String(message)),
      printErr: (message) => messages.push(String(message)),
    });
    qpdf.FS.writeFile('/input.pdf', new Uint8Array(data.bytes));
    const exitCode = qpdf.callMain([
      '--object-streams=generate',
      '--recompress-flate',
      '--compression-level=9',
      '/input.pdf',
      '/output.pdf',
    ]);
    if (exitCode !== 0) throw new Error(messages.join('\n') || `QPDF exited with code ${exitCode}.`);
    const output = qpdf.FS.readFile('/output.pdf');
    const transferable = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength);
    self.postMessage({ type: 'result', bytes: transferable }, [transferable]);
  } catch (error) {
    self.postMessage({ type: 'error', message: messages.join('\n') || error?.message || 'This PDF could not be optimized.' });
  }
};
