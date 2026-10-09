import assert from 'node:assert/strict';
import test from 'node:test';
import { sectionModulusCalculatorEnglishCopy as copy } from '../../locales/section-modulus-calculator.en.mjs';

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

test('controller calculates the square example, switches shape fields and clears on reset', async () => {
  const values = Object.fromEntries(['shape', 'width', 'height', 'diameter', 'outerWidth', 'outerHeight', 'innerWidth', 'innerHeight', 'outerDiameter', 'innerDiameter', 'unit'].map((name) => [name, new ElementMock()]));
  Object.entries({ shape: 'rectangle', width: '10', height: '10', unit: 'mm' }).forEach(([name, value]) => { values[name].value = value; });
  const shapeGroups = ['rectangle triangle', 'circle', 'hollow-rectangle', 'hollow-circle'].map((sectionShape) => Object.assign(new ElementMock(), { dataset: { sectionShape } }));
  const controls = new Map(['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]'].map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  controls.set('#tool-form', Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null, querySelectorAll: () => shapeGroups };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="section-modulus-calculator"]' ? root : null, createElement: () => new ElementMock() };
  await import('./controller.mjs?controller-test');

  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(controls.get('[data-result]').hidden, false);
  assert.equal(controls.get('[data-status]').textContent, copy.messages.exampleLoaded);
  const rendered = controls.get('[data-result-content]').children[0].children;
  assert.equal(rendered[1].textContent, '100 mm²');
  assert.equal(rendered[7].textContent, '833.333333 mm⁴');
  assert.equal(rendered[11].textContent, rendered[13].textContent);

  values.shape.value = 'hollow-circle';
  await values.shape.listeners.get('change')();
  assert.equal(shapeGroups[1].hidden, true);
  assert.equal(shapeGroups[3].hidden, false);
  values.outerDiameter.value = '10'; values.innerDiameter.value = '6';
  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);

  values.shape.value = 'rectangle'; // The browser restores native select values before the reset handler runs.
  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(controls.get('[data-result]').hidden, true);
  assert.equal(shapeGroups[0].hidden, false);
  assert.equal(shapeGroups[3].hidden, true);
});
