import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { signJwt } from './logic.mjs';

const root = document.querySelector('[data-tool="jwt-encoder"]');

if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const field = (name) => form.elements.namedItem(name);
  const result = root.querySelector('[data-result]');
  const tokenOutput = root.querySelector('[data-jwt-token]');
  const headerOutput = root.querySelector('[data-jwt-header]');
  const claimsOutput = root.querySelector('[data-jwt-claims-preview]');
  const submit = root.querySelector('[data-jwt-submit]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    result.hidden = true;
    tokenOutput.value = '';
    headerOutput.value = '';
    claimsOutput.value = '';
    try {
      const signed = await signJwt({
        claimsJson: field('claims').value,
        secret: field('secret').value,
        algorithm: field('algorithm').value,
        expiresInMinutes: field('expiration').value,
      });
      tokenOutput.value = signed.token;
      headerOutput.value = JSON.stringify(signed.header, null, 2);
      claimsOutput.value = JSON.stringify(signed.payload, null, 2);
      result.hidden = false;
      announce(root, copy.messages.signed, 'success');
    } catch (error) {
      const unavailable = /Web Crypto is unavailable/u.test(error?.message ?? '');
      announce(root, unavailable ? copy.messages.cryptoUnavailable : copy.messages.checkInputs, 'error');
    } finally {
      submit.disabled = false;
    }
  });

  root.querySelector('[data-action="example"]').addEventListener('click', () => {
    field('algorithm').value = 'HS256';
    field('claims').value = '{"sub":"test-user","role":"viewer","scope":["read"]}';
    field('secret').value = '';
    field('expiration').value = '15';
    result.hidden = true;
    field('secret').focus();
    announce(root, copy.messages.exampleLoaded, 'success');
  });

  root.querySelector('[data-action="reset"]').addEventListener('click', () => {
    form.reset();
    result.hidden = true;
    tokenOutput.value = '';
    headerOutput.value = '';
    claimsOutput.value = '';
    announce(root, '', '');
    field('claims').focus();
  });

  root.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    if (!tokenOutput.value) return announce(root, copy.messages.empty, 'error');
    await copyText(root, tokenOutput.value, copy);
  });
}
