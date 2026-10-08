import assert from 'node:assert/strict';
import test from 'node:test';
import { readabilityCheckerEnglishCopy } from '../../locales/readability-checker.en.mjs';

class ElementMock {
  value = '';
  textContent = '';
  hidden = true;
  dataset = {};
  attributes = new Set();
  listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name) { this.attributes.add(name); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.focused = true; }
  async dispatch(type, event = {}) {
    return this.listeners.get(type)?.({ preventDefault() {}, ...event });
  }
}

test('controller preselects the page language, calculates locally and hides stale results', async () => {
  const input = new ElementMock();
  const language = new ElementMock();
  language.value = 'en';
  const form = new ElementMock();
  form.elements = { namedItem: (name) => ({ text: input, language }[name]) };
  const controls = new Map([
    ['[data-tool-copy]', Object.assign(new ElementMock(), { textContent: JSON.stringify(readabilityCheckerEnglishCopy) })],
    ['#tool-form', form],
    ['[data-readability-result]', new ElementMock()],
    ['[data-readability-score]', new ElementMock()],
    ['[data-readability-formula]', new ElementMock()],
    ['[data-status]', new ElementMock()],
    ['[data-action="example"]', new ElementMock()],
    ['[data-action="copy"]', new ElementMock()],
  ]);
  for (const marker of ['words', 'sentences', 'characters', 'characters-no-spaces', 'letters', 'syllables', 'average-sentence', 'average-word', 'average-syllables', 'long-words']) {
    controls.set(`[data-readability-${marker}]`, new ElementMock());
  }
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = { documentElement: { lang: 'es' }, querySelector: (selector) => selector === '[data-tool="readability-checker"]' ? root : null };
  await import('./controller.mjs?controller-test');
  assert.equal(language.value, 'es');

  input.value = 'Casa bonita.';
  await form.dispatch('submit');
  assert.equal(controls.get('[data-readability-result]').hidden, false);
  assert.match(controls.get('[data-readability-score]').textContent, /Fernández-Huerta: 54[.,]8/u);
  assert.equal(controls.get('[data-readability-words]').textContent, '2');
  assert.equal(controls.get('[data-readability-syllables]').textContent, '5');
  assert.equal(controls.get('[data-status]').textContent, readabilityCheckerEnglishCopy.messages.analyzed);

  input.dispatch('input');
  assert.equal(controls.get('[data-readability-result]').hidden, true);
  assert.equal(controls.get('[data-action="copy"]').listeners.has('click'), true);
});
