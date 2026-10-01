import { calculateCompoundInterest, calculateLoan, evaluateScientificExpression, inspectZipArchive } from './tool-suite-logic.mjs';
import { MAX_PDF_REDACT_BYTES, MAX_PDF_REDACT_PAGES, normalizeRedactionRect, redactionPixelPlan, validateRedactionInput } from './pdf-redact-logic.mjs';
import { MAX_PDFA_BYTES, MAX_PDFA_PAGES, pdfaPixelPlan, validatePdfAInput } from './pdfa-logic.mjs';
import { createImageSlidesPptx, createXlsx, PDF_OFFICE_MIME, pdfTextPagesToRows, pptxToPrintHtml, xlsxToPrintHtml } from './pdf-office.mjs';
import { normalizeVisualEditRect, PDF_VISUAL_EDIT_LIMITS, validateVisualEditInput, validateVisualReplacementImage, visualEditPixelPlan } from './pdf-visual-edit-logic.mjs';
import { strToU8, unzipSync, zipSync } from 'fflate';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const localeData = window.usefulverseLocale ?? {};
const strings = { ...(localeData.messages ?? {}), ...(localeData.runtime ?? {}) };
const t = (message) => strings[message] ?? message;
const version = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${version ? `${path.includes('?') ? '&' : '?'}v=${version}` : ''}`;
const lang = localeData.tag ?? localeData.code ?? document.documentElement.lang ?? 'en-US';

function status(root, message, kind = '') {
  const element = $('#tool-status', root);
  if (!element) return;
  element.textContent = t(message);
  element.className = `tool-status${kind ? ` is-${kind}` : ''}`;
}

function errorMessage(error) {
  if (document.documentElement.lang.toLowerCase().startsWith('en')) return error instanceof Error ? error.message : String(error);
  return t('Check the selected file and settings, then try again.');
}

function makeDownload(container, blob, filename, label = 'Download', append = false) {
  if (!append) {
    for (const old of $$('a[data-suite-download]', container)) URL.revokeObjectURL(old.href);
    container.replaceChildren();
  }
  const link = document.createElement('a');
  link.className = 'button button--ghost file-download';
  link.dataset.suiteDownload = '';
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.textContent = `${t(label)} · ${new Intl.NumberFormat(lang, { style: 'unit', unit: 'megabyte', maximumFractionDigits: 2 }).format(blob.size / 1_000_000)}`;
  container.append(link);
}

function loadPdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = versioned('/assets/vendor/pdf-lib.min.js');
    script.onload = () => window.PDFLib ? resolve(window.PDFLib) : reject(new Error('PDF library did not load.'));
    script.onerror = () => reject(new Error('PDF library could not load. Check your connection and try again.'));
    document.head.append(script);
  });
}

let domPurifyPromise;
function loadDomPurify() {
  if (window.DOMPurify) return Promise.resolve(window.DOMPurify);
  domPurifyPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = versioned('/assets/vendor/purify.min.js');
    script.onload = () => window.DOMPurify ? resolve(window.DOMPurify) : reject(new Error('The HTML safety filter could not start.'));
    script.onerror = () => reject(new Error('The HTML safety filter could not load. Check your connection and try again.'));
    document.head.append(script);
  });
  return domPurifyPromise;
}

let pdfJsPromise;
function loadPdfJs() {
  pdfJsPromise ??= import(versioned('/assets/vendor/pdf.min.mjs')).then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = versioned('/assets/vendor/pdf.worker.min.mjs');
    return pdfjs;
  });
  return pdfJsPromise;
}

function clearLinks(root) {
  const output = $('#suite-downloads', root);
  if (!output) return;
  for (const link of $$('a[data-suite-download]', output)) URL.revokeObjectURL(link.href);
  output.replaceChildren();
}

function safeFileName(name, extension) {
  return `${name.replace(/\.[^.]+$/u, '').replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 80) || 'usefulverse'}${extension}`;
}

function processPdfInWorker(action, bytes, passwords, onWorker) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(versioned('/assets/vendor/pdf-qpdf-worker.mjs'), { type: 'module' });
    let settled = false;
    const cleanup = () => {
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      worker.terminate();
      onWorker(null, null);
    };
    const finish = (handler, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      handler(value);
    };
    const cancel = () => {
      const error = new Error(t('Processing stopped. No new file was saved.'));
      error.code = 'CANCELLED';
      finish(reject, error);
    };
    const onMessage = ({ data }) => {
      if (data?.type === 'result' && data.bytes instanceof ArrayBuffer) finish(resolve, new Uint8Array(data.bytes));
      else finish(reject, new Error(data?.message || t('This PDF could not be processed.')));
    };
    const onError = () => finish(reject, new Error(t('The local PDF engine could not start. Check your connection and try again.')));
    onWorker(worker, cancel);
    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    const transferable = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    try { worker.postMessage({ action, bytes: transferable, ...passwords }, [transferable]); }
    catch (error) { finish(reject, error); }
  });
}

function setupQpdfTool(root, fixedAction = '') {
  const isProtection = !fixedAction;
  const input = $(`#suite-${isProtection ? 'security' : 'repair'}-file`, root);
  const actionSelect = isProtection ? $('#suite-security-action', root) : null;
  const password = isProtection ? $('#suite-security-password', root) : null;
  const confirm = isProtection ? $('#suite-security-confirm', root) : null;
  const owner = isProtection ? $('#suite-security-owner', root) : null;
  const runButton = $('[data-action="run-qpdf"], [data-action="repair-pdf"]', root);
  const cancelButton = $('[data-action="cancel-qpdf"]', root);
  const downloads = $('#suite-downloads', root);
  let activeWorker = null;
  let activeCancel = null;
  let busy = false;

  const currentAction = () => fixedAction || actionSelect.value;
  const clearPasswords = () => { if (password) password.value = ''; if (confirm) confirm.value = ''; if (owner) owner.value = ''; };
  const clear = () => {
    activeCancel?.(); activeWorker?.terminate(); activeWorker = null; activeCancel = null; busy = false;
    input.value = ''; clearPasswords(); clearLinks(root);
    for (const control of [input, actionSelect, password, confirm, owner, runButton]) if (control) control.disabled = false;
    cancelButton.disabled = true;
    status(root, 'Choose a PDF to start.');
  };
  const updateAction = () => {
    if (!isProtection) return;
    const protecting = currentAction() === 'protect';
    $('#suite-security-password-label', root).firstChild.textContent = t(protecting ? 'Password to open the PDF' : 'Current PDF password');
    $('#suite-security-password', root).autocomplete = protecting ? 'new-password' : 'current-password';
    $('#suite-security-confirm-label', root).hidden = !protecting;
    $('#suite-security-owner-label', root).hidden = !protecting;
    $('#suite-security-hint', root).textContent = t(protecting
      ? 'Use different passwords, and keep them somewhere safe. If you lose them, this tool cannot recover them.'
      : 'This removes encryption only when you know the current password. It does not bypass or guess passwords.');
    runButton.textContent = t(protecting ? 'Protect PDF' : 'Remove password');
    clearPasswords(); clearLinks(root);
  };

  if (actionSelect) actionSelect.addEventListener('change', updateAction);
  input.addEventListener('change', () => clearLinks(root));
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'clear') { clear(); return; }
    if (actionName === 'cancel-qpdf') {
      activeCancel?.(); return;
    }
    if (busy || (actionName !== 'run-qpdf' && actionName !== 'repair-pdf')) return;
    const file = input.files?.[0];
    if (!file) return status(root, 'Choose a PDF to start.', 'error');
    if (file.size > 200 * 1024 * 1024) return status(root, 'Choose a PDF of 200 MB or less to help protect browser memory.', 'error');
    const selectedAction = currentAction();
    const credentials = selectedAction === 'protect'
      ? { password: password.value, confirmPassword: confirm.value, ownerPassword: owner.value }
      : selectedAction === 'unlock' ? { password: password.value } : {};
    if (selectedAction === 'protect' && (credentials.password.length < 8 || credentials.ownerPassword.length < 8)) return status(root, 'Both passwords must have at least 8 characters.', 'error');
    if (selectedAction === 'protect' && credentials.password !== credentials.confirmPassword) return status(root, 'The password confirmation does not match.', 'error');
    if (selectedAction === 'protect' && credentials.password === credentials.ownerPassword) return status(root, 'Choose different opening and owner passwords.', 'error');
    if (selectedAction === 'unlock' && !credentials.password) return status(root, 'Enter the current PDF password.', 'error');

    busy = true; clearLinks(root); runButton.disabled = true; cancelButton.disabled = false;
    input.disabled = true; if (actionSelect) actionSelect.disabled = true;
    for (const control of [password, confirm, owner]) if (control) control.disabled = true;
    status(root, t({ protect: 'Adding AES-256 password protection on your device…', unlock: 'Removing the known password on your device…', repair: 'Trying to rebuild the PDF on your device…' }[selectedAction]));
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await processPdfInWorker(selectedAction, bytes, credentials, (worker, cancel) => { activeWorker = worker; activeCancel = cancel; });
      const suffix = { protect: '-protected.pdf', unlock: '-unlocked.pdf', repair: '-repaired.pdf' }[selectedAction];
      makeDownload(downloads, new Blob([result], { type: 'application/pdf' }), safeFileName(file.name, suffix), 'Download PDF');
      status(root, t({ protect: 'A password-protected copy is ready. Keep both passwords safe; the original is unchanged.', unlock: 'An unlocked copy is ready. The original is unchanged.', repair: 'A rebuilt copy passed a basic structure check. Open and review it; repair cannot restore missing content.' }[selectedAction]), 'success');
    } catch (error) {
      if (error?.code === 'CANCELLED') status(root, 'Processing stopped. No new file was saved.');
      else status(root, t(error instanceof Error ? error.message : 'This PDF could not be processed.'), 'error');
    } finally {
      activeWorker?.terminate(); activeWorker = null; activeCancel = null; busy = false; clearPasswords();
      for (const control of [input, actionSelect, runButton]) if (control) control.disabled = false;
      cancelButton.disabled = true;
    }
  });
  updateAction();
}

function setupPdfCrop(root) {
  const input = $('#suite-crop-file', root);
  const controls = ['top', 'right', 'bottom', 'left'].map((side) => $(`#suite-crop-${side}`, root));
  const run = $('[data-action="crop-pdf"]', root);
  const cancel = $('[data-action="cancel-crop-pdf"]', root);
  const downloads = $('#suite-downloads', root);
  let worker = null;
  let cancelTask = null;
  let busy = false;

  const reset = () => {
    cancelTask?.(); worker?.terminate(); worker = null; cancelTask = null; busy = false;
    input.value = ''; controls.forEach((control) => { control.value = '0'; control.disabled = false; });
    input.disabled = false; run.disabled = false; cancel.disabled = true; clearLinks(root);
    status(root, 'Choose a PDF to start.');
  };
  input.addEventListener('change', () => clearLinks(root));
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { reset(); return; }
    if (action === 'cancel-crop-pdf') { cancelTask?.(); return; }
    if (busy || action !== 'crop-pdf') return;
    const file = input.files?.[0];
    if (!file) return status(root, 'Choose a PDF to start.', 'error');
    if (file.size > 100 * 1024 * 1024) return status(root, 'Choose a PDF of 100 MB or less.', 'error');
    const margins = Object.fromEntries(['top', 'right', 'bottom', 'left'].map((side, index) => [side, Number(controls[index].value)]));
    if (Object.values(margins).some((value) => !Number.isFinite(value) || value < 0 || value > 500)) return status(root, 'Enter margins from 0 to 500 mm.', 'error');

    busy = true; clearLinks(root); run.disabled = true; cancel.disabled = false;
    input.disabled = true; controls.forEach((control) => { control.disabled = true; });
    status(root, 'Cropping PDF pages on your device…');
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const result = await new Promise((resolve, reject) => {
        worker = new Worker(versioned('/assets/vendor/pdf-crop-worker.mjs'), { type: 'module' });
        let settled = false;
        const cleanup = () => { worker?.terminate(); worker = null; cancelTask = null; };
        const finish = (handler, value) => { if (settled) return; settled = true; cleanup(); handler(value); };
        const onMessage = ({ data }) => data?.type === 'result' && data.bytes instanceof ArrayBuffer
          ? finish(resolve, new Uint8Array(data.bytes))
          : finish(reject, new Error(data?.message || 'This PDF could not be cropped.'));
        const onError = () => finish(reject, new Error('The local PDF engine could not start. Check your connection and try again.'));
        worker.addEventListener('message', onMessage, { once: true });
        worker.addEventListener('error', onError, { once: true });
        cancelTask = () => { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; finish(reject, error); };
        const transferable = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
        try { worker.postMessage({ bytes: transferable, margins }, [transferable]); } catch (error) { finish(reject, error); }
      });
      makeDownload(downloads, new Blob([result], { type: 'application/pdf' }), safeFileName(file.name, '-cropped.pdf'), 'Download PDF');
      status(root, 'Cropped PDF copy is ready. The original is unchanged; content outside the CropBox may still be present.', 'success');
    } catch (error) {
      if (error?.code === 'CANCELLED') status(root, 'Processing stopped. No new file was saved.');
      else status(root, t(error instanceof Error ? error.message : 'This PDF could not be cropped.'), 'error');
    } finally {
      worker?.terminate(); worker = null; cancelTask = null; busy = false;
      input.disabled = false; controls.forEach((control) => { control.disabled = false; }); run.disabled = false; cancel.disabled = true;
    }
  });
}

