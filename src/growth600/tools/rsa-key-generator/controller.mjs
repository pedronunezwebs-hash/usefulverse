import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { decryptRsaMessage, encryptRsaMessage, generateRsaKeyPair } from './logic.mjs';

const root = document.querySelector('[data-tool="rsa-key-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const result = root.querySelector('[data-rsa-result]');
  const publicOutput = root.querySelector('[data-rsa-public]');
  const privateOutput = root.querySelector('[data-rsa-private]');
  const fingerprintOutput = root.querySelector('[data-rsa-fingerprint]');
  const messageHint = root.querySelector('[data-rsa-message-hint]');
  const generateButton = root.querySelector('[data-action="generate"]');
  let keys = null;

  function download(filename, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/x-pem-file;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.downloaded, 'success');
  }

  function requireKeys() {
    if (keys) return true;
    announce(root, copy.messages.noKey, 'error');
    return false;
  }

  generateButton.addEventListener('click', async () => {
    if (generateButton.disabled) return;
    const original = generateButton.textContent;
    generateButton.disabled = true;
    generateButton.textContent = copy.messages.busy;
    announce(root, copy.messages.busy, 'pending');
    try {
      const size = Number(field('keySize').value);
      const created = await generateRsaKeyPair(size);
      keys = created;
      publicOutput.value = created.publicPem;
      privateOutput.value = created.privatePem;
      fingerprintOutput.textContent = created.fingerprint;
      messageHint.textContent = copy.fields.demoHint.replace('{limit}', String(created.maxMessageBytes));
      field('ciphertext').value = '';
      field('plaintext').value = '';
      result.hidden = false;
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      keys = null;
      result.hidden = true;
      announce(root, /Web Crypto is unavailable/u.test(error?.message ?? '') ? copy.messages.cryptoUnavailable : copy.messages.checkInputs, 'error');
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = original;
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    field('demoMessage').value = 'UsefulVerse RSA demo: short messages only.';
    field('demoMessage').focus();
    announce(root, copy.messages.exampleLoaded, 'success');
  });

  root.querySelector('[data-action="encrypt"]').addEventListener('click', async () => {
    if (!requireKeys()) return;
    const message = field('demoMessage').value;
    if (!message) return announce(root, copy.messages.checkInputs, 'error');
    try {
      field('ciphertext').value = await encryptRsaMessage(message, keys.publicKey, globalThis.crypto, keys.modulusLength);
      field('plaintext').value = '';
      announce(root, copy.messages.encrypted, 'success');
    } catch (error) {
      announce(root, error instanceof RangeError || error instanceof TypeError ? copy.messages.checkInputs : copy.messages.cryptoUnavailable, 'error');
    }
  });

  root.querySelector('[data-action="decrypt"]').addEventListener('click', async () => {
    if (!requireKeys()) return;
    if (!field('ciphertext').value.trim()) return announce(root, copy.messages.emptyCiphertext, 'error');
    try {
      field('plaintext').value = await decryptRsaMessage(field('ciphertext').value.trim(), keys.privateKey);
      announce(root, copy.messages.decrypted, 'success');
    } catch {
      field('plaintext').value = '';
      announce(root, copy.messages.checkInputs, 'error');
    }
  });

  for (const [action, selector] of [['copy-public', publicOutput], ['copy-private', privateOutput], ['copy-fingerprint', fingerprintOutput]]) {
    root.querySelector(`[data-action="${action}"]`).addEventListener('click', async () => {
      if (!requireKeys()) return;
      const text = selector.value ?? selector.textContent;
      await copyText(root, text, copy);
    });
  }

  root.querySelector('[data-action="download-public"]').addEventListener('click', () => {
    if (requireKeys()) download('usefulverse-rsa-public.pem', keys.publicPem);
  });
  root.querySelector('[data-action="download-private"]').addEventListener('click', () => {
    if (requireKeys()) download('usefulverse-rsa-private.pem', keys.privatePem);
  });
  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    form.reset();
    keys = null;
    result.hidden = true;
    publicOutput.value = '';
    privateOutput.value = '';
    fingerprintOutput.textContent = '';
    messageHint.textContent = copy.fields.demoHint.replace('{limit}', '190');
    announce(root, copy.messages.reset, 'info');
  });
}
