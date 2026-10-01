import * as logic from './expanded-logic.mjs';

const localeBundle = window.usefulverseLocale ?? { messages: {}, runtime: {}, config: {} };
const language = document.documentElement.lang || 'en';
const languageTag = localeBundle.tag ?? language;
const t = (message) => localeBundle.runtime?.[message] ?? localeBundle.messages?.[message] ?? message;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const assetVersion = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => `${path}${assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : ''}`;
const objectUrls = new Set();
window.addEventListener('pagehide', () => objectUrls.forEach((url) => URL.revokeObjectURL(url)), { once: true });

function setStatus(root, message, type = '') {
  const status = $('#tool-status', root);
  if (!status) return;
  const translated = localeBundle.runtime?.[message] ?? localeBundle.messages?.[message];
  status.textContent = translated ?? (language === 'en' ? message : t(type === 'error' ? 'Check the values and try again.' : type === 'success' ? 'Done.' : 'Ready.'));
  status.className = `tool-status${type ? ` is-${type}` : ''}`;
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(languageTag, { maximumFractionDigits: 2, ...options }).format(value);
}

function localDateValue(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(value) {
  const date = logic.parseIsoDate(value);
  return new Intl.DateTimeFormat(languageTag, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

function copyText(value, root) {
  if (!value) return setStatus(root, 'Nothing to copy yet.', 'error');
  navigator.clipboard.writeText(value).then(
    () => setStatus(root, 'Copied.', 'success'),
    () => setStatus(root, 'Copy failed. Select and copy the result manually.', 'error'),
  );
}

function safeBaseName(name) {
  const base = String(name).replace(/\.[^.]+$/u, '').normalize('NFKC')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 80);
  return base || 'image';
}

const imageExtensions = new Set(['jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp', 'png', 'apng', 'webp', 'heic', 'heif', 'avif', 'bmp', 'gif', 'svg', 'ico', 'cur', 'tif', 'tiff']);
const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/apng', 'image/webp', 'image/heic', 'image/heif', 'image/avif', 'image/bmp', 'image/x-ms-bmp', 'image/gif', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon', 'image/tiff']);
const outputExtensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function imageExtension(file) {
  return file.name.split('.').pop()?.toLowerCase() ?? '';
}

function isSupportedImage(file) {
  return imageMimeTypes.has(file.type.toLowerCase()) || imageExtensions.has(imageExtension(file));
}

function isHeic(file) {
  return /\.(?:heic|heif)$/iu.test(file.name) || ['image/heic', 'image/heif'].includes(file.type.toLowerCase());
}

function isTiff(file) {
  return /\.(?:tif|tiff)$/iu.test(file.name) || file.type.toLowerCase() === 'image/tiff';
}

async function decodeBitmap(blob) {
  try { return await createImageBitmap(blob, { imageOrientation: 'from-image' }); }
  catch {
    try { return await createImageBitmap(blob); }
    catch {
      const url = URL.createObjectURL(blob);
      try {
        const image = new Image();
        image.src = url;
        if (typeof image.decode === 'function') await image.decode();
        else await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
        try { return await createImageBitmap(image); }
        catch { return image; }
      } finally { URL.revokeObjectURL(url); }
    }
  }
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
  return decodeBitmap(image);
}

function makeObjectUrl(blob) {
  const url = URL.createObjectURL(blob);
  objectUrls.add(url);
  return url;
}

function clearDownloadLinks(container) {
  if (!container) return;
  for (const link of container.querySelectorAll('a.file-download')) {
    if (objectUrls.has(link.href)) {
      URL.revokeObjectURL(link.href);
      objectUrls.delete(link.href);
    }
  }
  container.replaceChildren();
}

function makeDownloadLink(container, blob, filename) {
  const link = document.createElement('a');
  link.className = 'button button--ghost file-download';
  link.href = makeObjectUrl(blob);
  link.download = filename;
  link.textContent = `${t('Download')} · ${logic.formatFileSize(blob.size, languageTag)}`;
  container.append(link);
  return link;
}

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

let yamlPromise;
function loadYaml() {
  yamlPromise ??= import(versioned('/assets/vendor/js-yaml.mjs'));
  return yamlPromise;
}

function setupAgeCalculator(root) {
  const birthInput = $('#age-birth', root);
  const asOfInput = $('#age-as-of', root);
  const resultIds = ['age-years', 'age-months', 'age-days', 'age-total-days', 'age-next-birthday', 'age-birthday-countdown'];
  asOfInput.value = localDateValue();
  asOfInput.max = '9998-12-31';
  birthInput.max = '9998-12-31';
  const calculate = () => {
    try {
      if (!birthInput.value || !asOfInput.value) throw new TypeError('Enter both dates to calculate an age.');
      const result = logic.calculateAge(birthInput.value, asOfInput.value, $('#age-leap-policy', root).value);
      $('#age-years', root).textContent = formatNumber(result.years);
      $('#age-months', root).textContent = formatNumber(result.months);
      $('#age-days', root).textContent = formatNumber(result.days);
      $('#age-total-days', root).textContent = formatNumber(result.totalDays);
      $('#age-next-birthday', root).textContent = formatDate(result.nextBirthday);
      const countdown = Math.round((logic.parseIsoDate(result.nextBirthday) - logic.parseIsoDate(asOfInput.value)) / 86_400_000);
      $('#age-birthday-countdown', root).textContent = formatNumber(countdown);
      $('#age-exact', root).textContent = `${formatNumber(result.years)} ${t('Years')}, ${formatNumber(result.months)} ${t('Months')}, ${formatNumber(result.days)} ${t('Days')}`;
      setStatus(root, 'Age calculated.', 'success');
    } catch (error) {
      resultIds.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      $('#age-exact', root).textContent = '—';
      setStatus(root, error.message === 'The calculation date cannot be before the birth date.' ? 'Calculation date cannot be before date of birth.' : 'Enter valid dates to calculate age.', 'error');
    }
  };
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-age') calculate();
    if (action === 'clear') {
      birthInput.value = '';
      asOfInput.value = localDateValue();
      resultIds.forEach((id) => { $(`#${id}`, root).textContent = '—'; });
      $('#age-exact', root).textContent = '—';
      setStatus(root, 'Enter a birth date and select a calculation date.');
      birthInput.focus();
    }
  });
}

