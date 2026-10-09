import assert from 'node:assert/strict';
import test from 'node:test';
import { frequencyWavelengthCalculatorEnglishCopy as copy } from '../../locales/frequency-wavelength-calculator.en.mjs';

class ElementMock {
  value = ''; textContent = ''; hidden = false; disabled = false; dataset = {}; children = []; listeners = new Map(); attributes = {};
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { this.focused = true; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller loads the 100 MHz example, solves wavelength, handles a preset and reset', async () => {
  const names = ['frequency', 'frequencyUnit', 'wavelength', 'wavelengthUnit', 'speed', 'speedUnit', 'medium'];
  const values = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  Object.entries({ frequency: '100', frequencyUnit: 'MHz', wavelength: '', wavelengthUnit: 'm', speed: '300000000', speedUnit: 'm/s', medium: 'custom' }).forEach(([name, value]) => { values[name].value = value; });
  const controls = new Map(['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]'].map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  controls.set('#tool-form', Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="frequency-wavelength-calculator"]' ? root : null, createElement: () => new ElementMock() };
  await import('./controller.mjs?controller-test');

  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(controls.get('[data-result]').hidden, false);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.exampleLoaded);
  const rows = controls.get('[data-result-content]').children[0].children;
  assert.equal(rows[1].textContent, '3 m');
  assert.equal(rows[3].textContent, '100 MHz');
  assert.equal(rows[7].textContent, '300,000,000 m/s');

  values.medium.value = 'water';
  await values.medium.dispatch('change');
  assert.equal(values.speed.value, '224844343');
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(controls.get('[data-result]').hidden, true);
});
