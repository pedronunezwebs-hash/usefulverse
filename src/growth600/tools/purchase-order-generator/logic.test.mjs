import assert from 'node:assert/strict';
import test from 'node:test';
import { createPurchaseOrder, formatPurchaseOrderMoney, purchaseOrderToCsv } from './logic.mjs';

const valid = {
  number: 'PO-1042', issuedDate: '2026-10-11', deliveryDate: '2026-10-18', currency: 'USD',
  buyer: 'Northwind Office', buyerAddress: '10 Market Street', supplier: 'Contoso Paper', supplierAddress: '2 Mill Road',
  paymentTerms: 'Net 30', deliveryTerms: 'Deliver to receiving desk', notes: 'Call before delivery.',
  lines: [{ description: 'Copy paper, A4', quantity: '2', unitPrice: '12.50' }, { description: 'Ink', quantity: '3', unitPrice: '7.25' }],
  taxPercent: '8', shipping: '4.50',
};

test('purchase order totals round each line in the selected currency, then tax and shipping', () => {
  const order = createPurchaseOrder(valid, { locale: 'en-US' });
  assert.deepEqual(order.lines.map(({ totalMinor }) => totalMinor), [2500, 2175]);
  assert.equal(order.subtotalMinor, 4675);
  assert.equal(order.taxMinor, 374);
  assert.equal(order.shippingMinor, 450);
  assert.equal(order.totalMinor, 5499);
  assert.equal(formatPurchaseOrderMoney(order.totalMinor, order, 'en-US'), '$54.99');
});

test('rounds fractional quantity and supports zero-decimal currencies', () => {
  const order = createPurchaseOrder({ ...valid, currency: 'JPY', taxPercent: '', shipping: '0', lines: [{ description: 'Part', quantity: '3', unitPrice: '120.5' }] });
  assert.equal(order.digits, 0);
  assert.equal(order.lines[0].totalMinor, 362);
  assert.equal(order.totalMinor, 362);
});

test('requires buyer, supplier, valid dates, currency and 1–50 complete line items', () => {
  assert.throws(() => createPurchaseOrder({ ...valid, buyer: '' }), /buyer/i);
  assert.throws(() => createPurchaseOrder({ ...valid, supplier: '' }), /supplier/i);
  assert.throws(() => createPurchaseOrder({ ...valid, issuedDate: '2026-02-30' }), /valid date/i);
  assert.throws(() => createPurchaseOrder({ ...valid, deliveryDate: '2026-10-10' }), /before the issue date/i);
  assert.throws(() => createPurchaseOrder({ ...valid, currency: 'ZZZ' }), /supported currency/i);
  assert.throws(() => createPurchaseOrder({ ...valid, lines: [] }), /1 to 50/i);
  assert.throws(() => createPurchaseOrder({ ...valid, lines: Array(51).fill(valid.lines[0]) }), /1 to 50/i);
  assert.throws(() => createPurchaseOrder({ ...valid, lines: [{ ...valid.lines[0], quantity: '0' }] }), /greater than zero/i);
  assert.throws(() => createPurchaseOrder({ ...valid, lines: [{ ...valid.lines[0], unitPrice: '-1' }] }), /non-negative number/i);
  assert.throws(() => createPurchaseOrder({ ...valid, taxPercent: '100.01' }), /above the supported limit/i);
  assert.throws(() => createPurchaseOrder({ ...valid, shipping: '1.1234567' }), /up to 6 decimal places/i);
});

test('CSV quotes Unicode and neutralizes spreadsheet formula-like text', () => {
  const order = createPurchaseOrder({ ...valid, buyer: '=HYPERLINK("x")', lines: [{ description: '+unsafe item', quantity: '1', unitPrice: '1' }, { description: 'Copy paper, A4', quantity: '1', unitPrice: '1' }] });
  const csv = purchaseOrderToCsv(order);
  assert.match(csv, /"'=HYPERLINK\(""x""\)"/u);
  assert.match(csv, /"'\+unsafe item"/u);
  assert.match(csv, /"Copy paper, A4"/u);
});
