import { calculateOpportunity, calculateTeleprompterScrollRate, countTeleprompterWords, flashcardProgress, makeNoiseSamples } from './opportunity-logic.mjs';
import { buildStudyPlan } from './study-planner-logic.mjs';
import { createMentalMathProblem, parseMentalMathAnswer, validateMentalMathSettings } from './mental-math-logic.mjs';
import { budgetCsvCell, parseBudgetAmount, summarizeBudget, validateBudgetTransaction } from './household-budget-logic.mjs';
import { advanceTournamentBracketWinner, createTournamentBracket, getTournamentChampion, parseTournamentEntrants } from './tournament-bracket-logic.mjs';
import { skipOverdueMetronomeBeats } from './metronome-logic.mjs';

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
  if (root.dataset.tool === 'business-card-maker') {
    const lines = output.value.split(/\r?\n/u).filter((line) => line.trim());
    const card = lines.map((line, index) => `<div class="card-line${index ? '' : ' card-line--name'}">${line.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</div>`).join('');
    printWindow.document.write('<!doctype html><html lang="' + locale + '"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + say('Print preview') + '</title><style>@page{margin:12mm}body{margin:0;color:#151924;font:10pt/1.35 system-ui,sans-serif}.business-card{width:3.5in;min-height:2in;box-sizing:border-box;padding:.22in;border:1px solid #cbd5e1;border-radius:.08in;display:flex;flex-direction:column;justify-content:center;gap:.035in;overflow-wrap:anywhere}.card-line--name{font-size:17pt;font-weight:700;margin-bottom:.06in}.card-line:nth-child(2){font-weight:600;color:#334155}@media screen{body{padding:24px}.business-card{box-shadow:0 2px 12px #0002}}@media print{.business-card{break-inside:avoid;box-shadow:none}}</style><article class="business-card">' + card + '</article></html>');
  } else {
    printWindow.document.write('<!doctype html><html lang="' + locale + '"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + say('Print preview') + '</title><style>body{max-width:800px;margin:48px auto;padding:0 24px;font:16px/1.55 system-ui,sans-serif;color:#151924}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit}@media print{body{margin:0}}</style><pre>' + escaped + '</pre>');
  }
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

function setupFlashcardStudy(root) {
  const study = $('[data-flashcard-study]', root);
  if (!study) return;
  const input = $('[data-op-field="cards"]', root);
  const save = $('[data-flashcard-save]', root);
  const load = $('[data-flashcard-load]', root);
  const remove = $('[data-flashcard-delete]', root);
  const storageKey = 'usefulverse:flashcards:v1';
  let deck = []; let index = 0; let known = 0;
  const refreshSaveControls = () => {
    save.disabled = deck.length === 0;
    try {
      const hasSavedDeck = localStorage.getItem(storageKey) !== null;
      load.disabled = !hasSavedDeck; remove.disabled = !hasSavedDeck;
    } catch { load.disabled = true; remove.disabled = true; }
  };
  const render = () => {
    if (!deck.length) { study.hidden = true; return; }
    const card = deck[index];
    $('[data-flashcard-front]', study).textContent = card.front;
    $('[data-flashcard-back]', study).textContent = card.back;
    $('[data-flashcard-back]', study).hidden = true;
    $('[data-flashcard-show]', study).hidden = false;
    const progress = flashcardProgress(known, index, deck.length);
    $('[data-flashcard-count]', study).textContent = say('Card {current} of {total}').replace('{current}', String(progress.current)).replace('{total}', String(progress.total));
    $('[data-flashcard-previous]', study).disabled = index === 0;
    $('[data-flashcard-next]', study).disabled = index === deck.length - 1;
    save.disabled = false;
  };
  refreshSaveControls();
  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-op-calculate]')) {
      try {
        const raw = input?.value ?? '';
        const lines = raw.split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
        deck = lines.map((line) => {
          const comma = line.indexOf(',');
          if (comma < 1) return null;
          return { front: line.slice(0, comma).trim(), back: line.slice(comma + 1).trim() };
        }).filter((card) => card?.front && card.back);
        if (!lines.length || deck.length !== lines.length || deck.length > 200) throw new TypeError('Each line needs a term, comma, and definition.');
        index = 0; known = 0; study.hidden = false; render(); refreshSaveControls();
      } catch (error) {
        event.stopImmediatePropagation(); deck = []; index = 0; known = 0; study.hidden = true; refreshSaveControls();
        setStatus(root, error instanceof Error ? error.message : 'Each line needs a term, comma, and definition.', 'error');
      }
    }
    if (event.target.closest('[data-flashcard-save]')) {
      try {
        if (!deck.length) throw new TypeError('Create a deck before saving it.');
        localStorage.setItem(storageKey, JSON.stringify({ version: 1, deck, index, known }));
        refreshSaveControls(); setStatus(root, 'Plan saved on this device.', 'success');
      } catch (error) {
        setStatus(root, error instanceof Error && error.message === 'Create a deck before saving it.' ? error.message : 'Could not save the plan. Browser storage may be full or disabled.', 'error');
      }
      return;
    }
    if (event.target.closest('[data-flashcard-load]')) {
      let raw;
      try {
        raw = localStorage.getItem(storageKey);
      } catch { return setStatus(root, 'Could not load the saved plan in this browser.', 'error'); }
      if (raw === null) return setStatus(root, 'No saved plan was found on this device.', 'error');
      try {
        const saved = JSON.parse(raw);
        const validDeck = Array.isArray(saved?.deck) && saved.deck.length > 0 && saved.deck.length <= 200
          && saved.deck.every((card) => typeof card?.front === 'string' && typeof card?.back === 'string'
            && card.front.trim() && card.back.trim() && card.front.length <= 5000 && card.back.length <= 5000);
        if (saved?.version !== 1 || !validDeck || !Number.isInteger(saved.index) || saved.index < 0 || saved.index >= saved.deck.length
            || !Number.isInteger(saved.known) || saved.known < 0 || saved.known + saved.deck.length > 200) throw new TypeError('Invalid deck state');
        deck = saved.deck.map(({ front, back }) => ({ front, back })); index = saved.index; known = saved.known;
        input.value = deck.map(({ front, back }) => `${front},${back}`).join('\n');
        study.hidden = false; render(); refreshSaveControls(); displayOutput(root, deck.map(({ front, back }) => `${front}, ${back}`).join('\n'));
        setStatus(root, 'Saved plan loaded.', 'success');
      } catch { setStatus(root, 'Saved plan is not valid.', 'error'); }
      return;
    }
    if (event.target.closest('[data-flashcard-delete]')) {
      try { localStorage.removeItem(storageKey); refreshSaveControls(); setStatus(root, 'Saved plan deleted from this device.', 'success'); }
      catch { setStatus(root, 'Could not delete the saved plan in this browser.', 'error'); }
      return;
    }
    if (!deck.length) return;
    if (event.target.closest('[data-flashcard-show]')) {
      $('[data-flashcard-back]', study).hidden = false;
      $('[data-flashcard-show]', study).hidden = true;
    }
    if (event.target.closest('[data-flashcard-known]')) {
      known += 1;
      deck.splice(index, 1);
      if (!deck.length) { study.hidden = true; refreshSaveControls(); setStatus(root, 'Done.', 'success'); return; }
      index = Math.min(index, deck.length - 1); render(); refreshSaveControls();
    }
    if (event.target.closest('[data-flashcard-again]')) { const oldIndex = index; const [card] = deck.splice(index, 1); deck.push(card); index = oldIndex >= deck.length - 1 ? 0 : oldIndex; render(); }
    if (event.target.closest('[data-flashcard-previous]') && index > 0) { index -= 1; render(); }
    if (event.target.closest('[data-flashcard-next]') && index < deck.length - 1) { index += 1; render(); }
    if (event.target.closest('[data-flashcard-shuffle]')) {
      for (let i = deck.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
      index = 0; render();
    }
  });
}

function addSvgElement(parent, name, attrs = {}, text = '') {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  if (text) node.textContent = text;
  parent.append(node);
  return node;
}

function drawDiagram(root, text, { downloadable = false } = {}) {
  const svg = $('[data-op-svg]', root); if (!svg) return;
  const steps = String(text ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (steps.length < 2 || steps.length > 12 || steps.some((step) => [...step].length > 48)) throw new TypeError($('.diagram-maker', root)?.dataset.diagramInvalid ?? say('Check your inputs and try again.'));
  const width = 640; const rowHeight = 92; const height = Math.max(210, steps.length * rowHeight + 20);
  svg.replaceChildren(); svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  addSvgElement(svg, 'title', {}, $('.diagram-maker', root)?.dataset.diagramTitle ?? say('Diagram steps'));
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = addSvgElement(defs, 'marker', { id: 'usefulverse-diagram-arrow', markerWidth: 8, markerHeight: 8, refX: 4, refY: 4, orient: 'auto' });
  addSvgElement(marker, 'path', { d: 'M0 0L8 4L0 8Z', fill: '#475569' });
  svg.append(defs);
  steps.forEach((step, index) => {
    const y = 10 + index * rowHeight;
    if (index) addSvgElement(svg, 'path', { d: `M320 ${y - 14}V${y + 1}`, stroke: '#475569', 'stroke-width': 2, 'marker-end': 'url(#usefulverse-diagram-arrow)' });
    addSvgElement(svg, 'rect', { x: 80, y, width: 480, height: 68, rx: 10, fill: '#f8fafc', stroke: '#475569', 'stroke-width': 2 });
    const textNode = addSvgElement(svg, 'text', { x: 320, y: y + 41 - ([...step].length > 26 ? 9 : 0), 'text-anchor': 'middle', 'font-size': 16, fill: '#111827' });
    const chars = typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(step)].map(({ segment }) => segment) : [...step];
    const lines = [];
    for (let start = 0; start < chars.length; start += 26) lines.push(chars.slice(start, start + 26).join(''));
    lines.forEach((line, lineIndex) => addSvgElement(textNode, 'tspan', { x: 320, dy: lineIndex ? 20 : 0 }, line));
  });
  svg.hidden = false;
  displayOutput(root, steps.join('\n'));
  const download = $('[data-op-download]', root);
  if (downloadable) offerSvg(root, svg, 'usefulverse-process.svg');
  if (download) download.hidden = !downloadable;
  return steps;
}

function setupDiagramMaker(root) {
  const input = $('[data-op-field="steps"]', root);
  const editor = $('.diagram-maker', root);
  const list = $('[data-diagram-steps]', root);
  const svg = $('[data-op-svg]', root);
  const output = $('#op-output', root);
  const download = $('[data-op-download]', root);
  const stepsFromInput = () => input.value.split(/\r?\n/u).map((step) => step.trim()).filter(Boolean);
  const clearExport = () => {
    if (download?.dataset.objectUrl) URL.revokeObjectURL(download.dataset.objectUrl);
    if (download) { download.removeAttribute('href'); delete download.dataset.objectUrl; download.hidden = true; }
  };
  const renderList = () => {
    const steps = stepsFromInput();
    list.replaceChildren();
    steps.forEach((step, index) => {
      const item = document.createElement('li');
      const text = document.createElement('span'); text.textContent = `${index + 1}. ${step}`;
      const actions = document.createElement('div'); actions.className = 'tool-actions';
      const makeAction = (label, action, disabled = false) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost';
        button.textContent = label; button.setAttribute('aria-label', `${label}: ${step}`); button.dataset.diagramAction = action; button.dataset.diagramIndex = String(index); button.disabled = disabled; return button;
      };
      actions.append(makeAction(editor.dataset.diagramMoveUp, 'up', index === 0), makeAction(editor.dataset.diagramMoveDown, 'down', index === steps.length - 1), makeAction(editor.dataset.diagramRemoveStep, 'remove'));
      item.append(text, actions); list.append(item);
    });
  };
  const preview = () => {
    const steps = stepsFromInput();
    if (steps.length < 2 || steps.length > 12 || steps.some((step) => [...step].length > 48)) {
      if (svg) { svg.replaceChildren(); svg.hidden = true; }
      if (output) output.value = '';
      clearExport();
      return false;
    }
    try { drawDiagram(root, steps.join('\n')); return true; }
    catch { clearExport(); return false; }
  };
  input.addEventListener('input', () => { renderList(); preview(); clearExport(); });
  root.addEventListener('click', (event) => {
    const action = event.target.closest('[data-diagram-action]');
    if (action) {
      const steps = stepsFromInput(); const index = Number(action.dataset.diagramIndex); const type = action.dataset.diagramAction;
      if (!Number.isInteger(index) || index < 0 || index >= steps.length) return;
      if (type === 'remove') steps.splice(index, 1);
      else {
        const target = type === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= steps.length) return;
        [steps[index], steps[target]] = [steps[target], steps[index]];
      }
      input.value = steps.join('\n'); renderList(); preview(); clearExport();
      return;
    }
    if (event.target.closest('[data-diagram-add]')) {
      const steps = stepsFromInput();
      if (steps.length >= 12) return setStatus(root, editor.dataset.diagramInvalid, 'error');
      const base = input.value.trimEnd(); const separator = base ? '\n' : '';
      const start = base.length + separator.length;
      input.value = `${base}${separator}${editor.dataset.diagramNewStep}`; renderList(); preview(); clearExport(); input.focus();
      input.setSelectionRange(start, input.value.length); setStatus(root, 'Values are processed locally in this browser.');
      return;
    }
    if (event.target.closest('[data-diagram-create]')) {
      try { drawDiagram(root, input.value, { downloadable: true }); setStatus(root, 'Result ready. This calculation runs locally in your browser.', 'success'); }
      catch (error) { clearExport(); setStatus(root, error instanceof Error ? error.message : 'Check your inputs and try again.', 'error'); }
      return;
    }
    if (event.target.closest('[data-diagram-clear]')) {
      input.value = ''; list.replaceChildren(); svg.replaceChildren(); svg.hidden = true; output.value = ''; clearExport();
      setStatus(root, 'Fields cleared.'); input.focus();
      return;
    }
    if (event.target.closest('[data-op-copy]')) copyResult(root);
  });
  window.addEventListener('pagehide', clearExport, { once: true });
  renderList();
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
  let context; let node; let gain; let stopTimer;
  const stopAfter = $('[data-op-field="stop-after"]', root);
  const stop = (announce = false) => { clearTimeout(stopTimer); stopTimer = undefined; try { node?.stop(); } catch {} node?.disconnect(); gain?.disconnect(); node = undefined; gain = undefined; if (context && context.state !== 'closed') context.close().catch(() => {}); context = undefined; $('[data-device-start]', root).disabled = false; $('[data-device-stop]', root).disabled = true; if (announce) setStatus(root, 'Noise stopped.'); };
  const scheduleStop = () => {
    clearTimeout(stopTimer); stopTimer = undefined;
    if (!node || !stopAfter) return;
    const minutes = Number(stopAfter.value);
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 720) { stopAfter.setAttribute('aria-invalid', 'true'); setStatus(root, say('Check your inputs and try again.'), 'error'); return; }
    stopAfter.removeAttribute('aria-invalid');
    if (minutes > 0) stopTimer = setTimeout(() => stop(true), minutes * 60_000);
  };
  $('[data-op-field="volume"]', root)?.addEventListener('input', (event) => {
    if (!context || !gain) return;
    const target = Math.min(0.5, Math.max(0, Number(event.currentTarget.value) / 100 || 0));
    gain.gain.setTargetAtTime(target, context.currentTime, 0.04);
  });
  stopAfter?.addEventListener('input', scheduleStop);
  $('[data-device-start]', root)?.addEventListener('click', async () => { try {
    const color = $('[data-op-field="color"]', root).value;
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) throw new Error(say('Audio could not start. Check your browser audio settings.'));
    context = new AudioContextType(); await context.resume();
    if (context.state !== 'running') throw new Error(say('Audio could not start. Check your browser audio settings.'));
    const length = Math.min(Math.ceil(context.sampleRate * 2), 192_000);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    buffer.getChannelData(0).set(makeNoiseSamples(color, length));
    node = context.createBufferSource(); node.buffer = buffer; node.loop = true;
    gain = context.createGain(); gain.gain.value = Math.min(0.5, Math.max(0.01, Number($('[data-op-field="volume"]', root).value) / 100 || 0.15));
    node.connect(gain).connect(context.destination); node.start();
    $('[data-device-start]', root).disabled = true; $('[data-device-stop]', root).disabled = false;
    scheduleStop(); setStatus(root, 'Noise is playing in your browser.', 'success');
  } catch (error) { stop(); setStatus(root, error instanceof Error ? error.message : say('Audio could not start. Check your browser audio settings.'), 'error'); } });
  $('[data-device-stop]', root)?.addEventListener('click', () => stop(true)); window.addEventListener('pagehide', stop, { once: true });
}

