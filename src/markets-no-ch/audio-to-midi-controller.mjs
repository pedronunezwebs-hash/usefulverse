import { encodeMidi, quantizeNotes } from './audio-to-midi-transcriber.mjs';

export function mountAudioToMidi(root, copy, environment = globalThis) {
  const q = (selector) => root.querySelector(selector);
  const f = copy.fields;
  const fileInput = q('[data-midi-file]');
  const analyzeButton = q('[data-midi-analyze]');
  const cancelButton = q('[data-midi-cancel]');
  const status = q('[data-midi-status]');
  const progress = q('[data-midi-progress]');
  const output = q('[data-midi-output]');
  const eventTable = q('[data-midi-events]');
  let worker = null;
  let notes = [];
  let loadedSamples = null;
  let decodeVersion = 0;

  const safeText = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  function say(message, error = false) {
    status.textContent = message;
    status.dataset.state = error ? 'error' : 'ok';
  }

  function nameForMidi(value) {
    const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
    return `${names[value % 12]}${Math.floor(value / 12) - 1} · ${value}`;
  }

  function drawRoll() {
    const svg = q('[data-midi-roll]');
    if (!notes.length) { svg.innerHTML = ''; svg.hidden = true; return; }
    const maxTime = Math.max(1, ...notes.map((note) => note.start + note.duration));
    const minPitch = Math.max(0, Math.min(...notes.map((note) => note.midi)) - 3);
    const maxPitch = Math.min(127, Math.max(...notes.map((note) => note.midi)) + 3);
    const rowHeight = 17;
    const height = Math.max(125, (maxPitch - minPitch + 1) * rowHeight);
    const x0 = 64; const usableWidth = 700;
    const lines = Array.from({ length: Math.ceil(maxTime) + 1 }, (_, second) => {
      const x = x0 + second / maxTime * usableWidth;
      return `<path d="M${x} 0V${height}" stroke="#d7dde5" stroke-dasharray="3 4"/><text x="${x + 3}" y="12" font-size="10" fill="#465466">${second}s</text>`;
    }).join('');
    const bars = notes.map((note, index) => {
      const x = x0 + note.start / maxTime * usableWidth;
      const width = Math.max(4, note.duration / maxTime * usableWidth);
      const y = (maxPitch - note.midi) * rowHeight + 17;
      return `<rect x="${x}" y="${y}" width="${width}" height="12" rx="3" fill="${index % 2 ? '#7165cf' : '#168c73'}"><title>${nameForMidi(note.midi)} · ${note.start.toFixed(2)}–${(note.start + note.duration).toFixed(2)} s</title></rect>`;
    }).join('');
    svg.setAttribute('viewBox', `0 0 780 ${height + 20}`);
    svg.setAttribute('aria-label', `${f.noteRoll}: ${notes.length}`);
    svg.innerHTML = `${lines}${bars}`;
    svg.hidden = false;
  }

  function renderNotes() {
    output.hidden = notes.length === 0;
    const rows = notes.map((note, index) => `<tr data-note-row="${index}"><th scope="row">${index + 1}</th><td><label class="sr-only" for="midi-pitch-${index}">${safeText(f.midiNote)} ${index + 1}</label><input id="midi-pitch-${index}" data-note-field="midi" type="number" min="0" max="127" step="1" value="${note.midi}" aria-label="${safeText(f.midiNote)} ${index + 1}: ${nameForMidi(note.midi)}"></td><td>${nameForMidi(note.midi)}</td><td><label class="sr-only" for="midi-start-${index}">${safeText(f.start)} ${index + 1}</label><input id="midi-start-${index}" data-note-field="start" type="number" min="0" max="30" step="0.01" value="${note.start.toFixed(2)}"></td><td><label class="sr-only" for="midi-duration-${index}">${safeText(f.duration)} ${index + 1}</label><input id="midi-duration-${index}" data-note-field="duration" type="number" min="0.05" max="30" step="0.01" value="${note.duration.toFixed(2)}"></td><td><label class="sr-only" for="midi-velocity-${index}">${safeText(f.velocity)} ${index + 1}</label><input id="midi-velocity-${index}" data-note-field="velocity" type="number" min="1" max="127" step="1" value="${note.velocity}"></td><td>${Math.round(note.confidence * 100)}%</td><td><button type="button" data-note-remove="${index}" aria-label="${safeText(f.remove)} ${index + 1}">×</button></td></tr>`).join('');
    eventTable.innerHTML = `<div class="table-scroll"><table><caption>${safeText(f.noteRoll)}</caption><thead><tr><th>#</th><th>${safeText(f.midiNote)}</th><th>${safeText(f.noteName)}</th><th>${safeText(f.start)}</th><th>${safeText(f.duration)}</th><th>${safeText(f.velocity)}</th><th>${safeText(f.confidence)}</th><th>${safeText(f.remove)}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    drawRoll();
    q('[data-midi-export]').disabled = notes.length === 0;
    q('[data-midi-quantize]').disabled = notes.length === 0;
  }

  function clear() {
    if (worker) { worker.terminate(); worker = null; }
    decodeVersion += 1;
    notes = []; loadedSamples = null; fileInput.value = '';
    analyzeButton.disabled = true; cancelButton.disabled = true; progress.hidden = true;
    renderNotes(); say(f.ready);
  }

  function runAnalysis(samples, sampleRate) {
    if (worker) worker.terminate();
    worker = new Worker(new URL('./audio-to-midi-worker.mjs', import.meta.url), { type: 'module' });
    analyzeButton.disabled = true; cancelButton.disabled = false; progress.hidden = false; progress.value = 0;
    say(f.analyzing.replace('{progress}', '0'));
    worker.addEventListener('message', (event) => {
      const message = event.data ?? {};
      if (message.type === 'progress') {
        progress.value = Math.max(progress.value, Math.round(message.progress * 100));
        say(f.analyzing.replace('{progress}', String(progress.value)));
      } else if (message.type === 'complete') {
        worker.terminate(); worker = null; cancelButton.disabled = true; progress.hidden = true; analyzeButton.disabled = !loadedSamples;
        notes = message.notes.map((note, index) => ({ ...note, id: index + 1 })); renderNotes();
        say(notes.length ? f.found.replace('{count}', String(notes.length)) : f.noNotes, !notes.length);
      } else {
        worker?.terminate(); worker = null; cancelButton.disabled = true; progress.hidden = true; analyzeButton.disabled = !loadedSamples; say(f.decodingFailed, true);
      }
    });
    worker.addEventListener('error', () => { worker?.terminate(); worker = null; cancelButton.disabled = true; progress.hidden = true; analyzeButton.disabled = !loadedSamples; say(f.decodingFailed, true); });
    const transferable = samples.slice();
    worker.postMessage({ samples: transferable, sampleRate }, [transferable.buffer]);
  }

  async function decodeFile(file, version) {
    if (!file || !(file.type.startsWith('audio/') || /\.(?:wav|mp3|ogg|flac|m4a|aac|opus)$/iu.test(file.name)) || file.size > 25 * 1024 * 1024) { loadedSamples = null; analyzeButton.disabled = true; say(f.invalidFile, true); return; }
    let audioContext;
    try {
      const AudioContext = environment.AudioContext || environment.webkitAudioContext;
      if (!AudioContext) throw new Error('AudioContext unavailable');
      audioContext = new AudioContext();
      say(f.decoding);
      const buffer = await audioContext.decodeAudioData(await file.arrayBuffer());
      if (version !== decodeVersion) return;
      if (buffer.duration > 30) { loadedSamples = null; analyzeButton.disabled = true; say(f.tooLong, true); return; }
      const mono = new Float32Array(buffer.length);
      for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
        const samples = buffer.getChannelData(channel);
        for (let index = 0; index < mono.length; index += 1) mono[index] += samples[index] / buffer.numberOfChannels;
      }
      loadedSamples = { samples: mono, sampleRate: buffer.sampleRate, duration: buffer.duration };
      analyzeButton.disabled = false; say(`${f.fileLoaded} ${buffer.duration.toFixed(1)} s.`);
    } catch { if (version === decodeVersion) { loadedSamples = null; analyzeButton.disabled = true; say(f.decodingFailed, true); } }
    finally { try { await audioContext?.close(); } catch {} }
  }

  fileInput.addEventListener('change', () => { const version = ++decodeVersion; notes = []; loadedSamples = null; analyzeButton.disabled = true; renderNotes(); void decodeFile(fileInput.files?.[0], version); });
  analyzeButton.addEventListener('click', () => {
    if (!loadedSamples) { say(f.noFile, true); return; }
    runAnalysis(loadedSamples.samples, loadedSamples.sampleRate);
  });
  cancelButton.addEventListener('click', () => {
    worker?.terminate(); worker = null; cancelButton.disabled = true; analyzeButton.disabled = !loadedSamples; progress.hidden = true; say(f.cancelled);
  });
  q('[data-midi-sample]').addEventListener('click', () => {
    const sampleRate = 24000;
    const segments = [[440, 0.62], [0, 0.24], [659.255, 0.65]];
    const length = Math.round(segments.reduce((sum, [, seconds]) => sum + seconds, 0) * sampleRate);
    const samples = new Float32Array(length); let cursor = 0;
    for (const [frequency, seconds] of segments) {
      const count = Math.round(seconds * sampleRate);
      if (frequency) for (let index = 0; index < count; index += 1) {
        const fade = Math.min(1, index / 160, (count - index) / 160);
        samples[cursor + index] = 0.5 * fade * Math.sin(2 * Math.PI * frequency * index / sampleRate);
      }
      cursor += count;
    }
    loadedSamples = { samples, sampleRate, duration: length / sampleRate };
    notes = []; renderNotes(); analyzeButton.disabled = false; say(f.sampleReady);
  });
  q('[data-midi-clear]').addEventListener('click', clear);
  q('[data-midi-quantize]').addEventListener('click', () => {
    const bpm = Number(q('[data-midi-bpm]').value); const grid = Number(q('[data-midi-grid]').value);
    try { notes = quantizeNotes(notes, bpm, grid); renderNotes(); say(f.edited); } catch { say(f.invalidTempo, true); }
  });
  q('[data-midi-export]').addEventListener('click', () => {
    if (!notes.length) { say(f.noExport, true); return; }
    try {
      const bytes = encodeMidi(notes, { bpm: Number(q('[data-midi-bpm]').value) || 120 });
      const url = URL.createObjectURL(new Blob([bytes], { type: 'audio/midi' }));
      const link = document.createElement('a'); link.href = url; link.download = f.fileName; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); say(f.exportDone);
    } catch { say(f.invalidTempo, true); }
  });
  eventTable.addEventListener('change', (event) => {
    const field = event.target.closest('[data-note-field]'); const row = event.target.closest('[data-note-row]');
    if (!field || !row) return;
    const note = notes[Number(row.dataset.noteRow)]; const value = Number(field.value);
    if (!Number.isFinite(value)) { renderNotes(); say(f.invalidEdit, true); return; }
    const ranges = { midi: [0, 127], start: [0, 30], duration: [0.05, 30], velocity: [1, 127] };
    const [min, max] = ranges[field.dataset.noteField];
    if (value < min || value > max || (field.dataset.noteField === 'midi' || field.dataset.noteField === 'velocity') && !Number.isInteger(value)) { renderNotes(); say(f.invalidEdit, true); return; }
    const fieldName = field.dataset.noteField; const rowIndex = Number(row.dataset.noteRow);
    note[fieldName] = value;
    renderNotes(); eventTable.querySelector(`[data-note-row="${rowIndex}"] [data-note-field="${fieldName}"]`)?.focus(); say(f.edited);
  });
  eventTable.addEventListener('click', (event) => {
    const button = event.target.closest('[data-note-remove]'); if (!button) return;
    notes.splice(Number(button.dataset.noteRemove), 1); renderNotes(); say(f.edited);
  });
  renderNotes();
  return () => { decodeVersion += 1; worker?.terminate(); worker = null; fileInput.value = ''; };
}

const root = document.querySelector('[data-audio-to-midi]');
if (root) mountAudioToMidi(root, JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}'));
