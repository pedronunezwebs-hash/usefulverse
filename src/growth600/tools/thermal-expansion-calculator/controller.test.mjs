import assert from 'node:assert/strict';
import test from 'node:test';
import { thermalExpansionCalculatorEnglishCopy as copy } from '../../locales/thermal-expansion-calculator.en.mjs';

class ElementMock {
  value = '';
  textContent = '';
  hidden = false;
  disabled = false;
  dataset = {};
  children = [];
  listeners = new Map();
  attributes = {};
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  focus() { this.focused = true; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller calculates, changes units by mode, announces, and clears results on reset', async () => {
  const values = {
    mode: new ElementMock(), initialDimension: new ElementMock(), lengthUnit: new ElementMock(), areaUnit: new ElementMock(), volumeUnit: new ElementMock(),
    coefficient: new ElementMock(), coefficientTemperatureUnit: new ElementMock(), deltaTemperature: new ElementMock(), temperatureUnit: new ElementMock(),
  };
  Object.entries({ mode: 'linear', initialDimension: '10', lengthUnit: 'm', areaUnit: 'm²', volumeUnit: 'm³', coefficient: '0.000012', coefficientTemperatureUnit: 'C', deltaTemperature: '50', temperatureUnit: 'C' }).forEach(([name, value]) => { values[name].value = value; });
  const wrappers = ['linear', 'area', 'volume'].map((thermalUnit) => {
    const select = new ElementMock();
    return Object.assign(new ElementMock(), { dataset: { thermalUnit }, querySelector: () => select, select });
  });
  const controls = new Map(['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]'].map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  controls.set('#tool-form', Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null, querySelectorAll: () => wrappers };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="thermal-expansion-calculator"]' ? root : null, createElement: () => new ElementMock() };
  await import('./controller.mjs?controller-test');

  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(controls.get('[data-result]').hidden, false);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.calculated);
  const rowNodes = controls.get('[data-result-content]').children[0].children;
  assert.equal(rowNodes[9].textContent, '0.006 m');
  assert.equal(rowNodes[11].textContent, '10.006 m');
  assert.equal(wrappers[1].hidden, true);

  values.mode.value = 'area';
  await values.mode.listeners.get('change')();
  assert.equal(wrappers[1].hidden, false);
  assert.equal(controls.get('[data-status]').textContent, '');
  assert.equal(wrappers[1].select.disabled, false);
  assert.equal(wrappers[0].select.disabled, true);
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);

  values.mode.value = 'linear'; // Native form reset restores the first select option before its reset handler runs.
  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(controls.get('[data-result]').hidden, true);
  assert.equal(wrappers[1].hidden, true);
});
