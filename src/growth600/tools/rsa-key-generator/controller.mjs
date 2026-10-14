import { decryptRsaText, encryptRsaText, generateRsaKeyPair } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="rsa-key-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const publicKey = form.elements.namedItem('publicKey');
  const privateKey = form.elements.namedItem('privateKey');
  const run = async (work, success) => {
    try { const result = await work(); announce(root, success, 'success'); return result; }
    catch (error) { announce(root, error instanceof Error ? error.message : copy.messages.checkInputs, 'error'); return null; }
  };
  root.querySelector('[data-action="generate"]')?.addEventListener('click', async () => {
    const button = root.querySelector('[data-action="generate"]');
    button.disabled = true;
    announce(root, copy.messages.generating);
    publicKey.value = ''; privateKey.value = ''; form.elements.namedItem('fingerprint').value = '';
    form.elements.namedItem('ciphertext').value = ''; form.elements.namedItem('decryptOutput').value = '';
    const size = Number(form.elements.namedItem('keySize').value);
    const pair = await run(() => generateRsaKeyPair({ modulusLength: size }), copy.messages.generated);
    if (pair) {
      publicKey.value = pair.publicKeyPem; privateKey.value = pair.privateKeyPem;
      form.elements.namedItem('fingerprint').value = pair.fingerprint;
      form.elements.namedItem('maxBytes').value = String(pair.maxPlaintextBytes);
    }
    button.disabled = false;
  });
  root.querySelector('[data-action="encrypt"]')?.addEventListener('click', async () => {
    const result = await run(() => encryptRsaText({ publicKeyPem: publicKey.value, text: form.elements.namedItem('message').value, modulusLength: Number(form.elements.namedItem('keySize').value) }), copy.messages.encrypted);
    if (result) form.elements.namedItem('ciphertext').value = result;
  });
  root.querySelector('[data-action="decrypt"]')?.addEventListener('click', async () => {
    const result = await run(() => decryptRsaText({ privateKeyPem: privateKey.value, ciphertextBase64: form.elements.namedItem('ciphertext').value }), copy.messages.decrypted);
    if (result !== null) form.elements.namedItem('decryptOutput').value = result;
  });
  for (const [action, name] of [['copyPublic', 'publicKey'], ['copyPrivate', 'privateKey'], ['copyFingerprint', 'fingerprint'], ['copyCiphertext', 'ciphertext']]) {
    root.querySelector(`[data-action="${action}"]`)?.addEventListener('click', () => {
      if (form.elements.namedItem(name).value) copyText(root, form.elements.namedItem(name).value, copy);
      else announce(root, copy.messages.checkInputs, 'error');
    });
  }
  form.addEventListener('reset', () => {
    queueMicrotask(() => { form.elements.namedItem('maxBytes').value = '190'; form.elements.namedItem('decryptOutput').value = ''; announce(root, copy.messages.cleared); });
  });
  form.addEventListener('change', (event) => {
    if (event.target.name === 'keySize') {
      publicKey.value = ''; privateKey.value = ''; form.elements.namedItem('fingerprint').value = '';
      form.elements.namedItem('ciphertext').value = ''; form.elements.namedItem('decryptOutput').value = '';
      form.elements.namedItem('maxBytes').value = Number(event.target.value) === 3072 ? '318' : '190';
    }
  });
}
