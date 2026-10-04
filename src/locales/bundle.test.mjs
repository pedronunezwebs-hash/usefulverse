import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { runtimeMessages, ui } from '../locales.mjs';
import { localeBundleSource } from './bundle.mjs';

for (const language of ['fr', 'ur', 'te', 'gu']) {
  test(`${language}: locale bundle deduplicates dictionaries without changing translation precedence`, async () => {
    const context = { window: {} };
    vm.runInNewContext(await localeBundleSource(language), context);
    const bundle = context.window.usefulverseLocale;
    const expected = { ...ui[language], ...runtimeMessages[language] };
    assert.deepEqual({ ...bundle.messages }, expected);
    assert.deepEqual({ ...bundle.runtime }, {});
    assert.ok(Object.keys(bundle.messages).length >= Object.keys(ui[language]).length);
    for (const [key, value] of Object.entries(runtimeMessages[language])) {
      assert.equal(bundle.messages[key], value, `runtime translation must still win for ${JSON.stringify(key)}`);
    }

    const oldSource = JSON.stringify({ messages: ui[language], runtime: runtimeMessages[language] });
    const newSource = JSON.stringify({ messages: bundle.messages, runtime: bundle.runtime });
    assert.ok(newSource.length < oldSource.length, `expected a smaller ${language} dictionary payload`);
  });
}
