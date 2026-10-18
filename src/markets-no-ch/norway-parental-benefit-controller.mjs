import { getNorwayParentalBenefitEntitlement } from './norway-parental-benefit.mjs';
import { createNorwayParentalPlanIcs, validateNorwayParentalCalendar } from './norway-parental-calendar.mjs';

const root = document.querySelector('[data-parental-tool]');
if (root) {
  const fields = JSON.parse(root.closest('[data-market-tool]')?.querySelector('[data-tool-copy]')?.textContent ?? '{}').fields ?? {};
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/gu, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const locale = document.documentElement.lang || 'en';
  let periods = [];
  let sequence = 0;
  let validation = null;
  const numeric = (value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
  const weekUnit = new Intl.NumberFormat(locale, { style: 'unit', unit: 'week', unitDisplay: 'long' });
  const dayUnit = new Intl.NumberFormat(locale, { style: 'unit', unit: 'day', unitDisplay: 'long' });
  const periodLength = (value) => `${weekUnit.format(Math.floor(value / 5))}, ${dayUnit.format(value % 5)}`;
  const scenario = () => ({
    eventType: $('#parental-event-type').value,
    eventDate: $('#parental-event-date').value,
    children: Number($('#parental-children').value),
    coveragePct: Number($('#parental-coverage').value),
  });
  const syncQuotaOptions = () => {
    const select = $('#parental-period-quota');
    if (!select) return;
    const isMother = $('#parental-period-parent').value === 'mother';
    const choices = [
      ...(isMother && $('#parental-event-type').value === 'birth' ? [['prenatal', fields.prenatal]] : []),
      ...(isMother ? [['mother', fields.motherQuota]] : [['otherParent', fields.otherParentQuota]]),
      ['shared', fields.sharedQuota],
    ];
    const selected = choices.some(([value]) => value === select.value) ? select.value : (isMother ? 'mother' : 'otherParent');
    select.replaceChildren(...choices.map(([value, label]) => new Option(label, value)));
    select.value = selected;
  };
  const renderComparison = () => {
    const input = scenario();
    if (!input.eventDate) { $('[data-parental-comparison]').innerHTML = ''; return; }
    const rows = [100, 80].map((coveragePct) => getNorwayParentalBenefitEntitlement({ ...input, coveragePct }));
    $('[data-parental-comparison]').innerHTML = `<div class="table-scroll"><table><thead><tr><th>${escape(fields.coverage)}</th><th>${escape(fields.comparisonTotal)}</th><th>${escape(fields.comparisonShared)}</th></tr></thead><tbody>${rows.map((entry) => `<tr><th>${entry.coveragePct}%</th><td>${escape(periodLength(entry.total.benefitDays))}</td><td>${escape(periodLength(entry.shared.benefitDays))}</td></tr>`).join('')}</tbody></table></div>`;
  };
  const renderPeriods = () => {
    const host = $('[data-parental-periods]');
    if (!periods.length) { host.textContent = fields.noPeriods; return; }
    host.innerHTML = `<div class="table-scroll"><table><thead><tr><th>${escape(fields.parentColumn)}</th><th>${escape(fields.quotaColumn)}</th><th>${escape(fields.datesColumn)}</th><th>${escape(fields.withdrawalColumn)}</th><th></th></tr></thead><tbody>${periods.map((entry) => `<tr><td>${escape(entry.parent === 'mother' ? fields.mother : fields.otherParent)}</td><td>${escape(({ prenatal: fields.prenatal, mother: fields.motherQuota, otherParent: fields.otherParentQuota, shared: fields.sharedQuota })[entry.quota])}</td><td>${escape(entry.startDate)} – ${escape(entry.endDate)}</td><td>${entry.withdrawalPct}%</td><td><button type="button" data-parental-remove="${escape(entry.id)}">${escape(fields.remove)}</button></td></tr>`).join('')}</tbody></table></div>`;
    host.querySelectorAll('[data-parental-remove]').forEach((button) => button.addEventListener('click', () => {
      periods = periods.filter(({ id }) => id !== button.dataset.parentalRemove);
      validation = null;
      $('[data-parental-export]').disabled = true;
      renderPeriods();
      $('[data-parental-status]').textContent = fields.statusRemoved;
    }));
  };
  const renderSummary = (entitlement, result) => {
    const row = (label, value) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`;
    const balance = Object.entries({ prenatal: fields.prenatalDays, mother: fields.motherDays, otherParent: fields.otherParentDays, shared: fields.sharedDays }).map(([key, label]) => row(label, `${numeric(result.used[key])} / ${numeric(entitlement[key === 'prenatal' ? 'prenatal' : key === 'mother' ? 'motherQuota' : key === 'otherParent' ? 'otherParentQuota' : 'shared'].benefitDays)} ${fields.days}`)).join('');
    const datedRows = result.periods.map((item) => `<tr><td>${escape(item.parent === 'mother' ? fields.mother : fields.otherParent)}</td><td>${escape(({ prenatal: fields.prenatal, mother: fields.motherQuota, otherParent: fields.otherParentQuota, shared: fields.sharedQuota })[item.quota])}</td><td>${escape(item.startDate)} – ${escape(item.endDate)}</td><td>${item.withdrawalPct}%</td><td>${numeric(item.benefitDays)} ${escape(fields.days)}</td></tr>`).join('');
    $('[data-parental-result]').innerHTML = `<h3>${escape(fields.resultHeading)}</h3><dl>${row(fields.totalEntitlement, periodLength(entitlement.total.benefitDays))}${row(fields.prenatalDays, periodLength(entitlement.prenatal.benefitDays))}${row(fields.motherDays, periodLength(entitlement.motherQuota.benefitDays))}${row(fields.otherParentDays, periodLength(entitlement.otherParentQuota.benefitDays))}${row(fields.sharedDays, periodLength(entitlement.shared.benefitDays))}${row(fields.totalRemaining, `${numeric(result.totalRemaining)} ${fields.days}`)}</dl><h4>${escape(fields.remainingHeading)}</h4><dl>${balance}</dl><h4>${escape(fields.periodHeading)}</h4>${datedRows ? `<div class="table-scroll"><table><thead><tr><th>${escape(fields.parentColumn)}</th><th>${escape(fields.quotaColumn)}</th><th>${escape(fields.datesColumn)}</th><th>${escape(fields.withdrawalColumn)}</th><th>${escape(fields.benefitDaysColumn)}</th></tr></thead><tbody>${datedRows}</tbody></table></div>` : `<p>${escape(fields.noPeriods)}</p>`}<p>${escape(fields.expiryRule)}</p><p>${escape(fields.sourceNav)}</p>`;
    $('[data-parental-result]').hidden = false;
  };
  $('#parental-event-type').addEventListener('change', () => { syncQuotaOptions(); renderComparison(); validation = null; $('[data-parental-export]').disabled = true; });
  $('#parental-period-parent').addEventListener('change', syncQuotaOptions);
  ['#parental-event-date', '#parental-children', '#parental-coverage'].forEach((selector) => $(selector).addEventListener('change', () => { try { renderComparison(); } catch { $('[data-parental-comparison]').textContent = fields.errorOldCohort; } validation = null; $('[data-parental-export]').disabled = true; }));
  $('[data-parental-add]').addEventListener('click', () => {
    const startDate = $('#parental-period-start').value;
    const endDate = $('#parental-period-end').value;
    if (!startDate || !endDate) { $('[data-parental-status]').textContent = fields.statusError; return; }
    periods.push({ id: `period-${++sequence}`, label: $('#parental-period-label').value, parent: $('#parental-period-parent').value, quota: $('#parental-period-quota').value, startDate, endDate, withdrawalPct: Number($('#parental-period-withdrawal').value) });
    validation = null;
    $('[data-parental-export]').disabled = true;
    renderPeriods();
    $('[data-parental-status]').textContent = fields.statusAdded;
  });
  $('[data-parental-check]').addEventListener('click', () => {
    try {
      const selected = scenario();
      const entitlement = getNorwayParentalBenefitEntitlement({ ...selected, bothParentsEligible: true });
      validation = validateNorwayParentalCalendar(entitlement, periods);
      renderComparison();
      renderSummary(entitlement, validation);
      $('[data-parental-status]').textContent = fields.statusUpdated;
      $('[data-parental-export]').disabled = periods.length === 0;
    } catch {
      validation = null;
      $('[data-parental-result]').hidden = true;
      $('[data-parental-export]').disabled = true;
      $('[data-parental-status]').textContent = fields.statusError;
    }
  });
  $('[data-parental-clear]').addEventListener('click', () => {
    periods = [];
    sequence = 0;
    validation = null;
    root.querySelectorAll('input[type="date"], input[type="text"]').forEach((input) => { input.value = ''; });
    $('#parental-coverage').value = '100';
    $('#parental-children').value = '1';
    $('#parental-event-type').value = 'birth';
    renderPeriods();
    $('[data-parental-result]').hidden = true;
    $('[data-parental-comparison]').innerHTML = '';
    $('[data-parental-export]').disabled = true;
    $('[data-parental-status]').textContent = fields.statusCleared;
  });
  $('[data-parental-export]').addEventListener('click', () => {
    if (!validation || periods.length === 0) return;
    const calendar = createNorwayParentalPlanIcs(validation, fields.exportIcs ?? 'Norway parental leave plan');
    const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'norway-parental-plan.ics';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('[data-parental-status]').textContent = fields.statusExported;
  });
  syncQuotaOptions();
  renderPeriods();
}
