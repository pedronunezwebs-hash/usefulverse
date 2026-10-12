import assert from 'node:assert/strict';
import test from 'node:test';
import { dividendCalculatorEnglishCopy as copy } from '../../locales/dividend-calculator.en.mjs';

class Node {
  constructor(value = '') { this.value = value; this.checked = false; this.hidden = false; this.textContent = ''; this.dataset = {}; this.listeners = new Map(); this.children = []; }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  async fire(type, event = {}) { await this.listeners.get(type)?.({ preventDefault() {}, target: this, ...event }); }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  setAttribute() {}
  removeAttribute() {}
}

test('controller loads the example and renders the accepted $200 annual / $50 quarterly result', async () => {
  const previousDocument = globalThis.document;
  const fields = Object.fromEntries([
    ['shares', ''], ['sharePrice', ''], ['annualDividendPerShare', ''], ['paymentsPerYear', ''],
    ['dividendGrowthPercent', ''], ['priceGrowthPercent', ''], ['years', ''], ['currencyCode', ''], ['reinvestDividends', ''],
  ].map(([name, value]) => [name, new Node(value)]));
  const form = new Node();
  form.elements = { namedItem: (name) => fields[name] };
  const status = new Node();
  const result = new Node();
  const content = new Node();
  const copyNode = new Node(); copyNode.textContent = JSON.stringify(copy);
  const example = new Node();
  const copyButton = new Node();
  const selectors = { '#tool-form': form, '[data-tool-copy]': copyNode, '[data-status]': status, '[data-result]': result, '[data-result-content]': content, '[data-action="example"]': example, '[data-action="copy"]': copyButton };
  const root = { querySelector: (selector) => selectors[selector] ?? null };
  globalThis.document = { documentElement: { lang: 'en' }, querySelector: () => root, createElement: () => new Node() };
  try {
    await import(`./controller.mjs?test=${Date.now()}`);
    await example.fire('click');
    assert.equal(fields.shares.value, '100');
    assert.equal(fields.currencyCode.value, 'USD');
    assert.equal(result.hidden, false);
    assert.equal(status.textContent, copy.messages.exampleLoaded);
    const text = content.children[0].children.map((node) => node.textContent);
    assert.ok(text.includes('$200.00'));
    assert.ok(text.includes('$50.00'));
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});
