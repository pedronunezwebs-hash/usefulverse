import assert from 'node:assert/strict';
import test from 'node:test';
import { idealGasLawCalculatorEnglishCopy as copy } from '../../locales/ideal-gas-law-calculator.en.mjs';

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

test('controller calculates a molar gas volume, keeps units equivalent and resets output', async () => {
  const names = ['pressure', 'pressureUnit', 'volume', 'volumeUnit', 'amount', 'amountUnit', 'temperature', 'temperatureUnit'];
  const values = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  Object.entries({ pressure: '1', pressureUnit: 'atm', volume: '', volumeUnit: 'L', amount: '1', amountUnit: 'mol', temperature: '273.15', temperatureUnit: 'K' }).forEach(([name, value]) => { values[name].value = value; });
  const selectors = ['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  controls.set('#tool-form', Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="ideal-gas-law-calculator"]' ? root : null, createElement: () => new ElementMock() };
  await import('./controller.mjs?controller-test');

  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(controls.get('[data-result]').hidden, false);
  const rows = controls.get('[data-result-content]').children[0].children;
  assert.match(rows[1].textContent, /^22\.4139[0-9]* L$/u);
  assert.equal(rows[11].textContent, 'PV = nRT');

  values.pressureUnit.value = 'kPa';
  await values.pressureUnit.dispatch('change');
  assert.ok(Math.abs(Number(values.pressure.value) - 101.325) < 1e-10);
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(controls.get('[data-result]').hidden, true);
});
