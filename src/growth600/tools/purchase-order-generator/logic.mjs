export const PURCHASE_ORDER_LIMITS = Object.freeze({
  lines: 50,
  description: 240,
  text: 240,
  notes: 2400,
  quantity: 1_000_000,
  unitPrice: 1_000_000_000,
  taxPercent: 100,
  minorTotal: Number.MAX_SAFE_INTEGER,
});

const CURRENCIES = new Set(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR', 'BRL', 'MXN', 'CHF', 'NZD']);

function boundedText(value, label, maximum, { required = false } = {}) {
  const result = String(value ?? '').trim();
  if (required && !result) throw new TypeError(`${label} is required.`);
  if ([...result].length > maximum) throw new RangeError(`${label} must be ${maximum} characters or fewer.`);
  return result;
}

function validDate(value, label, { required = false } = {}) {
  const result = String(value ?? '').trim();
  if (required && !result) throw new TypeError(`${label} is required.`);
  if (!result) return '';
  const parsed = new Date(`${result}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(result) || Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== result) {
    throw new TypeError(`${label} must be a valid date.`);
  }
  return result;
}

function fixed(value, label, { optional = false, max = Number.MAX_SAFE_INTEGER } = {}) {
  const raw = String(value ?? '').trim();
  if (!raw && optional) return 0n;
  if (!/^(?:0|[1-9]\d{0,14})(?:\.\d{1,6})?$/u.test(raw)) throw new TypeError(`${label} must be a non-negative number with up to 6 decimal places.`);
  const [whole, fraction = ''] = raw.split('.');
  const scaled = BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0'));
  if (scaled > BigInt(max) * 1_000_000n) throw new RangeError(`${label} is above the supported limit.`);
  return scaled;
}

function roundedDivision(numerator, denominator) {
  return (numerator + denominator / 2n) / denominator;
}

function amountMinor(scaledAmount, digits) {
  const divisor = 10n ** BigInt(6 - digits);
  return roundedDivision(scaledAmount, divisor);
}

function safeInteger(value, label) {
  if (value > BigInt(PURCHASE_ORDER_LIMITS.minorTotal)) throw new RangeError(`${label} is too large.`);
  return Number(value);
}

export function createPurchaseOrder(input, { locale = 'en' } = {}) {
  if (!input || typeof input !== 'object') throw new TypeError('Enter purchase order details.');
  const currency = String(input.currency ?? 'USD').trim().toUpperCase();
  if (!CURRENCIES.has(currency)) throw new TypeError('Choose a supported currency.');
  const digits = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions().maximumFractionDigits;
  const issuedDate = validDate(input.issuedDate, 'Issue date', { required: true });
  const deliveryDate = validDate(input.deliveryDate, 'Requested delivery date');
  if (deliveryDate && deliveryDate < issuedDate) throw new RangeError('Delivery date cannot be before the issue date.');
  const linesSource = Array.isArray(input.lines) ? input.lines : [];
  if (!linesSource.length || linesSource.length > PURCHASE_ORDER_LIMITS.lines) throw new RangeError(`Add 1 to ${PURCHASE_ORDER_LIMITS.lines} line items.`);
  const lines = linesSource.map((line, index) => {
    const description = boundedText(line?.description, `Item ${index + 1}`, PURCHASE_ORDER_LIMITS.description, { required: true });
    const quantity = fixed(line.quantity, `Quantity ${index + 1}`, { max: PURCHASE_ORDER_LIMITS.quantity });
    const unitPrice = fixed(line.unitPrice, `Unit price ${index + 1}`, { max: PURCHASE_ORDER_LIMITS.unitPrice });
    if (quantity <= 0n) throw new RangeError(`Quantity ${index + 1} must be greater than zero.`);
    const totalMinor = roundedDivision(quantity * unitPrice * (10n ** BigInt(digits)), 1_000_000_000_000n);
    return Object.freeze({ description, quantity: Number(quantity) / 1_000_000, unitPrice: Number(unitPrice) / 1_000_000, totalMinor: safeInteger(totalMinor, 'Line total') });
  });
  const subtotalMinor = lines.reduce((sum, line) => sum + BigInt(line.totalMinor), 0n);
  const taxPercent = fixed(input.taxPercent, 'Tax rate', { optional: true, max: PURCHASE_ORDER_LIMITS.taxPercent });
  const shippingScaled = fixed(input.shipping, 'Shipping', { optional: true, max: PURCHASE_ORDER_LIMITS.unitPrice });
  const taxMinor = roundedDivision(subtotalMinor * taxPercent, 100_000_000n);
  const shippingMinor = amountMinor(shippingScaled, digits);
  const totalMinor = subtotalMinor + taxMinor + shippingMinor;

  return Object.freeze({
    number: boundedText(input.number, 'Purchase order number', 48), issuedDate, deliveryDate, currency, digits,
    buyer: boundedText(input.buyer, 'Buyer', PURCHASE_ORDER_LIMITS.text, { required: true }),
    buyerAddress: boundedText(input.buyerAddress, 'Buyer address', PURCHASE_ORDER_LIMITS.notes),
    supplier: boundedText(input.supplier, 'Supplier', PURCHASE_ORDER_LIMITS.text, { required: true }),
    supplierAddress: boundedText(input.supplierAddress, 'Supplier address', PURCHASE_ORDER_LIMITS.notes),
    paymentTerms: boundedText(input.paymentTerms, 'Payment terms', 500),
    deliveryTerms: boundedText(input.deliveryTerms, 'Delivery terms', 500),
    notes: boundedText(input.notes, 'Notes', PURCHASE_ORDER_LIMITS.notes),
    lines: Object.freeze(lines),
    subtotalMinor: safeInteger(subtotalMinor, 'Subtotal'), taxPercent: Number(taxPercent) / 1_000_000,
    taxMinor: safeInteger(taxMinor, 'Tax'), shippingMinor: safeInteger(shippingMinor, 'Shipping'), totalMinor: safeInteger(totalMinor, 'Total'),
  });
}

export function formatPurchaseOrderMoney(minor, order, locale = 'en') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: order.currency, minimumFractionDigits: order.digits, maximumFractionDigits: order.digits })
    .format(Number(minor) / (10 ** order.digits));
}

export function purchaseOrderToCsv(order, labels = {}) {
  const quote = (value) => {
    const source = String(value ?? '');
    const safe = /^[\s]*[=+\-@]/u.test(source) ? `'${source}` : source;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = [
    [labels.purchaseOrder ?? 'Purchase order', order.number], [labels.issueDate ?? 'Issue date', order.issuedDate],
    [labels.deliveryDate ?? 'Requested delivery', order.deliveryDate], [labels.buyer ?? 'Buyer', order.buyer], [labels.buyerAddress ?? 'Buyer address', order.buyerAddress],
    [labels.supplier ?? 'Supplier', order.supplier], [labels.supplierAddress ?? 'Supplier address', order.supplierAddress], [],
    [labels.description ?? 'Description', labels.quantity ?? 'Quantity', labels.unitPrice ?? 'Unit price', labels.lineTotal ?? 'Line total', labels.currency ?? 'Currency'],
    ...order.lines.map((line) => [line.description, line.quantity, line.unitPrice, Number(line.totalMinor) / (10 ** order.digits), order.currency]), [],
    [labels.subtotal ?? 'Subtotal', Number(order.subtotalMinor) / (10 ** order.digits), order.currency],
    [labels.tax ?? 'Tax', order.taxPercent, Number(order.taxMinor) / (10 ** order.digits), order.currency],
    [labels.shipping ?? 'Shipping', Number(order.shippingMinor) / (10 ** order.digits), order.currency],
    [labels.total ?? 'Total', Number(order.totalMinor) / (10 ** order.digits), order.currency],
    [labels.paymentTerms ?? 'Payment terms', order.paymentTerms], [labels.deliveryTerms ?? 'Delivery terms', order.deliveryTerms], [labels.notes ?? 'Notes', order.notes],
  ];
  return rows.map((row) => row.map(quote).join(',')).join('\r\n');
}
