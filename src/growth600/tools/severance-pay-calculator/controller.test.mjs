import assert from 'node:assert/strict';
import test from 'node:test';
import { severancePayCalculatorEnglishCopy as copy } from '../../locales/severance-pay-calculator.en.mjs';

class ElementMock {
  value = '';
  textContent = '';
  hidden = false;
  disabled = false;
  required = false;
  dataset = {};
  listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  closest() { return this.field; }
  setAttribute() {}
  removeAttribute() {}
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller changes mode, calculates each path, clears stale results, and loads the example', async () => {
  const names = ['mode', 'weeklyPay', 'yearsOfService', 'weeksPerYear', 'birthDate', 'employmentStartDate', 'redundancyDate'];
  const fields = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  Object.assign(fields.mode, { value: 'custom' });
  Object.assign(fields.weeklyPay, { value: '500' });
  Object.assign(fields.yearsOfService, { value: '10', field: { hidden: false } });
  Object.assign(fields.weeksPerYear, { value: '2', field: { hidden: false } });
  Object.assign(fields.birthDate, { value: '1980-01-01', field: { hidden: true } });
  Object.assign(fields.employmentStartDate, { value: '2010-01-01', field: { hidden: true } });
  Object.assign(fields.redundancyDate, { value: '2026-04-06', field: { hidden: true } });
  const selectors = [
    '[data-severance-result]', '[data-severance-amount]', '[data-severance-weekly-pay]',
    '[data-severance-years]', '[data-severance-weeks]', '[data-severance-details]',
    '[data-severance-custom-note]', '[data-severance-uk-note]', '[data-status]',
    '[data-action="example"]', '[data-action="copy"]',
  ];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.set('[data-tool-copy]', Object.assign(new ElementMock(), { textContent: JSON.stringify(copy) }));
  controls.set('#tool-form', Object.assign(new ElementMock(), { elements: { namedItem: (name) => fields[name] }, reportValidity: () => true }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="severance-pay-calculator"]' ? root : null };

  await import('./controller.mjs?controller-test');
  const form = controls.get('#tool-form');
  const result = controls.get('[data-severance-result]');
  await form.dispatch('submit');
  assert.equal(result.hidden, false);
  assert.equal(controls.get('[data-severance-amount]').textContent, '10,000');
  assert.match(controls.get('[data-severance-details]').textContent, /custom assumptions/u);

  fields.mode.value = 'uk-statutory';
  await fields.mode.dispatch('change');
  assert.equal(fields.yearsOfService.disabled, true);
  assert.equal(fields.birthDate.disabled, false);
  assert.equal(controls.get('[data-severance-custom-note]').hidden, true);
  assert.equal(controls.get('[data-severance-uk-note]').hidden, false);
  await form.dispatch('submit');
  assert.equal(controls.get('[data-severance-amount]').textContent, '9,250');
  assert.match(controls.get('[data-severance-details]').textContent, /2026-04-06/u);

  await form.dispatch('input');
  assert.equal(result.hidden, true);
  await controls.get('[data-action="example"]').dispatch('click');
  assert.equal(fields.mode.value, 'custom');
  assert.equal(fields.yearsOfService.field.hidden, false);
  assert.equal(result.hidden, true);
});
