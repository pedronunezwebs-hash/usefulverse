import { calculateSeverance } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="severance-pay-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const mode = form.elements.namedItem('mode');
  const result = root.querySelector('[data-severance-result]');
  const customNote = root.querySelector('[data-severance-custom-note]');
  const ukNote = root.querySelector('[data-severance-uk-note]');
  const customFields = ['yearsOfService', 'weeksPerYear'];
  const ukFields = ['birthDate', 'employmentStartDate', 'redundancyDate'];
  const output = {
    amount: root.querySelector('[data-severance-amount]'),
    weeklyPay: root.querySelector('[data-severance-weekly-pay]'),
    years: root.querySelector('[data-severance-years]'),
    weeks: root.querySelector('[data-severance-weeks]'),
    details: root.querySelector('[data-severance-details]'),
  };
  let latestSummary = '';
  const formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 2 });
  const display = (value) => formatter.format(value);

  function syncMode(clear = true) {
    const uk = mode.value === 'uk-statutory';
    customNote.hidden = uk;
    ukNote.hidden = !uk;
    for (const name of customFields) {
      const field = form.elements.namedItem(name);
      field.closest('.field').hidden = uk;
      field.disabled = uk;
      field.required = !uk;
    }
    for (const name of ukFields) {
      const field = form.elements.namedItem(name);
      field.closest('.field').hidden = !uk;
      field.disabled = !uk;
      field.required = uk;
    }
    if (clear) result.hidden = true;
    latestSummary = '';
  }

  mode.addEventListener('change', () => syncMode());
  form.addEventListener('input', () => { result.hidden = true; latestSummary = ''; });
  form.addEventListener('change', () => { result.hidden = true; latestSummary = ''; });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const report = calculateSeverance({
        mode: mode.value,
        weeklyPay: form.elements.namedItem('weeklyPay').value,
        yearsOfService: form.elements.namedItem('yearsOfService').value,
        weeksPerYear: form.elements.namedItem('weeksPerYear').value,
        birthDate: form.elements.namedItem('birthDate').value,
        employmentStartDate: form.elements.namedItem('employmentStartDate').value,
        redundancyDate: form.elements.namedItem('redundancyDate').value,
      });
      output.amount.textContent = display(report.amount);
      output.weeklyPay.textContent = display(report.mode === 'uk-statutory' ? report.appliedWeeklyPay : report.weeklyPay);
      output.years.textContent = display(report.yearsOfService);
      output.weeks.textContent = display(report.totalWeeks);
      if (report.mode === 'uk-statutory' && !report.eligible) output.details.textContent = copy.messages.belowServiceMinimum;
      else if (report.mode === 'uk-statutory') output.details.textContent = `${copy.fields.rulesAsOf}: ${report.rulesAsOf}. ${report.capped ? copy.messages.capApplied : copy.messages.noCapApplied}`;
      else output.details.textContent = copy.messages.customAssumptions;
      result.hidden = false;
      latestSummary = `${copy.fields.estimate}: ${display(report.amount)}\n${copy.fields.appliedWeeklyPay}: ${display(report.mode === 'uk-statutory' ? report.appliedWeeklyPay : report.weeklyPay)}\n${copy.fields.yearsOfService}: ${display(report.yearsOfService)}\n${copy.fields.totalWeeks}: ${display(report.totalWeeks)}\n${output.details.textContent}`;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      result.hidden = true;
      latestSummary = '';
      announce(root, error instanceof RangeError ? copy.messages.checkInputs : copy.messages.calculationFailed, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'custom';
    form.elements.namedItem('weeklyPay').value = '500';
    form.elements.namedItem('yearsOfService').value = '10';
    form.elements.namedItem('weeksPerYear').value = '2';
    form.elements.namedItem('birthDate').value = '1980-01-01';
    form.elements.namedItem('employmentStartDate').value = '2010-01-01';
    form.elements.namedItem('redundancyDate').value = '2026-04-06';
    syncMode();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!latestSummary) return announce(root, copy.messages.calculateFirst, 'error');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(latestSummary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  form.addEventListener('reset', () => {
    queueMicrotask(() => syncMode(false));
    result.hidden = true;
    latestSummary = '';
    announce(root, '');
  });
  syncMode(false);
}