function setupPiano(root) {
  let context; const active = new Map(); const pending = new Map(); const held = new Set(); const keyNotes = new Map([['a', 60], ['w', 61], ['s', 62], ['e', 63], ['d', 64], ['f', 65], ['t', 66], ['g', 67], ['y', 68], ['h', 69], ['u', 70], ['j', 71], ['k', 72]]);
  const volume = $('[data-piano-volume]', root);
  const noteOn = async (midi, button) => {
    if (active.has(midi) || pending.has(midi)) return;
    const activation = Symbol(); pending.set(midi, activation);
    try {
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextType) throw new Error('audio unavailable');
      context ??= new AudioContextType(); await context.resume();
      if (pending.get(midi) !== activation || !held.has(midi) || context.state !== 'running') return;
      const osc = context.createOscillator(); const gain = context.createGain();
      osc.frequency.value = 440 * 2 ** ((midi - 69) / 12); gain.gain.value = 0.0001;
      osc.connect(gain).connect(context.destination); osc.start();
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, Number(volume.value) / 100 * 0.2), context.currentTime + 0.015);
      active.set(midi, { osc, gain, button }); button?.classList.add('is-pressed');
    } finally { if (pending.get(midi) === activation) pending.delete(midi); }
  };
  const noteOff = (midi) => { const item = active.get(midi); if (!item) return; item.gain.gain.setTargetAtTime(0.0001, context.currentTime, 0.04); item.osc.stop(context.currentTime + 0.2); item.button?.classList.remove('is-pressed'); active.delete(midi); };
  const release = (midi) => { held.delete(midi); pending.delete(midi); noteOff(midi); };
  volume?.addEventListener('input', () => { const level = Number(volume.value) / 100 * 0.2; for (const { gain } of active.values()) gain.gain.setTargetAtTime(Math.max(0.0001, level), context.currentTime, 0.02); });
  $$('[data-midi]', root).forEach((button) => { const midi = Number(button.dataset.midi); button.addEventListener('pointerdown', (event) => { event.preventDefault(); held.add(midi); noteOn(midi, button).catch(() => setStatus(root, 'Audio could not start.', 'error')); }); button.addEventListener('pointerup', () => release(midi)); button.addEventListener('pointerleave', () => release(midi)); button.addEventListener('pointercancel', () => release(midi)); button.addEventListener('lostpointercapture', () => release(midi)); });
  const down = (event) => { if (event.repeat || event.target.closest('input, textarea, select, [contenteditable="true"]')) return; const midi = keyNotes.get(event.key.toLowerCase()); if (midi) { event.preventDefault(); held.add(midi); noteOn(midi, $$('[data-midi]', root).find((button) => Number(button.dataset.midi) === midi)).catch(() => setStatus(root, say('Audio could not start. Check your browser audio settings.'), 'error')); } }; const up = (event) => { const midi = keyNotes.get(event.key.toLowerCase()); if (midi) release(midi); };
  const releaseAll = () => { for (const midi of new Set([...held, ...pending.keys(), ...active.keys()])) release(midi); };
  window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', releaseAll); window.addEventListener('pagehide', () => { releaseAll(); context?.close().catch(() => {}); }, { once: true });
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
  let context; let timer; let beat = 0; let tapTimes = []; let nextNoteAt = 0; let startAttempt = 0; let running = false;
  const bpmInput = $('[data-op-field="bpm"]', root); const beatsInput = $('[data-op-field="beats"]', root);
  const start = $('[data-op-start]', root); const stop = $('[data-op-stop]', root); const tap = $('[data-op-tap]', root);
  const lockSettings = (locked) => { bpmInput.disabled = locked; beatsInput.disabled = locked; };
  const scheduleBeat = (when) => {
    if (!context) return;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.frequency.value = beat === 0 ? 1320 : 880;
    gain.gain.setValueAtTime(0.0001, when); gain.gain.exponentialRampToValueAtTime(0.16, when + 0.004); gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(when); oscillator.stop(when + 0.05);
    beat = (beat + 1) % Number(beatsInput.value || 4);
  };
  const scheduleAhead = () => {
    if (!context || context.state !== 'running') return;
    const bpm = Number(bpmInput.value);
    const secondsPerBeat = 60 / bpm;
    const timing = skipOverdueMetronomeBeats({ nextNoteAt, currentTime: context.currentTime, secondsPerBeat, beatIndex: beat, beatsPerBar: Number(beatsInput.value || 4) });
    nextNoteAt = timing.nextNoteAt;
    beat = timing.beatIndex;
    while (nextNoteAt < context.currentTime + 0.12) {
      scheduleBeat(nextNoteAt);
      nextNoteAt += secondsPerBeat;
    }
  };
  const stopPlaying = (announce = true) => {
    startAttempt += 1;
    clearInterval(timer); timer = undefined; running = false;
    if (start) start.disabled = false;
    if (stop) stop.disabled = true;
    lockSettings(false);
    const oldContext = context; context = undefined;
    oldContext?.removeEventListener('statechange', scheduleAhead);
    if (oldContext && oldContext.state !== 'closed') oldContext.close().catch(() => {});
    if (announce) setStatus(root, 'Metronome stopped.');
  };
  start.addEventListener('click', async () => {
    if (start.disabled || running) return;
    const bpm = Number(bpmInput.value);
    if (!Number.isFinite(bpm) || bpm < 20 || bpm > 300) return setStatus(root, 'Enter a tempo from 20 to 300 BPM.', 'error');
    const attempt = ++startAttempt;
    start.disabled = true; stop.disabled = false; lockSettings(true);
    let startingContext;
    try {
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextType) throw new Error('audio unavailable');
      startingContext = new AudioContextType(); context = startingContext;
      await startingContext.resume();
      if (attempt !== startAttempt || context !== startingContext || !root.isConnected) {
        if (startingContext.state !== 'closed') startingContext.close().catch(() => {});
        return;
      }
      running = true; beat = 0; nextNoteAt = startingContext.currentTime + 0.03;
      startingContext.addEventListener('statechange', scheduleAhead);
      scheduleAhead(); timer = setInterval(scheduleAhead, 25);
      setStatus(root, 'Metronome is playing. Audio stays in this browser.', 'success');
    } catch {
      if (attempt !== startAttempt) return;
      stopPlaying(false);
      setStatus(root, 'Audio could not start. Check your browser audio settings.', 'error');
    }
  });
  stop.addEventListener('click', stopPlaying);
  tap.addEventListener('click', () => {
    const now = performance.now(); tapTimes = [...tapTimes.filter((time) => now - time < 5000), now];
    if (tapTimes.length >= 2) { const intervals = tapTimes.slice(1).map((time, index) => time - tapTimes[index]); const bpm = Math.round(60000 / (intervals.reduce((a, b) => a + b, 0) / intervals.length)); bpmInput.value = String(Math.max(20, Math.min(300, bpm))); setStatus(root, 'Tempo: ' + bpmInput.value + ' BPM.', 'success'); }
    else setStatus(root, 'Tap again to measure the tempo.');
  });
  window.addEventListener('pagehide', () => stopPlaying(false), { once: true });
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
  const pad = $('#op-mouse-pad', root); const clicks = []; const last = $('#op-mouse-last', root); const cps = $('#op-mouse-cps', root); const wheel = $('#op-mouse-wheel', root); let decayTimer;
  const refreshClicks = () => {
    const now = performance.now();
    while (clicks.length && now - clicks[0] >= 1000) clicks.shift();
    cps.textContent = String(clicks.length);
    if (clicks.length) decayTimer = setTimeout(refreshClicks, Math.max(1, 1000 - (now - clicks[0])));
    else decayTimer = undefined;
  };
  const register = (button) => {
    const now = performance.now();
    while (clicks.length && now - clicks[0] >= 1000) clicks.shift();
    clicks.push(now); clearTimeout(decayTimer); decayTimer = undefined;
    last.textContent = [say('Left button'), say('Middle button'), say('Right button')][button] ?? String(button); cps.textContent = String(clicks.length); setStatus(root, 'Mouse event detected.', 'success');
    decayTimer = setTimeout(refreshClicks, Math.max(1, 1000 - (now - clicks[0])));
  };
  pad.addEventListener('mousedown', (event) => register(event.button)); pad.addEventListener('contextmenu', (event) => event.preventDefault());
  pad.addEventListener('wheel', (event) => { wheel.textContent = event.deltaY < 0 ? say('Up') : say('Down'); setStatus(root, 'Wheel event detected.', 'success'); }, { passive: true });
  $$('[data-mouse-button]', root).forEach((button) => { button.addEventListener('mousedown', (event) => event.stopPropagation()); button.addEventListener('click', () => register(Number(button.dataset.mouseButton))); });
  window.addEventListener('blur', () => { clearTimeout(decayTimer); decayTimer = undefined; clicks.length = 0; cps.textContent = '0'; });
  window.addEventListener('pagehide', () => clearTimeout(decayTimer), { once: true });
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
  const positionKey = `usefulverse:teleprompter-position:${location.pathname}`;
  let savedPosition = null; let saveTimer = 0; let frame = 0; let previous = 0; let running = false; let restoredSignature = ''; let wordCount = 0;
  try { savedPosition = JSON.parse(sessionStorage.getItem(positionKey) || 'null'); } catch {}
  const textSignature = (text) => {
    let hash = 2166136261;
    for (const character of text) { hash ^= character.codePointAt(0); hash = Math.imul(hash, 16777619); }
    return `${text.length}:${hash >>> 0}`;
  };
  const restorePosition = () => {
    const signature = textSignature(source.value);
    if (restoredSignature === signature) return;
    restoredSignature = signature;
    if (!savedPosition || savedPosition.signature !== signature || !Number.isFinite(savedPosition.top)) return;
    viewport.scrollTop = Math.min(Math.max(0, savedPosition.top), Math.max(0, viewport.scrollHeight - viewport.clientHeight));
  };
  const savePosition = () => {
    if (!source.value) return;
    savedPosition = { signature: textSignature(source.value), top: viewport.scrollTop };
    try { sessionStorage.setItem(positionKey, JSON.stringify(savedPosition)); } catch {}
  };
  const scheduleSave = () => { clearTimeout(saveTimer); saveTimer = window.setTimeout(savePosition, 180); };
  const setPaused = () => { stop(); savePosition(); button.textContent = say('Start scrolling'); setStatus(root, 'Scrolling paused.'); };
  const tick = (time) => {
    if (!running) return;
    const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    if (maxScroll === 0 || viewport.scrollTop >= maxScroll) return setPaused();
    if (previous) viewport.scrollTop = Math.min(maxScroll, viewport.scrollTop + (time - previous) * calculateTeleprompterScrollRate(maxScroll, wordCount, speed.value));
    if (viewport.scrollTop >= maxScroll) return setPaused();
    previous = time; frame = requestAnimationFrame(tick);
  };
  function stop() { running = false; cancelAnimationFrame(frame); previous = 0; }
  const togglePlayback = () => button.click();
  root.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return;
    if (event.code === 'Space') { event.preventDefault(); togglePlayback(); }
    else if (event.key === 'Escape' && running) { event.preventDefault(); setPaused(); }
  });
  speed.addEventListener('input', () => { speedLabel.value = speed.value; speedLabel.textContent = speed.value; });
  size.addEventListener('input', () => { sizeLabel.value = `${size.value} px`; sizeLabel.textContent = `${size.value} px`; output.style.fontSize = `${size.value}px`; });
  mirror.addEventListener('change', () => { output.style.transform = mirror.checked ? 'scaleX(-1)' : ''; });
  button.addEventListener('click', () => {
    if (running) return setPaused();
    if (source.value.trim()) output.textContent = source.value;
    if (!output.textContent.trim() || output.textContent === say('Your script will appear here.')) return setStatus(root, 'Paste or type a script first.', 'error');
    wordCount = countTeleprompterWords(source.value);
    if (wordCount < 1) return setStatus(root, 'Paste or type a script first.', 'error');
    const signature = textSignature(source.value);
    if (savedPosition && savedPosition.signature !== signature) {
      savedPosition = null;
      try { sessionStorage.removeItem(positionKey); } catch {}
      restoredSignature = signature;
    }
    output.style.fontSize = `${size.value}px`; restorePosition();
    if (viewport.scrollHeight <= viewport.clientHeight || viewport.scrollTop >= viewport.scrollHeight - viewport.clientHeight) return setStatus(root, 'Scrolling paused.');
    running = true; previous = 0; button.textContent = say('Pause scrolling'); frame = requestAnimationFrame(tick); setStatus(root, 'Teleprompter is scrolling in this browser.', 'success');
  });
  $('[data-teleprompter-reset]', root).addEventListener('click', () => { stop(); clearTimeout(saveTimer); viewport.scrollTop = 0; savedPosition = null; try { sessionStorage.removeItem(positionKey); } catch {} output.textContent = source.value || say('Your script will appear here.'); button.textContent = say('Start scrolling'); setStatus(root, 'Script position reset.'); });
  source.addEventListener('input', () => {
    if (running) { stop(); button.textContent = say('Start scrolling'); }
    restoredSignature = ''; viewport.scrollTop = 0;
    if (!running) output.textContent = source.value || say('Your script will appear here.');
  });
  viewport.addEventListener('scroll', scheduleSave, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) setPaused(); });
  window.addEventListener('pagehide', () => { clearTimeout(saveTimer); savePosition(); stop(); }, { once: true });
}

