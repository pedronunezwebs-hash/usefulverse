const localeBundle = window.usefulverseLocale ?? { messages: {}, runtime: {} };
const language = document.documentElement.lang || 'en';
const languageTag = localeBundle.tag ?? language;
const t = (message) => localeBundle.runtime?.[message] ?? localeBundle.messages?.[message] ?? message;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const toolVersion = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${toolVersion ? `?v=${encodeURIComponent(toolVersion)}` : ''}`;
const vendorDirectoryVersion = toolVersion ? `-${encodeURIComponent(toolVersion)}` : '';
const objectUrls = new Set();
window.addEventListener('pagehide', () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });

const logic = await import(versioned('./advanced-logic.mjs'));
const vendorPromises = new Map();

function loadVendorScript(filename, globalName) {
  if (window[globalName]) return Promise.resolve(window[globalName]);
  const path = `/assets/vendor/${filename}`;
  if (!vendorPromises.has(path)) vendorPromises.set(path, new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = versioned(path);
    script.onload = () => window[globalName] ? resolve(window[globalName]) : reject(new Error('A browser tool library could not load.'));
    script.onerror = () => reject(new Error('A browser tool library could not load.'));
    document.head.append(script);
  }));
  return vendorPromises.get(path);
}

function setStatus(root, message, type = '') {
  const status = $('#tool-status', root);
  if (!status) return;
  const translated = t(message);
  status.textContent = language !== 'en' && translated === message
    ? t(type === 'error' ? 'Check the values and try again.' : type === 'success' ? 'Done.' : 'Ready.')
    : translated;
  status.className = `tool-status${type ? ` is-${type}` : ''}`;
}

function parseNumber(value) {
  return logic.parseLocalizedNumber(value, languageTag);
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(languageTag, { maximumFractionDigits: 2, ...options }).format(value);
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat(languageTag, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

function makeDownloadLink(container, blob, filename, label, locale = languageTag) {
  const url = URL.createObjectURL(blob);
  objectUrls.add(url);
  const link = document.createElement('a');
  link.className = 'button button--ghost file-download';
  link.href = url;
  link.download = filename;
  link.textContent = `${t(label)} · ${logic.formatFileSize(blob.size, locale)}`;
  container.append(link);
  return link;
}

function clearDownloadLinks(container) {
  for (const link of container.querySelectorAll('a.file-download')) {
    if (objectUrls.has(link.href)) {
      URL.revokeObjectURL(link.href);
      objectUrls.delete(link.href);
    }
  }
  container.replaceChildren();
}

function copyToClipboard(value, root) {
  if (!value) return setStatus(root, 'There is nothing to copy yet.', 'error');
  navigator.clipboard.writeText(value).then(
    () => setStatus(root, 'Copied to your clipboard.', 'success'),
    () => setStatus(root, 'Copy was blocked. Select the result and copy it manually.', 'error'),
  );
}

function setupXml(root) {
  const input = $('#xml-input', root);
  const output = $('#xml-output', root);
  const serializer = new XMLSerializer();

  const parse = () => {
    const value = input.value.trim();
    if (!value) throw new TypeError('Paste XML before you continue.');
    if (value.length > 2 * 1024 * 1024) throw new RangeError('XML input exceeds the 2 MB limit. Process a smaller document.');
    if (/<!DOCTYPE/iu.test(value)) throw new TypeError('For safety, this tool does not accept a DOCTYPE.');
    const documentXml = new DOMParser().parseFromString(value, 'application/xml');
    const rootNode = documentXml.documentElement;
    if (!rootNode || logic.hasXmlParseError(documentXml)) throw new SyntaxError('XML is not well formed. Check the tags and quotation marks.');
    return documentXml;
  };

  const prettyNode = (node, depth = 0) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return serializer.serializeToString(node);
    const children = [...node.childNodes];
    if (!children.length) return serializer.serializeToString(node);
    const hasMixedText = children.some((child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim());
    if (hasMixedText) return serializer.serializeToString(node);
    const open = serializer.serializeToString(node.cloneNode(false)).replace(/\s*\/>$/u, '>');
    const indent = '  '.repeat(depth);
    return `${open}\n${children.filter((child) => child.nodeType !== Node.TEXT_NODE || child.textContent.trim()).map((child) => `${'  '.repeat(depth + 1)}${prettyNode(child, depth + 1)}`).join('\n')}\n${indent}</${node.nodeName}>`;
  };

  const formatDocument = (documentXml) => {
    const nodes = [...documentXml.childNodes];
    const rootIndex = nodes.findIndex((node) => node === documentXml.documentElement);
    const declaration = nodes.find((node) => node.nodeType === Node.PROCESSING_INSTRUCTION_NODE && node.target.toLowerCase() === 'xml');
    const before = nodes.slice(0, rootIndex).filter((node) => node !== declaration && (node.nodeType !== Node.TEXT_NODE || node.textContent.trim()));
    const after = nodes.slice(rootIndex + 1).filter((node) => node.nodeType !== Node.TEXT_NODE || node.textContent.trim());
    return [
      declaration ? serializer.serializeToString(declaration) : '<?xml version="1.0" encoding="UTF-8"?>',
      ...before.map((node) => serializer.serializeToString(node)),
      prettyNode(documentXml.documentElement),
      ...after.map((node) => serializer.serializeToString(node)),
    ].join('\n');
  };

  input.addEventListener('input', () => {
    output.value = '';
    setStatus(root, 'XML is checked in your browser. No upload.');
  });

  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'format-xml' || action === 'validate-xml') {
      try {
        const documentXml = parse();
        if (action === 'format-xml') output.value = formatDocument(documentXml);
        setStatus(root, 'XML is well formed.', 'success');
      } catch (error) { setStatus(root, error.message, 'error'); }
    }
    if (action === 'copy-xml') copyToClipboard(output.value, root);
    if (action === 'clear') { input.value = ''; output.value = ''; setStatus(root, 'XML is checked in your browser. No upload.'); input.focus(); }
  });
}

function setupContrast(root) {
  const foreground = $('#contrast-foreground', root);
  const background = $('#contrast-background', root);
  const update = () => {
    const result = logic.calculateContrastRatio(foreground.value, background.value);
    $('#contrast-foreground-hex', root).textContent = foreground.value.toUpperCase();
    $('#contrast-background-hex', root).textContent = background.value.toUpperCase();
    $('#contrast-preview', root).style.color = foreground.value;
    $('#contrast-preview', root).style.backgroundColor = background.value;
    $('#contrast-ratio', root).textContent = `${formatNumber(result.ratio, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}:1`;
    for (const [id, pass] of [['contrast-aa-normal', result.aaNormal], ['contrast-aa-large', result.aaLarge], ['contrast-aaa-normal', result.aaaNormal]]) {
      const output = $(`#${id}`, root);
      output.textContent = t(pass ? 'Pass' : 'Does not pass');
      output.className = pass ? 'contrast-pass' : 'contrast-fail';
    }
    setStatus(root, result.aaNormal ? 'This color pair passes WCAG AA for normal text.' : 'This color pair does not pass WCAG AA for normal text.', result.aaNormal ? 'success' : 'error');
  };
  foreground.addEventListener('input', update);
  background.addEventListener('input', update);
  update();
}