function setupPdfToPdfa(root) {
  const input = $('#suite-pdfa-file', root);
  const resolution = $('#suite-pdfa-dpi', root);
  const confirmation = $('#suite-pdfa-confirm', root);
  const run = $('[data-action="create-pdfa"]', root);
  const cancel = $('[data-action="cancel-pdfa"]', root);
  const clear = $('[data-action="clear"]', root);
  const downloads = $('#suite-downloads', root);
  let loadingTask = null;
  let pdf = null;
  let pageSizes = [];
  let worker = null;
  let renderTask = null;
  let busy = false;
  let cancelled = false;
  let revision = 0;
  let requestNumber = 0;
  const pending = new Map();

  const terminateWorker = (cancelPending = false) => {
    if (cancelPending) {
      const error = new Error('Processing stopped. No new file was saved.');
      error.code = 'CANCELLED';
      for (const { reject } of pending.values()) reject(error);
      pending.clear();
    }
    worker?.terminate(); worker = null;
  };
  const callWorker = (type, data = {}, transfer = []) => new Promise((resolve, reject) => {
    if (!worker) { reject(new Error('The local PDF/A engine is not available.')); return; }
    const requestId = ++requestNumber;
    pending.set(requestId, { resolve, reject });
    try { worker.postMessage({ requestId, type, ...data }, transfer); }
    catch (error) { pending.delete(requestId); reject(error); }
  });
  const disposePdf = async () => {
    renderTask?.cancel(); renderTask = null;
    const oldTask = loadingTask;
    loadingTask = null; pdf = null; pageSizes = [];
    await Promise.allSettled([oldTask?.destroy()].filter(Boolean));
  };
  const updateControls = () => {
    run.disabled = busy || !pdf || !confirmation.checked;
    input.disabled = busy;
    resolution.disabled = busy;
    confirmation.disabled = busy || !pdf;
    clear.disabled = busy;
    cancel.disabled = !busy;
  };
  const reset = async () => {
    revision += 1;
    await disposePdf();
    terminateWorker(true);
    input.value = '';
    confirmation.checked = false;
    clearLinks(root);
    updateControls();
    status(root, 'Choose a PDF to start.');
  };

  input.addEventListener('change', async () => {
    if (busy) return;
    const currentRevision = ++revision;
    await disposePdf();
    confirmation.checked = false;
    clearLinks(root);
    updateControls();
    const file = input.files?.[0];
    if (!file) { status(root, 'Choose a PDF to start.'); return; }
    if (file.size > MAX_PDFA_BYTES) { status(root, t('Choose a PDF of 50 MB or less.'), 'error'); return; }
    status(root, 'Opening PDF on this device…');
    try {
      const pdfjs = await loadPdfJs();
      if (currentRevision !== revision) return;
      const bytes = new Uint8Array(await file.arrayBuffer());
      validatePdfAInput(bytes);
      loadingTask = pdfjs.getDocument({ data: bytes, isEvalSupported: false, enableXfa: false });
      const opened = await loadingTask.promise;
      if (currentRevision !== revision) return;
      if (opened.numPages > MAX_PDFA_PAGES) {
        await loadingTask.destroy(); loadingTask = null;
        status(root, t('This local tool supports up to 100 PDF pages.'), 'error'); return;
      }
      pdf = opened;
      pageSizes = [];
      for (let index = 1; index <= pdf.numPages; index += 1) {
        const page = await pdf.getPage(index);
        const viewport = page.getViewport({ scale: 1 });
        pageSizes.push({ width: viewport.width, height: viewport.height });
        page.cleanup();
      }
      status(root, '');
    } catch (error) {
      if (currentRevision !== revision) return;
      await disposePdf();
      const message = error?.name === 'PasswordException'
        ? 'This PDF is password-protected. Use the PDF password tool with the current password, then choose the unlocked copy.'
        : 'This PDF could not be opened. Keep the original and try a valid, unencrypted PDF.';
      status(root, t(message), 'error');
    } finally {
      if (currentRevision === revision) updateControls();
    }
  });

  confirmation.addEventListener('change', updateControls);
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { if (!busy) await reset(); return; }
    if (action === 'cancel-pdfa') {
      cancelled = true;
      renderTask?.cancel();
      terminateWorker(true);
      status(root, 'Processing stopped. No new file was saved.');
      return;
    }
    if (action !== 'create-pdfa' || busy) return;
    const file = input.files?.[0];
    if (!pdf || !file) { status(root, t('Choose a PDF to start.'), 'error'); return; }
    if (!confirmation.checked) { status(root, t('Review and confirm all pages before creating the copy.'), 'error'); return; }
    let plan;
    try { plan = pdfaPixelPlan(pageSizes, resolution.value); }
    catch (error) {
      const message = error?.message?.includes('too much memory')
        ? 'This PDF needs too much memory at the selected resolution. Choose a lower resolution or fewer pages.'
        : error?.message?.includes('too large')
          ? 'A page is too large to render safely at this resolution. Choose a lower resolution.'
          : 'This PDF could not be converted to a PDF/A copy. The original file is unchanged.';
      status(root, t(message), 'error'); return;
    }

    busy = true; cancelled = false; clearLinks(root); updateControls();
    let canvas = document.createElement('canvas');
    try {
      const pdfjs = await loadPdfJs();
      worker = new Worker(versioned('/assets/vendor/pdfa-worker.mjs'), { type: 'module' });
      worker.addEventListener('message', (workerEvent) => {
        const response = workerEvent.data ?? {};
        const waiting = pending.get(response.requestId);
        if (!waiting) return;
        pending.delete(response.requestId);
        if (response.type === 'error') waiting.reject(new Error(response.message || 'The local PDF/A engine could not create the file.'));
        else waiting.resolve(response);
      });
      worker.addEventListener('error', () => {
        for (const { reject } of pending.values()) reject(new Error('The local PDF/A engine could not start.'));
        pending.clear();
      });
      await callWorker('start');
      for (let index = 0; index < pageSizes.length; index += 1) {
        if (cancelled) { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
        const page = await pdf.getPage(index + 1);
        try {
          const base = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: plan.dpi / 72 });
          const target = plan.pages[index];
          canvas.width = target.width; canvas.height = target.height;
          const context = canvas.getContext('2d', { alpha: false });
          if (!context) throw new Error('Canvas is not available in this browser.');
          context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
          renderTask = page.render({ canvasContext: context, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 });
          try { await renderTask.promise; } finally { renderTask = null; }
          if (cancelled) { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
          const image = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('This browser could not prepare a page image.')), 'image/png'));
          const imageBuffer = await image.arrayBuffer();
          await callWorker('page', { width: base.width, height: base.height, image: imageBuffer }, [imageBuffer]);
        } finally {
          page.cleanup(); canvas.width = 1; canvas.height = 1;
        }
        status(root, `${t('Rendering page')} ${index + 1} ${t('of')} ${pageSizes.length}…`);
      }
      if (cancelled) { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
      status(root, t('Preparing PDF/A file…'));
      const finished = await callWorker('finish');
      const bytes = new Uint8Array(finished.buffer);
      if (bytes.length < 8 || new TextDecoder('latin1').decode(bytes.subarray(0, 8)).indexOf('%PDF-') !== 0) throw new Error('The local PDF/A engine returned an invalid file.');
      const verificationTask = pdfjs.getDocument({ data: new Uint8Array(bytes), isEvalSupported: false, enableXfa: false });
      let outputPageCount;
      try {
        const verification = await verificationTask.promise;
        outputPageCount = verification.numPages;
      } finally {
        await verificationTask.destroy();
      }
      if (outputPageCount !== pageSizes.length) throw new Error('The rebuilt PDF has a different page count.');
      makeDownload(downloads, new Blob([bytes], { type: 'application/pdf' }), safeFileName(file.name, '-pdfa-1b.pdf'), 'Download PDF');
      status(root, t('PDF/A-1b image copy is ready. The browser confirmed that it opens and has the expected number of pages; this file was not individually validated with veraPDF. Verify it before relying on archival compliance.'), 'success');
    } catch (error) {
      if (error?.code === 'CANCELLED' || cancelled || error?.name === 'RenderingCancelledException') status(root, 'Processing stopped. No new file was saved.');
      else status(root, t('This PDF could not be converted to a PDF/A copy. The original file is unchanged.'), 'error');
    } finally {
      canvas.width = 1; canvas.height = 1; canvas = null;
      terminateWorker(false);
      busy = false; cancelled = false;
      updateControls();
    }
  });
  window.addEventListener('pagehide', () => {
    renderTask?.cancel(); terminateWorker(true); void disposePdf(); clearLinks(root);
  }, { once: true });
  updateControls();
}

