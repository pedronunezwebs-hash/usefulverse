import { estimateNorwayChildSupport } from './norway-child-support.mjs';

const root = document.querySelector('[data-child-support-tool]');
if (root) {
  const fields = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const amount = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  const setResidenceState = () => { $('#child-support-visitation').disabled = $('#child-support-residence').value === 'shared'; };
  $('#child-support-residence').addEventListener('change', setResidenceState);
  $('[data-child-support-calculate]').addEventListener('click', () => {
    try {
      const result = estimateNorwayChildSupport({
        ageBand: Number($('#child-support-age').value),
        payerAnnualIncomeNok: Number($('#child-support-payer-income').value),
        otherParentAnnualIncomeNok: Number($('#child-support-other-income').value),
        childcareMonthlyNok: Number($('#child-support-childcare').value),
        childBenefitMonthlyNok: Number($('#child-support-child-benefit').value),
        residence: $('#child-support-residence').value,
        visitationClass: Number($('#child-support-visitation').value),
      });
      const payerLabel = result.isSharedResidenceOffset ? fields.sharedPayer : fields.payer;
      const visitationRow = result.isSharedResidenceOffset ? '' : amount(fields.visitationCredit, result.visitationCreditMonthlyNok);
      const explanation = result.isSharedResidenceOffset ? `<p>${escape(fields.sharedNote)}</p>` : '';
      $('[data-child-support-result]').innerHTML = `<h3>${escape(fields.resultHeading)}</h3><dl>${amount(fields.estimate, result.monthlyEstimateNok)}${amount(fields.annualEstimate, result.annualEstimateNok)}${amount(fields.cost, result.maintenanceCostMonthlyNok)}${amount(fields.consumption, result.consumptionMonthlyNok)}${amount(fields.housing, result.housingMonthlyNok)}${amount(fields.childcareCost, result.childcareMonthlyNok)}${amount(fields.childBenefitAmount, result.childBenefitMonthlyNok)}${amount(fields.payerShare, result.uncappedShareMonthlyNok)}${amount(fields.beforeVisitation, result.amountBeforeVisitationMonthlyNok)}${visitationRow}${amount(fields.costCap, result.costCapMonthlyNok)}${amount(fields.incomeCap, result.incomeCapMonthlyNok)}<div><dt>${escape(payerLabel)}</dt><dd>${escape(result.payer === 'otherParent' ? fields.otherParent : result.payer === 'equal' ? '—' : fields.payer)}</dd></div></dl>${explanation}<p>${escape(fields.statusCalculated)}</p>`;
      $('[data-child-support-result]').hidden = false;
      $('[data-child-support-status]').textContent = fields.statusCalculated;
    } catch {
      $('[data-child-support-result]').hidden = true;
      $('[data-child-support-status]').textContent = fields.statusError;
    }
  });
  $('[data-child-support-clear]').addEventListener('click', () => {
    $('#child-support-age').value = '1';
    $('#child-support-residence').value = 'oneHome';
    $('#child-support-payer-income').value = '600000';
    $('#child-support-other-income').value = '400000';
    $('#child-support-childcare').value = '0';
    $('#child-support-child-benefit').value = '2012';
    $('#child-support-visitation').value = '0';
    setResidenceState();
    $('[data-child-support-result]').hidden = true;
    $('[data-child-support-status]').textContent = fields.statusCleared;
  });
  setResidenceState();
}