function setupTip(root) {
  const bill = $('#tip-bill', root);
  const currency = $('#tip-currency', root);
  const percent = $('#tip-percent', root);
  const people = $('#tip-people', root);
  const localeCurrency = { es: 'EUR', fr: 'EUR', de: 'EUR', 'pt-BR': 'BRL', ja: 'JPY', ko: 'KRW', id: 'IDR', hi: 'INR', ar: 'SAR', zh: 'CNY', bn: 'BDT', ru: 'RUB', ur: 'PKR', tr: 'TRY', vi: 'VND' };
  if (localeCurrency[language] && [...currency.options].some((option) => option.value === localeCurrency[language])) currency.value = localeCurrency[language];
  const update = () => {
    $('#tip-percent-value', root).textContent = `${percent.value}%`;
    try {
      const result = logic.calculateTipSplit(parseNumber(bill.value), Number(percent.value), Number(people.value));
      $('#tip-total', root).textContent = formatMoney(result.tip, currency.value);
      $('#tip-grand-total', root).textContent = formatMoney(result.total, currency.value);
      $('#tip-per-person', root).textContent = formatMoney(result.tipPerPerson, currency.value);
      $('#tip-total-per-person', root).textContent = formatMoney(result.totalPerPerson, currency.value);
      setStatus(root, 'Tip calculated. Change any value to update the amounts.', 'success');
    } catch (error) { setStatus(root, error.message, 'error'); }
  };
  for (const input of [bill, currency, percent, people]) input.addEventListener('input', update);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-tip') update();
    if (action === 'clear') { bill.value = '48'; percent.value = '15'; people.value = '2'; update(); bill.focus(); }
  });
  update();
}

function setupGpa(root) {
  const rows = $('#gpa-courses', root);
  const grades = Object.keys(logic.gradePoints);
  const createRow = () => {
    const row = document.createElement('div');
    row.className = 'gpa-course';
    row.dataset.courseRow = '';
    const nameLabel = document.createElement('label');
    const name = document.createElement('input');
    name.className = 'tool-input'; name.type = 'text'; name.name = 'course-name[]'; name.maxLength = 60; name.placeholder = t('Course name (optional)'); name.dataset.courseName = '';
    const nameHelp = document.createElement('span'); nameHelp.className = 'sr-only'; nameHelp.textContent = t('Course name'); nameLabel.append(nameHelp, name);
    const gradeLabel = document.createElement('label');
    const gradeHelp = document.createElement('span'); gradeHelp.className = 'sr-only'; gradeHelp.textContent = t('Letter grade');
    const grade = document.createElement('select'); grade.className = 'tool-input'; grade.name = 'course-grade[]'; grade.dataset.courseGrade = '';
    for (const item of grades) { const option = document.createElement('option'); option.value = item; option.textContent = item; grade.append(option); }
    gradeLabel.append(gradeHelp, grade);
    const creditLabel = document.createElement('label');
    const creditHelp = document.createElement('span'); creditHelp.className = 'sr-only'; creditHelp.textContent = t('Credits');
    const credits = document.createElement('input'); credits.className = 'tool-input'; credits.type = 'text'; credits.name = 'course-credits[]'; credits.inputMode = 'decimal'; credits.maxLength = 8; credits.value = '3'; credits.dataset.courseCredits = '';
    creditLabel.append(creditHelp, credits);
    const remove = document.createElement('button'); remove.className = 'button button--ghost gpa-remove'; remove.type = 'button'; remove.dataset.action = 'remove-course'; remove.setAttribute('aria-label', t('Remove course')); remove.textContent = '×';
    row.append(nameLabel, gradeLabel, creditLabel, remove);
    return row;
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'add-course') {
      if (rows.children.length >= 20) return setStatus(root, 'You can add up to 20 courses.', 'error');
      const row = createRow(); rows.append(row); $('[data-course-name]', row).focus();
    }
    if (action === 'remove-course') {
      if (rows.children.length <= 1) return setStatus(root, 'Keep at least one course in the list.', 'error');
      event.target.closest('[data-course-row]').remove();
    }
    if (action === 'calculate-gpa') {
      try {
        const courses = $$('[data-course-row]', rows).map((row) => ({ grade: $('[data-course-grade]', row).value, credits: parseNumber($('[data-course-credits]', row).value) }));
        const result = logic.calculateGpa(courses);
        $('#gpa-result', root).textContent = formatNumber(result.gpa, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        $('#gpa-credits', root).textContent = `${formatNumber(result.totalCredits)} ${t('credits')} · ${formatNumber(result.courses)} ${t('courses')}`;
        setStatus(root, 'GPA calculated on the common 4.0 scale.', 'success');
      } catch (error) { setStatus(root, error.message, 'error'); }
    }
    if (action === 'clear') {
      rows.replaceChildren(createRow());
      $('#gpa-result', root).textContent = '—';
      $('#gpa-credits', root).textContent = t('Add your courses and credits.');
      setStatus(root, 'A+ and A both count as 4.0 on this scale.');
    }
  });
}

function setupChecksum(root) {
  const fileInput = $('#checksum-file', root);
  const output = $('#checksum-output', root);
  const compare = () => {
    const expected = $('#checksum-expected', root).value.trim().toLowerCase().replace(/^sha-?256\s*[:=]\s*/u, '');
    const actual = output.value.toLowerCase();
    const result = $('#checksum-match', root);
    if (!expected || !actual) { result.textContent = ''; result.className = 'checksum-match'; return; }
    const matches = /^[a-f\d]{64}$/u.test(expected) && expected === actual;
    result.textContent = t(matches ? 'The checksums match.' : 'The checksums do not match. Check the value.');
    result.className = `checksum-match ${matches ? 'is-match' : 'is-mismatch'}`;
  };
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    output.value = ''; $('#checksum-match', root).textContent = '';
    $('#checksum-file-meta', root).textContent = file ? `${file.name} · ${logic.formatFileSize(file.size, languageTag)}` : t('Your file is processed on this device and is not uploaded.');
  });
  $('#checksum-expected', root).addEventListener('input', compare);
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'hash-file') {
      const file = fileInput.files[0];
      if (!file) return setStatus(root, 'Choose a file before creating a checksum.', 'error');
      if (file.size > 25 * 1024 * 1024) return setStatus(root, 'This file is larger than the 25 MB limit.', 'error');
      if (!globalThis.crypto?.subtle) return setStatus(root, 'Secure file hashing is not available in this browser.', 'error');
      setStatus(root, 'Calculating the checksum on your device…');
      try {
        const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
        output.value = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
        compare();
        setStatus(root, 'SHA-256 checksum created. The file was not uploaded.', 'success');
      } catch { setStatus(root, 'The file could not be read. Choose it again and retry.', 'error'); }
    }
    if (action === 'copy-checksum') copyToClipboard(output.value, root);
    if (action === 'clear') { fileInput.value = ''; output.value = ''; $('#checksum-expected', root).value = ''; $('#checksum-match', root).textContent = ''; $('#checksum-file-meta', root).textContent = t('Your file is processed on this device and is not uploaded.'); setStatus(root, 'Choose a file to begin.'); }
  });
}

