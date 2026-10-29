import { createHearingObservation, HEARING_TONE_FREQUENCIES_HZ } from './logic.mjs';

const root = document.querySelector('[data-tool="hearing-self-check"]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('[data-hearing-form]');
  const status = root.querySelector('[data-hearing-status]');
  const summary = root.querySelector('[data-hearing-summary]');
  const responses = Object.create(null);
  const played = new Set();
  let audioContext;
  let playing = false;

  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = String(text);
    if (className) element.className = className;
    return element;
  };
  const message = (key) => copy.messages?.[key] ?? '';
  const fields = copy.fields ?? {};

  async function playTone(frequency, button) {
    if (playing) return;
    playing = true;
    form.querySelectorAll('[data-hearing-play]').forEach((playButton) => { playButton.disabled = true; });
    try {
      const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('unsupported');
      audioContext ??= new AudioContextClass();
      if (audioContext.state === 'suspended') await audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.02, start + 0.05);
      gain.gain.setValueAtTime(0.02, start + 0.55);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.72);
      played.add(frequency);
      status.textContent = message('tonePlayed').replace('{frequency}', String(frequency));
      status.classList.remove('status--error');
      window.setTimeout(() => {
        play.closest('[data-hearing-frequency]')?.querySelectorAll('[data-hearing-response="heard"], [data-hearing-response="not-heard"]')
          .forEach((response) => { response.disabled = false; });
      }, 750);
    } catch {
      status.textContent = message('audioUnavailable');
      status.classList.add('status--error');
    } finally {
      window.setTimeout(() => {
        playing = false;
        form.querySelectorAll('[data-hearing-play]').forEach((playButton) => { playButton.disabled = false; });
      }, 750);
    }
  }

  function renderSummary() {
    const observations = createHearingObservation(responses);
    summary.replaceChildren();
    summary.append(node('h2', fields.resultTitle));
    const list = node('ul');
    for (const item of observations) {
      const report = item.response === 'heard' ? fields.heard : item.response === 'not-heard' ? fields.notHeard : fields.skipped;
      list.append(node('li', `${item.frequency} Hz — ${report}`));
    }
    summary.append(list, node('p', fields.noClinicalScore));
    summary.hidden = false;
  }

  form.addEventListener('click', (event) => {
    const play = event.target.closest('[data-hearing-play]');
    if (play) {
      const frequency = Number(play.dataset.hearingPlay);
      if (HEARING_TONE_FREQUENCIES_HZ.includes(frequency)) void playTone(frequency, play);
      return;
    }
    const response = event.target.closest('[data-hearing-response]');
    if (response) {
      const frequency = Number(response.dataset.frequency);
      if (!HEARING_TONE_FREQUENCIES_HZ.includes(frequency)) return;
      if (response.dataset.hearingResponse !== 'skipped' && !played.has(frequency)) return;
      responses[frequency] = response.dataset.hearingResponse;
      const group = response.closest('[data-hearing-frequency]');
      group.querySelectorAll('[data-hearing-response]').forEach((button) => button.setAttribute('aria-pressed', String(button === response)));
      renderSummary();
      status.textContent = message('responseSaved');
      status.classList.remove('status--error');
    }
  });

  form.addEventListener('reset', () => {
    for (const key of Object.keys(responses)) delete responses[key];
    played.clear();
    form.querySelectorAll('[data-hearing-response="heard"], [data-hearing-response="not-heard"]').forEach((button) => { button.disabled = true; button.setAttribute('aria-pressed', 'false'); });
    form.querySelectorAll('[data-hearing-response="skipped"]').forEach((button) => button.setAttribute('aria-pressed', 'false'));
    summary.replaceChildren();
    summary.hidden = true;
    status.textContent = '';
    status.classList.remove('status--error');
  });
  window.addEventListener('pagehide', () => { void audioContext?.close(); }, { once: true });
}
