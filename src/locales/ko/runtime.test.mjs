import assert from 'node:assert/strict';
import test from 'node:test';
import { runTool } from '../test-harness.mjs';

// Localized runtime output of src/app.js on /ko/ pages (templates, runtime messages, ko-KR number parsing).
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const status = (get) => get('#tool-status').textContent;
// The harness sandbox has no Web Crypto; tools read `crypto` only when clicked, so expose Node's before clicking.
async function withCrypto(toolId, action, values, options) {
  const get = await runTool('ko', toolId, null, values, options);
  get.context.crypto = globalThis.crypto;
  get.click(action);
  return get;
}

test('ko word counter: 공백 포함·제외 metrics and copied summary', async () => {
  const text = '안녕하세요 반갑습니다\n자기소개서 글자 수';
  const get = await runTool('ko', 'word-counter', null, { '#tool-input': text });
  get.fire('#tool-input', 'input');
  assert.equal(String(get('#metric-words').textContent), '5'); // words = space-separated 어절
  assert.equal(String(get('#metric-characters').textContent), '22'); // the line break counts as 1 with spaces
  assert.equal(String(get('#metric-characters-no-spaces').textContent), '18');
  assert.equal(String(get('#metric-lines').textContent), '2');
  assert.equal(get('#metric-reading-time').textContent, '1분');
  get.click('copy-summary');
  await tick();
  assert.equal(get.context.copied, '단어 수: 5\n글자 수(공백 포함): 22\n글자 수(공백 제외): 18\n줄 수: 2\n읽는 시간: 약 1분');
  assert.equal(status(get), '클립보드에 복사했습니다.');
  const empty = await runTool('ko', 'word-counter', 'copy-summary');
  await tick();
  assert.equal(empty.context.copied, '단어 수: 0\n글자 수(공백 포함): 0\n글자 수(공백 제외): 0\n줄 수: 0\n읽는 시간: 약 0분');
});

test('ko counted statuses use counters, never English plurals', async () => {
  const dedupe = await runTool('ko', 'remove-duplicate-lines', 'dedupe', { '#tool-input': '서울\n 서울 \n부산\n\n부산\n대구' }, { checked: { '#trim-lines': true, '#remove-empty': true } });
  assert.equal(dedupe('#tool-output').value, '서울\n부산\n대구');
  assert.equal(status(dedupe), '중복을 제거하고 줄 3개를 남겼습니다.');

  const csv = await runTool('ko', 'csv-to-json', 'csv-to-json', { '#tool-input': '이름,나이\n민준,36\n"서연, 김",29' });
  assert.deepEqual(JSON.parse(csv('#tool-output').value), [{ 이름: '민준', 나이: '36' }, { 이름: '서연, 김', 나이: '29' }]);
  assert.equal(status(csv), '행 2개를 변환했습니다.');
  const badCsv = await runTool('ko', 'csv-to-json', 'csv-to-json', { '#tool-input': '이름,나이' });
  assert.equal(status(badCsv), 'CSV를 변환하지 못했습니다. 머리글 행과 데이터 행이 있는지, 쉼표와 따옴표가 올바른지 확인하세요.');

  const json = await runTool('ko', 'json-to-csv', 'json-to-csv', { '#tool-input': '[{"이름":"민준"},{"이름":"서연"},{"이름":"지호"}]' });
  assert.equal(json('#tool-output').value, '이름\n민준\n서연\n지호');
  assert.equal(status(json), '행 3개를 변환했습니다.');

  const uuid = await withCrypto('uuid-generator', 'generate-uuids', { '#uuid-count': '１２' }); // full-width digits from a Korean IME
  assert.equal(uuid('#tool-output').value.split('\n').length, 12);
  assert.match(uuid('#tool-output').value, /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/mu);
  assert.equal(status(uuid), '브라우저에서 UUID 12개를 생성했습니다.');
  const tooMany = await runTool('ko', 'uuid-generator', 'generate-uuids', { '#uuid-count': '101' });
  assert.equal(status(tooMany), '1~100 사이의 개수를 입력하세요.');

  const regex = await runTool('ko', 'regex-tester', 'test-regex', { '#regex-pattern': '[가-힣]+', '#regex-flags': 'i', '#regex-test': '서울 Seoul 부산 1234 대구' });
  assert.equal(regex('#regex-output').textContent, '서울\n부산\n대구');
  assert.equal(status(regex), '일치 항목 3개를 찾았습니다.');
  const none = await runTool('ko', 'regex-tester', 'test-regex', { '#regex-pattern': '[가-힣]+', '#regex-flags': 'g', '#regex-test': 'Seoul' });
  assert.equal(none('#regex-output').textContent, '일치 항목이 없습니다.');
  assert.equal(status(none), '일치 항목이 없습니다.');
  const invalid = await runTool('ko', 'regex-tester', 'test-regex', { '#regex-pattern': '[가-', '#regex-flags': 'g', '#regex-test': '서울' });
  assert.equal(status(invalid), '올바른 정규식과 지원되는 플래그를 입력하세요.');

  const diff = await runTool('ko', 'text-diff-checker', 'compare-text', { '#diff-original': '첫 줄\n둘째 줄\n셋째 줄', '#diff-changed': '첫 줄\n둘째 줄 수정\n' });
  assert.equal(diff('#diff-output').textContent, '2번째 줄:\n- 둘째 줄\n+ 둘째 줄 수정\n\n3번째 줄:\n- 셋째 줄\n+ (빈 줄)');
  assert.equal(status(diff), '서로 다른 줄 2개를 찾았습니다.');
  const same = await runTool('ko', 'text-diff-checker', 'compare-text', { '#diff-original': '같은 글', '#diff-changed': '같은 글' });
  assert.equal(same('#diff-output').textContent, '차이점이 없습니다.');
  assert.equal(status(same), '두 텍스트가 같습니다.');
});

