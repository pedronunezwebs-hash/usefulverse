import assert from 'node:assert/strict';
import test from 'node:test';
import { packs } from '../../locales.mjs';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('Urdu translations do not contain Bengali text', () => {
  assert.equal(packs.ur.toolUi['percentage-calculator']['Whole number'], 'کل تعداد');
  assert.doesNotMatch(JSON.stringify(packs.ur), /[\u0980-\u09FF]/u);
});

test('Urdu number words use irregular forms and lakh/crore scales', async () => {
  const words = await numberToWordsHook('ur');
  for (const [value, expected] of [
    [0n, 'صفر'], [1n, 'ایک'], [21n, 'اکیس'], [50n, 'پچاس'], [99n, 'ننانوے'],
    [100n, 'ایک سو'], [1001n, 'ایک ہزار ایک'], [100000n, 'ایک لاکھ'],
    [10000000n, 'ایک کروڑ'], [-42n, 'منفی بیالیس'],
  ]) assert.equal(words(value), expected, String(value));

  const converted = await runTool('ur', 'number-to-words-converter', 'number-to-words', { '#words-number': '۱۲۳۴۵۶' });
  assert.equal(converted('#words-output').value, 'ایک لاکھ تئیس ہزار چار سو چھپن');
});

test('Urdu Persian digits and decimal separator work with localized output', async () => {
  const percent = await runTool('ur', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '۱۲٫۵', '#percent-base': '۸۰',
  });
  assert.equal(percent('#percent-result').textContent, '۱۰');
  assert.equal(percent('#tool-status').textContent, 'حساب کتاب مکمل۔');

  const duration = await runTool('ur', 'time-duration-calculator', 'calculate-duration', {
    '#duration-start': '2026-01-10T09:15', '#duration-end': '2026-01-10T17:45',
  });
  assert.equal(duration('#duration-exact').textContent, '۰ دن، ۸ گھنٹے، ۳۰ منٹ، ۰ سیکنڈ');
});
