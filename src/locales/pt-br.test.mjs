import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { localePath, locales, localizedTool, runtimeMessages, ui } from '../locales.mjs';

test('Brazilian Portuguese locale publishes a distinct regional URL and language tag', () => {
  assert.equal(locales.pt.code, 'pt-BR');
  assert.equal(locales.pt.prefix, '/pt-br');
  assert.equal(localePath('pt'), '/pt-br/');
  assert.equal(localePath('pt', 'word-counter'), '/pt-br/tools/word-counter/');
});

test('Brazilian Portuguese covers every shared page label and runtime message', () => {
  for (const key of Object.keys(ui.es)) assert.ok(ui.pt[key], `Missing UI translation: ${key}`);
  for (const key of Object.keys(runtimeMessages.es)) assert.ok(runtimeMessages.pt[key], `Missing runtime translation: ${key}`);
});

test('all catalog tools have complete, localized Brazilian Portuguese SEO copy', () => {
  assert.deepEqual(Object.keys(ui.pt).length, Object.keys(ui.es).length);
  const translatedTools = tools.map((tool) => localizedTool(tool, 'pt'));
  assert.deepEqual(translatedTools.map(({ id }) => id).sort(), tools.map(({ id }) => id).sort());
  for (const tool of translatedTools) {
    assert.ok(tool.title && tool.description && tool.keywords && tool.intro && tool.body, `Incomplete SEO copy: ${tool.id}`);
    assert.notEqual(tool.title, tools.find(({ id }) => id === tool.id).title, `English title leaked into pt-BR: ${tool.id}`);
  }
});
