import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { locales } from '../locales.mjs';
import { renderNotFoundPage } from '../template.mjs';
import { runTool } from './test-harness.mjs';

const parseLocalizedNumber = (value) => {
  const localized = String(value)
    .replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0))
    .replace(/[০-৯]/gu, (digit) => String(digit.codePointAt(0) - 0x09e6));
  const match = localized.match(/[-+]?\d[\d\s,.٫٬]*/u)?.[0] ?? '';
  return Number(match.replace(/[\s٬]/gu, '').replace(/[٫,]/gu, '.'));
};

test('Long-tail examples match the real tool calculations in all fourteen languages', async () => {
  for (const language of Object.keys(locales)) {
    const roman = await runTool(language, 'roman-numeral-converter', 'number-to-roman', { '#roman-number': '2026' });
    assert.equal(roman('#roman-output').textContent, 'MMXXVI', `${language}: Roman numeral`);

    const binary = await runTool(language, 'binary-converter', 'convert-binary', { '#binary-input': '25', '#binary-from': '10', '#binary-to': '2' });
    assert.equal(binary('#binary-output').textContent, '11001', `${language}: binary conversion`);

    const prime = await runTool(language, 'prime-number-checker', 'check-prime', { '#prime-input': '97' });
    const primeResult = prime('#prime-output').textContent;
    assert.notEqual(primeResult, '—', `${language}: 97 has a result`);
    const one = await runTool(language, 'prime-number-checker', 'check-prime', { '#prime-input': '1' });
    assert.notEqual(one('#prime-output').textContent, primeResult, `${language}: 1 is not classified like 97`);

    const separator = ['pt', 'de', 'id', 'ru'].includes(language) ? ';' : ',';
    const average = await runTool(language, 'average-calculator', 'calculate-average', { '#average-input': `10${separator}12${separator}14` });
    assert.equal(parseLocalizedNumber(average('#average-result').textContent), 12, `${language}: average`);

    const ratio = await runTool(language, 'ratio-proportion-calculator', 'solve-ratio', {
      '#ratio-a': '2', '#ratio-b': '3', '#ratio-c': '8',
    });
    assert.equal(parseLocalizedNumber(ratio('#ratio-result').textContent), 12, `${language}: ratio`);

    const duration = await runTool(language, 'time-duration-calculator', 'calculate-duration', {
      '#duration-start': '2026-01-10T09:15', '#duration-end': '2026-01-10T17:45',
    });
    assert.equal(parseLocalizedNumber(duration('#duration-hours').textContent), 8.5, `${language}: duration`);

    const dates = await runTool(language, 'date-calculator', 'date-difference', {
      '#date-start': '2026-01-01', '#date-end': '2026-01-31',
    });
    assert.equal(parseLocalizedNumber(dates('#date-difference-result').textContent), 30, `${language}: elapsed calendar days`);

    const lineBreaks = await runTool(language, 'remove-line-breaks', 'join-line-breaks', { '#tool-input': 'alpha\nbeta' });
    assert.equal(lineBreaks('#tool-output').value, 'alpha beta', `${language}: join with spaces`);
  }
});

test('The custom 404 selects a supported browser language and the matching home route', () => {
  const html = renderNotFoundPage();
  const script = html.match(/<script>([\s\S]*?)<\/script>/u)?.[1];
  assert.ok(script, '404 page contains its small language-selection script');
  for (const [browserLanguage, pageLanguage, href] of [
    ['es-ES', 'es', '/es/'], ['fr-FR', 'fr', '/fr/'], ['pt-BR', 'pt-BR', '/pt-br/'],
    ['de-DE', 'de', '/de/'], ['ja-JP', 'ja', '/ja/'], ['ko-KR', 'ko', '/ko/'],
    ['id-ID', 'id', '/id/'], ['hi-IN', 'hi', '/hi/'], ['ar-SA', 'ar', '/ar/'], ['zh-CN', 'zh-CN', '/zh-cn/'],
    ['bn-BD', 'bn-BD', '/bn/'], ['ru-RU', 'ru-RU', '/ru/'], ['ur-PK', 'ur-PK', '/ur/'],
  ]) {
    const elements = new Map(['not-found-heading', 'not-found-detail', 'not-found-home', 'not-found-languages'].map((id) => [id, {}]));
    const document = { documentElement: { lang: 'en' }, title: '', getElementById: (id) => elements.get(id) };
    vm.runInNewContext(script, { document, navigator: { languages: [browserLanguage], language: browserLanguage } });
    assert.equal(document.documentElement.lang, pageLanguage, `${browserLanguage}: document language`);
    assert.equal(document.documentElement.dir, ['ar', 'ur-PK'].includes(pageLanguage) ? 'rtl' : 'ltr', `${browserLanguage}: text direction`);
    assert.equal(elements.get('not-found-home').href, href, `${browserLanguage}: home link`);
  }
});
