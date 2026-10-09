import { calculatePressure } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
const root = document.querySelector('[data-tool="pressure-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root); const mode = form.elements.namedItem('mode');
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 7); let output = '';
  function syncMode() { for (const section of root.querySelectorAll('[data-pressure-inputs]')) { const visible = section.dataset.pressureInputs === mode.value; section.hidden = !visible; for (const input of section.querySelectorAll('input,select')) input.required = visible; } }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); output = '';
    try {
      const result = calculatePressure(Object.fromEntries(new FormData(form).entries())); const unit = result.pressureUnit;
      const rows = [[copy.messages.model, result.mode === 'hydrostatic' ? copy.fields.hydrostaticMode : copy.fields.forceAreaMode], [copy.messages.pressure, `${format(result.pressure)} ${unit}`], [copy.messages.pressurePascals, `${format(result.pressurePa)} Pa`], ...(result.mode === 'force-area' ? [[copy.messages.force, `${format(result.inputs.forceN)} N`], [copy.messages.area, `${format(result.inputs.areaM2)} m²`]] : [[copy.messages.density, `${format(result.inputs.densityKgm3)} kg/m³`], [copy.messages.depth, `${format(result.inputs.depthM)} m`], [copy.messages.gravity, `${format(result.inputs.gravityMps2)} m/s²`]])];
      showRows(root, rows); output = rows.map(([label, value]) => `${label}: ${value}`).join('\n'); announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  mode.addEventListener('change', () => { syncMode(); clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('input', () => { clearResult(root); output = ''; announce(root, ''); });
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (mode.value === 'hydrostatic') { form.elements.namedItem('density').value = '1000'; form.elements.namedItem('densityUnit').value = 'kgm3'; form.elements.namedItem('depth').value = '1'; form.elements.namedItem('depthUnit').value = 'm'; form.elements.namedItem('gravity').value = '9.80665'; }
    else { form.elements.namedItem('force').value = '100'; form.elements.namedItem('forceUnit').value = 'N'; form.elements.namedItem('area').value = '2'; form.elements.namedItem('areaUnit').value = 'm2'; }
    form.elements.namedItem('pressureUnit').value = 'Pa'; syncMode(); calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { output = ''; syncMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (output) copyText(root, output, copy); });
  syncMode();
}
