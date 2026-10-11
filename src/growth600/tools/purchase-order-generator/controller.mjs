import { announce, readToolCopy } from '../controller-helpers.mjs';
import { createPurchaseOrder, formatPurchaseOrderMoney, purchaseOrderToCsv } from './logic.mjs';

const root = document.querySelector('[data-tool="purchase-order-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const result = root.querySelector('[data-result]');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  let order = null;

  function text(parent, tag, value, className = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = String(value ?? '');
    parent.append(node);
    return node;
  }

  function field(name) { return form.elements.namedItem(name)?.value ?? ''; }

  function localIsoDate(value = new Date()) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  }

  function collect() {
    const lines = field('items').split(/\r?\n/u).map((line) => line.trim()).filter(Boolean).map((line, index) => {
      const parts = line.split('|').map((part) => part.trim());
      if (parts.length !== 3) throw new TypeError(`Item ${index + 1}: use description | quantity | unit price.`);
      return { description: parts[0], quantity: parts[1], unitPrice: parts[2] };
    });
    return {
      number: field('number'), issuedDate: field('issuedDate'), deliveryDate: field('deliveryDate'), currency: field('currency'),
      buyer: field('buyer'), buyerAddress: field('buyerAddress'), supplier: field('supplier'), supplierAddress: field('supplierAddress'),
      paymentTerms: field('paymentTerms'), deliveryTerms: field('deliveryTerms'), notes: field('notes'),
      taxPercent: field('taxPercent'), shipping: field('shipping'), lines,
    };
  }

  function render() {
    const panel = root.querySelector('[data-purchase-order-preview]');
    panel.replaceChildren();
    const metadata = document.createElement('dl');
    for (const [label, value] of [
      [copy.fields.purchaseOrderNumber, order.number], [copy.fields.issueDate, order.issuedDate], [copy.fields.deliveryDate, order.deliveryDate],
      [copy.fields.buyer, order.buyer], [copy.fields.buyerAddress, order.buyerAddress], [copy.fields.supplier, order.supplier], [copy.fields.supplierAddress, order.supplierAddress],
    ]) {
      if (!value) continue;
      text(metadata, 'dt', label); text(metadata, 'dd', value);
    }
    panel.append(metadata);
    const scroll = document.createElement('div'); scroll.className = 'purchase-order-table-scroll';
    const table = document.createElement('table');
    const head = table.createTHead().insertRow();
    for (const label of [copy.fields.description, copy.fields.quantity, copy.fields.unitPrice, copy.fields.lineTotal]) text(head, 'th', label);
    const body = table.createTBody();
    for (const line of order.lines) {
      const row = body.insertRow();
      text(row, 'td', line.description); text(row, 'td', line.quantity); text(row, 'td', formatPurchaseOrderMoney(line.totalMinor === 0 ? 0 : Math.round(line.unitPrice * 10 ** order.digits), order, locale));
      text(row, 'td', formatPurchaseOrderMoney(line.totalMinor, order, locale));
    }
    scroll.append(table); panel.append(scroll);
    const totals = document.createElement('dl'); totals.className = 'purchase-order-totals';
    const totalRows = [
      [copy.fields.subtotal, order.subtotalMinor], [copy.fields.tax, order.taxMinor], [copy.fields.shippingLabel, order.shippingMinor], [copy.fields.total, order.totalMinor],
    ];
    for (const [label, value] of totalRows) { text(totals, 'dt', label); text(totals, 'dd', formatPurchaseOrderMoney(value, order, locale)); }
    panel.append(totals);
    for (const [label, value] of [[copy.fields.paymentTerms, order.paymentTerms], [copy.fields.deliveryTerms, order.deliveryTerms], [copy.fields.notes, order.notes]]) {
      if (value) { text(panel, 'h3', label); text(panel, 'p', value); }
    }
    result.hidden = false;
  }

  function build() {
    try {
      order = createPurchaseOrder(collect(), { locale });
      render(); announce(root, copy.messages.ready, 'success'); return true;
    } catch {
      announce(root, copy.messages.invalid, 'error'); return false;
    }
  }

  function printableContent() {
    const wrapper = document.createElement('main');
    const heading = document.createElement('h1'); heading.textContent = copy.name; wrapper.append(heading);
    wrapper.append(root.querySelector('[data-purchase-order-preview]').cloneNode(true));
    return wrapper;
  }

  function printOrder() {
    if (!order) { announce(root, copy.messages.createFirst, 'error'); return; }
    const printWindow = window.open('', '_blank');
    if (!printWindow) { announce(root, copy.messages.printBlocked, 'error'); return; }
    const doc = printWindow.document;
    doc.documentElement.lang = locale; doc.documentElement.dir = document.documentElement.dir || 'ltr';
    const title = doc.createElement('title'); title.textContent = `${copy.name} ${order.number}`;
    const style = doc.createElement('style'); style.textContent = 'body{font:11pt/1.5 system-ui,sans-serif;color:#111;margin:16mm}h1,h2,h3{margin:0 0 4mm}dl{display:grid;grid-template-columns:1fr 2fr;gap:2mm 5mm}dt{font-weight:700}dd{margin:0;white-space:pre-wrap}table{border-collapse:collapse;width:100%;margin:4mm 0}th,td{border:1px solid #888;padding:2mm;text-align:start;overflow-wrap:anywhere}.purchase-order-totals{max-width:100mm;margin-inline-start:auto}@page{size:A4;margin:12mm}';
    doc.head.replaceChildren(title, style); doc.body.replaceChildren(printableContent());
    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    printWindow.focus(); setTimeout(() => printWindow.print(), 100);
  }

  form.elements.namedItem('issuedDate').value = localIsoDate();
  form.addEventListener('submit', (event) => { event.preventDefault(); build(); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    const date = new Date(); const delivery = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
    form.elements.namedItem('number').value = 'PO-1042'; form.elements.namedItem('issuedDate').value = localIsoDate(date); form.elements.namedItem('deliveryDate').value = localIsoDate(delivery);
    form.elements.namedItem('currency').value = 'USD'; form.elements.namedItem('buyer').value = 'Northwind Office'; form.elements.namedItem('buyerAddress').value = '10 Market Street';
    form.elements.namedItem('supplier').value = 'Contoso Paper'; form.elements.namedItem('supplierAddress').value = '2 Mill Road';
    form.elements.namedItem('items').value = 'Copy paper | 2 | 12.50\nInk cartridge | 3 | 7.25';
    form.elements.namedItem('taxPercent').value = '8'; form.elements.namedItem('shipping').value = '4.50';
    form.elements.namedItem('paymentTerms').value = 'Net 30'; form.elements.namedItem('deliveryTerms').value = 'Deliver to receiving desk'; form.elements.namedItem('notes').value = 'Call before delivery.';
    build(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
    setTimeout(() => { order = null; result.hidden = true; root.querySelector('[data-purchase-order-preview]').replaceChildren(); form.elements.namedItem('issuedDate').value = localIsoDate(); announce(root, copy.messages.cleared); }, 0);
  });
  root.querySelector('[data-action="downloadCsv"]')?.addEventListener('click', () => {
    if (!order) { announce(root, copy.messages.createFirst, 'error'); return; }
    try {
      const blob = new Blob([`\uFEFF${purchaseOrderToCsv(order, { purchaseOrder: copy.fields.purchaseOrderNumber, issueDate: copy.fields.issueDate, deliveryDate: copy.fields.deliveryDate, buyer: copy.fields.buyer, buyerAddress: copy.fields.buyerAddress, supplier: copy.fields.supplier, supplierAddress: copy.fields.supplierAddress, description: copy.fields.description, quantity: copy.fields.quantity, unitPrice: copy.fields.unitPrice, lineTotal: copy.fields.lineTotal, currency: copy.fields.currency, subtotal: copy.fields.subtotal, tax: copy.fields.tax, shipping: copy.fields.shippingLabel, total: copy.fields.total, paymentTerms: copy.fields.paymentTerms, deliveryTerms: copy.fields.deliveryTerms, notes: copy.fields.notes })}`], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'purchase-order.csv'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); announce(root, copy.messages.downloaded, 'success');
    } catch { announce(root, copy.messages.downloadFailed, 'error'); }
  });
  root.querySelector('[data-action="print"]')?.addEventListener('click', printOrder);
}
