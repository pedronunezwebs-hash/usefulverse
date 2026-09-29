import test from 'node:test';
import assert from 'node:assert/strict';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

// [value, 漢数字, 大字]; the hook returns `${漢数字}\n大字：${大字}`.
const nines = ['九千九百九十九', '九千九百九拾九'];
const cases = [
  [0n, '零', '零'],
  [1n, '一', '壱'],
  [2n, '二', '弐'],
  [3n, '三', '参'],
  [4n, '四', '四'],
  [9n, '九', '九'],
  [10n, '十', '壱拾'],
  [11n, '十一', '壱拾壱'],
  [19n, '十九', '壱拾九'],
  [20n, '二十', '弐拾'],
  [30n, '三十', '参拾'],
  [99n, '九十九', '九拾九'],
  [100n, '百', '壱百'],
  [101n, '百一', '壱百壱'],
  [110n, '百十', '壱百壱拾'],
  [111n, '百十一', '壱百壱拾壱'],
  [999n, '九百九十九', '九百九拾九'],
  [1000n, '千', '壱千'],
  [1001n, '千一', '壱千壱'],
  [1010n, '千十', '壱千壱拾'],
  [1100n, '千百', '壱千壱百'],
  [2026n, '二千二十六', '弐千弐拾六'],
  [3000n, '三千', '参千'],
  [9999n, nines[0], nines[1]],
  [10000n, '一万', '壱万'],
  [10001n, '一万一', '壱万壱'],
  [10010n, '一万十', '壱万壱拾'],
  [11000n, '一万千', '壱万壱千'],
  [12345n, '一万二千三百四十五', '壱万弐千参百四拾五'],
  [20000n, '二万', '弐万'],
  [100000n, '十万', '壱拾万'],
  [300000n, '三十万', '参拾万'],
  [1000000n, '百万', '壱百万'],
  [1000001n, '百万一', '壱百万壱'],
  [1000100n, '百万百', '壱百万壱百'],
  [1234567n, '百二十三万四千五百六十七', '壱百弐拾参万四千五百六拾七'],
  [10000000n, '千万', '壱千万'],
  [11111111n, '千百十一万千百十一', '壱千壱百壱拾壱万壱千壱百壱拾壱'],
  [99999999n, `${nines[0]}万${nines[0]}`, `${nines[1]}万${nines[1]}`],
  [100000000n, '一億', '壱億'],
  [100000001n, '一億一', '壱億壱'],
  [100010001n, '一億一万一', '壱億壱万壱'],
  [1000000000n, '十億', '壱拾億'],
  [10000000000n, '百億', '壱百億'],
  [10100000000n, '百一億', '壱百壱億'],
  [100000000000n, '千億', '壱千億'],
  [123456789012n, '千二百三十四億五千六百七十八万九千十二', '壱千弐百参拾四億五千六百七拾八万九千壱拾弐'],
  [999999999999n, `${nines[0]}億${nines[0]}万${nines[0]}`, `${nines[1]}億${nines[1]}万${nines[1]}`],
  [-1n, 'マイナス一', 'マイナス壱'],
  [-10n, 'マイナス十', 'マイナス壱拾'],
  [-12345n, 'マイナス一万二千三百四十五', 'マイナス壱万弐千参百四拾五'],
  [-100000000n, 'マイナス一億', 'マイナス壱億'],
  [-999999999999n, `マイナス${nines[0]}億${nines[0]}万${nines[0]}`, `マイナス${nines[1]}億${nines[1]}万${nines[1]}`],
];

const expected = (kansuji, daiji) => `${kansuji}\n大字：${daiji}`;

test('ja numberToWords writes 漢数字 and the 大字 line', async () => {
  const toWords = await numberToWordsHook('ja');
  assert.equal(typeof toWords, 'function');
  for (const [value, kansuji, daiji] of cases) {
    const words = toWords(value);
    assert.equal(words, expected(kansuji, daiji), `numberToWords(${value})`);
    assert.doesNotMatch(words, /\d/u);
  }
});

test('ja number-to-words tool accepts Japanese input formats end to end', async () => {
  const toWords = await numberToWordsHook('ja');
  const inputs = [
    ['12345', 12345n],
    ['12,345', 12345n],
    ['１２３４５', 12345n], // IME full-width digits
    ['１２，３４５', 12345n], // full-width comma
    ['－１２３４５', -12345n], // full-width minus
    ['  1,000,000  ', 1000000n],
    ['１０　０００', 10000n], // ideographic space as a separator
    ['999,999,999,999', 999999999999n],
    ['-999999999999', -999999999999n],
    ['0', 0n],
  ];
  for (const [input, value] of inputs) {
    const get = await runTool('ja', 'number-to-words-converter', 'number-to-words', { '#words-number': input });
    assert.equal(get('#words-output').value, toWords(value), `input ${JSON.stringify(input)}`);
  }
  const first = await runTool('ja', 'number-to-words-converter', 'number-to-words', { '#words-number': '１２３４５' });
  assert.equal(first('#words-output').value, expected('一万二千三百四十五', '壱万弐千参百四拾五'));
});

test('ja number-to-words tool leaves the output empty for invalid or out-of-range input', async () => {
  for (const input of ['1000000000000', '-1,000,000,000,000', '１０００００００００００００', '12.5', '一万', 'abc', '']) {
    const get = await runTool('ja', 'number-to-words-converter', 'number-to-words', { '#words-number': input, '#words-output': 'stale' });
    assert.equal(get('#words-output').value, '', `input ${JSON.stringify(input)}`);
  }
});
