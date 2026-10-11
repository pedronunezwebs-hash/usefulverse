import { parseLocalizedNumber } from '../../../advanced-logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { calculateInductor } from './logic.mjs';

const root = document.querySelector('[data-tool="inductor-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = () => document.documentElement.lang || 'en';
  const parse = (name) => parseLocalizedNumber(form.elements.namedItem(name).value, locale());
  const format = (value, digits = 5) => numberFormat(locale(), value, digits);
  let summary = '';
  function clear() { clearResult(root); summary = ''; }
  function updateMode() {
    const turnsMode = form.elements.namedItem('mode').value === 'inductance';
    const turnsRow = root.querySelector('[data-inductor-input="turns"]');
    const targetRow = root.querySelector('[data-inductor-input="target"]');
    if (turnsRow) { turnsRow.hidden = !turnsMode; turnsRow.querySelector('input').disabled = !turnsMode; turnsRow.querySelector('input').required = turnsMode; }
    if (targetRow) { targetRow.hidden = turnsMode; targetRow.querySelector('input').disabled = turnsMode; targetRow.querySelector('input').required = !turnsMode; }
  }
  function calculate(event) {
    event?.preventDefault(); clear();
    try {
      const unit = form.elements.namedItem('dimensionUnit').value;
      const meters = unit === 'mm' ? 0.001 : unit === 'cm' ? 0.01 : 0.0254;
      const mode = form.elements.namedItem('mode').value;
      const result = calculateInductor({
        mode,
        turns: mode === 'inductance' ? parse('turns') : 0,
        targetMicrohenries: mode === 'turns' ? parse('targetInductance') : 0,
        diameterMeters: parse('diameter') * meters,
        lengthMeters: parse('length') * meters,
        wireDiameterMeters: parse('wireDiameter') * meters,
      });
      const fit = result.turns * result.wireDiameterMeters <= result.lengthMeters + 1e-12;
      const rows = [
        [copy.fields.turnsResult, format(result.turns, 0)],
        [copy.fields.inductanceMicrohenries, `${format(result.inductanceMicrohenries)} µH`],
        [copy.fields.inductanceMillihenries, `${format(result.inductanceMicrohenries / 1000)} mH`],
        [copy.fields.inductanceHenries, `${format(result.inductanceHenries)} H`],
        ...(mode === 'turns' ? [[copy.fields.targetValue, `${format(result.targetMicrohenries)} µH`]] : []),
        [copy.fields.fitCheck, fit ? copy.messages.fitYes : copy.messages.fitNo],
      ];
      showRows(root, rows); summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch { announce(root, copy.messages.checkInputs, 'error'); }
  }
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  form.addEventListener('change', (event) => { if (event.target?.name === 'mode') updateMode(); });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); updateMode(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('mode').value = 'inductance'; form.elements.namedItem('turns').value = '40';
    form.elements.namedItem('diameter').value = '20'; form.elements.namedItem('length').value = '50';
    form.elements.namedItem('wireDiameter').value = '0.8'; form.elements.namedItem('dimensionUnit').value = 'mm';
    updateMode(); calculate(); announce(root, copy.messages.exampleLoaded, 'success');
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (summary) copyText(root, summary, copy); });
  updateMode();
}