const imageExtensions = new Set(['jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp', 'png', 'apng', 'webp', 'heic', 'heif', 'avif', 'bmp', 'gif', 'svg', 'ico', 'cur', 'tif', 'tiff']);
const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/apng', 'image/webp', 'image/heic', 'image/heif', 'image/avif', 'image/bmp', 'image/x-ms-bmp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/tiff']);

function isSupportedImage(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  return imageMimeTypes.has(file.type.toLowerCase()) || imageExtensions.has(extension);
}

function isHeic(file) {
  return /\.(?:heic|heif)$/iu.test(file.name) || ['image/heic', 'image/heif'].includes(file.type.toLowerCase());
}

function isTiff(file) {
  return /\.(?:tif|tiff)$/iu.test(file.name) || file.type.toLowerCase() === 'image/tiff';
}

async function decodeImageFile(file, maxPixels = 40_000_000) {
  if (isTiff(file)) {
    const { decodeTiffFile } = await import(versioned('/assets/tiff-decoder.mjs'));
    return decodeTiffFile(file, maxPixels);
  }
  let image = file;
  if (isHeic(file)) {
    const converter = await loadVendorScript('heic2any.min.js', 'heic2any');
    const result = await converter({ blob: file, toType: 'image/png' });
    image = Array.isArray(result) ? result[0] : result;
  }
  try { return await createImageBitmap(image, { imageOrientation: 'from-image' }); }
  catch {
    try { return await createImageBitmap(image); }
    catch {
      const url = URL.createObjectURL(image);
      try {
        const element = new Image();
        element.src = url;
        if (typeof element.decode === 'function') await element.decode();
        else await new Promise((resolve, reject) => { element.onload = resolve; element.onerror = reject; });
        try { return await createImageBitmap(element); }
        catch { return element; }
      } finally { URL.revokeObjectURL(url); }
    }
  }
}

function setupImage(root) {
  const fileInput = $('#image-file', root);
  const width = $('#image-width', root);
  const height = $('#image-height', root);
  const quality = $('#image-quality', root);
  const format = $('#image-format', root);
  let aspectRatio = 1.5;
  let keepAspect = true;
  let sourceFile = null;
  let previewUrl = null;
  let imageOperation = 0;
  const revokePreview = () => { if (previewUrl) { URL.revokeObjectURL(previewUrl); objectUrls.delete(previewUrl); previewUrl = null; } };
  fileInput.addEventListener('change', async () => {
    const operation = ++imageOperation;
    sourceFile = fileInput.files[0] ?? null;
    $('#image-preview', root).hidden = true;
    revokePreview();
    if (!sourceFile) return;
    if (!isSupportedImage(sourceFile)) { sourceFile = null; return setStatus(root, 'Choose a supported image format.', 'error'); }
    let bitmap;
    try {
      const file = sourceFile;
      bitmap = await decodeImageFile(file);
      if (operation !== imageOperation) return;
      aspectRatio = bitmap.width / bitmap.height;
      width.value = String(bitmap.width); height.value = String(bitmap.height);
      $('#image-file-meta', root).textContent = `${file.name} · ${bitmap.width} × ${bitmap.height} px · ${logic.formatFileSize(file.size, languageTag)}`;
      setStatus(root, 'Image ready. Choose its size and format.');
    } catch { if (operation === imageOperation) { sourceFile = null; setStatus(root, 'This image could not be decoded by your browser. Try another file or browser.', 'error'); } }
    finally { bitmap?.close?.(); }
  });
  width.addEventListener('input', () => { if (keepAspect && Number(width.value) > 0) height.value = String(Math.max(1, Math.round(Number(width.value) / aspectRatio))); });
  height.addEventListener('input', () => { if (keepAspect && Number(height.value) > 0) width.value = String(Math.max(1, Math.round(Number(height.value) * aspectRatio))); });
  quality.addEventListener('input', () => { $('#image-quality-value', root).textContent = `${quality.value}%`; });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'toggle-aspect') {
      keepAspect = !keepAspect;
      event.target.setAttribute('aria-pressed', String(keepAspect));
      event.target.classList.toggle('is-active', keepAspect);
      setStatus(root, keepAspect ? 'Image proportions are locked.' : 'Image proportions can change independently.');
    }
    if (action === 'resize-image') {
      if (!sourceFile) return setStatus(root, 'Choose an image before resizing.', 'error');
      const original = sourceFile;
      const operation = ++imageOperation;
      const outWidth = Number(width.value); const outHeight = Number(height.value);
      if (!Number.isInteger(outWidth) || !Number.isInteger(outHeight) || outWidth < 1 || outHeight < 1 || outWidth > 8000 || outHeight > 8000 || outWidth * outHeight > 40_000_000) return setStatus(root, 'Use dimensions from 1 to 8,000 px and no more than 40 megapixels in total.', 'error');
      setStatus(root, 'Resizing the image on your device…');
      let bitmap;
      try {
        bitmap = await decodeImageFile(original);
        if (operation !== imageOperation) return;
        const canvas = document.createElement('canvas'); canvas.width = outWidth; canvas.height = outHeight;
        const context = canvas.getContext('2d', { alpha: format.value === 'image/png' });
        if (!context) throw new Error('Canvas is unavailable.');
        if (format.value !== 'image/png') { context.fillStyle = '#fff'; context.fillRect(0, 0, outWidth, outHeight); }
        context.drawImage(bitmap, 0, 0, outWidth, outHeight);
        const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('Image conversion failed.')), format.value, Number(quality.value) / 100));
        if (operation !== imageOperation) return;
        if (blob.type !== format.value) throw new Error('The browser does not support the selected output format.');
        revokePreview();
        previewUrl = URL.createObjectURL(blob); objectUrls.add(previewUrl);
        $('#image-preview-img', root).src = previewUrl;
        $('#image-output-meta', root).textContent = `${outWidth} × ${outHeight} px · ${logic.formatFileSize(blob.size, languageTag)} (${formatNumber(Math.abs(1 - blob.size / original.size) * 100)}% ${t(blob.size <= original.size ? 'smaller' : 'larger')})`;
        const extension = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' }[blob.type] ?? 'png';
        const download = $('#image-download', root); download.href = previewUrl; download.download = `${original.name.replace(/\.[^.]+$/u, '')}-resized.${extension}`;
        $('#image-preview', root).hidden = false;
        setStatus(root, 'Your new image is ready to download. The original is unchanged.', 'success');
      } catch (error) { if (operation === imageOperation) setStatus(root, error.message === 'Canvas is unavailable.' ? error.message : error.message.includes('output format') ? 'The browser does not support the selected output format.' : 'The image could not be resized. Try fewer pixels or another format.', 'error'); }
      finally { bitmap?.close?.(); }
    }
    if (action === 'clear') {
      imageOperation += 1;
      sourceFile = null; fileInput.value = ''; width.value = '1200'; height.value = '800'; quality.value = '80'; $('#image-quality-value', root).textContent = '80%'; $('#image-file-meta', root).textContent = t('JPG, PNG, WebP, HEIC/HEIF, AVIF, BMP, GIF/APNG, SVG and ICO. Animated files export only their first frame. Output up to 40 megapixels.'); $('#image-preview', root).hidden = true; revokePreview(); setStatus(root, 'The image is processed locally in your browser.');
    }
  });
}

