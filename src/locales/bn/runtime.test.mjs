import assert from 'node:assert/strict';
import test from 'node:test';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('Bengali number words cover irregular forms and South Asian scales', async () => {
  const words = await numberToWordsHook('bn');
  for (const [value, expected] of [
    [0n, 'শূন্য'], [1n, 'এক'], [21n, 'একুশ'], [50n, 'পঞ্চাশ'], [99n, 'নিরানব্বই'],
    [100n, 'একশত'], [1001n, 'এক হাজার এক'], [100000n, 'এক লক্ষ'], [10000000n, 'এক কোটি'],
    [123456n, 'এক লক্ষ তেইশ হাজার চারশত ছাপ্পান্ন'], [-42n, 'ঋণাত্মক বিয়াল্লিশ'],
  ]) assert.equal(words(value), expected, String(value));

  const converted = await runTool('bn', 'number-to-words-converter', 'number-to-words', { '#words-number': '১২৩৪৫৬' });
  assert.equal(converted('#words-output').value, 'এক লক্ষ তেইশ হাজার চারশত ছাপ্পান্ন');
});

test('Bengali numerals work in calculations and pluralized statuses', async () => {
  const percent = await runTool('bn', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '১২.৫', '#percent-base': '৮০',
  });
  assert.equal(percent('#percent-result').textContent, '১০');
  assert.equal(percent('#tool-status').textContent, 'হিসাব সম্পূর্ণ।');

  const two = await runTool('bn', 'remove-duplicate-lines', 'dedupe', { '#tool-input': 'এক\nদুই' });
  assert.equal(two('#tool-status').textContent, '২টি অনন্য লাইন রাখা হয়েছে।');
});
