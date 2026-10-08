import assert from 'node:assert/strict';
import test from 'node:test';
import { numberLineGraphingEnglishCopy as copy } from '../../locales/number-line-graphing-tool.en.mjs';

class ElementMock {
  value = '';
  textContent = '';
  hidden = false;
  disabled = false;
  dataset = {};
  children = [];
  attributes = {};
  listeners = new Map();
  addEventListener(type, callback) { this.listeners.set(type, callback); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  async dispatch(type, event = {}) { return this.listeners.get(type)?.({ preventDefault() {}, ...event }); }
}

test('controller draws intervals with accessible hollow/filled endpoints and clears stale graph', async () => {
  const input = new ElementMock();
  input.value = '(1, 3]\n[5/2, 5/2]';
  const selectors = ['[data-number-line-result]', '[data-number-line-chart]', '[data-action="download-svg"]', '[data-action="example"]', '[data-status]'];
  const controls = new Map(selectors.map((selector) => [selector, new ElementMock()]));
  controls.set('[data-tool-copy]', Object.assign(new ElementMock(), { textContent: JSON.stringify(copy) }));
  controls.set('#tool-form', Object.assign(new ElementMock(), { elements: { namedItem: (name) => name === 'intervals' ? input : null } }));
  const root = { querySelector: (selector) => controls.get(selector) ?? null };
  globalThis.document = {
    documentElement: { lang: 'en' },
    querySelector: (selector) => selector === '[data-tool="number-line-graphing-tool"]' ? root : null,
    createElementNS: () => new ElementMock(),
    createElement: () => Object.assign(new ElementMock(), { click() { this.clicked = true; } }),
  };
  let createdObjectUrl = '';
  let revokedObjectUrl = '';
  Object.defineProperty(globalThis, 'URL', { configurable: true, value: { createObjectURL: () => (createdObjectUrl = 'blob:test'), revokeObjectURL: (url) => { revokedObjectUrl = url; } } });
  globalThis.XMLSerializer = class { serializeToString() { return '<svg xmlns="http://www.w3.org/2000/svg" />'; } };

  await import('./controller.mjs?controller-test');
  const form = controls.get('#tool-form');
  await form.dispatch('submit');
  assert.equal(controls.get('[data-number-line-result]').hidden, false);
  assert.equal(controls.get('[data-action="download-svg"]').disabled, false);
  const svg = controls.get('[data-number-line-chart]').children[0];
  assert.equal(svg.attributes.role, 'img');
  const flatten = (node) => [node, ...node.children.flatMap(flatten)];
  const circles = flatten(svg).filter((node) => node.attributes.cx !== undefined);
  assert.equal(circles.length, 3);
  assert.equal(circles[0].attributes.fill, '#fff');
  assert.equal(circles[1].attributes.fill, '#111827');
  await controls.get('[data-action="download-svg"]').dispatch('click');
  assert.equal(createdObjectUrl, 'blob:test');
  assert.equal(controls.get('[data-status]').textContent, copy.messages.downloaded);
  await form.dispatch('input');
  assert.equal(controls.get('[data-number-line-result]').hidden, true);
  assert.equal(controls.get('[data-action="download-svg"]').disabled, true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(revokedObjectUrl, 'blob:test');
});
