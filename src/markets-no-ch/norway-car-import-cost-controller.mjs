import { estimateNorwayCarImportCost } from './norway-car-import-cost.mjs';

const root = document.querySelector('[data-car-import-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const invalidate = () => { $('[data-car-import-result]').hidden = true; };
  root.addEventListener('input', invalidate);
  root.addEventListener('change', invalidate);
  $('[data-car-import-calculate]').addEventListener('click', () => {
    const required = ['currency', 'exchange-rate', 'purchase-price', 'vat-rate', 'one-off-tax', 'scrap-tax', 'greenhouse-tax', 'other-fees'];
    if (required.some((id) => $(`#car-import-${id}`).value.trim() === '')) {
      $('[data-car-import-result]').hidden = true;
      $('[data-car-import-status]').textContent = f.error;
      return;
    }
    try {
      const local = $('#car-import-local-price').value.trim();
      const result = estimateNorwayCarImportCost({
        currencyCode: $('#car-import-currency').value.trim(),
        exchangeRateToNok: Number($('#car-import-exchange-rate').value),
        purchasePrice: Number($('#car-import-purchase-price').value),
        shippingCost: Number($('#car-import-shipping').value),
        insuranceCost: Number($('#car-import-insurance').value),
        vatRatePct: Number($('#car-import-vat-rate').value),
        oneOffRegistrationTaxNok: Number($('#car-import-one-off-tax').value),
        scrapDepositTaxNok: Number($('#car-import-scrap-tax').value),
        greenhouseGasTaxNok: Number($('#car-import-greenhouse-tax').value),
        otherFeesNok: Number($('#car-import-other-fees').value),
        comparableNorwayPriceNok: local === '' ? null : Number(local),
      });
      const money = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 });
      const row = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
      const comparison = result.comparableNorwayPriceNok === null ? '' : `${row(f.comparablePrice, result.comparableNorwayPriceNok)}${row(f.difference, result.differenceVsNorwayPriceNok)}`;
      const output = $('[data-car-import-result]');
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${row(f.customsValue, result.customsValueNok)}${row(f.importVat, result.importVatNok)}${row(f.oneOffTaxResult, result.oneOffRegistrationTaxNok)}${row(f.scrapTaxResult, result.scrapDepositTaxNok)}${row(f.greenhouseTaxResult, result.greenhouseGasTaxNok)}${row(f.otherFeesResult, result.otherFeesNok)}${row(f.total, result.totalImportCostNok)}${comparison}</dl><p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-car-import-status]').textContent = f.calculated;
    } catch {
      $('[data-car-import-result]').hidden = true;
      $('[data-car-import-status]').textContent = f.error;
    }
  });
  $('[data-car-import-clear]').addEventListener('click', () => {
    $('#car-import-currency').value = 'NOK'; $('#car-import-exchange-rate').value = '1';
    $('#car-import-purchase-price').value = ''; $('#car-import-shipping').value = '0'; $('#car-import-insurance').value = '0';
    $('#car-import-vat-rate').value = '25'; $('#car-import-one-off-tax').value = '';
    $('#car-import-scrap-tax').value = '2400'; $('#car-import-greenhouse-tax').value = '0'; $('#car-import-other-fees').value = '0'; $('#car-import-local-price').value = '';
    $('[data-car-import-result]').hidden = true; $('[data-car-import-status]').textContent = f.cleared;
  });
}