let pdfLibPromise;
function loadPdfLib() {
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  pdfLibPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = versioned('/assets/vendor/pdf-lib.min.js'); script.onload = () => resolve(window.PDFLib); script.onerror = () => reject(new Error('PDF tools could not load.'));
    document.head.append(script);
  });
  return pdfLibPromise;
}

let pdfJsPromise;
function loadPdfJs() {
  pdfJsPromise ??= import(versioned('/assets/vendor/pdf.min.mjs')).then((pdfjs) => {
    pdfjs.GlobalWorkerOptions.workerSrc = versioned('/assets/vendor/pdf.worker.min.mjs');
    return pdfjs;
  });
  return pdfJsPromise;
}

async function validatePdf(file) {
  if (!file) throw new TypeError('Choose a PDF file.');
  const header = new TextDecoder('latin1').decode(await file.slice(0, 1024).arrayBuffer());
  if (!header.includes('%PDF-')) throw new TypeError('One selected file is not a readable PDF.');
  return new Uint8Array(await file.arrayBuffer());
}

function optimizePdfInWorker(bytes, { onWorker, signal }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(versioned('/assets/vendor/pdf-compressor-worker.mjs'), { type: 'module' });
    onWorker(worker);
    const cleanup = () => { signal?.removeEventListener('abort', abort); worker.terminate(); onWorker(null); };
    const abort = () => { cleanup(); reject(new Error('PDF compression canceled. No new file was saved.')); };
    signal?.addEventListener('abort', abort, { once: true });
    worker.addEventListener('message', ({ data }) => {
      cleanup();
      if (data.type === 'result') resolve(new Uint8Array(data.bytes));
      else reject(new Error('This PDF could not be optimized. It may be protected, damaged or use a feature this browser tool does not support.'));
    }, { once: true });
    worker.addEventListener('error', () => {
      cleanup();
      reject(new Error('The PDF optimizer could not start. Refresh the page and try again.'));
    }, { once: true });
    worker.postMessage({ bytes: bytes.buffer }, [bytes.buffer]);
  });
}

