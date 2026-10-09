import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderGrowthForm } from '../../forms.mjs';
import { abTestEnglishCopy } from '../../locales/a-b-test-calculator.en.mjs';

test('A/B test form labels both groups and their counts, with real example, result and copy actions', async () => {
  const html = renderGrowthForm('a-b-test-calculator', abTestEnglishCopy);
  for (const value of ['visitorsA', 'conversionsA', 'visitorsB', 'conversionsB']) assert.match(html, new RegExp(`name="${value}"`, 'u'));
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.ok(html.includes(`data-action="${action}"`), action);
  assert.match(html, /aria-live="polite"/u);
  assert.match(html, /inputmode="numeric"/u);
  const controller = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(controller, /parseLocalizedNumber/u);
  assert.match(controller, /clearResult\(root\)/u);
  assert.match(controller, /copyText\(root, outputText, copy\)/u);
});
