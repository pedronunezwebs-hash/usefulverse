import { buildScale, MUSIC_SCALES, validateScalePlayback } from './music-scale-logic.mjs';

const $ = (selector, root) => root.querySelector(selector);
const say = (phrase) => window.usefulverseLocale?.runtime?.[phrase] ?? window.usefulverseLocale?.messages?.[phrase] ?? phrase;

export function setupMusicScaleFinder(root) {
  const rootSelect = $('[data-scale-root]', root);
  const scaleSelect = $('[data-scale-type]', root);
  const output = $('[data-scale-output]', root);
  const play = $('[data-scale-play]', root);
  const stop = $('[data-scale-stop]', root);
  const status = $('[data-scale-status]', root);
  let context;
  let activeOscillators = [];
  let runToken = 0;

  function stopPlayback(message = '') {
    runToken += 1;
    for (const oscillator of activeOscillators) { try { oscillator.stop(); } catch {} }
    activeOscillators = [];
    stop.disabled = true;
    play.disabled = false;
    if (message) status.textContent = message;
  }

  function render() {
    stopPlayback();
    try {
      const notes = buildScale({ root: rootSelect.value, scale: scaleSelect.value });
      output.innerHTML = `<div class="music-scale__notes">${notes.map(({ note, degree }) => `<div class="music-scale__note"><strong>${note}</strong><span>${degree}</span></div>`).join('')}</div><p class="tool-hint">${say('Semitone steps')}: ${notes.map(({ semitones }, index) => index ? semitones - notes[index - 1].semitones : 0).join(' · ')}</p>`;
      output.dataset.notes = notes.map(({ midi }) => midi).join(',');
      status.textContent = '';
    } catch {
      output.textContent = say('Choose a root note and scale.');
    }
  }

  async function playScale() {
    stopPlayback();
    const token = runToken;
    try {
      const { durationMs, volume } = validateScalePlayback();
      const Context = window.AudioContext ?? window.webkitAudioContext;
      if (!Context) throw new Error('audio');
      context ??= new Context();
      await context.resume();
      const notes = buildScale({ root: rootSelect.value, scale: scaleSelect.value });
      play.disabled = true;
      stop.disabled = false;
      status.textContent = say('Playing the scale in this browser.');
      const gap = 0.08;
      const startsAt = context.currentTime + 0.04;
      notes.forEach(({ midi }, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const startAt = startsAt + index * (durationMs / 1000 + gap);
        oscillator.type = 'sine';
        oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
        gain.gain.setValueAtTime(volume, startAt + durationMs / 1000 - 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationMs / 1000);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + durationMs / 1000 + 0.01);
        oscillator.onended = () => { activeOscillators = activeOscillators.filter((item) => item !== oscillator); if (!activeOscillators.length && token === runToken) stopPlayback(say('Scale playback finished.')); };
        activeOscillators.push(oscillator);
      });
    } catch {
      stopPlayback(say('Audio could not start. Check your browser audio settings.'));
    }
  }

  rootSelect.addEventListener('change', render);
  scaleSelect.addEventListener('change', render);
  play.addEventListener('click', playScale);
  stop.addEventListener('click', () => stopPlayback(say('Scale playback stopped.')));
  window.addEventListener('pagehide', () => { stopPlayback(); if (context && context.state !== 'closed') void context.close(); }, { once: true });
  render();
}

export { MUSIC_SCALES };
