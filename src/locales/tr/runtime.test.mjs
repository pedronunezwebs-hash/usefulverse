import assert from 'node:assert/strict';
import test from 'node:test';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

test('tr numberToWords uses natural Turkish cardinals and scale words', async () => {
  const words = await numberToWordsHook('tr');
  for (const [value, expected] of [
    [0n,'sıfır'],[1n,'bir'],[6n,'altı'],[10n,'on'],[11n,'on bir'],[19n,'on dokuz'],
    [20n,'yirmi'],[21n,'yirmi bir'],[45n,'kırk beş'],[99n,'doksan dokuz'],
    [100n,'yüz'],[101n,'yüz bir'],[999n,'dokuz yüz doksan dokuz'],
    [1000n,'bin'],[1001n,'bin bir'],[1100n,'bin yüz'],[2000n,'iki bin'],
    [1000000n,'bir milyon'],[123456789n,'yüz yirmi üç milyon dört yüz elli altı bin yedi yüz seksen dokuz'],
    [1000000000n,'bir milyar'],[999999999999n,'dokuz yüz doksan dokuz milyar dokuz yüz doksan dokuz milyon dokuz yüz doksan dokuz bin dokuz yüz doksan dokuz'],
    [-42n,'eksi kırk iki'],
  ]) assert.equal(words(value), expected, String(value));
});

test('tr percentage calculator accepts Turkish decimal and grouping separators', async () => {
  const get = await runTool('tr','percentage-calculator','calculate-percentage',{'#percent-value':'12,5','#percent-base':'1.234,5'});
  assert.equal(get('#percent-result').textContent,'154,3125');
});

test('tr case conversion handles dotted and dotless I with Turkish rules', async () => {
  const get = await runTool('tr','text-case-converter',null,{'#tool-input':'istanbul ısparta I İ'});
  get.click('upper');
  assert.equal(get('#tool-output').value,'İSTANBUL ISPARTA I İ');
  get.click('lower');
  assert.equal(get('#tool-output').value,'istanbul ısparta ı i');
});
