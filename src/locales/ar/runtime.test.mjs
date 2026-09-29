import assert from 'node:assert/strict';
import test from 'node:test';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('Arabic cardinal conversion uses Arabic words across scale boundaries', async () => {
  const toWords = await numberToWordsHook('ar');
  for (const [value, expected] of [
    [0n, 'صفر'], [1n, 'واحد'], [12n, 'اثنا عشر'], [21n, 'واحد وعشرون'], [100n, 'مائة'],
    [1000n, 'ألف'], [1001n, 'ألف وواحد'], [1000000n, 'مليون'], [100000001n, 'مائة مليون وواحد'],
    [-42n, 'سالب اثنان وأربعون'],
  ]) assert.equal(toWords(value), expected, String(value));
});

test('Arabic-Indic and Persian digits plus Arabic decimal/group separators work in calculators', async () => {
  const get = await runTool('ar', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '١٢٫٥', '#percent-base': '٨٠', '#percent-part': '۱٬۵۰۰', '#percent-whole': '٣٬٠٠٠',
  });
  assert.equal(get('#percent-result').textContent, '١٠');
  assert.equal(get('#what-percent-result').textContent, '٥٠%');
  assert.equal(get('#tool-status').className, 'tool-status is-success');
});