function setupPdfRedact(root) {
  const input = $('#suite-redact-file', root);
  const canvas = $('#suite-redact-canvas', root);
  const pageOutput = $('#suite-redact-page', root);
  const resolution = $('#suite-redact-dpi', root);
  const confirmation = $('#suite-redact-confirm', root);
  const previous = $('[data-action="redact-previous"]', root);
  const next = $('[data-action="redact-next"]', root);
  const undo = $('[data-action="redact-undo"]', root);
  const clearPage = $('[data-action="redact-clear-page"]', root);
  const run = $('[data-action="redact-pdf"]', root);
  const cancel = $('[data-action="cancel-redact-pdf"]', root);
  const clear = $('[data-action="clear"]', root);
  const downloads = $('#suite-downloads', root);
  const pageControl = $('#suite-redact-page', root);
  let loadingTask = null;
  let pdf = null;
  let pageSizes = [];
  let marks = [];
  let pageNumber = 1;
  let previewTask = null;
  let activeTask = null;
  let previewBase = null;
  let busy = false;
  let cancelled = false;
  let loadRevision = 0;
  let previewRevision = 0;
  let dragStart = null;
  let dragEnd = null;

  const totalMarks = () => marks.reduce((total, pageMarks) => total + pageMarks.length, 0);
  const disposeDocument = async () => {
    previewTask?.cancel(); previewTask = null; previewBase = null;
    const oldTask = loadingTask;
    loadingTask = null; pdf = null; pageSizes = [];
    await Promise.allSettled([oldTask?.destroy()].filter(Boolean));
  };
  const reset = async (clearInput = true) => {
    if (busy) return;
    loadRevision += 1; previewRevision += 1;
    await disposeDocument();
    if (clearInput) input.value = '';
    marks = []; pageNumber = 1; dragStart = null; dragEnd = null;
    canvas.hidden = true; canvas.width = 1; canvas.height = 1;
    pageOutput.textContent = `${t('Page')} 0 ${t('of')} 0`;
    confirmation.checked = false; confirmation.disabled = true;
    resolution.disabled = false; input.disabled = false; previous.disabled = true; next.disabled = true;
    undo.disabled = true; clearPage.disabled = true; run.disabled = true; cancel.disabled = true; clear.disabled = false;
    clearLinks(root); status(root, 'Choose a PDF to start.');
  };
  const updateControls = () => {
    const pageMarks = marks[pageNumber - 1] ?? [];
    pageOutput.textContent = `${t('Page')} ${pdf ? pageNumber : 0} ${t('of')} ${pageSizes.length}`;
    previous.disabled = busy || !pdf || pageNumber <= 1;
    next.disabled = busy || !pdf || pageNumber >= pageSizes.length;
    undo.disabled = busy || pageMarks.length === 0;
    clearPage.disabled = busy || pageMarks.length === 0;
    confirmation.disabled = busy || totalMarks() === 0;
    run.disabled = busy || !pdf || totalMarks() === 0 || !confirmation.checked;
    resolution.disabled = busy;
    input.disabled = busy;
    clear.disabled = busy;
  };
  const paintPreview = () => {
    if (!previewBase || !canvas.width || !canvas.height) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(previewBase, 0, 0);
    const pageMarks = marks[pageNumber - 1] ?? [];
    const paint = (rect, pending = false) => {
      const x = rect.x * canvas.width; const y = rect.y * canvas.height;
      const width = rect.width * canvas.width; const height = rect.height * canvas.height;
      context.fillStyle = '#000'; context.fillRect(x, y, width, height);
      if (pending) {
        context.save(); context.strokeStyle = '#e11d48'; context.lineWidth = Math.max(2, canvas.width / 500);
        context.setLineDash([8, 5]); context.strokeRect(x, y, width, height); context.restore();
      }
    };
    pageMarks.forEach((rect) => paint(rect));
    if (dragStart && dragEnd) {
      try { paint(normalizeRedactionRect(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y), true); } catch { /* A drag starts as a point. */ }
    }
  };
  const renderPreview = async () => {
    if (!pdf) return;
    const revision = ++previewRevision;
    previewTask?.cancel(); previewTask = null; previewBase = null;
    canvas.hidden = false; canvas.width = 1; canvas.height = 1;
    status(root, `${t('Loading preview for page')} ${pageNumber}…`);
    try {
      const pdfjs = await loadPdfJs();
      if (revision !== previewRevision) return;
      const page = await pdf.getPage(pageNumber);
      if (revision !== previewRevision) return;
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(1.25, 1200 / base.width, 1200 / base.height);
      const viewport = page.getViewport({ scale });
      canvas.width = Math.max(1, Math.ceil(viewport.width)); canvas.height = Math.max(1, Math.ceil(viewport.height));
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) throw new Error('Canvas is not available in this browser.');
      context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
      const task = page.render({ canvasContext: context, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 });
      previewTask = task; await task.promise;
      if (revision !== previewRevision) return;
      previewBase = document.createElement('canvas');
      previewBase.width = canvas.width; previewBase.height = canvas.height;
      previewBase.getContext('2d', { alpha: false }).drawImage(canvas, 0, 0);
      page.cleanup(); paintPreview(); updateControls();
      status(root, t('Drag over sensitive content to mark it. Review every page before creating the copy.'));
    } catch (error) {
      if (revision !== previewRevision) return;
      if (error?.name === 'RenderingCancelledException') return;
      status(root, t('This page could not be previewed. Keep the original and try another PDF reader or a smaller file.'), 'error');
    } finally {
      if (revision === previewRevision) { previewTask = null; updateControls(); }
    }
  };

  input.addEventListener('change', async () => {
    if (busy) return;
    await reset(false);
    const file = input.files?.[0];
    if (!file) return;
    const revision = ++loadRevision;
    if (file.size > MAX_PDF_REDACT_BYTES) { status(root, t('Choose a PDF of 50 MB or less.'), 'error'); return; }
    status(root, t('Opening PDF on this device…'));
    try {
      const pdfjs = await loadPdfJs();
      if (revision !== loadRevision) return;
      const bytes = new Uint8Array(await file.arrayBuffer());
      validateRedactionInput(bytes);
      loadingTask = pdfjs.getDocument({ data: bytes, isEvalSupported: false, enableXfa: false });
      const documentProxy = await loadingTask.promise;
      if (revision !== loadRevision) return;
      if (documentProxy.numPages > MAX_PDF_REDACT_PAGES) {
        await loadingTask.destroy(); loadingTask = null;
        status(root, t('This local tool supports up to 100 PDF pages.'), 'error'); return;
      }
      pdf = documentProxy; pageSizes = [];
      for (let index = 1; index <= pdf.numPages; index += 1) {
        const page = await pdf.getPage(index);
        const viewport = page.getViewport({ scale: 1 });
        pageSizes.push({ width: viewport.width, height: viewport.height });
        page.cleanup();
      }
      marks = pageSizes.map(() => []); pageNumber = 1; updateControls(); await renderPreview();
    } catch (error) {
      if (revision !== loadRevision) return;
      await disposeDocument();
      const message = error?.name === 'PasswordException'
        ? 'This PDF is password-protected. Use the PDF password tool with the current password, then choose the unlocked copy.'
        : error?.message === 'Choose a valid PDF file.' ? error.message : 'This PDF could not be opened. Keep the original and try a valid, unencrypted PDF.';
      status(root, t(message), 'error');
    }
  });

  const pointerPosition = (event) => {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    return { x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) };
  };
  canvas.addEventListener('pointerdown', (event) => {
    if (!pdf || busy || canvas.hidden || event.button > 0) return;
    const position = pointerPosition(event); if (!position) return;
    dragStart = position; dragEnd = position; canvas.setPointerCapture(event.pointerId); paintPreview(); event.preventDefault();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!dragStart || busy) return;
    dragEnd = pointerPosition(event); paintPreview();
  });
  const finishDrag = (event) => {
    if (!dragStart || !dragEnd || busy) return;
    try { marks[pageNumber - 1].push(normalizeRedactionRect(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y)); confirmation.checked = false; }
    catch { status(root, t('Draw a larger redaction area.'), 'error'); }
    dragStart = null; dragEnd = null; paintPreview(); updateControls();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  };
  canvas.addEventListener('pointerup', finishDrag);
  canvas.addEventListener('pointercancel', (event) => {
    dragStart = null; dragEnd = null; paintPreview();
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  });
  confirmation.addEventListener('change', updateControls);

  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { await reset(); return; }
    if (action === 'cancel-redact-pdf') { cancelled = true; activeTask?.cancel(); status(root, 'Stopping redaction…'); return; }
    if (busy) return;
    if (action === 'redact-previous' || action === 'redact-next') {
      const nextPage = pageNumber + (action === 'redact-next' ? 1 : -1);
      if (nextPage >= 1 && nextPage <= pageSizes.length) { pageNumber = nextPage; dragStart = null; dragEnd = null; updateControls(); await renderPreview(); }
      return;
    }
    if (action === 'redact-undo') { marks[pageNumber - 1]?.pop(); confirmation.checked = false; paintPreview(); updateControls(); return; }
    if (action === 'redact-clear-page') { marks[pageNumber - 1] = []; confirmation.checked = false; paintPreview(); updateControls(); return; }
    if (action !== 'redact-pdf') return;
    if (!pdf || !input.files?.[0]) { status(root, t('Choose a PDF to start.'), 'error'); return; }
    if (!totalMarks()) { status(root, t('Mark at least one area before creating the redacted copy.'), 'error'); return; }
    if (!confirmation.checked) { status(root, t('Review and confirm all pages before creating the redacted copy.'), 'error'); return; }

    const file = input.files[0]; const dpi = Number(resolution.value);
    let plan;
    try { plan = redactionPixelPlan(pageSizes, dpi); }
    catch (error) {
      const message = error.message === 'This PDF needs too much memory at the selected resolution. Choose a lower resolution or fewer pages.'
        || error.message === 'A page is too large to render safely at this resolution. Choose a lower resolution.'
        ? error.message : 'This PDF could not be redacted. The original is unchanged.';
      status(root, t(message), 'error'); return;
    }
    busy = true; cancelled = false; clearLinks(root); updateControls(); cancel.disabled = false;
    status(root, `${t('Rebuilding page')} 1 ${t('of')} ${pageSizes.length}…`);
    let outputDocument;
    let canvasForExport;
    try {
      const pdfjs = await loadPdfJs();
      const { PDFDocument } = await loadPdfLib();
      outputDocument = await PDFDocument.create();
      canvasForExport = document.createElement('canvas');
      for (let index = 0; index < pageSizes.length; index += 1) {
        if (cancelled) { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
        const page = await pdf.getPage(index + 1);
        const scale = dpi / 72;
        const viewport = page.getViewport({ scale });
        const planned = plan.pages[index];
        canvasForExport.width = planned.width; canvasForExport.height = planned.height;
        const context = canvasForExport.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas is not available in this browser.');
        context.fillStyle = '#fff'; context.fillRect(0, 0, canvasForExport.width, canvasForExport.height);
        const renderTask = page.render({ canvasContext: context, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 });
        activeTask = renderTask;
        try { await renderTask.promise; } finally { if (activeTask === renderTask) activeTask = null; }
        if (cancelled) { page.cleanup(); const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
        context.fillStyle = '#000';
        for (const rect of marks[index]) context.fillRect(rect.x * canvasForExport.width, rect.y * canvasForExport.height, rect.width * canvasForExport.width, rect.height * canvasForExport.height);
        const png = await new Promise((resolve, reject) => canvasForExport.toBlob((blob) => blob ? resolve(blob) : reject(new Error('This browser could not prepare the redacted page image.')), 'image/png'));
        const pngBytes = new Uint8Array(await png.arrayBuffer());
        const embedded = await outputDocument.embedPng(pngBytes);
        const outputPage = outputDocument.addPage([viewport.width / scale, viewport.height / scale]);
        outputPage.drawImage(embedded, { x: 0, y: 0, width: viewport.width / scale, height: viewport.height / scale });
        page.cleanup(); canvasForExport.width = 1; canvasForExport.height = 1;
        status(root, `${t('Rebuilding page')} ${index + 1} ${t('of')} ${pageSizes.length}…`);
      }
      if (cancelled) { const error = new Error('Processing stopped. No new file was saved.'); error.code = 'CANCELLED'; throw error; }
      const output = await outputDocument.save({ useObjectStreams: true });
      makeDownload(downloads, new Blob([output], { type: 'application/pdf' }), safeFileName(file.name, '-redacted.pdf'), 'Download PDF');
      status(root, t('A redacted copy is ready. The original is unchanged. The new PDF contains flattened page images, not the original PDF objects.'), 'success');
    } catch (error) {
      if (error?.code === 'CANCELLED' || cancelled || error?.name === 'RenderingCancelledException') status(root, t('Redaction stopped. No new file was saved; your original is unchanged.'));
      else status(root, t(error?.message?.startsWith('This PDF needs too much') ? error.message : 'This PDF could not be redacted. The original is unchanged.'), 'error');
    } finally {
      activeTask = null; canvasForExport && (canvasForExport.width = canvasForExport.height = 1);
      outputDocument = null; busy = false; cancelled = false; cancel.disabled = true; updateControls();
    }
  });
  pageControl.textContent = `${t('Page')} 0 ${t('of')} 0`;
  updateControls();
  window.addEventListener('pagehide', () => { previewTask?.cancel(); activeTask?.cancel(); void disposeDocument(); clearLinks(root); }, { once: true });
}

async function getPdfText(file, onPage = () => {}) {
  const pdfjs = await loadPdfJs();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const task = pdfjs.getDocument({ data: bytes, isEvalSupported: false });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 300) throw new RangeError('For safety, this tool supports up to 300 pages per PDF.');
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(' ').replace(/\s+/gu, ' ').trim());
      page.cleanup();
      onPage(pageNumber, pdf.numPages);
    }
    return { pages, pageCount: pdf.numPages };
  } finally {
    await task.destroy().catch(() => {});
  }
}

async function getPdfTextItems(file, onPage = () => {}) {
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false, enableXfa: false });
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 300) throw new RangeError('For safety, this local converter supports up to 300 PDF pages.');
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        pages.push(content.items.filter((item) => typeof item.str === 'string' && item.str.trim()).map((item) => ({
          str: item.str,
          x: item.transform?.[4] ?? 0,
          y: item.transform?.[5] ?? 0,
          height: item.height ?? item.transform?.[3] ?? 10,
          width: item.width ?? 0,
        })));
      } finally { page.cleanup(); }
      onPage(pageNumber, pdf.numPages);
    }
    return pages;
  } finally { await task.destroy().catch(() => {}); }
}

async function renderPdfImagesForSlides(file, onPage = () => {}) {
  if (file.size > 100 * 1024 * 1024) throw new RangeError('Choose a PDF of 100 MB or less.');
  const pdfjs = await loadPdfJs();
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false, enableXfa: false });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) { await task.destroy().catch(() => {}); throw new Error('This browser could not start the local page renderer.'); }
  try {
    const pdf = await task.promise;
    if (pdf.numPages > 100) throw new RangeError('PDF to PowerPoint supports up to 100 pages per presentation.');
    const viewports = [];
    let basePixels = 0;
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      viewports.push({ page, width: viewport.width, height: viewport.height });
      basePixels += viewport.width * viewport.height;
    }
    const scale = Math.min(1.5, Math.sqrt(30_000_000 / Math.max(1, basePixels)));
    const images = [];
    let bytesTotal = 0;
    for (let index = 0; index < viewports.length; index += 1) {
      const { page } = viewports[index];
      const viewport = page.getViewport({ scale });
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      const renderTask = page.render({ canvasContext: context, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 });
      await renderTask.promise;
      const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('A PDF page could not be rendered.')), 'image/png'));
      bytesTotal += blob.size;
      if (bytesTotal > 100 * 1024 * 1024) throw new RangeError('The rendered slide images exceed the 100 MB local memory budget. Try fewer pages or a smaller PDF.');
      images.push({ bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height });
      page.cleanup();
      canvas.width = 1; canvas.height = 1;
      onPage(index + 1, viewports.length);
    }
    return images;
  } finally {
    canvas.width = 1; canvas.height = 1;
    await task.destroy().catch(() => {});
  }
}

