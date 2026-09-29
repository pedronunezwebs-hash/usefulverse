import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { numberToWordsHook, runTool } from '../test-harness.mjs';
import { localeBundleSource } from '../bundle.mjs';

// Reading line (한글 맞춤법 제44항: spaces between 만 groups) + contract amount line (일금 …원정, 일 before
// every unit, no spaces). Negatives and zero have no amount line.
const nines = '구천구백구십구';
const both = (reading, amount) => `${reading}\n일금 ${amount}원정`;
const cases = [
  [0n, '영'],
  [1n, both('일', '일')],
  [2n, both('이', '이')],
  [9n, both('구', '구')],
  [10n, both('십', '일십')],
  [11n, both('십일', '일십일')],
  [15n, both('십오', '일십오')],
  [20n, both('이십', '이십')],
  [21n, both('이십일', '이십일')],
  [99n, both('구십구', '구십구')],
  [100n, both('백', '일백')],
  [101n, both('백일', '일백일')],
  [110n, both('백십', '일백일십')],
  [111n, both('백십일', '일백일십일')],
  [999n, both('구백구십구', '구백구십구')],
  [1000n, both('천', '일천')],
  [1001n, both('천일', '일천일')],
  [1010n, both('천십', '일천일십')],
  [1100n, both('천백', '일천일백')],
  [2026n, both('이천이십육', '이천이십육')],
  [9999n, both(nines, nines)],
  [10000n, both('만', '일만')],
  [10001n, both('만 일', '일만일')],
  [10010n, both('만 십', '일만일십')],
  [12345n, both('만 이천삼백사십오', '일만이천삼백사십오')],
  [20000n, both('이만', '이만')],
  [100000n, both('십만', '일십만')],
  [110000n, both('십일만', '일십일만')],
  [113560n, both('십일만 삼천오백육십', '일십일만삼천오백육십')], // 공문서: 금일십일만삼천오백육십원
  [315678n, both('삼십일만 오천육백칠십팔', '삼십일만오천육백칠십팔')], // 제44항 해설: 삼십일만오천육백칠십팔원정
  [1000000n, both('백만', '일백만')],
  [1000001n, both('백만 일', '일백만일')],
  [1001000n, both('백만 천', '일백만일천')],
  [1234567n, both('백이십삼만 사천오백육십칠', '일백이십삼만사천오백육십칠')],
  [10000000n, both('천만', '일천만')],
  [10010000n, both('천일만', '일천일만')],
  [12008310n, both('천이백만 팔천삼백십', '일천이백만팔천삼백일십')],
  [30000000n, both('삼천만', '삼천만')],
  [99999999n, both(`${nines}만 ${nines}`, `${nines}만${nines}`)],
  [100000000n, both('일억', '일억')],
  [100000001n, both('일억 일', '일억일')],
  [100010000n, both('일억 만', '일억일만')],
  [123456789n, both('일억 이천삼백사십오만 육천칠백팔십구', '일억이천삼백사십오만육천칠백팔십구')],
  [1000000000n, both('십억', '일십억')],
  [1234567898n, both('십이억 삼천사백오십육만 칠천팔백구십팔', '일십이억삼천사백오십육만칠천팔백구십팔')], // 제44항 예시
  [10000000000n, both('백억', '일백억')],
  [10100000000n, both('백일억', '일백일억')],
  [100000000000n, both('천억', '일천억')],
  [100000010000n, both('천억 만', '일천억일만')],
  [999999999999n, both(`${nines}억 ${nines}만 ${nines}`, `${nines}억${nines}만${nines}`)],
  [-1n, '마이너스 일'],
  [-10n, '마이너스 십'],
  [-42n, '마이너스 사십이'],
  [-5000n, '마이너스 오천'],
  [-10000n, '마이너스 만'],
  [-100000000n, '마이너스 일억'],
  [-999999999999n, `마이너스 ${nines}억 ${nines}만 ${nines}`],
];

test('ko numberToWords: 만-unit reading and 일금 …원정 amount line', async () => {
  const numberToWords = await numberToWordsHook('ko');
  assert.equal(typeof numberToWords, 'function');
  for (const [value, expected] of cases) {
    const words = numberToWords(value);
    assert.equal(words, expected, `${value}`);
    const [reading, amount] = words.split('\n');
    assert.doesNotMatch(words, /\d|\s{2}|^\s|\s$/u, `${value}`);
    assert.doesNotMatch(reading, /일[십백천]|(?:^|\s)일만/u, `${value}`);
    if (amount) assert.doesNotMatch(amount.slice('일금 '.length), /\s/u, `${value}`);
  }
});

test('ko number-to-words tool: local input formats end to end', async () => {
  const convert = async (input) => (await runTool('ko', 'number-to-words-converter', 'number-to-words', { '#words-number': input }))('#words-output').value;
  const amount = both('백이십삼만 사천오백육십칠', '일백이십삼만사천오백육십칠');
  assert.equal(await convert('1234567'), amount);
  assert.equal(await convert('1,234,567'), amount);
  assert.equal(await convert('１２３４５６７'), amount); // full-width digits typed with a Korean IME
  assert.equal(await convert('１，２３４，５６７'), amount);
  assert.equal(await convert(' 1 234 567 '), amount);
  assert.equal(await convert('１２３４５'), both('만 이천삼백사십오', '일만이천삼백사십오'));
  assert.equal(await convert('10,000'), both('만', '일만'));
  assert.equal(await convert('0'), '영');
  assert.equal(await convert('-5,000'), '마이너스 오천');
  assert.equal(await convert('－５０００'), '마이너스 오천');
  assert.equal(await convert('999,999,999,999'), both(`${nines}억 ${nines}만 ${nines}`, `${nines}억${nines}만${nines}`));
  assert.equal(await convert('-999999999999'), `마이너스 ${nines}억 ${nines}만 ${nines}`);
  for (const bad of ['1,000,000,000,000', '-1000000000000', '12.5', '1만', '백만', '₩10,000', '']) {
    assert.equal(await convert(bad), '', bad);
  }
});

test('ko runtime: slug tool keeps Hangul by default', async () => {
  const box = { checked: false };
  const document = { readyState: 'interactive', querySelector: (selector) => selector === '#preserve-language' ? box : null };
  vm.runInNewContext(await localeBundleSource('ko'), { window: {}, document });
  assert.equal(box.checked, true);
});
