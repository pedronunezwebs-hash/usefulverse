// हिन्दी: localized runtime output of src/app.js with the published hi bundle (statuses, hi-IN plurals where
// 0 and 1 are “one”, copied summaries, Indian number input 1,00,000 and hi-IN grouping/dates).
import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { localeBundleSource } from '../bundle.mjs';
import { numberToWordsHook, runTool } from '../test-harness.mjs';

process.env.TZ = 'Asia/Kolkata'; // IST, no DST: local-time outputs below are deterministic.
const tick = () => new Promise((resolve) => setImmediate(resolve));
// The harness context has no Web Crypto; give the page the real one before pressing the button.
async function runWithCrypto(toolId, action, values, options) {
  const get = await runTool('hi', toolId, null, values, options);
  get.context.crypto = globalThis.crypto;
  get.click(action);
  return get;
}

test('hi word counter: Hindi text metrics, reading time and the copied summary', async () => {
  const get = await runTool('hi', 'word-counter', null, { '#tool-input': 'मेरा नाम आरव है। मैं दिल्ली में रहता हूँ।\nयह वर्ड काउंटर है।' });
  get.fire('#tool-input', 'input');
  assert.deepEqual(['#metric-words', '#metric-characters', '#metric-characters-no-spaces', '#metric-lines', '#metric-reading-time'].map((id) => String(get(id).textContent)), ['13', '60', '48', '2', '1 मिनट']);
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, 'शब्द: 13\nकैरेक्टर: 60\nस्पेस के बिना कैरेक्टर: 48\nलाइनें: 2\nपढ़ने का समय: 1 मिनट');
  assert.equal(get('#tool-status').textContent, 'क्लिपबोर्ड पर कॉपी हो गया।');

  get('#tool-input').value = 'हिंदी';
  get.fire('#tool-input', 'input');
  assert.equal(String(get('#metric-characters').textContent), '5', 'FAQ: मात्रा and anusvara count, “हिंदी” = 5');
  get('#tool-input').value = Array(450).fill('शब्द').join(' ');
  get.fire('#tool-input', 'input');
  assert.equal(get('#metric-reading-time').textContent, '3 मिनट', '200 शब्द प्रति मिनट');
  get.click('clear');
  assert.equal(get('#metric-reading-time').textContent, '0 मिनट');
});

test('hi case converter and empty copy: English letters change, Hindi stays', async () => {
  const get = await runTool('hi', 'text-case-converter', null, { '#tool-input': 'hello दुनिया. my resume' });
  get.fire('#tool-input', 'input');
  assert.equal(get('#tool-output').value, 'HELLO दुनिया. MY RESUME');
  const nothing = await runTool('hi', 'text-case-converter', 'copy-output');
  await tick();
  assert.equal(nothing('#tool-status').textContent, 'अभी कॉपी करने के लिए कुछ नहीं है।');
});

test('hi slug generator: FAQ examples and the Hindi-title hint', async () => {
  const hinglish = await runTool('hi', 'text-to-slug', 'make-slug', { '#tool-input': 'Blog Post Kaise Likhen 2026' }, { checked: { '#keep-numbers': true } });
  assert.equal(hinglish('#tool-output').value, 'blog-post-kaise-likhen-2026');
  assert.equal(hinglish('#tool-status').textContent, 'स्लग बन गया।');
  const hindi = await runTool('hi', 'text-to-slug', 'make-slug', { '#tool-input': 'हिंदी में ब्लॉग कैसे लिखें' }, { checked: { '#keep-numbers': true, '#preserve-language': true } });
  assert.equal(hindi('#tool-output').value, 'हिंदी-में-ब्लॉग-कैसे-लिखें');
  const dropped = await runTool('hi', 'text-to-slug', 'make-slug', { '#tool-input': 'हिंदी में ब्लॉग कैसे लिखें' }, { checked: { '#keep-numbers': true } });
  assert.equal(dropped('#tool-output').value, '');
  assert.equal(dropped('#tool-status').textContent, 'पहले टाइटल लिखें। हिंदी टाइटल के लिए “हिंदी (गैर-लैटिन) अक्षर रखें” चुनें।');
});

