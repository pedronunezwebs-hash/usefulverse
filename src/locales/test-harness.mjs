import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { locales, packs, runtimeMessages, runtimeTemplates, ui } from '../locales.mjs';
import { localeBundleSource } from './bundle.mjs';
import { numberWordsRuntimeSource } from './number-words-runtime.mjs';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');

// A language's own tests always need its pack, even when USEFULVERSE_PACKS scopes the build to others.
async function ensurePack(language) {
  if (language === 'en' || locales[language]) return;
  const { pack } = await import(`./${language}/index.mjs`);
  const { code, name, prefix, homeTitle, homeDescription } = pack.meta;
  Object.assign(locales, { [language]: { code, name, prefix, homeTitle, homeDescription } });
  Object.assign(packs, { [language]: pack });
  Object.assign(ui, { [language]: pack.ui });
  Object.assign(runtimeMessages, { [language]: pack.runtimeMessages });
  Object.assign(runtimeTemplates, { [language]: pack.templates });
}

// Runs one tool of src/app.js for `language` with the exact published locale bundle, clicks `action`
// and returns a getter for the fake elements (by selector). `values` pre-fills element values.
// The getter also has click(action) to press another button and fire(selector, type) to dispatch
// an element event such as 'input'; copied text is in getter.context.copied (await a tick first).
export async function runTool(language, toolId, action, values = {}, { checked = {} } = {}) {
  await ensurePack(language);
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
  const context = { document, window: {}, URL, crypto: globalThis.crypto, atob, btoa, TextEncoder, TextDecoder, setTimeout, clearTimeout, Option: class { constructor(text, value) { this.text = text; this.value = value; } }, navigator: { clipboard: { writeText: async (text) => { context.copied = text; } } } };
  if (language !== 'en') vm.runInNewContext(await localeBundleSource(language), context);
  if (toolId === 'number-to-words-converter') vm.runInNewContext(await numberWordsRuntimeSource(language), context);
  vm.runInNewContext(appSource, context);
  const click = (name) => handlers.click?.({ target: { closest: (selector) => selector === '[data-action]' ? { dataset: { action: name } } : selector === '[data-case]' ? { dataset: { case: name } } : null } });
  if (action) click(action);
  return Object.assign(getElement, { context, handlers, click, fire: (selector, type) => getElement(selector).fire(type) });
}

// The pack's numberToWords hook (BigInt -> string), or null when the pack has none.
export async function numberToWordsHook(language) {
  await ensurePack(language);
  const context = { window: {} };
  vm.runInNewContext(await localeBundleSource(language), context);
  vm.runInNewContext(await numberWordsRuntimeSource(language), context);
  return context.window.usefulverseLocale.numberToWords ?? null;
}
