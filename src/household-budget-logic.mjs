const MAX_TRANSACTIONS = 300;
const MAX_AMOUNT = 1_000_000_000;

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function validateBudgetTransaction(value, month) {
  if (!value || !['income', 'expense'].includes(value.type)) throw new TypeError('Choose income or expense.');
  const date = String(value.date ?? '');
  if (!isValidDate(date) || date.slice(0, 7) !== month) throw new RangeError('Choose a valid date in the selected month.');
  const amount = Number(value.amount);
  const minorUnits = amount * 100;
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT || Math.abs(minorUnits - Math.round(minorUnits)) > 1e-8) {
    throw new RangeError('Enter an amount greater than zero with no more than two decimal places.');
  }
  const category = String(value.category ?? '').trim();
  if (!category || category.length > 40) throw new RangeError('Enter a category of 1 to 40 characters.');
  const note = String(value.note ?? '').trim();
  if (note.length > 100) throw new RangeError('Keep notes to 100 characters or fewer.');
  return { date, type: value.type, amount, category, note };
}

export function parseBudgetAmount(raw, locale = 'en') {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.';
  const groups = new Set(parts.filter((part) => part.type === 'group').map((part) => part.value));
  const digitFormatter = new Intl.NumberFormat(locale, { useGrouping: false });
  let value = String(raw ?? '').trim();
  if (!value) return Number.NaN;
  for (let digit = 0; digit < 10; digit += 1) value = value.replaceAll(digitFormatter.format(digit), String(digit));
  value = value.replace(/[٠-٩]/gu, (digit) => String(digit.codePointAt(0) - 0x660))
    .replace(/[۰-۹]/gu, (digit) => String(digit.codePointAt(0) - 0x6f0));
  value = value.replaceAll('\u066c', '').replaceAll('\u066b', '.');
  const asciiDecimalFallback = decimal !== '.' && value.includes('.') && !value.includes(decimal);
  for (const group of groups) {
    if (asciiDecimalFallback && group === '.') continue;
    value = value.replaceAll(group, '');
  }
  if (decimal !== '.') value = value.replaceAll(decimal, '.');
  // Number inputs normally expose ASCII decimals; also accept those when the
  // locale uses a comma, while rejecting currency symbols and malformed text.
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/u.test(value)) return Number.NaN;
  return Number(value);
}

export function summarizeBudget(transactions) {
  if (!Array.isArray(transactions) || transactions.length > MAX_TRANSACTIONS) throw new RangeError(`Use no more than ${MAX_TRANSACTIONS} transactions per month.`);
  const totals = { income: 0, expenses: 0 };
  const categories = new Map();
  const clean = transactions.map((transaction) => {
    const date = String(transaction?.date ?? '');
    const row = validateBudgetTransaction(transaction, date.slice(0, 7));
    const totalKey = row.type === 'income' ? 'income' : 'expenses';
    totals[totalKey] = Math.round((totals[totalKey] + row.amount) * 100) / 100;
    const key = `${row.type}\u0000${row.category}`;
    categories.set(key, Math.round(((categories.get(key) ?? 0) + row.amount) * 100) / 100);
    return row;
  });
  return {
    transactions: clean,
    income: totals.income,
    expenses: totals.expenses,
    balance: totals.income - totals.expenses,
    categories: [...categories].map(([key, amount]) => {
      const [type, category] = key.split('\u0000');
      return { type, category, amount };
    }).sort((a, b) => a.type.localeCompare(b.type) || a.category.localeCompare(b.category)),
  };
}

export function budgetCsvCell(value) {
  const text = String(value ?? '').replace(/[\r\n]+/gu, ' ');
  const safe = /^[\s\uFEFF]*[=+@\-]/u.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

export { MAX_TRANSACTIONS as HOUSEHOLD_BUDGET_MAX_TRANSACTIONS };