test('hi remove duplicate lines: one/other plural and hi-IN grouping', async () => {
  const list = { '#tool-input': ' 9876543210\n9876543210\n\n9123456789 \n9876543210' };
  const two = await runTool('hi', 'remove-duplicate-lines', 'dedupe', list, { checked: { '#trim-lines': true, '#remove-empty': true } });
  assert.equal(two('#tool-output').value, '9876543210\n9123456789');
  assert.equal(two('#tool-status').textContent, '2 यूनिक लाइनें रखी गईं।');
  const one = await runTool('hi', 'remove-duplicate-lines', 'dedupe', { '#tool-input': 'Delhi\ndelhi\nDELHI' }, { checked: { '#ignore-case': true } });
  assert.equal(one('#tool-status').textContent, '1 यूनिक लाइन रखी गई।');
  const zero = await runTool('hi', 'remove-duplicate-lines', 'dedupe', { '#tool-input': '\n\n' }, { checked: { '#remove-empty': true } });
  assert.equal(zero('#tool-status').textContent, '0 यूनिक लाइन रखी गई।', 'hi-IN: 0 takes the “one” form');
  const many = await runTool('hi', 'remove-duplicate-lines', 'dedupe', { '#tool-input': Array.from({ length: 100000 }, (_, index) => `रोल ${index}`).join('\n') });
  assert.equal(many('#tool-status').textContent, '1,00,000 यूनिक लाइनें रखी गईं।');
});

test('hi CSV/JSON converters: row plurals and errors', async () => {
  const csv = await runTool('hi', 'csv-to-json', 'csv-to-json', { '#tool-input': 'नाम,शहर\nआरव,दिल्ली\nप्रिया,"मुंबई, महाराष्ट्र"' });
  assert.deepEqual(JSON.parse(csv('#tool-output').value), [{ नाम: 'आरव', शहर: 'दिल्ली' }, { नाम: 'प्रिया', शहर: 'मुंबई, महाराष्ट्र' }]);
  assert.equal(csv('#tool-status').textContent, '2 पंक्तियां बदली गईं।');
  const badCsv = await runTool('hi', 'csv-to-json', 'csv-to-json', { '#tool-input': 'नाम,शहर' });
  assert.equal(badCsv('#tool-status').textContent, 'CSV नहीं बदला जा सका। हेडर पंक्ति के साथ कम से कम एक डेटा पंक्ति रखें और कॉमा व कोट (") जांचें।');
  const json = await runTool('hi', 'json-to-csv', 'json-to-csv', { '#tool-input': '[{"name":"Aarav","city":"Delhi"}]' });
  assert.equal(json('#tool-output').value, 'name,city\nAarav,Delhi', 'FAQ example');
  assert.equal(json('#tool-status').textContent, '1 पंक्ति बदली गई।');
  const badJson = await runTool('hi', 'json-formatter', 'format-json', { '#tool-input': "{'name':'Aarav',}" });
  assert.equal(badJson('#tool-status').textContent, 'JSON सही नहीं है। कोटेशन मार्क, कॉमा और ब्रैकेट जांचें।');
});

test('hi UUID, random number and password: statuses, limits and Indian number input', async () => {
  const five = await runWithCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '5' });
  assert.equal(five('#tool-output').value.split('\n').length, 5);
  assert.equal(five('#tool-status').textContent, '5 UUID आपके ब्राउज़र में बने।');
  const one = await runWithCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '1' });
  assert.equal(one('#tool-status').textContent, '1 UUID आपके ब्राउज़र में बना।');
  const tooMany = await runWithCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '101' });
  assert.equal(tooMany('#tool-status').textContent, '1 से 100 तक की संख्या चुनें।');

  const random = await runWithCrypto('random-number-generator', 'generate-number', { '#random-min': '1', '#random-max': '1,00,000' }, { checked: { '#random-integer': true } });
  const drawn = Number(random('#random-result').textContent);
  assert.ok(Number.isInteger(drawn) && drawn >= 1 && drawn <= 100000, `1,00,000 is one lakh, got ${drawn}`);
  assert.equal(random('#tool-status').textContent, 'रैंडम नंबर आपके ब्राउज़र में ही बना।');
  const hugeRange = await runWithCrypto('random-number-generator', 'generate-number', { '#random-min': '1', '#random-max': '500,00,00,000' }, { checked: { '#random-integer': true } });
  assert.equal(hugeRange('#tool-status').textContent, '429 करोड़ से छोटी रेंज चुनें।');

  const allTypes = { '#include-uppercase': true, '#include-lowercase': true, '#include-numbers': true, '#include-symbols': true };
  const strong = await runWithCrypto('password-generator', 'generate-password', { '#password-length': '20' }, { checked: allTypes });
  assert.equal(strong('#password-output').value.length, 20);
  assert.equal(strong('#password-strength').textContent, 'मज़बूत');
  assert.equal(strong('#tool-status').textContent, 'पासवर्ड आपके ब्राउज़र में बना। इसे किसी पासवर्ड मैनेजर में सेव करें।');
  const good = await runWithCrypto('password-generator', 'generate-password', { '#password-length': '16' }, { checked: allTypes });
  assert.equal(good('#password-strength').textContent, 'अच्छा');
  const none = await runWithCrypto('password-generator', 'generate-password', { '#password-length': '16' });
  assert.equal(none('#tool-status').textContent, 'कम से कम एक तरह के कैरेक्टर चुनें।');
});

