import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { ptBR } from './pt-br.mjs';

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
    documentElement: { lang: 'pt-BR' },
    querySelector: (selector) => selector === '.tool-workspace' ? root : null,
    querySelectorAll: () => [],
  };
  const window = { usefulverseLocale: { code: 'pt-BR', messages: ptBR.ui, runtime: ptBR.runtimeMessages } };
  vm.runInNewContext(appSource, { document, window, URL });
  clickHandler({ target: { closest: () => ({ dataset: { action } }) } });
  return getElement;
}

test('number-to-words tool writes Brazilian Portuguese, including scales and grouping conjunctions', () => {
  const cases = [
    ['0', 'zero'],
    ['1', 'um'],
    ['21', 'vinte e um'],
    ['100', 'cem'],
    ['101', 'cento e um'],
    ['234', 'duzentos e trinta e quatro'],
    ['1.001', 'mil e um'],
    ['1.200', 'mil e duzentos'],
    ['1.001.000', 'um milhão e mil'],
    ['1.234.567', 'um milhão duzentos e trinta e quatro mil quinhentos e sessenta e sete'],
    ['-2', 'menos dois'],
  ];
  for (const [input, expected] of cases) {
    const get = runTool('number-to-words-converter', 'number-to-words', { '#words-number': input });
    assert.equal(get('#words-output').value, expected, `Unexpected result for ${input}`);
  }

  const decimal = runTool('number-to-words-converter', 'number-to-words', { '#words-number': '1,5' });
  assert.equal(decimal('#words-output').value, '');
  assert.equal(decimal('#tool-status').textContent, 'Use um número inteiro entre -999.999.999.999 e 999.999.999.999.');
});

test('percentage calculator accepts Brazilian decimal commas and formats its answer locally', () => {
  const get = runTool('percentage-calculator', 'calculate-percentage', {
    '#percent-value': '10,5',
    '#percent-base': '1.000,5',
  });
  assert.equal(get('#percent-result').textContent, '105,0525');
  assert.equal(get('#tool-status').textContent, 'Cálculo concluído.');
});

test('average calculator accepts Brazilian decimal and thousands separators', () => {
  const get = runTool('average-calculator', 'calculate-average', {
    '#average-input': '1.000,5; 10,5',
  });
  assert.equal(get('#average-result').textContent, '505,5');
});

test('tool empty states and action messages stay localized in Brazilian Portuguese', () => {
  const regex = runTool('regex-tester', 'test-regex', {
    '#regex-pattern': 'z+',
    '#regex-flags': 'gi',
    '#regex-test': 'abc',
  });
  assert.equal(regex('#regex-output').textContent, 'Nenhuma correspondência encontrada.');
  assert.equal(regex('#tool-status').textContent, 'Nenhuma correspondência encontrada.');

  const url = runTool('url-parser', 'parse-url', { '#tool-input': 'https://example.com/path' });
  assert.equal(url('#url-params').textContent, 'Nenhum parâmetro de consulta.');

  const diff = runTool('text-diff-checker', 'clear');
  assert.equal(diff('#diff-output').textContent, 'Ainda não há comparação.');

  const roman = runTool('roman-numeral-converter', 'roman-to-number', { '#roman-input': 'X' });
  assert.equal(roman('#tool-status').textContent, 'Número romano convertido.');
});