function setupPdfPageEditor(root) {
  const input = $('#suite-pdf-file', root);
  const pageList = $('#suite-pages', root);
  const saveButton = $('[data-action="save-edited-pdf"]', root);
  const editor = $('#suite-visual-edit', root);
  const canvas = $('#suite-visual-edit-canvas', root);
  const context = canvas.getContext('2d', { alpha: false });
  const mode = $('#suite-visual-edit-mode', root);
  const replacementText = $('#suite-visual-edit-text', root);
  const replacementImage = $('#suite-visual-edit-image', root);
  const background = $('#suite-visual-edit-background', root);
  const textColor = $('#suite-visual-edit-color', root);
  const textSize = $('#suite-visual-edit-size', root);
  const note = $('#suite-visual-edit-note', root);
  const applyButton = $('[data-action="apply-visual-edit"]', root);
  const undoButton = $('[data-action="undo-visual-edit"]', root);
  const textLabel = $('[for="suite-visual-edit-text"]', root);
  const imageLabel = $('[for="suite-visual-edit-image"]', root);
  const state = { file: null, order: [], removed: new Set(), rotations: new Map(), edits: new Map(), specs: new Map(), editingPage: null, baseCanvas: null, scale: 0, selection: null, drag: null, busy: false, renderId: 0 };
  const pageEdits = (page) => state.edits.get(page) ?? [];
  const updateVisualButtons = () => {
    textLabel.hidden = mode.value !== 'text'; imageLabel.hidden = mode.value !== 'image';
    applyButton.disabled = !state.editingPage || !state.selection || state.busy || (mode.value === 'text' ? !replacementText.value.trim() : !replacementImage.files?.[0]);
    undoButton.disabled = !state.editingPage || !pageEdits(state.editingPage).length || state.busy;
  };
  const drawReplacement = (ctx, operation, scale) => {
    const x = operation.rect.x * scale; const y = operation.rect.y * scale;
    const width = operation.rect.width * scale; const height = operation.rect.height * scale;
    ctx.fillStyle = operation.background; ctx.fillRect(x, y, width, height);
    if (operation.type === 'image' && operation.image) {
      const ratio = Math.min(width / operation.image.naturalWidth, height / operation.image.naturalHeight);
      const imageWidth = operation.image.naturalWidth * ratio; const imageHeight = operation.image.naturalHeight * ratio;
      ctx.drawImage(operation.image, x + (width - imageWidth) / 2, y + (height - imageHeight) / 2, imageWidth, imageHeight);
    } else if (operation.type === 'text') {
      const size = operation.fontSize * scale; const lineHeight = size * 1.2;
      ctx.fillStyle = operation.color; ctx.font = `${size}px Arial, sans-serif`; ctx.textBaseline = 'top';
      const lines = [];
      for (const paragraph of operation.text.split(/\r?\n/u)) {
        let line = '';
        for (const word of paragraph.split(/\s+/u).filter(Boolean)) {
          const candidate = line ? `${line} ${word}` : word;
          if (line && ctx.measureText(candidate).width > Math.max(1, width - 8)) { lines.push(line); line = word; } else line = candidate;
        }
        if (line) lines.push(line);
      }
      lines.slice(0, Math.max(1, Math.floor((height - 8) / lineHeight))).forEach((line, index) => ctx.fillText(line, x + 4, y + 4 + index * lineHeight, Math.max(1, width - 8)));
    }
  };
  const drawVisualPreview = () => {
    if (!state.baseCanvas || !context) return;
    context.setTransform(1, 0, 0, 1, 0, 0); context.clearRect(0, 0, canvas.width, canvas.height); context.drawImage(state.baseCanvas, 0, 0);
    for (const operation of pageEdits(state.editingPage)) drawReplacement(context, operation, state.scale);
    if (state.selection) { context.save(); context.strokeStyle = '#276ef1'; context.lineWidth = 2; context.setLineDash([7, 5]); context.strokeRect(state.selection.x * state.scale, state.selection.y * state.scale, state.selection.width * state.scale, state.selection.height * state.scale); context.restore(); }
  };
  const closeVisualEditor = () => { state.renderId += 1; state.editingPage = null; state.baseCanvas = null; state.selection = null; state.drag = null; canvas.width = 1; canvas.height = 1; editor.hidden = true; replacementImage.value = ''; updateVisualButtons(); };
  const renderVisualPage = async (pageNumber) => {
    if (!state.file) return;
    try {
      validateVisualEditInput(state.file, state.order.length); state.busy = true; updateVisualButtons();
      const renderId = ++state.renderId; status(root, `${t('Processing PDF page')} ${pageNumber}…`);
      const pdfjs = await loadPdfJs();
      const task = pdfjs.getDocument({ data: new Uint8Array(await state.file.arrayBuffer()), isEvalSupported: false, enableXfa: false });
      try {
        const pdf = await task.promise; const page = await pdf.getPage(pageNumber);
        const rotation = ((page.rotate + (state.rotations.get(pageNumber) ?? 0)) % 360 + 360) % 360;
        const unscaled = page.getViewport({ scale: 1, rotation });
        const plan = visualEditPixelPlan([{ width: unscaled.width, height: unscaled.height }], 8_000_000, 1.5);
        const viewport = page.getViewport({ scale: plan.scale, rotation });
        const base = document.createElement('canvas'); base.width = Math.ceil(viewport.width); base.height = Math.ceil(viewport.height);
        const ctx = base.getContext('2d', { alpha: false }); if (!ctx) throw new Error('This browser could not start the PDF page preview.');
        ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, base.width, base.height);
        await page.render({ canvasContext: ctx, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 }).promise;
        page.cleanup();
        if (renderId !== state.renderId) return;
        state.editingPage = pageNumber; state.baseCanvas = base; state.scale = plan.scale; state.selection = null; state.drag = null;
        state.specs.set(pageNumber, { width: unscaled.width, height: unscaled.height, rotation });
        canvas.width = base.width; canvas.height = base.height; editor.hidden = false; note.textContent = t('Select an area in the preview.');
        drawVisualPreview(); updateVisualButtons(); editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } finally { await task.destroy().catch(() => {}); }
    } catch (error) { status(root, errorMessage(error), 'error'); }
    finally { state.busy = false; updateVisualButtons(); }
  };
  const canvasPoint = (event) => { const box = canvas.getBoundingClientRect(); return { x: (event.clientX - box.left) * canvas.width / box.width, y: (event.clientY - box.top) * canvas.height / box.height }; };
  const renderPages = () => {
    pageList.replaceChildren();
    state.order.forEach((originalPage, visibleIndex) => {
      if (state.removed.has(originalPage)) return;
      const card = document.createElement('div');
      card.className = 'pdf-page-row';
      const label = document.createElement('strong');
      label.textContent = `${t('Page')} ${originalPage}`;
      const angle = document.createElement('span');
      angle.textContent = `${state.rotations.get(originalPage) ?? 0}°`;
      const moveUp = document.createElement('button');
      moveUp.type = 'button'; moveUp.className = 'button button--ghost'; moveUp.dataset.pageAction = 'up'; moveUp.dataset.page = String(originalPage); moveUp.disabled = visibleIndex === 0; moveUp.textContent = t('Move up');
      const moveDown = document.createElement('button');
      moveDown.type = 'button'; moveDown.className = 'button button--ghost'; moveDown.dataset.pageAction = 'down'; moveDown.dataset.page = String(originalPage); moveDown.disabled = visibleIndex === state.order.filter((page) => !state.removed.has(page)).length - 1; moveDown.textContent = t('Move down');
      const rotate = document.createElement('button');
      rotate.type = 'button'; rotate.className = 'button button--ghost'; rotate.dataset.pageAction = 'rotate'; rotate.dataset.page = String(originalPage); rotate.textContent = t('Rotate 90°'); rotate.disabled = pageEdits(originalPage).length > 0;
      const edit = document.createElement('button'); edit.type = 'button'; edit.className = 'button button--ghost'; edit.dataset.pageAction = 'edit-content'; edit.dataset.page = String(originalPage); edit.textContent = t('Edit visible content');
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'button button--ghost'; remove.dataset.pageAction = 'remove'; remove.dataset.page = String(originalPage); remove.textContent = t('Remove');
      card.append(label, angle, moveUp, moveDown, rotate, edit, remove);
      pageList.append(card);
    });
    saveButton.disabled = !state.file || state.order.every((page) => state.removed.has(page)) || state.busy;
  };
  input.addEventListener('change', async () => {
    closeVisualEditor(); clearLinks(root); state.file = input.files?.[0] ?? null; state.order = []; state.removed.clear(); state.rotations.clear(); state.edits.clear(); state.specs.clear();
    if (!state.file) return renderPages();
    try {
      const pdf = await loadPdfLib();
      const document = await pdf.PDFDocument.load(await state.file.arrayBuffer(), { updateMetadata: false });
      if (document.getPageCount() > 300) throw new RangeError('For safety, this tool supports up to 300 pages per PDF.');
      state.order = document.getPageIndices().map((index) => index + 1);
      renderPages();
      status(root, `${state.order.length} ${t('pages ready to edit')}`, 'success');
    } catch (error) { state.file = null; renderPages(); status(root, errorMessage(error), 'error'); }
  });
  canvas.addEventListener('pointerdown', (event) => { if (!state.editingPage || state.busy) return; event.preventDefault(); canvas.setPointerCapture(event.pointerId); state.drag = { start: canvasPoint(event), end: canvasPoint(event) }; state.selection = null; });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.drag) return;
    state.drag.end = canvasPoint(event);
    state.selection = { x: Math.min(state.drag.start.x, state.drag.end.x), y: Math.min(state.drag.start.y, state.drag.end.y), width: Math.abs(state.drag.end.x - state.drag.start.x), height: Math.abs(state.drag.end.y - state.drag.start.y) };
    drawVisualPreview(); updateVisualButtons();
  });
  const finishSelection = () => {
    if (!state.drag) return;
    try { state.selection = normalizeVisualEditRect(state.drag.start, state.drag.end, canvas.width, canvas.height); note.textContent = t('Area selected. Choose the replacement and apply it.'); }
    catch (error) { state.selection = null; note.textContent = t(error.message); }
    state.drag = null; drawVisualPreview(); updateVisualButtons();
  };
  canvas.addEventListener('pointerup', finishSelection); canvas.addEventListener('pointercancel', finishSelection);
  mode.addEventListener('change', updateVisualButtons); replacementText.addEventListener('input', updateVisualButtons); replacementImage.addEventListener('change', updateVisualButtons);
  root.addEventListener('click', async (event) => {
    const pageButton = event.target.closest('[data-page-action]');
    if (pageButton) {
      const page = Number(pageButton.dataset.page);
      const index = state.order.indexOf(page);
      if (pageButton.dataset.pageAction === 'remove') state.removed.add(page);
      if (pageButton.dataset.pageAction === 'rotate') state.rotations.set(page, ((state.rotations.get(page) ?? 0) + 90) % 360);
      if (pageButton.dataset.pageAction === 'up' && index > 0) [state.order[index - 1], state.order[index]] = [state.order[index], state.order[index - 1]];
      if (pageButton.dataset.pageAction === 'down' && index < state.order.length - 1) [state.order[index + 1], state.order[index]] = [state.order[index], state.order[index + 1]];
      if (pageButton.dataset.pageAction === 'edit-content') { await renderVisualPage(page); return; }
      renderPages(); return;
    }
    if (event.target.closest('[data-action="close-visual-edit"]')) { closeVisualEditor(); return; }
    if (event.target.closest('[data-action="apply-visual-edit"]')) {
      if (!state.selection || !state.editingPage || state.busy) return;
      try {
        const rect = { x: state.selection.x / state.scale, y: state.selection.y / state.scale, width: state.selection.width / state.scale, height: state.selection.height / state.scale };
        let operation;
        if (mode.value === 'text') {
          const text = replacementText.value.trim(); const fontSize = Number(textSize.value);
          if (!text) throw new TypeError('Type the replacement text first.');
          if (!Number.isFinite(fontSize) || fontSize < 8 || fontSize > 72) throw new RangeError('Choose a text size from 8 to 72 points.');
          operation = { type: 'text', rect, text, fontSize, background: background.value, color: textColor.value };
        } else {
          const file = replacementImage.files?.[0]; validateVisualReplacementImage(file);
          const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('The replacement image could not be read.')); reader.readAsDataURL(file); });
          const image = new Image(); image.src = dataUrl; await image.decode();
          operation = { type: 'image', rect, image, background: background.value }; replacementImage.value = '';
        }
        const operations = pageEdits(state.editingPage); operations.push(operation); state.edits.set(state.editingPage, operations);
        state.selection = null; replacementText.value = ''; note.textContent = t('Replacement added. The page will be flattened when saved.');
        drawVisualPreview(); updateVisualButtons(); renderPages();
      } catch { note.textContent = t('Check the selected file and settings, then try again.'); updateVisualButtons(); }
      return;
    }
    if (event.target.closest('[data-action="undo-visual-edit"]')) {
      const operations = pageEdits(state.editingPage); operations.pop(); if (!operations.length) state.edits.delete(state.editingPage);
      state.selection = null; drawVisualPreview(); updateVisualButtons(); renderPages(); return;
    }
    if (event.target.closest('[data-action="clear"]')) { closeVisualEditor(); input.value = ''; state.file = null; state.order = []; state.removed.clear(); state.rotations.clear(); state.edits.clear(); state.specs.clear(); clearLinks(root); renderPages(); status(root, 'Choose a PDF to start.'); return; }
    if (!event.target.closest('[data-action="save-edited-pdf"]') || !state.file || state.busy) return;
    state.busy = true; renderPages();
    try {
      const { PDFDocument, degrees, rgb } = await loadPdfLib();
      const source = await PDFDocument.load(await state.file.arrayBuffer(), { updateMetadata: false });
      const target = await PDFDocument.create();
      const outputPages = state.order.filter((page) => !state.removed.has(page));
      const editedPages = outputPages.filter((page) => pageEdits(page).length);
      const pointArea = editedPages.reduce((sum, page) => { const spec = state.specs.get(page); return sum + spec.width * spec.height; }, 0);
      const rasterScale = editedPages.length ? Math.min(1.5, Math.sqrt(PDF_VISUAL_EDIT_LIMITS.totalPixels / pointArea)) : 1;
      if (editedPages.length && rasterScale < 0.2) throw new RangeError('This PDF needs too much memory to save the edited pages. Edit fewer pages or use a smaller PDF.');
      const pdfjs = editedPages.length ? await loadPdfJs() : null;
      const loadingTask = editedPages.length ? pdfjs.getDocument({ data: new Uint8Array(await state.file.arrayBuffer()), isEvalSupported: false, enableXfa: false }) : null;
      try {
        const renderedPdf = loadingTask ? await loadingTask.promise : null;
        const exportCanvas = editedPages.length ? document.createElement('canvas') : null;
        const exportContext = exportCanvas?.getContext('2d', { alpha: false });
        if (editedPages.length && !exportContext) throw new Error('This browser could not start the PDF page renderer.');
        for (const [outputIndex, originalPage] of outputPages.entries()) {
          if (!pageEdits(originalPage).length) {
            const [page] = await target.copyPages(source, [originalPage - 1]);
            const delta = state.rotations.get(originalPage) ?? 0;
            if (delta) page.setRotation(degrees((page.getRotation().angle + delta) % 360));
            target.addPage(page);
            continue;
          }
          const sourcePage = await renderedPdf.getPage(originalPage);
          const spec = state.specs.get(originalPage);
          const viewport = sourcePage.getViewport({ scale: rasterScale, rotation: spec.rotation });
          exportCanvas.width = Math.ceil(viewport.width); exportCanvas.height = Math.ceil(viewport.height);
          exportContext.fillStyle = '#ffffff'; exportContext.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
          await sourcePage.render({ canvasContext: exportContext, viewport, background: '#ffffff', annotationMode: pdfjs.AnnotationMode?.ENABLE ?? 1 }).promise;
          for (const operation of pageEdits(originalPage)) drawReplacement(exportContext, operation, rasterScale);
          const blob = await new Promise((resolve, reject) => exportCanvas.toBlob((value) => value ? resolve(value) : reject(new Error('An edited page could not be encoded.')), 'image/png'));
          const image = await target.embedPng(await blob.arrayBuffer());
          const page = target.addPage([viewport.width / rasterScale, viewport.height / rasterScale]);
          page.drawImage(image, { x: 0, y: 0, width: viewport.width / rasterScale, height: viewport.height / rasterScale });
          sourcePage.cleanup(); exportCanvas.width = 1; exportCanvas.height = 1;
          status(root, `${t('Rebuilding page')} ${outputIndex + 1} ${t('of')} ${outputPages.length}…`);
        }
      } finally { if (loadingTask) await loadingTask.destroy().catch(() => {}); }
      const font = await target.embedFont('Helvetica');
      const watermark = $('#suite-watermark', root).value.trim();
      const watermarkImageFile = $('#suite-watermark-image', root).files?.[0] ?? null;
      if (watermarkImageFile?.size > 10 * 1024 * 1024) throw new RangeError('Choose a PNG or JPEG image watermark under 10 MB.');
      const watermarkImage = watermarkImageFile
        ? watermarkImageFile.type === 'image/jpeg'
          ? await target.embedJpg(await watermarkImageFile.arrayBuffer())
          : await target.embedPng(await watermarkImageFile.arrayBuffer())
        : null;
      const opacity = Number($('#suite-watermark-opacity', root).value) / 100;
      const numbering = $('#suite-page-numbers', root).value;
      target.getPages().forEach((page, index) => {
        const { width, height } = page.getSize();
        if (numbering !== 'none') {
          const text = `${index + 1} / ${pages.length}`; const size = 9; const x = numbering === 'bottom-center' ? (width - font.widthOfTextAtSize(text, size)) / 2 : width - font.widthOfTextAtSize(text, size) - 24;
          page.drawText(text, { x, y: 18, size, font, color: rgb(0.25, 0.25, 0.25) });
        }
        if (watermark) page.drawText(watermark, { x: 24, y: height / 2, size: Math.min(42, Math.max(18, width / 13)), font, color: rgb(0.35, 0.35, 0.35), opacity, rotate: degrees(-30), maxWidth: width - 48 });
        if (watermarkImage) {
          const scale = Math.min(width * 0.4 / watermarkImage.width, height * 0.4 / watermarkImage.height, 1);
          const imageWidth = watermarkImage.width * scale; const imageHeight = watermarkImage.height * scale;
          page.drawImage(watermarkImage, { x: (width - imageWidth) / 2, y: (height - imageHeight) / 2, width: imageWidth, height: imageHeight, opacity });
        }
      });
      const bytes = await target.save({ useObjectStreams: true, addDefaultPage: false });
      makeDownload($('#suite-downloads', root), new Blob([bytes], { type: 'application/pdf' }), safeFileName(state.file.name, '-edited.pdf'), 'Download PDF');
      status(root, 'Your edited PDF is ready. The original file has not changed.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
    finally { state.busy = false; renderPages(); }
  });
  $('#suite-watermark-opacity', root).addEventListener('input', (event) => { $('#suite-watermark-value', root).textContent = `${event.target.value}%`; });
}

