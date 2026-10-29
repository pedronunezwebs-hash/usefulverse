// Isolated foundation. Browser adapters/UI are deliberately separate from lifecycle logic.
export function pageSelection(value, total) {
  if (!Number.isSafeInteger(total) || total < 1) throw Error('EMPTY_DOCUMENT');
  const input = String(value ?? '').trim();
  if (!input || input.toLowerCase() === 'all') return Array.from({length:total}, (_, i) => i + 1);
  const pages = new Set();
  for (const part of input.split(',')) {
    const match = /^\s*([0-9]+)(?:\s*-\s*([0-9]+))?\s*$/u.exec(part);
    if (!match) throw Error('PAGE_RANGE');
    const first = Number(match[1]), last = Number(match[2] ?? match[1]);
    if (!Number.isSafeInteger(first) || !Number.isSafeInteger(last) || first < 1 || last < first || last > total) throw Error('PAGE_RANGE');
    for (let page = first; page <= last; page++) pages.add(page);
  }
  return [...pages].sort((a, b) => a - b);
}

export function pageText(items) {
  return items.filter(item => typeof item.str === 'string').map(item => item.str + (item.hasEOL ? '\n' : ' ')).join('').trim();
}

const stopped = () => new DOMException('OCR stopped', 'AbortError');
const check = signal => { if (signal?.aborted) throw stopped(); };
const release = async fn => { try { await fn?.(); } catch { /* Cleanup must not hide the original failure/cancellation. */ } };
const once = fn => { let promise; return () => promise ??= release(fn); };

// Attach a rejection handler even after cancellation. Resource acquisition has a
// separate late-release path, so a delayed decoder/model cannot escape ownership.
function waiting(promise, signal, lateRelease) {
  return new Promise((resolve, reject) => {
    let aborted = false;
    const abort = () => { aborted = true; reject(stopped()); };
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, {once:true});
    Promise.resolve(promise).then(value => {
      signal?.removeEventListener('abort', abort);
      if (aborted || signal?.aborted) { void release(() => lateRelease?.(value)); return; }
      resolve(value);
    }, error => { signal?.removeEventListener('abort', abort); reject(error); });
  });
}

/**
 * Processes one selected page at a time. onPage consumes the result immediately;
 * no raster/page/PDF-result array is retained here. UI must guard its own job IDs.
 * openDocument/renderPage/createOCR are explicit adapters, not mocked production.
 */
export async function runPdfOcr({range='all', mode='auto', searchablePDF=false, signal, onPage, onProgress=()=>{}}, {openDocument, renderPage, createOCR}) {
  if (!['auto','force','existing'].includes(mode) || typeof searchablePDF !== 'boolean' || typeof onPage !== 'function' || typeof onProgress !== 'function' || typeof openDocument !== 'function') throw Error('OPTIONS');
  check(signal);
  let document, worker, closeWorker = async () => {};
  const abortWorker = () => { void closeWorker(); };
  signal?.addEventListener('abort', abortWorker, {once:true});
  let completed = 0, ocrPages = 0;
  try {
    document = await waiting(openDocument(), signal, doc => doc.destroy());
    check(signal);
    const selected = pageSelection(range, document.numPages);
    onProgress({completed:0, total:selected.length, fraction:0});
    for (const number of selected) {
      check(signal);
      let page, rendered;
      try {
        page = await waiting(document.getPage(number), signal, p => p.cleanup());
        check(signal);
        const native = pageText((await waiting(page.getTextContent(), signal)).items);
        check(signal);
        let result = {number, text:native, source:'existing', confidence:null, pdf:null};
        if (mode === 'force' || (mode === 'auto' && !native)) {
          if (typeof createOCR !== 'function' || typeof renderPage !== 'function') throw Error('OCR_ADAPTER');
          rendered = await waiting(renderPage(page, {number,signal}), signal, r => r.release());
          check(signal);
          if (!worker) {
            worker = await waiting(createOCR({signal}), signal, w => w.terminate());
            closeWorker = once(() => worker.terminate());
          }
          check(signal);
          const recognized = await waiting(worker.recognize(rendered.image, {pdfTextOnly:false}, {text:true, pdf:searchablePDF}), signal);
          check(signal);
          const data = recognized.data;
          if (typeof data?.text !== 'string') throw Error('OCR_RESULT');
          if (searchablePDF && (!(data.pdf instanceof Uint8Array) || String.fromCharCode(...data.pdf.subarray(0,5)) !== '%PDF-')) throw Error('OCR_PDF_RESULT');
          result = {number, text:data.text.trim(), source:'ocr', confidence:Number.isFinite(data.confidence) ? data.confidence : null, pdf:searchablePDF ? data.pdf : null};
          ocrPages++;
        }
        check(signal);
        await waiting(onPage(result, {signal}), signal);
        check(signal);
        completed++;
        onProgress({completed,total:selected.length,fraction:completed/selected.length});
      } finally {
        await release(() => rendered?.release());
        await release(() => page?.cleanup());
      }
    }
    return {documentPages:document.numPages, selectedPages:selected.length, completedPages:completed, ocrPages};
  } finally {
    signal?.removeEventListener('abort', abortWorker);
    await closeWorker();
    await release(() => document?.destroy());
  }
}
