import { announce, readToolCopy } from '../controller-helpers.mjs';
import { alarmStateAt, localDateTimeInputValue, parseLocalAlarmDateTime, snoozedAlarmTarget } from './logic.mjs';

const root = document.querySelector('[data-tool="alarm-clock"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const timeInput = form.elements.namedItem('alarmTime');
  const soundInput = form.elements.namedItem('sound');
  const status = root.querySelector('[data-status]');
  const targetOutput = root.querySelector('[data-alarm-target]');
  const remainingOutput = root.querySelector('[data-alarm-remaining]');
  const ringingOutput = root.querySelector('[data-alarm-ringing]');
  const scheduleButton = root.querySelector('[data-action="schedule"]');
  const testSoundButton = root.querySelector('[data-action="testSound"]');
  const cancelButton = root.querySelector('[data-action="cancel"]');
  const snoozeButton = root.querySelector('[data-action="snooze"]');
  const stopButton = root.querySelector('[data-action="stop"]');
  const locale = document.documentElement.lang || 'en';
  let target = null;
  let ringing = false;
  let tick = 0;
  let audioContext = null;
  let soundFailed = false;
  let scheduleAttempt = 0;
  let lastToneAt = 0;

  const formatDuration = (seconds) => {
    const total = Math.max(0, Math.ceil(seconds));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const rest = total % 60;
    const number = (value) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }).format(value);
    return `${number(hours)}:${number(minutes)}:${number(rest)}`;
  };

  function formatTarget(timestamp) {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
  }

  async function unlockAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('Audio is unavailable.');
    audioContext ??= new AudioContextClass();
    if (audioContext.state === 'suspended') await audioContext.resume();
    if (audioContext.state !== 'running') throw new Error('Audio is unavailable.');
  }

  function playTone(frequency = 740, duration = 0.32) {
    if (!audioContext || audioContext.state !== 'running') return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  async function testSound() {
    try {
      await unlockAudio();
      playTone(740, 0.24);
      window.setTimeout(() => playTone(988, 0.3), 180);
      announce(root, copy.messages.soundTested, 'success');
    } catch {
      announce(root, copy.messages.soundUnavailable, 'error');
    }
  }

  function ring() {
    if (ringing || target === null) return;
    ringing = true;
    lastToneAt = Date.now();
    ringingOutput.hidden = false;
    snoozeButton.hidden = false;
    stopButton.hidden = false;
    scheduleButton.disabled = false;
    announce(root, copy.messages.ringing, 'success');
    if (soundInput.checked && audioContext?.state === 'running') {
      playTone(740);
      window.setTimeout(() => { if (ringing && soundInput.checked) playTone(988); }, 360);
    } else if (soundInput.checked && !soundFailed) {
      soundFailed = true;
      announce(root, copy.messages.soundUnavailable, 'error');
    }
  }

  function update() {
    if (target === null) return;
    const state = alarmStateAt(target, Date.now());
    remainingOutput.textContent = formatDuration(state.remainingSeconds);
    if (state.phase === 'ringing') ring();
    const now = Date.now();
    if (ringing && soundInput.checked && audioContext?.state === 'running' && now - lastToneAt >= 1_200) {
      lastToneAt = now;
      playTone(Math.floor(now / 1_200) % 2 ? 988 : 740, 0.22);
    }
  }

  function stopTicking() {
    window.clearInterval(tick);
    tick = 0;
  }

  function startTicking() {
    stopTicking();
    tick = window.setInterval(update, 500);
    update();
  }

  function clearAlarm(message) {
    scheduleAttempt += 1;
    stopTicking();
    target = null;
    ringing = false;
    targetOutput.textContent = '—';
    remainingOutput.textContent = '—';
    ringingOutput.hidden = true;
    snoozeButton.hidden = true;
    stopButton.hidden = true;
    cancelButton.disabled = true;
    scheduleButton.disabled = false;
    announce(root, message, 'status');
  }

  async function schedule(event) {
    event?.preventDefault();
    const attempt = ++scheduleAttempt;
    let nextTarget;
    try {
      nextTarget = parseLocalAlarmDateTime(timeInput.value);
    } catch (error) {
      const text = /clock change|does not exist/u.test(error.message) ? copy.messages.invalidTime : copy.messages.checkTime;
      announce(root, text, 'error');
      timeInput.focus();
      return;
    }
    let audioUnavailable = false;
    if (soundInput.checked) {
      try { await unlockAudio(); } catch { audioUnavailable = true; }
    }
    if (attempt !== scheduleAttempt) return;
    soundFailed = audioUnavailable;
    if (audioUnavailable) announce(root, copy.messages.soundUnavailable, 'error');
    target = nextTarget;
    ringing = false;
    lastToneAt = 0;
    ringingOutput.hidden = true;
    snoozeButton.hidden = true;
    stopButton.hidden = true;
    targetOutput.textContent = formatTarget(target);
    cancelButton.disabled = false;
    scheduleButton.disabled = false;
    announce(root, copy.messages.scheduled.replace('{time}', formatTarget(target)), 'success');
    startTicking();
  }

  async function snooze() {
    if (!ringing) return;
    scheduleAttempt += 1;
    target = snoozedAlarmTarget(Date.now());
    ringing = false;
    ringingOutput.hidden = true;
    snoozeButton.hidden = true;
    stopButton.hidden = true;
    targetOutput.textContent = formatTarget(target);
    cancelButton.disabled = false;
    announce(root, copy.messages.snoozed, 'success');
    startTicking();
  }

  function syncBounds() {
    const now = Date.now();
    timeInput.min = localDateTimeInputValue(new Date(now));
    timeInput.max = localDateTimeInputValue(new Date(now + 7 * 24 * 60 * 60 * 1_000));
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); });
  scheduleButton.addEventListener('click', schedule);
  testSoundButton.addEventListener('click', testSound);
  cancelButton.addEventListener('click', () => { if (target !== null) clearAlarm(copy.messages.cancelled); });
  snoozeButton.addEventListener('click', snooze);
  stopButton.addEventListener('click', () => { if (ringing) clearAlarm(copy.messages.stopped); });
  timeInput.addEventListener('focus', syncBounds);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  cancelButton.disabled = true;
  snoozeButton.hidden = true;
  stopButton.hidden = true;
  syncBounds();
  timeInput.value = localDateTimeInputValue(new Date(Date.now() + 5 * 60 * 1_000));
}
