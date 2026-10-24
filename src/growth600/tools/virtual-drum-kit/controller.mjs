import { createDrumPattern, DRUM_PADS, exportDrumPattern, MAX_PATTERN_MS, recordDrumHit } from './logic.mjs';

const root = document.querySelector('[data-tool="virtual-drum-kit"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const content = root.querySelector('[data-result-content]');
  const result = root.querySelector('[data-result]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const { fields: f, messages: m } = copy;
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = String(text); if (className) el.className = className; return el; };
  let context = null; let masterGain = null; let pattern = createDrumPattern(); let recording = false; let recordStart = 0; let playTimer = 0; let startedPlayback = 0;
  const elapsed = () => recording ? Math.min(MAX_PATTERN_MS, Math.max(0, performance.now() - recordStart)) : 0;
  const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle('status--error', error); };
  const getContext = async () => {
    const Audio = window.AudioContext ?? window.webkitAudioContext;
    if (!Audio) throw new Error('audio-unavailable');
    context ??= new Audio();
    if (!masterGain) { masterGain = context.createGain(); masterGain.gain.value = Number(content.querySelector('[type=range]')?.value ?? 0.22); masterGain.connect(context.destination); }
    if (context.state === 'suspended') await context.resume();
    return context;
  };
  function noise(ctx, duration, filterType, frequency, gain) {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource(); source.buffer = buffer;
    const filter = ctx.createBiquadFilter(); filter.type = filterType; filter.frequency.value = frequency;
    const amp = ctx.createGain(); amp.gain.setValueAtTime(gain, ctx.currentTime); amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(filter).connect(amp).connect(ctx.destination); source.start(); source.stop(ctx.currentTime + duration);
  }
  function tone(ctx, from, to, duration, gain, type = 'sine') {
    const osc = ctx.createOscillator(); const amp = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(from, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + duration);
    amp.gain.setValueAtTime(gain, ctx.currentTime); amp.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(amp).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration);
  }
  function sound(pad) {
    if (!context || context.state !== 'running') return;
    if (pad === 'kick') tone(context, 150, 42, 0.24, 0.65);
    else if (pad === 'snare') { noise(context, 0.19, 'highpass', 950, 0.35); tone(context, 190, 100, 0.12, 0.17, 'triangle'); }
    else if (pad === 'closed-hat') noise(context, 0.055, 'highpass', 7200, 0.18);
    else if (pad === 'open-hat') noise(context, 0.36, 'highpass', 6500, 0.2);
    else if (pad === 'high-tom') tone(context, 210, 125, 0.22, 0.4, 'triangle');
    else if (pad === 'low-tom') tone(context, 125, 65, 0.3, 0.48, 'triangle');
    else if (pad === 'crash') noise(context, 0.75, 'highpass', 4800, 0.2);
  }
  async function hit(padId) {
    try {
      await getContext(); sound(padId);
      if (recording) {
        if (elapsed() >= MAX_PATTERN_MS) { stopRecording(); setStatus(m.recordingLimit); return; }
        try { recordDrumHit(pattern, padId, elapsed()); }
        catch { stopRecording(); setStatus(m.hitLimit, true); return; }
        updateCount();
      }
      const pad = content.querySelector(`[data-pad="${padId}"]`);
      pad?.classList.add('is-playing'); window.setTimeout(() => pad?.classList.remove('is-playing'), 90);
    } catch (error) { setStatus(error.message === 'audio-unavailable' ? m.audioUnavailable : m.audioCouldNotStart, true); }
  }
  function updateCount() {
    const output = content.querySelector('[data-hit-count]');
    if (output) output.textContent = `${f.hits}: ${pattern.hits.length}`;
  }
  function stopRecording() {
    if (recording) pattern.stoppedAt = Math.round(elapsed());
    recording = false; const button = content.querySelector('[data-record]');
    if (button) button.textContent = f.record;
  }
  function stopPlayback() { if (playTimer) window.clearTimeout(playTimer); playTimer = 0; }
  function playPattern() {
    stopPlayback(); const sequence = [...pattern.hits].sort((a, b) => a.atMs - b.atMs);
    if (!sequence.length) { setStatus(m.noHits); return; }
    startedPlayback = performance.now();
    const playNext = () => {
      const target = sequence[0];
      if (!target) { playTimer = 0; setStatus(m.playbackComplete); return; }
      const remaining = target.atMs - (performance.now() - startedPlayback);
      if (remaining > 6) { playTimer = window.setTimeout(playNext, Math.min(remaining, 100)); return; }
      sequence.shift(); sound(target.pad); playTimer = window.setTimeout(playNext, 0);
    };
    playNext(); setStatus(m.playbackStarted);
  }
  function downloadPattern() {
    stopRecording(); const data = exportDrumPattern(pattern); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-drum-pattern.json'; link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(m.exported);
  }
  function clear() {
    stopPlayback(); stopRecording(); pattern = createDrumPattern(); updateCount();
    if (context) { void context.close(); context = null; masterGain = null; }
    content.replaceChildren(); result.hidden = true; setStatus('');
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault(); root._drumCleanup?.(); root._drumCleanup = null; stopPlayback(); stopRecording(); content.replaceChildren(); pattern = createDrumPattern();
    const note = node('p', f.keyboardNote, 'hint'); content.append(note);
    const pads = node('div', undefined, 'pending-drum-pads');
    for (const { id, key } of DRUM_PADS) {
      const button = node('button', `${f.padNames[id]} · ${key.toUpperCase()}`, 'button button--secondary pending-drum-pad');
      button.type = 'button'; button.dataset.pad = id; button.setAttribute('aria-label', `${f.padNames[id]} (${key.toUpperCase()})`); button.addEventListener('click', () => void hit(id)); pads.append(button);
    }
    content.append(pads);
    const volumeLabel = node('label', f.volume, 'pending-drum-volume'); const volume = node('input'); volume.type = 'range'; volume.min = '0'; volume.max = '0.45'; volume.step = '0.01'; volume.value = '0.22'; volume.setAttribute('aria-label', f.volume); volume.addEventListener('input', () => { if (masterGain && context) masterGain.gain.setTargetAtTime(Number(volume.value), context.currentTime, 0.02); }); volumeLabel.append(volume); content.append(volumeLabel);
    const controls = node('div', undefined, 'pending-drum-controls');
    const record = node('button', f.record, 'button button--secondary'); record.type = 'button'; record.dataset.record = 'true';
    record.addEventListener('click', async () => { try { await getContext(); } catch { setStatus(m.audioUnavailable, true); return; } if (recording) { stopRecording(); setStatus(m.recordingStopped); } else { pattern = createDrumPattern(); recordStart = performance.now(); recording = true; record.textContent = f.stopRecording; updateCount(); setStatus(m.recordingStarted); } });
    const play = node('button', f.play, 'button button--secondary'); play.type = 'button'; play.addEventListener('click', async () => { try { await getContext(); playPattern(); } catch { setStatus(m.audioUnavailable, true); } });
    const stop = node('button', f.stopPlayback, 'button button--secondary'); stop.type = 'button'; stop.addEventListener('click', () => { stopPlayback(); setStatus(m.playbackStopped); });
    const exportButton = node('button', f.export, 'button button--secondary'); exportButton.type = 'button'; exportButton.addEventListener('click', downloadPattern);
    controls.append(record, play, stop, exportButton); content.append(controls);
    const count = node('p', `${f.hits}: 0`, 'pending-drum-count'); count.dataset.hitCount = 'true'; content.append(count);
    result.hidden = false; setStatus(m.ready);
    const onKey = (event) => { if (event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement) return; const pad = DRUM_PADS.find(({ key }) => key === event.key.toLowerCase()); if (pad) { event.preventDefault(); void hit(pad.id); } };
    document.addEventListener('keydown', onKey); root._drumCleanup = () => document.removeEventListener('keydown', onKey);
  });
  form.addEventListener('reset', () => queueMicrotask(() => { root._drumCleanup?.(); root._drumCleanup = null; clear(); }));
}
