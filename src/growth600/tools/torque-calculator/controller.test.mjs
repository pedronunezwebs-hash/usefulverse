import assert from 'node:assert/strict';
import test from 'node:test';
import { torqueCalculatorEnglishCopy as copy } from '../../locales/torque-calculator.en.mjs';

class ElementMock {
  value = ''; textContent = ''; hidden = false; dataset = {}; children = []; listeners = new Map(); attributes = {};
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller calculates, solves inverse values, preserves unit conversions and resets', async () => {
  const names = ['mode', 'force', 'forceUnit', 'arm', 'distanceUnit', 'angle', 'torque', 'torqueUnit', 'direction'];
  const values = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  Object.assign(values.mode, { value: 'solve-torque' });
  Object.assign(values.force, { value: '10' });
  Object.assign(values.forceUnit, { value: 'N' });
  Object.assign(values.arm, { value: '2' });
  Object.assign(values.distanceUnit, { value: 'm' });
  Object.assign(values.angle, { value: '90' });
  Object.assign(values.torque, { value: '' });
  Object.assign(values.torqueUnit, { value: 'N·m' });
  Object.assign(values.direction, { value: 'counterclockwise' });

  const selectors = ['#tool-form', '[data-tool-copy]', '[data-status]', '[data-result]', '[data-result-content]', '[data-action="example"]', '[data-action="copy"]', '[data-torque-field="force"]', '[data-torque-field="arm"]', '[data-torque-field="torque"]', '[data-torque-field="direction"]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.get('[data-tool-copy]').textContent = JSON.stringify(copy);
  Object.assign(controls.get('#tool-form'), { elements: { namedItem: (name) => values[name] } });
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = {
    documentElement: { lang: 'en' },
    querySelector: (selector) => selector === '[data-tool="torque-calculator"]' ? root : null,
    createElement: () => new ElementMock(),
    createElementNS: () => new ElementMock(),
  };
  await import('./controller.mjs?controller-test');

  await controls.get('#tool-form').dispatch('submit');
  assert.equal(controls.get('[data-result]').hidden, false);
  const resultValues = controls.get('[data-result-content]').children[0].children.filter((_, index) => index % 2 === 1).map((node) => node.textContent);
  assert.ok(resultValues.includes('20 N·m'));
  assert.ok(resultValues.includes('10 N'));
  assert.equal(controls.get('[data-torque-field="torque"]').hidden, true);

  values.distanceUnit.value = 'cm';
  await values.distanceUnit.dispatch('change');
  assert.equal(values.arm.value, '200');
  values.mode.value = 'solve-force';
  await values.mode.dispatch('change');
  assert.equal(controls.get('[data-torque-field="force"]').hidden, true);
  values.force.value = '';
  values.torque.value = '10';
  await controls.get('#tool-form').dispatch('submit');
  const inverseValues = controls.get('[data-result-content]').children[0].children.filter((_, index) => index % 2 === 1).map((node) => node.textContent);
  assert.ok(inverseValues.includes('5 N'));

  await controls.get('#tool-form').dispatch('reset');
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(controls.get('[data-result]').hidden, true);
});
