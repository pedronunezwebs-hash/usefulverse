import { calculatePh } from './logic.mjs';
import { announce, clearResult, copyText, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="ph-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const constant = form.elements.namedItem('equilibriumConstant');
  const constantGroup = root.querySelector('[data-ph-constant]');
  let outputText = '';
  const updateMode = () => {
    const weak = mode.value.startsWith('weak-');
    constantGroup.hidden = !weak;
    constant.disabled = !weak;
    constant.required = weak;
    constant.setAttribute('aria-required', String(weak));
  };
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const weak = mode.value.startsWith('weak-');
      const result = calculatePh({
        mode: mode.value,
        concentration: readNumber(form, 'concentration', { min: 1e-14, max: 10 }),
        equilibriumConstant: weak ? readNumber(form, 'equilibriumConstant', { min: 1e-14, max: 1 }) : undefined,
      });
      const locale = document.documentElement.lang || 'en';
      const fmt = (value, digits = 6) => new Intl.NumberFormat(locale, { maximumSignificantDigits: digits }).format(value);
      const scientific = (value) => new Intl.NumberFormat(locale, { notation: 'scientific', maximumSignificantDigits: 5 }).format(value);
      const rows = [
        [copy.messages.pH, fmt(result.pH)],
        [copy.messages.pOH, fmt(result.pOH)],
        [copy.messages.hydrogen, `${scientific(result.hydrogen)} mol/L`],
        [copy.messages.hydroxide, `${scientific(result.hydroxide)} mol/L`],
        [copy.messages.classification, copy.messages[result.classification]],
      ];
      if (result.percentIonized !== undefined) rows.push([copy.messages.percentIonized, `${fmt(result.percentIonized, 5)}%`]);
      const modelLabel = mode.value.replace(/-(\w)/gu, (_, letter) => letter.toUpperCase());
      rows.push([copy.messages.at25C, `${copy.messages.method}: ${copy.fields[modelLabel]}`]);
      showRows(root, rows);
      outputText = rows.map(([name, value]) => `${name}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  mode.addEventListener('change', updateMode);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'strong-acid';
    form.elements.namedItem('concentration').value = '1e-7';
    updateMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; updateMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  updateMode();
}
