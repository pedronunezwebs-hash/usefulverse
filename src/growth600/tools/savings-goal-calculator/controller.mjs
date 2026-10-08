import { calculateSavingsGoal } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="savings-goal-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const mode = form.elements.namedItem('mode');
  const months = form.elements.namedItem('months');
  const contribution = form.elements.namedItem('monthlyContribution');
  const result = root.querySelector('[data-savings-result]');
  let summary = '';
  const formatter = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 2 });
  const money = (value) => formatter.format(value);

  function syncMode(clear = true) {
    const solvingMonths = mode.value === 'months-to-goal';
    months.closest('.field').hidden = solvingMonths;
    months.disabled = solvingMonths;
    months.required = !solvingMonths;
    contribution.closest('.field').hidden = !solvingMonths;
    contribution.disabled = !solvingMonths;
    contribution.required = solvingMonths;
    if (clear) result.hidden = true;
    summary = '';
  }

  mode.addEventListener('change', () => syncMode());
  form.addEventListener('input', () => { result.hidden = true; summary = ''; });
  form.addEventListener('change', () => { result.hidden = true; summary = ''; });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const report = calculateSavingsGoal({
        mode: mode.value,
        startingBalance: form.elements.namedItem('startingBalance').value,
        targetAmount: form.elements.namedItem('targetAmount').value,
        annualRatePercent: form.elements.namedItem('annualRatePercent').value,
        months: months.value,
        monthlyContribution: contribution.value,
        contributionTiming: form.elements.namedItem('contributionTiming').value,
      });
      const primary = root.querySelector('[data-savings-primary]');
      if (report.unreachable) primary.textContent = copy.messages.unreachable;
      else if (report.horizonCapped) primary.textContent = `${copy.messages.horizonCapped} ${money(report.projectedBalance)}`;
      else if (report.mode === 'required-contribution') primary.textContent = `${copy.fields.monthlyResult}: ${money(report.requiredMonthlyContribution)}`;
      else primary.textContent = `${copy.fields.monthsResult}: ${report.months}`;
      if (report.goalAlreadyReachedByDeadline) primary.textContent = copy.messages.alreadyReached;
      root.querySelector('[data-savings-projected]').textContent = money(report.projectedBalance);
      root.querySelector('[data-savings-contributions]').textContent = money(report.totalContributions);
      root.querySelector('[data-savings-interest]').textContent = money(report.estimatedInterest);
      result.hidden = false;
      summary = `${primary.textContent}\n${copy.fields.projectedBalance}: ${money(report.projectedBalance)}\n${copy.fields.totalContributions}: ${money(report.totalContributions)}\n${copy.fields.estimatedInterest}: ${money(report.estimatedInterest)}`;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      result.hidden = true;
      summary = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'required-contribution';
    form.elements.namedItem('startingBalance').value = '0';
    form.elements.namedItem('targetAmount').value = '1200';
    form.elements.namedItem('annualRatePercent').value = '0';
    months.value = '12';
    contribution.value = '100';
    form.elements.namedItem('contributionTiming').value = 'end';
    syncMode();
    announce(root, copy.messages.exampleLoaded, 'info');
  });

  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!summary) return announce(root, copy.messages.calculateFirst, 'error');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      announce(root, copy.messages.copied, 'success');
    } catch {
      announce(root, copy.messages.copyUnavailable, 'error');
    }
  });

  form.addEventListener('reset', () => {
    queueMicrotask(() => syncMode(false));
    result.hidden = true;
    summary = '';
    announce(root, '');
  });
  syncMode(false);
}
