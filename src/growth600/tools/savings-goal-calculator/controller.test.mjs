import assert from 'node:assert/strict';
import test from 'node:test';
import { savingsGoalCalculatorEnglishCopy } from '../../locales/savings-goal-calculator.en.mjs';

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

test('controller switches inputs, calculates locally, and clears stale results on edits', async () => {
  const names = ['mode', 'startingBalance', 'targetAmount', 'annualRatePercent', 'months', 'monthlyContribution', 'contributionTiming'];
  const fields = Object.fromEntries(names.map((name) => [name, new ElementMock()]));
  fields.mode.value = 'required-contribution';
  fields.startingBalance.value = '0';
  fields.targetAmount.value = '1200';
  fields.annualRatePercent.value = '0';
  fields.months.value = '12';
  fields.monthlyContribution.value = '100';
  fields.contributionTiming.value = 'end';
  fields.months.field = { hidden: false };
  fields.monthlyContribution.field = { hidden: false };
  const controls = new Map([
    ['[data-tool-copy]', Object.assign(new ElementMock(), { textContent: JSON.stringify(savingsGoalCalculatorEnglishCopy) })],
    ['#tool-form', Object.assign(new ElementMock(), { elements: { namedItem: (name) => fields[name] }, reportValidity: () => true })],
    ['[data-savings-result]', new ElementMock()], ['[data-savings-primary]', new ElementMock()],
    ['[data-savings-projected]', new ElementMock()], ['[data-savings-contributions]', new ElementMock()],
    ['[data-savings-interest]', new ElementMock()], ['[data-status]', new ElementMock()],
    ['[data-action="example"]', new ElementMock()], ['[data-action="copy"]', new ElementMock()],
  ]);
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: (selector) => selector === '[data-tool="savings-goal-calculator"]' ? root : null };
  await import('./controller.mjs?controller-test');
  const form = controls.get('#tool-form');
  await form.dispatch('submit');
  assert.equal(controls.get('[data-savings-result]').hidden, false);
  assert.match(controls.get('[data-savings-primary]').textContent, /100/u);
  assert.equal(controls.get('[data-savings-projected]').textContent, '1,200');
  await form.dispatch('input');
  assert.equal(controls.get('[data-savings-result]').hidden, true);
  fields.mode.value = 'months-to-goal';
  await fields.mode.dispatch('change');
  assert.equal(fields.months.field.hidden, true);
  assert.equal(fields.monthlyContribution.field.hidden, false);
  assert.equal(fields.monthlyContribution.disabled, false);
});
