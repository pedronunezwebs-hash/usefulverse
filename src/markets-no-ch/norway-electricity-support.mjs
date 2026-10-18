const MAX_ROWS = 9_000;
const finite = (value, name, min = 0, max = 1e9) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) throw new RangeError(`${name} is outside the supported range.`);
  return number;
};

function osloParts(timestamp) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(timestamp));
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function osloMonthStart(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  const target = Date.UTC(year, monthNumber - 1, 1);
  for (let timestamp = target - 4 * 60 * 60 * 1000; timestamp <= target + 4 * 60 * 60 * 1000; timestamp += 60_000) {
    const parts = osloParts(timestamp);
    if (parts.year === String(year) && parts.month === String(monthNumber).padStart(2, '0') && parts.day === '01' && parts.hour === '00' && parts.minute === '00') return timestamp;
  }
  throw new RangeError(`Could not determine the Oslo calendar-month boundary for ${month}.`);
}

function validateCompleteMonths(records) {
  const grouped = new Map();
  for (const record of records) {
    const time = Date.parse(record.timestamp);
    if (!Number.isFinite(time) || !/^\d{4}-\d{2}-\d{2}T\d{2}:00(?::00(?:\.000)?)?(?:Z|[+-]\d{2}:?\d{2})$/u.test(record.timestamp)) throw new RangeError('Use one ISO, time-zoned price row per clock hour.');
    const rows = grouped.get(record.month) ?? [];
    rows.push(time); grouped.set(record.month, rows);
  }
  for (const [month, times] of grouped) {
    const start = osloMonthStart(month);
    const [year, monthNumber] = month.split('-').map(Number);
    const nextMonth = `${monthNumber === 12 ? year + 1 : year}-${String(monthNumber === 12 ? 1 : monthNumber + 1).padStart(2, '0')}`;
    const end = osloMonthStart(nextMonth);
    const expectedRows = (end - start) / 3_600_000;
    times.sort((a, b) => a - b);
    if (times.length !== expectedRows || times[0] !== start || times.at(-1) !== end - 3_600_000 || times.some((time, index) => index > 0 && time - times[index - 1] !== 3_600_000)) {
      throw new RangeError(`The ${month} CSV data must include each full Oslo-local clock hour exactly once.`);
    }
  }
}

function parseCsv(text) {
  const delimiter = (text.slice(0, text.indexOf('\n')).match(/;/gu) ?? []).length > (text.slice(0, text.indexOf('\n')).match(/,/gu) ?? []).length ? ';' : ',';
  const rows = [];
  let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (!quoted && character === delimiter) { row.push(cell); cell = ''; }
    else if (!quoted && (character === '\n' || character === '\r')) {
      if (character === '\r' && text[index + 1] === '\n') index += 1;
      row.push(cell); cell = '';
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
    } else cell += character;
  }
  if (cell || row.length) { row.push(cell); if (row.some((value) => value.trim())) rows.push(row); }
  return rows;
}

