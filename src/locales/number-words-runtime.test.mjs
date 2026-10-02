import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { numberWordsLocaleCodes } from '../locales.mjs';
import { numberWordsRuntimeSource } from './number-words-runtime.mjs';

for (const [language, localeCode] of Object.entries(numberWordsLocaleCodes)) {
  test(`${language} (${localeCode}): number-to-words runtime handles exact integers locally`, async () => {
    const context = { window: { usefulverseLocale: {} } };
    vm.runInNewContext(await numberWordsRuntimeSource(language), context);
    const convert = context.window.usefulverseLocale.numberToWords;
    assert.equal(typeof convert, 'function');
    for (const value of [0n, 1n, 42n, 1000n, 999999999999n, -42n]) {
      const result = convert(value);
      assert.equal(typeof result, 'string');
      assert.ok(result.trim(), `${value} should not produce empty text`);
      assert.ok(!/\d/u.test(result), `${value} should be spelled out: ${result}`);
      assert.notEqual(result, value.toString());
    }
    assert.notEqual(convert(42n), 'Forty Two', 'the output must use the selected language, not an English fallback');
  });
}
