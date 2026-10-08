import assert from 'node:assert/strict';
import test from 'node:test';
import { divisibilityCalculatorEnglishCopy as copy } from '../../locales/divisibility-calculator.en.mjs';

class ElementMock {
  value = '';
  textContent = '';
  hidden = false;
  dataset = {};
  listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller calculates exact results, clears stale output, loads presets and copies the result', async () => {
  const fields = { integer: Object.assign(new ElementMock(), { value: '123' }), divisors: Object.assign(new ElementMock(), { value: '2, 3, 5, 7, 11' }) };
  const selectors = ['[data-divisibility-result]', '[data-divisibility-summary]', '[data-status]', '[data-action="example"]', '[data-action="common-divisors"]', '[data-action="copy"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.set('[data-tool-copy]', Object.assign(new ElementMock(), { textContent: JSON.stringify(copy) }));
  controls.set('#tool-form', Object.assign(new ElementMock(), { elements: { namedItem: (name) => fields[name] }, reportValidity: () => true }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="divisibility-calculator"]' ? root : null };
  let clipboard = '';
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async (value) => { clipboard = value; } } } });

  await import('./controller.mjs?controller-test');
  const form = controls.get('#tool-form');
  const result = controls.get('[data-divisibility-result]');
  const output = controls.get('[data-divisibility-summary]');
  await form.dispatch('submit');
  assert.equal(result.hidden, false);
  assert.match(output.textContent, /2: Not divisible; Remainder: 1/u);
  assert.match(output.textContent, /3: Divisible; Remainder: 0; Exact quotient: 41/u);
  await controls.get('[data-action="copy"]').dispatch('click');
  assert.equal(clipboard, output.textContent);
  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(fields.integer.value, '123');
  assert.equal(fields.divisors.value, '2, 3');
  await controls.get('[data-action="common-divisors"]').dispatch('click');
  assert.match(fields.divisors.value, /^2, 3, 4/u);
  assert.equal(result.hidden, true);
  await form.dispatch('input');
  assert.equal(output.textContent, '');
});