function setupBusinessDays(root) {
  const start = $('#business-start', root);
  const end = $('#business-end', root);
  const offset = $('#business-offset', root);
  const weekdayGroup = $('#business-weekend-days', root);
  const today = localDateValue();
  start.value = logic.addCalendarDays(today, -7);
  end.value = today;
  const defaultWeekend = [0, 6];
  const monday = logic.parseIsoDate('2026-01-05');
  for (let index = 0; index < 7; index += 1) {
    const date = new Date(monday);
    date.setUTCDate(date.getUTCDate() + index);
    const day = date.getUTCDay();
    const label = new Intl.DateTimeFormat(languageTag, { weekday: 'short', timeZone: 'UTC' }).format(date);
    const wrapper = document.createElement('label');
    wrapper.className = 'day-option';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = String(day);
    checkbox.checked = defaultWeekend.includes(day);
    checkbox.dataset.weekendDay = '';
    const text = document.createElement('span');
    text.textContent = label;
    wrapper.append(checkbox, text);
    weekdayGroup.append(wrapper);
  }
  let mode = 'between';
  const setMode = (nextMode) => {
    mode = nextMode;
    $$('[data-business-mode]', root).forEach((button) => {
      const selected = button.dataset.businessMode === mode;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    $('#business-end-fields', root).hidden = mode !== 'between';
    $('#business-inclusive-wrap', root).hidden = mode !== 'between';
    $('#business-offset-fields', root).hidden = mode !== 'add';
    $('#business-result-label', root).textContent = t(mode === 'between' ? 'Business days' : 'Result date');
    setStatus(root, mode === 'between' ? 'Choose dates and your workweek.' : 'Enter a start date and a workday amount.');
  };
  const selectedWeekendDays = () => $$('[data-weekend-day]:checked', root).map((input) => Number(input.value));
  const enteredHolidays = () => $('#business-holidays', root).value.split(/\r?\n/u).map((value) => value.trim()).filter(Boolean);
  root.addEventListener('click', (event) => {
    const modeButton = event.target.closest('[data-business-mode]');
    if (modeButton) setMode(modeButton.dataset.businessMode);
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'calculate-business-days') {
      try {
        if (!start.value) throw new TypeError('Choose a start date.');
        const weekends = selectedWeekendDays();
        const holidays = enteredHolidays();
        if (mode === 'between') {
          if (!end.value) throw new TypeError('Choose an end date.');
          const result = logic.countBusinessDays(start.value, end.value, weekends, holidays, $('#business-inclusive', root).checked);
          $('#business-result', root).textContent = formatNumber(result);
          $('#business-result-label', root).textContent = t('Business days');
          setStatus(root, 'Business days calculated.', 'success');
        } else {
          const count = Number(offset.value);
          const result = logic.addBusinessDays(start.value, count, weekends, holidays);
          $('#business-result', root).textContent = formatDate(result);
          $('#business-result-label', root).textContent = t('Result date');
          setStatus(root, 'Result date calculated.', 'success');
        }
      } catch (error) {
        $('#business-result', root).textContent = '—';
        const message = error.message.includes('holiday') || error.message.includes('calendar date') ? 'Check holiday dates. Use YYYY-MM-DD, one per line.'
          : error.message.includes('working day') ? 'Choose at least one workday.'
            : error.message.includes('end date') ? 'End date must be on or after start date.'
              : error.message.includes('whole number') ? 'Enter a whole number from -100,000 to 100,000.'
                : 'Check the dates and workday amount.';
        setStatus(root, message, 'error');
      }
    }
    if (action === 'clear') {
      start.value = today;
      end.value = today;
      offset.value = '10';
      $('#business-holidays', root).value = '';
      $('#business-inclusive', root).checked = true;
      $$('[data-weekend-day]', root).forEach((input) => { input.checked = defaultWeekend.includes(Number(input.value)); });
      $('#business-result', root).textContent = '—';
      setMode('between');
    }
  });
}

function setupImageToPdf(root) {
  const input = $('#images-pdf-files', root);
  const cameraInput = $('#images-pdf-camera', root);
  const list = $('#images-pdf-list', root);
  const downloads = $('#images-pdf-downloads', root);
  const createButton = $('[data-action="create-images-pdf"]', root);
  const cameraButton = $('[data-action="capture-image"]', root);
  let files = [];
  let operation = 0;
  let generating = false;
  const limits = { count: 20, pixels: 20_000_000 };
  const renderList = () => {
    list.replaceChildren(...files.map((file, index) => {
      const item = document.createElement('li');
      item.className = 'tool-file-item';
      const name = document.createElement('span');
      name.textContent = `${index + 1}. ${file.name} · ${logic.formatFileSize(file.size, languageTag)}`;
      const controls = document.createElement('span');
      controls.className = 'tool-file-controls';
      for (const [action, label, disabled] of [
        ['move-image-up', 'Move up', index === 0],
        ['move-image-down', 'Move down', index === files.length - 1],
        ['remove-image', 'Remove', false],
      ]) {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'button button--ghost'; button.dataset.action = action; button.dataset.index = String(index); button.textContent = t(label); button.disabled = disabled || generating;
        controls.append(button);
      }
      item.append(name, controls);
      return item;
    }));
    $('#images-pdf-meta', root).textContent = files.length ? `${formatNumber(files.length)} ${t('images ready in page order')} · ${logic.formatFileSize(files.reduce((sum, file) => sum + file.size, 0), languageTag)}` : t('Add up to 20 images. No fixed file-size cap; 20 megapixels per image. Large batches depend on your device memory.');
    createButton.disabled = files.length === 0 || generating;
    cameraButton.disabled = generating || files.length >= limits.count;
    cameraInput.disabled = generating || files.length >= limits.count;
  };
  const appendImages = (incoming) => {
    if (!incoming.length) return;
    operation += 1;
    clearDownloadLinks(downloads);
    const accepted = incoming.filter(isSupportedImage);
    const next = [...files, ...accepted];
    if (next.length > limits.count) {
      setStatus(root, t('Choose up to 20 images.'), 'error');
    } else {
      files = next;
      const allAccepted = accepted.length === incoming.length;
      setStatus(root, allAccepted ? (incoming.length === 1 ? t('Photo added. Review the page order below.') : 'Images added. Reorder pages below.') : 'Some files were skipped. Use a supported image format within the on-page limits.', allAccepted ? 'success' : 'error');
    }
    renderList();
  };
  input.addEventListener('change', () => {
    appendImages([...input.files]);
    input.value = '';
  });
  cameraInput.addEventListener('change', () => {
    appendImages([...cameraInput.files]);
    cameraInput.value = '';
  });
  root.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const index = Number(button.dataset.index);
    if (action === 'capture-image') {
      if (files.length >= limits.count) return setStatus(root, t('Choose up to 20 images.'), 'error');
      try { cameraInput.click(); }
      catch { setStatus(root, t('Camera could not be opened. Choose images above instead.'), 'error'); }
      return;
    }
    if (action === 'move-image-up' && index > 0) [files[index - 1], files[index]] = [files[index], files[index - 1]];
    if (action === 'move-image-down' && index < files.length - 1) [files[index + 1], files[index]] = [files[index], files[index + 1]];
    if (action === 'remove-image') files.splice(index, 1);
    if (['move-image-up', 'move-image-down', 'remove-image'].includes(action)) renderList();
    if (action === 'create-images-pdf') {
      if (!files.length) return setStatus(root, 'Choose images first.', 'error');
      const run = ++operation;
      generating = true;
      input.disabled = true;
      renderList();
      clearDownloadLinks(downloads);
      setStatus(root, 'Creating PDF on your device…');
      try {
        const { PDFDocument } = await loadVendorScript('pdf-lib.min.js', 'PDFLib');
        if (run !== operation) return;
        const pdf = await PDFDocument.create();
        const pageSize = $('#images-pdf-size', root).value;
        const orientation = $('#images-pdf-orientation', root).value;
        const margin = Number($('#images-pdf-margin', root).value);
        for (const [fileIndex, file] of files.entries()) {
          if (run !== operation) return;
          setStatus(root, 'Adding image pages…');
          let bitmap;
          let canvas;
          try {
            bitmap = await decodeImageFile(file, limits.pixels);
            if (bitmap.width * bitmap.height > limits.pixels) throw new RangeError('An image has more than 20 megapixels. Choose a smaller image.');
            let embedded;
            canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
            const context = canvas.getContext('2d', { alpha: false });
            if (!context) throw new Error('The browser could not prepare an image page.');
            context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(bitmap, 0, 0);
            const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('The browser could not prepare an image page.')), 'image/jpeg', 0.92));
            embedded = await pdf.embedJpg(await blob.arrayBuffer());
            let dimensions;
            if (pageSize === 'a4') dimensions = [595.28, 841.89];
            else if (pageSize === 'letter') dimensions = [612, 792];
            else {
              const factor = 842 / Math.max(bitmap.width, bitmap.height);
              dimensions = [bitmap.width * factor, bitmap.height * factor];
            }
            let [pageWidth, pageHeight] = dimensions;
            const wide = bitmap.width > bitmap.height;
            if (orientation === 'landscape' && pageWidth < pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth];
            if (orientation === 'portrait' && pageWidth > pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth];
            if (pageSize === 'fit') {
              dimensions = orientation === 'landscape' && pageWidth < pageHeight || orientation === 'portrait' && pageWidth > pageHeight ? [pageHeight, pageWidth] : [pageWidth, pageHeight];
              [pageWidth, pageHeight] = dimensions;
            } else if (orientation === 'auto' && wide && pageWidth < pageHeight) [pageWidth, pageHeight] = [pageHeight, pageWidth];
            const page = pdf.addPage([pageWidth, pageHeight]);
            const availableWidth = Math.max(1, pageWidth - margin * 2);
            const availableHeight = Math.max(1, pageHeight - margin * 2);
            const scale = Math.min(availableWidth / embedded.width, availableHeight / embedded.height, 1);
            const drawWidth = embedded.width * scale;
            const drawHeight = embedded.height * scale;
            page.drawImage(embedded, { x: (pageWidth - drawWidth) / 2, y: (pageHeight - drawHeight) / 2, width: drawWidth, height: drawHeight });
          } finally {
            bitmap?.close?.();
            if (canvas) { canvas.width = 1; canvas.height = 1; }
          }
          if (fileIndex % 5 === 4) await new Promise((resolve) => setTimeout(resolve, 0));
        }
        if (run !== operation) return;
        const bytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
        makeDownloadLink(downloads, new Blob([bytes], { type: 'application/pdf' }), 'images-to-pdf.pdf');
        setStatus(root, 'PDF ready. Original images are unchanged.', 'success');
      } catch (error) {
        if (run === operation) setStatus(root, error.message.includes('megapixels') ? 'Image exceeds 20 megapixels. Choose a smaller image.' : error.message.includes('PDF') ? 'The PDF library did not load. Check your connection and retry.' : 'Could not add an image to the PDF. Try another image or fewer files.', 'error');
      } finally {
        if (run === operation) {
          generating = false;
          input.disabled = false;
          renderList();
        }
      }
    }
    if (action === 'clear') {
      operation += 1; generating = false; input.disabled = false; cameraInput.disabled = false; files = []; input.value = ''; cameraInput.value = ''; renderList(); clearDownloadLinks(downloads);
      setStatus(root, 'Each image becomes a page in the order shown.');
    }
  });
  renderList();
}

