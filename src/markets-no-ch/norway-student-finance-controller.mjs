import { estimateNorwayStudentFinance } from './norway-student-finance.mjs';

const root = document.querySelector('[data-student-finance-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const f = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const amount = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  $('[data-student-calculate]').addEventListener('click', () => {
    const required = ['basis-loan', 'support-months', 'income', 'assets', 'passed-credits', 'supported-credits'];
    const repaymentFields = ['other-debt', 'annual-rate', 'repayment-years'];
    const repaymentValues = repaymentFields.map((id) => $(`#student-${id}`).value.trim());
    const repaymentEnabled = repaymentValues.every((value) => value !== '');
    if (required.some((id) => $(`#student-${id}`).value.trim() === '') || (!repaymentEnabled && repaymentValues.some((value) => value !== ''))) {
      $('[data-student-result]').hidden = true;
      $('[data-student-status]').textContent = f.error;
      return;
    }
    try {
      const result = estimateNorwayStudentFinance({
        eligibleBasisLoanNok: Number($('#student-basis-loan').value),
        supportMonthsInCalendarYear: Number($('#student-support-months').value),
        personalAndCapitalIncomeNok: Number($('#student-income').value),
        netAssetsNok: Number($('#student-assets').value),
        passedCredits: Number($('#student-passed-credits').value),
        supportedCredits: Number($('#student-supported-credits').value),
        completedEligibleDegree: $('#student-degree').checked,
        qualifiesAsLivingAwayFromParents: $('#student-away').checked,
        sharedFamilyAssets: $('#student-shared-assets').checked,
        additionalNonConvertibleDebtNok: repaymentEnabled ? Number(repaymentValues[0]) : 0,
        repaymentAnnualRatePct: repaymentEnabled ? Number(repaymentValues[1]) : 0,
        repaymentYears: repaymentEnabled ? Number(repaymentValues[2]) : 20,
      });
      const output = $('[data-student-result]');
      output.innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${amount(f.grant, result.estimatedGrantNok)}${amount(f.eligibleGrant, result.academicEligibleGrantNok)}${amount(f.incomeReduction, result.incomeReductionNok)}${amount(f.assetReduction, result.assetReductionNok)}${amount(f.incomeLimit, result.incomeLimitNok)}${amount(f.assetLimit, result.assetsLimitNok)}${amount(f.remainingLoan, result.remainingBasisLoanNok)}${repaymentEnabled ? amount(f.monthlyRepayment, result.estimatedMonthlyRepaymentNok) : ''}<div><dt>${escape(f.progress)}</dt><dd>${escape(`${result.passedCredits} / ${result.supportedCredits} (${new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(result.creditProgressRate)})`)}</dd></div></dl><p>${escape(f.formulaNote)}</p>${repaymentEnabled ? `<p>${escape(f.repaymentNote)}</p>` : ''}<p>${escape(f.calculated)}</p>`;
      output.hidden = false;
      $('[data-student-status]').textContent = f.calculated;
    } catch {
      $('[data-student-result]').hidden = true;
      $('[data-student-status]').textContent = f.error;
    }
  });
  $('[data-student-clear]').addEventListener('click', () => {
    ['basis-loan', 'support-months', 'income', 'assets', 'passed-credits', 'supported-credits', 'other-debt', 'annual-rate', 'repayment-years'].forEach((field) => { $(`#student-${field}`).value = ''; });
    ['degree', 'away', 'shared-assets'].forEach((field) => { $(`#student-${field}`).checked = false; });
    $('[data-student-result]').hidden = true;
    $('[data-student-status]').textContent = f.cleared;
  });
}
