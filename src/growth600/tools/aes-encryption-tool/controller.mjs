import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { decryptAesPayload, encryptAesPayload } from './logic.mjs';

const root = document.querySelector('[data-tool="aes-encryption-tool"]');

if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const textPanel = root.querySelector('[data-aes-text]');
  const filePanel = root.querySelector('[data-aes-file]');
  const iterationsPanel = root.querySelector('[data-aes-iterations]');
  const result = root.querySelector('[data-result]');
  const output = root.querySelector('[data-aes-output]');
  const submit = root.querySelector('[data-aes-submit]');
  const fileDownload = root.querySelector('[data-aes-download]');
  const containerDownload = root.querySelector('[data-aes-download-container]');
  let encryptedContainer = '';
  let outputUrl = '';
  let containerUrl = '';

  function clearDownloads() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    if (containerUrl) URL.revokeObjectURL(containerUrl);
    outputUrl = ''; containerUrl = '';
    fileDownload.hidden = true; fileDownload.removeAttribute('href'); fileDownload.removeAttribute('download');
    containerDownload.hidden = true;
    encryptedContainer = '';
  }

  function refreshMode() {
    const decrypt = field('operation').value === 'decrypt';
    const isFile = field('payloadType').value === 'file';
    textPanel.hidden = isFile;
    filePanel.hidden = !isFile;
    iterationsPanel.hidden = decrypt;
    submit.textContent = decrypt ? copy.actions.decrypt : copy.actions.encrypt;
    result.hidden = true;
    clearDownloads();
    output.value = '';
  }

  field('operation').addEventListener('change', refreshMode);
  field('payloadType').addEventListener('change', refreshMode);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const decrypt = field('operation').value === 'decrypt';
    const fileMode = field('payloadType').value === 'file';
    const passphrase = field('passphrase').value;
    const selectedFile = field('inputFile').files?.[0];
    if (fileMode && !selectedFile) return announce(root, copy.messages.fileRequired, 'error');
    if (!fileMode && !field('inputText').value.trim()) return announce(root, copy.messages.textRequired, 'error');
    submit.disabled = true;
    const originalLabel = submit.textContent;
    submit.textContent = copy.messages.busy;
    announce(root, copy.messages.busy, 'pending');
    result.hidden = true;
    clearDownloads();
    output.value = '';
    try {
      if (decrypt) {
        const serialized = fileMode ? await selectedFile.text() : field('inputText').value;
        const restored = await decryptAesPayload(serialized, passphrase);
        if (restored.kind === 'text') output.value = restored.text;
        else {
          output.value = `${restored.name} · ${restored.mimeType} · ${restored.bytes.byteLength.toLocaleString()} bytes`;
          outputUrl = URL.createObjectURL(new Blob([restored.bytes], { type: restored.mimeType || 'application/octet-stream' }));
          fileDownload.href = outputUrl;
          fileDownload.download = restored.name;
          fileDownload.hidden = false;
        }
        announce(root, copy.messages.decrypted, 'success');
      } else {
        const payload = fileMode
          ? { kind: 'file', bytes: new Uint8Array(await selectedFile.arrayBuffer()), name: selectedFile.name, mimeType: selectedFile.type }
          : { kind: 'text', text: field('inputText').value };
        encryptedContainer = await encryptAesPayload(payload, passphrase, Number(field('iterations').value));
        output.value = encryptedContainer;
        containerUrl = URL.createObjectURL(new Blob([encryptedContainer], { type: 'application/json;charset=utf-8' }));
        containerDownload.hidden = false;
        announce(root, copy.messages.encrypted, 'success');
      }
      result.hidden = false;
    } catch (error) {
      const cryptoUnavailable = /Web Crypto is unavailable/u.test(error?.message ?? '');
      const knownInputError = error instanceof RangeError || error instanceof TypeError;
      announce(root, decrypt && !knownInputError ? copy.messages.wrongKey : cryptoUnavailable ? copy.messages.cryptoUnavailable : knownInputError ? copy.messages.checkInputs : copy.messages.wrongKey, 'error');
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    field('operation').value = 'encrypt'; field('payloadType').value = 'text'; refreshMode();
    field('inputText').value = 'Private message: keep this content on this device.';
    announce(root, copy.messages.exampleLoaded, 'success');
    field('passphrase').focus();
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    form.reset(); refreshMode(); announce(root, '', ''); field('inputText').focus();
  });

  root.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    if (!output.value) return;
    await copyText(root, output.value, copy);
  });

  containerDownload.addEventListener('click', () => {
    if (!encryptedContainer) return;
    const url = containerUrl || URL.createObjectURL(new Blob([encryptedContainer], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'usefulverse-aes-container.json'; link.click();
    announce(root, copy.messages.downloaded, 'success');
  });

  refreshMode();
}
