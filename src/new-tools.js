const bundle = window.usefulverseLocale ?? { messages: {}, runtime: {} };
const lang = document.documentElement.lang || 'en';
const localeTag = bundle.tag ?? ({ en: 'en-US', es: 'es-ES', fr: 'fr-FR', 'pt-BR': 'pt-BR', de: 'de-DE' }[lang] ?? lang);
const englishStatusMessages = {
  'status.typingReady': 'Type to start the test.', 'status.working': 'Working…', 'status.done': 'Done.',
  'status.inputError': 'Check your input and try again.', 'status.timeUp': 'Time is up.', 'status.timerPaused': 'Timer paused.',
  'status.focusSession': 'Focus session', 'status.breakSession': 'Break', 'status.focusComplete': 'Focus session complete.',
  'status.breakComplete': 'Break complete.', 'status.copied': 'Copied.', 'status.emptyCopy': 'There is nothing to copy yet.',
  'status.copyFailed': 'Copy failed. Select and copy the result manually.', 'status.shiftLimit': 'You have reached the 14-shift limit.',
  'status.textRequired': 'Generate the text before downloading it.', 'status.downloadReady': 'Download ready.',
  'status.imageFileType': 'Choose a JPG, PNG, or WebP image up to 10 MB.',
  'status.imageReady': 'Image ready. Drag to crop or edit the coordinates.', 'status.imageOpenError': 'Could not open this image.',
  'status.imageRequired': 'Choose an image first.', 'status.choosePdf': 'Choose a PDF to begin.',
  'status.pdfProgress': 'Converting PDF pages…', 'status.pdfError': 'Could not convert the PDF. It may be password-protected or damaged.',
  'status.sqlLocal': 'SQL is processed in your browser.', 'status.sqlError': 'Could not format the SQL.',
  'status.needName': 'Add at least one name.', 'status.timerRunning': 'Timer is running.',
  'status.durationRequired': 'Enter a duration greater than zero.', 'status.ready': 'Ready.',
};
const t = (key) => bundle.runtime?.[key] ?? bundle.messages?.[key] ?? englishStatusMessages[key] ?? key;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const version = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${version ? `?v=${encodeURIComponent(version)}` : ''}`;
const logic = await import(versioned('./new-tool-logic.mjs'));
const objectUrls = new Set();
window.addEventListener('pagehide', () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });

function status(root, message, type = '') {
  const output = $('#tool-status', root);
  if (!output) return;
  output.textContent = t(`status.${message}`);
  output.className = `tool-status${type ? ` is-${type}` : ''}`;
}
function number(value) {
  const normalized = String(value).normalize('NFKC')
    .replace(/[०-९]/gu, (digit) => String(digit.codePointAt(0) - 0x966))
    .replace(/[০-৯]/gu, (digit) => String(digit.codePointAt(0) - 0x09e6))
    .replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0))
    .replace(/\u066b/gu, '.').replace(/\u066c/gu, '').replace(/\s/gu, '').replace(',', '.');
  return normalized === '' ? NaN : Number(normalized);
}
function format(value, digits = 2) { return new Intl.NumberFormat(localeTag, { maximumFractionDigits: digits }).format(value); }
function formatMoney(value, currency) {
  try { return new Intl.NumberFormat(localeTag, { style: 'currency', currency }).format(value); }
  catch { return `${currency} ${format(value)}`; }
}
async function copy(value, root) {
  if (!value) return status(root, 'emptyCopy', 'error');
  try { await navigator.clipboard.writeText(value); status(root, 'copied', 'success'); }
  catch { status(root, 'copyFailed', 'error'); }
}
function download(blob, name, container = null) {
  const url = URL.createObjectURL(blob); objectUrls.add(url);
  const link = document.createElement('a'); link.href = url; link.download = name;
  if (container) { container.replaceChildren(link); link.className = 'button button--ghost file-download'; link.textContent = `${t('Download')} ${name}`; }
  else { link.style.display = 'none'; document.body.append(link); link.click(); link.remove(); setTimeout(() => { URL.revokeObjectURL(url); objectUrls.delete(url); }, 1000); }
}
function friendlyError(_error, fallback = 'inputError') { return fallback; }

function setupTyping(root) {
  const input = $('#typing-input', root); const prompt = $('#typing-prompt', root); const duration = $('#typing-duration', root);
  let startedAt = 0; let timer = 0; let finished = false;
  const renderMetrics = (elapsed) => {
    const stats = logic.typingMetrics(prompt.textContent, input.value, elapsed);
    $('#typing-wpm', root).textContent = format(stats.wpm, 1);
    $('#typing-accuracy', root).textContent = `${format(stats.accuracy, 1)}%`;
    $('#typing-correct', root).textContent = format(stats.correctCharacters);
  };
  const stop = () => { clearInterval(timer); timer = 0; };
  const reset = (focus = false) => { stop(); startedAt = 0; finished = false; input.value = ''; input.disabled = false; $('#typing-time', root).textContent = duration.value; $('#typing-wpm', root).textContent = '0'; $('#typing-accuracy', root).textContent = '100%'; status(root, 'typingReady'); if (focus) input.focus(); };
  duration.addEventListener('change', reset);
  input.addEventListener('input', () => {
    if (finished) return;
    if (!startedAt) { startedAt = performance.now(); status(root, 'working'); timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt; const left = Math.max(0, Number(duration.value) * 1000 - elapsed);
      $('#typing-time', root).textContent = String(Math.ceil(left / 1000)); renderMetrics(elapsed);
      if (!left) { finished = true; input.disabled = true; stop(); status(root, 'timeUp', 'success'); }
    }, 100); }
    renderMetrics(Math.max(1, performance.now() - startedAt));
  });
  root.addEventListener('click', (event) => { if (event.target.closest('[data-action="restart-typing"]')) reset(true); });
}

function setupFractions(root) {
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-fraction"]')) return;
    try {
      const result = logic.calculateFraction($('#fraction-a', root).value, $('#fraction-b', root).value, $('#fraction-operation', root).value);
      $('#fraction-result', root).textContent = result.fraction;
      $('#fraction-mixed', root).textContent = result.mixed;
      $('#fraction-decimal', root).textContent = Number.isFinite(result.decimal) ? new Intl.NumberFormat(localeTag, { maximumFractionDigits: 12 }).format(result.decimal) : '—';
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

function setupTimeCard(root) {
  const rows = $('#timecard-shifts', root); const template = $('#timecard-row-template', root);
  const refreshNames = () => $$('.timecard-row', rows).forEach((row, index) => { row.querySelector('legend').textContent = `${t('Shift')} ${index + 1}`; row.querySelector('[data-action="remove-shift"]').disabled = rows.children.length === 1; });
  const calculate = () => {
    try {
      const totals = logic.calculateTimeCard($$('.timecard-row', rows).map((row) => ({ start: $('[data-shift-start]', row).value, end: $('[data-shift-end]', row).value, breakMinutes: number($('[data-shift-break]', row).value || '0') })));
      const hours = totals.minutes / 60; const rateInput = $('#timecard-rate', root).value;
      const rate = rateInput ? number(rateInput) : NaN;
      if (rateInput && (!Number.isFinite(rate) || rate < 0)) throw new RangeError('Enter a valid hourly rate or leave it blank.');
      $('#timecard-hours', root).textContent = format(hours);
      $('#timecard-breaks', root).textContent = `${format(totals.breakMinutes)} min`;
      $('#timecard-pay-result', root).textContent = Number.isFinite(rate) ? formatMoney(hours * rate, $('#timecard-currency', root).value) : '—';
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  };
  root.addEventListener('click', (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'add-shift') {
      if (rows.children.length >= 14) return status(root, 'shiftLimit', 'error');
      rows.append(template.content.cloneNode(true)); refreshNames();
    }
    if (actionName === 'remove-shift') { if (rows.children.length > 1) event.target.closest('[data-shift-row]').remove(); refreshNames(); }
    if (actionName === 'calculate-timecard') calculate();
  });
  rows.addEventListener('change', calculate); $('#timecard-rate', root).addEventListener('input', calculate); $('#timecard-currency', root).addEventListener('change', calculate); refreshNames(); calculate();
}

function setupTimer(root) {
  let mode = 'countdown'; let phase = 'focus'; let remaining = 5 * 60_000; let accumulated = 0; let started = 0; let ticker = 0; let running = false; let cycle = 0;
  const display = $('#timer-display', root);
  const render = () => {
    const elapsed = running ? performance.now() - started : 0;
    const value = mode === 'stopwatch' ? accumulated + elapsed : Math.max(0, remaining - elapsed);
    display.textContent = logic.formatTimer(value);
    $('#timer-phase', root).textContent = mode === 'pomodoro' ? t(phase === 'focus' ? 'status.focusSession' : 'status.breakSession') : t(mode === 'stopwatch' ? 'Stopwatch' : 'Countdown');
  };
  const stop = () => { if (running) { const elapsed = performance.now() - started; if (mode === 'stopwatch') accumulated += elapsed; else remaining = Math.max(0, remaining - elapsed); } running = false; clearInterval(ticker); ticker = 0; render(); };
  const reset = () => { stop(); cycle = 0; phase = 'focus'; if (mode === 'stopwatch') accumulated = 0; else if (mode === 'pomodoro') remaining = number($('#focus-minutes', root).value) * 60_000; else remaining = (number($('#timer-minutes', root).value) * 60 + number($('#timer-seconds', root).value)) * 1000; render(); status(root, 'ready'); };
  const start = () => {
    if (running) return;
    if (mode !== 'stopwatch' && remaining <= 0) reset();
    if (mode !== 'stopwatch' && (!Number.isFinite(remaining) || remaining <= 0)) return status(root, 'durationRequired', 'error');
    running = true; started = performance.now(); clearInterval(ticker); ticker = window.setInterval(tick, 200);
    status(root, 'timerRunning'); render();
  };
  const tick = () => {
    render();
    if (mode !== 'stopwatch' && remaining - (performance.now() - started) <= 0) {
      remaining = 0; running = false; clearInterval(ticker); ticker = 0;
      if (mode === 'pomodoro') {
        status(root, phase === 'focus' ? 'focusComplete' : 'breakComplete', 'success');
        if (phase === 'focus') { phase = 'break'; remaining = number($('#break-minutes', root).value) * 60_000; }
        else { phase = 'focus'; cycle += 1; remaining = number($('#focus-minutes', root).value) * 60_000; }
        started = performance.now(); running = true; ticker = window.setInterval(tick, 200);
      } else status(root, 'timeUp', 'success');
      render();
    }
  };
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-timer-mode]');
    if (modeButton) { stop(); mode = modeButton.dataset.timerMode; $$('.timer-modes [data-timer-mode]', root).forEach((button) => { button.classList.toggle('is-active', button === modeButton); button.setAttribute('aria-pressed', String(button === modeButton)); }); $('#timer-settings', root).hidden = mode === 'stopwatch' || mode === 'pomodoro'; $('#pomodoro-settings', root).hidden = mode !== 'pomodoro'; reset(); }
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'timer-start') start();
    if (actionName === 'timer-pause') { stop(); status(root, 'timerPaused'); }
    if (actionName === 'timer-reset') reset();
  });
  $('#timer-minutes', root).addEventListener('change', reset); $('#timer-seconds', root).addEventListener('change', reset); $('#focus-minutes', root).addEventListener('change', reset); $('#break-minutes', root).addEventListener('change', reset);
  reset();
}

function setupLorem(root) {
  const output = $('#lorem-output', root); const mode = $('#lorem-mode', root); const amount = $('#lorem-amount', root);
  const updateLimit = () => { amount.max = ({ paragraphs: 50, sentences: 200, words: 5000 })[mode.value]; amount.value = String(Math.min(Number(amount.value), Number(amount.max))); };
  mode.addEventListener('change', updateLimit);
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'generate-lorem') { try { output.value = logic.generateLorem(mode.value, number(amount.value)); status(root, 'done', 'success'); } catch (error) { status(root, friendlyError(error), 'error'); } }
    if (actionName === 'copy-lorem') await copy(output.value, root);
    if (actionName === 'download-lorem') { if (!output.value) return status(root, 'textRequired', 'error'); download(new Blob([output.value], { type: 'text/plain;charset=utf-8' }), 'lorem-ipsum.txt'); status(root, 'downloadReady', 'success'); }
  });
}

function setupSubnet(root) {
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-subnet"]')) return;
    try {
      const result = logic.calculateSubnet($('#subnet-input', root).value);
      for (const [key, value] of Object.entries({ network: result.network, mask: result.mask, wildcard: result.wildcard, broadcast: result.broadcast, first: result.firstHost, last: result.lastHost, total: format(result.totalAddresses, 0), hosts: format(result.usableHosts, 0) })) $(`#subnet-${key}`, root).textContent = value;
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
  root.querySelector('[data-action="calculate-subnet"]').click();
}

