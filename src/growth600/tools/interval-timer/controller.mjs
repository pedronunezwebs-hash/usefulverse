import { announce, readToolCopy } from '../controller-helpers.mjs';
import { intervalPhaseAt, normalizeIntervalConfig } from './logic.mjs';

const root = document.querySelector('[data-tool="interval-timer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const selectors = {
    phase: root.querySelector('[data-phase]'), round: root.querySelector('[data-round]'), remaining: root.querySelector('[data-remaining]'),
    total: root.querySelector('[data-total]'), progress: root.querySelector('[data-progress]'),
    start: root.querySelector('[data-action="start"]'), pause: root.querySelector('[data-action="pause"]'), resume: root.querySelector('[data-action="resume"]'),
  };
  const settings = ['preset', 'workSeconds', 'restSeconds', 'rounds', 'prepSeconds'].map(field);
  const locale = document.documentElement.lang || 'en';
  let config = null;
  let running = false;
  let completed = false;
  let startedAt = 0;
  let elapsedBeforePause = 0;
  let lastPhase = null;
  let ticker = 0;
  let audioContext = null;

  function setSettingsDisabled(disabled) {
    settings.forEach((control) => { control.disabled = disabled; });
  }

  function clearDisplay() {
    selectors.phase.textContent = '—'; selectors.round.textContent = '—';
    selectors.remaining.textContent = '00:00'; selectors.total.textContent = '—';
    selectors.progress.value = 0;
  }

  function formatSeconds(seconds) {
    const total = Math.max(0, Math.ceil(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const remainder = total % 60;
    const number = (value) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format(value);
    return hours ? `${number(hours)}:${number(minutes)}:${number(remainder)}` : `${number(minutes)}:${number(remainder)}`;
  }

  function currentElapsed() {
    return elapsedBeforePause + (running ? Math.max(0, performance.now() - startedAt) / 1000 : 0);
  }

  async function enableSound() {
    if (!field('sound').checked) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('AudioContext unavailable');
      audioContext ??= new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();
    } catch { announce(root, copy.messages.soundUnavailable, 'status'); }
  }

  function tone(frequency, startAt, duration = 0.14) {
    if (!field('sound').checked || !audioContext || audioContext.state !== 'running') return;
    try {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.11, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(startAt); oscillator.stop(startAt + duration + 0.02);
    } catch { /* Audio is optional; visual timing continues. */ }
  }

  function cue(phase) {
    if (phase === 'complete') {
      tone(660, audioContext?.currentTime ?? 0); tone(880, (audioContext?.currentTime ?? 0) + 0.19); tone(1_100, (audioContext?.currentTime ?? 0) + 0.38, 0.24);
    } else tone(phase === 'work' ? 880 : phase === 'rest' ? 660 : 520, audioContext?.currentTime ?? 0);
  }

  function update() {
    if (!config) return;
    const state = intervalPhaseAt(config, currentElapsed());
    selectors.phase.textContent = copy.fields[state.phase];
    selectors.round.textContent = state.phase === 'prep' ? '—' : `${new Intl.NumberFormat(locale).format(Math.min(state.round, config.rounds))} / ${new Intl.NumberFormat(locale).format(config.rounds)}`;
    selectors.remaining.textContent = formatSeconds(state.remainingSeconds);
    selectors.total.textContent = formatSeconds(config.totalSeconds);
    selectors.progress.value = state.progress;
    if (lastPhase !== null && state.phase !== lastPhase) {
      if (state.phase === 'complete') {
        running = false; completed = true; clearInterval(ticker); ticker = 0;
        selectors.start.disabled = false; selectors.pause.disabled = true; selectors.resume.disabled = true;
        setSettingsDisabled(false);
        cue('complete'); announce(root, copy.messages.finished, 'success');
      } else {
        cue(state.phase);
        if (state.phase === 'work') announce(root, copy.messages.workCue, 'status');
        else if (state.phase === 'rest') announce(root, copy.messages.restCue, 'status');
        else announce(root, copy.messages.prepCue, 'status');
      }
    }
    lastPhase = state.phase;
  }

  function readConfig() {
    return normalizeIntervalConfig({ workSeconds: field('workSeconds').value, restSeconds: field('restSeconds').value, rounds: field('rounds').value, prepSeconds: field('prepSeconds').value });
  }

  function startTicker() {
    clearInterval(ticker); ticker = setInterval(update, 200); update();
  }

  async function start(event) {
    event?.preventDefault();
    try { config = readConfig(); }
    catch { announce(root, copy.messages.checkInputs, 'error'); return; }
    await enableSound();
    elapsedBeforePause = 0; startedAt = performance.now(); running = true; completed = false; lastPhase = null;
    selectors.start.disabled = true; selectors.pause.disabled = false; selectors.resume.disabled = true;
    setSettingsDisabled(true);
    announce(root, copy.messages.started, 'success'); startTicker();
  }

  function pause() {
    if (!running) return;
    elapsedBeforePause = currentElapsed(); running = false; clearInterval(ticker); ticker = 0;
    selectors.start.disabled = true; selectors.pause.disabled = true; selectors.resume.disabled = false;
    announce(root, copy.messages.paused, 'status'); update();
  }

  async function resume() {
    if (!config || running || completed) return;
    await enableSound();
    startedAt = performance.now(); running = true;
    selectors.start.disabled = true; selectors.pause.disabled = false; selectors.resume.disabled = true;
    announce(root, copy.messages.resumed, 'status'); startTicker();
  }

  function reset() {
    running = false; completed = false; clearInterval(ticker); ticker = 0;
    field('preset').value = 'custom'; field('workSeconds').value = '20'; field('restSeconds').value = '10';
    field('rounds').value = '8'; field('prepSeconds').value = '0'; field('sound').checked = true;
    elapsedBeforePause = 0; lastPhase = null; config = readConfig();
    selectors.start.disabled = false; selectors.pause.disabled = true; selectors.resume.disabled = true;
    setSettingsDisabled(false);
    update(); announce(root, copy.messages.reset, 'status');
  }

  function applyPreset() {
    const preset = field('preset').value;
    if (preset === 'tabata') { field('workSeconds').value = '20'; field('restSeconds').value = '10'; field('rounds').value = '8'; field('prepSeconds').value = '0'; }
    if (preset === 'hiit') { field('workSeconds').value = '40'; field('restSeconds').value = '20'; field('rounds').value = '10'; field('prepSeconds').value = '10'; }
    if (running) return;
    clearInterval(ticker); ticker = 0; elapsedBeforePause = 0; lastPhase = null; completed = false;
    selectors.start.disabled = false; selectors.pause.disabled = true; selectors.resume.disabled = true;
    announce(root, '', 'status');
    try { config = readConfig(); } catch { config = null; clearDisplay(); }
    update();
  }

  selectors.start.addEventListener('click', start);
  selectors.pause.addEventListener('click', pause);
  selectors.resume.addEventListener('click', resume);
  form.addEventListener('reset', (event) => { event.preventDefault(); reset(); });
  field('preset').addEventListener('change', applyPreset);
  form.addEventListener('input', (event) => {
    if (running) return;
    completed = false;
    if (event.target !== field('preset') && event.target !== field('sound')) field('preset').value = 'custom';
    selectors.start.disabled = false; selectors.pause.disabled = true; selectors.resume.disabled = true;
    elapsedBeforePause = 0; lastPhase = null;
    announce(root, '', 'status');
    try { config = readConfig(); update(); } catch { config = null; clearDisplay(); }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && running) update(); });
  selectors.pause.disabled = true; selectors.resume.disabled = true;
  try { config = readConfig(); update(); } catch { /* Form defaults are validated when started. */ }
}
