import { calculateNorwayCompanyCarBenefit } from './norway-company-car.mjs';

const root = document.querySelector('[data-market-tool="norwayCompanyCar"]');
if (root) {
  const fields = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const currency = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 2 });
  const number = (id) => Number($(id).value);
  const update = () => {
    try {
      const result = calculateNorwayCompanyCarBenefit({
        listPriceNewNok: number('#company-car-list-price'), monthsAvailable: number('#company-car-months'),
        olderThanThreeYearsOnJan1: $('#company-car-old').checked, documentedWorkKm: number('#company-car-work-km'),
        hasMileageLog: $('#company-car-log').checked, marginalTaxRatePct: number('#company-car-marginal-rate'),
        ownCarAnnualCostNok: number('#company-car-own-cost'),
      });
      const rows = [
        [fields.listPriceResult, currency.format(result.listPriceNewNok)],
        [fields.baseFactor, percent.format(result.baseFactor * 100) + '%'],
        [fields.reducedPrice, currency.format(result.reducedListPriceNok)],
        [fields.annualBenefit, currency.format(result.annualTaxableBenefitNok)],
        [fields.monthsResult, String(result.monthsAvailable)],
        [fields.taxableBenefit, currency.format(result.taxableBenefitNok)],
        [fields.monthlyBenefit, currency.format(result.taxableBenefitNok / result.monthsAvailable)],
        [fields.marginalRateResult, percent.format(result.marginalTaxRatePct) + '%'],
        [fields.personalTax, currency.format(result.estimatedPersonalTaxNok)],
        [fields.ownCostResult, currency.format(result.ownCarAnnualCostNok)],
        [fields.contextDifference, currency.format(result.contextDifferenceOwnCostMinusEstimatedTaxNok)],
      ];
      $('[data-company-car-result]').innerHTML = `<h3>${escape(fields.resultHeading)}</h3><dl>${rows.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl><p>${escape(fields.noFullTax)}</p><p>${escape(fields.comparisonNote)}</p><p>${escape(fields.mileageStatus)}</p><p>${escape(fields.year)}: ${result.taxYear} · ${escape(fields.sourceDate)}: ${escape(result.sourcedOn)}</p>`;
      $('[data-company-car-result]').hidden = false;
      $('[data-company-car-status]').textContent = fields.ready;
    } catch {
      $('[data-company-car-result]').hidden = true;
      $('[data-company-car-status]').textContent = fields.error;
    }
  };
  $('[data-company-car-calculate]').addEventListener('click', update);
  $('[data-company-car-clear]').addEventListener('click', () => {
    root.querySelectorAll('input').forEach((input) => { if (input.type === 'checkbox') input.checked = false; else input.value = input.defaultValue; });
    $('[data-company-car-result]').hidden = true;
    $('[data-company-car-status]').textContent = fields.ready;
  });
}
