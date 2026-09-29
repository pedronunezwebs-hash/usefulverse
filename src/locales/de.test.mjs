import assert from 'node:assert/strict';
import test from 'node:test';
import { tools } from '../catalog.mjs';
import { localePath, locales, localizedTool, runtimeMessages, ui } from '../locales.mjs';

test('German locale has a stable language tag and localized routes', () => {
  assert.equal(locales.de.code, 'de');
  assert.equal(locales.de.prefix, '/de');
  assert.equal(localePath('de'), '/de/');
  assert.equal(localePath('de', 'word-counter'), '/de/tools/word-counter/');
});

test('German covers every shared UI and runtime string', () => {
  for (const key of Object.keys(ui.es)) assert.ok(ui.de[key], `Missing German UI translation: ${JSON.stringify(key)}`);
  for (const language of Object.keys(runtimeMessages)) {
    for (const key of Object.keys(runtimeMessages[language])) assert.ok(runtimeMessages.de[key], `Missing German runtime translation: ${key}`);
  }
  assert.deepEqual(Object.keys(ui.de).sort(), Object.keys(ui.es).sort());
});

test('all catalog tools have complete German SEO copy', () => {
  const translated = tools.map((tool) => localizedTool(tool, 'de'));
  assert.deepEqual(translated.map(({ id }) => id).sort(), tools.map(({ id }) => id).sort());
  for (const tool of translated) {
    assert.ok(tool.title && tool.shortTitle && tool.description && tool.keywords && tool.intro && tool.body, `Incomplete German copy: ${tool.id}`);
    assert.notEqual(tool.title, tools.find(({ id }) => id === tool.id).title, `English title leaked into German: ${tool.id}`);
    assert.ok(tool.category, `Missing German category: ${tool.id}`);
  }
});

test('German number-to-words tool uses natural localized wording', () => {
  const tool = localizedTool(tools.find(({ id }) => id === 'number-to-words-converter'), 'de');
  assert.equal(tool.shortTitle, 'Zahl in Worten');
  assert.ok(!tool.shortTitle.includes('Zahlen in Wörter'));
});
