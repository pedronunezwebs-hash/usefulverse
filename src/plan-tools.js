import { createXlsx, readXlsxSheets } from './pdf-office.mjs';

const $ = (selector, root) => root.querySelector(selector);
const getBundle = () => globalThis.window?.usefulverseLocale ?? { runtime: {}, messages: {} };
const tr = (message) => getBundle().runtime?.[message] ?? getBundle().messages?.[message] ?? message;
const setStatus = (root, message, type = '') => { const node = $('#tool-status', root); if (node) { node.textContent = tr(message); node.className = `tool-status${type ? ` is-${type}` : ''}`; } };
const number = (selector, root) => Number(String($(selector, root)?.value ?? '').trim().replace(/,/gu, ''));
const output = (selector, root, value) => { const node = $(selector, root); if (node) node.textContent = value; };
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_MEDIA_FRAMES = 12;

function download(root, blob, name, type = blob.type) {
  const anchor = document.createElement('a'); const url = URL.createObjectURL(blob);
  anchor.href = url; anchor.download = name; anchor.hidden = true; root.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return type;
}

function safeName(name, extension) {
  const stem = String(name || 'usefulverse-result').replace(/\.[^.]*$/u, '').replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/gu, '').slice(0, 70) || 'usefulverse-result';
  return `${stem}${extension}`;
}

export function parseWholeNumbers(value) {
  const normalized = String(value).normalize('NFKC').replace(/[٠-٩]/gu, (d) => String(d.codePointAt(0) - 0x660)).replace(/[۰-۹]/gu, (d) => String(d.codePointAt(0) - 0x6f0));
  const fields = normalized.split(/[\s,;]+/u).filter(Boolean);
  if (fields.length < 2 || fields.length > 100) throw new RangeError(tr('Enter 2 to 100 whole numbers.'));
  if (fields.some((item) => !/^[+-]?\d{1,1000}$/u.test(item))) throw new TypeError(tr('Use whole numbers only.'));
  return fields.map(BigInt);
}
export function gcd(a, b) { let x = a < 0n ? -a : a; let y = b < 0n ? -b : b; while (y) [x, y] = [y, x % y]; return x; }
export function gcdAll(values) { return values.reduce((a, b) => gcd(a, b)); }
export function lcmAll(values) {
  let result = values[0] < 0n ? -values[0] : values[0];
  for (const value of values.slice(1)) {
    const current = value < 0n ? -value : value;
    if (result === 0n || current === 0n) { result = 0n; continue; }
    result = (result / gcd(result, current)) * current;
    if (result.toString().length > 1000) throw new RangeError(tr('The least common multiple is too large to display.'));
  }
  return result;
}

export function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && !cell) quoted = true;
    else if (char === ',') { row.push(cell); cell = ''; }
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
    if (rows.length > 100_000 || row.length > 200 || text.length > 20_000_000) throw new RangeError(tr('This CSV exceeds the local safety limits.'));
  }
  if (quoted) throw new TypeError(tr('The CSV has an unclosed quoted field.'));
  if (cell || row.length || !rows.length) { row.push(cell); rows.push(row); }
  return rows;
}
export function csvText(rows) {
  return rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\r\n]/u.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }).join(',')).join('\r\n');
}

