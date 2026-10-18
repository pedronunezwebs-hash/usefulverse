import { calculateNorwayUnemploymentBenefit, norwayUnemploymentBenefitRules2026 } from './norway-unemployment-benefit.mjs';

const root = document.querySelector('[data-market-tool="norwayUnemploymentBenefit"]');
if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const locale = document.documentElement.lang || 'en';
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const ids = ['minimumIncomeLast12MonthsNok','minimumIncomeLast36MonthsNok','benefitIncomeLast12MonthsNok','benefitIncomeLast36MonthsNok','durationIncomeLast12MonthsNok','durationIncomeLast36MonthsNok','workHoursLostPct','supportedEligibleChildren','militaryServiceMonths'];
  const value = (name) => Number(root.querySelector(`#${name}`).value);
  $('[data-unemployment-calculate]').addEventListener('click', () => {
    try {
      const result = calculateNorwayUnemploymentBenefit({
        ...Object.fromEntries(ids.map((id) => [id, value(id)])),
        under67: $('#unemployment-under67').checked,
        norwegianResidenceAndInsurance: $('#unemployment-residence').checked,
        registeredAndGenuineJobSeeker: $('#unemployment-job-seeker').checked,
        recentlyDischargedMilitary: $('#unemployment-military').checked,
      });
      const row = (label, amount) => `<div><dt>${escape(label)}</dt><dd>${escape(money.format(amount))}</dd></div>`;
      const conditionLabels = { incomeThreshold: f.threshold, lostAtLeastHalfHours: f.lostHours, under67: f.under67, norwegianResidenceAndInsurance: f.residence, registeredAndGenuineJobSeeker: f.jobSeeker };
      const conditions = Object.entries(result.selfReportedConditions).map(([name, applies]) => `<li>${escape(conditionLabels[name] ?? name)}: ${escape(applies ? f.yes : f.no)}</li>`).join('');
      $('[data-unemployment-result]').innerHTML = `<h3>${escape(f.resultHeading)}</h3><dl>${row(f.daily, result.dailyTotalEstimateNok)}${row(f.weekly, result.weeklyEstimateNok)}${row(f.monthly, result.monthlyEquivalentEstimateNok)}${row(f.annual, result.estimatedAnnualNok)}${row(f.childDaily, result.dailyChildSupplementNok)}${row(f.basis, result.benefitBasisNok)}${row(f.deductible, result.firstPaymentDeductibleNok)}</dl><p>${escape(f.duration)}: ${escape(String(result.durationWeeks))} ${escape(f.weeks)}</p><h4>${escape(f.conditions)}</h4><ul>${conditions}</ul><p>${escape(f.notDecision)}</p>`;
      $('[data-unemployment-result]').hidden = false;
      $('[data-unemployment-status]').textContent = f.rateNote;
    } catch {
      $('[data-unemployment-result]').hidden = true;
      $('[data-unemployment-status]').textContent = f.error;
    }
  });
  $('[data-unemployment-clear]').addEventListener('click', () => {
    ids.forEach((id) => { const input = root.querySelector(`#${id}`); input.value = id === 'workHoursLostPct' ? '100' : '0'; });
    ['unemployment-under67','unemployment-residence','unemployment-job-seeker','unemployment-military'].forEach((id) => { root.querySelector(`#${id}`).checked = false; });
    $('[data-unemployment-result]').hidden = true;
    $('[data-unemployment-status]').textContent = f.ready;
  });
  root.querySelector('[data-unemployment-rules]').textContent = `${f.rateNote} ${f.cap}: ${money.format(norwayUnemploymentBenefitRules2026.maximumBasisNok)}.`;
}