test('ko percentage calculator: answers, discount rate and full-width input', async () => {
  const values = { '#percent-value': '15', '#percent-base': '200', '#percent-part': '30', '#percent-whole': '200', '#percent-old': '100', '#percent-new': '125' };
  const get = await runTool('ko', 'percentage-calculator', 'copy-summary', values);
  await tick();
  assert.equal(get.context.copied, '200의 15% = 30\n200 중 30의 비율 = 15%\n100 → 125 증감률 = +25%');
  assert.equal(get('#percent-result').textContent, '30');
  assert.equal(get('#what-percent-result').textContent, '15%');
  assert.equal(get('#change-result').textContent, '+25%');

  // FAQ example: 정가 50,000원 → 판매가 35,000원 = -30% (30% 할인), typed with thousands commas.
  const discount = await runTool('ko', 'percentage-calculator', 'copy-summary', { '#percent-old': '50,000', '#percent-new': '35,000' });
  await tick();
  // (app.js reads blank fields as 0, so the copy also holds a "0의 0% = 0" line; see QA infra notes.)
  assert.match(discount.context.copied, /^50,000 → 35,000 증감률 = -30%$/mu);
  assert.equal(discount('#change-result').textContent, '-30%');
  assert.equal(status(discount), '클립보드에 복사했습니다.');

  const wide = await runTool('ko', 'percentage-calculator', 'calculate-percentage', { '#percent-value': '１０', '#percent-base': '１，２５０' });
  assert.equal(wide('#percent-result').textContent, '125');
  assert.equal(status(wide), '계산했습니다.');
  const typo = await runTool('ko', 'percentage-calculator', 'calculate-percentage', { '#percent-value': '15%', '#percent-base': '200' });
  assert.equal(status(typo), '계산할 숫자를 올바르게 입력하세요.');
});

test('ko duration and date calculators', async () => {
  const shift = await runTool('ko', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-09-29T22:00', '#duration-end': '2026-09-30T06:00' });
  assert.equal(shift('#duration-exact').textContent, '0일 8시간 0분 0초'); // night shift across midnight (FAQ)
  assert.equal(shift('#duration-hours').textContent, '8');
  assert.equal(status(shift), '브라우저에서 경과 시간을 계산했습니다.');
  const long = await runTool('ko', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-01-01T09:00', '#duration-end': '2026-01-03T10:30' });
  assert.equal(long('#duration-exact').textContent, '2일 1시간 30분 0초');
  assert.equal(long('#duration-days').textContent, '2.0625');
  const backwards = await runTool('ko', 'time-duration-calculator', 'calculate-duration', { '#duration-start': '2026-01-02T09:00', '#duration-end': '2026-01-01T09:00' });
  assert.equal(status(backwards), '종료 시각이 시작 시각보다 늦도록 올바르게 선택하세요.');

  const dday = await runTool('ko', 'date-calculator', 'date-difference', { '#date-start': '2026-09-29', '#date-end': '2026-10-09' });
  assert.equal(dday('#date-difference-result').textContent, '10일'); // FAQ: 9월 29일 → 10월 9일 = D-10
  assert.equal(status(dday), '두 날짜 사이 일수를 계산했습니다.');
  const years = await runTool('ko', 'date-calculator', 'date-difference', { '#date-start': '2026-01-01', '#date-end': '2030-01-01' });
  assert.equal(years('#date-difference-result').textContent, '1,461일');

  const hundred = await runTool('ko', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '99' });
  assert.equal(hundred('#date-offset-result').textContent, '2027년 1월 6일 수요일'); // 100일 기념일 = 시작일 + 99일
  assert.equal(status(hundred), '날짜를 계산했습니다.');
  const before = await runTool('ko', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '-30' });
  assert.equal(before('#date-offset-result').textContent, '2026년 8월 30일 일요일');
  const missing = await runTool('ko', 'date-calculator', 'date-offset', { '#date-base': '2026-09-29', '#date-offset': '1.5' });
  assert.equal(status(missing), '날짜를 선택하고 일수를 정수로 입력하세요.');
});