test('hi regex tester and text diff: one/other plurals and empty states', async () => {
  const text = 'आरव: 9876543210, प्रिया: 8123456789, गलत: 5123456789';
  const regex = await runTool('hi', 'regex-tester', 'test-regex', { '#regex-pattern': '\\b[6-9]\\d{9}\\b', '#regex-flags': 'g', '#regex-test': text });
  assert.equal(regex('#regex-output').textContent, '9876543210\n8123456789', 'FAQ: Indian mobile-number pattern');
  assert.equal(regex('#tool-status').textContent, '2 मैच मिले।');
  const one = await runTool('hi', 'regex-tester', 'test-regex', { '#regex-pattern': '^[6-9]\\d{9}$', '#regex-flags': 'm', '#regex-test': '9876543210\n12345' });
  assert.equal(one('#tool-status').textContent, '1 मैच मिला।');
  const none = await runTool('hi', 'regex-tester', 'test-regex', { '#regex-pattern': 'z+', '#regex-flags': 'gi', '#regex-test': 'abc' });
  assert.equal(none('#regex-output').textContent, 'कोई मैच नहीं मिला।');
  assert.equal(none('#tool-status').textContent, 'कोई मैच नहीं मिला।');
  const invalid = await runTool('hi', 'regex-tester', 'test-regex', { '#regex-pattern': '(', '#regex-flags': 'g', '#regex-test': 'abc' });
  assert.equal(invalid('#regex-output').textContent, 'अभी कोई मैच नहीं।');
  assert.equal(invalid('#tool-status').textContent, 'सही रेगेक्स पैटर्न और JavaScript के फ़्लैग (जैसे g, i, m) डालें।');

  const diff = await runTool('hi', 'text-diff-checker', 'compare-text', { '#diff-original': 'अध्याय 1\nअध्याय 2\nअध्याय 3', '#diff-changed': 'अध्याय 1\nअध्याय दो\nअध्याय 3\nपरिशिष्ट' });
  assert.equal(diff('#diff-output').textContent, 'लाइन 2:\n- अध्याय 2\n+ अध्याय दो\n\nलाइन 4:\n- (खाली)\n+ परिशिष्ट');
  assert.equal(diff('#tool-status').textContent, '2 लाइनों में अंतर मिला।');
  const oneDiff = await runTool('hi', 'text-diff-checker', 'compare-text', { '#diff-original': 'पहला ड्राफ़्ट', '#diff-changed': 'दूसरा ड्राफ़्ट' });
  assert.equal(oneDiff('#tool-status').textContent, '1 लाइन में अंतर मिला।');
  const same = await runTool('hi', 'text-diff-checker', 'compare-text', { '#diff-original': 'एक जैसा', '#diff-changed': 'एक जैसा' });
  assert.equal(same('#diff-output').textContent, 'कोई अंतर नहीं मिला।');
  assert.equal(same('#tool-status').textContent, 'दोनों टेक्स्ट एक जैसे हैं।');
});

