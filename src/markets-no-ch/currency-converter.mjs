export const ecbDailyRatesUrl = 'https://api.frankfurter.dev/v2/providers/ecb/rates?base=EUR';

export function parseEcbCsv(text) {
  if (typeof text !== 'string' || text.length > 2_000_000) throw new RangeError('Paste a valid ECB CSV file under 2 MB.');
  const rows = text.replace(/^\uFEFF/u, '').trim().split(/\r?\n/u).filter(Boolean);
  if (rows.length < 2) throw new TypeError('ECB CSV has no rate observations.');
  const header = rows[0].split(',').map((value) => value.trim().toUpperCase());
  const currencyIndex = header.indexOf('CURRENCY');
  const dateIndex = header.indexOf('TIME_PERIOD');
  const valueIndex = header.indexOf('OBS_VALUE');
  if ([currencyIndex, dateIndex, valueIndex].some((index) => index < 0)) throw new TypeError('CSV does not have the ECB currency, date and rate columns.');
  const observations = [];
  for (const row of rows.slice(1)) {
    const cells = row.split(',');
    const currency = cells[currencyIndex]?.trim().toUpperCase();
    const date = cells[dateIndex]?.trim();
    const rate = Number(cells[valueIndex]);
    if (!/^[A-Z]{3}$/u.test(currency ?? '') || !/^\d{4}-\d{2}-\d{2}$/u.test(date ?? '') || !Number.isFinite(rate) || rate <= 0) continue;
    observations.push({ currency, date, rate });
  }
  const date = observations.map((row) => row.date).sort().at(-1);
  if (!date) throw new TypeError('ECB CSV has no valid dated observations.');
  const rates = { EUR: 1 };
  for (const row of observations) if (row.date === date) rates[row.currency] = row.rate;
  if (!rates.NOK || !rates.CHF) throw new TypeError('Latest ECB snapshot must contain positive NOK and CHF rates.');
  return Object.freeze({ date, rates: Object.freeze(rates), source: 'European Central Bank reference rates' });
}

export async function fetchEcbRates(fetchImpl = fetch) {
  const response = await fetchImpl(ecbDailyRatesUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  if (!response.ok) throw new Error(`The rate provider returned HTTP ${response.status}.`);
  const rows = await response.json();
  if (!Array.isArray(rows)) throw new TypeError('The ECB rates service returned an invalid response.');
  const valid = rows.filter((row) => row?.base === 'EUR' && /^[A-Z]{3}$/u.test(row.quote ?? '') && /^\d{4}-\d{2}-\d{2}$/u.test(row.date ?? '') && Number.isFinite(row.rate) && row.rate > 0);
  const date = valid.map((row) => row.date).sort().at(-1);
  if (!date) throw new TypeError('The ECB rates service returned no dated rates.');
  const rates = { EUR: 1 };
  for (const row of valid) if (row.date === date) rates[row.quote] = row.rate;
  if (!rates.NOK || !rates.CHF) throw new TypeError('Latest ECB snapshot must contain NOK and CHF rates.');
  return Object.freeze({ date, rates: Object.freeze(rates), source: 'ECB reference rates via Frankfurter' });
}

function finite(value, name, min = 0, max = 1_000_000_000) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} must be from ${min} to ${max}.`);
  return number;
}

export function convertCurrencyAmounts({ amounts, from, to, snapshot, fixedFee = 0, percentageFee = 0, margin = 0 } = {}) {
  if (!snapshot?.rates || !/^\d{4}-\d{2}-\d{2}$/u.test(snapshot.date ?? '')) throw new TypeError('Load a dated ECB rate snapshot first.');
  if (!/^[A-Z]{3}$/u.test(from ?? '') || !/^[A-Z]{3}$/u.test(to ?? '') || !snapshot.rates[from] || !snapshot.rates[to]) throw new RangeError('Choose currencies included in this rate snapshot.');
  fixedFee = finite(fixedFee, 'Fixed fee');
  percentageFee = finite(percentageFee, 'Percentage fee', 0, 100);
  margin = finite(margin, 'Exchange-rate margin', 0, 100);
  const lines = String(amounts ?? '').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  if (!lines.length || lines.length > 100) throw new RangeError('Enter between 1 and 100 amounts, one per line.');
  const rate = snapshot.rates[to] / snapshot.rates[from];
  const results = lines.map((line) => {
    const normalized = line.replace(/\s/gu, '').replace(',', '.');
    const amount = finite(normalized, 'Amount', 0.000001, 1_000_000_000);
    const beforeFees = amount * rate;
    const fixedFeeInTarget = fixedFee * rate;
    const afterFixedAndPercent = Math.max(0, amount - fixedFee) * (1 - percentageFee / 100) * rate;
    const received = afterFixedAndPercent * (1 - margin / 100);
    return Object.freeze({ amount, beforeFees, fixedFee: fixedFeeInTarget, percentageFee: beforeFees * percentageFee / 100, margin: afterFixedAndPercent * margin / 100, received });
  });
  return Object.freeze({ from, to, date: snapshot.date, rate, results: Object.freeze(results) });
}
