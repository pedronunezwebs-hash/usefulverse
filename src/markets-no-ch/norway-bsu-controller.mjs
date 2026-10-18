import { estimateNorwayBsu } from './norway-bsu.mjs';

const root = document.querySelector('[data-bsu-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const amount = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  $('[data-bsu-calculate]').addEventListener('click', () => {
    const required = ['age', 'prior-deposits', 'already-deposited', 'planned-deposit', 'tax-capacity', 'account-balance'];
    const projectionFields = ['ordinary-balance', 'projection-years', 'bsu-rate', 'ordinary-rate'];
    const projectionValues = projectionFields.map((id) => $(`#bsu-${id}`).value.trim());
    const projectionEnabled = projectionValues.every((value) => value !== '');
    if (required.some((id) => $(`#bsu-${id}`).value.trim() === '') || (!projectionEnabled && projectionValues.some((value) => value !== ''))) {
      $('[data-bsu-result]').hidden = true;
      $('[data-bsu-status]').textContent = f.error;
      return;
    }
    try {
      const result = estimateNorwayBsu({
        ageAtIncomeYearEnd: Number($('#bsu-age').value),
        priorTotalDepositsNok: Number($('#bsu-prior-deposits').value),
        alreadyDepositedThisYearNok: Number($('#bsu-already-deposited').value),
        plannedDepositNok: Number($('#bsu-planned-deposit').value),
        availableTaxForDeductionNok: Number($('#bsu-tax-capacity').value),
        existingBsuAccountBalanceNok: Number($('#bsu-account-balance').value),
        ownsResidentialPropertyAtYearEnd: $('#bsu-owns-home').checked,
        withdrewBsuFundsThisYear: $('#bsu-withdrawal').checked,
        eligibleBsuAccount: $('#bsu-eligible-account').checked,
        ordinaryAccountBalanceNok: projectionEnabled ? Number(projectionValues[0]) : 0,
        projectionYears: projectionEnabled ? Number(projectionValues[1]) : 0,
        bsuAnnualRatePct: projectionEnabled ? Number(projectionValues[2]) : null,
        ordinaryAnnualRatePct: projectionEnabled ? Number(projectionValues[3]) : null,
      });
      const output = $('[data-bsu-result]');
      const projectionRows = result.projectionYears > 0 ? `${amount(f.projectedBsu, result.projectedBsuBalanceNok)}${amount(f.projectedOrdinary, result.projectedOrdinaryBalanceNok)}` : '';
      const projectionNote = result.projectionYears > 0 ? `<p>${escape(f.projectionNote)}</p>` : '';
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${amount(f.acceptedDeposit, result.depositAcceptedNok)}${amount(f.excessDeposit, result.plannedDepositAboveLimitsNok)}${amount(f.remainingAnnual, result.remainingAnnualRoomNok)}${amount(f.remainingLifetime, result.remainingLifetimeRoomNok)}${amount(f.nominalTax, result.nominalDeductionNok)}${amount(f.actualTax, result.effectiveDeductionNok)}${amount(f.unusedTax, result.unusedDeductionNok)}${amount(f.endBalance, result.endingBsuBalanceNok)}<div><dt>${escape(f.eligibility)}</dt><dd>${escape(result.deductionConditionsMet ? f.yes : f.no)}</dd></div>${projectionRows}</dl>${projectionNote}<p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-bsu-status]').textContent = f.calculated;
    } catch {
      $('[data-bsu-result]').hidden = true;
      $('[data-bsu-status]').textContent = f.error;
    }
  });
  $('[data-bsu-clear]').addEventListener('click', () => {
    ['age', 'prior-deposits', 'already-deposited', 'planned-deposit', 'tax-capacity', 'account-balance', 'ordinary-balance', 'projection-years', 'bsu-rate', 'ordinary-rate'].forEach((id) => { $(`#bsu-${id}`).value = ''; });
    ['owns-home', 'withdrawal', 'eligible-account'].forEach((id) => { $(`#bsu-${id}`).checked = false; });
    $('[data-bsu-result]').hidden = true;
    $('[data-bsu-status]').textContent = f.cleared;
  });
}
