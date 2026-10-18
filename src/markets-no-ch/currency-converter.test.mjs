import test from 'node:test';
import assert from 'node:assert/strict';
import { convertCurrencyAmounts, ecbDailyRatesUrl, fetchEcbRates, parseEcbCsv } from './currency-converter.mjs';

const sample = 'FREQ,CURRENCY,CURRENCY_DENOM,EXR_TYPE,EXR_SUFFIX,TIME_PERIOD,OBS_VALUE\nD,CHF,EUR,SP00,A,2026-10-16,0.92\nD,NOK,EUR,SP00,A,2026-10-16,11.5\nD,USD,EUR,SP00,A,2026-10-16,1.1';

test('parses a single dated ECB snapshot and requires NOK and CHF', () => {
  const parsed = parseEcbCsv(sample);
  assert.equal(parsed.date, '2026-10-16');
  assert.equal(parsed.rates.EUR, 1);
  assert.equal(parsed.rates.NOK, 11.5);
  assert.equal(parsed.rates.CHF, 0.92);
  assert.throws(() => parseEcbCsv(sample.replace(',NOK,', ',SEK,')), /NOK and CHF/u);
  const latest = parseEcbCsv(sample.replace('2026-10-16,1.1', '2026-10-15,1.1'));
  assert.equal(latest.date, '2026-10-16');
  assert.equal(Object.hasOwn(latest.rates, 'USD'), false);
});

test('converts multiple amounts using ECB cross-rates and user-entered fees', () => {
  const snapshot = parseEcbCsv(sample);
  const result = convertCurrencyAmounts({ amounts: '20\n100', from: 'EUR', to: 'NOK', snapshot, fixedFee: 1, percentageFee: 2, margin: 1 });
  assert.equal(result.date, '2026-10-16');
  assert.equal(result.results.length, 2);
  assert.equal(result.results[0].beforeFees, 230);
  assert.ok(Math.abs(result.results[0].received - (19 * 0.98 * 11.5 * 0.99)) < 1e-10);
  assert.ok(result.results[0].received < result.results[0].beforeFees);
});

test('fetches only dated ECB-provider rates through the free CORS-enabled endpoint', async () => {
  let request;
  const snapshot = await fetchEcbRates(async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => [
      { date: '2026-10-16', base: 'EUR', quote: 'NOK', rate: 10.6 },
      { date: '2026-10-16', base: 'EUR', quote: 'CHF', rate: 0.92 },
      { date: '2026-10-15', base: 'EUR', quote: 'USD', rate: 1.1 },
    ] };
  });
  assert.equal(request.url, ecbDailyRatesUrl);
  assert.equal(request.options.cache, 'no-store');
  assert.equal(snapshot.date, '2026-10-16');
  assert.equal(snapshot.rates.NOK, 10.6);
  assert.equal(Object.hasOwn(snapshot.rates, 'USD'), false);
});

test('rejects undated, malformed, excessive and unsupported conversion inputs', () => {
  const snapshot = parseEcbCsv(sample);
  assert.throws(() => convertCurrencyAmounts({ amounts: '', from: 'EUR', to: 'NOK', snapshot }), /1 and 100/u);
  assert.throws(() => convertCurrencyAmounts({ amounts: '1\n'.repeat(101), from: 'EUR', to: 'NOK', snapshot }), /1 and 100/u);
  assert.throws(() => convertCurrencyAmounts({ amounts: '-1', from: 'EUR', to: 'NOK', snapshot }), /Amount/u);
  assert.throws(() => convertCurrencyAmounts({ amounts: '1', from: 'RUB', to: 'NOK', snapshot }), /currencies included/u);
  assert.throws(() => convertCurrencyAmounts({ amounts: '1', from: 'EUR', to: 'NOK', snapshot, margin: 101 }), /Exchange-rate margin/u);
});