function parseTime(value) {
  const match = /^(\d{1,2}):(\d{2}):(\d{2})[,.](\d{1,3})$/u.exec(value);
  if (!match) throw new TypeError(tr('A subtitle time is not valid.'));
  const [, h, m, s, ms] = match; const hour = Number(h); const minute = Number(m); const second = Number(s);
  if (minute > 59 || second > 59 || hour > 99) throw new TypeError(tr('A subtitle time is not valid.'));
  return ((hour * 3600 + minute * 60 + second) * 1000) + Number(ms.padEnd(3, '0'));
}
function timeText(value, format) {
  const safe = Math.max(0, Math.round(value)); const hours = Math.floor(safe / 3_600_000); const minutes = Math.floor(safe / 60_000) % 60; const seconds = Math.floor(safe / 1000) % 60; const ms = safe % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}${format === 'vtt' ? '.' : ','}${String(ms).padStart(3, '0')}`;
}
export function convertSubtitles(text, outputFormat, shift) {
  const normalized = text.replace(/^\uFEFF/u, '').replace(/\r/g, '').trim();
  const blocks = normalized.replace(/^WEBVTT[^\n]*\n+/u, '').split(/\n{2,}/u).filter(Boolean);
  const cues = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const timeIndex = lines.findIndex((line) => line.includes('-->'));
    if (timeIndex < 0) continue;
    const match = /^\s*(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/u.exec(lines[timeIndex]);
    if (!match) throw new TypeError(tr('A subtitle cue has invalid timing.'));
    const start = parseTime(match[1]) + shift; const end = parseTime(match[2]) + shift;
    if (start < 0 || end < start) throw new RangeError(tr('The time shift would make a cue invalid.'));
    cues.push({ id: lines.slice(0, timeIndex).join('\n'), start, end, text: lines.slice(timeIndex + 1).join('\n') });
    if (cues.length > 10_000) throw new RangeError(tr('This subtitle file contains too many cues.'));
  }
  if (!cues.length) throw new TypeError(tr('No subtitle cues were found.'));
  return outputFormat === 'vtt'
    ? `WEBVTT\n\n${cues.map((cue, index) => `${cue.id || index + 1}\n${timeText(cue.start, 'vtt')} --> ${timeText(cue.end, 'vtt')}\n${cue.text}`).join('\n\n')}\n`
    : `${cues.map((cue, index) => `${index + 1}\n${timeText(cue.start, 'srt')} --> ${timeText(cue.end, 'srt')}\n${cue.text}`).join('\n\n')}\n`;
}

function createGifLzw(indices) {
  const bytes = []; let bitBuffer = 0; let bitCount = 0; let codeSize = 9; let nextCode = 258; let dictionary = new Map();
  const write = (code) => { bitBuffer |= code << bitCount; bitCount += codeSize; while (bitCount >= 8) { bytes.push(bitBuffer & 255); bitBuffer >>>= 8; bitCount -= 8; } };
  const reset = () => { dictionary = new Map(); codeSize = 9; nextCode = 258; };
  write(256); let prefix = indices[0];
  for (let i = 1; i < indices.length; i += 1) {
    const symbol = indices[i]; const key = prefix * 256 + symbol;
    if (dictionary.has(key)) prefix = dictionary.get(key);
    else {
      write(prefix);
      if (nextCode < 4096) {
        dictionary.set(key, nextCode++);
        if (nextCode === (1 << codeSize) && codeSize < 12) codeSize += 1;
      } else { write(256); reset(); }
      prefix = symbol;
    }
  }
  write(prefix); write(257); if (bitCount) bytes.push(bitBuffer & 255);
  const chunks = [8];
  for (let start = 0; start < bytes.length; start += 255) { const part = bytes.slice(start, start + 255); chunks.push(part.length, ...part); }
  chunks.push(0); return chunks;
}
function createGif(frames, width, height, delayMs) {
  const out = [...new TextEncoder().encode('GIF89a'), width & 255, width >> 8, height & 255, height >> 8, 0xf7, 0, 0];
  for (let i = 0; i < 256; i += 1) out.push(((i >> 5) & 7) * 255 / 7 | 0, ((i >> 2) & 7) * 255 / 7 | 0, (i & 3) * 255 / 3 | 0);
  out.push(0x21, 0xff, 0x0b, ...new TextEncoder().encode('NETSCAPE2.0'), 3, 1, 0, 0, 0);
  const delay = Math.max(5, Math.min(500, Math.round(delayMs / 10)));
  for (const imageData of frames) {
    out.push(0x21, 0xf9, 4, 0, delay & 255, delay >> 8, 0, 0, 0x2c, 0, 0, 0, 0, width & 255, width >> 8, height & 255, height >> 8, 0);
    const pixels = new Uint8Array(width * height);
    for (let i = 0, p = 0; i < imageData.data.length; i += 4, p += 1) pixels[p] = (imageData.data[i] & 0xe0) | ((imageData.data[i + 1] & 0xe0) >> 3) | (imageData.data[i + 2] >> 6);
    for (const byte of createGifLzw(pixels)) out.push(byte);
  }
  out.push(0x3b); return new Blob([new Uint8Array(out)], { type: 'image/gif' });
}

async function decodeVideoFrames(file, maxEdge, delayMs, progress) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  const waitFor = (eventName) => new Promise((resolve, reject) => {
    const fail = () => reject(new Error(tr('This video format cannot be decoded by your browser.')));
    video.addEventListener(eventName, resolve, { once: true });
    video.addEventListener('error', fail, { once: true });
  });
  const metadata = waitFor('loadedmetadata');
  video.src = url;
  try {
    await metadata;
    if (!Number.isFinite(video.duration) || video.duration <= 0 || video.duration > 8) throw new RangeError(tr('Choose one video clip up to 8 seconds long.'));
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    if (!sourceWidth || !sourceHeight || sourceWidth * sourceHeight > 50_000_000) throw new RangeError(tr('This video frame is too large for this device.'));
    const ratio = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * ratio));
    const height = Math.max(1, Math.round(sourceHeight * ratio));
    if (width * height > 250_000) throw new RangeError(tr('Resize the video so each GIF frame is at most 250,000 pixels.'));
    const count = Math.max(2, Math.min(MAX_MEDIA_FRAMES, Math.floor(video.duration * 1000 / delayMs)));
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error(tr('Canvas is not available.'));
    const frames = [];
    for (let index = 0; index < count; index += 1) {
      const targetTime = Math.min(video.duration - 0.001, video.duration * index / count);
      if (Math.abs(video.currentTime - targetTime) > 0.001) {
        const seeked = waitFor('seeked');
        video.currentTime = targetTime;
        await seeked;
      } else if (video.readyState < 2) await waitFor('loadeddata');
      context.fillStyle = '#fff'; context.fillRect(0, 0, width, height);
      const scale = Math.min(width / sourceWidth, height / sourceHeight);
      const drawW = sourceWidth * scale; const drawH = sourceHeight * scale;
      context.drawImage(video, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      frames.push(context.getImageData(0, 0, width, height));
      progress.value = Math.round((index + 1) / count * 50);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    canvas.width = 1; canvas.height = 1;
    return { frames, width, height };
  } finally {
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  }
}

function setupRecording(root, mode) {
  const preview = $('#plan-recording-preview', root); const link = $('#plan-recording-download', root); const formatSelect = $('#plan-recording-type', root);
  const startButton = $(`[data-action="start-${mode}-recording"]`, root); const stopButton = $('[data-action="stop-plan-recording"]', root);
  let recorder; let stream; let chunks = []; let objectUrl = '';
  const supportedTypes = mode === 'voice' ? ['audio/webm;codecs=opus', 'audio/mp4;codecs=mp4a.40.2', 'audio/ogg;codecs=opus', 'audio/webm', 'audio/mp4'] : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/mp4'];
  const chosenType = supportedTypes.find((type) => MediaRecorder.isTypeSupported?.(type)) ?? '';
  formatSelect.innerHTML = ''; formatSelect.add(new Option(chosenType || tr('Browser default'), chosenType));
  if (!navigator.mediaDevices?.getUserMedia && mode === 'voice' || !navigator.mediaDevices?.getDisplayMedia && mode === 'screen' || !globalThis.MediaRecorder) {
    startButton.disabled = true; setStatus(root, 'Recording is not supported in this browser.', 'error'); return;
  }
  const release = () => { stream?.getTracks().forEach((track) => track.stop()); stream = null; };
  const stop = () => { if (recorder?.state === 'recording') recorder.stop(); stopButton.disabled = true; };
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === `start-${mode}-recording`) {
      try {
        startButton.disabled = true;
        stream = mode === 'voice' ? await navigator.mediaDevices.getUserMedia({ audio: true }) : await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        chunks = []; recorder = new MediaRecorder(stream, chosenType ? { mimeType: chosenType } : undefined);
        recorder.addEventListener('dataavailable', (item) => { if (item.data.size) chunks.push(item.data); });
        recorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || chosenType || 'application/octet-stream' }); release();
          if (!blob.size) { setStatus(root, 'The recording is empty. Try again.', 'error'); startButton.disabled = false; return; }
          if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = URL.createObjectURL(blob);
          preview.src = objectUrl; preview.hidden = false; link.href = objectUrl; link.download = safeName(`usefulverse-${mode}-recording`, blob.type.includes('mp4') ? '.mp4' : blob.type.includes('ogg') ? '.ogg' : '.webm'); link.textContent = `${tr('Download recording')} (${blob.type || tr('browser format')})`; link.hidden = false;
          setStatus(root, `Recording ready. Actual format: ${blob.type || 'browser default'}.`, 'success'); startButton.disabled = false; stopButton.disabled = true;
        });
        if (mode === 'screen') stream.getVideoTracks()[0]?.addEventListener('ended', stop, { once: true });
        recorder.start(1000); stopButton.disabled = false; setStatus(root, 'Recording… Select Stop and save when finished.');
      } catch (error) { release(); startButton.disabled = false; stopButton.disabled = true; setStatus(root, error?.name === 'NotAllowedError' ? 'Permission was not granted.' : 'Could not start recording in this browser.', 'error'); }
    }
    if (action === 'stop-plan-recording') stop();
    if (action === 'clear') { stop(); release(); preview.pause?.(); preview.removeAttribute('src'); preview.hidden = true; link.hidden = true; chunks = []; setStatus(root, 'Recording stopped and microphone or screen sharing released.'); }
  });
  window.addEventListener('pagehide', () => { stop(); release(); if (objectUrl) URL.revokeObjectURL(objectUrl); }, { once: true });
}

export function setupPlanTool(id, root) {
  if (id === 'screen-recorder') return setupRecording(root, 'screen');
  if (id === 'voice-recorder') return setupRecording(root, 'voice');
  let imageResult = null; let taskCancelled = false; let gifResult = null; let activeOcrWorker = null;
  root.addEventListener('click', async (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    try {
      if (action === 'calculate-gcd-lcm') {
        const values = parseWholeNumbers($('#plan-numbers', root).value); output('#plan-gcd', root, gcdAll(values).toString());
        output('#plan-lcm', root, values.every((item) => item === 0n) ? tr('Undefined (all inputs are zero)') : lcmAll(values).toString()); setStatus(root, 'Calculation complete.', 'success');
      }
      if (action === 'convert-scientific-notation') {
        const valueText = $('#plan-number', root).value.trim(); const value = Number(valueText); const precision = number('#plan-precision', root); const mode = $('#plan-direction', root).value;
        if (!valueText || !Number.isFinite(value) || !Number.isInteger(precision) || precision < 1 || precision > 15) throw new TypeError(tr('Enter a finite number and 1 to 15 significant digits.'));
        output('#plan-output', root, mode === 'scientific' ? value.toExponential(precision - 1) : new Intl.NumberFormat(undefined, { useGrouping: false, maximumSignificantDigits: precision }).format(value)); setStatus(root, 'Conversion complete.', 'success');
      }
      if (action === 'calculate-profit-margin') {
        const cost = number('#plan-cost', root); const price = number('#plan-price', root); const target = number('#plan-target-margin', root); const currency = $('#plan-currency', root).value;
        if (![cost, price].every(Number.isFinite) || cost < 0 || price < 0 || (price === 0 && cost !== 0) || (cost > 0 && price === 0) || !Number.isFinite(target) || target < 0 || target >= 100) throw new TypeError(tr('Enter valid non-negative cost and price, and a target margin from 0 to under 100%.'));
        const money = new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 });
        const profit = price - cost; output('#plan-profit', root, money.format(profit)); output('#plan-margin', root, price ? `${(profit / price * 100).toFixed(2)}%` : '—'); output('#plan-markup', root, cost ? `${(profit / cost * 100).toFixed(2)}%` : '—'); output('#plan-target-price', root, money.format(cost / (1 - target / 100))); setStatus(root, 'Calculation complete. Taxes and other costs are not included.', 'success');
      }
      if (action === 'calculate-hourly-pay') {
        const pay = number('#plan-salary', root); const hours = number('#plan-hours', root); const weeks = number('#plan-weeks', root); const period = $('#plan-period', root).value; const currency = $('#plan-currency', root).value;
        if (![pay, hours, weeks].every(Number.isFinite) || pay < 0 || hours <= 0 || hours > 168 || weeks < 1 || weeks > 52) throw new TypeError(tr('Enter a non-negative pay amount, 0–168 work hours and 1–52 work weeks.'));
        const annual = pay * ({ year: 1, month: 12, week: 52, day: weeks * 5 }[period] ?? 1); const workHours = hours * weeks;
        const money = new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 });
        output('#plan-hourly', root, money.format(annual / workHours)); output('#plan-annual', root, money.format(annual)); setStatus(root, 'Estimate complete. Gross pay only; taxes and overtime are not included.', 'success');
      }
      if (action === 'run-image-ocr') {
        const input = $('#image-to-text-file', root); const file = input.files?.[0]; if (!file) throw new TypeError(tr('Choose an image first.')); if (file.size > MAX_IMAGE_BYTES) throw new RangeError(tr('Choose an image up to 20 MB.'));
        const language = $('#plan-ocr-language', root).value; const outputField = $('#plan-output', root); const progress = $('#plan-progress', root); const cancel = $('[data-action="cancel-plan-task"]', root); taskCancelled = false; outputField.value = ''; progress.hidden = false; progress.value = 0; cancel.disabled = false;
        let canvas;
        try {
          const bitmap = await createImageBitmap(file); if (bitmap.width * bitmap.height > 20_000_000) throw new RangeError(tr('The image has too many pixels for this device.'));
          const rotation = Number($('#plan-rotation', root).value) * Math.PI / 180; const sideways = rotation === Math.PI / 2 || rotation === 3 * Math.PI / 2;
          canvas = document.createElement('canvas'); canvas.width = sideways ? bitmap.height : bitmap.width; canvas.height = sideways ? bitmap.width : bitmap.height; const context = canvas.getContext('2d'); if (!context) throw new Error(tr('Canvas is not available.'));
          context.translate(canvas.width / 2, canvas.height / 2); context.rotate(rotation); context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); bitmap.close?.();
          const { createWorker, OEM } = await import('/assets/tool-suite-ocr.js');
          activeOcrWorker = await createWorker(language, OEM.LSTM_ONLY, { workerPath: '/assets/vendor/tesseract-7.0.0/worker.min.js', corePath: '/assets/vendor/tesseract-7.0.0/', langPath: '/assets/ocr-languages-4.0.0/', gzip: true, logger: (info) => { if (info.progress != null) progress.value = Math.round(info.progress * 100); } });
          if (taskCancelled) return;
          const result = await activeOcrWorker.recognize(canvas); if (!taskCancelled) { outputField.value = result.data.text; setStatus(root, 'Text recognized. Review it for OCR mistakes.', 'success'); }
        } finally { await activeOcrWorker?.terminate().catch(() => {}); activeOcrWorker = null; if (canvas) { canvas.width = 1; canvas.height = 1; } progress.hidden = true; cancel.disabled = true; }
      }
      if (action === 'cancel-plan-task') { taskCancelled = true; await activeOcrWorker?.terminate().catch(() => {}); activeOcrWorker = null; setStatus(root, 'Stopping local processing…'); }
      if (action === 'copy-plan-output') { const text = $('#plan-output', root).value; if (!text) throw new TypeError(tr('There is no result to copy.')); await navigator.clipboard.writeText(text); setStatus(root, 'Copied to your clipboard.', 'success'); }
      if (action === 'download-plan-output') {
        if (id === 'subtitle-converter') { const text = $('#plan-output', root).value; if (!text) throw new TypeError(tr('There is no result to download.')); download(root, new Blob([text], { type: 'text/plain;charset=utf-8' }), safeName($('#subtitle-converter-file', root).files?.[0]?.name, $('#plan-subtitle-format', root).value === 'vtt' ? '.vtt' : '.srt')); }
        else if (id === 'gif-maker' && gifResult) download(root, gifResult, 'usefulverse-animation.gif');
        else { const text = $('#plan-output', root).value; if (!text) throw new TypeError(tr('There is no result to download.')); download(root, new Blob([text], { type: 'text/plain;charset=utf-8' }), safeName($('#image-to-text-file', root).files?.[0]?.name, '.txt')); }
      }
      if (action === 'convert-spreadsheet') {
        const file = $('#spreadsheet-converter-file', root).files?.[0]; if (!file) throw new TypeError(tr('Choose an XLSX or CSV file first.')); if (file.size > 20_000_000) throw new RangeError(tr('Choose a file up to 20 MB.'));
        let rows; let outputBlob; let filename;
        if (file.name.toLowerCase().endsWith('.xlsx')) { const sheets = readXlsxSheets(new Uint8Array(await file.arrayBuffer())); const index = Number($('#plan-sheet', root).value || 0); rows = sheets[index]?.rows; if (!rows) throw new TypeError(tr('Choose a worksheet.')); outputBlob = new Blob([csvText(rows)], { type: 'text/csv;charset=utf-8' }); filename = safeName(`${file.name}-${sheets[index].name}`, '.csv'); }
        else { rows = parseCsv(await file.text()); outputBlob = new Blob([createXlsx(rows)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); filename = safeName(file.name, '.xlsx'); }
        $('#plan-preview', root).value = csvText(rows.slice(0, 30)); download(root, outputBlob, filename); setStatus(root, 'Converted one table locally. Review CSV limitations before replacing your original.', 'success');
      }
      if (action === 'convert-subtitles') {
        const file = $('#subtitle-converter-file', root).files?.[0]; if (!file) throw new TypeError(tr('Choose an SRT or VTT subtitle file.')); const shift = number('#plan-shift', root); if (!Number.isSafeInteger(shift) || Math.abs(shift) > 86_400_000) throw new RangeError(tr('Use a whole-number timing shift up to 24 hours.'));
        $('#plan-output', root).value = convertSubtitles(await file.text(), $('#plan-subtitle-format', root).value, shift); setStatus(root, 'Subtitles converted locally. Check timing in your player.', 'success');
      }
      if (action === 'create-collage') {
        const files = [...($('#image-collage-maker-file', root).files ?? [])]; if (files.length < 2 || files.length > 20) throw new RangeError(tr('Choose 2 to 20 images for a collage.')); if (files.some((file) => file.size > MAX_IMAGE_BYTES)) throw new RangeError(tr('Each image must be 20 MB or smaller.'));
        const columns = number('#plan-columns', root); const spacing = number('#plan-spacing', root); if (!Number.isInteger(columns) || columns < 1 || columns > 6 || !Number.isInteger(spacing) || spacing < 0 || spacing > 80) throw new TypeError(tr('Choose 1–6 columns and spacing from 0–80 pixels.'));
        const bitmaps = await Promise.all(files.map((file) => createImageBitmap(file))); try {
          if (bitmaps.some((bitmap) => bitmap.width * bitmap.height > 20_000_000)) throw new RangeError(tr('An image has too many pixels for this device.'));
          const cellW = 520; const cellH = 360; const rows = Math.ceil(files.length / columns); const canvas = $('#plan-canvas', root); canvas.width = columns * cellW + (columns + 1) * spacing; canvas.height = rows * cellH + (rows + 1) * spacing; const context = canvas.getContext('2d'); context.fillStyle = $('#plan-background', root).value; context.fillRect(0, 0, canvas.width, canvas.height);
          bitmaps.forEach((bitmap, index) => { const col = index % columns; const row = Math.floor(index / columns); const scale = Math.min(cellW / bitmap.width, cellH / bitmap.height); const w = bitmap.width * scale; const h = bitmap.height * scale; context.drawImage(bitmap, spacing + col * (cellW + spacing) + (cellW - w) / 2, spacing + row * (cellH + spacing) + (cellH - h) / 2, w, h); });
          canvas.hidden = false; imageResult = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(tr('Could not create the collage image.'))), $('#plan-collage-format', root).value, 0.92)); setStatus(root, 'Collage ready. It is one flattened image.', 'success');
        } finally { bitmaps.forEach((bitmap) => bitmap.close?.()); }
      }
      if (action === 'download-collage') { if (!imageResult) throw new TypeError(tr('Create a collage first.')); download(root, imageResult, $('#plan-collage-format', root).value === 'image/png' ? 'usefulverse-collage.png' : 'usefulverse-collage.jpg'); }
      if (action === 'remove-image-metadata') {
        const file = $('#image-metadata-remover-file', root).files?.[0]; if (!file) throw new TypeError(tr('Choose an image first.')); if (file.size > MAX_IMAGE_BYTES) throw new RangeError(tr('Choose an image up to 20 MB.'));
        const bitmap = await createImageBitmap(file); if (bitmap.width * bitmap.height > 25_000_000) { bitmap.close?.(); throw new RangeError(tr('The image has too many pixels for this device.')); }
        try { const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height; const context = canvas.getContext('2d'); context.drawImage(bitmap, 0, 0); const type = $('#plan-meta-format', root).value; const quality = number('#plan-meta-quality', root) / 100; const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error(tr('Could not export this image format.'))), type, quality)); download(root, blob, safeName(file.name, type === 'image/png' ? '.png' : type === 'image/webp' ? '.webp' : '.jpg')); canvas.width = 1; canvas.height = 1; setStatus(root, 'A new image copy was created without the original metadata. Image quality or size may change.', 'success'); }
        finally { bitmap.close?.(); }
      }
      if (action === 'create-gif') {
        const files = [...($('#gif-maker-file', root).files ?? [])]; const videos = files.filter((item) => item.type.startsWith('video/') || /\.(mp4|webm|mov)$/iu.test(item.name)); const images = files.filter((item) => !videos.includes(item));
        const delay = number('#plan-frame-delay', root); const maxEdge = number('#plan-gif-size', root);
        if (videos.length ? videos.length !== 1 || images.length : images.length < 2 || images.length > MAX_MEDIA_FRAMES) throw new RangeError(tr('Choose 2 to 12 still images, or one video clip.'));
        if (files.some((file) => file.size > MAX_IMAGE_BYTES)) throw new RangeError(tr('Each file must be 20 MB or smaller.'));
        if (!Number.isInteger(delay) || delay < 50 || delay > 5000 || ![240, 360, 480].includes(maxEdge)) throw new TypeError(tr('Choose a frame delay from 50 to 5000 milliseconds and a valid frame size.'));
        const progress = $('#plan-progress', root); progress.hidden = false; progress.value = 0;
        if (videos.length) {
          try { const decoded = await decodeVideoFrames(videos[0], maxEdge, delay, progress); gifResult = createGif(decoded.frames, decoded.width, decoded.height, delay); decoded.frames.length = 0; progress.value = 100; setStatus(root, 'GIF created from the video locally. It uses a limited palette and may look less detailed than the original.', 'success'); }
          finally { progress.hidden = true; }
          return;
        }
        const bitmaps = await Promise.all(images.map((file) => createImageBitmap(file)));
        try { const ratio = Math.min(1, maxEdge / Math.max(...bitmaps.map((bitmap) => Math.max(bitmap.width, bitmap.height)))); const width = Math.max(1, Math.round(bitmaps[0].width * ratio)); const height = Math.max(1, Math.round(bitmaps[0].height * ratio)); if (width * height > 250_000) throw new RangeError(tr('Resize images so the GIF is at most 250,000 pixels per frame.'));
          const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height; const context = canvas.getContext('2d', { willReadFrequently: true }); const frames = [];
          for (const bitmap of bitmaps) { context.clearRect(0, 0, width, height); context.fillStyle = '#fff'; context.fillRect(0, 0, width, height); const scale = Math.min(width / bitmap.width, height / bitmap.height); const w = bitmap.width * scale; const h = bitmap.height * scale; context.drawImage(bitmap, (width - w) / 2, (height - h) / 2, w, h); frames.push(context.getImageData(0, 0, width, height)); progress.value = Math.round(frames.length / files.length * 50); await new Promise((resolve) => setTimeout(resolve, 0)); }
          gifResult = createGif(frames, width, height, delay); progress.value = 100; canvas.width = 1; canvas.height = 1; setStatus(root, 'GIF created locally. It uses a limited palette and may look less detailed than the original images.', 'success');
        } finally { bitmaps.forEach((bitmap) => bitmap.close?.()); progress.hidden = true; }
      }
      if (action === 'clear') {
        taskCancelled = true; root.querySelectorAll('input[type="file"], textarea, output').forEach((item) => { if (item.type === 'file' || item.tagName === 'TEXTAREA') item.value = ''; else item.textContent = '—'; });
        if (imageResult) { imageResult = null; $('#plan-canvas', root) && ($('#plan-canvas', root).hidden = true); }
        gifResult = null; setStatus(root, 'Cleared.');
      }
    } catch (error) { setStatus(root, error?.message || 'The task could not be completed. Check the file and try again.', 'error'); }
  });
  if (id === 'spreadsheet-converter') {
    const input = $('#spreadsheet-converter-file', root); const sheetSelect = $('#plan-sheet', root); const preview = $('#plan-preview', root); let sheets = [];
    input.addEventListener('change', async () => {
      try { const file = input.files?.[0]; if (!file) return; if (file.name.toLowerCase().endsWith('.csv')) { const rows = parseCsv(await file.text()); sheetSelect.innerHTML = ''; sheetSelect.disabled = true; preview.value = csvText(rows.slice(0, 30)); setStatus(root, `${rows.length} CSV rows previewed.`, 'success'); return; }
        sheets = readXlsxSheets(new Uint8Array(await file.arrayBuffer())); sheetSelect.innerHTML = ''; sheets.forEach((sheet, index) => sheetSelect.add(new Option(sheet.name, String(index)))); sheetSelect.disabled = false; preview.value = csvText(sheets[0].rows.slice(0, 30)); setStatus(root, `${sheets.length} worksheets found. Formulas are not recalculated.`, 'success');
      } catch (error) { setStatus(root, error?.message || 'Could not read this spreadsheet.', 'error'); }
    });
    sheetSelect.addEventListener('change', () => { preview.value = csvText(sheets[Number(sheetSelect.value)]?.rows.slice(0, 30) ?? []); });
  }
}