function setupPdf(root) {
  const mode = $('#pdf-mode', root);
  const input = $('#pdf-files', root);
  const output = $('#pdf-downloads', root);
  const runButton = $('[data-action="run-pdf"]', root);
  const cancelButton = $('[data-action="cancel-pdf"]', root);
  let activeOperation = null;
  const setBusy = (busy, canCancel = false) => {
    runButton.disabled = busy;
    cancelButton.disabled = !busy || !canCancel;
    $('[data-action="clear"]', root).disabled = busy;
    for (const control of [mode, input, $('#pdf-ranges', root), $('#pdf-compress-confirm', root), $('#pdf-image-quality', root)]) {
      control.disabled = busy;
    }
  };
  const fileHint = () => mode.value === 'merge'
    ? 'PDFs are processed on this device and are never uploaded. There is no fixed file-size cap; available memory and browser support are the practical limits. Choose up to 10 PDFs to merge.'
    : mode.value === 'optimize' || mode.value === 'smallest'
      ? 'PDFs are processed on this device, never uploaded. Compression has no fixed file-size cap; available memory and browser support are the practical limits.'
      : 'PDFs are processed on this device and are never uploaded. There is no fixed file-size cap; available memory and browser support are the practical limits.';
  const updateFileMeta = () => {
    const files = [...input.files];
    $('#pdf-file-meta', root).textContent = files.length
      ? files.map((file) => `${file.name} (${logic.formatFileSize(file.size, languageTag)})`).join(' · ')
      : t(fileHint());
  };
  const updateMode = () => {
    const isMerge = mode.value === 'merge';
    const isSplit = mode.value === 'split';
    const isOptimize = mode.value === 'optimize';
    const isSmallest = mode.value === 'smallest';
    const isCompress = isOptimize || isSmallest;
    input.multiple = isMerge;
    $('#pdf-range-wrap', root).hidden = !isSplit;
    $('#pdf-optimize-note', root).hidden = !isOptimize;
    $('#pdf-compress-note', root).hidden = !isSmallest;
    $('#pdf-image-options', root).hidden = !isSmallest;
    $('#pdf-compress-confirm', root).checked = false;
    updateFileMeta();
    cancelButton.hidden = !isCompress;
    clearDownloadLinks(output);
    setStatus(root, 'PDF processing runs in this browser. No upload.');
  };
  mode.addEventListener('change', updateMode);
  input.addEventListener('change', () => {
    updateFileMeta();
    clearDownloadLinks(output);
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-pdf') {
      if (!activeOperation) return;
      activeOperation.cancelled = true;
      activeOperation.abortController?.abort();
      activeOperation.worker?.terminate();
      activeOperation.renderTask?.cancel();
      void activeOperation.loadingTask?.destroy().catch(() => {});
      setStatus(root, 'PDF compression canceled. No new file was saved.');
      return;
    }
    if (action === 'clear') {
      if (activeOperation) {
        activeOperation.cancelled = true;
        activeOperation.abortController?.abort();
        activeOperation.worker?.terminate();
        activeOperation.renderTask?.cancel();
        void activeOperation.loadingTask?.destroy().catch(() => {});
      }
      input.value = ''; $('#pdf-ranges', root).value = ''; $('#pdf-compress-confirm', root).checked = false; clearDownloadLinks(output); setBusy(false); updateMode();
    }
    if (action !== 'run-pdf') return;
    if (activeOperation) return;
    const files = [...input.files];
    clearDownloadLinks(output);
    const operation = { cancelled: false, worker: null, renderTask: null, loadingTask: null };
    activeOperation = operation;
    setBusy(true, mode.value === 'optimize' || mode.value === 'smallest');
    try {
      if (mode.value === 'merge') {
        if (files.length < 2 || files.length > 10) throw new RangeError('Choose between 2 and 10 PDF files to merge.');
        setStatus(root, 'Merging PDF files on your device…');
        const { PDFDocument } = await loadPdfLib();
        const merged = await PDFDocument.create();
        let pages = 0;
        for (const file of files) {
          const source = await PDFDocument.load(await validatePdf(file), { updateMetadata: false });
          pages += source.getPageCount();
          if (pages > 200) throw new RangeError('Choose PDFs with 200 pages or fewer in total.');
          const copied = await merged.copyPages(source, source.getPageIndices());
          copied.forEach((page) => merged.addPage(page));
        }
        const bytes = await merged.save({ useObjectStreams: true, addDefaultPage: false });
        makeDownloadLink(output, new Blob([bytes], { type: 'application/pdf' }), 'merged.pdf', 'Download PDF');
        setStatus(root, 'PDFs merged. Download the new file below; your originals are unchanged.', 'success');
      } else if (mode.value === 'split') {
        if (files.length !== 1) throw new RangeError('Choose exactly one PDF to extract pages from.');
        setStatus(root, 'Reading the PDF page count…');
        const { PDFDocument } = await loadPdfLib();
        const source = await PDFDocument.load(await validatePdf(files[0]), { updateMetadata: false });
        const groups = logic.parsePageRanges($('#pdf-ranges', root).value, source.getPageCount(), 200, 10);
        for (const group of groups) {
          const extracted = await PDFDocument.create();
          const pages = await extracted.copyPages(source, group);
          pages.forEach((page) => extracted.addPage(page));
          const bytes = await extracted.save({ useObjectStreams: true, addDefaultPage: false });
          makeDownloadLink(output, new Blob([bytes], { type: 'application/pdf' }), `pages-${group[0] + 1}-${group.at(-1) + 1}.pdf`, 'Download PDF');
        }
        setStatus(root, `${groups.length} PDF file${groups.length === 1 ? '' : 's'} ready. Your original is unchanged.`, 'success');
      } else if (mode.value === 'optimize') {
        if (files.length !== 1) throw new RangeError('Choose exactly one PDF to compress.');
        setBusy(true, true);
        setStatus(root, 'Optimizing PDF structure on your device…');
        const bytes = await validatePdf(files[0]);
        if (operation.cancelled) return;
        const abortController = new AbortController();
        operation.abortController = abortController;
        const optimized = await optimizePdfInWorker(bytes, { onWorker: (worker) => { operation.worker = worker; }, signal: abortController.signal });
        if (operation.cancelled) return;
        const difference = files[0].size - optimized.byteLength;
        if (difference <= 0) {
          setStatus(root, 'This method did not make the PDF smaller. The original is unchanged. Try the other mode.', 'error');
        } else {
          makeDownloadLink(output, new Blob([optimized], { type: 'application/pdf' }), `${files[0].name.replace(/\.pdf$/iu, '')}-optimized.pdf`, 'Download PDF');
          setStatus(root, t('PDF optimization made the file {size} smaller. Compare it before using it. Your original is unchanged.').replace('{size}', logic.formatFileSize(difference, languageTag)), 'success');
        }
      } else {
        if (files.length !== 1) throw new RangeError('Choose exactly one PDF to compress.');
        if (!$('#pdf-compress-confirm', root).checked) throw new TypeError('Confirm the image-based compression warning before continuing.');
        const [pdfjs, { PDFDocument }] = await Promise.all([loadPdfJs(), loadPdfLib()]);
        if (operation.cancelled) return;
        operation.loadingTask = pdfjs.getDocument({ data: await validatePdf(files[0]), cMapUrl: `/assets/vendor/cmaps${vendorDirectoryVersion}/`, cMapPacked: true, standardFontDataUrl: `/assets/vendor/standard_fonts${vendorDirectoryVersion}/` });
        let bytes;
        try {
          const pdf = await operation.loadingTask.promise;
          const compressed = await PDFDocument.create();
          const quality = $('#pdf-image-quality', root).value === 'smaller' ? { dpi: 100, jpeg: 0.62 } : { dpi: 150, jpeg: 0.78 };
          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            if (operation.cancelled) return;
            setStatus(root, t('Rendering page {current} of {total} on your device…').replace('{current}', formatNumber(pageNumber)).replace('{total}', formatNumber(pdf.numPages)));
            const page = await pdf.getPage(pageNumber);
            let canvas;
            try {
              const unitViewport = page.getViewport({ scale: 1 });
              const scale = Math.min(quality.dpi / 72, Math.sqrt(4_000_000 / (unitViewport.width * unitViewport.height)));
              const viewport = page.getViewport({ scale });
              canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
              const context = canvas.getContext('2d', { alpha: false });
              if (!context) throw new Error('Canvas is unavailable.');
              operation.renderTask = page.render({ canvasContext: context, viewport, background: '#ffffff' });
              await operation.renderTask.promise;
              operation.renderTask = null;
              const imageBlob = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Page image could not be created.')), 'image/jpeg', quality.jpeg));
              const image = await compressed.embedJpg(await imageBlob.arrayBuffer());
              const outputPage = compressed.addPage([unitViewport.width, unitViewport.height]);
              outputPage.drawImage(image, { x: 0, y: 0, width: unitViewport.width, height: unitViewport.height });
            } finally {
              if (canvas) { canvas.width = 1; canvas.height = 1; }
              page.cleanup();
            }
          }
          if (operation.cancelled) return;
          setStatus(root, 'Creating the compressed PDF on your device…');
          bytes = await compressed.save({ useObjectStreams: true, addDefaultPage: false });
        } finally { await operation.loadingTask.destroy().catch(() => {}); }
        if (operation.cancelled) return;
        const difference = files[0].size - bytes.byteLength;
        if (difference <= 0) {
          setStatus(root, 'This method did not make the PDF smaller. The original is unchanged. Try the other mode.', 'error');
        } else {
          makeDownloadLink(output, new Blob([bytes], { type: 'application/pdf' }), `${files[0].name.replace(/\.pdf$/iu, '')}-image-compressed.pdf`, 'Download PDF');
          setStatus(root, t('Image compression made the file {size} smaller. Inspect readability; the original is unchanged.').replace('{size}', logic.formatFileSize(difference, languageTag)), 'success');
        }
      }
    } catch (error) {
      clearDownloadLinks(output);
      if (!operation.cancelled) setStatus(root, error.message || 'This PDF could not be processed. It may be damaged, encrypted or unsupported.', 'error');
    } finally {
      if (activeOperation === operation) activeOperation = null;
      setBusy(false);
    }
  });
  updateMode();
}

let videoCompressorPromise;
function loadVideoCompressor() {
  videoCompressorPromise ??= import(versioned('/assets/vendor/video-compression.mjs'));
  return videoCompressorPromise;
}

