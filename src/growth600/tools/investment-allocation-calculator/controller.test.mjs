import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderGrowthForm } from '../../forms.mjs';
import { investmentAllocationEnglishCopy } from '../../locales/investment-allocation-calculator.en.mjs';

test('investment allocation form bounds and labels editable holdings and local results', async () => {
  const html = renderGrowthForm('investment-allocation-calculator', investmentAllocationEnglishCopy);
  for (const field of ['assetCount', 'currencyCode', 'contribution', ...Array.from({ length: 8 }, (_, i) => `assetName${i + 1}`)]) {
    assert.match(html, new RegExp(`name="${field}"`, 'u'), field);
  }
  assert.match(html, /data-allocation-rows/u);
  assert.match(html, /Difference \(target/u);
  assert.match(html, /role="status" aria-live="polite"/u);
  for (const action of ['example', 'calculate', 'reset', 'copy']) assert.match(html, new RegExp(`data-action="${action}"`, 'u'));
  const controller = await readFile(new URL('./controller.mjs', import.meta.url), 'utf8');
  assert.match(controller, /parseLocalizedNumber/u);
  assert.match(controller, /textContent/u);
  assert.match(controller, /navigator\.clipboard/u);
  assert.doesNotMatch(controller, /fetch\(|XMLHttpRequest|localStorage/u);
});
