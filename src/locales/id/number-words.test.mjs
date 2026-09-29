import nodeTest from 'node:test';
import { packs } from '../../locales.mjs';
// USEFULVERSE_PACKS without id (e.g. =ja) leaves this pack unloaded: skip instead of failing on its missing locale.
const test = packs.id ? nodeTest : nodeTest.skip;
import assert from 'node:assert/strict';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

const nines = 'sembilan ratus sembilan puluh sembilan';
const cases = [
  [0n, 'nol'],
  [1n, 'satu'],
  [7n, 'tujuh'],
  [9n, 'sembilan'],
  [10n, 'sepuluh'],
  [11n, 'sebelas'],
  [12n, 'dua belas'],
  [15n, 'lima belas'],
  [19n, 'sembilan belas'],
  [20n, 'dua puluh'],
  [21n, 'dua puluh satu'],
  [99n, 'sembilan puluh sembilan'],
  [100n, 'seratus'],
  [101n, 'seratus satu'],
  [110n, 'seratus sepuluh'],
  [111n, 'seratus sebelas'],
  [200n, 'dua ratus'],
  [999n, nines],
  [1000n, 'seribu'],
  [1001n, 'seribu satu'],
  [1011n, 'seribu sebelas'],
  [1100n, 'seribu seratus'],
  [2000n, 'dua ribu'],
  [10010n, 'sepuluh ribu sepuluh'],
  [11000n, 'sebelas ribu'],
  [21000n, 'dua puluh satu ribu'],
  [100000n, 'seratus ribu'],
  [101000n, 'seratus satu ribu'],
  [111111n, 'seratus sebelas ribu seratus sebelas'],
  [999999n, `${nines} ribu ${nines}`],
  [1000000n, 'satu juta'],
  [1000001n, 'satu juta satu'],
  [1001000n, 'satu juta seribu'],
  [1500000n, 'satu juta lima ratus ribu'],
  [10000000n, 'sepuluh juta'],
  [11000000n, 'sebelas juta'],
  [100000000n, 'seratus juta'],
  [123456789n, 'seratus dua puluh tiga juta empat ratus lima puluh enam ribu tujuh ratus delapan puluh sembilan'],
  [1000000000n, 'satu miliar'],
  [1000001000n, 'satu miliar seribu'],
  [2000000001n, 'dua miliar satu'],
  [10100000000n, 'sepuluh miliar seratus juta'],
  [100000000000n, 'seratus miliar'],
  [999999999999n, `${nines} miliar ${nines} juta ${nines} ribu ${nines}`],
  [-1n, 'minus satu'],
  [-42n, 'minus empat puluh dua'],
  [-1000n, 'minus seribu'],
  [-1000000n, 'minus satu juta'],
  [-999999999999n, `minus ${nines} miliar ${nines} juta ${nines} ribu ${nines}`],
];

test('id numberToWords: standard terbilang readings', async () => {
  const numberToWords = await numberToWordsHook('id');
  assert.equal(typeof numberToWords, 'function');
  for (const [value, expected] of cases) {
    const words = numberToWords(value);
    assert.equal(words, expected, `${value}`);
    assert.doesNotMatch(words, /\d|\s{2}|^\s|\s$|satu (?:ratus|puluh)|^(?:minus )?satu ribu|sejuta|semiliar/u, `${value}`);
  }
});

test('id number-to-words tool: local input formats end to end', async () => {
  const convert = async (input) => (await runTool('id', 'number-to-words-converter', 'number-to-words', { '#words-number': input }))('#words-output').value;
  assert.equal(await convert('1.234.567'), 'satu juta dua ratus tiga puluh empat ribu lima ratus enam puluh tujuh');
  assert.equal(await convert('1.500.000'), 'satu juta lima ratus ribu');
  assert.equal(await convert('1500000'), 'satu juta lima ratus ribu');
  assert.equal(await convert('1 500 000'), 'satu juta lima ratus ribu');
  assert.equal(await convert('  -2.021 '), 'minus dua ribu dua puluh satu');
  assert.equal(await convert('0'), 'nol');
  assert.equal(await convert('1.001'), 'seribu satu');
  assert.equal(await convert('999.999.999.999'), `${nines} miliar ${nines} juta ${nines} ribu ${nines}`);
  assert.equal(await convert('-999.999.999.999'), `minus ${nines} miliar ${nines} juta ${nines} ribu ${nines}`);
  for (const bad of ['1.000.000.000.000', '-1000000000000', '1,500,000', '2,5', '1.50.000', 'seribu', '']) {
    assert.equal(await convert(bad), '', bad);
  }
});
