import { AES_MAX_INPUT_BYTES, AES_MAX_TEXT_BYTES, AES_MAX_TEXT_ENVELOPE_CHARS, decryptFile, decryptText, encryptFile, encryptText } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="aes-encryption-tool"]');

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const actionMode = form.elements.namedItem('mode');
  const contentMode = form.elements.namedItem('contentMode');
  const sourceText = form.elements.namedItem('sourceText');
  const sourceFile = form.elements.namedItem('sourceFile');
  const password = form.elements.namedItem('password');
  const textInput = root.querySelector('[data-text-input]');
  const fileInput = root.querySelector('[data-file-input]');
  const result = root.querySelector('[data-result]');
  const resultText = root.querySelector('[data-output-text]');
  const textResultParts = root.querySelectorAll('[data-text-result]');
  const fileResult = root.querySelector('[data-file-result]');
  const fileName = root.querySelector('[data-file-name]');
  const processButton = root.querySelector('[data-action="process"]');
  const copyButton = root.querySelector('[data-action="copy"]');
  const downloadButton = root.querySelector('[data-action="download"]');
  let outputText = '';
  let outputBlob = null;
  let outputName = '';

  function clearOutput() {
    result.hidden = true;
    resultText.value = '';
    outputText = '';
    outputBlob = null;
    outputName = '';
    copyButton.hidden = true;
    downloadButton.hidden = true;
  }

  function updateMode() {
    const textMode = contentMode.value === 'text';
    textInput.hidden = !textMode;
    fileInput.hidden = textMode;
    sourceText.disabled = !textMode;
    sourceText.required = textMode;
    sourceFile.disabled = textMode;
    sourceFile.required = !textMode;
    for (const element of textResultParts) element.hidden = !textMode;
    fileResult.hidden = textMode;
    processButton.textContent = actionMode.value === 'encrypt' ? copy.actions.process : copy.fields.decryptMode;
    clearOutput();
  }

  function errorMessage(error) {
    if (error?.message?.includes('Decryption failed')) return copy.messages.wrongOrDamaged;
    if (error?.message?.includes('Web Crypto') || error?.message?.includes('Crypto is unavailable')) return copy.messages.unsupportedCrypto;
    if (error?.message?.includes('16 MiB') || error?.message?.includes('1 MiB') || error?.message?.includes('size limit')) return copy.messages.fileTooLarge;
    return copy.messages.checkInputs;
  }

  async function process(event) {
    event?.preventDefault();
    clearOutput();
    processButton.disabled = true;
    announce(root, copy.messages.working, 'info');
    try {
      const passphrase = password.value;
      const encrypting = actionMode.value === 'encrypt';
      if (!['encrypt', 'decrypt'].includes(actionMode.value)) throw new TypeError('Invalid action.');
      if (contentMode.value === 'text') {
        if (sourceText.value.length > AES_MAX_TEXT_ENVELOPE_CHARS) throw new RangeError('Text size limit.');
        outputText = encrypting
          ? await encryptText(sourceText.value, passphrase)
          : await decryptText(sourceText.value, passphrase);
        resultText.value = outputText;
        outputName = encrypting ? 'usefulverse-encrypted-text.json' : 'usefulverse-decrypted-text.txt';
        outputBlob = new Blob([outputText], { type: encrypting ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' });
        copyButton.hidden = false;
        fileResult.hidden = true;
        for (const element of textResultParts) element.hidden = false;
      } else {
        const selectedFile = sourceFile.files?.[0];
        if (!selectedFile) throw new TypeError('Choose a file.');
        if (selectedFile.size > AES_MAX_INPUT_BYTES + 8192) throw new RangeError('File size limit.');
        const input = new Uint8Array(await selectedFile.arrayBuffer());
        if (encrypting) {
          const encrypted = await encryptFile(input, { password: passphrase, fileName: selectedFile.name, mimeType: selectedFile.type });
          outputBlob = new Blob([encrypted], { type: 'application/octet-stream' });
          outputName = `${selectedFile.name}.uvenc`;
          announce(root, copy.messages.encrypted, 'success');
        } else {
          const decrypted = await decryptFile(input, passphrase);
          outputBlob = new Blob([decrypted.bytes], { type: decrypted.mimeType });
          outputName = decrypted.fileName;
          announce(root, copy.messages.decrypted, 'success');
        }
        fileName.textContent = outputName;
        fileResult.hidden = false;
        for (const element of textResultParts) element.hidden = true;
      }
      result.hidden = false;
      downloadButton.hidden = false;
      if (contentMode.value === 'text') announce(root, encrypting ? copy.messages.encrypted : copy.messages.decrypted, 'success');
    } catch (error) {
      clearOutput();
      announce(root, errorMessage(error), 'error');
    } finally {
      processButton.disabled = false;
    }
  }

  form.addEventListener('submit', process);
  actionMode.addEventListener('change', updateMode);
  contentMode.addEventListener('change', updateMode);
  sourceText.addEventListener('input', clearOutput);
  sourceFile.addEventListener('change', clearOutput);
  password.addEventListener('input', clearOutput);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    actionMode.value = 'encrypt';
    contentMode.value = 'text';
    sourceText.value = 'A short example message to encrypt in your browser.';
    updateMode();
    sourceText.focus();
  });
  copyButton.addEventListener('click', () => { if (outputText) copyText(root, outputText, copy); });
  downloadButton.addEventListener('click', () => {
    if (!outputBlob || !outputName) return;
    const url = URL.createObjectURL(outputBlob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = outputName;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(root, copy.messages.downloaded, 'success');
  });
  updateMode();
}
