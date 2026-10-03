import { calculateOpportunity } from './opportunity-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const $$ = (selector, root) => [...root.querySelectorAll(selector)];
const locale = document.documentElement.lang || 'en';
const bundle = window.usefulverseLocale ?? { runtime: {} };
const say = (key) => bundle.runtime?.[key] ?? bundle.messages?.[key] ?? key;
const setStatus = (root, message, type = '') => {
  const status = $('#op-status', root);
  if (status) { status.textContent = say(message); status.className = 'tool-status' + (type ? ' is-' + type : ''); }
};

const valuesFrom = (root) => Object.fromEntries($$('[data-op-field]', root).map((item) => [item.dataset.opField, item.type === 'file' ? item.files?.[0] ?? null : item.value]));
const displayOutput = (root, value) => {
  const output = $('#op-output', root);
  if (output) { if ('value' in output) output.value = value; else output.textContent = value; }
};

async function copyResult(root) {
  const output = $('#op-output', root);
  const value = output && ('value' in output ? output.value : output.textContent);
  if (!value || value === '—') return setStatus(root, 'There is nothing to copy yet.', 'error');
  try { await navigator.clipboard.writeText(value); setStatus(root, 'Copied to your clipboard.', 'success'); }
  catch { setStatus(root, 'Copy was blocked. Select the result and copy it manually.', 'error'); }
}

function printDocument(root) {
  const output = $('#op-output', root);
  if (!output?.value) return setStatus(root, 'Create the document preview first.', 'error');
  const printWindow = window.open('', '_blank', 'width=780,height=800');
  if (!printWindow) return setStatus(root, 'Allow this click to open a print preview, then try again.', 'error');
  const escaped = output.value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  printWindow.document.write('<!doctype html><html lang="' + locale + '"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + say('Print preview') + '</title><style>body{max-width:800px;margin:48px auto;padding:0 24px;font:16px/1.55 system-ui,sans-serif;color:#151924}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}@media print{body{margin:0}}</style><pre>' + escaped + '</pre>');
  printWindow.addEventListener('load', () => printWindow.print(), { once: true });
  printWindow.document.close();
}

function offerDownload(root, blob, filename) {
  const link = $('[data-image-download], [data-op-download]', root);
  if (!link) return;
  if (link.dataset.objectUrl) URL.revokeObjectURL(link.dataset.objectUrl);
  link.href = URL.createObjectURL(blob); link.download = filename; link.hidden = false;
  link.dataset.objectUrl = link.href;
}

function offerSvg(root, svg, filename) {
  const link = $('[data-op-download]', root);
  if (!link) return;
  offerDownload(root, new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }), filename);
}

function addSvgElement(parent, name, attrs = {}, text = '') {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  parent.append(node);
  return node;
}

function drawChart(root, values) {
  const svg = $('[data-op-svg]', root); if (!svg) return;
  const rows = String(values.csv ?? '').split(/\r?\n/u).map((line) => line.split(',').map((cell) => cell.trim())).filter((row) => row.length >= 2 && row[0]).map(([label, value]) => [label.slice(0, 30), Number(value)]);
  if (rows.length > 2 && !Number.isFinite(rows[0][1])) rows.shift();
  if (rows.length < 2 || rows.length > 60 || rows.some(([, value]) => !Number.isFinite(value))) throw new TypeError('Enter 2–60 label,value CSV lines with numeric values.');
  const max = Math.max(0, ...rows.map(([, value]) => value)); const min = Math.min(0, ...rows.map(([, value]) => value)); const range = max - min || 1;
  svg.replaceChildren(); svg.setAttribute('viewBox', '0 0 640 360');
  addSvgElement(svg, 'title', {}, 'Chart preview');
  addSvgElement(svg, 'path', { d: 'M56 24V300H624', fill: 'none', stroke: 'currentColor', opacity: '.45' });
  const y = (value) => 280 - (value - min) / range * 230;
  if (values.type === 'line') {
    const x = (index) => 72 + index * 536 / (rows.length - 1);
    addSvgElement(svg, 'path', { d: rows.map(([, value], i) => `${i ? 'L' : 'M'}${x(i)},${y(value)}`).join(' '), fill: 'none', stroke: '#2563eb', 'stroke-width': 4 });
    rows.forEach(([label, value], i) => { addSvgElement(svg, 'circle', { cx: x(i), cy: y(value), r: 5, fill: '#2563eb' }); addSvgElement(svg, 'text', { x: x(i), y: 320, 'text-anchor': 'middle', 'font-size': 12 }, label); });
  } else {
    const width = Math.min(64, 500 / rows.length); const gap = (536 - width * rows.length) / (rows.length + 1);
    rows.forEach(([label, value], i) => { const x = 62 + gap + i * (width + gap); const top = y(Math.max(0, value)); addSvgElement(svg, 'rect', { x, y: Math.min(top, y(0)), width, height: Math.max(1, Math.abs(y(0) - top)), fill: '#2563eb', rx: 3 }); addSvgElement(svg, 'text', { x: x + width / 2, y: 320, 'text-anchor': 'middle', 'font-size': 12 }, label); });
  }
  displayOutput(root, rows.map(([label, value]) => `${label},${value}`).join('\n'));
  offerSvg(root, svg, 'usefulverse-chart.svg');
}

