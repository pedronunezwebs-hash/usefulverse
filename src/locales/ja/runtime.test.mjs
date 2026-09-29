import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { localeBundleSource } from '../bundle.mjs';
import { runTool } from '../test-harness.mjs';
import { tools } from '../../catalog.mjs';
import { localizedTool } from '../../locales.mjs';
import { renderToolPage } from '../../template.mjs';

// Localized runtime output of src/app.js with the published ja bundle: metrics, statuses, answers and IME input.
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const text = (get, selectors) => selectors.map((selector) => get(selector).textContent);

test('ja word counter: 文字数 with and without spaces, Segmenter word count, reading time by characters, summary copy', async () => {
  const sample = '吾輩は猫である。　名前はまだ無い。\nどこで生れたかとんと見当がつかぬ。'; // 35 chars incl. 全角スペース and 改行
  const get = await runTool('ja', 'word-counter', null, { '#tool-input': sample });
  get.fire('#tool-input', 'input');
  const words = [...new Intl.Segmenter('ja-JP', { granularity: 'word' }).segment(sample)].filter((segment) => segment.isWordLike).length;
  assert.ok(words > 2, 'Japanese words come from Intl.Segmenter, not whitespace splitting');
  assert.deepEqual(text(get, ['#metric-words', '#metric-characters', '#metric-characters-no-spaces', '#metric-lines', '#metric-reading-time']), [words, 35, 33, 2, '1分']);
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, `単語数：${words}\n文字数：35\n文字数（空白・改行を除く）：33\n行数：2\n読了時間：約1分`);
  assert.equal(get('#tool-status').textContent, 'クリップボードにコピーしました。');

  // 500 characters per minute, rounded up, spaces excluded.
  for (const [input, minutes] of [['あ'.repeat(500), '1分'], ['あ'.repeat(501), '2分'], [`${'あ'.repeat(1000)}\n\n　 `, '2分']]) {
    const long = await runTool('ja', 'word-counter', null, { '#tool-input': input });
    long.fire('#tool-input', 'input');
    assert.equal(long('#metric-reading-time').textContent, minutes, `${input.length} chars`);
  }
});

test('ja plural statuses use the single Japanese form for 1 and many', async () => {
  const dedupe = await runTool('ja', 'remove-duplicate-lines', 'dedupe', { '#tool-input': ' りんご\nみかん\nりんご\n\nぶどう' }, { checked: { '#trim-lines': true, '#remove-empty': true } });
  assert.equal(dedupe('#tool-output').value, 'りんご\nみかん\nぶどう');
  assert.equal(dedupe('#tool-status').textContent, '重複を除いた3行を残しました。');
  const one = await runTool('ja', 'remove-duplicate-lines', 'dedupe', { '#tool-input': 'Apple\napple' }, { checked: { '#ignore-case': true } });
  assert.equal(one('#tool-status').textContent, '重複を除いた1行を残しました。');

  const csv = await runTool('ja', 'csv-to-json', 'csv-to-json', { '#tool-input': '名前,年齢\n佐藤,36\n鈴木,55' });
  assert.deepEqual(JSON.parse(csv('#tool-output').value), [{ 名前: '佐藤', 年齢: '36' }, { 名前: '鈴木', 年齢: '55' }]);
  assert.equal(csv('#tool-status').textContent, '2行を変換しました。');
  const json = await runTool('ja', 'json-to-csv', 'json-to-csv', { '#tool-input': '[{"名前":"佐藤","メモ":"東京, 大阪"}]' });
  assert.equal(json('#tool-output').value, '名前,メモ\n佐藤,"東京, 大阪"');
  assert.equal(json('#tool-status').textContent, '1行を変換しました。');

  const uuid = await runTool('ja', 'uuid-generator', null, { '#uuid-count': '５' }); // IME full-width digit
  uuid.context.crypto = globalThis.crypto; // the harness context has no Web Crypto
  uuid.click('generate-uuids');
  assert.equal(uuid('#tool-output').value.split('\n').length, 5);
  assert.equal(uuid('#tool-status').textContent, 'ブラウザ内でUUIDを5件生成しました。');
  const tooMany = await runTool('ja', 'uuid-generator', 'generate-uuids', { '#uuid-count': '101' });
  assert.equal(tooMany('#tool-status').textContent, '件数は1〜100の整数で指定してください。');

  const regex = await runTool('ja', 'regex-tester', 'test-regex', { '#regex-pattern': '[ぁ-ん]+', '#regex-flags': 'g', '#regex-test': 'ねこ、いぬ、ネコ' });
  assert.deepEqual(text(regex, ['#regex-match-count', '#regex-output', '#tool-status']), [2, 'ねこ\nいぬ', '2件マッチしました。']);
  const single = await runTool('ja', 'regex-tester', 'test-regex', { '#regex-pattern': 'ネコ', '#regex-flags': '', '#regex-test': 'ねこ、いぬ、ネコ' });
  assert.equal(single('#tool-status').textContent, '1件マッチしました。');
  const none = await runTool('ja', 'regex-tester', 'test-regex', { '#regex-pattern': 'とり', '#regex-flags': 'g', '#regex-test': 'ねこ' });
  assert.deepEqual(text(none, ['#regex-output', '#tool-status']), ['マッチしませんでした。', 'マッチしませんでした。']);

  const diff = await runTool('ja', 'text-diff-checker', 'compare-text', { '#diff-original': '一行目\n二行目\n三行目', '#diff-changed': '一行目\n2行目\n三行目\n四行目' });
  assert.deepEqual(text(diff, ['#diff-count', '#tool-status']), [2, '2行に違いがあります。']);
  assert.equal(diff('#diff-output').textContent, '2行目：\n- 二行目\n+ 2行目\n\n4行目：\n- （空行）\n+ 四行目');
  const same = await runTool('ja', 'text-diff-checker', 'compare-text', { '#diff-original': '同じ', '#diff-changed': '同じ' });
  assert.deepEqual(text(same, ['#diff-output', '#tool-status']), ['違いは見つかりませんでした。', '2つのテキストは同じです。']);
});