function setupStudyPlanner(root) {
  const courses = $('[data-study-courses]', root);
  const template = $('[data-study-course-template]', root);
  const status = $('[data-study-status]', root);
  const results = $('[data-study-results]', root);
  const schedule = $('[data-study-schedule]', root);
  const storageKey = 'usefulverse:study-plan:v1';
  let currentPlan = null;
  const setStudyStatus = (key, type = '') => { status.textContent = say(key); status.className = `tool-status${type ? ` is-${type}` : ''}`; };
  const updateCourseControls = () => {
    const rows = $$('[data-study-course]', courses);
    rows.forEach((row, index) => {
      row.querySelector('[data-study-course-number]').textContent = String(index + 1);
      row.querySelector('[data-study-remove]').disabled = rows.length === 1;
    });
    $('[data-study-add]', root).disabled = rows.length >= 12;
  };
  const readCourses = () => $$('[data-study-course]', courses).map((row) => Object.fromEntries(
    $$('[data-study-field]', row).map((input) => [input.dataset.studyField, input.value]),
  ));
  const fillCourses = (items) => {
    if (!Array.isArray(items) || !items.length || items.length > 12) throw new TypeError(say('Saved plan is not valid.'));
    courses.replaceChildren();
    items.forEach((item, index) => {
      const fragment = template.content.cloneNode(true);
      const row = fragment.querySelector('[data-study-course]');
      for (const input of $$('[data-study-field]', row)) input.value = String(item[input.dataset.studyField] ?? '');
      courses.append(fragment);
    });
    updateCourseControls(); currentPlan = null; results.hidden = true;
  };
  const formatDate = (iso) => new Intl.DateTimeFormat(bundle.tag ?? locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
  const renderPlan = (plan) => {
    currentPlan = plan; results.hidden = false; schedule.replaceChildren();
    $('[data-study-summary]', results).textContent = `${say('Subjects')}: ${plan.subjectCount} · ${say('Sessions')}: ${plan.totalSessions} · ${say('Study time')}: ${plan.studyMinutes} min`;
    const warning = $('[data-study-warning]', results);
    warning.textContent = plan.unfinished.length ? say('Some topics do not fit before the exam dates. Add more time or reduce the workload.') : say('All listed topics fit in this draft schedule.');
    warning.className = `tool-status${plan.unfinished.length ? ' is-error' : ' is-success'}`;
    for (const item of plan.schedule) {
      const row = document.createElement('li');
      const time = document.createElement('time'); time.dateTime = item.date; time.textContent = formatDate(item.date);
      const title = document.createElement('strong'); title.textContent = item.topic;
      const detail = document.createElement('span'); detail.textContent = `${item.subject} · ${say('Session')} ${item.session}/${item.totalSessions} · ${item.minutes} min`;
      row.append(time, title, detail); schedule.append(row);
    }
    for (const task of plan.unfinished) {
      const row = document.createElement('li'); row.className = 'study-schedule__unfinished';
      const title = document.createElement('strong'); title.textContent = task.topic;
      const detail = document.createElement('span'); detail.textContent = `${task.subject} · ${say('Sessions left')}: ${task.remainingSessions}`;
      row.append(title, detail); schedule.append(row);
    }
  };
  $('[data-study-pomodoro]', root).href = location.pathname.replace('/study-planner/', '/online-timer/');
  root.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.matches('[data-study-add]')) {
      if ($$('[data-study-course]', courses).length >= 12) return;
      const fragment = template.content.cloneNode(true); courses.append(fragment); updateCourseControls();
      courses.lastElementChild.querySelector('[data-study-field="name"]').focus();
    }
    if (button.matches('[data-study-remove]')) { button.closest('[data-study-course]').remove(); updateCourseControls(); }
    if (button.matches('[data-study-create]')) {
      try { renderPlan(buildStudyPlan(readCourses())); setStudyStatus('Study schedule created in this browser.', 'success'); }
      catch (error) { setStudyStatus(error.message, 'error'); }
    }
    if (button.matches('[data-study-save]')) {
      try { localStorage.setItem(storageKey, JSON.stringify(readCourses())); setStudyStatus('Study plan saved on this device.', 'success'); }
      catch { setStudyStatus('Could not save the plan. Browser storage may be full or disabled.', 'error'); }
    }
    if (button.matches('[data-study-load]')) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return setStudyStatus('No saved study plan was found on this device.', 'error');
        fillCourses(JSON.parse(saved)); setStudyStatus('Saved study plan loaded.', 'success');
      } catch { setStudyStatus('Saved plan is not valid.', 'error'); }
    }
    if (button.matches('[data-study-download]')) {
      if (!currentPlan) return setStudyStatus('Create a study plan before downloading it.', 'error');
      const blob = new Blob([`${JSON.stringify({ courses: readCourses(), plan: currentPlan }, null, 2)}\n`], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-study-plan.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStudyStatus('Study plan download is ready.', 'success');
    }
    if (button.matches('[data-study-clear]')) {
      try { localStorage.removeItem(storageKey); } catch {}
      courses.replaceChildren(template.content.cloneNode(true)); updateCourseControls(); results.hidden = true; currentPlan = null; setStudyStatus('Saved study plan cleared from this device.');
    }
  });
  updateCourseControls();
}

