import { calculateCarpet } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="carpet-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, places = 2) => numberFormat(locale, value, places);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateCarpet({
        roomLength: readNumber(form, 'roomLength', { min: 0.01, max: 100_000 }),
        roomWidth: readNumber(form, 'roomWidth', { min: 0.01, max: 100_000 }),
        rollWidth: readNumber(form, 'rollWidth', { min: 0.1, max: 20 }),
        rooms: readNumber(form, 'rooms', { min: 1, max: 100, integer: true }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
        unit: form.elements.namedItem('unit').value,
        pileDirection: form.elements.namedItem('pileDirection').value,
      });
      const suffix = result.unit;
      const chosen = result.chosen;
      const rows = [
        [copy.messages.floorArea, `${format(result.roomArea * result.rooms)} ${result.unit === 'm' ? 'm²' : 'ft²'}`],
        [copy.messages.pileDirection, chosen.pileDirection === 'length' ? copy.actions.alongRoomLength : copy.actions.alongRoomWidth],
        [copy.messages.cuts, format(chosen.cutsPerRoom, 0)],
        [copy.messages.seams, format(chosen.seamsPerRoom, 0)],
        [copy.messages.cutLength, `${format(chosen.cutLength)} ${suffix}`],
        [copy.messages.orderLength, `${format(chosen.orderedLength)} ${suffix}`],
        [copy.messages.purchasedArea, `${format(chosen.purchasedArea)} ${result.unit === 'm' ? 'm²' : 'ft²'}`],
        [copy.messages.alternative, `${result.options.find((option) => option.pileDirection !== chosen.pileDirection).pileDirection === 'length' ? copy.actions.alongRoomLength : copy.actions.alongRoomWidth}: ${format(result.options.find((option) => option.pileDirection !== chosen.pileDirection).orderedLength)} ${suffix}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'm', roomLength: '4', roomWidth: '5', rollWidth: '3', rooms: '1', pileDirection: 'either', wastePercent: '10' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
