import { calculateEigenpairs } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="eigenvalue-calculator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-eigen-result]');
  const output = root.querySelector('[data-eigen-output]');
  const number = new Intl.NumberFormat(document.documentElement.lang || undefined, { maximumSignificantDigits: 8 });
  let latest = '';
  const clear = (message = '') => { result.hidden = true; output.replaceChildren(); latest = ''; announce(root, message); };

  form.addEventListener('input', () => clear());
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const matrixText = form.elements.namedItem('matrix').value;
    try {
      const report = calculateEigenpairs(matrixText);
      const list = document.createElement('ol');
      list.className = 'eigenvalue-results__list';
      const lines = [];
      report.eigenpairs.forEach(({ eigenvalue, eigenvector, residual }, index) => {
        const item = document.createElement('li');
        const heading = document.createElement('h3');
        heading.textContent = `${copy.fields.eigenvalue} ${index + 1}: ${number.format(eigenvalue)}`;
        const vector = document.createElement('p');
        vector.textContent = `${copy.fields.eigenvector}: [${eigenvector.map((value) => number.format(value)).join(', ')}]`;
        const error = document.createElement('p');
        error.textContent = `${copy.fields.residual}: ${number.format(residual)}`;
        item.append(heading, vector, error); list.append(item);
        lines.push(`${copy.fields.eigenvalue} ${index + 1}: ${number.format(eigenvalue)}`, `${copy.fields.eigenvector}: ${eigenvector.map((value) => number.format(value)).join(', ')}`, `${copy.fields.residual}: ${number.format(residual)}`);
      });
      output.replaceChildren(list);
      latest = lines.join('\n');
      result.hidden = false;
      announce(root, copy.messages.calculated);
    } catch (error) {
      clear(copy.messages[error?.code] ?? copy.messages.checkInputs);
    }
  });
  form.querySelector('[data-action="example"]').addEventListener('click', () => {
    form.elements.namedItem('matrix').value = '2, 0\n0, 3';
    form.requestSubmit();
    announce(root, copy.messages.exampleLoaded);
  });
  form.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    if (!latest) return;
    try { await navigator.clipboard.writeText(latest); announce(root, copy.messages.copied); }
    catch { announce(root, copy.messages.copyUnavailable); }
  });
  form.addEventListener('reset', () => queueMicrotask(() => clear()));
}
