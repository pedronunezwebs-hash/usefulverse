import { announce, clearResult, copyText, readToolCopy } from '../controller-helpers.mjs';
import { BINARY_BASE64_LIMITS, encodeBinaryFile } from './logic.mjs';

const root = document.querySelector('[data-tool="binary-base64-tool"]');
if (root) {
  const form = root.querySelector('#tool-form'); const copy = readToolCopy(root);
  const fileField = form.elements.namedItem('binaryFile'); const formatField = form.elements.namedItem('outputFormat');
  const output = root.querySelector('[data-base64-output]'); const meta = root.querySelector('[data-base64-meta]');
  const imagePreview = root.querySelector('[data-base64-preview]'); const imageAlt = copy.fields.imagePreview;
  let encoded = null; let previewUrl = '';

  function revokePreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = ''; imagePreview.removeAttribute('src'); imagePreview.hidden = true;
  }
  function currentText() { return encoded ? (formatField.value === 'base64' ? encoded.base64 : encoded.dataUri) : ''; }
  function render() {
    output.value = currentText();
    meta.textContent = encoded ? `${copy.fields.mimeType}: ${encoded.mimeType} · ${copy.fields.fileSize}: ${encoded.byteLength.toLocaleString(copy.copyLanguage)} ${copy.fields.bytes} · ${copy.fields.outputSize}: ${encoded.base64.length.toLocaleString(copy.copyLanguage)} ${copy.fields.characters}` : '';
  }
  function clear() { encoded = null; revokePreview(); clearResult(root); output.value = ''; meta.textContent = ''; }
  function fail(message) { clear(); announce(root, copy.messages[message] ?? copy.messages.invalid, 'error'); }

  async function convert(event) {
    event?.preventDefault(); clear(); announce(root, '');
    const file = fileField.files?.[0];
    if (!file) { fail('emptyFile'); return; }
    if (file.size > BINARY_BASE64_LIMITS.inputBytes) { fail('tooLarge'); return; }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      encoded = encodeBinaryFile(bytes, file.type);
      render();
      const section = root.querySelector('[data-result]'); section.hidden = false;
      if (encoded.previewableImage) { previewUrl = URL.createObjectURL(new Blob([bytes], { type: encoded.mimeType })); imagePreview.src = previewUrl; imagePreview.alt = imageAlt; imagePreview.hidden = false; }
      announce(root, copy.messages.encoded, 'success');
    } catch (error) { fail(error.message === 'tooLarge' ? 'tooLarge' : 'fileReadError'); }
  }

  form.addEventListener('submit', convert);
  formatField.addEventListener('change', render);
  fileField.addEventListener('change', () => { clear(); announce(root, ''); });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', () => encoded && copyText(root, currentText(), copy));
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!encoded) { announce(root, copy.messages.convertFirst, 'error'); return; }
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([currentText()], { type: 'text/plain;charset=utf-8' })); link.download = 'binary-data.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000); announce(root, copy.messages.downloaded, 'success');
  });
  form.addEventListener('reset', () => queueMicrotask(() => { clear(); announce(root, ''); }));
  window.addEventListener('pagehide', revokePreview, { once: true });
}
