import assert from 'node:assert/strict';
import test from 'node:test';
import { packs, ui } from '../../locales.mjs';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('Russian shared labels do not contain Bengali text or mistranslate clear', () => {
  assert.equal(ui.ru.Clear, 'Очистить');
  assert.equal(ui.ru['Check number'], 'Проверить число');
  assert.equal(packs.ru.toolUi['percentage-calculator']['Whole number'], 'Всего');
  const content = structuredClone(packs.ru);
  delete content.ui['বাংলা'];
  delete content.runtimeMessages['বাংলা'];
  content.meta.keepEnglish = content.meta.keepEnglish.filter((value) => value !== 'বাংলা');
  assert.doesNotMatch(JSON.stringify(content), /[\u0980-\u09FF]/u);
});

test('Russian number words apply gender and scale plurals', async () => {
  const words = await numberToWordsHook('ru');
  for (const [value, expected] of [
    [0n, 'ноль'], [1n, 'один'], [21n, 'двадцать один'], [100n, 'сто'],
    [1000n, 'одна тысяча'], [2000n, 'две тысячи'], [5000n, 'пять тысяч'],
    [21000000n, 'двадцать один миллион'], [-42n, 'минус сорок два'],
  ]) assert.equal(words(value), expected, String(value));
});

test('Russian comma decimals and grouped spaces parse in calculators', async () => {
  const percent = await runTool('ru', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '80', '#percent-base': '1 234,5',
  });
  assert.equal(percent('#percent-result').textContent, '987,6');

  const decimal = await runTool('ru', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '12,5', '#percent-base': '80',
  });
  assert.equal(decimal('#percent-result').textContent, '10');
});

test('Russian duplicate-line statuses use the correct one/few/many forms', async () => {
  for (const [input, expected] of [
    ['одна', 'Сохранена 1 уникальная строка.'],
    ['одна\nдве', 'Сохранены 2 уникальные строки.'],
    ['одна\nдве\nтри\nчетыре\nпять', 'Сохранено уникальных строк: 5.'],
  ]) {
    const get = await runTool('ru', 'remove-duplicate-lines', 'dedupe', { '#tool-input': input });
    assert.equal(get('#tool-status').textContent, expected);
  }
});
