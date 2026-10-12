import assert from 'node:assert/strict';
import test from 'node:test';
import { breathingExerciseEnglishCopy as copy } from '../../locales/breathing-exercise.en.mjs';

class Control {
  constructor(value = '') { this.value = value; this.checked = false; this.disabled = false; this.textContent = ''; this.dataset = {}; this.listeners = new Map(); this.classList = { toggle() {} }; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  async fire(type, event = {}) { await this.listeners.get(type)?.({ preventDefault() {}, target: this, ...event }); }
}

test('controller starts, follows monotonic time, pauses, resumes, completes and resets', async () => {
  let now = 0;
  let intervalCallback;
  let nextInterval = 0;
  const intervals = new Map();
  const audioEvents = [];
  const audioNode = () => ({ frequency: { value: 0 }, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() { audioEvents.push('start'); }, stop() { audioEvents.push('stop'); } });
  const controls = Object.fromEntries([
    'pattern', 'inhaleSeconds', 'holdAfterInhaleSeconds', 'exhaleSeconds', 'holdAfterExhaleSeconds', 'durationSeconds', 'sound',
  ].map((name) => [name, new Control(({ pattern: 'box', inhaleSeconds: '4', holdAfterInhaleSeconds: '4', exhaleSeconds: '4', holdAfterExhaleSeconds: '4', durationSeconds: '30' })[name] ?? '')]));
  const form = new Control();
  form.elements = { namedItem: (name) => controls[name] };
  const root = new Control();
  const output = {
    phase: new Control(), cycle: new Control(), remaining: new Control(), progress: new Control(), orb: new Control(),
    start: new Control(), pause: new Control(), resume: new Control(),
  };
  const status = new Control();
  const copyNode = new Control();
  copyNode.textContent = JSON.stringify(copy);
  root.querySelector = (selector) => ({
    '#tool-form': form,
    '[data-tool-copy]': copyNode,
    '[data-status]': status,
    '[data-breathing-phase]': output.phase,
    '[data-breathing-cycle]': output.cycle,
    '[data-breathing-remaining]': output.remaining,
    '[data-breathing-progress]': output.progress,
    '[data-breathing-orb]': output.orb,
    '[data-action="start"]': output.start,
    '[data-action="pause"]': output.pause,
    '[data-action="resume"]': output.resume,
  })[selector] ?? null;
  const listeners = new Map();
  globalThis.document = { hidden: false, documentElement: { lang: 'en' }, querySelector: () => root, addEventListener: (type, listener) => listeners.set(type, listener) };
  globalThis.window = { AudioContext: class { state = 'running'; currentTime = 0; destination = {}; createOscillator() { return audioNode(); } createGain() { return audioNode(); } async resume() {} } };
  Object.defineProperty(globalThis, 'performance', { configurable: true, value: { now: () => now } });
  globalThis.setInterval = (callback) => { intervalCallback = callback; const id = ++nextInterval; intervals.set(id, callback); return id; };
  globalThis.clearInterval = (id) => intervals.delete(id);

  await import('./controller.mjs');
  assert.equal(output.phase.textContent, copy.fields.inhaleCue);
  controls.sound.checked = true;
  await output.start.fire('click');
  assert.equal(output.start.disabled, true);
  assert.equal(output.pause.disabled, false);
  assert.equal(controls.inhaleSeconds.disabled, true);

  now = 4_000;
  intervalCallback();
  assert.equal(output.phase.textContent, copy.fields.holdCue);
  assert.ok(audioEvents.includes('start'), 'the optional cue plays only after the start gesture');
  await output.pause.fire('click');
  assert.equal(status.textContent, copy.messages.paused);
  assert.equal(intervals.size, 0);
  now = 40_000;
  await output.resume.fire('click');
  now = 44_000;
  intervalCallback();
  assert.equal(output.phase.textContent, copy.fields.exhaleCue);

  now = 70_000;
  intervalCallback();
  assert.equal(output.phase.textContent, copy.fields.complete);
  assert.equal(output.start.disabled, false);
  assert.equal(output.pause.disabled, true);
  assert.equal(controls.inhaleSeconds.disabled, false);

  await form.fire('reset');
  assert.equal(controls.pattern.value, 'box');
  assert.equal(controls.durationSeconds.value, '60');
  assert.equal(controls.sound.checked, false);
  assert.equal(status.textContent, copy.messages.reset);
  assert.equal(output.phase.textContent, copy.fields.inhaleCue);
});