function drawDiagram(root, text) {
  const svg = $('[data-op-svg]', root); if (!svg) return;
  const steps = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (steps.length < 2 || steps.length > 12 || steps.some((step) => step.length > 48)) throw new TypeError('Enter 2–12 steps, up to 48 characters each.');
  const width = 640; const rowHeight = 74; const height = Math.max(180, steps.length * rowHeight + 30);
  svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  addSvgElement(svg, 'title', {}, 'Process diagram');
  steps.forEach((step, index) => {
    const y = 14 + index * rowHeight;
    if (index) addSvgElement(svg, 'path', { d: `M320 ${y - 12}V${y + 1}`, stroke: '#475569', 'stroke-width': 2, 'marker-end': 'url(#arrow)' });
    addSvgElement(svg, 'rect', { x: 110, y, width: 420, height: 48, rx: 10, fill: '#f8fafc', stroke: '#475569', 'stroke-width': 2 });
    addSvgElement(svg, 'text', { x: 320, y: y + 30, 'text-anchor': 'middle', 'font-size': 16, fill: '#111827' }, step);
  });
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = '<marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#475569"/></marker>';
  svg.prepend(defs);
  displayOutput(root, steps.join('\n'));
  offerSvg(root, svg, 'usefulverse-process.svg');
}

function setupSqlite(root) {
  const output = $('#op-output', root); const run = $('[data-op-calculate]', root); const reset = $('[data-sql-reset]', root);
  const worker = new Worker(`/assets/sqlite-playground-worker.js?v=${encodeURIComponent(document.documentElement.dataset.assetVersion || '')}`, { type: 'module' });
  let nextId = 0; const pending = new Map();
  const renderRows = (columns, rows) => {
    const table = document.createElement('table'); table.className = 'op-sql-table';
    const head = table.createTHead().insertRow();
    for (const name of columns) { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = String(name); head.append(cell); }
    const body = table.createTBody();
    for (const row of rows) { const tr = body.insertRow(); for (const value of row) { const cell = tr.insertCell(); cell.textContent = value === null ? 'NULL' : String(value); } }
    $('#op-sql-results', root)?.replaceChildren(table);
  };
  worker.addEventListener('message', ({ data }) => {
    if (data.type === 'init-error') { setStatus(root, data.message, 'error'); run.disabled = true; return; }
    if (data.type === 'ready') { setStatus(root, say('Values are processed locally in this browser.'), 'success'); return; }
    const task = pending.get(data.id); if (!task) return; pending.delete(data.id);
    if (data.type === 'error') { setStatus(root, data.message, 'error'); return; }
    if (data.type === 'result') { output.textContent = [data.columns.join('\t'), ...data.rows.map((row) => row.map((value) => value === null ? 'NULL' : String(value)).join('\t'))].filter(Boolean).join('\n'); renderRows(data.columns, data.rows); setStatus(root, say('Result ready. This calculation runs locally in your browser.'), 'success'); }
    if (data.type === 'reset') { $('#op-sql-results', root)?.replaceChildren(); output.textContent = '—'; setStatus(root, 'Database reset.'); }
  });
  const send = (type, sql = '') => { const id = ++nextId; pending.set(id, true); worker.postMessage({ type, sql, id }); };
  run?.addEventListener('click', (event) => { event.preventDefault(); send('exec', $('[data-op-field="sql"]', root)?.value); });
  reset?.addEventListener('click', () => send('reset'));
  window.addEventListener('pagehide', () => { worker.postMessage({ type: 'dispose' }); worker.terminate(); }, { once: true });
}

