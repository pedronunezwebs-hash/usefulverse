import assert from 'node:assert/strict';
import test from 'node:test';
import { bodySurfaceAreaCalculatorEnglishCopy as copy } from '../../locales/body-surface-area-calculator.en.mjs';

class Node {
  constructor(value = '') { this.value = value; this.textContent = ''; this.hidden = false; this.dataset = {}; this.listeners = new Map(); this.children = []; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  async fire(type = 'click', event = {}) { await this.listeners.get(type)?.({ preventDefault() {}, target: this, ...event }); }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  setAttribute() {}
}

test('controller example calculates both formulas and displays copyable results', async () => {
  const previousDocument = globalThis.document;
  const fields = Object.fromEntries([['height', ''], ['heightUnit', 'cm'], ['weight', ''], ['weightUnit', 'kg']].map(([name, value]) => [name, new Node(value)]));
  const form = new Node(); form.elements = { namedItem: (name) => fields[name] };
  const status = new Node(); const result = new Node(); const content = new Node(); const copyNode = new Node(); copyNode.textContent = JSON.stringify(copy);
  const example = new Node(); const copyButton = new Node();
  const selectors = { '#tool-form': form, '[data-tool-copy]': copyNode, '[data-status]': status, '[data-result]': result, '[data-result-content]': content, '[data-action="example"]': example, '[data-action="copy"]': copyButton };
  const root = { querySelector: (selector) => selectors[selector] ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: () => root, createElement: () => new Node() };
  try {
    await import(`./controller.mjs?test=${Date.now()}`);
    await example.fire();
    assert.equal(fields.height.value, '170');
    assert.equal(fields.weight.value, '70');
    assert.equal(result.hidden, false);
    assert.equal(status.textContent, copy.messages.calculated);
    const text = content.children[0].children.map((node) => node.textContent);
    assert.ok(text.some((value) => value.includes('1.818 m²')));
    assert.ok(text.some((value) => value.includes('1.81 m²')));
    fields.height.value = '66.929133858'; fields.heightUnit.value = 'in'; fields.weight.value = '154.3235835'; fields.weightUnit.value = 'lb';
    await form.fire('submit');
    assert.equal(result.hidden, false);
    fields.height.value = '300';
    await form.fire('submit');
    assert.equal(status.textContent, copy.messages.checkInputs);
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});
