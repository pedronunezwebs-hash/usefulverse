import { calculateRafter } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const escapeSvgLabel = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

const root = document.querySelector('[data-tool="rafter-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  const mode = form.elements.namedItem('mode');
  const riseField = form.elements.namedItem('rise');
  const pitchField = form.elements.namedItem('pitch');

  function updateMode() {
    const useRise = mode.value === 'rise';
    riseField.closest('.field').hidden = !useRise;
    pitchField.closest('.field').hidden = useRise;
    riseField.required = useRise;
    pitchField.required = !useRise;
  }
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateRafter({
        span: readNumber(form, 'span', { min: 0.01, max: 100_000 }),
        rise: mode.value === 'rise' ? readNumber(form, 'rise', { min: 0.01, max: 100_000 }) : 1,
        pitch: mode.value === 'pitch' ? readNumber(form, 'pitch', { min: 0.01, max: 100 }) : null,
        ridgeThickness: readNumber(form, 'ridgeThickness', { min: 0, max: 10_000 }),
        ridgeUnit: form.elements.namedItem('ridgeUnit').value,
        overhang: readNumber(form, 'overhang', { min: 0, max: 100_000 }),
        unit: form.elements.namedItem('unit').value,
        mode: mode.value,
      });
      const suffix = result.unit;
      const rows = [
        [copy.messages.effectiveRun, `${format(result.horizontalRun)} ${suffix}`],
        [copy.messages.rafterLength, `${format(result.rafterLength)} ${suffix}`],
        [copy.messages.pitch, `${format(result.pitchPer12)} : 12`],
        [copy.messages.roofAngle, `${format(result.roofAngleDegrees)}°`],
        [copy.messages.plumbCut, `${format(result.plumbCutDegrees)}°`],
        [copy.messages.overhangRun, `${format(result.overhang)} ${suffix}`],
      ];
      showRows(root, rows);
      const diagram = root.querySelector('[data-rafter-diagram]');
      diagram.hidden = false;
      diagram.innerHTML = `<svg viewBox="0 0 320 150" role="img" aria-label="${escapeSvgLabel(copy.fields.diagramLabel)}"><title>${escapeSvgLabel(copy.fields.diagramLabel)}</title><path d="M14 136H306M28 126H292M160 126V28M28 126L160 28L292 126M28 126L14 136M292 126L306 136" fill="none" stroke="currentColor" stroke-width="3"/><path d="M145 126V111H160" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      clearResult(root); announce(root, copy.messages.checkInputs, 'error');
    }
  }
  mode.addEventListener('change', updateMode);
  updateMode();
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'ft', mode: 'rise', span: '20', rise: '6', pitch: '3', ridgeThickness: '1.5', ridgeUnit: 'in', overhang: '0' })) form.elements.namedItem(name).value = value;
    updateMode(); calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; updateMode(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
