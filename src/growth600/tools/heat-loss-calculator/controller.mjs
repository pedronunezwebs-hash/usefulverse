import { calculateHeatLoss } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="heat-loss-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateHeatLoss({
        areaUnit: form.elements.namedItem('areaUnit').value,
        temperatureUnit: form.elements.namedItem('temperatureUnit').value,
        volumeUnit: form.elements.namedItem('volumeUnit').value,
        temperatureDifference: readNumber(form, 'temperatureDifference', { min: 0, max: 1000 }),
        wallArea: readNumber(form, 'wallArea', { min: 0, max: 100_000_000 }), wallUValue: readNumber(form, 'wallUValue', { min: 0, max: 1000 }),
        roofArea: readNumber(form, 'roofArea', { min: 0, max: 100_000_000 }), roofUValue: readNumber(form, 'roofUValue', { min: 0, max: 1000 }),
        windowArea: readNumber(form, 'windowArea', { min: 0, max: 100_000_000 }), windowUValue: readNumber(form, 'windowUValue', { min: 0, max: 1000 }),
        floorArea: readNumber(form, 'floorArea', { min: 0, max: 100_000_000 }), floorUValue: readNumber(form, 'floorUValue', { min: 0, max: 1000 }),
        roomVolume: readNumber(form, 'roomVolume', { min: 0, max: 1_000_000_000 }),
        airChangesPerHour: readNumber(form, 'airChangesPerHour', { min: 0, max: 100 }),
      });
      const rows = [
        [copy.messages.wallLoss, `${format(result.components.walls.watts)} W`],
        [copy.messages.roofLoss, `${format(result.components.roof.watts)} W`],
        [copy.messages.windowLoss, `${format(result.components.windows.watts)} W`],
        [copy.messages.floorLoss, `${format(result.components.floor.watts)} W`],
        [copy.messages.transmissionLoss, `${format(result.transmissionWatts)} W`],
        [copy.messages.ventilationLoss, `${format(result.ventilationWatts)} W`],
        [copy.messages.totalLoss, `${format(result.totalWatts)} W (${format(result.totalBtuPerHour)} BTU/h)`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ areaUnit: 'm2', temperatureUnit: 'K', volumeUnit: 'm3', temperatureDifference: '20', wallArea: '10', wallUValue: '1', roofArea: '0', roofUValue: '0', windowArea: '0', windowUValue: '0', floorArea: '0', floorUValue: '0', roomVolume: '0', airChangesPerHour: '0' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