function setupMentalMath(root) {
  const round = $('[data-mental-round]', root); const question = $('[data-mental-question]', root); const answer = $('[data-mental-answer]', root);
  const check = $('[data-mental-check]', root); const next = $('[data-mental-next]', root); const stats = $('[data-mental-stats]', root);
  const feedback = $('[data-mental-feedback]', root); const status = $('[data-mental-status]', root);
  let problems = []; let index = 0; let score = 0; let streak = 0; let startedAt = 0; let timer;
  const elapsed = () => Math.floor((performance.now() - startedAt) / 1000);
  const timeLabel = () => { const seconds = elapsed(); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; };
  const updateStats = () => { stats.textContent = `${say('Question {current} of {total}').replace('{current}', String(Math.min(index + 1, problems.length))).replace('{total}', String(problems.length))} · ${say('Score')}: ${score} · ${say('Streak')}: ${streak} · ${say('Time')}: ${timeLabel()}`; };
  const finish = () => {
    clearInterval(timer); timer = undefined; check.hidden = true; next.hidden = true; answer.disabled = true;
    const accuracy = Math.round(score / problems.length * 100);
    status.textContent = say('Round complete. Score: {score}/{total} ({accuracy}%).').replace('{score}', String(score)).replace('{total}', String(problems.length)).replace('{accuracy}', String(accuracy));
    status.className = 'tool-status is-success'; updateStats();
  };
  const showProblem = () => { const item = problems[index]; question.textContent = `${item.a} ${item.symbol} ${item.b} = ?`; answer.value = ''; answer.disabled = false; check.hidden = false; next.hidden = true; feedback.textContent = say('Ready when you are.'); feedback.className = 'tool-status'; updateStats(); answer.focus(); };
  const start = () => {
    try {
      const settings = validateMentalMathSettings({ operation: $('[data-op-field="operation"]', root).value, difficulty: $('[data-op-field="difficulty"]', root).value, questions: $('[data-op-field="questions"]', root).value });
      clearInterval(timer); problems = Array.from({ length: settings.questions }, () => createMentalMathProblem(settings)); index = 0; score = 0; streak = 0; startedAt = performance.now();
      status.textContent = ''; round.hidden = false; showProblem(); timer = window.setInterval(updateStats, 1000);
    } catch (error) { status.textContent = say(error.message); status.className = 'tool-status is-error'; }
  };
  $('[data-mental-start]', root).addEventListener('click', start);
  check.addEventListener('click', () => {
    if (!problems.length || check.hidden) return;
    try {
      const value = parseMentalMathAnswer(answer.value); const correct = problems[index].answer;
      if (value === correct) { score += 1; streak += 1; feedback.textContent = say('Correct!'); feedback.className = 'tool-status is-success'; }
      else { streak = 0; feedback.textContent = say('Not quite. Answer: {answer}.').replace('{answer}', String(correct)); feedback.className = 'tool-status is-error'; }
      answer.disabled = true; check.hidden = true; next.hidden = false; updateStats();
    } catch (error) { feedback.textContent = say(error.message); feedback.className = 'tool-status is-error'; }
  });
  answer.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !check.hidden) { event.preventDefault(); check.click(); } });
  next.addEventListener('click', () => { if (index + 1 >= problems.length) finish(); else { index += 1; showProblem(); } });
  window.addEventListener('pagehide', () => clearInterval(timer), { once: true });
}

