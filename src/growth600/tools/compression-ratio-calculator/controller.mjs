import { calculateEngineCompression } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="compression-ratio-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value, digits = 4) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    try {
      const result = calculateEngineCompression({
        unit: form.elements.namedItem('unit').value,
        volumeUnit: form.elements.namedItem('volumeUnit').value,
        bore: form.elements.namedItem('bore').value.trim(),
        stroke: form.elements.namedItem('stroke').value.trim(),
        chamberVolume: form.elements.namedItem('chamberVolume').value.trim(),
        gasketBore: form.elements.namedItem('gasketBore').value.trim(),
        gasketThickness: form.elements.namedItem('gasketThickness').value.trim(),
        deckClearance: form.elements.namedItem('deckClearance').value.trim(),
        pistonCrownVolume: form.elements.namedItem('pistonCrownVolume').value.trim(),
        cylinders: form.elements.namedItem('cylinders').value.trim() || 1,
      });
      const rows = [
        [copy.messages.ratio, `${format(result.compressionRatio, 2)}:1`],
        [copy.messages.sweptVolume, `${format(result.sweptVolumeCc)} cm³`],
        [copy.messages.clearanceVolume, `${format(result.clearanceVolumeCc)} cm³`],
        [copy.messages.totalDisplacement, `${format(result.totalDisplacementCc)} cm³ (${format(result.totalDisplacementLiters, 3)} L)`],
        [copy.messages.boreStroke, `${format(result.boreStrokeRatio, 3)}:1`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'mm', volumeUnit: 'cc', bore: '86', stroke: '86', chamberVolume: '55.5064', gasketBore: '', gasketThickness: '', deckClearance: '', pistonCrownVolume: '', cylinders: '4' })) {
      form.elements.namedItem(name).value = value;
    }
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