function setupVideoCompressor(root) {
  const input = $('#video-file', root);
  const format = $('#video-format', root);
  const output = $('#video-downloads', root);
  const progress = $('#video-progress', root);
  const runButton = $('[data-action="compress-video"]', root);
  const cancelButton = $('[data-action="cancel-video"]', root);
  let activeController = null;
  let activeFileWritable = null;
  const setBusy = (busy) => {
    runButton.disabled = busy;
    cancelButton.disabled = !busy;
    $('[data-action="clear"]', root).disabled = busy;
    for (const control of [input, format, $('#video-quality', root), $('#video-height', root)]) control.disabled = busy;
  };
  const stop = () => {
    activeController?.abort();
    void activeFileWritable?.abort().catch(() => {});
  };
  $('#video-memory-note', root).hidden = typeof window.showSaveFilePicker === 'function';
  input.addEventListener('change', () => {
    clearDownloadLinks(output);
    const file = input.files[0];
    $('#video-file-meta', root).textContent = file
      ? `${file.name} · ${logic.formatFileSize(file.size, languageTag)}`
      : t('The video is processed on your device and is never uploaded. There is no fixed file-size cap; available memory, storage and browser codecs set practical limits.');
    progress.hidden = true;
    progress.value = 0;
    if (file) setStatus(root, 'Video selected. Choose quality and resolution, then compress.');
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-video') {
      stop();
      cancelButton.disabled = true;
      setStatus(root, 'Video compression canceled. No compressed copy was kept.');
      return;
    }
    if (action === 'clear') {
      stop(); input.value = ''; clearDownloadLinks(output); progress.value = 0; progress.hidden = true;
      $('#video-file-meta', root).textContent = t('The video is processed on your device and is never uploaded. There is no fixed file-size cap; available memory, storage and browser codecs set practical limits.');
      setStatus(root, 'No upload. Keep this tab open while your device works.');
      return;
    }
    if (action !== 'compress-video' || activeController) return;
    const file = input.files[0];
    if (!file) return setStatus(root, 'Choose a video before compressing.', 'error');
    const extension = format.value === 'webm' ? 'webm' : 'mp4';
    const baseName = file.name.replace(/\.[^.]+$/u, '') || 'video';
    const controller = new AbortController();
    activeController = controller;
    setBusy(true);
    clearDownloadLinks(output);
    progress.hidden = false;
    progress.value = 0;
    let fileWritable = null;
    let streamedBytes = 0;
    try {
      let bridge = null;
      if (typeof window.showSaveFilePicker === 'function') {
        setStatus(root, 'Choose where to save the new video…');
        const handle = await window.showSaveFilePicker({
          suggestedName: `${baseName}-compressed.${extension}`,
          types: [{ description: `${extension.toUpperCase()} video`, accept: { [extension === 'webm' ? 'video/webm' : 'video/mp4']: [`.${extension}`] } }],
        });
        if (controller.signal.aborted) return;
        fileWritable = await handle.createWritable();
        activeFileWritable = fileWritable;
        bridge = new WritableStream({
          write: (chunk) => {
            streamedBytes = Math.max(streamedBytes, chunk.position + chunk.data.byteLength);
            return fileWritable.write({ type: 'write', position: chunk.position, data: chunk.data });
          },
          // Keep the browser's temporary file uncommitted until the whole encode succeeds and we know it is smaller.
          close: () => {},
          abort: (reason) => fileWritable.abort(reason),
        });
      }
      setStatus(root, 'Encoding video on your device. Keep this tab open…');
      const { compressVideo } = await loadVideoCompressor();
      const result = await compressVideo({
        file,
        format: extension,
        quality: $('#video-quality', root).value,
        maxHeight: Number($('#video-height', root).value) || null,
        writable: bridge,
        signal: controller.signal,
        onProgress: (value) => {
          progress.value = value;
          setStatus(root, t('Compressing video: {percent}%').replace('{percent}', String(value)));
        },
      });
      if (controller.signal.aborted) return;
      if (result.streamed) {
        const difference = file.size - streamedBytes;
        if (difference <= 0) {
          await fileWritable.abort(); fileWritable = null; activeFileWritable = null;
          progress.hidden = true;
          return setStatus(root, 'This video could not be made smaller. No copy was saved; your original is unchanged. Try a lower quality or resolution.', 'error');
        }
        await fileWritable.close(); fileWritable = null; activeFileWritable = null;
        setStatus(root, t('Video saved as a new file, {size} smaller. Your original is unchanged.').replace('{size}', logic.formatFileSize(difference, languageTag)), 'success');
      } else if (result.blob && result.blob.size < file.size) {
        makeDownloadLink(output, result.blob, `${baseName}-compressed.${extension}`, 'Download video');
        setStatus(root, t('Compressed video is {size} smaller. Review it before sharing; your original is unchanged.').replace('{size}', logic.formatFileSize(file.size - result.blob.size, languageTag)), 'success');
      } else {
        setStatus(root, 'This video could not be made smaller. No copy was saved; your original is unchanged. Try a lower quality or resolution.', 'error');
      }
    } catch (error) {
      if (fileWritable) await fileWritable.abort().catch(() => {});
      fileWritable = null; activeFileWritable = null;
      if (controller.signal.aborted) setStatus(root, 'Video compression canceled. No compressed copy was kept.');
      else if (error?.name === 'AbortError') setStatus(root, 'Save was canceled. Your original video is unchanged.');
      else {
        const message = error?.message?.startsWith('This output would omit')
          ? 'This video has an audio, subtitle or data track that the selected format cannot keep. No output was saved.'
          : error?.message === 'No video track was found in this file.'
            ? error.message
            : error?.message === 'This browser cannot encode the selected video in that format. Try another format or browser.'
              ? error.message
              : 'This browser could not process this video. Try MP4 or WebM, another output format, or a smaller resolution.';
        setStatus(root, message, 'error');
      }
    } finally {
      if (fileWritable) await fileWritable.abort().catch(() => {});
      activeFileWritable = null;
      if (activeController === controller) activeController = null;
      progress.hidden = true;
      setBusy(false);
    }
  });
}

function setupCsv(root) {
  const input = $('#csv-file', root);
  const search = $('#csv-search', root);
  const head = $('#csv-head', root);
  const body = $('#csv-body', root);
  const tableWrap = $('#csv-table-wrap', root);
  let table = { headers: [], rows: [], delimiter: ',' };
  let filtered = [];
  let page = 0;
  const pageSize = 50;
  const render = () => {
    const term = search.value.trim().toLocaleLowerCase(languageTag);
    filtered = table.rows.filter((row) => !term || row.some((cell) => cell.toLocaleLowerCase(languageTag).includes(term)));
    const maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
    page = Math.max(0, Math.min(page, maxPage));
    const headerRow = document.createElement('tr');
    for (const label of table.headers) { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = label; headerRow.append(cell); }
    head.replaceChildren(headerRow);
    const rows = filtered.slice(page * pageSize, (page + 1) * pageSize).map((cells) => {
      const tr = document.createElement('tr');
      for (const value of cells) { const td = document.createElement('td'); td.textContent = value; tr.append(td); }
      return tr;
    });
    body.replaceChildren(...rows);
    tableWrap.hidden = !table.headers.length;
    $('#csv-summary', root).textContent = table.headers.length ? `${formatNumber(filtered.length)} ${t('rows shown')} · ${formatNumber(table.headers.length)} ${t('columns')}` : '';
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    $('#csv-page-label', root).textContent = table.headers.length ? `${formatNumber(page + 1)} / ${formatNumber(pages)}` : '—';
    $('[data-action="csv-prev"]', root).disabled = page === 0;
    $('[data-action="csv-next"]', root).disabled = page >= pages - 1;
  };
  input.addEventListener('change', async () => {
    const file = input.files[0];
    head.replaceChildren(); body.replaceChildren(); table = { headers: [], rows: [], delimiter: ',' }; search.value = ''; search.disabled = true; tableWrap.hidden = true;
    if (!file) return;
    $('#csv-file-meta', root).textContent = `${file.name} · ${logic.formatFileSize(file.size, languageTag)}`;
    if (file.size > 5 * 1024 * 1024) return setStatus(root, 'This CSV is larger than the 5 MB limit.', 'error');
    setStatus(root, 'Reading the CSV on your device…');
    try {
      const text = await file.text();
      if (text.includes('\0')) throw new TypeError('This file does not look like a text CSV.');
      table = logic.parseCsv(text, logic.detectCsvDelimiter(text), { maxRows: 10_001, maxColumns: 100, maxCells: 200_000 });
      search.disabled = !table.headers.length;
      page = 0; render();
      setStatus(root, table.headers.length ? 'CSV opened. Search any value in the table.' : 'This CSV file has no rows.', table.headers.length ? 'success' : 'error');
    } catch (error) { table = { headers: [], rows: [], delimiter: ',' }; render(); setStatus(root, error.message || 'This CSV could not be read.', 'error'); }
  });
  search.addEventListener('input', () => { page = 0; render(); });
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'csv-prev' && page > 0) { page -= 1; render(); }
    if (action === 'csv-next' && (page + 1) * pageSize < filtered.length) { page += 1; render(); }
    if (action === 'clear') { input.value = ''; search.value = ''; search.disabled = true; table = { headers: [], rows: [], delimiter: ',' }; filtered = []; page = 0; $('#csv-file-meta', root).textContent = t('The file opens locally and is not uploaded.'); render(); setStatus(root, 'Choose a CSV file to see its table.'); }
  });
}

