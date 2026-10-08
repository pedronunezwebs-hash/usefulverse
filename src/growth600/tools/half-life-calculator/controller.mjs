import { calculateHalfLife } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="half-life-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const modeField = form.elements.namedItem('mode');
  const targets = { remaining: 'remainingAmount', initial: 'initialAmount', elapsed: 'elapsedTime', halfLife: 'halfLife' };
  const labels = { remaining: 'remainingAmount', initial: 'initialAmount', elapsed: 'elapsedTime', halfLife: 'halfLife' };
  let outputText = '';
  let previousTarget = targets[modeField.value];

  function syncTarget() {
    const target = targets[modeField.value];
    if (target !== previousTarget) form.elements.namedItem(target).value = '';
    for (const fieldName of Object.values(targets)) {
      const field = form.elements.namedItem(fieldName);
      const disabled = fieldName === target;
      field.disabled = disabled;
      field.required = !disabled;
      if (disabled) field.removeAttribute('aria-invalid');
    }
    previousTarget = target;
  }

  function format(value) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumSignificantDigits: 8 }).format(value);
  }

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateHalfLife({
        mode: modeField.value,
        initialAmount: form.elements.namedItem('initialAmount').value,
        remainingAmount: form.elements.namedItem('remainingAmount').value,
        halfLife: form.elements.namedItem('halfLife').value,
        elapsedTime: form.elements.namedItem('elapsedTime').value,
      });
      const unit = copy.fields[form.elements.namedItem('timeUnit').value];
      const rows = [
        [`${copy.messages.calculatedValue} · ${copy.messages[labels[result.mode]]}`, format(result[targets[result.mode]])],
        [copy.messages.initialAmount, format(result.initialAmount)],
        [copy.messages.remainingAmount, format(result.remainingAmount)],
        [`${copy.messages.halfLife} (${unit})`, format(result.halfLife)],
        [`${copy.messages.elapsedTime} (${unit})`, format(result.elapsedTime)],
        [copy.messages.remainingPercent, `${format(result.remainingPercent)}%`],
        [copy.messages.halfLivesElapsed, format(result.halfLivesElapsed)],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  modeField.addEventListener('change', () => {
    syncTarget();
    clearResult(root);
    outputText = '';
    announce(root, '');
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    syncTarget();
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    modeField.value = 'remaining';
    form.elements.namedItem('initialAmount').value = '100';
    form.elements.namedItem('halfLife').value = '10';
    form.elements.namedItem('elapsedTime').value = '10';
    syncTarget();
    calculate();
    announce(root, copy.messages.exampleLoaded, 'status');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
  syncTarget();
}
