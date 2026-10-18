import { calculateInductor } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

export function mountInductorCalculator(root, copy) {
  const form = root.querySelector('#tool-form');
  const mode = form.elements.namedItem('mode');
  const airFields = root.querySelector('[data-air-core-fields]');
  const toroidFields = root.querySelector('[data-toroid-fields]');
  let output = '';

  const clear = () => { clearResult(root); output = ''; };
  const setMode = () => {
    const air = mode.value === 'airCore';
    airFields.hidden = !air; toroidFields.hidden = air;
    for (const input of airFields.querySelectorAll('input,select')) { input.required = air; input.disabled = !air; }
    for (const input of toroidFields.querySelectorAll('input,select')) { input.required = !air; input.disabled = air; }
    clear();
  };
  const displayInductance = (henries) => {
    const magnitude = Math.abs(henries);
    const [value, unit] = magnitude >= 1 ? [henries, 'H'] : magnitude >= 1e-3 ? [henries * 1e3, 'mH'] : magnitude >= 1e-6 ? [henries * 1e6, 'µH'] : [henries * 1e9, 'nH'];
    return `${numberFormat(document.documentElement.lang || 'en', value, 6)} ${unit}`;
  };
  const calculate = (event) => {
    event?.preventDefault(); clear();
    try {
      const result = calculateInductor(Object.fromEntries(new FormData(form).entries()));
      const method = result.method === 'manufacturer-core-al' ? copy.messages.methodAl : copy.messages.methodWheeler;
      const methodDetail = result.mode === 'airCore'
        ? `${method} — ${result.withinWheelerRange ? copy.fields.wheelerRange : copy.fields.outsideWheelerRange}`
        : method;
      const rows = [[copy.messages.inductance, displayInductance(result.inductanceH)], [copy.messages.turns, String(result.turns)], [copy.fields.method, methodDetail]];
      if (result.targetTurns !== null) rows.push([copy.messages.targetTurns, String(result.targetTurns)]);
      showRows(root, rows);
      output = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  };

  mode.addEventListener('change', setMode);
  form.addEventListener('input', clear);
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { setMode(); clear(); announce(root, ''); }, 0));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'airCore') {
      form.elements.namedItem('turns').value = '10'; form.elements.namedItem('coilDiameter').value = '20';
      form.elements.namedItem('coilLength').value = '20'; form.elements.namedItem('dimensionUnit').value = 'mm';
      form.elements.namedItem('targetInductance').value = '1.36'; form.elements.namedItem('targetUnit').value = 'uH';
    } else {
      form.elements.namedItem('turns').value = '10'; form.elements.namedItem('alValue').value = '100';
      form.elements.namedItem('targetInductance').value = '10'; form.elements.namedItem('targetUnit').value = 'uH';
    }
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  setMode();
}

const root = document.querySelector('[data-tool="inductor-calculator"]');
if (root) mountInductorCalculator(root, readToolCopy(root));
