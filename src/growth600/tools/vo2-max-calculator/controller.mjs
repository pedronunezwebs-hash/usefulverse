import { announce, readToolCopy } from '../controller-helpers.mjs';
import { estimateVo2Max } from './logic.mjs';

const root = document.querySelector('[data-tool="vo2-max-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const method = form.elements.namedItem('method');
  const cooperPanel = root.querySelector('[data-vo2-cooper]');
  const rockportPanel = root.querySelector('[data-vo2-rockport]');
  const result = root.querySelector('[data-vo2-result]');
  const value = root.querySelector('[data-vo2-value]');
  const resultMethod = root.querySelector('[data-vo2-method]');
  const syncMethod = () => {
    const cooper = method.value === 'cooper';
    cooperPanel.hidden = !cooper;
    cooperPanel.disabled = !cooper;
    rockportPanel.hidden = cooper;
    rockportPanel.disabled = cooper;
    result.hidden = true;
    announce(root, '');
  };
  const calculate = (event) => {
    event?.preventDefault();
    result.hidden = true;
    try {
      const output = method.value === 'cooper'
        ? estimateVo2Max({ method: 'cooper', distance: form.elements.namedItem('distance').value, unit: form.elements.namedItem('distanceUnit').value })
        : estimateVo2Max({ method: 'rockport', age: form.elements.namedItem('age').value, weight: form.elements.namedItem('weight').value, weightUnit: form.elements.namedItem('weightUnit').value, sexCoefficient: form.elements.namedItem('equationSex').value, minutes: form.elements.namedItem('walkMinutes').value, seconds: form.elements.namedItem('walkSeconds').value, finishHeartRate: form.elements.namedItem('finishHeartRate').value });
      value.textContent = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 1 }).format(output.vo2Max);
      resultMethod.textContent = method.value === 'cooper' ? copy.fields.resultCooper : copy.fields.resultRockport;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  };
  method.addEventListener('change', syncMethod);
  form.addEventListener('submit', calculate);
  form.addEventListener('input', () => { result.hidden = true; announce(root, ''); });
  form.addEventListener('reset', () => { result.hidden = true; requestAnimationFrame(syncMethod); });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    if (method.value === 'cooper') {
      form.elements.namedItem('distance').value = '2400';
      form.elements.namedItem('distanceUnit').value = 'm';
    } else {
      form.elements.namedItem('age').value = '30';
      form.elements.namedItem('weight').value = '70';
      form.elements.namedItem('weightUnit').value = 'kg';
      form.elements.namedItem('equationSex').value = 'male';
      form.elements.namedItem('walkMinutes').value = '15';
      form.elements.namedItem('walkSeconds').value = '0';
      form.elements.namedItem('finishHeartRate').value = '150';
    }
    calculate();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (result.hidden) return;
    try { await navigator.clipboard.writeText(`${value.textContent} ${copy.fields.unitLabel} — ${resultMethod.textContent}`); announce(root, copy.messages.copied, 'success'); }
    catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });
  syncMethod();
}