function setupLatex(root) {
  let mathJaxPromise;
  const loadMathJax = () => {
    if (mathJaxPromise) return mathJaxPromise;
    const version = encodeURIComponent(document.documentElement.dataset.assetVersion || '');
    window.MathJax = {
      startup: { typeset: false },
      options: { enableMenu: false },
      tex: { maxBuffer: 2000, packages: { '[-]': ['autoload', 'require'] } },
      svg: { fontCache: 'local' },
    };
    mathJaxPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/assets/vendor/mathjax-tex-svg.js?v=${version}`;
      script.async = true;
      script.onload = () => window.MathJax.startup.promise.then(() => resolve(window.MathJax), reject);
      script.onerror = () => reject(new Error('Local equation renderer could not load.'));
      document.head.append(script);
    });
    return mathJaxPromise;
  };
  root.addEventListener('click', async (event) => {
    if (!event.target.closest('[data-op-calculate]')) return;
    try {
      const expression = String($('[data-op-field="equation"]', root)?.value ?? '');
      if (!expression.trim() || expression.length > 1000) throw new RangeError('Enter an equation of 1–1,000 characters.');
      if (/\\(?:require|href|url|html|class|style|includegraphics|input|write|def|newcommand|renewcommand|tag|label|ref)\b/iu.test(expression)) throw new TypeError('This equation contains a command that is not supported in the safe browser renderer.');
      const mathJax = await loadMathJax(); const preview = $('[data-latex-preview]', root);
      mathJax.typesetClear?.([preview]); preview.replaceChildren(); preview.textContent = `\\[${expression}\\]`;
      await mathJax.typesetPromise([preview]);
      const svg = preview.querySelector('mjx-container svg');
      if (!svg) throw new TypeError('This expression could not be rendered. Check the supported notation.');
      svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', expression);
      offerDownload(root, new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-equation.svg');
      displayOutput(root, expression); setStatus(root, 'Equation rendered locally in this browser.', 'success');
    } catch (error) { $('[data-latex-preview]', root)?.replaceChildren(); setStatus(root, error instanceof Error ? error.message : 'Equation could not be rendered.', 'error'); }
  });
}

function setupPixelArt(root) {
  const canvas = $('[data-image-canvas]', root); const sizeInput = $('[data-op-field="size"]', root); const color = $('[data-pixel-color]', root);
  const ctx = canvas.getContext('2d'); let isDown = false;
  const resize = () => { const size = Number(sizeInput.value); canvas.width = size; canvas.height = size; canvas.style.width = 'min(100%, 512px)'; canvas.style.aspectRatio = '1'; canvas.style.imageRendering = 'pixelated'; canvas.hidden = false; };
  const paint = (event) => { if (!isDown) return; const rect = canvas.getBoundingClientRect(); const x = Math.floor((event.clientX - rect.left) / rect.width * canvas.width); const y = Math.floor((event.clientY - rect.top) / rect.height * canvas.height); ctx.fillStyle = color.value; ctx.fillRect(x, y, 1, 1); };
  resize(); sizeInput?.addEventListener('change', resize); canvas.addEventListener('pointerdown', (event) => { isDown = true; canvas.setPointerCapture(event.pointerId); paint(event); }); canvas.addEventListener('pointermove', paint); canvas.addEventListener('pointerup', () => { isDown = false; }); canvas.addEventListener('pointercancel', () => { isDown = false; });
  root.addEventListener('click', async (event) => { if (event.target.closest('[data-op-calculate]')) { const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png')); if (!blob) return setStatus(root, 'Could not export PNG.', 'error'); offerDownload(root, blob, 'usefulverse-pixel-art.png'); displayOutput(root, `${canvas.width} × ${canvas.height} PNG`); setStatus(root, 'PNG ready on this device.', 'success'); } if (event.target.closest('[data-op-clear]')) { ctx.clearRect(0, 0, canvas.width, canvas.height); } });
}

function setupDeviceTools(engine, root) {
  const start = $('[data-device-start]', root); const stop = $('[data-device-stop]', root); const output = $('[data-device-output]', root); let stream; let context; let source; let animation;
  const release = () => { cancelAnimationFrame(animation); stream?.getTracks().forEach((track) => track.stop()); stream = undefined; if (source) { try { source.disconnect(); } catch {} source = undefined; } if (context && context.state !== 'closed') context.close().catch(() => {}); context = undefined; if (stop) stop.disabled = true; if (start) start.disabled = false; };
  if (engine === 'webcam-tester') {
    start?.addEventListener('click', async () => { try { stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); const video = $('[data-device-video]', root); video.srcObject = stream; await video.play(); const track = stream.getVideoTracks()[0]; const { width = 0, height = 0 } = track.getSettings(); output.textContent = `${width} × ${height} px`; start.disabled = true; stop.disabled = false; setStatus(root, say('Values are processed locally in this browser.'), 'success'); } catch (error) { release(); setStatus(root, error instanceof Error ? error.message : 'Camera access failed.', 'error'); } });
    stop?.addEventListener('click', () => { $('[data-device-video]', root).srcObject = null; output.textContent = '—'; release(); setStatus(root, say('Values are processed locally in this browser.')); });
  } else if (engine === 'guitar-tuner') {
    start?.addEventListener('click', async () => { try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); context = new (window.AudioContext || window.webkitAudioContext)(); await context.resume();
      source = context.createMediaStreamSource(stream); const analyser = context.createAnalyser(); analyser.fftSize = 8192; source.connect(analyser);
      const raw = new Float32Array(analyser.fftSize); const samples = new Float32Array(1024); const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']; let lastRun = 0;
      const detect = (now) => {
        if (now - lastRun >= 90) {
          lastRun = now; analyser.getFloatTimeDomainData(raw); let energy = 0;
          for (let i = 0; i < samples.length; i += 1) { samples[i] = raw[i * 8]; energy += samples[i] * samples[i]; }
          if (energy / samples.length > 0.00003) {
            let bestLag = 0; let best = -Infinity;
            for (let lag = 8; lag <= 400; lag += 1) { let corr = 0; for (let i = 0; i < samples.length - lag; i += 2) corr += samples[i] * samples[i + lag]; if (corr > best) { best = corr; bestLag = lag; } }
            if (bestLag) { const hz = context.sampleRate / (bestLag * 8); const midi = Math.round(69 + 12 * Math.log2(hz / 440)); const target = 440 * 2 ** ((midi - 69) / 12); output.textContent = `${notes[(midi % 12 + 12) % 12]}${Math.floor(midi / 12) - 1} · ${hz.toFixed(1)} Hz · ${Math.round(1200 * Math.log2(hz / target))} cents`; }
          }
        }
        animation = requestAnimationFrame(detect);
      };
      detect(0); start.disabled = true; stop.disabled = false; setStatus(root, say('Values are processed locally in this browser.'), 'success');
    } catch (error) { release(); setStatus(root, error instanceof Error ? error.message : 'Microphone access failed.', 'error'); } });
    stop?.addEventListener('click', () => { output.textContent = '—'; release(); setStatus(root, say('Values are processed locally in this browser.')); });
  }
  window.addEventListener('pagehide', release, { once: true });
}

function setupNoise(root) {
  let context; let node; let gain;
  const stop = () => { try { node?.stop(); } catch {} node?.disconnect(); gain?.disconnect(); node = undefined; gain = undefined; if (context && context.state !== 'closed') context.close().catch(() => {}); context = undefined; $('[data-device-start]', root).disabled = false; $('[data-device-stop]', root).disabled = true; };
  $('[data-device-start]', root)?.addEventListener('click', async () => { try { context = new (window.AudioContext || window.webkitAudioContext)(); await context.resume(); const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate); const data = buffer.getChannelData(0); let last = 0; for (let i = 0; i < data.length; i += 1) { const white = Math.random() * 2 - 1; const color = $('[data-op-field="color"]', root).value; last = color === 'brown' ? (last + 0.02 * white) / 1.02 : color === 'pink' ? (0.98 * last + 0.02 * white) : white; data[i] = color === 'white' ? white : last * (color === 'pink' ? 3.5 : 12); } node = context.createBufferSource(); node.buffer = buffer; node.loop = true; gain = context.createGain(); gain.gain.value = Math.min(0.5, Number($('[data-op-field="volume"]', root).value) / 100); node.connect(gain).connect(context.destination); node.start(); $('[data-device-start]', root).disabled = true; $('[data-device-stop]', root).disabled = false; setStatus(root, say('Result ready. This calculation runs locally in your browser.'), 'success'); } catch (error) { stop(); setStatus(root, error instanceof Error ? error.message : say('Audio could not start. Check your browser audio settings.'), 'error'); } });
  $('[data-device-stop]', root)?.addEventListener('click', stop); window.addEventListener('pagehide', stop, { once: true });
}

function setupPiano(root) {
  let context; const active = new Map(); const keyNotes = new Map([['a', 60], ['w', 61], ['s', 62], ['e', 63], ['d', 64], ['f', 65], ['t', 66], ['g', 67], ['y', 68], ['h', 69], ['u', 70], ['j', 71], ['k', 72]]);
  const noteOn = async (midi, button) => { if (active.has(midi)) return; context ??= new (window.AudioContext || window.webkitAudioContext)(); await context.resume(); const osc = context.createOscillator(); const gain = context.createGain(); osc.frequency.value = 440 * 2 ** ((midi - 69) / 12); gain.gain.value = 0.0001; osc.connect(gain).connect(context.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(0.15, context.currentTime + 0.015); active.set(midi, { osc, gain, button }); button?.classList.add('is-pressed'); };
  const noteOff = (midi) => { const item = active.get(midi); if (!item) return; item.gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.04); item.osc.stop(context.currentTime + 0.2); item.button?.classList.remove('is-pressed'); active.delete(midi); };
  $$('[data-midi]', root).forEach((button) => { const midi = Number(button.dataset.midi); button.addEventListener('pointerdown', (event) => { event.preventDefault(); noteOn(midi, button).catch(() => setStatus(root, 'Audio could not start.', 'error')); }); button.addEventListener('pointerup', () => noteOff(midi)); button.addEventListener('pointerleave', () => noteOff(midi)); });
  const down = (event) => { if (event.repeat || event.target.closest('input, textarea, select, [contenteditable="true"]')) return; const midi = keyNotes.get(event.key.toLowerCase()); if (midi) { event.preventDefault(); noteOn(midi, $$('[data-midi]', root).find((button) => Number(button.dataset.midi) === midi)).catch(() => setStatus(root, say('Audio could not start. Check your browser audio settings.'), 'error')); } }; const up = (event) => { const midi = keyNotes.get(event.key.toLowerCase()); if (midi) noteOff(midi); };
  window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', () => [...active.keys()].forEach(noteOff)); window.addEventListener('pagehide', () => { [...active.keys()].forEach(noteOff); context?.close().catch(() => {}); }, { once: true });
}

function setupSpeaker(root) {
  let context; let oscillator; let gain; let panner;
  const stop = () => { try { oscillator?.stop(); } catch {} oscillator?.disconnect(); gain?.disconnect(); panner?.disconnect(); oscillator = gain = panner = undefined; if (context && context.state !== 'closed') context.close().catch(() => {}); context = undefined; $('[data-device-stop]', root).disabled = true; };
  $$('[data-speaker-channel]', root).forEach((button) => button.addEventListener('click', async () => { stop(); context = new (window.AudioContext || window.webkitAudioContext)(); await context.resume(); oscillator = context.createOscillator(); gain = context.createGain(); panner = context.createStereoPanner?.(); oscillator.frequency.value = 440; gain.gain.value = Number($('[data-device-volume]', root).value) / 100; oscillator.connect(gain); if (panner) { panner.pan.value = Number(button.dataset.speakerChannel); gain.connect(panner).connect(context.destination); } else gain.connect(context.destination); oscillator.start(); $('[data-device-stop]', root).disabled = false; setStatus(root, say('Values are processed locally in this browser.'), 'success'); setTimeout(stop, 700); }));
  $('[data-device-stop]', root)?.addEventListener('click', stop); window.addEventListener('pagehide', stop, { once: true });
}

async function runImageTool(engine, values, root) {
  const file = values.file;
  if (!(file instanceof File) || !file.type.startsWith('image/') || file.size > 30 * 1024 * 1024) throw new TypeError('Choose an image under 30 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 20_000_000) throw new RangeError('This image exceeds the 20-megapixel device-memory limit. Use a smaller image.');
    const canvas = $('[data-image-canvas]', root); const context = canvas.getContext('2d', { alpha: engine !== 'id-photo' });
    let width = bitmap.width; let height = bitmap.height; let rotation = Number(values.rotation || 0);
    if (engine === 'id-photo') { const ratio = Number(values.width) / Number(values.height); if (!(ratio > 0 && ratio < 10)) throw new RangeError('Enter valid photo dimensions.'); if (width / height > ratio) width = height * ratio; else height = width / ratio; const dpi = Number(values.dpi); if (!Number.isFinite(dpi) || dpi < 72 || dpi > 600) throw new RangeError('Choose print resolution from 72 to 600 DPI.'); const outW = Math.round(Number(values.width) / 25.4 * dpi); const outH = Math.round(Number(values.height) / 25.4 * dpi); if (outW * outH > 20_000_000) throw new RangeError('The selected print dimensions are too large for this device.'); canvas.width = outW; canvas.height = outH; }
    else { if (![0, 90, 180, 270].includes(rotation)) rotation = 0; canvas.width = rotation % 180 ? height : width; canvas.height = rotation % 180 ? width : height; }
    context.save();
    if (engine === 'image-editor') context.filter = `brightness(${100 + Number(values.brightness || 0)}%) contrast(${100 + Number(values.contrast || 0)}%) saturate(${100 + Number(values.saturation || 0)}%)`;
    if (engine === 'id-photo') { const sx = (bitmap.width - width) / 2; const sy = (bitmap.height - height) / 2; context.drawImage(bitmap, sx, sy, width, height, 0, 0, canvas.width, canvas.height); }
    else if (rotation) { context.translate(canvas.width / 2, canvas.height / 2); context.rotate(rotation * Math.PI / 180); context.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2); }
    else context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    context.restore();
    if (engine === 'watermark') { const label = String(values.text ?? '').trim(); if (!label || label.length > 80) throw new TypeError('Enter watermark text (1–80 characters).'); const opacity = Math.max(5, Math.min(100, Number(values.opacity) || 35)) / 100; context.save(); context.globalAlpha = opacity; context.fillStyle = '#fff'; context.strokeStyle = '#111'; context.lineWidth = Math.max(2, canvas.width / 500); context.textAlign = 'center'; context.font = `bold ${Math.max(18, canvas.width / 18)}px system-ui`; const x = values.position === 'bottom-left' ? canvas.width * .25 : values.position === 'bottom-right' ? canvas.width * .75 : canvas.width / 2; const y = values.position?.startsWith('bottom') ? canvas.height * .92 : canvas.height / 2; context.strokeText(label, x, y); context.fillText(label, x, y); context.restore(); }
    if (engine === 'meme-maker') { context.save(); context.textAlign = 'center'; context.lineJoin = 'round'; context.font = `bold ${Math.max(20, canvas.width / 12)}px Impact, system-ui`; context.lineWidth = Math.max(3, canvas.width / 100); context.strokeStyle = '#111'; context.fillStyle = '#fff'; for (const [text, y] of [[values.top, canvas.height * .12], [values.bottom, canvas.height * .92]]) if (String(text ?? '').trim()) { const clipped = String(text).slice(0, 100); context.strokeText(clipped, canvas.width / 2, y, canvas.width * .94); context.fillText(clipped, canvas.width / 2, y, canvas.width * .94); } context.restore(); }
    canvas.hidden = false; const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png')); if (!blob) throw new Error('Your browser could not create the PNG.'); offerDownload(root, blob, `${engine}-usefulverse.png`); displayOutput(root, `${canvas.width} × ${canvas.height} px · ${Math.ceil(blob.size / 1024)} KB`); setStatus(root, 'Result ready. This calculation runs locally in your browser.', 'success');
  } finally { bitmap.close(); }
}

function drawFunctionGraph(root, rows) {
  const svg = $('[data-function-graph]', root); if (!svg) return;
  const points = rows.split(/\r?\n/u).map((row) => row.split(',').map(Number)).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (points.length < 2) return;
  const minX = Math.min(...points.map(([x]) => x)); const maxX = Math.max(...points.map(([x]) => x)); const minY = Math.min(...points.map(([, y]) => y)); const maxY = Math.max(...points.map(([, y]) => y));
  const sx = (x) => 32 + (x - minX) / (maxX - minX || 1) * 576; const sy = (y) => 328 - (y - minY) / (maxY - minY || 1) * 296;
  const path = points.map(([x, y], index) => `${index ? 'L' : 'M'}${sx(x).toFixed(2)},${sy(y).toFixed(2)}`).join(' ');
  svg.innerHTML = `<title>${svg.querySelector('title')?.textContent ?? 'Graph'}</title><path d="M32 180H608M320 32V328" stroke="currentColor" opacity=".2" fill="none"/><path d="${path}" fill="none" stroke="currentColor" stroke-width="3" vector-effect="non-scaling-stroke"/>`;
}

function setupSandbox(root) {
  const frame = $('[data-code-preview]', root);
  if (!frame) return;
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-op-calculate]')) return;
    const values = valuesFrom(root); const html = String(values.html ?? '').slice(0, 100_000); const css = String(values.css ?? '').slice(0, 100_000); const js = String(values.javascript ?? '').slice(0, 100_000);
    const documentText = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'"><style>${css}</style>${html}<script>${js.replaceAll('</script', '<\\/script')}</script>`;
    frame.srcdoc = documentText; setStatus(root, 'Result ready. This calculation runs locally in your browser.', 'success');
  });
}

