import assert from 'node:assert/strict';
import test from 'node:test';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('vi numberToWords uses Vietnamese reading rules, scales and zero bridges', async () => {
  const words = await numberToWordsHook('vi');
  for (const [value, expected] of [
    [0n,'không'],[1n,'một'],[5n,'năm'],[10n,'mười'],[15n,'mười lăm'],[21n,'hai mươi mốt'],[24n,'hai mươi tư'],[35n,'ba mươi lăm'],[99n,'chín mươi chín'],
    [100n,'một trăm'],[101n,'một trăm linh một'],[110n,'một trăm mười'],[234n,'hai trăm ba mươi tư'],[999n,'chín trăm chín mươi chín'],
    [1000n,'một nghìn'],[1001n,'một nghìn không trăm linh một'],[1000000n,'một triệu'],[1000001n,'một triệu không trăm linh một'],
    [123456789n,'một trăm hai mươi ba triệu bốn trăm năm mươi sáu nghìn bảy trăm tám mươi chín'],[1000000000n,'một tỷ'],[1000000000000n,'một nghìn tỷ'],[-42n,'âm bốn mươi hai'],
  ]) assert.equal(words(value), expected, String(value));
});

test('vi percentage calculator handles decimal dot and localized output', async () => {
  const get = await runTool('vi','percentage-calculator','calculate-percentage',{'#percent-value':'12.5','#percent-base':'1234.5'});
  assert.equal(get('#percent-result').textContent,'154,3125');
});