let qrScriptPromise;
function loadQrLibrary() {
  if (window.jsQR) return Promise.resolve(window.jsQR);
  qrScriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = versioned('/assets/vendor/jsQR.js'); script.onload = () => window.jsQR ? resolve(window.jsQR) : reject(new Error('QR reader could not load.')); script.onerror = () => reject(new Error('QR reader could not load.'));
    document.head.append(script);
  });
  return qrScriptPromise;
}

function setupQrReader(root) {
  const input = $('#qr-reader-file', root);
  const output = $('#qr-reader-output', root);
  const video = $('#qr-reader-video', root);
  const canvas = $('#qr-reader-canvas', root);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const start = $('[data-action="start-camera"]', root);
  const stop = $('[data-action="stop-camera"]', root);
  let stream = null;
  let scanning = false;
  let lastFrame = 0;
  let scanOperation = 0;
  const stopCamera = () => {
    scanOperation += 1;
    scanning = false;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    stream = null; video.pause(); video.srcObject = null; video.hidden = true; start.disabled = false; stop.disabled = true;
  };
  const showResult = (data) => {
    output.value = data;
    const link = $('#qr-reader-link', root);
    link.hidden = true; link.removeAttribute('href');
    try {
      const parsed = new URL(data);
      if (['https:', 'http:'].includes(parsed.protocol) && !parsed.username && !parsed.password) { link.href = parsed.href; link.hidden = false; }
    } catch { /* QR text is shown as text only; it is never executed. */ }
    stopCamera();
    setStatus(root, 'QR code read. Check its contents before opening anything.', 'success');
  };
  const scanBitmap = async (bitmap, operation) => {
    if (bitmap.width * bitmap.height > 20_000_000) throw new RangeError('This image is larger than 20 megapixels. Choose a smaller image.');
    const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const decoder = await loadQrLibrary();
    if (operation !== scanOperation) return false;
    const result = decoder(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
    if (!result?.data) return false;
    showResult(result.data);
    return true;
  };
  input.addEventListener('change', async () => {
    stopCamera(); output.value = ''; $('#qr-reader-link', root).hidden = true;
    const operation = ++scanOperation;
    const file = input.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setStatus(root, 'Choose a JPG, PNG or WebP image that contains a QR code.', 'error');
    if (file.size > 10 * 1024 * 1024) return setStatus(root, 'This image is larger than the 10 MB limit.', 'error');
    let bitmap;
    try {
      setStatus(root, 'Checking the image on your device…');
      bitmap = await createImageBitmap(file);
      if (operation !== scanOperation) return;
      if (!await scanBitmap(bitmap, operation) && operation === scanOperation) setStatus(root, 'No QR code found. Try a clearer, well-lit image.', 'error');
    } catch (error) { if (operation === scanOperation) setStatus(root, error.message || 'This image could not be scanned. Try another image.', 'error'); }
    finally { bitmap?.close?.(); }
  });
  start.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) return setStatus(root, 'Camera scanning needs a supported browser and a secure HTTPS connection. You can choose an image instead.', 'error');
    const operation = ++scanOperation;
    try {
      setStatus(root, 'Waiting for camera permission…');
      await loadQrLibrary();
      if (operation !== scanOperation) return;
      const requestedStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false });
      if (operation !== scanOperation) { requestedStream.getTracks().forEach((track) => track.stop()); return; }
      stream = requestedStream;
      video.srcObject = stream; video.hidden = false; await video.play();
      scanning = true; start.disabled = true; stop.disabled = false;
      setStatus(root, 'Point the camera at a QR code. Your camera stays on this device.');
      const scan = async (now) => {
        if (!scanning) return;
        if (now - lastFrame > 250 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          lastFrame = now;
          const scale = Math.min(1, 1000 / video.videoWidth);
          canvas.width = Math.max(1, Math.round(video.videoWidth * scale)); canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const result = window.jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
          if (result?.data) { showResult(result.data); return; }
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } catch (error) {
      if (operation !== scanOperation) return;
      stopCamera();
      setStatus(root, error.name === 'NotAllowedError' ? 'Camera access was denied. Choose an image or allow camera access in your browser.' : 'The camera could not start. Choose an image or check browser permissions.', 'error');
    }
  });
  stop.addEventListener('click', () => { stopCamera(); setStatus(root, 'Camera stopped.'); });
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'copy-qr-result') copyToClipboard(output.value, root);
    if (action === 'clear') { stopCamera(); input.value = ''; output.value = ''; $('#qr-reader-link', root).hidden = true; setStatus(root, 'Camera access is optional. You will be asked before it starts.'); }
  });
  window.addEventListener('pagehide', stopCamera, { once: true });
}

function setupStandardDeviation(root) {
  const input = $('#stats-input', root);
  const status = $('#tool-status', root);
  const outputs = ['stats-count', 'stats-mean', 'stats-variance', 'stats-deviation'];
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      input.value = '';
      outputs.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, 'Enter a list of valid numbers. Sample mode needs at least two values.');
      input.focus();
    }
    if (action !== 'calculate-statistics') return;
    try {
      const decimal = new Intl.NumberFormat(languageTag).formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.';
      const delimiter = decimal === ',' ? /[;\n\r]+/u : /[,;\n\r]+/u;
      const rawValues = input.value.trim().split(delimiter).map((value) => value.trim()).filter(Boolean);
      if (input.value.length > 200_000 || rawValues.length > 10_000) throw new RangeError('Enter no more than 10,000 values.');
      const values = rawValues.map(parseNumber);
      if (!values.length || values.some((value) => !Number.isFinite(value))) throw new TypeError('Enter a list of valid numbers. Sample mode needs at least two values.');
      const type = $('#stats-type', root).value;
      const result = logic.calculateStandardDeviation(values, type);
      $('#stats-count', root).textContent = formatNumber(result.count);
      $('#stats-mean', root).textContent = formatNumber(result.mean, { maximumFractionDigits: 6 });
      $('#stats-variance', root).textContent = formatNumber(result.variance, { maximumFractionDigits: 6 });
      $('#stats-deviation', root).textContent = formatNumber(result.standardDeviation, { maximumFractionDigits: 6 });
      setStatus(root, type === 'sample' ? 'Sample statistics calculated locally.' : 'Population statistics calculated locally.', 'success');
    } catch (error) {
      outputs.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, error.message || 'Check the values and try again.', 'error');
    }
  });
}