/** Parses an hourly, user-provided spot-price and consumption CSV entirely on-device. */
export function parseNorwayElectricityCsv(text) {
  const source = String(text ?? '');
  if (new TextEncoder().encode(source).byteLength > 20_000_000) throw new RangeError('Choose a CSV file under 20 MB.');
  const csv = parseCsv(source);
  const headers = csv.shift()?.map((value) => value.replace(/^\uFEFF/u, '').trim().toLowerCase()) ?? [];
  const index = (key) => headers.indexOf(key);
  const timeIndex = index('timestamp'); const consumptionIndex = index('consumption_kwh'); const priceIndex = index('spot_price_nok_per_kwh_ex_vat');
  if ([timeIndex, consumptionIndex, priceIndex].some((value) => value < 0)) throw new TypeError('CSV needs timestamp, consumption_kwh, and spot_price_nok_per_kwh_ex_vat columns.');
  if (csv.length < 1 || csv.length > MAX_ROWS) throw new RangeError(`CSV needs between 1 and ${MAX_ROWS} hourly rows.`);
  const records = csv.map((row, indexInFile) => {
    const timestamp = (row[timeIndex] ?? '').trim();
    const consumptionText = (row[consumptionIndex] ?? '').trim();
    const priceText = (row[priceIndex] ?? '').trim();
    const consumptionKwh = Number(consumptionText.replace(',', '.'));
    const spotPriceNokPerKwhExVat = Number(priceText.replace(',', '.'));
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:00(?::00(?:\.000)?)?(?:Z|[+-]\d{2}:?\d{2})$/u.test(timestamp) || !Number.isFinite(Date.parse(timestamp))) throw new RangeError(`Row ${indexInFile + 2}: enter an ISO clock-hour timestamp with a time-zone offset.`);
    const localParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit' }).formatToParts(new Date(timestamp));
    const localYear = localParts.find((part) => part.type === 'year')?.value;
    const localMonth = localParts.find((part) => part.type === 'month')?.value;
    if (localYear !== '2026') throw new RangeError(`Row ${indexInFile + 2}: only Oslo-local hours in 2026 are supported.`);
    if (!consumptionText || consumptionKwh < 0 || consumptionKwh > 1_000_000 || !Number.isFinite(consumptionKwh)) throw new RangeError(`Row ${indexInFile + 2}: invalid consumption.`);
    if (!priceText || spotPriceNokPerKwhExVat < -100 || spotPriceNokPerKwhExVat > 1000 || !Number.isFinite(spotPriceNokPerKwhExVat)) throw new RangeError(`Row ${indexInFile + 2}: invalid spot price.`);
    return Object.freeze({ timestamp, month: `${localYear}-${localMonth}`, consumptionKwh, spotPriceNokPerKwhExVat });
  }).sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  validateCompleteMonths(records);
  return Object.freeze(records);
}

const roundMoney = (amount) => Math.round((amount + Math.sign(amount) * Number.EPSILON) * 100) / 100;

