import { estimateNorwayEmployerCost } from './norway-employer-cost.mjs';

const root = document.querySelector('[data-market-tool="norwayEmployerCost"]');
if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const value = (selector) => Number($(selector).value);
  const formatNok = new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });
  const formatPct = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 2 });
  const showAllowance = () => { $('[data-employer-allowance]').hidden = $('#employer-zone').value !== 'Ia' || $('#employer-sector').value !== 'ordinary'; };
  const estimate = (prefix = 'employer-') => estimateNorwayEmployerCost({
    annualPayrollNok: value(`#${prefix}payroll`), holidayPayBaseNok: value(`#${prefix}holiday-base`),
    holidayPayRatePct: value(`#${prefix}holiday-rate`), taxableOtherPayNok: value(`#${prefix}taxable-pay`),
    pensionablePayrollNok: value(`#${prefix}pension-base`), pensionRatePct: value(`#${prefix}pension-rate`),
    otherEmployerCostsNok: value(`#${prefix}other-costs`), zone: $('#employer-zone').value, sector: $('#employer-sector').value,
    differentialAllowanceUsedNok: $('#employer-zone').value === 'Ia' && $('#employer-sector').value === 'ordinary' ? value('#employer-allowance-used') : 0,
  });
  const update = () => {
    showAllowance();
    try {
      const offerA = estimate();
      const offerB = $('[data-employer-offer-b]').hidden ? null : estimate('employer-b-');
      const lines = [
        [f.payrollResult, 'annualPayrollNok'], [f.holidayResult, 'holidayPayNok'],
        [f.taxableResult, 'taxableOtherPayNok'], [f.pensionResult, 'pensionContributionNok'],
        [f.contributionBasisResult, 'contributionBasisNok'], [f.contributionResult, 'employerContributionNok'],
        [f.costsResult, 'otherEmployerCostsNok'], [f.totalResult, 'totalEmployerCostNok'],
        [f.monthlyResult, 'costPerMonthNok'],
      ];
      const allowance = (result) => result.zone === 'Ia' && result.sector === 'ordinary'
        ? `<p><strong>${escapeHtml(f.allowanceResult)}:</strong> ${formatNok.format(result.allowanceConsumedNok)} · <strong>${escapeHtml(f.allowanceRemaining)}:</strong> ${formatNok.format(Math.max(0, 850000 - result.allowanceUsedAfterNok))}</p>` : '';
      const details = (result) => `<dl>${lines.map(([label, key]) => `<div><dt>${escapeHtml(label)}</dt><dd>${formatNok.format(result[key])}</dd></div>`).join('')}</dl><p>${escapeHtml(f.effectiveRate)}: ${formatPct.format(result.effectiveEmployerContributionRatePct)}%</p>${allowance(result)}`;
      const comparison = offerB ? `<h3>${escapeHtml(f.comparisonHeading)}</h3><div class="table-scroll"><table><thead><tr><th scope="col">${escapeHtml(f.resultHeading)}</th><th scope="col">${escapeHtml(f.offerAHeading)}</th><th scope="col">${escapeHtml(f.offerBHeading)}</th><th scope="col">${escapeHtml(f.difference)}</th></tr></thead><tbody>${lines.map(([label, key]) => `<tr><th scope="row">${escapeHtml(label)}</th><td>${formatNok.format(offerA[key])}</td><td>${formatNok.format(offerB[key])}</td><td>${formatNok.format(offerB[key] - offerA[key])}</td></tr>`).join('')}<tr><th scope="row">${escapeHtml(f.effectiveRate)}</th><td>${formatPct.format(offerA.effectiveEmployerContributionRatePct)}%</td><td>${formatPct.format(offerB.effectiveEmployerContributionRatePct)}%</td><td>${formatPct.format(offerB.effectiveEmployerContributionRatePct - offerA.effectiveEmployerContributionRatePct)} pp</td></tr></tbody></table></div><h4>${escapeHtml(f.offerAHeading)}</h4>${details(offerA)}<h4>${escapeHtml(f.offerBHeading)}</h4>${details(offerB)}` : `<h3>${escapeHtml(f.resultHeading)}</h3>${details(offerA)}`;
      $('[data-employer-result]').innerHTML = `${comparison}<p>${escapeHtml(f.year)}: ${offerA.taxYear} · ${escapeHtml(f.sourceDate)}: ${offerA.sourcedOn}</p>`;
      $('[data-employer-result]').hidden = false;
      $('[data-employer-status]').textContent = f.ready;
    } catch {
      $('[data-employer-result]').hidden = true;
      $('[data-employer-status]').textContent = f.error;
    }
  };
  $('[data-employer-calculate]').addEventListener('click', update);
  $('[data-employer-toggle-compare]').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const offerB = $('[data-employer-offer-b]');
    offerB.hidden = !offerB.hidden;
    button.setAttribute('aria-expanded', String(!offerB.hidden));
    if (!offerB.hidden) for (const field of ['payroll', 'holiday-base', 'holiday-rate', 'taxable-pay', 'pension-base', 'pension-rate', 'other-costs']) $(`#employer-b-${field}`).value = $(`#employer-${field}`).value;
  });
  $('#employer-zone').addEventListener('change', showAllowance);
  $('#employer-sector').addEventListener('change', showAllowance);
  $('[data-employer-clear]').addEventListener('click', () => {
    root.querySelectorAll('input[type="number"]').forEach((input) => { input.value = input.defaultValue; });
    $('#employer-zone').value = 'I'; $('#employer-sector').value = 'ordinary';
    $('[data-employer-result]').hidden = true; $('[data-employer-status]').textContent = f.ready; showAllowance();
  });
  showAllowance();
}