function setupPdfCompare(root) {
  const statusEl = $('#tool-status', root); const results = $('#suite-compare-results', root);
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-action="clear"]')) { $('#suite-compare-a', root).value = ''; $('#suite-compare-b', root).value = ''; results.replaceChildren(); status(root, ''); return; }
    if (!event.target.closest('[data-action="compare-pdfs"]')) return;
    const a = $('#suite-compare-a', root).files?.[0]; const b = $('#suite-compare-b', root).files?.[0]; results.replaceChildren();
    if (!a || !b) return status(root, 'Choose both PDF files before comparing.', 'error');
    try {
      const first = await getPdfText(a, (page, total) => status(root, `Reading original PDF page ${page} of ${total}…`));
      const second = await getPdfText(b, (page, total) => status(root, `Reading updated PDF page ${page} of ${total}…`));
      const changed = Math.max(first.pages.length, second.pages.length);
      let differenceCount = 0;
      for (let index = 0; index < changed; index += 1) {
        if (first.pages[index] === second.pages[index]) continue;
        differenceCount += 1;
        const block = document.createElement('details');
        const summary = document.createElement('summary'); summary.textContent = `${t('Page')} ${index + 1} · ${index >= first.pages.length ? t('added') : index >= second.pages.length ? t('removed') : t('text changed')}`;
        const content = document.createElement('pre'); content.textContent = `${t('Original')}:\n${first.pages[index] || t('(no extractable text)')}\n\n${t('Updated')}:\n${second.pages[index] || t('(no extractable text)')}`;
        block.append(summary, content); results.append(block);
      }
      if (!differenceCount) { const message = document.createElement('p'); message.textContent = t('No text differences were found on matching pages.'); results.append(message); }
      statusEl.textContent = `${differenceCount} ${t(differenceCount === 1 ? 'page has text differences.' : 'pages have text differences.')} ${t('Page counts')}: ${first.pageCount} / ${second.pageCount}.`;
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function setupPdfFormFiller(root) {
  const input = $('#suite-form-file', root); const fields = $('#suite-form-fields', root); const canvas = $('#suite-signature-canvas', root); const ctx = canvas.getContext('2d');
  const saveButton = $('[data-action="save-filled-pdf"]', root); const state = { file: null, supported: [], drawing: false, signed: false };
  ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111111';
  const point = (event) => { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; };
  canvas.addEventListener('pointerdown', (event) => { state.drawing = true; state.signed = true; canvas.setPointerCapture(event.pointerId); const p = point(event); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
  canvas.addEventListener('pointermove', (event) => { if (!state.drawing) return; const p = point(event); ctx.lineTo(p.x, p.y); ctx.stroke(); });
  const endStroke = () => { state.drawing = false; };
  canvas.addEventListener('pointerup', endStroke); canvas.addEventListener('pointercancel', endStroke);
  input.addEventListener('change', async () => {
    state.file = input.files?.[0] ?? null; state.supported = []; fields.replaceChildren(); clearLinks(root); saveButton.disabled = true;
    if (!state.file) return;
    try {
      const { PDFDocument, PDFTextField, PDFCheckBox } = await loadPdfLib(); const pdf = await PDFDocument.load(await state.file.arrayBuffer(), { updateMetadata: false });
      const form = pdf.getForm();
      for (const field of form.getFields()) {
        const kind = field instanceof PDFTextField ? 'PDFTextField' : field instanceof PDFCheckBox ? 'PDFCheckBox' : null;
        if (!kind) continue;
        const wrapper = document.createElement('label'); wrapper.className = 'field-label'; wrapper.textContent = field.getName();
        const control = document.createElement(kind === 'PDFCheckBox' ? 'input' : 'input'); control.type = kind === 'PDFCheckBox' ? 'checkbox' : 'text'; control.className = kind === 'PDFCheckBox' ? '' : 'tool-input'; control.dataset.fieldName = field.getName();
        if (kind === 'PDFTextField') control.value = field.getText() ?? '';
        else control.checked = field.isChecked();
        wrapper.append(control); fields.append(wrapper); state.supported.push(field.getName());
      }
      $('#suite-signature-page', root).max = String(pdf.getPageCount());
      saveButton.disabled = false;
      status(root, state.supported.length ? `${state.supported.length} ${t('supported form fields found.')}` : 'No supported text or checkbox fields were found. You can still place a visual signature.', state.supported.length ? 'success' : '');
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear-signature') { ctx.clearRect(0, 0, canvas.width, canvas.height); state.signed = false; return; }
    if (action === 'clear') { input.value = ''; state.file = null; fields.replaceChildren(); clearLinks(root); ctx.clearRect(0, 0, canvas.width, canvas.height); state.signed = false; saveButton.disabled = true; status(root, 'Choose a PDF form to begin.'); return; }
    if (action !== 'save-filled-pdf' || !state.file) return;
    try {
      const { PDFDocument } = await loadPdfLib(); const pdf = await PDFDocument.load(await state.file.arrayBuffer(), { updateMetadata: false }); const form = pdf.getForm();
      for (const control of $$('[data-field-name]', fields)) {
        const name = control.dataset.fieldName;
        if (control.type === 'checkbox') { const field = form.getCheckBox(name); control.checked ? field.check() : field.uncheck(); }
        else form.getTextField(name).setText(control.value);
      }
      if (state.signed) {
        const pageNumber = Number($('#suite-signature-page', root).value);
        if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pdf.getPageCount()) throw new RangeError('Choose an existing page for the visual signature.');
        const png = await pdf.embedPng(canvas.toDataURL('image/png')); const page = pdf.getPage(pageNumber - 1); const { width } = page.getSize();
        page.drawImage(png, { x: 36, y: 30, width: Math.min(190, width * 0.35), height: Math.min(46, width * 0.085) });
      }
      form.updateFieldAppearances();
      const bytes = await pdf.save({ useObjectStreams: true }); makeDownload($('#suite-downloads', root), new Blob([bytes], { type: 'application/pdf' }), safeFileName(state.file.name, '-filled.pdf'), 'Download PDF');
      status(root, 'Your filled copy is ready. The original PDF is unchanged.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function setupPdfOcr(root) {
  const input = $('#suite-ocr-file', root); const output = $('#suite-ocr-output', root); const progress = $('#suite-ocr-progress', root); const run = $('[data-action="run-ocr"]', root); const cancelButton = $('[data-action="cancel-ocr"]', root);
  let worker = null; let cancelled = false;
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-ocr') { cancelled = true; cancelButton.disabled = true; status(root, 'Stopping OCR…'); await worker?.terminate().catch(() => {}); worker = null; return; }
    if (action === 'clear') { input.value = ''; output.value = ''; progress.hidden = true; progress.value = 0; status(root, 'Text-based PDFs can be extracted without OCR.'); return; }
    if (action === 'copy-ocr') {
      try { await navigator.clipboard.writeText(output.value); status(root, 'Copied to your clipboard.', 'success'); }
      catch { status(root, 'Copy was blocked. Select the text and copy it manually.', 'error'); }
      return;
    }
    if (action === 'download-ocr') { if (!output.value) return status(root, 'There is no extracted text yet.', 'error'); makeDownload($('#suite-downloads', root), new Blob([output.value], { type: 'text/plain;charset=utf-8' }), safeFileName(input.files?.[0]?.name ?? 'document.pdf', '.txt')); return; }
    if (action !== 'run-ocr') return;
    const file = input.files?.[0]; if (!file) return status(root, 'Choose a PDF first.', 'error');
    cancelled = false; run.disabled = true; cancelButton.disabled = false; progress.hidden = false; progress.value = 0; output.value = '';
    let task;
    try {
      const pdfjs = await loadPdfJs(); task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }); const pdf = await task.promise;
      if (pdf.numPages > 120) throw new RangeError('For safety, this tool supports up to 120 pages at a time. Use the page range to process a smaller section.');
      const selection = $('#suite-ocr-pages', root).value.trim().toLowerCase();
      const pages = selection === 'all' || !selection ? Array.from({ length: pdf.numPages }, (_, i) => i + 1) : parsePageRange(selection, pdf.numPages);
      const hasText = new Map();
      for (const pageNumber of pages) {
        const page = await pdf.getPage(pageNumber); const text = await page.getTextContent(); const extracted = text.items.map((item) => item.str).join(' ').trim();
        page.cleanup();
        if (extracted.length > 20) hasText.set(pageNumber, extracted);
      }
      let ocrWorker;
      if (hasText.size < pages.length) {
        const { createWorker, OEM } = await import(versioned('/assets/tool-suite-ocr.js'));
        ocrWorker = await createWorker($('#suite-ocr-language', root).value, OEM.LSTM_ONLY, {
          workerPath: versioned('/assets/vendor/tesseract-7.0.0/worker.min.js'),
          corePath: '/assets/vendor/tesseract-7.0.0/',
          langPath: '/assets/ocr-languages-4.0.0/',
          gzip: true,
          logger: (info) => { if (info.progress != null) { const base = hasText.size; progress.value = Math.round((base + info.progress) / pages.length * 100); } },
        }); worker = ocrWorker;
      }
      const outputPages = [];
      for (let index = 0; index < pages.length; index += 1) {
        if (cancelled) break;
        const pageNumber = pages[index]; let text = hasText.get(pageNumber);
        if (text === undefined) {
          const page = await pdf.getPage(pageNumber); const viewport = page.getViewport({ scale: Math.min(1.7, 1800 / page.getViewport({ scale: 1 }).width) });
          const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d', { alpha: false }); if (!context) throw new Error('Canvas is not available in this browser.');
          await page.render({ canvasContext: context, viewport, background: '#ffffff' }).promise;
          const result = await ocrWorker.recognize(canvas); text = result.data.text.trim();
          canvas.width = 1; canvas.height = 1; page.cleanup();
        }
        outputPages.push(`--- ${t('Page')} ${pageNumber} ---\n${text}`);
        progress.value = Math.round((index + 1) / pages.length * 100); status(root, `Reading page ${index + 1} of ${pages.length} on your device…`);
      }
      output.value = outputPages.join('\n\n');
      if (!cancelled) status(root, `Text is ready from ${pages.length} page${pages.length === 1 ? '' : 's'}. The original PDF is unchanged.`, 'success');
      else status(root, 'OCR stopped. Text from completed pages is kept.');
      await worker?.terminate().catch(() => {}); worker = null;
    } catch (error) { status(root, errorMessage(error), 'error'); }
    finally { await task?.destroy().catch(() => {}); run.disabled = false; cancelButton.disabled = true; }
  });
}

function parsePageRange(value, total) {
  const selected = new Set();
  for (const part of value.split(',').map((item) => item.trim()).filter(Boolean)) {
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/u.exec(part);
    if (!match) throw new TypeError('Use page numbers such as 1,3-5.');
    const start = Number(match[1]); const end = Number(match[2] ?? match[1]);
    if (start < 1 || end < start || end > total) throw new RangeError(`Choose page numbers from 1 to ${total}.`);
    for (let page = start; page <= end; page += 1) selected.add(page);
  }
  if (!selected.size) throw new TypeError('Enter at least one page number.');
  return [...selected].sort((a, b) => a - b);
}

function xmlEscape(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;'); }

function createDocx(paragraphs) {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs.map((line) => `<w:p><w:r><w:t xml:space="preserve">${xmlEscape(line)}</w:t></w:r></w:p>`).join('')}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`;
  const files = {
    '[Content_Types].xml': strToU8('<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'),
    '_rels/.rels': strToU8('<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'),
    'word/document.xml': strToU8(documentXml),
  };
  return zipSync(files, { level: 6 });
}

function extractDocxText(bytes) {
  inspectZipArchive(bytes, { maxFiles: 500, maxExpandedBytes: 100 * 1024 * 1024, maxFileBytes: 50 * 1024 * 1024 });
  const files = unzipSync(bytes); const doc = files['word/document.xml'];
  if (!doc) throw new TypeError('This DOCX package has no main document.');
  const xml = new TextDecoder().decode(doc);
  return [...xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/gu)].map(([, paragraph]) => {
    const text = [...paragraph.matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/gu)].map(([, value]) => value.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&amp;', '&')).join('');
    return text;
  });
}

async function textToPdf(paragraphs) {
  const { PDFDocument, StandardFonts, rgb } = await loadPdfLib(); const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica); const fontSize = 11; const margin = 54; let page = pdf.addPage([612, 792]); let y = 738;
  const wrap = (text, maxWidth) => { const lines = []; let line = ''; for (const word of text.split(/\s+/u)) { const candidate = line ? `${line} ${word}` : word; if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && line) { lines.push(line); line = word; } else line = candidate; } if (line) lines.push(line); return lines; };
  for (const paragraph of paragraphs) {
    for (const line of wrap(paragraph, 504)) {
      if (y < margin + 18) { page = pdf.addPage([612, 792]); y = 738; }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.08, 0.08, 0.08), maxWidth: 504 }); y -= 16;
    }
    y -= 8;
  }
  return pdf.save({ useObjectStreams: true, addDefaultPage: false });
}

function setupDocumentConverter(root) {
  const modeInput = $('#suite-doc-mode', root); const input = $('#suite-doc-file', root);
  const acceptByMode = {
    'pdf-docx': 'application/pdf,.pdf', 'docx-pdf': '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pdf-xlsx': 'application/pdf,.pdf', 'xlsx-pdf': '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pdf-pptx': 'application/pdf,.pdf', 'pptx-pdf': '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  const selectedMode = () => modeInput?.value ?? 'pdf-docx';
  modeInput?.addEventListener('change', () => { input.accept = acceptByMode[selectedMode()]; input.value = ''; clearLinks(root); status(root, ''); });
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-action="clear"]')) { input.value = ''; clearLinks(root); status(root, ''); return; }
    if (!event.target.closest('[data-action="convert-document"]')) return;
    const mode = selectedMode();
    const file = input.files?.[0]; if (!file) return status(root, 'Choose a file first.', 'error');
    if (file.size > 100 * 1024 * 1024) return status(root, 'For this browser-based tool, choose a document under 100 MB.', 'error');
    const needsPrintWindow = mode === 'xlsx-pdf' || mode === 'pptx-pdf';
    const printWindow = needsPrintWindow ? window.open('', '_blank') : null;
    if (needsPrintWindow && !printWindow) return status(root, 'Your browser blocked the print tab. Allow pop-ups for this site and try again.', 'error');
    try {
      if (mode === 'pdf-docx') {
        const result = await getPdfText(file, (page, total) => status(root, `${t('Processing PDF page')} ${page}/${total}…`));
        const bytes = createDocx(result.pages.flatMap((text) => [text, ''])); makeDownload($('#suite-downloads', root), new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), safeFileName(file.name, '.docx'), 'Download Word file');
      } else if (mode === 'pdf-xlsx') {
        const items = await getPdfTextItems(file, (page, total) => status(root, `${t('Processing PDF page')} ${page}/${total}…`));
        const rows = pdfTextPagesToRows(items);
        const bytes = createXlsx(rows, file.name.replace(/\.[^.]+$/u, '').slice(0, 31) || 'PDF text');
        makeDownload($('#suite-downloads', root), new Blob([bytes], { type: PDF_OFFICE_MIME.xlsx }), safeFileName(file.name, '-extracted.xlsx'), 'Download Excel file');
        status(root, 'The converted file is ready. Review the result and keep the original.', 'success');
      } else if (mode === 'pdf-pptx') {
        const images = await renderPdfImagesForSlides(file, (page, total) => status(root, `${t('Processing PDF page')} ${page}/${total}…`));
        const bytes = createImageSlidesPptx(images);
        makeDownload($('#suite-downloads', root), new Blob([bytes], { type: PDF_OFFICE_MIME.pptx }), safeFileName(file.name, '-slides.pptx'), 'Download PowerPoint file');
        status(root, 'The converted file is ready. Review the result and keep the original.', 'success');
      } else if (mode === 'xlsx-pdf' || mode === 'pptx-pdf') {
        status(root, 'Preparing a local print view…');
        const html = mode === 'xlsx-pdf'
          ? xlsxToPrintHtml(new Uint8Array(await file.arrayBuffer()), file.name)
          : pptxToPrintHtml(new Uint8Array(await file.arrayBuffer()), file.name);
        const printCss = mode === 'pptx-pdf'
          ? '.slide{position:relative;aspect-ratio:16/9;width:100%;max-width:1100px;margin:20px auto 32px;background:#fff;border:1px solid #d5d5d5;overflow:hidden;break-after:page;page-break-after:always}.slide .shape,.slide img{position:absolute;box-sizing:border-box;object-fit:contain;overflow:hidden;white-space:pre-wrap;font:16px/1.25 Arial,sans-serif}@page{size:landscape;margin:8mm}@media print{body{max-width:none}.slide{width:100%;height:auto;margin:0;border:0;break-after:page;page-break-after:always}}'
          : '@page{size:auto;margin:14mm}td{white-space:pre-wrap;vertical-align:top}section{break-after:page}section:last-child{break-after:auto}';
        writePrintWindow(printWindow, file.name, html, printCss);
        status(root, 'Office print view opened. Check it, then choose Save as PDF in the browser.', 'success');
        return;
      } else {
        const paragraphs = extractDocxText(new Uint8Array(await file.arrayBuffer())); if (!paragraphs.length) throw new TypeError('No readable paragraphs were found in this DOCX.');
        try {
          const bytes = await textToPdf(paragraphs);
          makeDownload($('#suite-downloads', root), new Blob([bytes], { type: 'application/pdf' }), safeFileName(file.name, '.pdf'), 'Download PDF');
        } catch (error) {
          if (!/WinAnsi cannot encode/u.test(error?.message ?? '')) throw error;
          const content = paragraphs.map((paragraph) => `<p class="pre" dir="auto">${esc(paragraph) || '&nbsp;'}</p>`).join('');
          openPrintWindow(file.name, content);
          status(root, 'Some characters need your browser fonts. In the print window, choose Save as PDF.', 'success');
          return;
        }
      }
      status(root, 'The converted file is ready. Review the result and keep the original.', 'success');
    } catch (error) { if (printWindow && !printWindow.closed) printWindow.close(); status(root, errorMessage(error), 'error'); }
  });
}

function setupHtmlToPdf(root) {
  const titleInput = $('#suite-html-title', root);
  const source = $('#suite-html-source', root);
  const preview = $('#suite-html-preview', root);
  const buttons = $$('[data-action="preview-html-pdf"], [data-action="print-html-pdf"]', root);
  const allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'strong', 'em', 'b', 'i', 'u',
    's', 'del', 'blockquote', 'pre', 'code', 'ul', 'ol', 'li', 'table', 'thead', 'tbody',
    'tfoot', 'tr', 'th', 'td', 'caption', 'sup', 'sub',
  ];
  let busy = false;
  const documentHtml = (title, content) => `<!doctype html><html lang="${esc(document.documentElement.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{font:16px/1.55 Arial,sans-serif;max-width:820px;margin:32px auto;padding:0 28px;color:#171717}h1,h2,h3,h4{line-height:1.2}table{width:100%;border-collapse:collapse;margin:1.25em 0}th,td{border:1px solid #888;padding:.5em;text-align:start}pre{white-space:pre-wrap;overflow-wrap:anywhere}blockquote{border-inline-start:3px solid #888;margin-inline:0;padding-inline-start:1em}@page{margin:18mm}@media print{body{margin:0;padding:0;max-width:none}}</style></head><body>${content}</body></html>`;
  const render = async () => {
    const markup = source.value.trim();
    if (!markup) throw new TypeError('Enter HTML content before continuing.');
    const purifier = await loadDomPurify();
    const safeContent = purifier.sanitize(markup, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: ['colspan', 'rowspan', 'scope'],
      ALLOW_DATA_ATTR: false,
      ALLOW_ARIA_ATTR: false,
      KEEP_CONTENT: true,
      RETURN_TRUSTED_TYPE: false,
    });
    if (!safeContent.trim()) throw new TypeError('No printable text or tables remain after removing unsupported HTML.');
    return { safeContent, html: documentHtml(titleInput.value.trim() || 'Document', safeContent) };
  };
  const showError = (error) => status(root, document.documentElement.lang.toLowerCase().startsWith('en') ? error.message : t('Check the values and try again.'), 'error');
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      titleInput.value = '';
      source.value = '';
      preview.srcdoc = '';
      preview.hidden = true;
      status(root, 'Enter content, then preview it or open your browser’s print dialog.');
      return;
    }
    if (busy || (action !== 'preview-html-pdf' && action !== 'print-html-pdf')) return;
    if (action === 'preview-html-pdf') {
      busy = true; buttons.forEach((button) => { button.disabled = true; });
      try {
        const result = await render();
        preview.srcdoc = result.html;
        preview.hidden = false;
        status(root, 'Preview ready. Check the page before printing.', 'success');
      } catch (error) { showError(error); }
      finally { busy = false; buttons.forEach((button) => { button.disabled = false; }); }
      return;
    }

    // Open the tab within the user's click gesture; loading the sanitizer is async and
    // otherwise browsers may block the later popup as an unsolicited window.
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      status(root, t('Your browser blocked the print tab. Allow pop-ups for this site and try again.'), 'error');
      return;
    }
    printWindow.document.write('<!doctype html><title>Preparing print view…</title><p>Preparing a safe print view…</p>');
    busy = true; buttons.forEach((button) => { button.disabled = true; });
    try {
      const result = await render();
      writePrintWindow(printWindow, titleInput.value.trim() || 'Document', result.safeContent);
      status(root, 'Print dialog opened. Choose Save as PDF to create the file.', 'success');
    } catch (error) {
      printWindow.close();
      showError(error);
    } finally { busy = false; buttons.forEach((button) => { button.disabled = false; }); }
  });
}

