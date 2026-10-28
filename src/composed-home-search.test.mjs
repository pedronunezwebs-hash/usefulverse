import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('./composed-home-search.mjs', import.meta.url), 'utf8');
function mount(fetch, index = '/assets/search-index-en.hash.json') {
  const node = () => ({ dataset: {}, children: [], listeners: {}, hidden: false, getAttribute(name) { return this[name]; }, addEventListener(type, listener) { this.listeners[type] = listener; }, append(child) { this.children.push(child); } });
  let busy = false;
  const card = Object.assign(node(), { href: '/tools/word-counter/', dataset: { search: 'Word Counter word-counter' } });
  const search = Object.assign(node(), { value: '' }), empty = node(), pagination = node();
  const buttons = ['All', 'Writing'].map((name, n) => { const b = node(); b.dataset.categoryFilter = name; b.active = n === 0; b.classList = { contains: () => b.active }; return b; });
  const grid = Object.assign(node(), { dataset: { searchIndex: index }, children: [card], setAttribute: () => { busy = true; }, removeAttribute: () => { busy = false; }, querySelectorAll() { return this.children; }, replaceChildren(...children) { this.children = children; } });
  const document = { documentElement: { lang: 'en' }, createElement: node, querySelectorAll: () => buttons, querySelector: selector => ({ '#tool-grid[data-search-index]': grid, '#tool-search': search, '#empty-state': empty, '[data-directory-pages]': pagination })[selector] };
  runInNewContext(source, { document, location: { href: 'https://usefulverse.com/', origin: 'https://usefulverse.com' }, URL, fetch, queueMicrotask });
  return { card, search, grid, empty, pagination, input: () => search.listeners.input(), category: async name => { buttons.forEach(b => { b.active = b.dataset.categoryFilter === name; }); await buttons.find(b => b.active).listeners.click(); }, state: () => ({ busy }) };
}
const data = { schemaVersion: 2, cards: [
  { href: '/tools/word-counter/', title: 'Word Counter', search: 'word counter letter counter reading time', category: 'Writing', language: 'en' },
  { href: '/tools/other/', title: 'Other page', search: 'hidden tool another page', category: 'All', language: 'en' },
] };
test('complete search reaches another static page, restores pagination and downloads once', async () => {
  const requests = [];
  const ui = mount(async (url, options) => { requests.push({ url: String(url), options }); return { ok: true, json: async () => data }; });
  assert.equal(requests.length, 0); await ui.input(); assert.equal(requests.length, 0);
  ui.search.value = 'hidden'; await ui.input(); assert.deepEqual(ui.grid.children.map(c => c.href), ['/tools/other/']);
  assert.equal(ui.empty.hidden, true); assert.equal(ui.pagination.hidden, true);
  ui.search.value = 'nothing matches'; await ui.input(); assert.equal(ui.grid.children.length, 0); assert.equal(ui.empty.hidden, false);
  ui.search.value = ''; await ui.input(); assert.deepEqual(ui.grid.children.map(c => c.href), ['/tools/word-counter/']); assert.equal(ui.pagination.hidden, false);
  ui.search.value = 'letter counter'; await ui.input(); assert.equal(ui.grid.children.length, 1);
  assert.equal(requests.length, 1); assert.equal(requests[0].options.credentials, 'omit');
  assert.deepEqual(ui.state(), { busy: false });
});
test('offline and malformed indexes preserve name/slug fallback without retry storms', async () => {
  for (const response of [() => { throw Error('offline'); }, () => ({ ok: false }), () => ({ ok: true, json: async () => [] })]) {
    let requests = 0;
    const ui = mount(async () => { requests++; return response(); });
    ui.search.value = 'word-counter'; await ui.input(); await ui.input();
    assert.equal(ui.card.dataset.search, 'Word Counter word-counter'); assert.equal(requests, 1);
    assert.equal(ui.grid.children[0], ui.card); assert.deepEqual(ui.state(), { busy: false });
  }
});
test('cross-origin index cannot send a request', async () => {
  let requests = 0;
  const ui = mount(async () => { requests++; }, 'https://other.example/search.json');
  ui.search.value = 'word'; await ui.input(); assert.equal(requests, 0);
  assert.deepEqual(ui.state(), { busy: false });
});
test('category selection loads the complete directory before filtering', async () => {
  let requests = 0;
  const ui = mount(async () => { requests++; return { ok: true, json: async () => data }; });
  await ui.category('Writing'); assert.equal(requests, 1);
  assert.deepEqual(ui.grid.children.map(c => c.href), ['/tools/word-counter/']); assert.equal(ui.pagination.hidden, true);
});
