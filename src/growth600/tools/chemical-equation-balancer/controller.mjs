import { balanceChemicalEquation } from './logic.mjs';
import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="chemical-equation-balancer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  let outputText = '';

  function calculate(event) {
    event?.preventDefault();
    clearResult(root);
    outputText = '';
    const input = form.elements.namedItem('equation');
    input.removeAttribute('aria-invalid');
    try {
      const result = balanceChemicalEquation(input.value);
      const rows = [
        [copy.messages.balancedEquation, result.balancedEquation],
        ...result.atomCounts.map(({ element, reactants, products }) => [`${copy.messages.atomCheck}: ${element}`, `${reactants} ${copy.messages.leftSide} = ${products} ${copy.messages.rightSide}`]),
      ];
      showRows(root, rows);
      outputText = rows.map(([heading, value]) => `${heading}: ${value}`).join('\n');
      announce(root, result.multipleSolutions ? `${copy.messages.calculated} ${copy.messages.multipleSolutions}` : copy.messages.calculated, 'success');
    } catch {
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('equation').value = 'H2 + O2 -> H2O';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => {
    outputText = '';
    form.elements.namedItem('equation').removeAttribute('aria-invalid');
    clearResult(root);
    announce(root, '');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
  });
}
