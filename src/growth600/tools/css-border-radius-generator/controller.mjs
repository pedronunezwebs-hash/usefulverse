import { buildBorderRadiusCss } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="css-border-radius-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const output = form.elements.namedItem('output');
  const preview = root.querySelector('[data-radius-preview]');
  const cornerNames = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
  let currentCss = '';

  function update() {
    const unit = form.elements.namedItem('unit').value;
    for (const input of form.querySelectorAll('input[type="number"]')) {
      input.max = unit === '%' ? '100' : '500';
      input.setAttribute('aria-label', `${input.name.replace(/([XY])$/u, '')} ${input.name.endsWith('X') ? copy.fields.horizontal : copy.fields.vertical}`);
    }
    try {
      const horizontal = cornerNames.map((name) => form.elements.namedItem(`${name}X`).value);
      const vertical = cornerNames.map((name) => form.elements.namedItem(`${name}Y`).value);
      const built = buildBorderRadiusCss({ horizontal, vertical, unit });
      currentCss = built.css;
      output.value = currentCss;
      preview.style.borderRadius = built.value;
      announce(root, copy.messages.updated, 'info');
      return true;
    } catch {
      currentCss = '';
      output.value = '';
      preview.style.borderRadius = '0';
      announce(root, copy.messages.invalid, 'error');
      return false;
    }
  }

  function syncCorners(changed) {
    if (!form.elements.namedItem('linkCorners').checked) return;
    const axis = changed.name.endsWith('X') ? 'X' : 'Y';
    const value = changed.value;
    for (const name of cornerNames) form.elements.namedItem(`${name}${axis}`).value = value;
    const otherAxis = axis === 'X' ? 'Y' : 'X';
    const otherValue = form.elements.namedItem(`topLeft${otherAxis}`).value;
    for (const name of cornerNames) form.elements.namedItem(`${name}${otherAxis}`).value = otherValue;
  }

  form.addEventListener('input', (event) => {
    if (event.target.matches('input[type="number"]')) syncCorners(event.target);
    update();
  });
  form.elements.namedItem('unit').addEventListener('change', update);
  form.elements.namedItem('linkCorners').addEventListener('change', (event) => {
    if (event.target.checked) {
      for (const name of cornerNames) {
        form.elements.namedItem(`${name}X`).value = form.elements.namedItem('topLeftX').value;
        form.elements.namedItem(`${name}Y`).value = form.elements.namedItem('topLeftY').value;
      }
    }
    update();
  });
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    form.elements.namedItem('unit').value = 'px';
    form.elements.namedItem('linkCorners').checked = false;
    [[32, 22], [100, 40], [20, 70], [64, 26]].forEach(([x, y], index) => {
      form.elements.namedItem(`${cornerNames[index]}X`).value = String(x);
      form.elements.namedItem(`${cornerNames[index]}Y`).value = String(y);
    });
    update();
    announce(root, copy.messages.exampleLoaded, 'success');
  });
  form.addEventListener('reset', () => setTimeout(() => {
    form.elements.namedItem('linkCorners').checked = false;
    update();
    announce(root, copy.messages.reset, 'info');
  }, 0));
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (currentCss) copyText(root, currentCss, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!currentCss) { announce(root, copy.messages.invalid, 'error'); return; }
    const url = URL.createObjectURL(new Blob([currentCss], { type: 'text/css;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'border-radius.css';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  update();
}
