import { calculateDeck, DECK_LENGTH_TO_M } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="deck-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const locale = document.documentElement.lang || 'en';
  const messages = copy.messages;
  let outputText = '';
  const format = (value) => numberFormat(locale, value, 2);
  const unit = () => form.elements.namedItem('unit').value;
  const boardUnit = () => form.elements.namedItem('boardUnit').value;
  const displayLength = (metres) => `${format(metres / DECK_LENGTH_TO_M[unit()])} ${unit()}`;

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = calculateDeck({
        length: readNumber(form, 'length', { min: 0.1, max: 100_000 }),
        width: readNumber(form, 'width', { min: 0.1, max: 100_000 }),
        unit: unit(),
        boardUnit: boardUnit(),
        boardWidth: readNumber(form, 'boardWidth', { min: 0.01 / DECK_LENGTH_TO_M[boardUnit()], max: 2 / DECK_LENGTH_TO_M[boardUnit()] }),
        gap: readNumber(form, 'gap', { min: 0, max: 0.05 / DECK_LENGTH_TO_M[boardUnit()] }),
        stockBoardLength: readNumber(form, 'stockBoardLength', { min: 0.1, max: 25_000 }),
        joistSpacing: readNumber(form, 'joistSpacing', { min: 0.1 / DECK_LENGTH_TO_M[boardUnit()], max: 1_500 / DECK_LENGTH_TO_M[boardUnit()] }),
        wastePercent: readNumber(form, 'wastePercent', { min: 0, max: 30 }),
        fastenersPerIntersection: readNumber(form, 'fastenersPerIntersection', { min: 1, max: 20, integer: true }),
        pricePerBoard: readNumber(form, 'pricePerBoard', { optional: true, min: 0, max: 1_000_000 }),
      });
      const rows = [
        [messages.area, `${format(result.areaM2 / (DECK_LENGTH_TO_M[unit()] ** 2))} ${unit()}²`],
        [messages.boardRows, format(result.rows)],
        [messages.coveredWidth, displayLength(result.coveredWidthM)],
        [messages.orderLength, displayLength(result.orderLinearMetres)],
        [messages.boards, format(result.boards)],
        [messages.supportLines, format(result.supportLines)],
        [messages.fasteners, format(result.estimatedFasteners)],
        [messages.joints, format(result.totalJoints)],
      ];
      if (result.estimatedCost !== null) rows.push([messages.estimatedCost, format(result.estimatedCost)]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, messages.calculated, 'success');
    } catch {
      announce(root, messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    for (const [name, value] of Object.entries({ unit: 'ft', length: '16', width: '12', boardUnit: 'in', boardWidth: '5.5', gap: '0.25', stockBoardLength: '16', joistSpacing: '16', wastePercent: '10', fastenersPerIntersection: '2', pricePerBoard: '' })) form.elements.namedItem(name).value = value;
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    for (const field of form.querySelectorAll('[aria-invalid]')) field.removeAttribute('aria-invalid');
    clearResult(root); announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