test('hi colour, Roman, binary and URL parser: FAQ examples and statuses', async () => {
  const saffron = await runTool('hi', 'color-converter', 'convert-color', { '#color-value': '#FF9933' });
  assert.deepEqual(['#color-rgb', '#color-hsl'].map((id) => saffron(id).textContent), ['rgb(255, 153, 51)', 'hsl(30, 100%, 60%)'], 'FAQ: केसरिया #FF9933');
  assert.equal(saffron('#tool-status').textContent, 'कलर बदल दिया गया।');
  const cmyk = await runTool('hi', 'color-converter', 'convert-color', { '#color-value': 'cmyk(0,40,80,0)' });
  assert.equal(cmyk('#tool-status').textContent, 'सही HEX, RGB या HSL कलर कोड डालें, जैसे #4D6BFF।');

  const roman = await runTool('hi', 'roman-numeral-converter', 'number-to-roman', { '#roman-number': '2026' });
  assert.equal(roman('#roman-output').textContent, 'MMXXVI');
  assert.equal(roman('#tool-status').textContent, 'संख्या रोमन अंक में बदल गई।');
  const lower = await runTool('hi', 'roman-numeral-converter', 'roman-to-number', { '#roman-input': 'mmxxvi' });
  assert.equal(String(lower('#number-output').textContent), '2026', 'copy: lowercase Roman numerals are read too');
  assert.equal(lower('#tool-status').textContent, 'रोमन अंक संख्या में बदल गया।');
  const tooBig = await runTool('hi', 'roman-numeral-converter', 'number-to-roman', { '#roman-number': '4000' });
  assert.equal(tooBig('#tool-status').textContent, '1 से 3,999 के बीच की सही पूर्ण संख्या या रोमन अंक डालें।');

  const binary = await runTool('hi', 'binary-converter', 'convert-binary', { '#binary-input': '255', '#binary-from': '10', '#binary-to': '2' });
  assert.equal(binary('#binary-output').textContent, '11111111', 'FAQ: 255 = 11111111');
  assert.equal(binary('#tool-status').textContent, 'संख्या आपके ब्राउज़र में ही बदल दी गई।');
  const badBinary = await runTool('hi', 'binary-converter', 'convert-binary', { '#binary-input': '1021', '#binary-from': '2', '#binary-to': '10' });
  assert.equal(badBinary('#tool-status').textContent, 'चुने गए बेस के सही अंकों वाला पूर्णांक डालें (जैसे बाइनरी में सिर्फ़ 0 और 1)।');

  const utm = await runTool('hi', 'url-parser', 'parse-url', { '#tool-input': 'https://example.com/offer?utm_source=whatsapp&utm_campaign=diwali' });
  assert.deepEqual(JSON.parse(utm('#url-params').textContent), [{ name: 'utm_source', value: 'whatsapp' }, { name: 'utm_campaign', value: 'diwali' }]);
  assert.equal(utm('#url-hash').textContent, '(कुछ नहीं)');
  assert.equal(utm('#tool-status').textContent, 'URL आपके ब्राउज़र में ही पार्स हो गया।');
  const bare = await runTool('hi', 'url-parser', 'parse-url', { '#tool-input': 'example.com' });
  assert.equal(bare('#tool-status').textContent, 'https:// समेत पूरा URL डालें।');
});

test('hi percentage calculator: Indian grouping in and out, copied answers', async () => {
  const get = await runTool('hi', 'percentage-calculator', 'calculate-percentage', {
    '#percent-value': '15', '#percent-base': '1,00,000',
    '#percent-part': '432', '#percent-whole': '500',
    '#percent-old': '12,34,567', '#percent-new': '9,87,653.6',
  });
  assert.equal(get('#percent-result').textContent, '15,000');
  assert.equal(get('#what-percent-result').textContent, '86.4%', 'body/FAQ: 500 में से 432 = 86.4%');
  assert.equal(get('#change-result').textContent, '-20%');
  assert.equal(get('#tool-status').textContent, 'हिसाब तैयार है।');
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, '1,00,000 का 15% = 15,000\n500 में से 432 = 86.4%\n12,34,567 से 9,87,653.6 तक बदलाव = -20%');
  const faq = await runTool('hi', 'percentage-calculator', 'calculate-percentage', { '#percent-value': '15', '#percent-base': '200', '#percent-old': '100', '#percent-new': '125' });
  assert.equal(faq('#percent-result').textContent, '30', 'FAQ: 200 का 15% = 30');
  assert.equal(faq('#change-result').textContent, '+25%');
  const invalid = await runTool('hi', 'percentage-calculator', 'calculate-percentage', { '#percent-value': 'पंद्रह', '#percent-base': '200' });
  assert.equal(invalid('#tool-status').textContent, 'हिसाब के लिए सही संख्याएं डालें।');
});

