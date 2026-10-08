import { optimizeLumberCuts, parseCutList } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readNumber, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="lumber-cut-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const format = (value) => numberFormat(document.documentElement.lang || 'en', value, 2);
  let outputText = '';
  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      const result = optimizeLumberCuts({
        stockLength: readNumber(form, 'stockLength', { min: 0.001, max: 100_000_000 }),
        kerf: readNumber(form, 'kerf', { min: 0, max: 100_000_000 }),
        cuts: parseCutList(form.elements.namedItem('cutList').value),
      });
      const rows = [
        [copy.messages.stockBoards, result.boardCount],
        [copy.messages.pieces, result.pieceCount],
        [copy.messages.totalStock, format(result.totalStockLength)],
        [copy.messages.totalCut, format(result.totalCutLength)],
        [copy.messages.totalKerf, format(result.totalKerf)],
        [copy.messages.totalOffcut, format(result.totalOffcut)],
        [copy.messages.lowerBound, result.theoreticalLowerBound],
        ...result.boards.map((board) => [
          `${copy.messages.board} ${board.number}`,
          `${board.cuts.map(format).join(' + ')} ${copy.messages.remaining}: ${format(board.remainder)}; ${copy.messages.kerf}: ${format(board.kerfUsed)}`,
        ]),
      ];
      const resultContent = root.querySelector('[data-result-content]');
      resultContent.replaceChildren(...rows.map(([name, value]) => {
        const row = document.createElement('p');
        const strong = document.createElement('strong'); strong.textContent = `${name}: `;
        row.append(strong, document.createTextNode(String(value))); return row;
      }));
      root.querySelector('[data-result]').hidden = false;
      outputText = rows.map(([name, value]) => `${name}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      announce(root, error instanceof Error ? error.message : copy.messages.checkInputs, 'error');
    }
  }
  form.addEventListener('submit', calculate);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('stockLength').value = '2400';
    form.elements.namedItem('kerf').value = '3';
    form.elements.namedItem('cutList').value = '1200 x 1\n800 x 1\n390 x 1';
    calculate();
  });
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
}
