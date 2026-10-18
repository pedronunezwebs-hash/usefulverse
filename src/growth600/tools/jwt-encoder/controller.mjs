import { createJwt, verifyJwt } from './logic.mjs';
import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';

const root = document.querySelector('[data-tool="jwt-encoder"]');

if (root) {
  const copy = readToolCopy(root);
  const form = root.querySelector('#tool-form');
  const mode = form.elements.namedItem('mode');
  const createFields = root.querySelector('[data-create-fields]');
  const verifyFields = root.querySelector('[data-verify-fields]');
  const payload = form.elements.namedItem('payload');
  const token = form.elements.namedItem('token');
  const secret = form.elements.namedItem('secret');
  const expiresIn = form.elements.namedItem('expiresInSeconds');
  const result = root.querySelector('[data-result]');
  const output = root.querySelector('[data-output]');
  const run = root.querySelector('[data-action="run"]');
  const copyButton = root.querySelector('[data-action="copy"]');
  let outputValue = '';

  function clearOutput() {
    result.hidden = true;
    output.value = '';
    outputValue = '';
  }

  function updateMode() {
    const create = mode.value === 'create';
    createFields.hidden = !create;
    verifyFields.hidden = create;
    payload.disabled = !create;
    expiresIn.disabled = !create;
    token.disabled = create;
    payload.required = create;
    token.required = !create;
    clearOutput();
    run.textContent = create ? copy.actions.run : copy.fields.verifyMode;
  }

  async function process(event) {
    event?.preventDefault();
    clearOutput();
    run.disabled = true;
    announce(root, copy.messages.working, 'info');
    try {
      if (mode.value === 'create') {
        const created = await createJwt({ payloadText: payload.value, secret: secret.value, expiresInSeconds: expiresIn.value });
        outputValue = created.token;
        announce(root, copy.messages.created, 'success');
      } else if (mode.value === 'verify') {
        const verification = await verifyJwt(token.value, secret.value);
        outputValue = JSON.stringify(verification, null, 2);
        announce(root, copy.messages.verified, 'success');
      } else throw new TypeError('Choose a supported action.');
      output.value = outputValue;
      result.hidden = false;
    } catch (error) {
      clearOutput();
      const message = error?.message?.includes('signature is invalid') ? copy.messages.invalidSignature
        : error?.message?.includes('Web Crypto') ? copy.messages.unsupportedCrypto : copy.messages.checkInputs;
      announce(root, message, 'error');
    } finally { run.disabled = false; }
  }

  form.addEventListener('submit', process);
  mode.addEventListener('change', updateMode);
  for (const field of [payload, token, secret, expiresIn]) field.addEventListener('input', clearOutput);
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    mode.value = 'create';
    payload.value = '{\n  "sub": "1234567890",\n  "name": "Example user"\n}';
    expiresIn.value = '3600';
    updateMode();
    payload.focus();
  });
  copyButton.addEventListener('click', () => { if (outputValue) copyText(root, outputValue, copy); });
  updateMode();
}