test('hi average, ratio, prime and unit converter: Indian number input and output', async () => {
  const marks = await runTool('hi', 'average-calculator', 'calculate-average', { '#average-input': '78, 85, 92, 66, 89' });
  assert.deepEqual(['#average-result', '#average-sum', '#average-count', '#average-min', '#average-max'].map((id) => String(marks(id).textContent)), ['82', '410', '5', '66', '92'], 'FAQ: मार्क्स का औसत 82');
  assert.equal(marks('#tool-status').textContent, 'औसत आपके ब्राउज़र में निकाला गया।');
  const salaries = await runTool('hi', 'average-calculator', 'calculate-average', { '#average-input': '100000\n150000' });
  assert.equal(salaries('#average-result').textContent, '1,25,000');
  const grouped = await runTool('hi', 'average-calculator', 'calculate-average', { '#average-input': '1,00,000' });
  assert.equal(String(grouped('#average-count').textContent), '3', 'copy/FAQ: in this list a comma separates numbers, so 1,00,000 is three values');

  const ratio = await runTool('hi', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '2', '#ratio-b': '3', '#ratio-c': '8' });
  assert.equal(String(ratio('#ratio-result').textContent), '12', 'FAQ: 2:3 = 8:X');
  assert.equal(ratio('#tool-status').textContent, 'समानुपात आपके ब्राउज़र में हल हो गया।');
  const simplified = await runTool('hi', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '12', '#ratio-b': '18', '#ratio-c': '1,00,000' });
  assert.equal(simplified('#ratio-simplified').textContent, '2:3', 'FAQ: 12:18 = 2:3');
  assert.equal(String(simplified('#ratio-result').textContent), '150000');
  const zero = await runTool('hi', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '0', '#ratio-b': '3', '#ratio-c': '8' });
  assert.equal(zero('#tool-status').textContent, 'A, B और C में शून्य से बड़ी संख्याएं डालें।');

  const prime = await runTool('hi', 'prime-number-checker', 'check-prime', { '#prime-input': '1,00,003' });
  assert.equal(prime('#prime-output').textContent, 'यह अभाज्य संख्या है');
  assert.equal(prime('#tool-status').textContent, 'संख्या आपके ब्राउज़र में जांची गई।');
  const one = await runTool('hi', 'prime-number-checker', 'check-prime', { '#prime-input': '1' });
  assert.equal(one('#prime-output').textContent, 'यह अभाज्य संख्या नहीं है', 'FAQ: 1 is not prime');
  const limit = await runTool('hi', 'prime-number-checker', 'check-prime', { '#prime-input': '10,00,00,00,00,000' });
  assert.equal(limit('#prime-output').textContent, 'यह अभाज्य संख्या नहीं है', 'एक लाख करोड़ is accepted');
  const tooBig = await runTool('hi', 'prime-number-checker', 'check-prime', { '#prime-input': '10,00,00,00,00,001' });
  assert.equal(tooBig('#tool-status').textContent, '0 से 10,00,00,00,00,000 (एक लाख करोड़) तक की पूर्ण संख्या डालें।');

  const height = await runTool('hi', 'unit-converter', null, { '#unit-category': 'length', '#unit-from': 'foot', '#unit-to': 'centimeter', '#unit-input': '5.5' });
  const labels = height('#unit-to').options.map((option) => option.text);
  assert.deepEqual(labels, ['मीटर', 'किलोमीटर', 'सेंटीमीटर', 'मिलीमीटर', 'इंच', 'फ़ुट', 'गज', 'मील']);
  height('#unit-to').selectedIndex = labels.indexOf('सेंटीमीटर');
  height.click('convert-unit');
  assert.equal(height('#unit-output').textContent, '167.64 सेंटीमीटर', 'copy/FAQ: 5.5 फ़ुट = 167.64 सेमी');
  assert.equal(height('#tool-status').textContent, 'मान आपके ब्राउज़र में बदल दिया गया।');
  const fever = await runTool('hi', 'unit-converter', null, { '#unit-category': 'temperature', '#unit-from': 'fahrenheit', '#unit-to': 'celsius', '#unit-input': '100.4' });
  fever('#unit-category').fire('change');
  const temperatureLabels = fever('#unit-to').options.map((option) => option.text);
  fever('#unit-to').selectedIndex = temperatureLabels.indexOf('सेल्सियस');
  fever.click('convert-unit');
  assert.equal(fever('#unit-output').textContent, '38 सेल्सियस', 'copy/FAQ: 100.4°F = 38°C');
  const lakh = await runTool('hi', 'unit-converter', null, { '#unit-category': 'length', '#unit-from': 'centimeter', '#unit-to': 'meter', '#unit-input': '1,00,000' });
  lakh('#unit-to').selectedIndex = 0;
  lakh.click('convert-unit');
  assert.equal(lakh('#unit-output').textContent, '1,000 मीटर');
});