function setupPdfMarkdown(root) {
  const input = $('#suite-markdown-file', root);
  const output = $('#suite-markdown-output', root);
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-action="clear"]')) {
      input.value = ''; output.value = ''; clearLinks(root); status(root, 'Choose a PDF to start.'); return;
    }
    if (!event.target.closest('[data-action="convert-markdown"]')) return;
    const file = input.files?.[0];
    if (!file) return status(root, 'Choose a PDF to start.', 'error');
    if (file.size > 50 * 1024 * 1024) return status(root, 'For this browser-based tool, choose a PDF under 50 MB.', 'error');
    output.value = ''; clearLinks(root);
    try {
      const result = await getPdfText(file, (page, total) => status(root, `Reading PDF page ${page} of ${total} on your device…`));
      const markdown = result.pages.map((text, index) => `## Page ${index + 1}\n\n${text}`).join('\n\n');
      if (!markdown.replace(/#+\s*Page\s+\d+/gu, '').trim()) throw new TypeError('No selectable text was found. For a scanned PDF, run OCR first.');
      output.value = markdown;
      makeDownload($('#suite-downloads', root), new Blob([markdown], { type: 'text/markdown;charset=utf-8' }), safeFileName(file.name, '.md'), 'Download');
      status(root, 'Markdown conversion complete. Review the extracted text and download the file.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function setupZip(root) {
  let mode = 'create'; const input = $('#suite-zip-files', root);
  root.addEventListener('click', async (event) => {
    const modeButton = event.target.closest('[data-zip-mode]');
    if (modeButton) { mode = modeButton.dataset.zipMode; $$('[data-zip-mode]', root).forEach((button) => { button.classList.toggle('is-active', button === modeButton); button.setAttribute('aria-pressed', String(button === modeButton)); }); input.multiple = mode === 'create'; input.accept = mode === 'extract' ? '.zip,application/zip' : ''; input.value = ''; clearLinks(root); $('[data-action="run-zip"]', root).textContent = t(mode === 'create' ? 'Create ZIP' : 'Open ZIP'); }
    if (event.target.closest('[data-action="clear"]')) { input.value = ''; clearLinks(root); status(root, 'Files are not uploaded.'); return; }
    if (!event.target.closest('[data-action="run-zip"]')) return;
    const files = [...(input.files ?? [])]; if (!files.length) return status(root, 'Choose at least one file.', 'error'); clearLinks(root);
    try {
      const downloads = $('#suite-downloads', root);
      if (mode === 'create') {
        if (files.length > 200) throw new RangeError('Choose no more than 200 files for one ZIP.');
        const contents = Object.create(null); let totalBytes = 0; const names = new Set();
        for (const file of files) {
          totalBytes += file.size;
          if (totalBytes > 100 * 1024 * 1024) throw new RangeError('Choose files with a combined size of 100 MB or less for this browser tool.');
          const baseName = (file.name.split(/[\\/]/u).at(-1) || 'file').replace(/[\\/]/gu, '_').slice(0, 200);
          let name = baseName; let suffix = 2;
          while (names.has(name)) { const dot = baseName.lastIndexOf('.'); name = dot > 0 ? `${baseName.slice(0, dot)} (${suffix++})${baseName.slice(dot)}` : `${baseName} (${suffix++})`; }
          names.add(name); contents[name] = new Uint8Array(await file.arrayBuffer());
        }
        const zip = zipSync(contents, { level: 6 }); makeDownload(downloads, new Blob([zip], { type: 'application/zip' }), 'usefulverse-files.zip'); status(root, `${files.length} ${t('files added to the ZIP.')}`, 'success');
      } else {
        if (files.length !== 1) throw new RangeError('Choose one ZIP archive to open.');
        if (files[0].size > 100 * 1024 * 1024) throw new RangeError('Choose a ZIP file of 100 MB or less for this browser tool.');
        const archive = new Uint8Array(await files[0].arrayBuffer()); const inspection = inspectZipArchive(archive); const extracted = unzipSync(archive, { filter: (entry) => !entry.name.endsWith('/') });
        for (const [name, data] of Object.entries(extracted)) { if (name.endsWith('/')) continue; const blob = new Blob([data]); makeDownload(downloads, blob, name.split('/').at(-1), 'Download', true); }
        status(root, `${inspection.entryCount} ${t('archive entries checked. Download each file below.')}`, 'success');
      }
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function setupMediaConverter(root) {
  const fileInput = $('#suite-media-file', root); const button = $('[data-action="convert-media"]', root); const cancel = $('[data-action="cancel-media"]', root); const progress = $('#suite-media-progress', root);
  let controller = null;
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { controller?.abort(); controller = null; fileInput.value = ''; progress.hidden = true; clearLinks(root); status(root, 'Choose an audio or video file.'); return; }
    if (action === 'cancel-media') { controller?.abort(); cancel.disabled = true; status(root, 'Stopping conversion…'); return; }
    if (action !== 'convert-media' || controller) return;
    const file = fileInput.files?.[0]; if (!file) return status(root, 'Choose an audio or video file first.', 'error');
    const format = $('#suite-media-format', root).value; const start = Number($('#suite-media-start', root).value); const endText = $('#suite-media-end', root).value.trim(); const end = endText ? Number(endText) : undefined;
    let writable = null; let streamHandle = null;
    try {
      if ($('#suite-media-stream-save', root).checked) {
        if (!('showSaveFilePicker' in window)) throw new Error('Direct-to-disk streaming is unavailable in this browser. Uncheck the option to create a regular download instead.');
        const extension = format;
        streamHandle = await window.showSaveFilePicker({ suggestedName: safeFileName(file.name, `.${extension}`), types: [{ description: t('Converted media'), accept: { [format === 'mp3' ? 'audio/mpeg' : format === 'm4a' ? 'audio/mp4' : format === 'ogg' ? 'audio/ogg' : format === 'webm' ? 'video/webm' : 'video/mp4']: [`.${extension}`] } }] });
        writable = await streamHandle.createWritable();
      }
      const { convertMedia } = await import(versioned('/assets/vendor/media-converter.mjs'));
      controller = new AbortController(); button.disabled = true; cancel.disabled = false; progress.hidden = false; progress.value = 0; clearLinks(root);
      status(root, 'Preparing conversion on your device…');
      const result = await convertMedia({ file, format, start, end, writable, signal: controller.signal, onProgress: (value) => { progress.value = value; status(root, `Converting on your device · ${value}%`); } });
      if (result.streamed) status(root, `Saved ${result.extension.toUpperCase()} file to your selected location.`, 'success');
      else { makeDownload($('#suite-downloads', root), result.blob, safeFileName(file.name, `.${result.extension}`), 'Download'); status(root, 'Converted file is ready. Your original is unchanged.', 'success'); }
    } catch (error) {
      if (writable) await writable.abort().catch(() => {});
      status(root, error?.name === 'AbortError' ? 'Conversion stopped. The original file is unchanged.' : errorMessage(error), error?.name === 'AbortError' ? '' : 'error');
    } finally { controller = null; button.disabled = false; cancel.disabled = true; }
  });
}

function formatNumber(value, digits = 2) { return new Intl.NumberFormat(lang, { maximumFractionDigits: digits }).format(value); }
function getNumber(root, selector) { const value = Number($(selector, root).value); if (!Number.isFinite(value)) throw new TypeError('Enter valid numbers in every required field.'); return value; }

function setupScientific(root) {
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-action="clear"]')) { $('#suite-expression', root).value = ''; $('#suite-scientific-result', root).textContent = '—'; status(root, 'Calculation runs locally in your browser.'); return; }
    if (!event.target.closest('[data-action="calculate-scientific"]')) return;
    try { const result = evaluateScientificExpression($('#suite-expression', root).value, $('#suite-angle-radians', root).checked ? 'radians' : 'degrees'); $('#suite-scientific-result', root).textContent = new Intl.NumberFormat(lang, { maximumSignificantDigits: 12 }).format(result); status(root, 'Calculation complete.', 'success'); }
    catch (error) { $('#suite-scientific-result', root).textContent = '—'; status(root, errorMessage(error), 'error'); }
  });
  $('#suite-expression', root).addEventListener('keydown', (event) => { if (event.key === 'Enter') $('[data-action="calculate-scientific"]', root).click(); });
}

function setupLoan(root) {
  const reset = () => { $('#suite-loan-principal', root).value = '25000'; $('#suite-loan-rate', root).value = '6.5'; $('#suite-loan-years', root).value = '5'; $('#suite-loan-extra', root).value = '0'; for (const id of ['payment', 'interest', 'total', 'duration']) $(`#suite-loan-${id}`, root).textContent = '—'; };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="clear"]')) { reset(); status(root, ''); return; }
    if (!event.target.closest('[data-action="calculate-loan"]')) return;
    try {
      const result = calculateLoan(getNumber(root, '#suite-loan-principal'), getNumber(root, '#suite-loan-rate'), getNumber(root, '#suite-loan-years'), getNumber(root, '#suite-loan-extra'));
      $('#suite-loan-payment', root).textContent = formatNumber(result.scheduledPayment + Number($('#suite-loan-extra', root).value)); $('#suite-loan-interest', root).textContent = formatNumber(result.totalInterest); $('#suite-loan-total', root).textContent = formatNumber(result.totalPaid); $('#suite-loan-duration', root).textContent = `${Math.floor(result.months / 12)} ${t('years')}, ${result.months % 12} ${t('months')}`; status(root, 'Estimate calculated. Check your lender terms; actual costs may differ.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function setupCompound(root) {
  const reset = () => { $('#suite-growth-initial', root).value = '1000'; $('#suite-growth-contribution', root).value = '100'; $('#suite-growth-rate', root).value = '5'; $('#suite-growth-years', root).value = '10'; $('#suite-growth-frequency', root).value = '12'; $('#suite-growth-start', root).checked = false; for (const id of ['total', 'contributions', 'interest']) $(`#suite-growth-${id}`, root).textContent = '—'; };
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-action="clear"]')) { reset(); status(root, ''); return; }
    if (!event.target.closest('[data-action="calculate-growth"]')) return;
    try {
      const result = calculateCompoundInterest({ initial: getNumber(root, '#suite-growth-initial'), contribution: getNumber(root, '#suite-growth-contribution'), annualRate: getNumber(root, '#suite-growth-rate'), years: getNumber(root, '#suite-growth-years'), compoundsPerYear: Number($('#suite-growth-frequency', root).value), contributeAtStart: $('#suite-growth-start', root).checked });
      $('#suite-growth-total', root).textContent = formatNumber(result.finalBalance); $('#suite-growth-contributions', root).textContent = formatNumber(result.contributions); $('#suite-growth-interest', root).textContent = formatNumber(result.interestEarned); status(root, 'Projection calculated. Returns are not guaranteed.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
  });
}

function esc(value) { return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;'); }

function writePrintWindow(printWindow, title, content, extraCss = '') {
  printWindow.document.open();
  printWindow.document.write(`<!doctype html><html lang="${esc(document.documentElement.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>body{font:16px/1.5 Arial,sans-serif;max-width:820px;margin:36px auto;padding:0 28px;color:#151515}h1,h2{line-height:1.2}h1{font-size:28px}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;padding:9px;border-bottom:1px solid #ddd}td:last-child,th:last-child{text-align:right}.total{margin-left:auto;max-width:300px}.pre{white-space:pre-wrap}${extraCss}@media print{body{margin:0;padding:0}}</style></head><body>${content}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),150))<\/script></body></html>`);
  printWindow.document.close();
}

function openPrintWindow(title, content) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) throw new Error('Your browser blocked the print tab. Allow pop-ups for this site and try again.');
  writePrintWindow(printWindow, title, content);
}

function setupInvoice(root) {
  const preview = $('#suite-invoice-preview', root);
  function render() {
    const items = $('#suite-invoice-items', root).value.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [description, quantityText = '1', priceText = '0'] = line.split(','); const quantity = Number(quantityText); const price = Number(priceText);
      if (!description || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0) throw new TypeError('Each item must be description, quantity, unit price.');
      return { description: description.trim(), quantity, price, amount: quantity * price };
    });
    if (!items.length) throw new TypeError('Add at least one line item.');
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0); const tax = Number($('#suite-invoice-tax', root).value); if (!Number.isFinite(tax) || tax < 0 || tax > 100) throw new TypeError('Tax must be between 0 and 100 percent.');
    const currency = ($('#suite-invoice-currency', root).value.trim().toUpperCase() || 'USD');
    const format = (number) => { try { return new Intl.NumberFormat(lang, { style: 'currency', currency }).format(number); } catch { return `${currency} ${formatNumber(number)}`; } };
    const rows = items.map((item) => `<tr><td>${esc(item.description)}</td><td>${formatNumber(item.quantity)}</td><td>${format(item.price)}</td><td>${format(item.amount)}</td></tr>`).join('');
    const grandTotal = subtotal * (1 + tax / 100);
    preview.innerHTML = `<h2>${esc(t('Invoice'))} ${esc($('#suite-invoice-number', root).value)}</h2><p>${esc($('#suite-invoice-from', root).value)} → ${esc($('#suite-invoice-to', root).value)}</p><p>${esc($('#suite-invoice-date', root).value)}</p><table><thead><tr><th>${esc(t('Description'))}</th><th>${esc(t('Quantity'))}</th><th>${esc(t('Unit price'))}</th><th>${esc(t('Amount'))}</th></tr></thead><tbody>${rows}</tbody></table><div class="invoice-total"><p>${esc(t('Subtotal'))}: ${format(subtotal)}</p><p>${esc(t('Tax'))} (${formatNumber(tax)}%): ${format(subtotal * tax / 100)}</p><h3>${esc(t('Total'))}: ${format(grandTotal)}</h3></div>`;
    return preview.innerHTML;
  }
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { root.querySelectorAll('input,textarea').forEach((element) => { if (element.id === 'suite-invoice-number') element.value = 'INV-001'; else if (element.id === 'suite-invoice-currency') element.value = 'USD'; else if (element.id === 'suite-invoice-tax') element.value = '0'; else element.value = ''; }); preview.replaceChildren(); status(root, ''); return; }
    if (action === 'preview-invoice') { try { render(); status(root, 'Invoice preview is ready.', 'success'); } catch (error) { status(root, errorMessage(error), 'error'); } }
    if (action === 'print-invoice') { try { const content = render(); openPrintWindow('Invoice', content); status(root, 'Print dialog opened. Choose Save as PDF to download a copy.', 'success'); } catch (error) { status(root, errorMessage(error), 'error'); } }
  });
}

