import { solveRealPolynomial } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="cubic-quartic-equation-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const degree = form.elements.namedItem('degree');
  const leadingQuartic = root.querySelector('[data-quartic-only]');
  const result = root.querySelector('[data-equation-result]');
  const output = root.querySelector('[data-equation-output]');

  function clearResult() {
    result.hidden = true;
    output.replaceChildren();
  }

  function updateDegree() {
    const isQuartic = degree.value === '4';
    leadingQuartic.hidden = !isQuartic;
    form.elements.namedItem('a4').disabled = !isQuartic;
    clearResult();
    announce(root, '');
  }

  function value(name) {
    return form.elements.namedItem(name).value;
  }

  function showError(error) {
    announce(root, copy.messages[error?.code] ?? copy.messages.checkInputs, 'error');
  }

  function loadExample() {
    degree.value = '3';
    form.elements.namedItem('a4').value = '0';
    form.elements.namedItem('a3').value = '1';
    form.elements.namedItem('a2').value = '0';
    form.elements.namedItem('a1').value = '0';
    form.elements.namedItem('a0').value = '-1';
    updateDegree();
    announce(root, copy.messages.exampleLoaded, 'info');
  }

  degree.addEventListener('change', updateDegree);
  form.addEventListener('input', clearResult);
  form.addEventListener('change', clearResult);
  root.querySelector('[data-action="example"]').addEventListener('click', loadExample);
  form.addEventListener('reset', () => {
    queueMicrotask(() => {
      degree.value = '3';
      updateDegree();
      clearResult();
    });
    announce(root, '');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult();
    try {
      const order = Number(degree.value);
      const coefficients = order === 4 ? [value('a4'), value('a3'), value('a2'), value('a1'), value('a0')] : [value('a3'), value('a2'), value('a1'), value('a0')];
      const report = solveRealPolynomial({ degree: order, coefficients });
      const locale = document.documentElement.lang || 'en';
      const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 8 });
      const scientific = new Intl.NumberFormat(locale, { notation: 'scientific', maximumFractionDigits: 2 });
      const lines = [];
      if (!report.roots.length) {
        lines.push(copy.fields.noRealRoots);
      } else {
        report.roots.forEach((rootValue, index) => {
          lines.push(`${copy.fields.root} ${index + 1}: ${number.format(rootValue.value)}`);
          lines.push(`  ${copy.fields.multiplicity}: ${number.format(rootValue.multiplicity)}`);
          lines.push(`  ${copy.fields.residual}: ${scientific.format(rootValue.residual)}`);
        });
        if (report.hasNonRealRoots) lines.push(copy.fields.nonRealRootsNote);
      }
      const text = document.createElement('pre');
      text.textContent = lines.join('\n');
      output.replaceChildren(text);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      showError(error);
    }
  });
  updateDegree();
}
