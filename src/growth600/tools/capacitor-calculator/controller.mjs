import { calculateCapacitorNetwork, parseCapacitanceLines } from './logic.mjs';
import { announce, clearResult, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';
import { parseLocalizedNumber } from '../../../advanced-logic.mjs';

const root = document.querySelector('[data-tool="capacitor-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const localized = (value, digits = 6) => numberFormat(document.documentElement.lang || 'en', value, digits);
  function engineering(value, baseUnit) {
    const absolute = Math.abs(value);
    if (!absolute) return `0 ${baseUnit}`;
    if (absolute < 1e-12 || absolute >= 1e12) {
      const number = new Intl.NumberFormat(document.documentElement.lang || 'en', { notation: 'scientific', maximumSignificantDigits: 6 }).format(value);
      return `${number} ${baseUnit}`;
    }
    const prefixes = [['G', 1e9], ['M', 1e6], ['k', 1e3], ['', 1], ['m', 1e-3], ['μ', 1e-6], ['n', 1e-9], ['p', 1e-12]];
    const [prefix, scale] = prefixes.find(([, factor]) => absolute >= factor) ?? prefixes.at(-1);
    return `${localized(value / scale)} ${prefix}${baseUnit}`;
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult(root);
    try {
      const values = parseCapacitanceLines(form.elements.namedItem('values').value, (value) => parseLocalizedNumber(value, document.documentElement.lang || 'en'));
      const voltageText = form.elements.namedItem('voltage').value.trim();
      const result = calculateCapacitorNetwork({
        values,
        unit: form.elements.namedItem('unit').value,
        connection: form.elements.namedItem('connection').value,
        voltage: voltageText ? parseLocalizedNumber(voltageText, document.documentElement.lang || 'en') : undefined,
      });
      const rows = [[copy.fields.resultEquivalent, `${localized(result.equivalentFarads / ({ F: 1, mF: 1e-3, uF: 1e-6, nF: 1e-9, pF: 1e-12 })[result.unit])} ${result.unit.replace('uF', 'μF')}`]];
      if ('voltageVolts' in result) {
        rows.push([copy.fields.resultCharge, engineering(result.chargeCoulombs, 'C')]);
        rows.push([copy.fields.resultEnergy, engineering(result.energyJoules, 'J')]);
        result.components.forEach((component, index) => {
          rows.push([`${copy.fields.capacitor} ${localized(index + 1, 0)} · ${copy.fields.resultVoltage}`, engineering(component.voltageVolts, 'V')]);
          rows.push([`${copy.fields.capacitor} ${localized(index + 1, 0)} · ${copy.fields.resultCharge}`, engineering(component.chargeCoulombs, 'C')]);
        });
      }
      showRows(root, rows);
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('values').value = '100\n100';
    form.elements.namedItem('unit').value = 'uF';
    form.elements.namedItem('connection').value = 'parallel';
    form.elements.namedItem('voltage').value = '5';
    form.requestSubmit();
  });
  form.addEventListener('reset', () => setTimeout(() => { clearResult(root); announce(root, ''); }, 0));
}