function setupDiscount(root) {
  let mode = 'sale';
  const outputs = ['discount-saved', 'discount-final', 'discount-rate-result'];
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-discount-mode]');
    if (modeButton) {
      mode = modeButton.dataset.discountMode;
      $$('[data-discount-mode]', root).forEach((button) => {
        const active = button === modeButton;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      $('#discount-sale-fields', root).hidden = mode !== 'sale';
      $('#discount-reverse-fields', root).hidden = mode !== 'reverse';
      outputs.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, 'Results are estimates before tax.');
      return;
    }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      $$('input', root).forEach((input) => { input.value = ''; });
      outputs.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, 'Results are estimates before tax.');
      $('#discount-original', root).focus();
      return;
    }
    if (action !== 'calculate-discount') return;
    try {
      const result = mode === 'sale'
        ? logic.calculateDiscount(parseNumber($('#discount-original', root).value), parseNumber($('#discount-percent', root).value))
        : logic.findDiscount(parseNumber($('#discount-reverse-original', root).value), parseNumber($('#discount-sale-price', root).value));
      $('#discount-saved', root).textContent = formatNumber(result.saved, { maximumFractionDigits: 2 });
      $('#discount-final', root).textContent = formatNumber(result.salePrice, { maximumFractionDigits: 2 });
      $('#discount-rate-result', root).textContent = `${formatNumber(result.discountPercent, { maximumFractionDigits: 4 })}%`;
      setStatus(root, 'Discount calculated locally.', 'success');
    } catch (error) {
      outputs.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, error.message || 'Check the values and try again.', 'error');
    }
  });
}

function setupSquareFootage(root) {
  const outputIds = ['area-square-feet', 'area-square-meters', 'area-with-waste'];
  const status = $('#tool-status', root);
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      $('#area-length', root).value = '';
      $('#area-width', root).value = '';
      $('#area-unit', root).value = 'ft';
      $('#area-waste', root).value = '10';
      outputIds.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, 'Enter positive room dimensions. The waste allowance is optional.');
      $('#area-length', root).focus();
      return;
    }
    if (action !== 'calculate-area') return;
    try {
      const result = logic.calculateFloorArea(
        parseNumber($('#area-length', root).value),
        parseNumber($('#area-width', root).value),
        $('#area-unit', root).value,
        $('#area-waste', root).value.trim() === '' ? 0 : parseNumber($('#area-waste', root).value),
      );
      $('#area-square-feet', root).textContent = `${formatNumber(result.areaSquareFeet, { maximumFractionDigits: 3 })} ft²`;
      $('#area-square-meters', root).textContent = `${formatNumber(result.areaSquareMeters, { maximumFractionDigits: 3 })} m²`;
      $('#area-with-waste', root).textContent = `${formatNumber(result.areaWithWasteSquareFeet, { maximumFractionDigits: 3 })} ft²`;
      setStatus(root, 'Area calculated locally. Measure the project before ordering materials.', 'success');
    } catch (error) {
      outputIds.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      setStatus(root, error.message || 'Check the values and try again.', 'error');
    }
  });
}

function setupBarcode(root) {
  const format = $('#barcode-format', root);
  const value = $('#barcode-value', root);
  const svg = $('#barcode-preview', root);
  const preview = $('#barcode-preview-wrap', root);
  const actions = $('#barcode-download-actions', root);
  const downloads = $('#barcode-downloads', root);
  let rendered = null;
  const updateHint = () => {
    const messages = { CODE128: 'Code 128 accepts up to 80 printable ASCII characters.', EAN13: 'Enter 12 digits, or 13 digits with a valid check digit. A missing check digit is added.', UPC: 'Enter 11 digits, or 12 digits with a valid check digit. A missing check digit is added.' };
    $('#barcode-format-hint', root).textContent = t(messages[format.value]);
  };
  const clearResult = () => {
    clearDownloadLinks(downloads);
    svg.replaceChildren();
    preview.hidden = true;
    actions.hidden = true;
    rendered = null;
  };
  const generate = async () => {
    const raw = value.value.trim();
    if (!raw) throw new TypeError('Enter text or digits for your barcode.');
    let barcodeValue = raw;
    if (format.value === 'CODE128') {
      if (raw.length > 80 || !/^[\x20-\x7e]+$/u.test(raw)) throw new TypeError('Code 128 accepts 1–80 printable ASCII characters.');
    } else barcodeValue = logic.normalizeRetailBarcode(raw, format.value);
    clearResult();
    setStatus(root, 'Creating your barcode locally…');
    const JsBarcode = await loadVendorScript('JsBarcode.all.min.js', 'JsBarcode');
    JsBarcode(svg, barcodeValue, {
      format: format.value,
      lineColor: '#000000',
      background: '#ffffff',
      width: 2,
      height: 90,
      margin: 12,
      displayValue: $('#barcode-show-value', root).checked,
      font: 'monospace',
      fontSize: 16,
      textMargin: 6,
    });
    preview.hidden = false;
    actions.hidden = false;
    rendered = { value: barcodeValue, format: format.value };
    setStatus(root, 'Barcode created locally. No data was uploaded.', 'success');
  };
  format.addEventListener('change', () => { updateHint(); clearResult(); });
  $('#barcode-show-value', root).addEventListener('change', () => { if (rendered) generate().catch((error) => setStatus(root, error.message, 'error')); });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear') {
      value.value = '';
      format.value = 'CODE128';
      $('#barcode-show-value', root).checked = true;
      updateHint(); clearResult();
      setStatus(root, 'Generated locally. Retail barcodes need a valid product identifier.');
      value.focus();
      return;
    }
    if (action === 'generate-barcode') {
      try { await generate(); }
      catch (error) { clearResult(); setStatus(root, error.message || 'The barcode could not be created.', 'error'); }
      return;
    }
    if (!rendered) return;
    if (action === 'download-barcode-svg') {
      makeDownloadLink(downloads, new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-barcode.svg', 'Download SVG');
    }
    if (action === 'download-barcode-png') {
      try {
        const serialized = new XMLSerializer().serializeToString(svg);
        const svgUrl = URL.createObjectURL(new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' }));
        try {
          const image = new Image();
          image.src = svgUrl;
          await image.decode();
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas is unavailable.');
          context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0);
          const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PNG image could not be created.')), 'image/png'));
          makeDownloadLink(downloads, blob, 'usefulverse-barcode.png', 'Download PNG');
          canvas.width = 1; canvas.height = 1;
        } finally { URL.revokeObjectURL(svgUrl); }
      } catch { setStatus(root, 'PNG could not be created. Download the SVG instead.', 'error'); }
    }
  });
  updateHint();
}

const setups = {
  'xml-formatter': setupXml,
  'color-contrast-checker': setupContrast,
  'tip-calculator': setupTip,
  'gpa-calculator': setupGpa,
  'file-checksum': setupChecksum,
  'image-resizer-compressor': setupImage,
  'pdf-tools': setupPdf,
  'video-compressor': setupVideoCompressor,
  'csv-viewer': setupCsv,
  'qr-code-reader': setupQrReader,
  'standard-deviation-calculator': setupStandardDeviation,
  'discount-calculator': setupDiscount,
  'square-footage-calculator': setupSquareFootage,
  'barcode-generator': setupBarcode,
};

export function setupAdvancedTool(id, root) {
  const setup = setups[id];
  if (setup) setup(root);
}
