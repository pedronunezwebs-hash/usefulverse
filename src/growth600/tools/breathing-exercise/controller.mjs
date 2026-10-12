import { announce, readToolCopy } from '../controller-helpers.mjs';
import { breathingPhaseAt, normalizeBreathingConfig } from './logic.mjs';

const root = document.querySelector('[data-tool="breathing-exercise"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const output = {
    phase: root.querySelector('[data-breathing-phase]'), cycle: root.querySelector('[data-breathing-cycle]'), remaining: root.querySelector('[data-breathing-remaining]'),
    progress: root.querySelector('[data-breathing-progress]'), orb: root.querySelector('[data-breathing-orb]'),
    start: root.querySelector('[data-action="start"]'), pause: root.querySelector('[data-action="pause"]'), resume: root.querySelector('[data-action="resume"]'),
  };
  const settings = ['pattern', 'inhaleSeconds', 'holdAfterInhaleSeconds', 'exhaleSeconds', 'holdAfterExhaleSeconds', 'durationSeconds'].map(field);
  const locale = document.documentElement.lang || 'en';
  let config = null;
  let running = false;
  let completed = false;
  let startedAt = 0;
  let elapsedBeforePause = 0;
  let lastPhase = null;
  let ticker = 0;
  let audioContext = null;

  const formatSeconds = (seconds) => {
    const total = Math.max(0, Math.ceil(seconds));
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    const number = (value) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format(value);
    return `${number(mins)}:${number(secs)}`;
  };
  const elapsed = () => elapsedBeforePause + (running ? Math.max(0, performance.now() - startedAt) / 1000 : 0);

  function announcePhase(phase) {
    const message = phase === 'inhale' ? copy.messages.inhaleCue : phase === 'exhale' ? copy.messages.exhaleCue : copy.messages.holdCue;
    announce(root, message, 'status');
  }

  async function enableAudio() {
    if (!field('sound').checked) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('AudioContext unavailable');
      audioContext ??= new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();
    } catch { announce(root, copy.messages.soundUnavailable, 'status'); }
  }

  function cue(phase) {
    if (!field('sound').checked || !audioContext || audioContext.state !== 'running') return;
    try {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.value = phase === 'inhale' ? 660 : phase === 'exhale' ? 440 : 550;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.065, now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(now); oscillator.stop(now + 0.2);
    } catch { /* The visual exercise remains usable if optional audio fails. */ }
  }

  function readConfig() {
    return normalizeBreathingConfig({
      inhaleSeconds: field('inhaleSeconds').value,
      holdAfterInhaleSeconds: field('holdAfterInhaleSeconds').value,
      exhaleSeconds: field('exhaleSeconds').value,
      holdAfterExhaleSeconds: field('holdAfterExhaleSeconds').value,
      durationSeconds: field('durationSeconds').value,
    });
  }

  function update() {
    if (!config) return;
    const state = breathingPhaseAt(config, elapsed());
    const phaseLabel = state.phase === 'inhale' ? copy.fields.inhaleCue : state.phase === 'exhale' ? copy.fields.exhaleCue : state.phase === 'hold' ? copy.fields.holdCue : copy.fields.complete;
    output.phase.textContent = phaseLabel;
    output.cycle.textContent = state.phase === 'complete' ? '—' : new Intl.NumberFormat(locale).format(state.cycle);
    output.remaining.textContent = formatSeconds(state.remainingSeconds);
    output.progress.value = state.progress;
    output.orb.classList.toggle('is-inhale', state.phase === 'inhale');
    output.orb.classList.toggle('is-exhale', state.phase === 'exhale');
    output.orb.dataset.phase = state.phase;
    if (lastPhase !== null && state.phase !== lastPhase) {
      if (state.phase === 'complete') {
        running = false; completed = true; clearInterval(ticker); ticker = 0;
        output.start.disabled = false; output.pause.disabled = true; output.resume.disabled = true;
        settings.forEach((control) => { control.disabled = false; });
        announce(root, copy.messages.finished, 'success');
      } else {
        cue(state.phase);
        announcePhase(state.phase);
      }
    }
    lastPhase = state.phase;
  }

  function startTicker() { clearInterval(ticker); ticker = setInterval(update, 150); update(); }
  async function start(event) {
    event?.preventDefault();
    try { config = readConfig(); } catch { announce(root, copy.messages.checkInputs, 'error'); return; }
    await enableAudio();
    elapsedBeforePause = 0; startedAt = performance.now(); running = true; completed = false; lastPhase = null;
    output.start.disabled = true; output.pause.disabled = false; output.resume.disabled = true;
    settings.forEach((control) => { control.disabled = true; });
    announce(root, copy.messages.started, 'success'); startTicker();
  }
  function pause() {
    if (!running) return;
    elapsedBeforePause = elapsed(); running = false; clearInterval(ticker); ticker = 0;
    output.start.disabled = true; output.pause.disabled = true; output.resume.disabled = false;
    announce(root, copy.messages.paused, 'status'); update();
  }
  async function resume() {
    if (!config || running || completed) return;
    await enableAudio(); startedAt = performance.now(); running = true;
    output.start.disabled = true; output.pause.disabled = false; output.resume.disabled = true;
    announce(root, copy.messages.resumed, 'status'); startTicker();
  }
  function reset() {
    running = false; completed = false; clearInterval(ticker); ticker = 0;
    elapsedBeforePause = 0; lastPhase = null;
    field('pattern').value = 'box'; field('inhaleSeconds').value = '4'; field('holdAfterInhaleSeconds').value = '4';
    field('exhaleSeconds').value = '4'; field('holdAfterExhaleSeconds').value = '4'; field('durationSeconds').value = '60'; field('sound').checked = false;
    settings.forEach((control) => { control.disabled = false; });
    output.start.disabled = false; output.pause.disabled = true; output.resume.disabled = true;
    try { config = readConfig(); update(); } catch { config = null; }
    announce(root, copy.messages.reset, 'status');
  }
  function applyPattern() {
    if (running) return;
    const pattern = field('pattern').value;
    if (pattern === 'balanced') { field('inhaleSeconds').value = '4'; field('holdAfterInhaleSeconds').value = '0'; field('exhaleSeconds').value = '6'; field('holdAfterExhaleSeconds').value = '0'; }
    if (pattern === 'box') { field('inhaleSeconds').value = '4'; field('holdAfterInhaleSeconds').value = '4'; field('exhaleSeconds').value = '4'; field('holdAfterExhaleSeconds').value = '4'; }
    if (pattern === '478') { field('inhaleSeconds').value = '4'; field('holdAfterInhaleSeconds').value = '7'; field('exhaleSeconds').value = '8'; field('holdAfterExhaleSeconds').value = '0'; }
    if (pattern !== 'custom') { elapsedBeforePause = 0; completed = false; lastPhase = null; }
    try { config = readConfig(); update(); } catch { config = null; }
  }

  output.start.addEventListener('click', start);
  output.pause.addEventListener('click', pause);
  output.resume.addEventListener('click', resume);
  form.addEventListener('reset', (event) => { event.preventDefault(); reset(); });
  field('pattern').addEventListener('change', applyPattern);
  form.addEventListener('input', (event) => {
    if (running) return;
    if (event.target !== field('sound')) field('pattern').value = 'custom';
    completed = false; elapsedBeforePause = 0; lastPhase = null; announce(root, '', 'status');
    try { config = readConfig(); update(); } catch { config = null; }
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && running) update(); });
  output.pause.disabled = true; output.resume.disabled = true;
  try { config = readConfig(); update(); } catch { /* Validate on start if defaults were changed. */ }
}
