import { calculateRetainingWall } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="retaining-wall-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const locale = document.documentElement.lang || 'en';
  const format = (value, digits = 2) => numberFormat(locale, value, digits);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateRetainingWall({
        wallLength: readNumber(form, 'wallLength', { min: 0.01, max: 100_000 }),
        wallHeight: readNumber(form, 'wallHeight', { min: 0, max: 10_000 }),
        wallUnit: form.elements.namedItem('wallUnit').value,
        blockLength: readNumber(form, 'blockLength', { min: 0.1, max: 100_000 }),
        blockHeight: readNumber(form, 'blockHeight', { min: 0.1, max: 100_000 }),
        blockDepth: readNumber(form, 'blockDepth', { min: 0.1, max: 100_000 }),
        blockUnit: form.elements.namedItem('blockUnit').value,
        joint: readNumber(form, 'joint', { min: 0, max: 1_000 }),
        baseWidth: readNumber(form, 'baseWidth', { min: 0, max: 10_000 }),
        baseDepth: readNumber(form, 'baseDepth', { min: 0, max: 10_000 }),
        backfillThickness: readNumber(form, 'backfillThickness', { min: 0, max: 10_000 }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 50 }),
      });
      const metric = form.elements.namedItem('wallUnit').value === 'm';
      const volumeUnit = metric ? 'm³' : 'ft³';
      const base = metric ? result.baseOrderM3 : result.baseOrderFt3;
      const backfill = metric ? result.backfillOrderM3 : result.backfillOrderFt3;
      const rows = [
        [copy.messages.courses, format(result.courses, 0)],
        [copy.messages.blocksPerCourse, format(result.blocksPerCourse, 0)],
        [copy.messages.blocksBeforeWaste, format(result.blocksBeforeWaste, 0)],
        [copy.messages.blocksToOrder, format(result.blocksToOrder, 0)],
        [copy.messages.baseMaterial, `${format(base, 3)} ${volumeUnit}`],
        [copy.messages.backfill, `${format(backfill, 3)} ${volumeUnit}`],
      ];
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ wallLength: '20', wallHeight: '4', wallUnit: 'ft', blockLength: '16', blockHeight: '6', blockDepth: '12', blockUnit: 'in', joint: '0.25', baseWidth: '2', baseDepth: '0.5', backfillThickness: '1', wastePercent: '5' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
