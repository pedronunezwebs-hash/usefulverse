import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { locales } from '../locales.mjs';
import { localeBundleSource } from './bundle.mjs';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');

// Runs one tool of src/app.js for `language` with the exact published locale bundle, clicks `action`
// and returns a getter for the fake elements (by selector). `values` pre-fills element values.
// The getter also has click(action) to press another button and fire(selector, type) to dispatch
// an element event such as 'input'; copied text is in getter.context.copied (await a tick first).
export async function runTool(language, toolId, action, values = {}, { checked = {} } = {}) {
  const elements = new Map();
  const getElement = (selector) => {
    if (!elements.has(selector)) {
      const listeners = {};
      elements.set(selector, {
        value: values[selector] ?? '', textContent: '—', className: '', checked: checked[selector] ?? false, hidden: false, placeholder: '', dataset: {}, style: {}, options: [], selectedIndex: 0,
        classList: { toggle() {}, add() {}, remove() {}, contains: () => false },
        focus() {}, add(option) { this.options.push(option); }, addEventListener(type, handler) { (listeners[type] ??= []).push(handler); },
        fire(type) { for (const handler of listeners[type] ?? []) handler({ target: this }); },
      });
    }
    return elements.get(selector);
  };
  const handlers = {};
  const root = {
    dataset: { tool: toolId },
    addEventListener(type, handler) { handlers[type] = handler; },
    querySelector: getElement,
    querySelectorAll: () => [],
  };
  const document = {
    documentElement: { lang: locales[language].code },
    querySelector: (selector) => selector === '.tool-workspace' ? root : null,
    querySelectorAll: () => [],
  };
  const context = { document, window: {}, URL, Option: class { constructor(text, value) { this.text = text; this.value = value; } }, navigator: { clipboard: { writeText: async (text) => { context.copied = text; } } } };
  if (language !== 'en') vm.runInNewContext(await localeBundleSource(language), context);
  vm.runInNewContext(appSource, context);
  const click = (name) => handlers.click?.({ target: { closest: (selector) => selector === '[data-action]' ? { dataset: { action: name } } : null } });
  if (action) click(action);
  return Object.assign(getElement, { context, handlers, click, fire: (selector, type) => getElement(selector).fire(type) });
}

// The pack's numberToWords hook (BigInt -> string), or null when the pack has none.
export async function numberToWordsHook(language) {
  const context = { window: {} };
  vm.runInNewContext(await localeBundleSource(language), context);
  return context.window.usefulverseLocale.numberToWords ?? null;
}
