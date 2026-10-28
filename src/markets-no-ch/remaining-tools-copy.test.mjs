import assert from 'node:assert/strict';
import test from 'node:test';
import { remainingToolsEnglish } from './remaining-tools-copy-en.mjs';
import { english } from './copy-en.mjs';
import { marketTools } from './catalog.mjs';
import { renderPage } from './render.mjs';
import { localeEntries } from '../locales.mjs';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

test('remaining form sources keep status messages separate from their example', async t => {
  for (const [mode, copy] of Object.entries(remainingToolsEnglish)) {
    await t.test(mode, () => {
      assert.equal(typeof copy.messages, 'object', 'an example string must not occupy the messages argument');
      assert.equal(typeof copy.messages.ready, 'string');
      assert.equal(typeof copy.example, 'string');
      assert.ok(copy.example.trim());
    });
  }
});

test('the six affected forms render a real status and example in every existing locale', () => {
  const modes = new Set(['swissTenancy', 'swissPropertyGain', 'swissInheritance', 'swissChildBudget', 'hyphenation', 'spellcheck']);
  const locales = [...localeEntries.map(l => ({ ...l, rtl: ['ar', 'ur', 'fa'].includes(l.key) })),
    { key: 'nb', code: 'nb-NO', prefix: '/nb', name: 'Norsk bokmål', rtl: false }];
  assert.equal(locales.length, 37);
  for (const tool of marketTools.filter(t => modes.has(t.mode))) {
    const source = remainingToolsEnglish[tool.mode];
    const copy = { ...english, ...source, actions: english.actions, messages: { ...english.messages, ...source.messages } };
    for (const locale of locales) {
      const html = renderPage({ tool, locale, locales, copy });
      assert.doesNotMatch(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gu, ''), /\bundefined\b/u,
        `${tool.id}/${locale.key}: no missing status or example`);
      const payload = JSON.parse(html.match(/<script type="application\/json" data-tool-copy>([\s\S]*?)<\/script>/u)[1]);
      assert.equal(typeof payload.messages.ready, 'string');
      assert.ok(payload.messages.ready.trim());
      assert.equal(typeof payload.example, 'string');
      assert.ok(payload.example.trim());
      if (tool.mode === 'swissTenancy') {
        const subject = html.match(/<input name="subject"[^>]*value="([^"]*)"/u)?.[1];
        assert.equal(subject, payload.fields.subject, `${locale.key}: the letter subject must use the localized form text`);
      }
    }
  }
});

test('the localized letter subject stays escaped inside its input attribute', () => {
  const tool = marketTools.find(t => t.mode === 'swissTenancy');
  const source = remainingToolsEnglish.swissTenancy;
  const locale = localeEntries.find(l => l.key === 'en');
  const copy = { ...english, ...source, fields: { ...source.fields, subject: 'A "quote" & <notice>' },
    messages: { ...english.messages, ...source.messages } };
  const html = renderPage({ tool, locale, locales: [locale], copy });
  assert.match(html, /<input name="subject"[^>]*value="A &quot;quote&quot; &amp; &lt;notice&gt;"/u);
});

test('spellcheck copy success and failure use the status-message contract', async () => {
  const source = (await readFile(new URL('./remaining-tools-controller.mjs', import.meta.url), 'utf8'))
    .replace(/^import[^\n]+\n/u, '');
  for (const fails of [false, true]) {
    const copy = remainingToolsEnglish.spellcheck;
    const status = { textContent: copy.messages.ready };
    let onClick;
    let copied;
    const form = { elements: { text: { value: 'Example text' } }, addEventListener() {} };
    const root = { dataset: { remainingTool: 'spellcheck' },
      querySelector: selector => selector === 'form' ? form : selector === '[data-remaining-status]' ? status : null,
      addEventListener: (event, listener) => { if (event === 'click') onClick = listener; } };
    runInNewContext(source, {
      document: { querySelector: selector => selector === '[data-remaining-tool]' ? root : { textContent: JSON.stringify(copy) } },
      navigator: { clipboard: { writeText: async text => { if (fails) throw Error('Denied'); copied = text; } } },
    });
    await onClick({ target: { closest: selector => selector === '[data-remaining-copy]' } });
    assert.equal(status.textContent, fails ? copy.messages.invalid : copy.messages.done);
    if (!fails) assert.equal(copied, 'Example text');
  }
});

test('hyphenation preview success and invalid language use the status-message contract', async () => {
  const source = (await readFile(new URL('./remaining-tools-controller.mjs', import.meta.url), 'utf8'))
    .replace(/^import[^\n]+\n/u, '');
  for (const invalid of [false, true]) {
    const copy = remainingToolsEnglish.hyphenation;
    const status = { textContent: copy.messages.ready };
    const result = { hidden: true, style: {} };
    let onClick;
    const form = { addEventListener() {} };
    const root = { dataset: { remainingTool: 'hyphenation' },
      querySelector: selector => selector === 'form' ? form : selector === '[data-remaining-status]' ? status : result,
      addEventListener: (event, listener) => { if (event === 'click') onClick = listener; } };
    runInNewContext(source, {
      document: { querySelector: selector => selector === '[data-remaining-tool]' ? root : { textContent: JSON.stringify(copy) } },
      FormData: class { entries() { return Object.entries({ language: invalid ? 'not a tag' : 'en', text: 'internationalization', width: '48' }); } },
    });
    await onClick({ target: { closest: selector => selector === '[data-remaining-preview]' } });
    assert.equal(status.textContent, invalid ? copy.messages.invalid : copy.messages.done);
    assert.equal(result.hidden, invalid);
    if (!invalid) assert.equal(result.textContent, 'internationalization');
  }
});
