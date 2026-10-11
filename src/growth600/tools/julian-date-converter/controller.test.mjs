import assert from 'node:assert/strict';
import test from 'node:test';
import { julianDateConverterEnglishCopy as copy } from '../../locales/julian-date-converter.en.mjs';

class ElementMock {
  value = ''; textContent = ''; hidden = false; dataset = {}; children = []; listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  replaceChildren(...nodes) { this.children = nodes; }
  append(...nodes) { this.children.push(...nodes); }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller converts UTC and MJD both ways, switches visible inputs, clears stale result and copies', async () => {
  const values = Object.fromEntries(['direction', 'utcDate', 'julianValue', 'dateKind'].map((name) => [name, new ElementMock()]));
  Object.assign(values, { direction: Object.assign(values.direction, { value: 'to-jd' }), utcDate: Object.assign(values.utcDate, { value: '2000-01-01T12:00:00' }), julianValue: Object.assign(values.julianValue, { value: '51544.5' }), dateKind: Object.assign(values.dateKind, { value: 'mjd' }) });
  const selectors = ['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-jd-input="utc"]', '[data-jd-input="value"]', '[data-action="example"]', '[data-action="copy"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  controls.set('#tool-form', Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="julian-date-converter"]' ? root : null, createElement: () => new ElementMock() };
  let clipboard = '';
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async (value) => { clipboard = value; } } } });
  await import('./controller.mjs?controller-test');

  assert.equal(controls.get('[data-jd-input="utc"]').hidden, false);
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  let rows = controls.get('[data-result-content]').children[0].children;
  assert.equal(rows[1].textContent, '2,451,545');
  assert.equal(rows[7].textContent, copy.messages.calendarValue);
  await controls.get('[data-action="copy"]').dispatch('click');
  assert.match(clipboard, /Julian Date \(JD\): 2,451,545/u);

  values.direction.value = 'to-utc'; await controls.get('#tool-form').dispatch('change');
  assert.equal(controls.get('[data-jd-input="utc"]').hidden, true);
  assert.equal(controls.get('[data-jd-input="value"]').hidden, false);
  await controls.get('#tool-form').dispatch('submit');
  rows = controls.get('[data-result-content]').children[0].children;
  assert.equal(rows[1].textContent, '2000-01-01T12:00:00.000Z');
  values.julianValue.value = 'not a date'; await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, true);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.checkInputs);
});