function setupTournamentBracket(root) {
  const entrantsInput = $('[data-bracket-entrants]', root); const shuffle = $('[data-bracket-shuffle]', root);
  const roundsNode = $('[data-bracket-rounds]', root); const status = $('[data-bracket-status]', root);
  let bracket = null;
  const sayBracket = (text, values = {}) => Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, String(value)), say(text));
  const render = () => {
    roundsNode.replaceChildren();
    if (!bracket) return;
    bracket.rounds.forEach((round, roundIndex) => {
      const section = document.createElement('section'); section.className = 'tournament-bracket__round';
      const heading = document.createElement('h3'); heading.textContent = sayBracket('Round {n}', { n: roundIndex + 1 }); section.append(heading);
      const list = document.createElement('ol'); list.className = 'tournament-bracket__matches';
      round.forEach((item, matchIndex) => {
        const card = document.createElement('li'); card.className = 'tournament-bracket__match';
        if (item.winner !== null) {
          const winner = document.createElement('strong'); winner.className = 'tournament-bracket__winner'; winner.textContent = item.winner;
          card.append(winner);
          if (item.players.includes(null)) { const bye = document.createElement('span'); bye.textContent = say('Bye — advances automatically.'); card.append(bye); }
        } else if (!item.ready.every(Boolean)) {
          const waiting = document.createElement('span'); waiting.textContent = say('Waiting for the previous match.'); card.append(waiting);
        } else {
          item.players.forEach((name, playerIndex) => {
            if (!name) return;
            const button = document.createElement('button'); button.type = 'button'; button.className = 'button button--ghost tournament-bracket__entrant';
            button.dataset.bracketWinner = ''; button.dataset.round = String(roundIndex); button.dataset.match = String(matchIndex); button.dataset.player = String(playerIndex); button.textContent = name;
            card.append(button);
          });
        }
        list.append(card);
      });
      section.append(list); roundsNode.append(section);
    });
  };
  $('[data-bracket-generate]', root).addEventListener('click', () => {
    try {
      parseTournamentEntrants(entrantsInput.value);
      bracket = createTournamentBracket(entrantsInput.value, { shuffle: shuffle.checked });
      render(); status.textContent = say('Bracket created. Select a winner in each match.'); status.className = 'tool-status is-success';
    } catch (error) { status.textContent = say(error.message); status.className = 'tool-status is-error'; }
  });
  $('[data-bracket-clear]', root).addEventListener('click', () => {
    bracket = null; entrantsInput.value = ''; roundsNode.replaceChildren(); status.textContent = say('Bracket cleared from this page.'); status.className = 'tool-status'; entrantsInput.focus();
  });
  roundsNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-bracket-winner]');
    if (!button || !bracket) return;
    try {
      bracket = advanceTournamentBracketWinner(bracket, Number(button.dataset.round), Number(button.dataset.match), Number(button.dataset.player));
      render();
      const champion = getTournamentChampion(bracket);
      status.textContent = champion ? sayBracket('Champion: {name}', { name: champion }) : sayBracket('Winner: {name} advances.', { name: button.textContent });
      status.className = 'tool-status is-success';
    } catch (error) { status.textContent = say(error.message); status.className = 'tool-status is-error'; }
  });
}