function setupMetronome(root) {
  let context; let timer; let beat = 0; let tapTimes = [];
  const bpmInput = $('[data-op-field="bpm"]', root); const beatsInput = $('[data-op-field="beats"]', root);
  const start = $('[data-op-start]', root); const stop = $('[data-op-stop]', root); const tap = $('[data-op-tap]', root);
  const tick = () => {
    if (!context) return;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = beat === 0 ? 1320 : 880;
    gain.gain.setValueAtTime(0.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.004); gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.045);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.05);
    beat = (beat + 1) % Number(beatsInput.value || 4);
  };
  const stopPlaying = () => { clearInterval(timer); timer = undefined; if (start) start.disabled = false; if (stop) stop.disabled = true; if (context && context.state !== 'closed') { context.close().catch(() => {}); context = undefined; } setStatus(root, 'Metronome stopped.'); };
  start.addEventListener('click', async () => {
    const bpm = Number(bpmInput.value);
    if (!Number.isFinite(bpm) || bpm < 20 || bpm > 300) return setStatus(root, 'Enter a tempo from 20 to 300 BPM.', 'error');
    try { const AudioContextType = window.AudioContext || window.webkitAudioContext; if (!AudioContextType) throw new Error('audio unavailable'); context ??= new AudioContextType(); await context.resume(); clearInterval(timer); beat = 0; tick(); timer = setInterval(tick, 60000 / bpm); start.disabled = true; stop.disabled = false; setStatus(root, 'Metronome is playing. Audio stays in this browser.', 'success'); }
    catch { setStatus(root, 'Audio could not start. Check your browser audio settings.', 'error'); }
  });
  stop.addEventListener('click', stopPlaying);
  tap.addEventListener('click', () => {
    const now = performance.now(); tapTimes = [...tapTimes.filter((time) => now - time < 5000), now];
    if (tapTimes.length >= 2) { const intervals = tapTimes.slice(1).map((time, index) => time - tapTimes[index]); const bpm = Math.round(60000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length)); bpmInput.value = String(Math.max(20, Math.min(300, bpm))); setStatus(root, 'Tempo: ' + bpmInput.value + ' BPM.', 'success'); }
    else setStatus(root, 'Tap again to measure the tempo.');
  });
  window.addEventListener('pagehide', stopPlaying, { once: true });
}