test('ko local number parsing across tools (full-width digits, thousands commas)', async () => {
  const prime = await runTool('ko', 'prime-number-checker', 'check-prime', { '#prime-input': '1,000,003' });
  assert.equal(prime('#prime-output').textContent, '소수입니다');
  assert.equal(status(prime), '브라우저에서 판별했습니다.');
  const one = await runTool('ko', 'prime-number-checker', 'check-prime', { '#prime-input': '１' });
  assert.equal(one('#prime-output').textContent, '소수가 아닙니다');
  const huge = await runTool('ko', 'prime-number-checker', 'check-prime', { '#prime-input': '1,000,000,000,001' });
  assert.equal(status(huge), '0부터 1,000,000,000,000(1조)까지의 정수를 입력하세요.');

  const average = await runTool('ko', 'average-calculator', 'calculate-average', { '#average-input': '９０, ８５\n７０ 95' });
  assert.equal(average('#average-result').textContent, '85');
  assert.equal(average('#average-sum').textContent, '340');
  assert.equal(String(average('#average-count').textContent), '4');
  assert.equal(average('#average-min').textContent, '70');
  assert.equal(status(average), '브라우저에서 평균을 계산했습니다.');
  const comma = await runTool('ko', 'average-calculator', 'calculate-average', { '#average-input': '1,234' });
  assert.equal(String(comma('#average-count').textContent), '2'); // FAQ: a thousands comma splits the number

  const random = await withCrypto('random-number-generator', 'generate-number', { '#random-min': '７', '#random-max': '７' }, { checked: { '#random-integer': true } });
  assert.equal(random('#random-result').textContent, '7');
  assert.equal(status(random), '브라우저에서 랜덤 숫자를 생성했습니다.');

  const ratio = await runTool('ko', 'ratio-proportion-calculator', 'solve-ratio', { '#ratio-a': '1,920', '#ratio-b': '1,080', '#ratio-c': '１２８０' });
  assert.equal(String(ratio('#ratio-result').textContent), '720');
  assert.equal(ratio('#ratio-simplified').textContent, '16:9');
  assert.equal(status(ratio), '브라우저에서 비례식을 풀었습니다.');

  const unit = await runTool('ko', 'unit-converter', 'convert-unit', { '#unit-category': 'temperature', '#unit-from': 'celsius', '#unit-to': 'fahrenheit', '#unit-input': '１００' });
  assert.equal(unit('#unit-output').textContent, '212 ℉(화씨)');
  assert.equal(status(unit), '브라우저에서 단위를 변환했습니다.');
  const length = await runTool('ko', 'unit-converter', 'convert-unit', { '#unit-category': 'length', '#unit-from': 'meter', '#unit-to': 'kilometer', '#unit-input': '1,500' });
  assert.equal(length('#unit-output').textContent, '1.5 킬로미터(km)');

  // Shared message: must read naturally for the base converter too (not only number-to-words).
  const binary = await runTool('ko', 'binary-converter', 'convert-binary', { '#binary-from': '10', '#binary-to': '2', '#binary-input': '255' });
  assert.equal(binary('#binary-output').textContent, '11111111');
  assert.equal(status(binary), '브라우저에서 숫자를 변환했습니다.');
  // Copy/FAQ claim: negatives only when the source base is 10.
  const negative = await runTool('ko', 'binary-converter', 'convert-binary', { '#binary-from': '10', '#binary-to': '2', '#binary-input': '-255' });
  assert.equal(negative('#binary-output').textContent, '-11111111');
  const negativeHex = await runTool('ko', 'binary-converter', 'convert-binary', { '#binary-from': '16', '#binary-to': '10', '#binary-input': '-FF' });
  assert.equal(negativeHex('#binary-output').textContent, '—');
});

test('ko time zones default to Seoul → New York', async () => {
  const get = await runTool('ko', 'time-zone-converter');
  assert.equal(get('#timezone-from').value, 'Asia/Seoul');
  assert.equal(get('#timezone-to').value, 'America/New_York');
  get('#timezone-date').value = '2026-01-15T09:00'; // KST, New York on standard time (14 hours behind)
  get.click('convert-timezone');
  assert.match(get('#timezone-from-result').textContent, /^2026년 1월 15일 목요일 .*9시 0분 0초/u);
  assert.match(get('#timezone-to-result').textContent, /^2026년 1월 14일 수요일 .*7시 0분 0초/u);
  assert.equal(status(get), '서머타임을 반영해 브라우저에서 시간을 변환했습니다.');
});