/** Compares 2026 household electricity scenarios; all user data stays in the browser. */
export function compareNorwayElectricitySupport({
  records,
  meterType = 'household',
  priceArea = 'NO1',
  vatPct = 25,
  networkVariableNokPerKwh = 0,
  networkFixedNokPerMonth = 0,
  otherVariableNokPerKwh = 0,
  otherFixedNokPerMonth = 0,
} = {}) {
  if (!Array.isArray(records) || records.length < 1 || records.length > MAX_ROWS) throw new RangeError('Load between 1 and 9,000 hourly records.');
  if (!['household', 'holiday-home'].includes(meterType)) throw new RangeError('Choose a household or holiday-home meter.');
  if (!['NO1', 'NO2', 'NO3', 'NO4', 'NO5'].includes(priceArea)) throw new RangeError('Choose the Norwegian price area used by the CSV.');
  if (![0, 25].includes(Number(vatPct))) throw new RangeError('Choose the 0% or 25% electricity VAT setting shown on your invoice.');
  validateCompleteMonths(records);
  const vat = Number(vatPct) / 100;
  const networkVariable = finite(networkVariableNokPerKwh, 'Network variable charge', 0, 100);
  const networkFixed = finite(networkFixedNokPerMonth, 'Network fixed charge', 0, 1e7);
  const otherVariable = finite(otherVariableNokPerKwh, 'Other variable charge', 0, 100);
  const otherFixed = finite(otherFixedNokPerMonth, 'Other fixed charge', 0, 1e7);
  const cap = meterType === 'holiday-home' ? 1000 : 5000;
  const monthlyUse = new Map();
  const monthlySpot = new Map();
  const totals = {
    market: { energyExVat: 0, vat: 0, network: 0, other: 0, adjustment: 0, eligibleKwh: 0 },
    support: { energyExVat: 0, vat: 0, network: 0, other: 0, adjustment: 0, eligibleKwh: 0 },
    norgespris: { energyExVat: 0, vat: 0, network: 0, other: 0, adjustment: 0, eligibleKwh: 0 },
  };
  const months = new Set();
  let totalKwh = 0;
  for (const row of [...records].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))) {
    const consumption = finite(row.consumptionKwh, 'Hourly consumption', 0, 1_000_000);
    const price = finite(row.spotPriceNokPerKwhExVat, 'Hourly spot price', -100, 1000);
    const month = String(row.month ?? row.timestamp?.slice(0, 7) ?? '');
    if (!/^2026-(0[1-9]|1[0-2])$/u.test(month)) throw new RangeError('Only periods in the 2026 calendar year are supported.');
    months.add(month); totalKwh += consumption;
    const priceStats = monthlySpot.get(month) ?? { sum: 0, hours: 0 };
    priceStats.sum += price; priceStats.hours += 1; monthlySpot.set(month, priceStats);
    const used = monthlyUse.get(month) ?? 0;
    const capped = Math.min(consumption, Math.max(0, cap - used));
    monthlyUse.set(month, used + consumption);

    const energyExVat = consumption * price;
    const network = consumption * networkVariable;
    const other = consumption * otherVariable;
    const hourlyVat = (energyExVat + network + other) * vat;
    totals.market.energyExVat += energyExVat;
    totals.market.vat += hourlyVat;
    totals.market.network += network;
    totals.market.other += other;
    totals.market.eligibleKwh += consumption;
    totals.support.energyExVat += energyExVat;
    totals.support.vat += hourlyVat;
    totals.support.network += network;
    totals.support.other += other;
    totals.support.eligibleKwh += meterType === 'household' ? capped : 0;
    if (meterType === 'household' && capped > 0) totals.support.adjustment -= Math.max(0, price - 0.77) * 0.9 * capped * (1 + vat);
    totals.norgespris.energyExVat += energyExVat;
    totals.norgespris.vat += hourlyVat;
    totals.norgespris.network += network;
    totals.norgespris.other += other;
    // The 2026 reference is NOK 0.40/kWh before VAT (NOK 0.50 including VAT, or NOK 0.40 in VAT-exempt areas).
  }
  for (const [month, stats] of monthlySpot) {
    const eligibleKwh = Math.min(monthlyUse.get(month) ?? 0, cap);
    totals.norgespris.eligibleKwh += eligibleKwh;
    // Norgespris settlement uses the area's full-month average spot price and eligible metered use.
    totals.norgespris.adjustment += (0.40 - stats.sum / stats.hours) * eligibleKwh * (1 + vat);
  }
  for (const scenario of Object.values(totals)) {
    scenario.network += networkFixed * months.size;
    scenario.other += otherFixed * months.size;
    scenario.vat = roundMoney(scenario.vat + (networkFixed + otherFixed) * months.size * vat);
  }
  const result = (value) => Object.freeze({
    energyExVatNok: roundMoney(value.energyExVat), vatNok: roundMoney(value.vat),
    networkChargesNok: roundMoney(value.network), otherChargesNok: roundMoney(value.other),
    adjustmentNok: roundMoney(value.adjustment), eligibleKwh: roundMoney(value.eligibleKwh),
    totalNok: roundMoney(value.energyExVat + value.vat + value.network + value.other + value.adjustment),
  });
  if (totalKwh <= 0) throw new RangeError('The 2026 data needs positive electricity consumption.');
  return Object.freeze({
    taxYear: 2026, meterType, priceArea, vatPct: Number(vatPct), monthCount: months.size, totalKwh: roundMoney(totalKwh),
    market: result(totals.market), electricitySupport: result(totals.support), norgespris: result(totals.norgespris),
    assumptions: Object.freeze({ supportThresholdExVatNokPerKwh: 0.77, supportRate: 0.9, norgesprisReferenceExVatNokPerKwh: 0.4, monthlyCapKwh: cap }),
  });
}
