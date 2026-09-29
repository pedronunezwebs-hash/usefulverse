import test from 'node:test';
import assert from 'node:assert/strict';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

// 0–99 as listed in GLOSSARY.md §7 (Unicode CLDR hi spellout-cardinal, cross-checked with NIT Hamirpur's list).
const table = `0 शून्य 1 एक 2 दो 3 तीन 4 चार 5 पाँच 6 छह 7 सात 8 आठ 9 नौ
10 दस 11 ग्यारह 12 बारह 13 तेरह 14 चौदह 15 पंद्रह 16 सोलह 17 सत्रह 18 अठारह 19 उन्नीस
20 बीस 21 इक्कीस 22 बाईस 23 तेईस 24 चौबीस 25 पच्चीस 26 छब्बीस 27 सत्ताईस 28 अट्ठाईस 29 उनतीस
30 तीस 31 इकतीस 32 बत्तीस 33 तैंतीस 34 चौंतीस 35 पैंतीस 36 छत्तीस 37 सैंतीस 38 अड़तीस 39 उनतालीस
40 चालीस 41 इकतालीस 42 बयालीस 43 तैंतालीस 44 चौवालीस 45 पैंतालीस 46 छियालीस 47 सैंतालीस 48 अड़तालीस 49 उनचास
50 पचास 51 इक्यावन 52 बावन 53 तिरेपन 54 चौवन 55 पचपन 56 छप्पन 57 सत्तावन 58 अट्ठावन 59 उनसठ
60 साठ 61 इकसठ 62 बासठ 63 तिरेसठ 64 चौंसठ 65 पैंसठ 66 छियासठ 67 सड़सठ 68 अड़सठ 69 उनहत्तर
70 सत्तर 71 इकहत्तर 72 बहत्तर 73 तिहत्तर 74 चौहत्तर 75 पचहत्तर 76 छिहत्तर 77 सतहत्तर 78 अठहत्तर 79 उनासी
80 अस्सी 81 इक्यासी 82 बयासी 83 तिरासी 84 चौरासी 85 पचासी 86 छियासी 87 सत्तासी 88 अट्ठासी 89 नवासी
90 नब्बे 91 इक्यानवे 92 बानवे 93 तिरानवे 94 चौरानवे 95 पचानवे 96 छियानवे 97 सत्तानवे 98 अट्ठानवे 99 निन्यानवे`;

const max = 'नौ खरब निन्यानवे अरब निन्यानवे करोड़ निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे';
const cases = [
  [0n, 'शून्य'],
  [1n, 'एक'],
  [6n, 'छह'],
  [15n, 'पंद्रह'],
  [29n, 'उनतीस'],
  [39n, 'उनतालीस'],
  [49n, 'उनचास'],
  [59n, 'उनसठ'],
  [69n, 'उनहत्तर'],
  [79n, 'उनासी'],
  [89n, 'नवासी'],
  [99n, 'निन्यानवे'],
  [100n, 'एक सौ'],
  [101n, 'एक सौ एक'],
  [110n, 'एक सौ दस'],
  [999n, 'नौ सौ निन्यानवे'],
  [1000n, 'एक हज़ार'],
  [1001n, 'एक हज़ार एक'],
  [1100n, 'एक हज़ार एक सौ'],
  [2026n, 'दो हज़ार छब्बीस'],
  [10010n, 'दस हज़ार दस'],
  [99999n, 'निन्यानवे हज़ार नौ सौ निन्यानवे'],
  [100000n, 'एक लाख'],
  [100001n, 'एक लाख एक'],
  [150000n, 'एक लाख पचास हज़ार'],
  [700000n, 'सात लाख'],
  [1000000n, 'दस लाख'],
  [1000001n, 'दस लाख एक'],
  [1234567n, 'बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ'],
  [9999999n, 'निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे'],
  [10000000n, 'एक करोड़'],
  [10000100n, 'एक करोड़ एक सौ'],
  [100000000n, 'दस करोड़'],
  [123456789n, 'बारह करोड़ चौंतीस लाख छप्पन हज़ार सात सौ नवासी'],
  [250000000n, 'पच्चीस करोड़'],
  [999999999n, 'निन्यानवे करोड़ निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे'],
  [1000000000n, 'एक अरब'],
  [1000000001n, 'एक अरब एक'],
  [10100000000n, 'दस अरब दस करोड़'],
  [35000000000n, 'पैंतीस अरब'],
  [99999999999n, 'निन्यानवे अरब निन्यानवे करोड़ निन्यानवे लाख निन्यानवे हज़ार नौ सौ निन्यानवे'],
  [100000000000n, 'एक खरब'],
  [100000000001n, 'एक खरब एक'],
  [500050005000n, 'पाँच खरब पाँच करोड़ पाँच हज़ार'],
  [800000000000n, 'आठ खरब'],
  [999999999999n, max],
  [-1n, 'ऋण एक'],
  [-45n, 'ऋण पैंतालीस'],
  [-100000n, 'ऋण एक लाख'],
  [-10000000n, 'ऋण एक करोड़'],
  [-999999999999n, `ऋण ${max}`],
];

