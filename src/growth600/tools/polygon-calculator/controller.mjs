import { calculateRegularPolygon } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="polygon-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-polygon-result]');
  const values = root.querySelector('[data-polygon-values]');
  const number = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumFractionDigits: 8 });
  let latest = null;
  const hide = () => { result.hidden = true; values.replaceChildren(); latest = null; };
  const clear = () => { hide(); announce(root, ''); };
  form.addEventListener('input', clear);
  form.addEventListener('change', clear);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    try {
      const report = calculateRegularPolygon({ sides: form.elements.namedItem('sides').value, mode: form.elements.namedItem('mode').value, dimension: form.elements.namedItem('dimension').value });
      const unit = form.elements.namedItem('unit').value.trim();
      const length = (value) => `${number.format(value)}${unit ? ` ${unit}` : ''}`;
      const area = (value) => `${number.format(value)}${unit ? ` ${unit}²` : ''}`;
      const rows = [
        [copy.fields.perimeter, length(report.perimeter)],
        [copy.fields.area, area(report.area)],
        [copy.fields.computedSide, length(report.side)],
        [copy.fields.computedApothem, length(report.apothem)],
        [copy.fields.computedCircumradius, length(report.circumradius)],
        [copy.fields.interiorAngle, `${number.format(report.interiorAngleDegrees)}°`],
        [copy.fields.centralAngle, `${number.format(report.centralAngleDegrees)}°`],
      ];
      values.replaceChildren(...rows.flatMap(([term, value]) => {
        const dt = document.createElement('dt'); dt.textContent = term;
        const dd = document.createElement('dd'); dd.textContent = value;
        return [dt, dd];
      }));
      latest = rows.map(([term, value]) => `${term}: ${value}`).join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated);
    } catch {
      hide();
      announce(root, copy.messages.checkInputs);
    }
  });
  form.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('sides').value = '6';
    form.elements.namedItem('mode').value = 'side';
    form.elements.namedItem('dimension').value = '1';
    form.elements.namedItem('unit').value = '';
    clear();
    form.requestSubmit();
  });
  form.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!latest) return;
    try { await navigator.clipboard.writeText(latest); announce(root, copy.messages.copied); }
    catch { announce(root, copy.messages.copyUnavailable); }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
}