function setupKeyboard(root) {
  const area = $('.op-keyboard', root); const keys = new Map($$('kbd[data-key]', root).map((item) => [item.dataset.key.toLowerCase(), item]));
  area.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const key = keys.get(event.key.toLowerCase());
    if (key) { key.classList.add('is-pressed'); setTimeout(() => key.classList.remove('is-pressed'), 180); }
    setStatus(root, 'Key received: ' + (event.key === ' ' ? 'Space' : event.key), 'success');
  });
}

function setupMouse(root) {
  const pad = $('#op-mouse-pad', root); const clicks = []; const last = $('#op-mouse-last', root); const cps = $('#op-mouse-cps', root); const wheel = $('#op-mouse-wheel', root);
  const register = (button) => {
    const now = performance.now(); clicks.push(now); while (clicks.length && now - clicks[0] > 1000) clicks.shift();
    last.textContent = [say('Left button'), say('Middle button'), say('Right button')][button] ?? String(button); cps.textContent = String(clicks.length); setStatus(root, 'Mouse event detected.', 'success');
  };
  pad.addEventListener('mousedown', (event) => register(event.button)); pad.addEventListener('contextmenu', (event) => event.preventDefault());
  pad.addEventListener('wheel', (event) => { wheel.textContent = event.deltaY < 0 ? say('Up') : say('Down'); setStatus(root, 'Wheel event detected.', 'success'); }, { passive: true });
  $$('[data-mouse-button]', root).forEach((button) => { button.addEventListener('mousedown', (event) => event.stopPropagation()); button.addEventListener('click', () => register(Number(button.dataset.mouseButton))); });
  window.addEventListener('blur', () => { clicks.length = 0; cps.textContent = '0'; });
}