test('hi duration and date calculators: Hindi words, Indian grouping and long dates', async () => {
  const shift = await runTool('hi', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-29T22:00', '#duration-end': '2026-09-30T06:00' });
  assert.deepEqual(['#duration-days', '#duration-hours', '#duration-exact'].map((id) => shift(id).textContent), ['0.333333', '8', 'दिन: 0 · घंटे: 8 · मिनट: 0 · सेकंड: 0'], 'FAQ: night shift = 8 घंटे');
  assert.equal(shift('#tool-status').textContent, 'अवधि आपके ब्राउज़र में निकाली गई।');
  const office = await runTool('hi', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-29T09:30', '#duration-end': '2026-09-29T18:15' });
  assert.deepEqual(['#duration-hours', '#duration-exact'].map((id) => office(id).textContent), ['8.75', 'दिन: 0 · घंटे: 8 · मिनट: 45 · सेकंड: 0'], 'FAQ: 9:30 से 6:15 = 8.75 घंटे');
  const long = await runTool('hi', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2000-01-01T00:00', '#duration-end': '2026-09-29T00:00' });
  assert.deepEqual(['#duration-days', '#duration-hours', '#duration-exact'].map((id) => long(id).textContent), ['9,768', '2,34,432', 'दिन: 9,768 · घंटे: 0 · मिनट: 0 · सेकंड: 0']);
  const oneHour = await runTool('hi', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-01-01T09:00', '#duration-end': '2026-01-03T10:05' });
  assert.equal(oneHour('#duration-exact').textContent, 'दिन: 2 · घंटे: 1 · मिनट: 5 · सेकंड: 0', 'label form: no “1 घंटे” agreement error');
  const backwards = await runTool('hi', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-30T06:00', '#duration-end': '2026-09-29T22:00' });
  assert.equal(backwards('#tool-status').textContent, 'सही समय चुनें। अंत का समय शुरुआत के बाद होना चाहिए।');

  const faq = await runTool('hi', 'date-calculator', 'date-difference', { '#date-start': '2026-01-01', '#date-end': '2026-03-01' });
  assert.equal(faq('#date-difference-result').textContent, '59 दिन', 'FAQ: 1 जनवरी से 1 मार्च 2026 = 59 दिन');
  assert.equal(faq('#tool-status').textContent, 'तारीखों का अंतर निकल गया।');
  const one = await runTool('hi', 'date-calculator', 'date-difference', { '#date-start': '2026-09-29', '#date-end': '2026-09-30' });
  assert.equal(one('#date-difference-result').textContent, '1 दिन');
  const long2 = await runTool('hi', 'date-calculator', 'date-difference', { '#date-start': '2000-01-01', '#date-end': '2026-09-29' });
  assert.equal(long2('#date-difference-result').textContent, '9,768 दिन');
  const ahead = await runTool('hi', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '90' });
  assert.equal(ahead('#date-offset-result').textContent, 'सोमवार, 28 दिसंबर 2026', 'FAQ: 29 सितंबर 2026 + 90 दिन');
  assert.equal(ahead('#tool-status').textContent, 'नई तारीख तैयार है।');
  const back = await runTool('hi', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '-30' });
  assert.equal(back('#date-offset-result').textContent, 'रविवार, 30 अगस्त 2026');
  const bad = await runTool('hi', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '1.5' });
  assert.equal(bad('#tool-status').textContent, 'तारीख चुनें और दिन पूर्ण संख्या में डालें (जैसे 30 या -30)।');
});

test('hi timestamp and time zone converters: IST defaults and hi-IN output', async () => {
  const stamp = await runTool('hi', 'timestamp-converter', 'from-timestamp', { '#timestamp-unix': '1710000000' });
  assert.equal(stamp('#tool-status').textContent, 'तारीख में बदल दिया गया।');
  stamp.click('copy-summary');
  await tick();
  assert.equal(stamp.context.copied, 'UTC: 2024-03-09T16:00:00.000Z\nस्थानीय समय: 9 मार्च 2024, 9:30:00 pm');
  const back = await runTool('hi', 'timestamp-converter', 'to-timestamp', { '#timestamp-date': '2026-09-29T10:00' });
  assert.deepEqual([String(back('#timestamp-seconds').textContent), String(back('#timestamp-milliseconds').textContent)], ['1790656200', '1790656200000']);
  assert.equal(back('#tool-status').textContent, 'टाइमस्टैम्प में बदल दिया गया।');
  back.click('copy-summary');
  await tick();
  assert.equal(back.context.copied, 'सेकंड: 1790656200\nमिलीसेकंड: 1790656200000');

  const zones = await runTool('hi', 'time-zone-converter', null);
  assert.deepEqual([zones('#timezone-from').value, zones('#timezone-to').value], ['Asia/Kolkata', 'America/New_York'], 'opens on IST → US Eastern');
  zones('#timezone-date').value = '2026-09-29T20:30';
  zones.click('convert-timezone');
  assert.match(zones('#timezone-from-result').textContent, /^मंगलवार, 29 सितंबर 2026 को 8:30:00 pm IST/u);
  assert.match(zones('#timezone-to-result').textContent, /^मंगलवार, 29 सितंबर 2026 को 11:00:00 am /u, 'US daylight saving: IST is 9:30 ahead');
  assert.equal(zones('#tool-status').textContent, 'डेलाइट सेविंग टाइम को ध्यान में रखकर समय बदल दिया गया।');
  zones('#timezone-date').value = '2026-01-15T20:30';
  zones.click('convert-timezone');
  assert.match(zones('#timezone-to-result').textContent, /^गुरुवार, 15 जनवरी 2026 को 10:00:00 am /u, 'winter: IST is 10:30 ahead');
});

test('hi runtime hook: InScript digits in number fields, search with or without nukta', async () => {
  await numberToWordsHook('hi'); // loads the hi pack for localeBundleSource
  let onInput;
  const card = { dataset: { search: 'यूनिट कन्वर्टर मीटर फ़ुट' } };
  const document = { querySelectorAll: () => [card], addEventListener: (type, handler, capture) => { if (type === 'input' && capture) onInput = handler; } };
  vm.runInNewContext(await localeBundleSource('hi'), { window: {}, document });
  assert.ok(card.dataset.search.includes('फ़ुट') && card.dataset.search.includes('फुट'), 'फुट (no nukta) finds the card');
  const field = (props) => ({ selectionEnd: null, setSelectionRange() {}, ...props });
  const amount = field({ inputMode: 'numeric', value: '१,५०,०००' });
  onInput({ target: amount });
  assert.equal(amount.value, '1,50,000');
  const list = field({ id: 'average-input', value: '१०\n२०.५' });
  onInput({ target: list });
  assert.equal(list.value, '10\n20.5');
  const prose = field({ id: 'tool-input', value: 'कक्षा १० के नंबर' });
  onInput({ target: prose });
  assert.equal(prose.value, 'कक्षा १० के नंबर', 'text fields keep Devanagari digits');
  const search = field({ id: 'tool-search', value: 'फ़ुट' });
  onInput({ target: search });
  assert.equal(search.value, 'फ़ुट', 'precomposed फ़ becomes फ + nukta, as stored');
  assert.ok(card.dataset.search.includes(search.value));
});