function setupResume(root) {
  const preview = $('#suite-resume-preview', root);
  function render() {
    const name = $('#suite-resume-name', root).value.trim(); if (!name) throw new TypeError('Enter your name first.');
    const role = $('#suite-resume-role', root).value.trim(); const location = $('#suite-resume-location', root).value.trim(); const email = $('#suite-resume-email', root).value.trim();
    const section = (title, text) => text.trim() ? `<section><h2>${esc(title)}</h2><p class="pre">${esc(text.trim())}</p></section>` : '';
    preview.innerHTML = `<header><h1>${esc(name)}</h1><p>${esc([role, location, email].filter(Boolean).join(' · '))}</p></header>${section(t('Profile'), $('#suite-resume-summary', root).value)}${section(t('Experience'), $('#suite-resume-experience', root).value)}${section(t('Education'), $('#suite-resume-education', root).value)}${section(t('Skills'), $('#suite-resume-skills', root).value)}`;
    return preview.innerHTML;
  }
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') { root.querySelectorAll('input,textarea').forEach((element) => { element.value = ''; }); preview.replaceChildren(); status(root, ''); return; }
    if (action === 'preview-resume') { try { render(); status(root, 'CV preview is ready.', 'success'); } catch (error) { status(root, errorMessage(error), 'error'); } }
    if (action === 'print-resume') { try { const content = render(); openPrintWindow($('#suite-resume-name', root).value, content); status(root, 'Print dialog opened. Choose Save as PDF to download a copy.', 'success'); } catch (error) { status(root, errorMessage(error), 'error'); } }
  });
}

