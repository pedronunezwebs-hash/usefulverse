import assert from 'node:assert/strict';
import test from 'node:test';
import { runTool } from './test-harness.mjs';

test('grouped numbers need 3-digit final groups; 3,14 is not three hundred fourteen', async () => {
  for (const [input, expected] of [['1,000,000.5', '1,000,000.5'], ['-1,234', '-1,234'], ['3,14', '—'], ['1,50', '—']]) {
    const get = await runTool('en', 'unit-converter', 'convert-unit', { '#unit-category': 'length', '#unit-from': 'meter', '#unit-to': 'meter', '#unit-input': input });
    assert.equal(get('#unit-output').textContent.replace(/ .*$/u, ''), expected, input);
  }
  const indian = await runTool('hi', 'percentage-calculator', 'calculate-percentage', { '#percent-value': '10', '#percent-base': '12,34,560' });
  assert.equal(indian('#percent-result').textContent, '1,23,456');
});

test('negative numbers convert in every base, with any minus sign', async () => {
  for (const input of ['-ff', '−ff', 'ーff', '－ＦＦ']) {
    const get = await runTool('en', 'binary-converter', 'convert-binary', { '#binary-input': input, '#binary-from': '16', '#binary-to': '10' });
    assert.equal(get('#binary-output').textContent, '-255', input);
  }
  const binary = await runTool('en', 'binary-converter', 'convert-binary', { '#binary-input': '-1010', '#binary-from': '2', '#binary-to': '16' });
  assert.equal(binary('#binary-output').textContent, '-A');
});