function setupFaviconGenerator(root) {
  const input = $('#favicon-file', root);
  const canvas = $('#favicon-preview', root);
  const context = canvas.getContext('2d');
  const snippet = $('#favicon-snippet', root);
  const appNameInput = $('#favicon-app-name', root);
  const downloads = $('#favicon-downloads', root);
  let bitmap = null;
  let svgUrl = null;
  appNameInput.value = t('My website');

  async function readSvg(file) {
    const source = await file.text();
    const parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
    if (parsed.querySelector('parsererror') || parsed.documentElement.localName !== 'svg') throw new TypeError('This SVG file could not be read.');
    parsed.querySelectorAll('script,style,foreignObject,iframe,object,embed,image,audio,video,animate,set,animateTransform').forEach((element) => element.remove());
    for (const element of parsed.querySelectorAll('*')) for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith('on') || name === 'style' || ((name === 'href' || name.endsWith(':href')) && value && !value.startsWith('#')) || /url\s*\(/iu.test(value)) element.removeAttribute(attribute.name);
    }
    const svgBlob = new Blob([new XMLSerializer().serializeToString(parsed.documentElement)], { type: 'image/svg+xml' });
    svgUrl = makeObjectUrl(svgBlob);
    return svgBlob;
  }

  function drawPreview() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!bitmap) return;
    const background = $('#favicon-background', root).value;
    if (background !== 'transparent') { context.fillStyle = background; context.fillRect(0, 0, canvas.width, canvas.height); }
    const padding = Number($('#favicon-padding', root).value) / 100;
    const maximum = canvas.width * (1 - 2 * padding);
    const scale = Math.min(maximum / bitmap.width, maximum / bitmap.height);
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    context.drawImage(bitmap, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  }

  input.addEventListener('change', async () => {
    bitmap?.close?.(); bitmap = null;
    if (svgUrl) { URL.revokeObjectURL(svgUrl); objectUrls.delete(svgUrl); svgUrl = null; }
    clearDownloadLinks(downloads); snippet.value = '';
    const file = input.files[0];
    $('#favicon-file-meta', root).textContent = file ? `${file.name} · ${logic.formatFileSize(file.size, languageTag)}` : t('PNG, JPG, WebP or SVG · up to 10 MB. A square image works best.');
    if (!file) { drawPreview(); return; }
    if (file.size > 10 * 1024 * 1024) { input.value = ''; $('#favicon-file-meta', root).textContent = t('PNG, JPG, WebP or SVG · up to 10 MB. A square image works best.'); return setStatus(root, 'Choose an image under 10 MB.', 'error'); }
    try {
      const source = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg') ? await readSvg(file) : file;
      bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
      if (bitmap.width * bitmap.height > 40_000_000) throw new RangeError('This image has more than 40 megapixels.');
      drawPreview();
      setStatus(root, 'Image ready. Adjust options or create your favicon files.', 'success');
    } catch {
      bitmap?.close?.(); bitmap = null; drawPreview();
      setStatus(root, 'Could not open the image. Choose a valid PNG, JPG, WebP or SVG.', 'error');
    }
  });
  for (const selector of ['#favicon-padding', '#favicon-background']) $(selector, root).addEventListener('input', () => {
    $('#favicon-padding-value', root).textContent = `${$('#favicon-padding', root).value}%`;
    drawPreview();
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'copy-favicon-snippet') return copyText(snippet.value, root);
    if (action === 'generate-favicon') {
      if (!bitmap) return setStatus(root, 'Choose an image first.', 'error');
      clearDownloadLinks(downloads);
      setStatus(root, 'Creating icons on your device…');
      try {
        const sizes = [16, 32, 48, 180, 192, 512];
        const images = [];
        const files = [];
        const background = $('#favicon-background', root).value;
        const padding = Number($('#favicon-padding', root).value) / 100;
        for (const size of sizes) {
          const outputCanvas = document.createElement('canvas'); outputCanvas.width = size; outputCanvas.height = size;
          const outputContext = outputCanvas.getContext('2d');
          if (!outputContext) throw new Error('Canvas is not available.');
          if (background !== 'transparent') { outputContext.fillStyle = background; outputContext.fillRect(0, 0, size, size); }
          const maxDimension = size * (1 - padding * 2);
          const scale = Math.min(maxDimension / bitmap.width, maxDimension / bitmap.height);
          const width = bitmap.width * scale; const height = bitmap.height * scale;
          outputContext.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
          const blob = await new Promise((resolve, reject) => outputCanvas.toBlob((value) => value ? resolve(value) : reject(new Error('An icon image could not be created.')), 'image/png'));
          const bytes = new Uint8Array(await blob.arrayBuffer());
          images.push({ size, bytes });
          files.push({ name: `favicon-${size}x${size}.png`, data: bytes });
          outputCanvas.width = 1; outputCanvas.height = 1;
        }
        files.push({ name: 'favicon.ico', data: logic.buildIco(images.slice(0, 3)) });
        files.push({ name: 'apple-touch-icon.png', data: files.find((file) => file.name === 'favicon-180x180.png').data });
        const appName = appNameInput.value.trim().slice(0, 50) || t('My website');
        const shortName = $('#favicon-short-name', root).value.trim().slice(0, 20) || appName.slice(0, 12);
        const manifest = { name: appName, short_name: shortName, icons: [192, 512].map((size) => ({ src: `/favicon-${size}x${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })) };
        const html = '<link rel="icon" type="image/x-icon" href="/favicon.ico">\n<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">';
        snippet.value = html;
        files.push({ name: 'site.webmanifest', data: JSON.stringify(manifest, null, 2) });
        files.push({ name: 'favicon-html-snippet.html', data: html });
        files.push({ name: 'README.txt', data: 'Copy the generated icon files to your website public/root folder, then add the HTML snippet to your document head.\n' });
        const zip = await logic.buildZip(files);
        makeDownloadLink(downloads, new Blob([zip], { type: 'application/zip' }), 'favicon-package.zip');
        setStatus(root, 'Favicon package ready.', 'success');
      } catch {
        setStatus(root, 'Could not create the icon files. Try another image.', 'error');
      }
    }
    if (action === 'clear') {
      input.value = ''; bitmap?.close?.(); bitmap = null;
      if (svgUrl) { URL.revokeObjectURL(svgUrl); objectUrls.delete(svgUrl); svgUrl = null; }
      context.clearRect(0, 0, canvas.width, canvas.height);
      $('#favicon-file-meta', root).textContent = t('PNG, JPG, WebP or SVG · up to 10 MB. A square image works best.');
      $('#favicon-padding', root).value = '10'; $('#favicon-padding-value', root).textContent = '10%';
      $('#favicon-background', root).value = 'transparent'; appNameInput.value = t('My website'); $('#favicon-short-name', root).value = '';
      snippet.value = ''; clearDownloadLinks(downloads); setStatus(root, 'Choose an image to preview the generated icons.');
    }
  });
  window.addEventListener('pagehide', () => bitmap?.close?.(), { once: true });
}

function setupImageFormatConverter(root) {
  const input = $('#image-convert-files', root);
  const output = $('#image-convert-format', root);
  const quality = $('#image-convert-quality', root);
  const convertButton = $('[data-action="convert-images"]', root);
  const downloads = $('#image-convert-downloads', root);
  const previews = $('#image-convert-preview', root);
  let files = [];
  let converted = [];
  let operation = 0;
  const maxFiles = 20;
  const clearResults = () => {
    clearDownloadLinks(downloads);
    for (const image of previews.querySelectorAll('img[data-object-url]')) {
      const url = image.dataset.objectUrl;
      if (objectUrls.has(url)) { URL.revokeObjectURL(url); objectUrls.delete(url); }
    }
    previews.replaceChildren(); previews.hidden = true; converted = [];
  };
  quality.addEventListener('input', () => {
    $('#image-convert-quality-value', root).textContent = `${quality.value}%`;
    quality.disabled = output.value === 'image/png';
  });
  output.addEventListener('change', () => { quality.disabled = output.value === 'image/png'; });
  input.addEventListener('change', () => {
    operation += 1; clearResults();
    const incoming = [...input.files];
    const supported = incoming.filter(isSupportedImage);
    if (supported.length > maxFiles) {
      files = [];
      setStatus(root, t('Choose up to 20 images.'), 'error');
    } else {
      files = supported;
      setStatus(root, supported.length === incoming.length && supported.length ? 'Images ready. Choose a format and convert them on your device.' : 'Some files were skipped. Use a supported image format within the on-page limits.', supported.length ? 'success' : 'error');
    }
    $('#image-convert-meta', root).textContent = files.length ? `${formatNumber(files.length)} ${t('images ready to convert')} · ${logic.formatFileSize(files.reduce((sum, file) => sum + file.size, 0), languageTag)}` : t('Convert common image formats to JPG, PNG or WebP on your device. Up to 20 files.');
    input.value = '';
  });
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-images') {
      if (!files.length) return setStatus(root, 'Choose images first.', 'error');
      const run = ++operation;
      clearResults();
      const type = output.value;
      const backgroundChoice = $('#image-convert-background', root).value;
      const button = convertButton;
      const clearButton = $('[data-action="clear"]', root);
      button.disabled = true; clearButton.disabled = true;
      const results = [];
      try {
        for (const [index, file] of files.entries()) {
          if (run !== operation) return;
          let bitmap;
          let canvas;
          try {
            if (isHeic(file)) setStatus(root, 'Loading the HEIC decoder…');
            setStatus(root, 'Converting images on your device…');
            bitmap = await decodeImageFile(file, 20_000_000);
            if (bitmap.width * bitmap.height > 20_000_000) throw new RangeError('An image has more than 20 megapixels.');
            canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
            const alpha = type !== 'image/jpeg' && backgroundChoice === 'transparent';
            const context = canvas.getContext('2d', { alpha });
            if (!context) throw new Error('The browser could not create an image canvas.');
            if (!alpha) { context.fillStyle = backgroundChoice === 'transparent' ? '#ffffff' : backgroundChoice; context.fillRect(0, 0, canvas.width, canvas.height); }
            context.drawImage(bitmap, 0, 0);
            const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('This image format is not supported in this browser.')), type, Number(quality.value) / 100));
            if (blob.type !== type) throw new Error('The browser does not support this output format.');
            results.push({ name: `${safeBaseName(file.name)}.${outputExtensions[type]}`, blob });
          } finally {
            bitmap?.close?.();
            if (canvas) { canvas.width = 1; canvas.height = 1; }
          }
          if (index % 2 === 1) await new Promise((resolve) => setTimeout(resolve, 0));
        }
        if (run !== operation) return;
        converted = results;
        const extension = outputExtensions[type];
        if (results.length === 1) makeDownloadLink(downloads, results[0].blob, results[0].name);
        else {
          const archive = await logic.buildZip(results.map(({ name, blob }) => ({ name, data: blob })));
          makeDownloadLink(downloads, new Blob([archive], { type: 'application/zip' }), `converted-images-${extension}.zip`);
        }
        const previewed = results.slice(0, 6);
        for (const item of previewed) {
          const figure = document.createElement('figure'); figure.className = 'image-convert-item';
          const image = document.createElement('img'); image.alt = item.name; image.loading = 'lazy';
          image.src = makeObjectUrl(item.blob); image.dataset.objectUrl = image.src;
          const caption = document.createElement('figcaption'); caption.textContent = `${item.name} · ${logic.formatFileSize(item.blob.size, languageTag)}`;
          figure.append(image, caption); previews.append(figure);
        }
        previews.hidden = false;
        setStatus(root, 'Images converted. Animated files become a still frame; metadata is not copied.', 'success');
      } catch (error) {
        clearResults();
        const message = error.message.includes('20 megapixels') ? 'Image exceeds 20 megapixels. Choose a smaller image.'
          : error.message.includes('output format') ? 'The browser does not support the selected output format.'
            : 'This image could not be decoded by your browser. Try another file or browser.';
        setStatus(root, message, 'error');
      } finally { button.disabled = false; clearButton.disabled = false; }
    }
    if (action === 'clear') {
      operation += 1; files = []; input.value = ''; clearResults();
      $('#image-convert-meta', root).textContent = t('Convert common image formats to JPG, PNG or WebP on your device. Up to 20 files.');
      quality.value = '88'; $('#image-convert-quality-value', root).textContent = '88%';
      output.value = 'image/jpeg'; $('#image-convert-background', root).value = '#ffffff';
      setStatus(root, 'Original images are unchanged and never uploaded.');
    }
  });
}

function setupMarkdownHtml(root) {
  const input = $('#markdown-input', root);
  const output = $('#markdown-output', root);
  const preview = $('#markdown-preview', root);
  const options = $('#markdown-options', root);
  let mode = 'markdown-html';
  const updateDirection = () => {
    const markdownToHtml = mode === 'markdown-html';
    $('#markdown-input-label', root).textContent = t(markdownToHtml ? 'Markdown input' : 'HTML input');
    $('#markdown-output-label', root).textContent = t(markdownToHtml ? 'HTML output' : 'Markdown output');
    input.placeholder = t(markdownToHtml ? 'Paste Markdown here…' : 'Paste HTML here…');
    options.hidden = !markdownToHtml;
    preview.hidden = true;
    output.value = '';
    $$('[data-markdown-mode]', root).forEach((button) => {
      const selected = button.dataset.markdownMode === mode;
      button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected));
    });
  };
  root.addEventListener('click', async (event) => {
    const modeButton = event.target.closest('[data-markdown-mode]');
    if (modeButton) { mode = modeButton.dataset.markdownMode; updateDirection(); setStatus(root, 'Ready. Conversion and preview run on this device.'); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-markdown-html') {
      if (!input.value.trim()) return setStatus(root, 'Paste text before converting.', 'error');
      if (input.value.length > 500_000) return setStatus(root, 'Keep the input under 500 KB.', 'error');
      const button = $('[data-action="convert-markdown-html"]', root); button.disabled = true;
      try {
        const [domPurify] = await Promise.all([loadVendorScript('purify.min.js', 'DOMPurify')]);
        if (mode === 'markdown-html') {
          const markdown = await loadVendorScript('marked.umd.js', 'marked');
          const rawHtml = markdown.parse(input.value, { gfm: $('#markdown-gfm', root).checked, breaks: $('#markdown-breaks', root).checked });
          const cleanHtml = domPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
          output.value = cleanHtml;
          const previewHtml = domPurify.sanitize(rawHtml, { USE_PROFILES: { html: true }, FORBID_ATTR: ['href', 'src', 'action', 'formaction'] });
          const policy = "default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'";
          preview.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{font:16px/1.6 system-ui,sans-serif;color:#202124;margin:1rem;overflow-wrap:anywhere}pre{overflow:auto;padding:.75rem;background:#f2f3f5}img{max-width:100%}</style></head><body>${previewHtml}</body></html>`;
          preview.hidden = false;
        } else {
          await loadVendorScript('turndown.browser.umd.js', 'TurndownService');
          const fragment = domPurify.sanitize(input.value, { RETURN_DOM_FRAGMENT: true, USE_PROFILES: { html: true } });
          const container = document.createElement('div'); container.append(fragment);
          const converter = new window.TurndownService({ headingStyle: 'atx', bulletListMarker: '-' });
          output.value = converter.turndown(container);
          preview.hidden = true;
        }
        setStatus(root, 'Conversion complete.', 'success');
      } catch { output.value = ''; preview.hidden = true; setStatus(root, 'Could not convert the text. Check its format and try again.', 'error'); }
      finally { button.disabled = false; }
    }
    if (action === 'copy-markdown-output') copyText(output.value, root);
    if (action === 'download-markdown-output') {
      if (!output.value) return setStatus(root, 'Convert the text before downloading.', 'error');
      const ext = mode === 'markdown-html' ? 'html' : 'md';
      const downloads = $('#markdown-downloads', root);
      clearDownloadLinks(downloads);
      makeDownloadLink(downloads, new Blob([output.value], { type: ext === 'html' ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8' }), `converted.${ext}`);
      setStatus(root, 'Download ready.', 'success');
    }
    if (action === 'clear') { input.value = ''; output.value = ''; preview.srcdoc = ''; preview.hidden = true; clearDownloadLinks($('#markdown-downloads', root)); setStatus(root, 'Ready. Conversion and preview run on this device.'); input.focus(); }
  });
}

function setupJsonYaml(root) {
  const input = $('#json-yaml-input', root);
  const output = $('#json-yaml-output', root);
  const note = $('#json-yaml-note', root);
  let mode = 'json-yaml';
  const updateDirection = () => {
    const jsonToYaml = mode === 'json-yaml';
    $('#json-yaml-input-label', root).textContent = t(jsonToYaml ? 'JSON input' : 'YAML input');
    $('#json-yaml-output-label', root).textContent = t(jsonToYaml ? 'YAML output' : 'JSON output');
    input.placeholder = jsonToYaml ? '{"name":"UsefulVerse","fast":true}' : 'name: UsefulVerse\nfast: true';
    note.hidden = jsonToYaml;
    output.value = '';
    $$('[data-json-yaml-mode]', root).forEach((button) => {
      const selected = button.dataset.jsonYamlMode === mode;
      button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected));
    });
  };
  root.addEventListener('click', async (event) => {
    const modeButton = event.target.closest('[data-json-yaml-mode]');
    if (modeButton) { mode = modeButton.dataset.jsonYamlMode; updateDirection(); setStatus(root, 'JSON and YAML are processed on this device.'); }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'convert-json-yaml') {
      if (!input.value.trim()) return setStatus(root, 'Paste text before converting.', 'error');
      if (input.value.length > 500_000) return setStatus(root, 'Keep the input under 500 KB.', 'error');
      const button = $('[data-action="convert-json-yaml"]', root); button.disabled = true;
      try {
        const yaml = await loadYaml();
        if (mode === 'json-yaml') {
          const value = JSON.parse(input.value);
          output.value = yaml.dump(value, { noRefs: true, sortKeys: false, lineWidth: -1, noCompatMode: true });
        } else {
          const value = yaml.load(input.value, { schema: yaml.JSON_SCHEMA, maxAliasCount: 50 });
          const json = JSON.stringify(value, null, 2);
          if (json === undefined) throw new TypeError('The YAML value cannot be represented as JSON.');
          output.value = json;
        }
        setStatus(root, 'Conversion complete.', 'success');
      } catch (error) {
        output.value = '';
        setStatus(root, error instanceof SyntaxError ? 'Check JSON brackets, commas and quoted strings.' : 'Invalid JSON or YAML. Check indentation, quotes and data types.', 'error');
      } finally { button.disabled = false; }
    }
    if (action === 'copy-json-yaml') copyText(output.value, root);
    if (action === 'download-json-yaml') {
      if (!output.value) return setStatus(root, 'Convert the text before downloading.', 'error');
      const extension = mode === 'json-yaml' ? 'yaml' : 'json';
      const downloads = $('#json-yaml-downloads', root);
      clearDownloadLinks(downloads);
      makeDownloadLink(downloads, new Blob([output.value], { type: 'text/plain;charset=utf-8' }), `converted.${extension}`);
      setStatus(root, 'Download ready.', 'success');
    }
    if (action === 'clear') { input.value = ''; output.value = ''; clearDownloadLinks($('#json-yaml-downloads', root)); setStatus(root, 'JSON and YAML are processed on this device.'); input.focus(); }
  });
}

function setupOfficeFileCompressor(root) {
  const input = $('#office-package-file', root);
  const runButton = $('[data-action="compress-office-file"]', root);
  const cancelButton = $('[data-action="cancel-office-file"]', root);
  const downloads = $('#office-package-downloads', root);
  let selectedFile = null;
  let worker = null;
  let operation = 0;

  const setBusy = (busy) => {
    runButton.disabled = busy;
    cancelButton.disabled = !busy;
    input.disabled = busy;
  };
  const cancel = (announce = true) => {
    if (worker) worker.terminate();
    worker = null;
    operation += 1;
    setBusy(false);
    if (announce) setStatus(root, 'Processing canceled. Your original file is unchanged.');
  };

  input.addEventListener('change', () => {
    cancel(false);
    selectedFile = input.files?.[0] ?? null;
    clearDownloadLinks(downloads);
    if (!selectedFile) {
      $('#office-package-meta', root).textContent = t('Files stay on your device. Limits: 100 MB input, 200 MB expanded data and 5,000 package parts.');
      return setStatus(root, 'Processing runs locally in this browser. No upload.');
    }
    const extension = selectedFile.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['docx', 'xlsx', 'pptx'].includes(extension)) {
      selectedFile = null;
      input.value = '';
      $('#office-package-meta', root).textContent = t('Files stay on your device. Limits: 100 MB input, 200 MB expanded data and 5,000 package parts.');
      return setStatus(root, 'Choose a modern DOCX, XLSX or PPTX file.', 'error');
    }
    $('#office-package-meta', root).textContent = `${selectedFile.name} · ${logic.formatFileSize(selectedFile.size, languageTag)} · DOCX/XLSX/PPTX`;
    setStatus(root, 'Office file ready. The original will remain unchanged.');
  });

  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'cancel-office-file') return cancel(true);
    if (action === 'clear') {
      cancel(false);
      input.value = '';
      selectedFile = null;
      clearDownloadLinks(downloads);
      $('#office-package-meta', root).textContent = t('Files stay on your device. Limits: 100 MB input, 200 MB expanded data and 5,000 package parts.');
      return setStatus(root, 'Processing runs locally in this browser. No upload.');
    }
    if (action !== 'compress-office-file' || worker) return;
    if (!selectedFile) return setStatus(root, 'Choose a modern DOCX, XLSX or PPTX file.', 'error');
    if (selectedFile.size > 100 * 1024 * 1024) return setStatus(root, 'This file is larger than the 100 MB local processing limit.', 'error');
    if (typeof Worker !== 'function') return setStatus(root, 'This browser does not support local Office file processing.', 'error');

    const file = selectedFile;
    const currentOperation = ++operation;
    clearDownloadLinks(downloads);
    setBusy(true);
    setStatus(root, 'Recompressing the Office package on your device…');
    try {
      const bytes = await file.arrayBuffer();
      if (currentOperation !== operation) return;
      worker = new Worker(versioned('/assets/vendor/office-package-worker.mjs'), { type: 'module' });
      worker.onmessage = (message) => {
        if (currentOperation !== operation) return;
        worker?.terminate();
        worker = null;
        setBusy(false);
        const result = message.data;
        if (!result?.ok) return setStatus(root, result?.message || 'The file could not be safely recompressed. Your original has not changed.', 'error');
        if (!result.smaller) return setStatus(root, 'This package is already compact. No smaller download was created.');
        const type = {
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        }[result.extension];
        const blob = new Blob([result.bytes], { type });
        makeDownloadLink(downloads, blob, `${safeBaseName(file.name)}-compressed.${result.extension}`);
        setStatus(root, 'A smaller copy is ready. Compare it and keep your original.', 'success');
      };
      worker.onerror = () => {
        worker?.terminate();
        worker = null;
        setBusy(false);
        setStatus(root, 'The file could not be safely recompressed. Your original has not changed.', 'error');
      };
      worker.postMessage({ bytes, fileName: file.name }, [bytes]);
    } catch {
      if (currentOperation !== operation) return;
      worker?.terminate();
      worker = null;
      setBusy(false);
      setStatus(root, 'The file could not be safely recompressed. Your original has not changed.', 'error');
    }
  });

  window.addEventListener('pagehide', () => worker?.terminate(), { once: true });
}

const setups = {
  'age-calculator': setupAgeCalculator,
  'business-days-calculator': setupBusinessDays,
  'image-to-pdf': setupImageToPdf,
  'favicon-generator': setupFaviconGenerator,
  'image-format-converter': setupImageFormatConverter,
  'markdown-html-converter': setupMarkdownHtml,
  'json-yaml-converter': setupJsonYaml,
  'office-file-compressor': setupOfficeFileCompressor,
};

export function setupExpandedTool(id, root) {
  setups[id]?.(root);
}
