import { calculateVectorOperation } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="vector-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const dimension = form.elements.namedItem('dimension');
  const operation = form.elements.namedItem('operation');
  const result = root.querySelector('[data-vector-result]');
  const output = root.querySelector('[data-vector-output]');
  const zFields = [...root.querySelectorAll('[data-vector-z]')];

  function clearResult() {
    result.hidden = true;
    output.replaceChildren();
  }

  function updateDimension() {
    const is2d = dimension.value === '2';
    for (const field of zFields) {
      field.hidden = is2d;
      field.querySelector('input').disabled = is2d;
    }
    clearResult();
    announce(root, '');
  }

  function showError(error) {
    const message = copy.messages[error?.code] ?? copy.messages.checkInputs;
    announce(root, message, 'error');
  }

  function loadExample() {
    dimension.value = '3';
    operation.value = 'cross';
    form.elements.namedItem('ax').value = '1';
    form.elements.namedItem('ay').value = '0';
    form.elements.namedItem('az').value = '0';
    form.elements.namedItem('bx').value = '0';
    form.elements.namedItem('by').value = '1';
    form.elements.namedItem('bz').value = '0';
    updateDimension();
    announce(root, copy.messages.exampleLoaded, 'info');
  }

  dimension.addEventListener('change', updateDimension);
  operation.addEventListener('change', () => {
    clearResult();
    announce(root, '');
  });
  form.addEventListener('input', clearResult);
  form.addEventListener('change', clearResult);
  root.querySelector('[data-action="example"]').addEventListener('click', loadExample);
  form.addEventListener('reset', () => {
    queueMicrotask(() => {
      dimension.value = '2';
      operation.value = 'dot';
      updateDimension();
      clearResult();
    });
    announce(root, '');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult();
    try {
      const report = calculateVectorOperation({
        dimension: dimension.value,
        operation: operation.value,
        vectorA: [form.elements.namedItem('ax').value, form.elements.namedItem('ay').value, form.elements.namedItem('az').value],
        vectorB: [form.elements.namedItem('bx').value, form.elements.namedItem('by').value, form.elements.namedItem('bz').value],
      });
      const formatter = new Intl.NumberFormat(document.documentElement.lang || 'en', { maximumFractionDigits: 6 });
      const formattedResult = report.kind === 'vector' ? `(${report.result.map((value) => formatter.format(value)).join(', ')})` : formatter.format(report.result[0]);
      const lines = [
        `${copy.fields.result}: ${formattedResult}${report.kind === 'z-component' ? ` ${copy.fields.zComponent}` : ''}`,
        `${copy.fields.magnitudeAResult}: ${formatter.format(report.magnitudeA)}`,
        `${copy.fields.magnitudeBResult}: ${formatter.format(report.magnitudeB)}`,
        `${copy.fields.dotProductResult}: ${formatter.format(report.dotProduct)}`,
      ];
      const text = document.createElement('pre');
      text.textContent = lines.join('\n');
      output.replaceChildren(text);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      showError(error);
    }
  });
  updateDimension();
}
