import assert from 'node:assert/strict';
import test from 'node:test';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('Simplified Chinese cardinal conversion handles zeros and 4-digit groups', async () => {
  const toWords = await numberToWordsHook('zh');
  for (const [value, expected] of [
    [0n, '零'], [10n, '十'], [12n, '十二'], [21n, '二十一'], [1001n, '一千零一'],
    [10010n, '一万零一十'], [100000001n, '一亿零一'], [123456789n, '一亿二千三百四十五万六千七百八十九'],
    [-42n, '负四十二'],
  ]) assert.equal(toWords(value), expected, String(value));
});

test('Chinese full-width digits normalize in calculator input', async () => {
  const get = await runTool('zh', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '１２.５', '#percent-base': '８０',
  });
  assert.equal(get('#percent-result').textContent, '10');
  assert.equal(get('#tool-status').className, 'tool-status is-success');
});
