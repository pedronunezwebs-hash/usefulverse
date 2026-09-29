import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { deDE } from './de.mjs';

const appSource = await readFile(new URL('../app.js', import.meta.url), 'utf8');

function runTool(toolId, action, values = {}) {
  const elements = new Map();
  const getElement = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { value: values[selector] ?? '', textContent: '—', className: '', focus() {} });
    return elements.get(selector);
  };
  let clickHandler;
  const root = {
    dataset: { tool: toolId },
    addEventListener(type, handler) { if (type === 'click') clickHandler = handler; },
    querySelector: getElement,
    querySelectorAll: () => [],
  };
  const document = {
    documentElement: { lang: 'de' },
    querySelector: (selector) => selector === '.tool-workspace' ? root : null,
    querySelectorAll: () => [],
  };
  const window = { usefulverseLocale: { code: 'de', messages: deDE.ui, runtime: deDE.runtimeMessages } };
  vm.runInNewContext(appSource, { document, window, URL });
  clickHandler({ target: { closest: () => ({ dataset: { action } }) } });
  return getElement;
}

test('German percentage calculator parses decimal commas and thousands dots', () => {
  const get = runTool('percentage-calculator', 'calculate-percentage', {
    '#percent-value': '10,5',
    '#percent-base': '1.000,5',
  });
  assert.equal(get('#percent-result').textContent, '105,0525');
  assert.equal(get('#tool-status').textContent, 'Berechnung abgeschlossen.');
});

test('German average calculator uses semicolons between decimal values', () => {
  const get = runTool('average-calculator', 'calculate-average', {
    '#average-input': '1.000,5; 10,5',
  });
  assert.equal(get('#average-result').textContent, '505,5');
  assert.equal(get('#average-sum').textContent, '1.011');
});

test('German number-to-words handles compound words, scales and negative values', () => {
  const cases = [
    ['0', 'null'],
    ['1', 'eins'],
    ['21', 'einundzwanzig'],
    ['100', 'einhundert'],
    ['101', 'einhunderteins'],
    ['234', 'zweihundertvierunddreißig'],
    ['1.001', 'eintausendeins'],
    ['1.234', 'eintausendzweihundertvierunddreißig'],
    ['1.234.567', 'eine Million zweihundertvierunddreißigtausendfünfhundertsiebenundsechzig'],
    ['1.234.567.890', 'eine Milliarde zweihundertvierunddreißig Millionen fünfhundertsiebenundsechzigtausendachthundertneunzig'],
    ['-2', 'minus zwei'],
  ];
  for (const [input, expected] of cases) {
    const get = runTool('number-to-words-converter', 'number-to-words', { '#words-number': input });
    assert.equal(get('#words-output').value, expected, `Unexpected result for ${input}`);
  }
  const decimal = runTool('number-to-words-converter', 'number-to-words', { '#words-number': '1,5' });
  assert.equal(decimal('#words-output').value, '');
  assert.equal(decimal('#tool-status').textContent, 'Geben Sie eine ganze Zahl zwischen -999.999.999.999 und 999.999.999.999 ein.');
});
