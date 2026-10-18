import { estimateNorwayImportCost } from './norway-import-cost.mjs';

const root = document.querySelector('[data-import-cost-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const invalidate = () => { $('[data-import-result]').hidden = true; };
  root.addEventListener('input', invalidate);
  root.addEventListener('change', invalidate);
  $('[data-import-calculate]').addEventListener('click', () => {
    const required = ['currency', 'exchange-rate', 'purchase-price', 'shipping', 'insurance', 'other-taxes', 'carrier-fee', 'duty-rate', 'vat-rate'];
    if (required.some((id) => $(`#import-${id}`).value.trim() === '')) {
      $('[data-import-result]').hidden = true;
      $('[data-import-status]').textContent = f.error;
      return;
    }
    try {
      const result = estimateNorwayImportCost({
        currencyCode: $('#import-currency').value.trim(),
        exchangeRateToNok: Number($('#import-exchange-rate').value),
        purchasePrice: Number($('#import-purchase-price').value),
        shippingCost: Number($('#import-shipping').value),
        insuranceCost: Number($('#import-insurance').value),
        otherTaxes: Number($('#import-other-taxes').value),
        carrierFee: Number($('#import-carrier-fee').value),
        customsDutyRatePct: Number($('#import-duty-rate').value),
        vatRatePct: Number($('#import-vat-rate').value),
        voecAtCheckout: $('#import-voec-checkout').checked,
        voecEligibleGoods: $('#import-voec-eligible').checked,
      });
      const money = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 2 });
      const row = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
      const output = $('[data-import-result]');
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><div><dt>${escape(f.voecState)}</dt><dd>${escape(result.voecAtCheckout ? f.yes : f.no)}</dd></div>${row(f.purchaseNok, result.purchaseNok)}${row(f.customsValue, result.customsValueNok)}${row(f.duty, result.customsDutyNok)}${row(f.vatBase, result.vatBaseAtImportNok)}${row(f.importVat, result.importVatNok)}${row(f.checkoutVat, result.checkoutVatNok)}${row(f.carrierFeeResult, result.carrierFeeNok)}${row(f.arrivalCharges, result.arrivalChargesNok)}${row(f.totalLanded, result.totalLandedCostNok)}</dl><p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-import-status]').textContent = f.calculated;
    } catch {
      $('[data-import-result]').hidden = true;
      $('[data-import-status]').textContent = f.error;
    }
  });
  $('[data-import-clear]').addEventListener('click', () => {
    $('#import-currency').value = 'NOK';
    $('#import-exchange-rate').value = '1';
    $('#import-purchase-price').value = '';
    ['shipping', 'insurance', 'other-taxes', 'carrier-fee'].forEach((id) => { $(`#import-${id}`).value = '0'; });
    $('#import-duty-rate').value = '';
    $('#import-vat-rate').value = '25';
    $('#import-voec-checkout').checked = false; $('#import-voec-eligible').checked = false;
    $('[data-import-result]').hidden = true;
    $('[data-import-status]').textContent = f.cleared;
  });
}
