import assert from 'node:assert/strict';
import test from 'node:test';
import { booleanAlgebraCalculatorEnglishCopy as copy } from '../../locales/boolean-algebra-calculator.en.mjs';

class ElementMock {
  value = ''; textContent = ''; hidden = false; dataset = {}; children = []; listeners = new Map(); attributes = {}; className = '';
  classList = { add: () => {} };
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller renders exact forms, equivalent truth rows and Karnaugh cells; resets and rejects invalid input', async () => {
  const values = { expression: new ElementMock() };
  values.expression.value = '(A & B) | (A & !B)';
  const selectors = ['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } });
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { querySelector: (selector) => selector === '[data-tool="boolean-algebra-calculator"]' ? root : null, createElement: () => new ElementMock() };
  globalThis.window = { addEventListener() {} };
  await import('./controller.mjs?controller-test');

  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.calculated);
  const [summary, truthTable, kmap] = controls.get('[data-result-content]').children;
  assert.deepEqual(summary.children.map(({ textContent }) => textContent), ['Sum of products (SOP)', 'A', 'Product of sums (POS)', 'A', 'Variables', 'A, B', 'True minterm indexes', '2, 3']);
  assert.equal(truthTable.children[0].children[1].children.length, 4);
  assert.equal(kmap.children[1].children[0].children[0].children.length, 3);
  assert.equal(kmap.children[1].children[1].children.length, 2);

  values.expression.value = 'A; alert(1)';
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, true);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.checkInputs);

  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(values.expression.value, 'A; alert(1)');
  assert.equal(controls.get('[data-result]').hidden, true);
});
