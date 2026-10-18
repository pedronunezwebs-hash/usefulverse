import { estimateNorwayDisabilityBenefit } from './norway-disability-benefit.mjs';

const root = document.querySelector('[data-disability-tool]');
if (root) {
  const copy = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const fields = copy.fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const amountRow = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(value))}</dd></div>`;
  $('[data-disability-calculate]').addEventListener('click', () => {
    const incomeInputs = [1, 2, 3, 4, 5].map((index) => $(`#disability-income-${index}`).value.trim());
    const minimumInput = $('#disability-minimum').value.trim();
    if (incomeInputs.some((value) => value === '') || $('#disability-degree').value.trim() === '' || $('#disability-insurance-time').value.trim() === '') {
      $('[data-disability-result]').hidden = true;
      $('[data-disability-status]').textContent = fields.statusError;
      return;
    }
    try {
      const result = estimateNorwayDisabilityBenefit({
        adjustedPensionableIncomesNok: incomeInputs.map(Number),
        approvedDisabilityDegreePct: Number($('#disability-degree').value),
        approvedInsuranceTimePct: Number($('#disability-insurance-time').value),
        navConfirmedMinimumAnnualNok: minimumInput === '' ? null : Number(minimumInput),
      });
      const topThree = result.bestThreeIncomesNok.map((value) => money.format(value)).join(' · ');
      const output = $('[data-disability-result]');
      output.innerHTML = `<h3>${escape(fields.resultHeading)}</h3><dl>${amountRow(fields.annual, result.estimatedAnnualNok)}${amountRow(fields.monthly, result.estimatedMonthlyNok)}${amountRow(fields.average, result.averageBestThreeNok)}${amountRow(fields.cap, result.maximumIncomeBasisNok)}<div><dt>${escape(fields.topThree)}</dt><dd>${escape(topThree)}</dd></div><div><dt>${escape(fields.rate)}</dt><dd>${escape(new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(result.replacementRate))}</dd></div><div><dt>${escape(fields.degree)}</dt><dd>${escape(`${result.approvedDisabilityDegreePct}%`)}</dd></div><div><dt>${escape(fields.insurance)}</dt><dd>${escape(`${result.approvedInsuranceTimePct}%`)}</dd></div><div><dt>${escape(fields.minimumApplied)}</dt><dd>${escape(result.minimumApplied ? fields.yes : fields.no)}</dd></div></dl><p>${escape(fields.formulaNote)}</p><p>${escape(fields.statusCalculated)}</p>`;
      output.hidden = false;
      $('[data-disability-status]').textContent = fields.statusCalculated;
    } catch {
      $('[data-disability-result]').hidden = true;
      $('[data-disability-status]').textContent = fields.statusError;
    }
  });
  $('[data-disability-clear]').addEventListener('click', () => {
    [1, 2, 3, 4, 5].forEach((index) => { $(`#disability-income-${index}`).value = ''; });
    $('#disability-degree').value = '100';
    $('#disability-insurance-time').value = '100';
    $('#disability-minimum').value = '';
    $('[data-disability-result]').hidden = true;
    $('[data-disability-status]').textContent = fields.statusCleared;
  });
}
