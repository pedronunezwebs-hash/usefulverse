const MAX_AMOUNT = 1_000_000_000_000;
const MAX_SNAPSHOTS = 120;
const TYPES = new Set(['asset', 'liability']);

export function calculateNetWorth(items = []) {
  if (!Array.isArray(items) || items.length > 100) throw new RangeError('Enter no more than 100 balance items.');
  const cleanItems = items.map((item) => {
    const type = String(item?.type ?? '');
    const category = String(item?.category ?? '').trim();
    const amount = Number(item?.amount);
    if (!TYPES.has(type) || !category || category.length > 80 || !Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) throw new RangeError('Check each balance item. Amounts must be non-negative and within the supported range.');
    return Object.freeze({ type, category, amount });
  });
  const totalAssets = cleanItems.filter(({ type }) => type === 'asset').reduce((sum, { amount }) => sum + amount, 0);
  const totalLiabilities = cleanItems.filter(({ type }) => type === 'liability').reduce((sum, { amount }) => sum + amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  if (![totalAssets, totalLiabilities, netWorth].every(Number.isFinite)) throw new RangeError('The totals exceed the safe calculation range.');
  const assetCategories = aggregate(cleanItems, 'asset');
  const liabilityCategories = aggregate(cleanItems, 'liability');
  return Object.freeze({
    items: Object.freeze(cleanItems), totalAssets, totalLiabilities, netWorth,
    debtToAssetPercent: totalAssets > 0 ? totalLiabilities / totalAssets * 100 : null,
    assetCategories, liabilityCategories,
  });
}

function aggregate(items, type) {
  const totals = new Map();
  for (const item of items) if (item.type === type) totals.set(item.category, (totals.get(item.category) ?? 0) + item.amount);
  return Object.freeze([...totals].map(([category, amount]) => Object.freeze({ category, amount })));
}

export function addNetWorthSnapshot(snapshots, snapshot) {
  if (!Array.isArray(snapshots) || snapshots.length > MAX_SNAPSHOTS) throw new RangeError(`Keep up to ${MAX_SNAPSHOTS} snapshots.`);
  const date = String(snapshot?.date ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new RangeError('Choose a valid snapshot date.');
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date) throw new RangeError('Choose a valid snapshot date.');
  const currency = String(snapshot?.currency ?? '').toUpperCase();
  if (!/^[A-Z]{3}$/u.test(currency)) throw new RangeError('Use a three-letter currency code.');
  const values = calculateNetWorth(snapshot?.items);
  const entry = Object.freeze({ date, currency, items: values.items, totalAssets: values.totalAssets, totalLiabilities: values.totalLiabilities, netWorth: values.netWorth });
  const next = snapshots.filter((item) => item.date !== date).concat(entry).sort((a, b) => a.date.localeCompare(b.date));
  if (next.length > MAX_SNAPSHOTS) next.splice(0, next.length - MAX_SNAPSHOTS);
  return Object.freeze(next);
}

export function compareNetWorthSnapshots(current, previous) {
  if (!current || !previous || current.currency !== previous.currency) return null;
  const change = current.netWorth - previous.netWorth;
  return Object.freeze({ change, percentChange: previous.netWorth === 0 ? null : change / Math.abs(previous.netWorth) * 100 });
}

function csvCell(value) {
  let text = String(value ?? '');
  if (/^[\s]*[=+@\-]/u.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function exportNetWorthCsv(snapshots) {
  if (!Array.isArray(snapshots) || snapshots.length > MAX_SNAPSHOTS) throw new RangeError('Invalid snapshot list.');
  const rows = [['Date', 'Currency', 'Type', 'Category', 'Amount', 'Total assets', 'Total liabilities', 'Net worth']];
  for (const snapshot of snapshots) {
    const checked = addNetWorthSnapshot([], snapshot)[0];
    for (const item of checked.items) rows.push([checked.date, checked.currency, item.type, item.category, item.amount, checked.totalAssets, checked.totalLiabilities, checked.netWorth]);
  }
  return `${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
}

export const NET_WORTH_LIMITS = Object.freeze({ maxAmount: MAX_AMOUNT, maxItems: 100, maxSnapshots: MAX_SNAPSHOTS });
