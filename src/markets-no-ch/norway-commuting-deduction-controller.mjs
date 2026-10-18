import { estimateNorwayCommutingDeduction } from './norway-commuting-deduction.mjs';

const root = document.querySelector('[data-commuting-deduction-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const money = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const row = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  $('[data-commuting-calculate]').addEventListener('click', () => {
    const ids = ['distance', 'days', 'home-office-days', 'tax-rate'];
    if (ids.some((id) => $(`#commuting-${id}`).value.trim() === '')) {
      $('[data-commuting-result]').hidden = true;
      $('[data-commuting-status]').textContent = f.error;
      return;
    }
    try {
      const result = estimateNorwayCommutingDeduction({
        oneWayDistanceKm: Number($('#commuting-distance').value),
        commutingDays: Number($('#commuting-days').value),
        extraHomeOfficeDays: Number($('#commuting-home-office-days').value),
        taxEffectRatePct: Number($('#commuting-tax-rate').value),
      });
      const output = $('[data-commuting-result]');
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl><div><dt>${escape(f.qualifying)}</dt><dd>${escape(result.distanceQualifies ? f.yes : f.no)}</dd></div>${row(f.distanceAmount, result.unboundedDistanceCostNok)}${row(f.cappedAmount, result.cappedTravelCostNok)}${row(f.threshold, result.lowerThresholdNok)}${row(f.deduction, result.deductibleAmountNok)}${row(f.estimatedTax, result.estimatedTaxEffectNok)}${row(f.remoteComparison, result.estimatedTaxEffectIfThoseDaysWereCommutedNok)}${row(f.remoteDifference, result.estimatedTaxEffectDifferenceNok)}</dl><p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-commuting-status]').textContent = f.calculated;
    } catch {
      $('[data-commuting-result]').hidden = true;
      $('[data-commuting-status]').textContent = f.error;
    }
  });
  $('[data-commuting-clear]').addEventListener('click', () => {
    ['distance', 'days', 'home-office-days', 'tax-rate'].forEach((id) => { $(`#commuting-${id}`).value = ''; });
    $('[data-commuting-result]').hidden = true;
    $('[data-commuting-status]').textContent = f.cleared;
  });
}