function setupHouseholdBudget(root) {
  const monthInput = $('[data-budget-month]', root); const currencyInput = $('[data-budget-currency]', root);
  const dateInput = $('[data-budget-date]', root); const amountInput = $('[data-budget-amount]', root);
  const typeInput = $('[data-budget-type]', root); const categoryInput = $('[data-budget-category]', root);
  const noteInput = $('[data-budget-note]', root); const rowsNode = $('[data-budget-rows]', root);
  const localDate = new Date();
  const today = [localDate.getFullYear(), String(localDate.getMonth() + 1).padStart(2, '0'), String(localDate.getDate()).padStart(2, '0')].join('-');
  let month = today.slice(0, 7); let transactions = []; const drafts = new Map();
  monthInput.value = month; dateInput.value = today;
  const storageKey = (selectedMonth) => `usefulverse:household-budget:v1:${selectedMonth}`;
  const money = (value) => {
    try { return new Intl.NumberFormat(locale, { style: 'currency', currency: currencyInput.value, maximumFractionDigits: 2 }).format(value); }
    catch { return `${currencyInput.value} ${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}`; }
  };
  const render = () => {
    const summary = summarizeBudget(transactions);
    $('[data-budget-income]', root).textContent = money(summary.income);
    $('[data-budget-expenses]', root).textContent = money(summary.expenses);
    $('[data-budget-balance]', root).textContent = money(summary.balance);
    const breakdown = $('[data-budget-categories]', root);
    breakdown.replaceChildren();
    if (!summary.categories.length) {
      const item = document.createElement('li'); item.textContent = say('No transactions yet.'); breakdown.append(item);
    } else {
      for (const item of summary.categories) {
        const row = document.createElement('li'); row.textContent = `${say(item.type === 'income' ? 'Income' : 'Expense')} · ${say(item.category)}: ${money(item.amount)}`; breakdown.append(row);
      }
    }
    rowsNode.replaceChildren();
    if (!summary.transactions.length) {
      const row = document.createElement('tr'); const cell = document.createElement('td');
      cell.colSpan = 6; cell.textContent = say('No transactions yet.'); row.append(cell); rowsNode.append(row);
    } else {
      summary.transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');
        for (const value of [transaction.date, say(transaction.type === 'income' ? 'Income' : 'Expense'), say(transaction.category), money(transaction.amount), transaction.note || '—']) {
          const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
        }
        const actionCell = document.createElement('td'); const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'button button--ghost'; remove.dataset.budgetRemove = String(index); remove.textContent = say('Remove');
        actionCell.append(remove); row.append(actionCell); rowsNode.append(row);
      });
    }
    currencyInput.disabled = transactions.length > 0;
  };
  $('[data-budget-add]', root).addEventListener('click', () => {
    try {
      const amount = parseBudgetAmount(amountInput.value, locale);
      const transaction = validateBudgetTransaction({ date: dateInput.value, type: typeInput.value, amount, category: categoryInput.value, note: noteInput.value }, month);
      const next = [...transactions, transaction]; summarizeBudget(next);
      transactions = next; drafts.set(month, transactions); amountInput.value = ''; noteInput.value = ''; render();
      setStatus(root, 'Transaction added.', 'success'); amountInput.focus();
    } catch (error) { setStatus(root, say(error instanceof Error ? error.message : 'Check the transaction and try again.'), 'error'); }
  });
  rowsNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-budget-remove]'); if (!button) return;
    transactions.splice(Number(button.dataset.budgetRemove), 1); drafts.set(month, transactions); render(); setStatus(root, 'Transaction removed.', 'success');
  });
  monthInput.addEventListener('change', () => {
    if (!/^\d{4}-\d{2}$/u.test(monthInput.value)) { monthInput.value = month; return setStatus(root, 'Choose a valid month.', 'error'); }
    drafts.set(month, transactions); month = monthInput.value;
    transactions = drafts.get(month) ?? [];
    dateInput.value = today.slice(0, 7) === month ? today : `${month}-01`;
    render(); setStatus(root, 'Month changed. Save the month on this device if you want to keep it.');
  });
  $('[data-budget-save]', root).addEventListener('click', () => {
    try { localStorage.setItem(storageKey(month), JSON.stringify({ version: 1, month, currency: currencyInput.value, transactions: summarizeBudget(transactions).transactions })); setStatus(root, 'Month saved on this device.', 'success'); }
    catch { setStatus(root, 'Could not save this month. Browser storage may be unavailable or full.', 'error'); }
  });
  $('[data-budget-load]', root).addEventListener('click', () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey(month)) ?? 'null');
      if (saved?.version !== 1 || saved.month !== month || !['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'].includes(saved.currency)) throw new TypeError('No valid saved month was found on this device.');
      const summary = summarizeBudget(saved.transactions);
      if (summary.transactions.some((transaction) => transaction.date.slice(0, 7) !== month)) throw new TypeError('A saved transaction is outside the selected month.');
      currencyInput.value = saved.currency;
      transactions = summary.transactions; drafts.set(month, transactions); render(); setStatus(root, 'Saved month loaded on this device.', 'success');
    } catch (error) { setStatus(root, say(error instanceof Error ? error.message : 'Could not load the saved month.'), 'error'); }
  });
  $('[data-budget-clear]', root).addEventListener('click', () => {
    try { localStorage.removeItem(storageKey(month)); setStatus(root, 'Saved month deleted from this device.', 'success'); }
    catch { setStatus(root, 'Browser storage is unavailable.', 'error'); }
  });
  $('[data-budget-reset]', root).addEventListener('click', () => {
    transactions = []; drafts.set(month, transactions); render(); setStatus(root, 'This month was cleared from the page. Saved data was not deleted.');
  });
  $('[data-budget-csv]', root).addEventListener('click', () => {
    if (!transactions.length) return setStatus(root, 'Add a transaction before downloading a CSV.', 'error');
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Currency', 'Note'];
    const lines = [headers.map(budgetCsvCell).join(','), ...transactions.map((item) => [item.date, say(item.type === 'income' ? 'Income' : 'Expense'), say(item.category), item.amount.toFixed(2), currencyInput.value, item.note].map(budgetCsvCell).join(','))];
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `usefulverse-budget-${month}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(root, 'CSV download started.', 'success');
  });
  render();
}

export function setupOpportunityTool(id, root) {
  const engine = root.dataset.opEngine;
  if (engine === 'spelling-practice') {
    const spellingUrl = new URL('./spelling-practice-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) spellingUrl.searchParams.set('v', version);
    import(spellingUrl.href).then(({ setupSpellingPractice }) => setupSpellingPractice(root)); return;
  }
  if (engine === 'hangul-practice') {
    const hangulUrl = new URL('./hangul-practice-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) hangulUrl.searchParams.set('v', version);
    import(hangulUrl.href).then(({ setupHangulPractice }) => setupHangulPractice(root)); return;
  }
  if (engine === '2048-game') {
    const gameUrl = new URL('./2048-game-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) gameUrl.searchParams.set('v', version);
    import(gameUrl.href).then(({ setup2048Game }) => setup2048Game(root)); return;
  }
  if (engine === 'sudoku') {
    const sudokuUrl = new URL('./sudoku-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) sudokuUrl.searchParams.set('v', version);
    import(sudokuUrl.href).then(({ setupSudoku }) => setupSudoku(root)); return;
  }
  if (engine === 'tic-tac-toe') {
    const gameUrl = new URL('./tic-tac-toe-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) gameUrl.searchParams.set('v', version);
    import(gameUrl.href).then(({ setupTicTacToe }) => setupTicTacToe(root)); return;
  }
  if (engine === 'chess-game') {
    const chessUrl = new URL('./chess-game-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) chessUrl.searchParams.set('v', version);
    import(chessUrl.href).then(({ setupChessGame }) => setupChessGame(root)); return;
  }
  if (engine === 'solitaire') {
    const solitaireUrl = new URL('./solitaire-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) solitaireUrl.searchParams.set('v', version);
    import(solitaireUrl.href).then(({ setupSolitaire }) => setupSolitaire(root)); return;
  }
  if (engine === 'minesweeper') {
    const minesweeperUrl = new URL('./minesweeper-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) minesweeperUrl.searchParams.set('v', version);
    import(minesweeperUrl.href).then(({ setupMinesweeper }) => setupMinesweeper(root)); return;
  }
  if (engine === 'nonogram') {
    const nonogramUrl = new URL('./nonogram-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) nonogramUrl.searchParams.set('v', version);
    import(nonogramUrl.href).then(({ setupNonogram }) => setupNonogram(root)); return;
  }
  if (engine === 'sliding-puzzle') {
    const puzzleUrl = new URL('./sliding-puzzle-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) puzzleUrl.searchParams.set('v', version);
    import(puzzleUrl.href).then(({ setupSlidingPuzzle }) => setupSlidingPuzzle(root)); return;
  }
  if (engine === 'drum-machine') {
    const drumUrl = new URL('./drum-machine-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) drumUrl.searchParams.set('v', version);
    import(drumUrl.href).then(({ setupDrumMachine }) => setupDrumMachine(root)).catch(() => setStatus(root, 'Tool loading failed. Refresh the page and try again.', 'error'));
    return;
  }
  if (['css-animation', 'css-clip-path', 'css-filters'].includes(engine)) {
    const cssToolUrl = new URL('./css-design-tools.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) cssToolUrl.searchParams.set('v', version);
    import(cssToolUrl.href).then(({ setupCssDesignTool }) => setupCssDesignTool(root)).catch(() => setStatus(root, 'Tool loading failed. Refresh the page and try again.', 'error'));
    return;
  }
  if (['api-request-builder', 'html-table-generator', 'pwa-manifest-generator'].includes(engine)) {
    const webDevUrl = new URL('./web-dev-tools.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) webDevUrl.searchParams.set('v', version);
    import(webDevUrl.href).then(({ setupWebDevTool }) => setupWebDevTool(root)).catch(() => setStatus(root, 'Tool loading failed. Refresh the page and try again.', 'error'));
    return;
  }
  if (['quiz-maker', 'memory-game', 'kana-practice', 'abacus-practice'].includes(engine)) {
    const studyUrl = new URL('./local-study-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) studyUrl.searchParams.set('v', version);
    import(studyUrl.href).then(({ setupLocalStudyTool }) => setupLocalStudyTool(root)); return;
  }
  if (['packing-list', 'decision-matrix', 'workout-planner'].includes(engine)) {
    const plannerUrl = new URL('./local-planners-runtime.js', import.meta.url); const version = new URL(import.meta.url).searchParams.get('v');
    if (version) plannerUrl.searchParams.set('v', version);
    import(plannerUrl.href).then(({ setupLocalPlanningTools }) => setupLocalPlanningTools(root)); return;
  }
  if (engine === 'diagram-maker') { setupDiagramMaker(root); return; }
  if (engine === 'household-budget') { setupHouseholdBudget(root); return; }
  if (engine === 'mental-math') { setupMentalMath(root); return; }
  if (engine === 'tournament-bracket') { setupTournamentBracket(root); return; }
  if (engine === 'study-planner') { setupStudyPlanner(root); return; }
  if (engine === 'flashcards') setupFlashcardStudy(root);
  if (engine === 'notepad') { setupNotepad(root); return; }
  if (engine === 'teleprompter') { setupTeleprompter(root); return; }
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
  $$('[data-op-field="mode"], [data-op-field="test"], [data-op-field="units"]', root).forEach((input) => input.addEventListener('change', toggleModeFields));
  toggleModeFields();
  root.addEventListener('click', async (event) => {
    if (event.target.closest('[data-op-calculate]')) {
      if (engine === 'latex-renderer') return;
      try {
        const values = valuesFrom(root);
        if (engine === 'pixel-art') return;
        if (['image-editor', 'watermark', 'id-photo', 'meme-maker'].includes(engine)) return await runImageTool(engine, values, root);
        if (engine === 'diagram-maker') { drawDiagram(root, values.steps); setStatus(root, 'Diagram created locally in this browser.', 'success'); return; }
        if (engine === 'hex-editor' && values.file instanceof File) {
          if (values.file.size > 1024 * 1024) throw new RangeError('Choose a file up to 1 MiB for this in-browser hex preview.');
          const bytes = new Uint8Array(await values.file.arrayBuffer());
          values.hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join(' ');
          $('[data-op-field="hex"]', root).value = values.hex;
        }
        if (engine === 'svg-optimizer' && values.file instanceof File && !String(values.svg ?? '').trim()) values.svg = await values.file.text();
        const result = calculateOpportunity(engine, values, locale);
        displayOutput(root, result);
        if (engine === 'svg-optimizer') offerDownload(root, new Blob([result], { type: 'image/svg+xml;charset=utf-8' }), 'usefulverse-optimized.svg');
        if (engine === 'hex-editor') {
          const byteValues = values.hex.trim().split(/[\s,]+/u).map((byte) => Number.parseInt(byte.replace(/^0x/iu, ''), 16));
          offerDownload(root, new Blob([new Uint8Array(byteValues)], { type: 'application/octet-stream' }), 'usefulverse-edited.bin');
        }
        if (engine === 'function-graph') drawFunctionGraph(root, result);
        setStatus(root, 'Result ready. This calculation runs locally in your browser.', 'success');
      }
      catch (error) {
        displayOutput(root, '');
        const message = error instanceof Error && /^Line \d+: use term, definition\.$/u.test(error.message)
          ? 'Each line needs a term, comma, and definition.'
          : error instanceof Error ? error.message : 'Check your inputs and try again.';
        setStatus(root, message, 'error');
      }
    }
    if (event.target.closest('[data-op-clear]')) { $$('[data-op-field]', root).forEach((item) => { item.value = item.tagName === 'SELECT' ? item.options[0]?.value ?? '' : ''; }); displayOutput(root, ''); setStatus(root, 'Fields cleared.'); }
    if (event.target.closest('[data-op-copy]')) await copyResult(root);
    if (event.target.closest('[data-op-print]')) printDocument(root);
  });
}
