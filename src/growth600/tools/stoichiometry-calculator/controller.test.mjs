import assert from 'node:assert/strict';
import test from 'node:test';
import { stoichiometryCalculatorEnglishCopy as copy } from '../../locales/stoichiometry-calculator.en.mjs';

class ElementMock {
  value = ''; textContent = ''; hidden = false; dataset = {}; children = []; listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller renders a complete yield calculation, refreshes products and clears invalid results', async () => {
  const names = ['equation', 'inputMode', 'reactantAmounts', 'selectedProduct', 'actualProductMass'];
  const values = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  Object.assign(values.equation, { value: 'H2 + O2 -> H2O' });
  Object.assign(values.inputMode, { value: 'mass' });
  Object.assign(values.reactantAmounts, { value: '4.032\n31.998' });
  Object.assign(values.actualProductMass, { value: '18.015' });
  values.selectedProduct.replaceChildren = function (...nodes) {
    this.children = nodes;
    if (!nodes.some(({ value }) => value === this.value)) this.value = nodes[0]?.value ?? '';
  };
  const selectors = ['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-reactant-list]', '[data-action="example"]', '[data-action="copy"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } });
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = {
    documentElement: { lang: 'en' },
    querySelector: (selector) => selector === '[data-tool="stoichiometry-calculator"]' ? root : null,
    createElement: () => new ElementMock(),
  };
  await import('./controller.mjs?controller-test');

  assert.match(controls.get('[data-reactant-list]').textContent, /1\. 2 H2.*2\. O2/u);
  assert.equal(values.selectedProduct.value, 'H2O');
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  const valuesRendered = controls.get('[data-result-content]').children[0].children.filter((_, index) => index % 2 === 1).map(({ textContent }) => textContent);
  assert.ok(valuesRendered.some((value) => value.includes('2 mol · 36.03 g')));
  assert.ok(valuesRendered.some((value) => value.includes('50%')));

  values.equation.value = 'CH4 + O2 -> CO2 + H2O';
  await values.equation.dispatch('input');
  assert.deepEqual(values.selectedProduct.children.map(({ value }) => value), ['CO2', 'H2O']);
  values.inputMode.value = 'moles';
  values.reactantAmounts.value = '1\n2';
  values.actualProductMass.value = '';
  await controls.get('#tool-form').dispatch('submit');
  const multiProducts = controls.get('[data-result-content]').children[0].children.filter((_, index) => index % 2 === 1).map(({ textContent }) => textContent);
  assert.ok(multiProducts.some((value) => value.includes('1 mol · 44.009 g')), multiProducts.join(' | '));
  assert.ok(multiProducts.some((value) => value.includes('2 mol · 36.03 g')), multiProducts.join(' | '));

  values.reactantAmounts.value = '1';
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, true);
  assert.equal(controls.get('[data-status]').dataset.kind, 'error');
});
