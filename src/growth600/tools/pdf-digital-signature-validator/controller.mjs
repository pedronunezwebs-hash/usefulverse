import { inspectPdfSignatures } from './logic.mjs';
const root = document.querySelector('[data-pdf-signature-form]');
if (root) {
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const status = root.querySelector('[data-status]');
  const result = root.querySelector('[data-result]');
  const list = root.querySelector('[data-signatures]');
  const message = (key) => { status.textContent = copy.messages?.[key] ?? copy.messages?.error ?? ''; status.classList.toggle('status--error', key === 'error' || key === 'invalid'); };
  root.addEventListener('submit', async (event) => {
    event.preventDefault(); list.replaceChildren(); result.hidden = true;
    const file = root.elements.namedItem('pdf')?.files?.[0];
    if (!file) return message('chooseFile');
    if (file.size > 25 * 1024 * 1024) return message('fileLimit');
    message('processing');
    try {
      const report = await inspectPdfSignatures(new Uint8Array(await file.arrayBuffer()));
      if (!report.signatureCount) { message('noneFound'); result.hidden = false; return; }
      for (const signature of report.signatures) {
        const item = document.createElement('li');
        const title = document.createElement('strong');
        title.textContent = signature.cryptographicallyVerified ? copy.messages.valid : copy.messages.invalid;
        const details = document.createElement('p');
        details.textContent = [signature.signer ? `${copy.fields.signer}: ${signature.signer}` : '', `${copy.fields.range}: ${signature.byteRangeValid ? copy.messages.validRange : copy.messages.invalidRange}`, `${copy.fields.coverage}: ${signature.coversCurrentFile ? copy.messages.coversFile : copy.messages.hasAppend}`, `${copy.fields.trust}: ${copy.messages.trustUnknown}`, signature.timestampTokenPresent ? copy.messages.timestampPresent : copy.messages.noTimestamp].filter(Boolean).join(' · ');
        item.append(title, details);
        list.append(item);
      }
      result.hidden = false; message('complete');
    } catch { message('error'); }
  });
  root.addEventListener('reset', () => queueMicrotask(() => { list.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
