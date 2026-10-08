import { calculateLaplaceTransform } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="laplace-transform-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const direction = form.elements.namedItem('direction');
  const expression = form.elements.namedItem('expression');
  const result = root.querySelector('[data-laplace-result]');
  const output = root.querySelector('[data-laplace-output]');
  const region = root.querySelector('[data-laplace-region]');
  const exampleButton = root.querySelector('[data-action="example"]');
  const forwardHint = root.querySelector('[data-laplace-forward-hint]');
  const inverseHint = root.querySelector('[data-laplace-inverse-hint]');

  function clearResult() {
    result.hidden = true;
    output.replaceChildren();
    region.textContent = '';
  }

  function loadExample() {
    if (direction.value === 'inverse') {
      expression.value = copy.fields.inverseExample;
    } else {
      expression.value = copy.fields.forwardExample;
    }
    clearResult();
    announce(root, copy.messages.exampleLoaded, 'info');
  }

  function updateMode() {
    expression.value = direction.value === 'inverse' ? copy.fields.inverseExample : copy.fields.forwardExample;
    forwardHint.hidden = direction.value === 'inverse';
    inverseHint.hidden = direction.value !== 'inverse';
    clearResult();
    announce(root, '');
  }

  direction.addEventListener('change', updateMode);
  expression.addEventListener('input', clearResult);
  exampleButton.addEventListener('click', loadExample);
  form.addEventListener('reset', () => {
    queueMicrotask(() => {
      direction.value = 'forward';
      expression.value = copy.fields.forwardExample;
      forwardHint.hidden = false;
      inverseHint.hidden = true;
      clearResult();
    });
    announce(root, '');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult();
    try {
      const report = calculateLaplaceTransform(expression.value, direction.value);
      const list = document.createElement('ul');
      for (const term of report.terms) {
        const item = document.createElement('li');
        item.textContent = typeof term === 'string' ? term : `${term.expression} · ${copy.fields.region}: ${term.region}`;
        list.append(item);
      }
      output.replaceChildren(list);
      region.textContent = direction.value === 'inverse' ? copy.fields.inverseConvention : copy.fields.forwardConvention;
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      announce(root, error instanceof RangeError ? error.message : copy.messages.checkInputs, 'error');
    }
  });
}
