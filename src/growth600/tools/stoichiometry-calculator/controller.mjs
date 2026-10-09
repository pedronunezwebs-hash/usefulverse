import { balanceChemicalEquation } from '../chemical-equation-balancer/logic.mjs';
import { calculateStoichiometry } from './logic.mjs';
import { announce, clearResult, copyText, numberFormat, readToolCopy, showRows } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="stoichiometry-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const equation = form.elements.namedItem('equation');
  const productSelect = form.elements.namedItem('selectedProduct');
  const reactantList = root.querySelector('[data-reactant-list]');
  const format = (value, digits = 6) => numberFormat(document.documentElement.lang || 'en', value, digits);
  let outputText = '';

  function refreshEquation() {
    try {
      const balanced = balanceChemicalEquation(equation.value);
      const previous = productSelect.value;
      productSelect.replaceChildren(...balanced.products.map(({ formula, coefficient }) => {
        const option = document.createElement('option');
        option.value = formula;
        option.textContent = `${coefficient === 1 ? '' : `${coefficient} `}${formula}`;
        return option;
      }));
      if (balanced.products.some(({ formula }) => formula === previous)) productSelect.value = previous;
      reactantList.textContent = `${copy.messages.reactantsInOrder} ${balanced.reactants.map(({ formula, coefficient }, index) => `${index + 1}. ${coefficient === 1 ? '' : `${coefficient} `}${formula}`).join(' · ')}`;
      return balanced;
    } catch {
      productSelect.replaceChildren();
      reactantList.textContent = copy.messages.enterValidEquation;
      return null;
    }
  }

  function calculate(event) {
    event?.preventDefault(); clearResult(root); outputText = '';
    try {
      refreshEquation();
      const amounts = form.elements.namedItem('reactantAmounts').value.split(/\r?\n/u).map((value) => value.trim()).filter(Boolean).map(Number);
      const actualRaw = form.elements.namedItem('actualProductMass').value.trim();
      const result = calculateStoichiometry({
        equation: equation.value,
        inputMode: form.elements.namedItem('inputMode').value,
        reactantAmounts: amounts,
        selectedProduct: productSelect.value,
        actualProductMass: actualRaw || undefined,
      });
      const limiting = result.limitingReactants.join(', ');
      const rows = [
        [copy.messages.balancedEquation, result.balancedEquation],
        [copy.messages.limitingReactants, limiting],
        [copy.messages.reactionExtent, `${format(result.reactionExtent)} mol`],
        ...result.reactants.map((item) => [`${copy.messages.reactant} ${item.formula}`, `${format(item.enteredAmount)} ${result.inputMode === 'mass' ? 'g' : 'mol'} · ${format(item.moles)} mol`]),
        ...result.products.map((item) => [`${copy.messages.theoreticalProduct} ${item.formula}`, `${format(item.moles)} mol · ${format(item.mass)} g`]),
      ];
      if (result.percentYield !== undefined) rows.push([copy.messages.percentYield, `${format(result.percentYield, 4)}% (${format(result.actualProductMass)} g ${copy.messages.actualOf} ${result.selectedProduct})`]);
      showRows(root, rows);
      outputText = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
      announce(root, copy.messages.calculated, 'success');
    } catch {
      announce(root, copy.messages.checkInputs, 'error');
    }
  }

  equation.addEventListener('input', () => { refreshEquation(); clearResult(root); outputText = ''; announce(root, ''); });
  for (const name of ['inputMode', 'reactantAmounts', 'actualProductMass']) {
    form.elements.namedItem(name).addEventListener('input', () => { clearResult(root); outputText = ''; announce(root, ''); });
  }
  productSelect.addEventListener('change', () => { form.elements.namedItem('actualProductMass').value = ''; clearResult(root); outputText = ''; });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    equation.value = 'H2 + O2 -> H2O';
    form.elements.namedItem('inputMode').value = 'mass';
    form.elements.namedItem('reactantAmounts').value = '4.032\n31.998';
    form.elements.namedItem('actualProductMass').value = '18.015';
    refreshEquation();
    productSelect.value = 'H2O';
    calculate();
  });
  form.addEventListener('submit', calculate);
  form.addEventListener('reset', () => setTimeout(() => { outputText = ''; refreshEquation(); clearResult(root); announce(root, ''); }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  refreshEquation();
}