function secureIndex(max) {
  if (!globalThis.crypto?.getRandomValues || !Number.isInteger(max) || max < 1 || max > 0xffffffff) throw new Error('Secure random selection is not available in this browser.');
  const range = 0x100000000; const limit = range - (range % max); const values = new Uint32Array(1); let value;
  do { crypto.getRandomValues(values); value = values[0]; } while (value >= limit);
  return value % max;
}
function setupNamePicker(root) {
  root.addEventListener('click', (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'clear-picker') { $('#picker-names', root).value = ''; $('#picker-winners', root).replaceChildren(); status(root, 'needName'); return; }
    if (actionName !== 'pick-names') return;
    try {
      const entries = $('#picker-names', root).value.split(/\r?\n/u).map((name) => name.trim()).filter(Boolean);
      if (!entries.length) throw new TypeError('Add at least one name.');
      const count = number($('#picker-count', root).value); const noRepeat = $('#picker-no-repeat', root).checked;
      if (!Number.isInteger(count) || count < 1 || count > 100 || (noRepeat && count > entries.length)) throw new RangeError('Choose a valid number of picks for the list.');
      const winners = [];
      if (noRepeat) { const pool = [...entries]; for (let i = 0; i < count; i += 1) winners.push(pool.splice(secureIndex(pool.length), 1)[0]); }
      else for (let i = 0; i < count; i += 1) winners.push(entries[secureIndex(entries.length)]);
      const list = $('#picker-winners', root); list.replaceChildren(...winners.map((name) => { const item = document.createElement('li'); item.textContent = name; return item; })); status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

function setupFuel(root) {
  const system = $('#fuel-units', root); const updateLabel = () => {
    const metric = system.value === 'metric';
    $('#fuel-efficiency-label', root).firstChild.textContent = t(metric ? 'Efficiency (L/100 km)' : 'Efficiency (MPG)');
    $('#fuel-price-label', root).firstChild.textContent = t(metric ? 'Fuel price per liter' : 'Fuel price per gallon');
  };
  system.addEventListener('change', updateLabel);
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-action="calculate-fuel"]')) return;
    try {
      const result = logic.calculateFuelCost({ distance: number($('#fuel-distance', root).value), efficiency: number($('#fuel-efficiency', root).value), price: number($('#fuel-price', root).value), passengers: number($('#fuel-passengers', root).value), system: system.value, roundTrip: $('#fuel-round-trip', root).checked });
      $('#fuel-used', root).textContent = `${format(result.fuel)} ${result.fuelUnit}`;
      $('#fuel-cost', root).textContent = formatMoney(result.cost, $('#fuel-currency', root).value);
      $('#fuel-share', root).textContent = formatMoney(result.perPassenger, $('#fuel-currency', root).value);
      status(root, 'done', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
  updateLabel();
}

function setupCropper(root) {
  const fileInput = $('#crop-file', root); const canvas = $('#crop-canvas', root); const ctx = canvas.getContext('2d'); const fileList = $('#crop-downloads', root);
  const fields = { x: $('#crop-x', root), y: $('#crop-y', root), width: $('#crop-width', root), height: $('#crop-height', root) };
  let bitmap = null; let drag = null; let selection = { x: 0, y: 0, width: 0, height: 0 }; let scale = 1; let currentUrl = '';
  const maxSize = 10 * 1024 * 1024; const setSelection = (next) => {
    if (!bitmap) return;
    const xValue = Number.isFinite(next.x) ? Math.round(next.x) : selection.x; const yValue = Number.isFinite(next.y) ? Math.round(next.y) : selection.y;
    const widthValue = Number.isFinite(next.width) ? Math.round(next.width) : selection.width; const heightValue = Number.isFinite(next.height) ? Math.round(next.height) : selection.height;
    const x = Math.max(0, Math.min(bitmap.width - 1, xValue)); const y = Math.max(0, Math.min(bitmap.height - 1, yValue));
    selection = { x, y, width: Math.max(1, Math.min(bitmap.width - x, widthValue)), height: Math.max(1, Math.min(bitmap.height - y, heightValue)) };
    for (const key of Object.keys(fields)) fields[key].value = String(selection[key]); draw();
  };
  const draw = () => {
    if (!bitmap) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const x = selection.x * scale; const y = selection.y * scale; const width = selection.width * scale; const height = selection.height * scale;
    ctx.save(); ctx.fillStyle = 'rgb(0 0 0 / 42%)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.clearRect(x, y, width, height); ctx.drawImage(bitmap, selection.x, selection.y, selection.width, selection.height, x, y, width, height); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(2, 2 / scale); ctx.setLineDash([7, 4]); ctx.strokeRect(x, y, width, height); ctx.restore();
  };
  const updateRatio = () => {
    if (!bitmap) return;
    const ratio = $('#crop-ratio', root).value;
    if (ratio === 'free') return;
    const [w, h] = ratio.split(':').map(Number); const target = w / h;
    let width = selection.width; let height = selection.height;
    if (width / height > target) width = height * target; else height = width / target;
    setSelection({ x: selection.x + (selection.width - width) / 2, y: selection.y + (selection.height - height) / 2, width, height });
  };
  fileInput.addEventListener('change', async () => {
    bitmap?.close?.(); bitmap = null; fileList.replaceChildren();
    const file = fileInput.files[0]; if (!file) return;
    if (file.size > maxSize || !/^image\/(?:jpeg|png|webp)$/u.test(file.type)) { status(root, 'imageFileType', 'error'); fileInput.value = ''; return; }
    try {
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      else {
        if (currentUrl) { URL.revokeObjectURL(currentUrl); objectUrls.delete(currentUrl); }
        currentUrl = URL.createObjectURL(file); objectUrls.add(currentUrl);
        bitmap = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = currentUrl; });
      }
      if (bitmap.width * bitmap.height > 12_000_000) { bitmap.close?.(); bitmap = null; throw new RangeError('Choose an image with 12 megapixels or fewer.'); }
      scale = Math.min(1, 1400 / bitmap.width, 900 / bitmap.height); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      let width = bitmap.width; let height = bitmap.height;
      if ($('#crop-ratio', root).value !== 'free') { const [w, h] = $('#crop-ratio', root).value.split(':').map(Number); const target = w / h; if (width / height > target) width = height * target; else height = width / target; }
      selection = { x: Math.round((bitmap.width - width) / 2), y: Math.round((bitmap.height - height) / 2), width: Math.round(width), height: Math.round(height) };
      setSelection(selection); status(root, 'imageReady', 'success');
    } catch (error) { status(root, friendlyError(error, 'imageOpenError'), 'error'); }
  });
  $('#crop-ratio', root).addEventListener('change', updateRatio);
  for (const [key, input] of Object.entries(fields)) input.addEventListener('change', () => setSelection({ ...selection, [key]: number(input.value) }));
  const point = (event) => { const rect = canvas.getBoundingClientRect(); return { x: Math.max(0, Math.min(bitmap.width, (event.clientX - rect.left) * bitmap.width / rect.width)), y: Math.max(0, Math.min(bitmap.height, (event.clientY - rect.top) * bitmap.height / rect.height)) }; };
  canvas.addEventListener('pointerdown', (event) => { if (!bitmap) return; drag = point(event); canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const current = point(event); let width = Math.abs(current.x - drag.x); let height = Math.abs(current.y - drag.y);
    const ratio = $('#crop-ratio', root).value;
    if (ratio !== 'free') {
      const [ratioWidth, ratioHeight] = ratio.split(':').map(Number); const target = ratioWidth / ratioHeight;
      if (width / Math.max(height, 1) > target) width = height * target; else height = width / target;
    }
    const x = current.x < drag.x ? drag.x - width : drag.x; const y = current.y < drag.y ? drag.y - height : drag.y;
    setSelection({ x, y, width, height });
  });
  canvas.addEventListener('pointerup', () => { drag = null; });
  canvas.addEventListener('pointercancel', () => { drag = null; });
  root.addEventListener('click', async (event) => {
    if (!event.target.closest('[data-action="crop-download"]')) return;
    try {
      if (!bitmap) return status(root, 'imageRequired', 'error');
      if (selection.width * selection.height > 12_000_000) throw new RangeError('The crop is too large. Reduce it to 12 megapixels or fewer.');
      const output = document.createElement('canvas'); output.width = selection.width; output.height = selection.height;
      const outputContext = output.getContext('2d'); if (!outputContext) throw new Error('Canvas is unavailable.');
      outputContext.drawImage(bitmap, selection.x, selection.y, selection.width, selection.height, 0, 0, output.width, output.height);
      const type = $('#crop-format', root).value;
      const blob = await new Promise((resolve, reject) => output.toBlob((result) => result ? resolve(result) : reject(new Error('The cropped image could not be created.')), type, 0.9));
      const extension = type === 'image/jpeg' ? 'jpg' : type === 'image/webp' ? 'webp' : 'png'; download(blob, `usefulverse-crop.${extension}`, fileList); output.width = 1; output.height = 1; status(root, 'downloadReady', 'success');
    } catch (error) { status(root, friendlyError(error), 'error'); }
  });
}

let pdfModulePromise;
function loadPdfJs() {
  pdfModulePromise ??= import(versioned('/assets/vendor/pdf.min.mjs')).then((pdfjs) => { pdfjs.GlobalWorkerOptions.workerSrc = versioned('/assets/vendor/pdf.worker.min.mjs'); return pdfjs; });
  return pdfModulePromise;
}
async function readPdf(file) {
  if (!file || file.size > 10 * 1024 * 1024) throw new RangeError('PDF must be 10 MB or smaller.');
  const header = new TextDecoder('latin1').decode(await file.slice(0, 1024).arrayBuffer());
  if (!header.includes('%PDF-')) throw new TypeError('Choose a valid PDF file.');
  return new Uint8Array(await file.arrayBuffer());
}
function setupPdfImages(root) {
  const fileInput = $('#pdf-image-file', root); const downloads = $('#pdf-image-downloads', root); let operation = 0;
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'clear-pdf-images') { operation += 1; fileInput.value = ''; $('#pdf-page-range', root).value = 'all'; downloads.replaceChildren(); status(root, 'choosePdf'); return; }
    if (actionName !== 'convert-pdf-images') return;
    const current = ++operation; downloads.replaceChildren(); const button = event.target.closest('[data-action]'); button.disabled = true;
    let loadingTask; let pdf;
    try {
      const file = fileInput.files[0]; if (!file) return status(root, 'choosePdf', 'error');
      const bytes = await readPdf(file); const pdfjs = await loadPdfJs();
      loadingTask = pdfjs.getDocument({ data: bytes }); pdf = await loadingTask.promise;
      const pages = logic.parsePdfPageRanges($('#pdf-page-range', root).value, pdf.numPages);
      const format = $('#pdf-image-format', root).value; const scaleLimit = Number($('#pdf-image-scale', root).value); const imageType = format === 'image/jpeg' ? 'jpg' : 'png';
      const files = []; let totalPixels = 0; let totalBytes = 0; const maxTotalPixels = 12_000_000; const maxZipBytes = 30 * 1024 * 1024;
      for (const pageNumber of pages) {
        if (current !== operation) return;
        const page = await pdf.getPage(pageNumber); const unit = page.getViewport({ scale: 1 });
        const available = maxTotalPixels - totalPixels; const actualScale = Math.min(scaleLimit, Math.sqrt(available / (unit.width * unit.height)));
        if (!Number.isFinite(actualScale) || actualScale < 0.2) throw new RangeError('This PDF is too large to render safely in one batch. Select fewer pages.');
        const viewport = page.getViewport({ scale: actualScale }); const pixels = Math.ceil(viewport.width) * Math.ceil(viewport.height); totalPixels += pixels;
        const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: format === 'image/png' }); if (!context) throw new Error('Canvas is unavailable.');
        if (format === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
        status(root, 'pdfProgress');
        await page.render({ canvasContext: context, viewport, ...(format === 'image/jpeg' ? { background: '#ffffff' } : {}) }).promise;
        const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('An image page could not be created.')), format, format === 'image/jpeg' ? 0.9 : undefined));
        if (totalBytes + blob.size > maxZipBytes) throw new RangeError('The selected pages are too large for one download. Choose fewer pages or use JPG.');
        totalBytes += blob.size;
        files.push({ name: `page-${String(pageNumber).padStart(3, '0')}.${imageType}`, data: new Uint8Array(await blob.arrayBuffer()) });
        canvas.width = 1; canvas.height = 1; page.cleanup();
      }
      if (current !== operation) return;
      const zip = logic.createZip(files); download(zip, 'pdf-pages.zip', downloads); status(root, 'downloadReady', 'success');
    } catch (error) { if (current === operation) status(root, friendlyError(error, 'pdfError'), 'error'); }
    finally { try { await pdf?.destroy(); } catch {} try { await loadingTask?.destroy(); } catch {} if (current === operation) button.disabled = false; }
  });
}

function setupSql(root) {
  const input = $('#sql-input', root); const output = $('#sql-output', root);
  root.addEventListener('click', async (event) => {
    const actionName = event.target.closest('[data-action]')?.dataset.action;
    if (actionName === 'format-sql') { try { output.value = logic.formatSql(input.value, $('#sql-uppercase', root).checked); status(root, 'done', 'success'); } catch (error) { output.value = ''; status(root, friendlyError(error, 'sqlError'), 'error'); } }
    if (actionName === 'copy-sql') await copy(output.value, root);
    if (actionName === 'clear-sql') { input.value = ''; output.value = ''; status(root, 'sqlLocal'); input.focus(); }
  });
}

const setups = {
  'typing-speed-test': setupTyping, 'fraction-calculator': setupFractions, 'time-card-calculator': setupTimeCard,
  'online-timer': setupTimer, 'lorem-ipsum-generator': setupLorem, 'subnet-calculator': setupSubnet,
  'random-name-picker': setupNamePicker, 'fuel-cost-calculator': setupFuel, 'image-cropper': setupCropper,
  'pdf-to-image': setupPdfImages, 'sql-formatter': setupSql,
};
export function setupNewTool(id, root) { setups[id]?.(root); }