function setupPortraitBackgroundRemover(root) {
  const input = $('#suite-portrait-file', root);
  const run = $('[data-action="remove-portrait-background"]', root);
  const cancel = $('[data-action="cancel-portrait"]', root);
  const progress = $('#suite-portrait-progress', root);
  const results = $('#suite-portrait-results', root);
  const original = $('#suite-portrait-original', root);
  const output = $('#suite-portrait-output', root);
  let worker = null; let originalUrl = null; let outputUrl = null; let requestId = 0;
  const revoke = (url) => { if (url) URL.revokeObjectURL(url); };
  const clearResult = () => {
    revoke(originalUrl); revoke(outputUrl); originalUrl = null; outputUrl = null;
    original.removeAttribute('src'); output.removeAttribute('src'); results.hidden = true; clearLinks(root);
  };
  const stop = (showMessage = true) => {
    worker?.terminate(); worker = null; run.disabled = !input.files?.[0]; cancel.hidden = true; progress.hidden = true;
    if (showMessage) status(root, 'Background removal stopped. Your original image is unchanged.');
  };
  input.addEventListener('change', () => {
    stop(false); clearResult(); progress.value = 0; run.disabled = !input.files?.[0];
    status(root, input.files?.[0] ? 'Ready to remove the background.' : 'Choose a portrait image.');
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      stop(false); input.value = ''; clearResult(); run.disabled = true; progress.value = 0; status(root, 'Choose a portrait image.'); return;
    }
    if (action === 'cancel-portrait') { stop(); return; }
    if (action !== 'remove-portrait-background') return;
    const file = input.files?.[0];
    if (!file) { status(root, 'Choose an image first.', 'error'); return; }
    clearResult(); run.disabled = true; cancel.hidden = false; progress.hidden = false; progress.value = 0;
    try {
      const bitmap = await createImageBitmap(file);
      const pixels = bitmap.width * bitmap.height; bitmap.close();
      if (pixels > 20_000_000) throw new RangeError('Portrait image must be 20 megapixels or smaller. Resize it before processing.');
      originalUrl = URL.createObjectURL(file); original.src = originalUrl; results.hidden = false;
      worker = new Worker(versioned('/assets/portrait-background-worker.js'), { type: 'module' });
      const id = ++requestId;
      worker.addEventListener('message', ({ data }) => {
        if (data.id !== id) return;
        if (data.type === 'model-loading') status(root, 'Model loading');
        if (data.type === 'model-progress') progress.value = data.progress;
        if (data.type === 'processing') { progress.value = 100; status(root, 'Processing the photo locally…'); }
        if (data.type === 'result') {
          outputUrl = URL.createObjectURL(data.png); output.src = outputUrl;
          makeDownload($('#suite-downloads', root), data.png, safeFileName(file.name, '-no-background.png'), 'Download transparent PNG');
          run.disabled = false; cancel.hidden = true; progress.hidden = true;
          status(root, 'Background removal complete. Review the edges before using the image.', 'success');
        }
        if (data.type === 'error') {
          run.disabled = false; cancel.hidden = true; progress.hidden = true;
          status(root, errorMessage(new Error(data.message)), 'error');
        }
      });
      worker.addEventListener('error', () => {
        run.disabled = false; cancel.hidden = true; progress.hidden = true;
        status(root, errorMessage(new Error('The background-removal model could not start. Try a supported browser or a smaller image.')), 'error');
        worker?.terminate(); worker = null;
      }, { once: true });
      worker.postMessage({ type: 'remove-background', id, file });
    } catch (error) {
      run.disabled = false; cancel.hidden = true; progress.hidden = true;
      status(root, errorMessage(error), 'error');
    }
  });
  window.addEventListener('pagehide', () => { stop(false); clearResult(); }, { once: true });
}

const setups = {
  'pdf-protect-unlock': (root) => setupQpdfTool(root),
  'pdf-repair': (root) => setupQpdfTool(root, 'repair'),
  'pdf-crop': setupPdfCrop,
  'pdf-redact': setupPdfRedact,
  'pdf-to-pdfa': setupPdfToPdfa,
  'pdf-page-editor': setupPdfPageEditor,
  'pdf-ocr': setupPdfOcr,
  'pdf-document-converter': setupDocumentConverter,
  'html-to-pdf': setupHtmlToPdf,
  'pdf-to-markdown': setupPdfMarkdown,
  'pdf-form-filler': setupPdfFormFiller,
  'pdf-compare': setupPdfCompare,
  'zip-archive-tool': setupZip,
  'media-converter': setupMediaConverter,
  'scientific-calculator': setupScientific,
  'loan-calculator': setupLoan,
  'compound-interest-calculator': setupCompound,
  'invoice-generator': setupInvoice,
  'resume-builder': setupResume,
  'portrait-background-remover': setupPortraitBackgroundRemover,
};

export function setupToolSuite(id, root) {
  setups[id]?.(root);
}
