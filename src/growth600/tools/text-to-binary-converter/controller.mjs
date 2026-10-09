import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { decodeBinaryToText, encodeTextToBinary } from './logic.mjs';

const root = document.querySelector('[data-tool="text-to-binary-converter"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const mode = form.elements.namedItem('mode');
  const textInput = form.elements.namedItem('textInput');
  const binaryInput = form.elements.namedItem('binaryInput');
  const groupBytes = form.elements.namedItem('groupBytes');
  const textField = root.querySelector('[data-text-input]');
  const binaryField = root.querySelector('[data-binary-input]');
  const output = root.querySelector('[data-binary-output]');
  let outputText = '';

  function clear() {
    clearResult(root);
    output.value = '';
    outputText = '';
  }

  function syncMode() {
    const encoding = mode.value === 'encode';
    textField.hidden = !encoding;
    binaryField.hidden = encoding;
    textInput.disabled = !encoding;
    textInput.required = encoding;
    binaryInput.disabled = encoding;
    binaryInput.required = !encoding;
    groupBytes.disabled = !encoding;
    clear();
    announce(root, '');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clear();
    try {
      outputText = mode.value === 'encode'
        ? encodeTextToBinary(textInput.value, { groupBytes: groupBytes.checked })
        : decodeBinaryToText(binaryInput.value);
      output.value = outputText;
      root.querySelector('[data-result]').hidden = false;
      announce(root, copy.messages.converted, 'success');
    } catch (error) {
      announce(root, copy.messages[error.message] ?? copy.messages.invalid, 'error');
    }
  });
  form.addEventListener('input', () => { clear(); announce(root, ''); });
  mode.addEventListener('change', syncMode);
  form.addEventListener('reset', () => queueMicrotask(() => { syncMode(); textInput.value = copy.exampleText; binaryInput.value = copy.exampleBinary; }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'encode';
    textInput.value = copy.exampleText;
    binaryInput.value = copy.exampleBinary;
    groupBytes.checked = true;
    syncMode();
    textInput.value = copy.exampleText;
    form.requestSubmit();
  });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => {
    if (outputText) copyText(root, outputText, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!outputText) return announce(root, copy.messages.invalid, 'error');
    const url = URL.createObjectURL(new Blob([outputText], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'text-binary-conversion.txt'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  syncMode();
  textInput.value = copy.exampleText;
  binaryInput.value = copy.exampleBinary;
}