function setupReaction(root) {
  const prompt = $('#op-reaction-prompt', root); const result = $('#op-reaction-result', root); const button = $('[data-op-start]', root);
  const times = []; let timer; let waiting = false; let startedAt = 0;
  const beginRound = () => {
    waiting = false; button.textContent = say('Wait…'); button.disabled = true; button.classList.remove('is-ready');
    timer = setTimeout(() => { waiting = true; startedAt = performance.now(); button.disabled = false; button.textContent = say('Click now!'); button.classList.add('is-ready'); }, 1400 + Math.random() * 2400);
  };
  button.addEventListener('click', () => {
    if (button.dataset.opStart !== 'ready') { button.dataset.opStart = 'ready'; times.length = 0; result.textContent = '—'; prompt.textContent = say('Wait until the panel turns green, then click.'); setStatus(root, 'Round 1 of 5.'); beginRound(); return; }
    if (!waiting) { clearTimeout(timer); button.dataset.opStart = ''; button.disabled = false; button.classList.remove('is-ready'); button.textContent = say('Start test'); prompt.textContent = say('Too soon — wait for green, then start again.'); return setStatus(root, 'False start. No result was counted.', 'error'); }
    waiting = false; times.push(performance.now() - startedAt); button.classList.remove('is-ready');
    if (times.length >= 5) { const sorted = [...times].sort((a, b) => a - b); result.textContent = Math.round(sorted[2]) + ' ms · ' + times.map(Math.round).join(', ') + ' ms'; prompt.textContent = say('Median of five rounds'); button.dataset.opStart = ''; button.disabled = false; button.textContent = say('Try again'); setStatus(root, 'Test complete. The result stays on this device.', 'success'); }
    else { button.textContent = say('Wait…'); button.disabled = true; setStatus(root, 'Round ' + (times.length + 1) + ' of 5.'); beginRound(); }
  });
  window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });
}

