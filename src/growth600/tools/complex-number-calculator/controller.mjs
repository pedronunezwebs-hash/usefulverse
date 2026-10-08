import { calculateComplexOperation } from './logic.mjs';
import { announce, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="complex-number-calculator"]');
if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const operation = form.elements.namedItem('operation');
  const result = root.querySelector('[data-complex-result]');
  const output = root.querySelector('[data-complex-output]');
  const rectangularFields = [...root.querySelectorAll('[data-complex-rect]')];
  const polarFields = [...root.querySelectorAll('[data-complex-polar]')];
  const operandBFields = [...root.querySelectorAll('[data-complex-b]')];
  const rootDegreeFields = [...root.querySelectorAll('[data-complex-degree]')];

  function clearResult() {
    result.hidden = true;
    output.replaceChildren();
  }

  function setFields(fields, visible) {
    for (const field of fields) {
      field.hidden = !visible;
      const control = field.querySelector('input, select');
      if (control) control.disabled = !visible;
    }
  }

  function updateOperation() {
    const selected = operation.value;
    const isPolarInput = selected === 'polarToRectangular';
    const needsB = ['add', 'subtract', 'multiply', 'divide'].includes(selected);
    const needsDegree = selected === 'roots';
    setFields(rectangularFields, !isPolarInput);
    setFields(polarFields, isPolarInput);
    setFields(operandBFields, needsB);
    setFields(rootDegreeFields, needsDegree);
    clearResult();
    announce(root, '');
  }

  function value(name) {
    return form.elements.namedItem(name).value;
  }

  function format(number, scientific = false) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', scientific
      ? { notation: 'scientific', maximumFractionDigits: 6 }
      : { maximumFractionDigits: 8 }).format(number);
  }

  function complexLines(value, prefix = '') {
    const lines = [
      `${prefix}${copy.fields.resultReal}: ${format(value.real)}`,
      `${prefix}${copy.fields.resultImaginary}: ${format(value.imaginary)}`,
      `${prefix}${copy.fields.modulus}: ${format(value.modulus)}`,
    ];
    if (value.angleDefined) {
      lines.push(`${prefix}${copy.fields.argument}: ${format(value.argument)} ${copy.fields[value.angleUnit]}`);
      lines.push(`${prefix}${copy.fields.polar}: ${format(value.modulus)} ∠ ${format(value.argument)} ${copy.fields[value.angleUnit]}`);
    } else {
      lines.push(`${prefix}${copy.fields.zeroArgumentNote}`);
    }
    return lines;
  }

  function showError(error) {
    announce(root, copy.messages[error?.code] ?? copy.messages.checkInputs, 'error');
  }

  function loadExample() {
    operation.value = 'multiply';
    form.elements.namedItem('realA').value = '0';
    form.elements.namedItem('imaginaryA').value = '1';
    form.elements.namedItem('realB').value = '0';
    form.elements.namedItem('imaginaryB').value = '1';
    updateOperation();
    announce(root, copy.messages.exampleLoaded, 'info');
  }

  operation.addEventListener('change', updateOperation);
  form.addEventListener('input', clearResult);
  form.addEventListener('change', clearResult);
  root.querySelector('[data-action="example"]').addEventListener('click', loadExample);
  form.addEventListener('reset', () => {
    queueMicrotask(() => {
      operation.value = 'add';
      updateOperation();
      clearResult();
    });
    announce(root, '');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearResult();
    try {
      const report = calculateComplexOperation({
        operation: operation.value,
        realA: value('realA'), imaginaryA: value('imaginaryA'), realB: value('realB'), imaginaryB: value('imaginaryB'),
        radius: value('radius'), angle: value('angle'), degree: value('degree'), angleUnit: value('angleUnit'),
      });
      const lines = [];
      if (report.roots) {
        report.roots.forEach((complexRoot, index) => lines.push(...complexLines(complexRoot, `${copy.fields.rootNumber} ${index + 1}/${report.roots.length} · `), ''));
      } else if (report.operation === 'magnitude') {
        lines.push(`${copy.fields.modulus}: ${format(report.value)}`);
      } else if (report.operation === 'argument') {
        lines.push(`${copy.fields.argument}: ${format(report.value)} ${copy.fields[report.angleUnit]}`);
      } else if (report.operation === 'rectangularToPolar') {
        lines.push(`${copy.fields.modulus}: ${format(report.value.radius)}`);
        if (report.value.angle === null) lines.push(copy.fields.zeroArgumentNote);
        else lines.push(`${copy.fields.argument}: ${format(report.value.angle)} ${copy.fields[report.value.angleUnit]}`);
      } else {
        lines.push(...complexLines(report.result));
      }
      const text = document.createElement('pre');
      text.textContent = lines.join('\n').trim();
      output.replaceChildren(text);
      result.hidden = false;
      announce(root, copy.messages.calculated, 'success');
    } catch (error) {
      showError(error);
    }
  });
  updateOperation();
}
