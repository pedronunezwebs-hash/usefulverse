import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateStockProfit } from './logic.mjs';

const root = document.querySelector('[data-tool="stock-profit-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const lotCount = form.elements.namedItem('lotCount');
  let summary = '';
  const locale = () => document.documentElement.lang || 'en';
  const parse = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());

  function clear() { clearResult(root); content.replaceChildren(); summary = ''; }
  function syncLots() {
    const count = Number(lotCount.value);
    for (const row of root.querySelectorAll('[data-stock-lot]')) {
      const hidden = Number(row.dataset.index) > count;
      row.hidden = hidden;
      for (const input of row.querySelectorAll('input')) input.disabled = hidden;
    }
  }
  function readInput() {
    const lots = Array.from({ length: Number(lotCount.value) }, (_, index) => {
      const number = index + 1;
      return { quantity: parse(`quantity${number}`), price: parse(`purchasePrice${number}`), fee: parse(`purchaseFee${number}`) };
    });
    return { lots, sharesSold: parse('sharesSold'), salePrice: parse('salePrice'), saleFee: parse('saleFee'), method: form.elements.namedItem('method').value, currency: form.elements.namedItem('currencyCode').value };
  }
  const format = (value) => numberFormat(locale(), value, 2);
  function money(value, currency) {
    try { return new Intl.NumberFormat(locale(), { style: 'currency', currency, currencyDisplay: 'code', maximumFractionDigits: 2 }).format(value); }
    catch { return `${format(value)} ${currency}`; }
  }
  function calculate(event) {
    event?.preventDefault();
    clear();
    try {
      const estimate = calculateStockProfit(readInput());
      const currency = estimate.currency;
      const rows = [
        [copy.fields.sharesOwned, format(estimate.sharesOwned)],
        [copy.fields.sharesRemaining, format(estimate.remainingShares)],
        [copy.fields.purchaseCost, money(estimate.totalCost, currency)],
        [copy.fields.costBasis, money(estimate.costBasis, currency)],
        [copy.fields.grossProceeds, money(estimate.grossProceeds, currency)],
        [copy.fields.netProceeds, money(estimate.netProceeds, currency)],
        [copy.fields.realizedProfit, money(estimate.profit, currency)],
        ...(estimate.returnPercent === null ? [] : [[copy.fields.returnPercent, `${format(estimate.returnPercent)}%`]]),
        [copy.fields.averageCostPerShare, money(estimate.averageCostPerShare, currency)],
        [copy.fields.remainingBasis, money(estimate.remainingCostBasis, currency)],
        [copy.fields.breakevenSalePrice, money(estimate.breakevenSalePrice, currency)],
      ];
      showRows(root, rows);
      summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  lotCount.addEventListener('change', () => { syncLots(); clear(); announce(root, ''); });
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { syncLots(); clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    lotCount.value = '1';
    form.elements.namedItem('currencyCode').value = 'USD';
    form.elements.namedItem('method').value = 'average';
    form.elements.namedItem('sharesSold').value = '10';
    form.elements.namedItem('salePrice').value = '30';
    form.elements.namedItem('saleFee').value = '0';
    form.elements.namedItem('quantity1').value = '10';
    form.elements.namedItem('purchasePrice1').value = '20';
    form.elements.namedItem('purchaseFee1').value = '0';
    syncLots(); calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
  syncLots();
}