function setupNotepad(root) {
  const content = $('[data-notepad-content]', root); const search = $('[data-notepad-search]', root); const optIn = $('[data-notepad-opt-in]', root);
  const key = 'usefulverse.local-notepad.v1';
  search.addEventListener('input', () => {
    const query = search.value.trim();
    if (!query) return setStatus(root, 'Enter text to search this note.');
    const matches = content.value.toLocaleLowerCase().split(query.toLocaleLowerCase()).length - 1;
    setStatus(root, `${matches} matching occurrence${matches === 1 ? '' : 's'} found in this note.`);
  });
  $('[data-notepad-save]', root).addEventListener('click', () => {
    if (!optIn.checked) return setStatus(root, 'Check the save option first. Your note is not stored otherwise.', 'error');
    try { localStorage.setItem(key, content.value); setStatus(root, 'Note saved in this browser profile only.', 'success'); }
    catch { setStatus(root, 'Browser storage is unavailable or full. Download a copy instead.', 'error'); }
  });
  $('[data-notepad-load]', root).addEventListener('click', () => {
    try { const saved = localStorage.getItem(key); if (saved === null) return setStatus(root, 'No saved note was found in this browser.', 'error'); content.value = saved; setStatus(root, 'Saved note loaded on this device.', 'success'); }
    catch { setStatus(root, 'Browser storage is unavailable.', 'error'); }
  });
  $('[data-notepad-delete]', root).addEventListener('click', () => {
    try { localStorage.removeItem(key); setStatus(root, 'Saved note deleted from this browser.', 'success'); }
    catch { setStatus(root, 'Browser storage is unavailable.', 'error'); }
  });
  $('[data-notepad-download]', root).addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([content.value], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-note.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus(root, 'Text file prepared by your browser.', 'success');
  });
}

function setupTeleprompter(root) {
  const source = $('#op-teleprompter-source', root); const viewport = $('[data-teleprompter-viewport]', root); const output = $('[data-teleprompter-output]', root);
  const speed = $('[data-teleprompter-speed]', root); const size = $('[data-teleprompter-size]', root); const button = $('[data-teleprompter-start]', root); const mirror = $('[data-teleprompter-mirror]', root);
  const speedLabel = $('[data-teleprompter-speed-label]', root); const sizeLabel = $('[data-teleprompter-size-label]', root);
  let frame = 0; let previous = 0; let running = false;
  const tick = (time) => {
    if (!running) return;
    if (previous) viewport.scrollTop += (time - previous) * Number(speed.value) * Number(size.value) / 300000;
    previous = time; frame = requestAnimationFrame(tick);
  };
  const stop = () => { running = false; cancelAnimationFrame(frame); previous = 0; };
  speed.addEventListener('input', () => { speedLabel.value = speed.value; speedLabel.textContent = speed.value; });
  size.addEventListener('input', () => { sizeLabel.value = `${size.value} px`; sizeLabel.textContent = `${size.value} px`; output.style.fontSize = `${size.value}px`; });
  mirror.addEventListener('change', () => { output.style.transform = mirror.checked ? 'scaleX(-1)' : ''; });
  button.addEventListener('click', () => {
    if (running) { stop(); button.textContent = say('Start scrolling'); return setStatus(root, 'Scrolling paused.'); }
    if (source.value.trim()) output.textContent = source.value;
    if (!output.textContent.trim() || output.textContent === say('Your script will appear here.')) return setStatus(root, 'Paste or type a script first.', 'error');
    output.style.fontSize = `${size.value}px`; running = true; button.textContent = say('Pause scrolling'); frame = requestAnimationFrame(tick); setStatus(root, 'Teleprompter is scrolling in this browser.', 'success');
  });
  $('[data-teleprompter-reset]', root).addEventListener('click', () => { stop(); viewport.scrollTop = 0; output.textContent = source.value || say('Your script will appear here.'); button.textContent = say('Start scrolling'); setStatus(root, 'Script position reset.'); });
  source.addEventListener('input', () => { if (!running) output.textContent = source.value || say('Your script will appear here.'); });
  window.addEventListener('pagehide', stop, { once: true });
}

