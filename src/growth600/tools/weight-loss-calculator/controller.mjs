import { estimateLinearWeightLossScenario } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="weight-loss-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    try {
      const unit = form.elements.namedItem('unit').value;
      const scenario = estimateLinearWeightLossScenario({
        currentWeight: readNumber(form, 'currentWeight', { min: 0.1, max: 1000 }),
        targetWeight: readNumber(form, 'targetWeight', { min: 0.1, max: 1000 }),
        dailyDeficit: readNumber(form, 'dailyDeficit', { min: 0, max: 10000 }),
        unit,
      });
      const amount = `${numberFormat(locale, scenario.amountToLose, 2)} ${unit}`;
      const timeline = scenario.estimatedDays === null
        ? copy.messages.noDeficitChange
        : `${numberFormat(locale, scenario.estimatedDays, 1)} ${copy.actions.dayUnit} (${numberFormat(locale, scenario.estimatedWeeks, 1)} ${copy.actions.weekUnit})`;
      const weekly = `${numberFormat(locale, scenario.weeklyRate, 2)} ${unit} ${copy.actions.perWeek}`;
      const rows = [
        [copy.messages.weightToLose, amount],
        [copy.messages.energyEquivalent, `${numberFormat(locale, scenario.energyEquivalentKcal, 0)} ${copy.actions.kilocalories}`],
        [copy.messages.timeline, timeline],
        [copy.messages.weeklyRate, weekly],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => value ? `${label}: ${value}` : label).join('\n');
      if (scenario.paceAboveReference) outputText += `\n${copy.messages.paceNote}`;
      announce(root, scenario.paceAboveReference ? `${copy.messages.estimateOnly} ${copy.messages.paceNote}` : copy.messages.estimateOnly, 'success');
    } catch {
      outputText = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => {
    setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0);
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('currentWeight').value = '80';
    form.elements.namedItem('targetWeight').value = '70';
    form.elements.namedItem('unit').value = 'kg';
    form.elements.namedItem('dailyDeficit').value = '500';
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
