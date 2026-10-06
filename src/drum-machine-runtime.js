import { DEFAULT_DRUM_PATTERN, DRUM_STEPS, DRUM_TRACKS, drumStepSeconds, normalizeDrumPattern, toggleDrumStep, validateDrumTempo } from './drum-machine-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);

export function setupDrumMachine(root) {
  const messages = JSON.parse(root.dataset.plannerMessages || '{}');
  const say = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), messages[key] ?? key);
  const board = $('[data-drum-board]', root);
  const tempo = $('[data-drum-tempo]', root);
  const tempoOutput = $('[data-drum-tempo-output]', root);
  const playButton = $('[data-drum-play]', root);
  const statusElement = $('#op-status', root);
  let pattern = normalizeDrumPattern(DEFAULT_DRUM_PATTERN);
  let audioContext = null;
  let noiseBuffer = null;
  let scheduler = 0;
  let nextStepAt = 0;
  let step = 0;
  let startedAt = 0;
  let playheadStep = -1;
  let playing = false;

  const setStatus = (message, type = '') => {
    statusElement.textContent = message;
    statusElement.className = `tool-status${type ? ` is-${type}` : ''}`;
  };
  const render = () => {
    board.replaceChildren();
    for (const track of DRUM_TRACKS) {
      const row = document.createElement('div');
      row.className = 'drum-machine__row';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', say(track === 'hat' ? 'Hi-hat' : track === 'kick' ? 'Bass drum' : 'Snare drum'));
      const label = document.createElement('span');
      label.className = 'drum-machine__track';
      label.textContent = say(track === 'hat' ? 'Hi-hat' : track === 'kick' ? 'Bass drum' : 'Snare drum');
      row.append(label);
      for (let index = 0; index < DRUM_STEPS; index += 1) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'drum-machine__step';
        button.dataset.drumTrack = track;
        button.dataset.drumStep = String(index);
        button.setAttribute('aria-pressed', String(Boolean(pattern[track][index])));
        button.setAttribute('aria-label', say('{track}, step {number}', { track: say(track === 'hat' ? 'Hi-hat' : track === 'kick' ? 'Bass drum' : 'Snare drum'), number: index + 1 }));
        if (pattern[track][index]) button.classList.add('is-on');
        if (index % 4 === 0) button.classList.add('is-beat');
        if (playing && index === playheadStep) button.classList.add('is-current');
        row.append(button);
      }
      board.append(row);
    }
  };
  const createNoiseBuffer = (context) => {
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 0.2), context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    return buffer;
  };
  const envelope = (gain, at, peak, releaseAt) => {
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, releaseAt);
  };
  const playKick = (at) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(145, at);
    oscillator.frequency.exponentialRampToValueAtTime(48, at + 0.14);
    envelope(gain, at, 0.78, at + 0.17);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(at); oscillator.stop(at + 0.18);
    oscillator.addEventListener('ended', () => { oscillator.disconnect(); gain.disconnect(); }, { once: true });
  };
  const playNoise = (at, kind) => {
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = noiseBuffer;
    filter.type = kind === 'hat' ? 'highpass' : 'bandpass';
    filter.frequency.value = kind === 'hat' ? 7800 : 1900;
    filter.Q.value = kind === 'hat' ? 0.7 : 0.8;
    const decay = kind === 'hat' ? 0.035 : 0.13;
    envelope(gain, at, kind === 'hat' ? 0.09 : 0.28, at + decay);
    source.connect(filter).connect(gain).connect(audioContext.destination);
    source.start(at); source.stop(at + decay + 0.01);
    source.addEventListener('ended', () => { source.disconnect(); filter.disconnect(); gain.disconnect(); }, { once: true });
  };
  const scheduleStep = (index, at) => {
    if (pattern.kick[index]) playKick(at);
    if (pattern.snare[index]) playNoise(at, 'snare');
    if (pattern.hat[index]) playNoise(at, 'hat');
  };
  const scheduleAhead = () => {
    if (!playing || !audioContext) return;
    const horizon = audioContext.currentTime + 0.12;
    const duration = drumStepSeconds(tempo.value);
    while (nextStepAt < horizon) {
      scheduleStep(step, nextStepAt);
      nextStepAt += duration;
      step = (step + 1) % DRUM_STEPS;
    }
    const currentStep = Math.max(0, Math.floor((audioContext.currentTime - startedAt) / duration)) % DRUM_STEPS;
    if (currentStep !== playheadStep) {
      board.querySelectorAll('.is-current').forEach((node) => node.classList.remove('is-current'));
      board.querySelectorAll(`[data-drum-step="${currentStep}"]`).forEach((node) => node.classList.add('is-current'));
      playheadStep = currentStep;
    }
  };
  const stop = async (message = '') => {
    playing = false;
    if (scheduler) window.clearInterval(scheduler);
    scheduler = 0;
    playheadStep = -1;
    const context = audioContext;
    audioContext = null; noiseBuffer = null;
    playButton.textContent = say('Play');
    playButton.setAttribute('aria-label', say('Play drum pattern'));
    render();
    if (context && context.state !== 'closed') {
      try { await context.close(); } catch { /* The browser may already have closed the context. */ }
    }
    if (message) setStatus(message);
  };
  const start = async () => {
    const Context = window.AudioContext ?? window.webkitAudioContext;
    if (!Context) return setStatus(say('Audio is not available in this browser.'), 'error');
    try {
      const context = new Context();
      audioContext = context;
      await context.resume();
      if (context.state !== 'running') throw new Error('Audio context did not start.');
      noiseBuffer = createNoiseBuffer(context);
      playing = true; step = 0; nextStepAt = context.currentTime + 0.04; startedAt = nextStepAt; playheadStep = 0;
      playButton.textContent = say('Stop');
      playButton.setAttribute('aria-label', say('Stop drum pattern'));
      setStatus(say('Playing your drum pattern.'));
      scheduleAhead();
      scheduler = window.setInterval(scheduleAhead, 25);
    } catch {
      await stop(say('Audio could not start. Check your browser sound settings and try again.'));
    }
  };

  tempo.addEventListener('input', () => {
    tempoOutput.value = say('{value} BPM', { value: tempo.value });
    tempoOutput.textContent = tempoOutput.value;
  });
  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-drum-step]');
    if (button) {
      pattern = toggleDrumStep(pattern, button.dataset.drumTrack, Number(button.dataset.drumStep));
      const active = Boolean(pattern[button.dataset.drumTrack][Number(button.dataset.drumStep)]);
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-on', active);
      return;
    }
    if (event.target.closest('[data-drum-clear]')) {
      pattern = Object.fromEntries(DRUM_TRACKS.map((track) => [track, Array(DRUM_STEPS).fill(0)]));
      render(); setStatus(say('Pattern cleared.'));
      return;
    }
    if (event.target.closest('[data-drum-play]')) {
      if (playing) void stop(say('Playback stopped.'));
      else void start();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && playing) void stop(say('Playback stopped because this tab was hidden.'));
  });
  window.addEventListener('pagehide', () => { void stop(); }, { once: true });
  tempoOutput.value = say('{value} BPM', { value: tempo.value });
  tempoOutput.textContent = tempoOutput.value;
  validateDrumTempo(tempo.value);
  render();
}
