import { emptySequence, normalizeSequence, SEQUENCER_NOTES, SEQUENCER_STEPS, sequenceStepSeconds, sequenceToMidi, toggleSequenceStep, validateSequencerTempo } from './online-sequencer-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupOnlineSequencer(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const board = $('[data-sequencer-board]', root);
  const tempo = $('[data-sequencer-tempo]', root);
  const tempoOutput = $('[data-sequencer-tempo-output]', root);
  const playButton = $('[data-sequencer-play]', root);
  const saveButton = $('[data-sequencer-save]', root);
  const loadButton = $('[data-sequencer-load]', root);
  const deleteButton = $('[data-sequencer-delete]', root);
  const clearButton = $('[data-sequencer-clear]', root);
  const midiButton = $('[data-sequencer-midi]', root);
  const status = $('#op-status', root);
  const key = 'usefulverse:online-sequencer:v1';
  let pattern = emptySequence();
  pattern[7][0] = true; pattern[5][4] = true; pattern[3][8] = true; pattern[5][12] = true;
  let context = null;
  let scheduler = 0;
  let nextStepAt = 0;
  let startedAt = 0;
  let step = 0;
  let playing = false;
  let playhead = -1;

  const setStatus = (text, type = '') => {
    status.textContent = text;
    status.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const updateTempo = () => { tempoOutput.value = say('{value} BPM', { value: tempo.value }); };
  const render = () => {
    board.replaceChildren();
    for (let noteIndex = 0; noteIndex < SEQUENCER_NOTES.length; noteIndex += 1) {
      const note = SEQUENCER_NOTES[noteIndex];
      const row = document.createElement('div');
      row.className = 'music-sequencer__row';
      const label = document.createElement('span');
      label.className = 'music-sequencer__note';
      label.textContent = note.name;
      row.append(label);
      for (let stepIndex = 0; stepIndex < SEQUENCER_STEPS; stepIndex += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'music-sequencer__step';
        button.dataset.seqNote = String(noteIndex);
        button.dataset.seqStep = String(stepIndex);
        button.setAttribute('aria-pressed', String(pattern[noteIndex][stepIndex]));
        button.setAttribute('aria-label', say('Note {note}, step {number}', { note: note.name, number: stepIndex + 1 }));
        if (pattern[noteIndex][stepIndex]) button.classList.add('is-on');
        if (stepIndex % 4 === 0) button.classList.add('is-beat');
        if (playing && stepIndex === playhead) button.classList.add('is-current');
        row.append(button);
      }
      board.append(row);
    }
  };
  const playNote = (midi, at) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440 * (2 ** ((midi - 69) / 12)), at);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.16, at + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + sequenceStepSeconds(tempo.value) * 0.78);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(at);
    oscillator.stop(at + sequenceStepSeconds(tempo.value) * 0.8);
    oscillator.addEventListener('ended', () => { oscillator.disconnect(); gain.disconnect(); }, { once: true });
  };
  const stop = async (message = '') => {
    playing = false;
    if (scheduler) window.clearInterval(scheduler);
    scheduler = 0;
    playhead = -1;
    playButton.textContent = say('Play');
    playButton.setAttribute('aria-label', say('Play melody'));
    render();
    if (context) {
      const oldContext = context;
      context = null;
      try { await oldContext.close(); } catch { /* Browser may already have closed it. */ }
    }
    if (message) setStatus(message);
  };
  const scheduleAhead = () => {
    if (!playing || !context) return;
    const horizon = context.currentTime + 0.12;
    while (nextStepAt < horizon) {
      for (let row = 0; row < pattern.length; row += 1) if (pattern[row][step]) playNote(SEQUENCER_NOTES[row].midi, nextStepAt);
      nextStepAt += sequenceStepSeconds(tempo.value);
      step = (step + 1) % SEQUENCER_STEPS;
    }
    const current = Math.max(0, Math.floor((context.currentTime - startedAt) / sequenceStepSeconds(tempo.value))) % SEQUENCER_STEPS;
    if (current !== playhead) {
      board.querySelectorAll('.is-current').forEach((button) => button.classList.remove('is-current'));
      board.querySelectorAll(`[data-seq-step="${current}"]`).forEach((button) => button.classList.add('is-current'));
      playhead = current;
    }
  };
  const refreshStorage = () => {
    try { const saved = localStorage.getItem(key) !== null; loadButton.disabled = !saved; deleteButton.disabled = !saved; }
    catch { loadButton.disabled = true; deleteButton.disabled = true; }
  };

  updateTempo(); render(); refreshStorage();
  board.addEventListener('click', (event) => {
    const button = event.target.closest('[data-seq-note][data-seq-step]');
    if (!button) return;
    const row = Number(button.dataset.seqNote); const column = Number(button.dataset.seqStep);
    pattern = toggleSequenceStep(pattern, row, column);
    button.classList.toggle('is-on', pattern[row][column]);
    button.setAttribute('aria-pressed', String(pattern[row][column]));
  });
  tempo.addEventListener('input', updateTempo);
  playButton.addEventListener('click', async () => {
    if (playing) { await stop(say('Playback stopped.')); return; }
    try {
      validateSequencerTempo(tempo.value);
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio is not available in this browser.');
      context = new AudioContextClass();
      await context.resume();
      step = 0; startedAt = context.currentTime + 0.04; nextStepAt = startedAt; playhead = -1; playing = true;
      playButton.textContent = say('Stop');
      playButton.setAttribute('aria-label', say('Stop melody'));
      setStatus(say('Playing your melody.'));
      render(); scheduleAhead(); scheduler = window.setInterval(scheduleAhead, 25);
    } catch (error) {
      await stop();
      setStatus(error instanceof Error && error.message.includes('Audio is not available') ? say('Audio is not available in this browser.') : say('Audio could not start. Check your browser sound settings and try again.'), 'error');
    }
  });
  clearButton.addEventListener('click', () => { pattern = emptySequence(); render(); setStatus(say('Melody cleared.')); });
  midiButton.addEventListener('click', () => {
    try {
      const blob = new Blob([sequenceToMidi(pattern, tempo.value)], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'usefulverse-melody.mid'; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus(say('MIDI download started.'), 'success');
    } catch { setStatus(say('Could not create the MIDI file.'), 'error'); }
  });
  saveButton.addEventListener('click', () => {
    try {
      localStorage.setItem(key, JSON.stringify({ version: 1, tempo: validateSequencerTempo(tempo.value), pattern: normalizeSequence(pattern) }));
      refreshStorage(); setStatus(say('Pattern saved on this device.'), 'success');
    } catch { setStatus(say('Could not save the pattern. Browser storage may be unavailable.'), 'error'); }
  });
  loadButton.addEventListener('click', () => {
    let raw;
    try { raw = localStorage.getItem(key); } catch { return setStatus(say('Could not load a pattern from this browser.'), 'error'); }
    if (!raw) return setStatus(say('No saved pattern was found on this device.'), 'error');
    try {
      const saved = JSON.parse(raw);
      if (saved?.version !== 1) throw new TypeError('Unsupported pattern version');
      pattern = normalizeSequence(saved.pattern); tempo.value = String(validateSequencerTempo(saved.tempo));
      updateTempo(); render(); setStatus(say('Saved pattern loaded.'), 'success');
    } catch { setStatus(say('The saved pattern is not valid.'), 'error'); }
  });
  root.addEventListener('click', (event) => {
    if (!event.target.closest('[data-sequencer-delete]')) return;
    try { localStorage.removeItem(key); refreshStorage(); setStatus(say('Saved pattern deleted from this device.'), 'success'); }
    catch { setStatus(say('Could not delete the saved pattern.'), 'error'); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) void stop(say('Playback stopped because this tab was hidden.')); });
  window.addEventListener('pagehide', () => { if (scheduler) window.clearInterval(scheduler); if (context) void context.close(); });
}