const assertWellFormed = (words, label) => {
  assert.equal(words, words.normalize('NFC'), `${label}: NFC`);
  assert.doesNotMatch(words, /[0-9\u0966-\u096F\u0958-\u095F]|\s{2}|^\s|\s$|और/u, label);
  assert.doesNotMatch(words, /^(?:ऋण )?(?:सौ|हज़ार|लाख|करोड़|अरब|खरब)/u, `${label}: multiplier said`);
};

test('hi numberToWords: 0–99 match the glossary table', async () => {
  const numberToWords = await numberToWordsHook('hi');
  assert.equal(typeof numberToWords, 'function');
  const entries = [...table.matchAll(/(\d+) (\S+)/gu)];
  assert.equal(entries.length, 100);
  for (const [, n, word] of entries) assert.equal(numberToWords(BigInt(n)), word, n);
});

test('hi numberToWords: Indian system scales, boundaries, internal zeros, negatives', async () => {
  const numberToWords = await numberToWordsHook('hi');
  for (const [value, expected] of cases) {
    const words = numberToWords(value);
    assert.equal(words, expected, `${value}`);
    assertWellFormed(words, `${value}`);
  }
  for (let value = -1000n; value <= 200000n; value += 7n) assertWellFormed(numberToWords(value * 4999999n), `${value * 4999999n}`);
});

test('hi number-to-words tool: local input formats end to end', async () => {
  const convert = async (input) => (await runTool('hi', 'number-to-words-converter', 'number-to-words', { '#words-number': input }))('#words-output').value;
  assert.equal(await convert('12,34,567'), 'बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ');
  assert.equal(await convert('1234567'), 'बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ');
  assert.equal(await convert('1,234,567'), 'बारह लाख चौंतीस हज़ार पाँच सौ सड़सठ');
  assert.equal(await convert('1,50,000'), 'एक लाख पचास हज़ार');
  assert.equal(await convert('1 50 000'), 'एक लाख पचास हज़ार');
  assert.equal(await convert('  -2,021 '), 'ऋण दो हज़ार इक्कीस');
  assert.equal(await convert('0'), 'शून्य');
  assert.equal(await convert('1,00,00,000'), 'एक करोड़');
  assert.equal(await convert('10,10,00,00,000'), 'दस अरब दस करोड़');
  assert.equal(await convert('9,99,99,99,99,999'), max);
  assert.equal(await convert('-9,99,99,99,99,999'), `ऋण ${max}`);
  for (const bad of ['10,00,00,00,00,000', '1000000000000', '-1000000000000', '12.5', 'एक लाख', '']) {
    assert.equal(await convert(bad), '', bad);
  }
});
