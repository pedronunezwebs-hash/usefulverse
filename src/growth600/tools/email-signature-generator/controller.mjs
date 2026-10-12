import { announce, copyText, readToolCopy } from '../controller-helpers.mjs';
import { createEmailSignature, EMAIL_SIGNATURE_LIMITS } from './logic.mjs';

const root = document.querySelector('[data-tool="email-signature-generator"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-signature-result]');
  const preview = root.querySelector('[data-signature-preview]');
  const source = root.querySelector('[data-signature-html]');
  let signature = null;
  let logoDataUrl = '';
  const invalidLogo = () => Object.assign(new RangeError(copy.messages.logoUnavailable), { code: 'INVALID_LOGO' });
  const readLogo = async (file) => {
    if (!file) return '';
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type) || file.size > EMAIL_SIGNATURE_LIMITS.maxLogoBytes) throw invalidLogo();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result || '')));
      reader.addEventListener('error', reject);
      reader.readAsDataURL(file);
    });
    const image = new Image();
    image.src = dataUrl;
    try { await image.decode(); } catch { throw invalidLogo(); }
    if (image.naturalWidth > 1600 || image.naturalHeight > 1600) throw invalidLogo();
    return dataUrl;
  };
  const create = async (event) => {
    event?.preventDefault();
    signature = null;
    result.hidden = true;
    try {
      const data = Object.fromEntries(['fullName', 'jobTitle', 'organization', 'email', 'phone', 'website', 'location', 'accentColor', 'logoAlt'].map((name) => [name, form.elements.namedItem(name).value]));
      const file = form.elements.namedItem('logoFile').files?.[0];
      logoDataUrl = await readLogo(file);
      signature = createEmailSignature({ ...data, logoDataUrl });
      preview.innerHTML = signature.html;
      source.value = signature.html;
      result.hidden = false;
      announce(root, copy.messages.generated, 'success');
    } catch (error) {
      announce(root, error?.code === 'INVALID_LOGO' ? copy.messages.logoUnavailable : copy.messages.checkInputs, 'error');
    }
  };
  form.addEventListener('submit', create);
  form.addEventListener('input', () => { signature = null; result.hidden = true; announce(root, ''); });
  form.addEventListener('change', () => { signature = null; result.hidden = true; announce(root, ''); });
  form.addEventListener('reset', () => { signature = null; logoDataUrl = ''; result.hidden = true; preview.replaceChildren(); source.value = ''; announce(root, ''); });
  root.querySelector('[data-action="copy"]')?.addEventListener('click', async () => {
    if (!signature) return;
    try {
      if (navigator.clipboard?.write && globalThis.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([signature.html], { type: 'text/html' }), 'text/plain': new Blob([signature.plainText], { type: 'text/plain' }) })]);
        announce(root, copy.messages.copied, 'success');
      } else {
        preview.focus?.();
        announce(root, copy.messages.copyUnavailable, 'error');
      }
    } catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });
  root.querySelector('[data-action="copyHtml"]')?.addEventListener('click', async () => {
    if (!signature) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(signature.html);
      announce(root, copy.messages.copiedHtml, 'success');
    } catch { announce(root, copy.messages.copyUnavailable, 'error'); }
  });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!signature) return;
    const title = signature.plainText.split('\n')[0].replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const documentHtml = `<!doctype html><html lang="${(document.documentElement.lang || 'en').replace(/[^a-z0-9-]/giu, '')}"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><body>${signature.html}</body></html>`;
    const url = URL.createObjectURL(new Blob([documentHtml], { type: 'text/html;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'email-signature.html'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    announce(root, copy.messages.downloaded, 'success');
  });
}
