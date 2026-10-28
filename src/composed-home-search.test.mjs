import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('./composed-home-search.mjs', import.meta.url), 'utf8');
function mount(fetch, index = '/assets/search-index-en.hash.json') {
  let listener, events = 0, busy = false;
  const card = { dataset: { search: 'Word Counter word-counter' }, getAttribute: () => '/tools/word-counter/' };
  const search = { value: '', addEventListener: (_, fn) => { listener = fn; }, dispatchEvent: () => { events++; } };
  const grid = { dataset: { searchIndex: index }, setAttribute: () => { busy = true; }, removeAttribute: () => { busy = false; }, querySelectorAll: () => [card] };
  runInNewContext(source, { document: { querySelector: selector => selector.startsWith('#tool-grid') ? grid : search }, location: { href: 'https://usefulverse.com/', origin: 'https://usefulverse.com' }, URL, Event, fetch });
  return { card, search, input: () => listener(), state: () => ({ events, busy }) };
}
test('search index waits for a nonempty query, keeps keywords and downloads once', async () => {
  const requests = [];
  const ui = mount(async (url, options) => { requests.push({ url: String(url), options }); return { ok: true, json: async () => ({ '/tools/word-counter/': 'word counter letter counter reading time' }) }; });
  assert.equal(requests.length, 0); await ui.input(); assert.equal(requests.length, 0);
  ui.search.value = 'letter counter'; await ui.input();
  assert.equal(ui.card.dataset.search, 'word counter letter counter reading time');
  ui.search.value = 'reading time'; await ui.input();
  assert.equal(requests.length, 1); assert.equal(requests[0].options.credentials, 'omit');
  assert.deepEqual(ui.state(), { busy: false, events: 1 });
});
test('offline and malformed indexes preserve name/slug fallback without retry storms', async () => {
  for (const response of [() => { throw Error('offline'); }, () => ({ ok: false }), () => ({ ok: true, json: async () => [] })]) {
    let requests = 0;
    const ui = mount(async () => { requests++; return response(); });
    ui.search.value = 'word-counter'; await ui.input(); await ui.input();
    assert.equal(ui.card.dataset.search, 'Word Counter word-counter'); assert.equal(requests, 1);
    assert.deepEqual(ui.state(), { busy: false, events: 1 });
  }
});
test('cross-origin index cannot send a request', async () => {
  let requests = 0;
  const ui = mount(async () => { requests++; }, 'https://other.example/search.json');
  ui.search.value = 'word'; await ui.input(); assert.equal(requests, 0);
  assert.deepEqual(ui.state(), { busy: false, events: 1 });
});