export function setupOpportunityTool(id, root) {
  const engine = root.dataset.opEngine;
  if (engine === 'notepad') { setupNotepad(root); return; }
  if (engine === 'teleprompter') { setupTeleprompter(root); return; }
  if (engine === 'sqlite-playground') { setupSqlite(root); return; }
  if (engine === 'latex-renderer') setupLatex(root);
  if (engine === 'pixel-art') setupPixelArt(root);
  if (['guitar-tuner', 'webcam-tester'].includes(engine)) { setupDeviceTools(engine, root); return; }
  if (engine === 'virtual-piano') { setupPiano(root); return; }
  if (engine === 'noise-generator') setupNoise(root);
  if (engine === 'speaker-tester') { setupSpeaker(root); return; }
  if (engine === 'code-playground') setupSandbox(root);
  if (engine === 'metronome') setupMetronome(root);
  if (engine === 'keyboard') setupKeyboard(root);
  if (engine === 'mouse') setupMouse(root);
  if (engine === 'reaction') setupReaction(root);
  const toggleModeFields = () => {
    const mode = $('[data-op-field="mode"]', root)?.value;
    const visibility = engine === 'commission'
      ? { knownCommission: mode === 'rate', rate: mode !== 'rate' }
      : engine === 'credit-payoff'
        ? { payment: mode !== 'minimum', minimumPercent: mode === 'minimum', minimumFloor: mode === 'minimum' }
        : {};
    for (const [field, shown] of Object.entries(visibility)) {
      const input = $(`[data-op-field="${field}"]`, root);
      const label = input?.closest('label');
      if (label) { label.hidden = !shown; input.disabled = !shown; }
    }
    $$('[data-op-show-when]', root).forEach((section) => {
      const rules = JSON.parse(section.dataset.opShowWhen);
      const shown = Object.entries(rules).every(([field, value]) => $(`[data-op-field="${field}"]`, root)?.value === value);
      section.hidden = !shown;
      $$('[data-op-field]', section).forEach((input) => { input.disabled = !shown; });
    });
  };
  $$('[data-op-field="mode"], [data-op-field="test"]', root).forEach((input) => input.addEventListener('change', toggleModeFields));
  toggleModeFields();
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-op-calculate]')) {
      if (engine === 'latex-renderer') return;
      try {
        const values = valuesFrom(root);
        if (engine === 'pixel-art') return;
        if (['image-editor', 'watermark', 'id-photo', 'meme-maker'].includes(engine)) return await runImageTool(engine, values, root);
        if (engine === 'chart-maker') { drawChart(root, values); setStatus(root, 'Chart created locally in this browser.', 'success'); return; }
        if (engine === 'diagram-maker') { drawDiagram(root, values.steps); setStatus(root, 'Diagram created locally in this browser.', 'success'); return; }
        if (engine === 'hex-editor' && values.file instanceof File) {
          if (values.file.size > 1024 * 1024) throw new RangeError('Choose a file up to 1 MiB for this in-browser hex preview.');
          const bytes = new Uint8Array(await values.file.arrayBuffer());
          values.hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join(' ');
          $('[data-op-field="hex"]', root).value = values.hex;
        }
        if (engine === 'svg-optimizer' && values.file instanceof File && !String(values.svg ?? '').trim()) values.svg = await values.file.text();
        const result = calculateOpportunity(engine, values);
        displayOutput(root, result);
        if (engine === 'svg-optimizer') offerDownload(root, new Blob([result], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-optimized.svg');
        if (engine === 'hex-editor') {
          const byteValues = values.hex.trim().split(/[\s,]+/u).map((byte) => Number.parseInt(byte.replace(/^0x/iu, ''), 16));
          offerDownload(root, new Blob([new Uint8Array(byteValues)], { type: 'application/octet-stream' }), 'usefulverse-edited.bin');
        }
        if (engine === 'function-graph') drawFunctionGraph(root, result);
        setStatus(root, 'Result ready. This calculation runs locally in your browser.', 'success');
      }
      catch (error) { displayOutput(root, ''); setStatus(root, error instanceof Error ? error.message : 'Check your inputs and try again.', 'error'); }
    }
    if (event.target.closest('[data-op-clear]')) { $$('[data-op-field]', root).forEach((item) => { item.value = item.tagName === 'SELECT' ? item.options[0]?.value ?? '' : ''; }); displayOutput(root, ''); setStatus(root, 'Fields cleared.'); }
    if (event.target.closest('[data-op-copy]')) await copyResult(root);
    if (event.target.closest('[data-op-print]')) printDocument(root);
  });
}
