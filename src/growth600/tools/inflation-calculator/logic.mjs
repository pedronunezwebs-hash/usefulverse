export const CPI_U_FIRST_YEAR = 1913;
export const CPI_U_LAST_YEAR = 2025;

// Annual-average CPI-U, U.S. city average, all items; BLS series CUUR0000SA0.
// Values are the BLS M13 annual averages. Older observations are published to 1 decimal.
const annualCpiValues = Object.freeze([
  9.9, 10, 10.1, 10.9, 12.8, 15.1, 17.3, 20, 17.9, 16.8, 17.1, 17.1, 17.5, 17.7,
  17.4, 17.1, 17.1, 16.7, 15.2, 13.7, 13, 13.4, 13.7, 13.9, 14.4, 14.1, 13.9, 14,
  14.7, 16.3, 17.3, 17.6, 18, 19.5, 22.3, 24.1, 23.8, 24.1, 26, 26.5, 26.7, 26.9,
  26.8, 27.2, 28.1, 28.9, 29.1, 29.6, 29.9, 30.2, 30.6, 31, 31.5, 32.4, 33.4,
  34.8, 36.7, 38.8, 40.5, 41.8, 44.4, 49.3, 53.8, 56.9, 60.6, 65.2, 72.6, 82.4,
  90.9, 96.5, 99.6, 103.9, 107.6, 109.6, 113.6, 118.3, 124, 130.7, 136.2, 140.3,
  144.5, 148.2, 152.4, 156.9, 160.5, 163, 166.6, 172.2, 177.1, 179.9, 184, 188.9,
  195.3, 201.6, 207.342, 215.303, 214.537, 218.056, 224.939, 229.594, 232.957,
  236.736, 237.017, 240.007, 245.12, 251.107, 255.657, 258.811, 270.97, 292.655,
  304.702, 313.689, 321.943,
]);

export const CPI_U_ANNUAL = Object.freeze(Object.fromEntries(
  annualCpiValues.map((value, index) => [CPI_U_FIRST_YEAR + index, value]),
));

export function adjustByIndex({ amount, startIndex, endIndex }) {
  const value = Number(amount);
  const start = Number(startIndex);
  const end = Number(endIndex);
  if (![value, start, end].every(Number.isFinite) || value <= 0 || start <= 0 || end <= 0) {
    throw new RangeError('Amount and indexes must be finite positive numbers.');
  }
  if (value > 1e12 || start > 1e9 || end > 1e9) throw new RangeError('An input exceeds the supported range.');
  const ratio = end / start;
  const adjustedAmount = value * ratio;
  if (!Number.isFinite(adjustedAmount) || adjustedAmount > 1e300) throw new RangeError('The adjusted amount exceeds the supported range.');
  return Object.freeze({
    adjustedAmount,
    cumulativeChangePercent: (ratio - 1) * 100,
    priceLevelRatio: ratio,
  });
}

export function calculateCpiInflation({ amount, startYear, endYear }) {
  const from = Number(startYear);
  const to = Number(endYear);
  if (!Number.isInteger(from) || !Number.isInteger(to) || from < CPI_U_FIRST_YEAR || to > CPI_U_LAST_YEAR || to <= from) {
    throw new RangeError(`Choose two whole years from ${CPI_U_FIRST_YEAR} to ${CPI_U_LAST_YEAR}, with the end year later than the start year.`);
  }
  return Object.freeze({
    ...adjustByIndex({ amount, startIndex: CPI_U_ANNUAL[from], endIndex: CPI_U_ANNUAL[to] }),
    startYear: from,
    endYear: to,
    years: to - from,
    dataset: 'us-cpi-u-annual',
  });
}

export function calculateCustomInflation({ amount, annualRatePercent, years }) {
  const rate = Number(annualRatePercent);
  const duration = Number(years);
  if (!Number.isFinite(rate) || rate <= -99.99 || rate > 1000) throw new RangeError('Annual rate must be greater than -99.99% and no more than 1,000%.');
  if (!Number.isInteger(duration) || duration < 1 || duration > 200) throw new RangeError('Years must be a whole number from 1 to 200.');
  const result = adjustByIndex({ amount, startIndex: 1, endIndex: (1 + rate / 100) ** duration });
  return Object.freeze({ ...result, annualizedRatePercent: rate, years: duration, dataset: 'user-rate' });
}
