import assert from 'node:assert/strict';
import test from 'node:test';
import { alarmClockEnglishCopy as copy } from '../../locales/alarm-clock.en.mjs';

class Control {
  constructor(value = '') { this.value = value; this.checked = false; this.disabled = false; this.hidden = false; this.textContent = ''; this.dataset = {}; this.listeners = new Map(); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  async fire(type, event = {}) { await this.listeners.get(type)?.({ preventDefault() {}, target: this, ...event }); }
  focus() { this.focused = true; }
}

test('controller schedules once, catches up after a hidden tab, snoozes five minutes and stops', async () => {
  const originalDateNow = Date.now;
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  let now = new Date(2030, 0, 1, 9, 0).getTime();
  Date.now = () => now;
  const callbacks = new Map();
  const timeouts = [];
  let nextTimer = 0;
  const sounds = [];
  const oscillator = () => ({ frequency: { setValueAtTime() {} }, type: '', connect() {}, start() { sounds.push('start'); }, stop() { sounds.push('stop'); } });
  const controls = {
    alarmTime: new Control(), sound: new Control(),
  };
  const form = new Control();
  form.elements = { namedItem: (name) => controls[name] };
  const status = new Control();
  const target = new Control();
  const remaining = new Control();
  const ringing = new Control();
  const actions = Object.fromEntries(['schedule', 'testSound', 'cancel', 'snooze', 'stop'].map((name) => [name, new Control()]));
  const copyNode = new Control(); copyNode.textContent = JSON.stringify(copy);
  const root = new Control();
  root.querySelector = (selector) => ({
    '#tool-form': form, '[data-tool-copy]': copyNode, '[data-status]': status,
    '[data-alarm-target]': target, '[data-alarm-remaining]': remaining,
    '[data-alarm-ringing]': ringing,
    '[data-action="schedule"]': actions.schedule,
    '[data-action="testSound"]': actions.testSound,
    '[data-action="cancel"]': actions.cancel,
    '[data-action="snooze"]': actions.snooze,
    '[data-action="stop"]': actions.stop,
  })[selector] ?? null;
  const documentListeners = new Map();
  globalThis.document = {
    hidden: false,
    documentElement: { lang: 'en' },
    querySelector: () => root,
    addEventListener: (type, listener) => documentListeners.set(type, listener),
  };
  globalThis.window = {
    AudioContext: class {
      state = 'running'; currentTime = 0; destination = {};
      createOscillator() { return oscillator(); }
      createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
      async resume() {}
    },
    setInterval(callback) { const id = ++nextTimer; callbacks.set(id, callback); return id; },
    clearInterval(id) { callbacks.delete(id); },
    setTimeout(callback) { timeouts.push(callback); return timeouts.length; },
  };

  try {
    await import(`./controller.mjs?test=${Date.now()}`);
    controls.alarmTime.value = '2030-01-01T09:01';
    controls.sound.checked = true;
    await actions.schedule.fire('click');
    assert.match(status.textContent, /^Alarm set for/u);
    assert.equal(callbacks.size, 1);
    const tick = [...callbacks.values()][0];

    now += 60_000;
    tick();
    assert.equal(ringing.hidden, false);
    assert.equal(actions.snooze.hidden, false);
    assert.ok(sounds.includes('start'), 'the opt-in sound starts after the schedule gesture');
    const ringMessage = status.textContent;
    documentListeners.get('visibilitychange')();
    assert.equal(status.textContent, ringMessage, 'visibility catch-up must not ring twice');

    now += 15_000;
    await actions.snooze.fire('click');
    assert.equal(ringing.hidden, true);
    assert.equal(status.textContent, copy.messages.snoozed);
    now += 300_000;
    [...callbacks.values()][0]();
    assert.equal(ringing.hidden, false, 'the snoozed alarm rings after five minutes');

    await actions.stop.fire('click');
    assert.equal(callbacks.size, 0);
    assert.equal(ringing.hidden, true);
    assert.equal(target.textContent, '—');
    assert.equal(status.textContent, copy.messages.stopped);
  } finally {
    Date.now = originalDateNow;
    if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument;
    if (originalWindow === undefined) delete globalThis.window; else globalThis.window = originalWindow;
  }
});
