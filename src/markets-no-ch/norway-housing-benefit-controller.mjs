import { estimateNorwayHousingBenefit } from './norway-housing-benefit.mjs';

const root = document.querySelector('[data-housing-benefit-tool]');
if (root) {
  const fields = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const amount = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  $('[data-housing-calculate]').addEventListener('click', () => {
    try {
      const result = estimateNorwayHousingBenefit({
        monthlyIncomeBasisNok: Number($('#housing-income').value),
        monthlyApprovedHousingCostsNok: Number($('#housing-costs').value),
        adults: Number($('#housing-adults').value),
        minors: Number($('#housing-minors').value),
        municipalityGroup: $('#housing-municipality').value,
      });
      $('[data-housing-result]').innerHTML = `<h3>${escape(fields.resultHeading)}</h3><dl>${amount(fields.estimate, result.estimatedMonthlyBenefitNok)}${amount(fields.incomeBasis, result.householdMonthlyIncomeNok)}<div><dt>${escape(fields.weight)}</dt><dd>${escape(result.householdWeight.toFixed(2))}</dd></div>${amount(fields.weightedMonthlyIncome, result.weightedMonthlyIncomeNok)}${amount(fields.ownContribution, result.ownContributionMonthlyNok)}${amount(fields.housingCosts, result.monthlyApprovedHousingCostsNok)}${amount(fields.housingCap, result.annualHousingCapNok / 12)}${amount(fields.costsUsed, result.approvedHousingCostsUsedMonthlyNok)}${amount(fields.difference, result.eligibleDifferenceMonthlyNok)}<div><dt>${escape(fields.coverage)}</dt><dd>${escape(new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(result.coverageRate))}</dd></div></dl><p>${escape(fields.modelNote)}</p><p>${escape(fields.statusCalculated)}</p>`;
      $('[data-housing-result]').hidden = false;
      $('[data-housing-status]').textContent = fields.statusCalculated;
    } catch {
      $('[data-housing-result]').hidden = true;
      $('[data-housing-status]').textContent = fields.statusError;
    }
  });
  $('[data-housing-clear]').addEventListener('click', () => {
    $('#housing-income').value = '18000';
    $('#housing-costs').value = '8000';
    $('#housing-adults').value = '1';
    $('#housing-minors').value = '0';
    $('#housing-municipality').value = 'standard';
    $('[data-housing-result]').hidden = true;
    $('[data-housing-status]').textContent = fields.statusCleared;
  });
}