test('ja percentage calculator answers and copy read naturally, with IME digits', async () => {
  const values = { '#percent-value': '２０', '#percent-base': '3,000', '#percent-part': '３０', '#percent-whole': '２００', '#percent-old': '100', '#percent-new': '125' };
  const get = await runTool('ja', 'percentage-calculator', 'calculate-percentage', values);
  assert.deepEqual(text(get, ['#percent-result', '#what-percent-result', '#change-result', '#tool-status']), ['600', '15%', '+25%', '計算しました。']);
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, '3,000の20% = 600\n30は200の15%\n100から125への増減率 = +25%');
  const down = await runTool('ja', 'percentage-calculator', 'calculate-percentage', { '#percent-old': '125', '#percent-new': '100' });
  assert.equal(down('#change-result').textContent, '-20%');
  const invalid = Object.fromEntries(Object.keys(values).map((selector) => [selector, 'あ']));
  const wrong = await runTool('ja', 'percentage-calculator', 'calculate-percentage', invalid);
  assert.equal(wrong('#tool-status').textContent, '計算する数値を正しく入力してください。');
});

test('ja durations and dates: 日時分秒, 日, thousands separators and 曜日付き dates', async () => {
  const duration = await runTool('ja', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-01-10T08:00', '#duration-end': '2026-01-12T10:30' });
  assert.deepEqual(text(duration, ['#duration-days', '#duration-hours', '#duration-exact', '#tool-status']), ['2.104167', '50.5', '2日2時間30分0秒', 'ブラウザ内で経過時間を計算しました。']);
  const backwards = await runTool('ja', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-01-12T10:30', '#duration-end': '2026-01-10T08:00' });
  assert.equal(backwards('#tool-status').textContent, '開始と終了の日時を正しく選び、終了を開始より後にしてください。');

  for (const [start, end, days] of [['2026-01-01', '2026-01-31', '30日'], ['2024-01-01', '2025-01-01', '366日'], ['2026-09-29', '2026-09-29', '0日'], ['2000-01-01', '2026-09-29', '9,768日']]) {
    const get = await runTool('ja', 'date-calculator', 'date-difference', { '#date-start': start, '#date-end': end });
    assert.equal(get('#date-difference-result').textContent, days, `${start} → ${end}`);
  }
  for (const [offset, date] of [['30', '2026年10月29日木曜日'], ['-30', '2026年8月30日日曜日']]) {
    const get = await runTool('ja', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': offset });
    assert.deepEqual(text(get, ['#date-offset-result', '#tool-status']), [date, '日付を計算しました。']);
  }
  const noNumber = await runTool('ja', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '三十' });
  assert.equal(noNumber('#tool-status').textContent, '基準日を選び、日数を整数で入力してください。');

  const zone = await runTool('ja', 'time-zone-converter');
  assert.deepEqual([zone('#timezone-from').value, zone('#timezone-to').value], ['Asia/Tokyo', 'America/New_York']);
  zone('#timezone-date').value = '2026-09-29T21:00';
  zone.click('convert-timezone');
  assert.match(zone('#timezone-from-result').textContent, /^2026年9月29日火曜日 21:00:00/u);
  assert.match(zone('#timezone-to-result').textContent, /^2026年9月29日火曜日 8:00:00/u);
});

test('ja number inputs accept IME full-width digits, 読点 and comma grouping', async () => {
  for (const [input, answer] of [['９７', '素数です'], ['1,000,003', '素数です'], ['１０００', '素数ではありません'], ['１', '素数ではありません']]) {
    const get = await runTool('ja', 'prime-number-checker', 'check-prime', { '#prime-input': input });
    assert.equal(get('#prime-output').textContent, answer, input);
  }
  const tooBig = await runTool('ja', 'prime-number-checker', 'check-prime', { '#prime-input': '1000000000001' });
  assert.equal(tooBig('#tool-status').textContent, '0〜1,000,000,000,000（1兆）の整数を入力してください。');

  const average = await runTool('ja', 'average-calculator', 'calculate-average', { '#average-input': '１０、２０，３０\n40\t５０' });
  assert.deepEqual(text(average, ['#average-result', '#average-sum', '#average-count', '#average-min', '#average-max']), ['30', '150', 5, '10', '50']);

  const ratio = await runTool('ja', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '１２', '#ratio-b': '１８', '#ratio-c': '８' });
  assert.deepEqual(text(ratio, ['#ratio-result', '#ratio-simplified', '#tool-status']), ['12', '2:3', 'ブラウザ内でXを求めました。']);

  const unit = await runTool('ja', 'unit-converter', 'convert-unit', { '#unit-category': 'length', '#unit-from': 'meter', '#unit-to': 'kilometer', '#unit-input': '１，５００' });
  assert.equal(unit('#unit-output').textContent, '1.5 キロメートル（km）');

  const roman = await runTool('ja', 'roman-numeral-converter', 'number-to-roman', { '#roman-number': '２０２６' });
  assert.equal(roman('#roman-output').textContent, 'MMXXVI');
});

test('ja percentage page has its own wording for the shared From/Whole number keys', async () => {
  const percentage = renderToolPage(localizedTool(tools.find((tool) => tool.id === 'percentage-calculator'), 'ja'), '', 'ja');
  assert.match(percentage, /<label for="percent-old">変化前 /u);
  assert.match(percentage, /<span class="sr-only">全体の数<\/span>/u);
  const timeZone = renderToolPage(localizedTool(tools.find((tool) => tool.id === 'time-zone-converter'), 'ja'), '', 'ja');
  assert.ok(timeZone.includes('変換元') && !timeZone.includes('変化前'), 'other tools keep the shared wording');
});

test('ja IME input: full-width digits and letters, ー/− as minus, Ⅻ', async () => {
  const date = await runTool('ja', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': 'ー３０' });
  assert.equal(date('#date-offset-result').textContent, '2026年8月30日日曜日');
  const words = await runTool('ja', 'number-to-words-converter', 'number-to-words', { '#words-number': '−１２，３４５' });
  assert.equal(words('#words-output').value.split('\n')[0], 'マイナス一万二千三百四十五');
  const timestamp = await runTool('ja', 'timestamp-converter', 'from-timestamp', { '#timestamp-unix': '１７１０００００００' });
  assert.equal(timestamp('#timestamp-utc').textContent, '2024-03-09T16:00:00.000Z');
  const binary = await runTool('ja', 'binary-converter', 'convert-binary', { '#binary-input': 'ｆｆ', '#binary-from': '16', '#binary-to': '10' });
  assert.equal(binary('#binary-output').textContent, '255');
  const roman = await runTool('ja', 'roman-numeral-converter', 'roman-to-number', { '#roman-input': 'Ⅻ' });
  assert.equal(roman('#number-output').textContent, 12);
});
