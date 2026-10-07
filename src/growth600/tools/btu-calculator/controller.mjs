import { calculateBtu } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="btu-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value, places = 0) => numberFormat(locale, value, places);

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateBtu({
        length: readNumber(form, 'length', { min: 0, max: 1000 }),
        width: readNumber(form, 'width', { min: 0, max: 1000 }),
        ceilingHeight: readNumber(form, 'ceilingHeight', { min: 0.1, max: 40 }),
        dimensionUnit: form.elements.namedItem('dimensionUnit').value,
        ceilingUnit: form.elements.namedItem('dimensionUnit').value,
        insulationAdjustmentPercent: readNumber(form, 'insulationAdjustment', { min: -30, max: 50 }),
        sunExposure: form.elements.namedItem('sunExposure').value,
        occupants: readNumber(form, 'occupants', { min: 0, max: 50, integer: true }),
        kitchen: form.elements.namedItem('kitchen').value === 'yes',
      });
      const unit = form.elements.namedItem('dimensionUnit').value;
      const imperial = unit === 'ft' || unit === 'in';
      const area = imperial ? `${format(result.areaFt2, 1)} ft²` : `${format(result.areaM2, 1)} m²`;
      const volume = imperial ? `${format(result.volumeFt3, 1)} ft³` : `${format(result.volumeM3, 1)} m³`;
      const rows = [
        [messages.roomArea, area], [messages.roomVolume, volume],
        [messages.baseCapacity, `${format(result.baseBtuPerHour)} Btu/h`],
        [messages.ceilingAdjustment, `${format(result.ceilingFactor * 100, 0)}%`],
        [messages.insulationAdjustment, `${format(result.insulationAdjustmentPercent, 0)}%`],
        [messages.sunAdjustment, `${format(result.sunFactor * 100, 0)}%`],
        [messages.occupantAdjustment, `${format(result.occupantAdjustmentBtuPerHour)} Btu/h`],
        [messages.kitchenAdjustment, `${format(result.kitchenAdjustmentBtuPerHour)} Btu/h`],
        [messages.capacity, `${format(result.estimatedBtuPerHour)} Btu/h`],
        [messages.tons, format(result.tons, 2)],
      ];
      showRows(root, rows);
      if (result.belowReferenceBand) announce(root, messages.belowReferenceBand, 'info');
      else announce(root, messages.calculated, 'success');
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('length').value = '12'; form.elements.namedItem('width').value = '12';
    form.elements.namedItem('ceilingHeight').value = '8'; form.elements.namedItem('dimensionUnit').value = 'ft';
    form.elements.namedItem('insulationAdjustment').value = '0'; form.elements.namedItem('sunExposure').value = 'typical';
    form.elements.namedItem('occupants').value = '2'; form.elements.namedItem('kitchen').value = 'no'; calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = ''; for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
