import { calculateCompoundInterest, calculateLoan, evaluateScientificExpression, inspectZipArchive } from './tool-suite-logic.mjs';
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

function setupPdfPageEditor(root) {
  const input = $('#suite-pdf-file', root);
  const pageList = $('#suite-pages', root);
  const saveButton = $('[data-action="save-edited-pdf"]', root);
  const state = { file: null, order: [], removed: new Set(), rotations: new Map(), busy: false };
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
      rotate.type = 'button'; rotate.className = 'button button--ghost'; rotate.dataset.pageAction = 'rotate'; rotate.dataset.page = String(originalPage); rotate.textContent = t('Rotate 90°');
      const remove = document.createElement('button');
      remove.type = 'button'; remove.className = 'button button--ghost'; remove.dataset.pageAction = 'remove'; remove.dataset.page = String(originalPage); remove.textContent = t('Remove');
      card.append(label, angle, moveUp, moveDown, rotate, remove);
      pageList.append(card);
    });
    saveButton.disabled = !state.file || state.order.every((page) => state.removed.has(page)) || state.busy;
  };
  input.addEventListener('change', async () => {
    clearLinks(root); state.file = input.files?.[0] ?? null; state.order = []; state.removed.clear(); state.rotations.clear();
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
  root.addEventListener('click', async (event) => {
    const pageButton = event.target.closest('[data-page-action]');
    if (pageButton) {
      const page = Number(pageButton.dataset.page);
      const index = state.order.indexOf(page);
      if (pageButton.dataset.pageAction === 'remove') state.removed.add(page);
      if (pageButton.dataset.pageAction === 'rotate') state.rotations.set(page, ((state.rotations.get(page) ?? 0) + 90) % 360);
      if (pageButton.dataset.pageAction === 'up' && index > 0) [state.order[index - 1], state.order[index]] = [state.order[index], state.order[index - 1]];
      if (pageButton.dataset.pageAction === 'down' && index < state.order.length - 1) [state.order[index + 1], state.order[index]] = [state.order[index], state.order[index + 1]];
      renderPages(); return;
    }
    if (event.target.closest('[data-action="clear"]')) { input.value = ''; state.file = null; state.order = []; state.removed.clear(); state.rotations.clear(); clearLinks(root); renderPages(); status(root, 'Choose a PDF to start.'); return; }
    if (!event.target.closest('[data-action="save-edited-pdf"]') || !state.file || state.busy) return;
    state.busy = true; renderPages();
    try {
      const { PDFDocument, degrees, rgb } = await loadPdfLib();
      const source = await PDFDocument.load(await state.file.arrayBuffer(), { updateMetadata: false });
      const target = await PDFDocument.create();
      const pages = await target.copyPages(source, state.order.filter((page) => !state.removed.has(page)).map((page) => page - 1));
      pages.forEach((page, outputIndex) => {
        const sourceNumber = state.order.filter((item) => !state.removed.has(item))[outputIndex];
        const delta = state.rotations.get(sourceNumber) ?? 0;
        if (delta) page.setRotation(degrees((page.getRotation().angle + delta) % 360));
        target.addPage(page);
      });
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
  let mode = 'pdf-docx'; const input = $('#suite-doc-file', root);
  root.addEventListener('click', async (event) => {
    const modeButton = event.target.closest('[data-doc-mode]');
    if (modeButton) { mode = modeButton.dataset.docMode; $$('[data-doc-mode]', root).forEach((button) => { button.classList.toggle('is-active', button === modeButton); button.setAttribute('aria-pressed', String(button === modeButton)); }); input.accept = mode === 'pdf-docx' ? 'application/pdf,.pdf' : '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document'; input.value = ''; clearLinks(root); }
    if (event.target.closest('[data-action="clear"]')) { input.value = ''; clearLinks(root); status(root, ''); return; }
    if (!event.target.closest('[data-action="convert-document"]')) return;
    const file = input.files?.[0]; if (!file) return status(root, 'Choose a file first.', 'error');
    if (file.size > 100 * 1024 * 1024) return status(root, 'For this browser-based tool, choose a document under 100 MB.', 'error');
    try {
      if (mode === 'pdf-docx') {
        const result = await getPdfText(file, (page, total) => status(root, `Extracting text from page ${page} of ${total}…`));
        const bytes = createDocx(result.pages.flatMap((text) => [text, ''])); makeDownload($('#suite-downloads', root), new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }), safeFileName(file.name, '.docx'), 'Download Word file');
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
      status(root, 'Conversion is ready. Check the text and layout before sharing.', 'success');
    } catch (error) { status(root, errorMessage(error), 'error'); }
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

function openPrintWindow(title, content) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) throw new Error('Your browser blocked the print tab. Allow pop-ups for this site and try again.');
  printWindow.document.open();
  printWindow.document.write(`<!doctype html><html lang="${esc(document.documentElement.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title><style>body{font:16px/1.5 Arial,sans-serif;max-width:820px;margin:36px auto;padding:0 28px;color:#151515}h1,h2{line-height:1.2}h1{font-size:28px}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:left;padding:9px;border-bottom:1px solid #ddd}td:last-child,th:last-child{text-align:right}.total{margin-left:auto;max-width:300px}.pre{white-space:pre-wrap}@media print{body{margin:0;padding:0}}</style></head><body>${content}<script>window.addEventListener('load',()=>setTimeout(()=>window.print(),150))<\/script></body></html>`);
  printWindow.document.close();
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
  'pdf-page-editor': setupPdfPageEditor,
  'pdf-ocr': setupPdfOcr,
  'pdf-document-converter': setupDocumentConverter,
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
