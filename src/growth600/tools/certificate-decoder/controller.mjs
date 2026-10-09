import { announce, clearResult, copyText, readToolCopy, showRows } from '../controller-helpers.mjs';
import { CERTIFICATE_LIMITS, decodeCertificateDer, decodeCertificateInput, sha256Fingerprint } from './logic.mjs';
import { EXAMPLE_CERTIFICATE_PEM } from './example.mjs';

const root = document.querySelector('[data-tool="certificate-decoder"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const input = form.elements.namedItem('certificate');
  const fileInput = form.elements.namedItem('certificateFile');
  let generation = 0;
  let summary = '';

  function clear() {
    generation += 1;
    summary = '';
    clearResult(root);
  }

  function nameText(values) {
    return values.map(({ key, value }) => `${copy.fields[key] ?? `${copy.fields.unlistedAttribute} (${key})`}=${value}`).join(', ') || '—';
  }

  function errorMessage(error) {
    if (error.message === 'certificate-too-large') return copy.messages.tooLarge;
    if (error.message === 'invalid-pem') return copy.messages.invalidPem;
    if (error.message === 'fingerprint-unavailable') return copy.messages.fingerprintUnavailable;
    return copy.messages.invalid;
  }

  async function renderDecoded(bytes, certificate, version) {
    const fingerprint = await sha256Fingerprint(bytes);
    if (version !== generation) return;
    const subjectLine = nameText(certificate.subject);
    const issuerLine = nameText(certificate.issuer);
    const commonName = certificate.subject.filter((field) => field.key === 'commonName').map((field) => field.value).join(', ') || '—';
    const organization = certificate.subject.filter((field) => field.key === 'organizationName').map((field) => field.value).join(', ') || '—';
    const sans = certificate.alternativeNames.map((entry) => `${entry.type}: ${entry.value}`).join('\n') || copy.fields.noAlternativeNames;
    const rows = [
      [copy.fields.commonName, commonName], [copy.fields.organizationName, organization],
      [copy.fields.subject, subjectLine], [copy.fields.issuer, issuerLine],
      [copy.fields.serialNumber, certificate.serialNumber],
      [copy.fields.notBefore, certificate.notBefore], [copy.fields.notAfter, certificate.notAfter],
      [copy.fields.alternativeNames, sans], [copy.fields.fingerprint, fingerprint],
    ];
    showRows(root, rows);
    summary = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
    announce(root, copy.messages.decoded, 'success');
  }

  async function decode(event) {
    event?.preventDefault();
    clear();
    const version = generation;
    try {
      let bytes;
      let certificate;
      if (fileInput.files?.[0]) {
        const file = fileInput.files[0];
        if (file.size > CERTIFICATE_LIMITS.maxBytes) throw new Error('certificate-too-large');
        bytes = new Uint8Array(await file.arrayBuffer());
        if (version !== generation) return;
        const looksText = bytes.length > 0 && bytes.every((byte) => byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte <= 126));
        if (looksText) {
          const decodedText = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
          if (decodedText.trimStart().startsWith('-----BEGIN CERTIFICATE-----') || /^[\sA-Za-z0-9+/=]+$/u.test(decodedText)) {
            ({ certificate, bytes } = decodeCertificateInput(decodedText));
          } else certificate = decodeCertificateDer(bytes);
        } else certificate = decodeCertificateDer(bytes);
      } else ({ certificate, bytes } = decodeCertificateInput(input.value));
      await renderDecoded(bytes, certificate, version);
    } catch (error) {
      if (version === generation) announce(root, errorMessage(error), 'error');
    }
  }

  form.addEventListener('submit', decode);
  input.addEventListener('input', () => {
    fileInput.value = '';
    clear();
    announce(root, '');
  });
  fileInput.addEventListener('change', () => {
    input.value = '';
    clear();
    announce(root, '');
  });
  form.addEventListener('reset', () => queueMicrotask(() => { fileInput.value = ''; clear(); announce(root, ''); }));
  root.querySelector('[data-action="example"]')?.addEventListener('click', () => {
    fileInput.value = '';
    input.value = EXAMPLE_CERTIFICATE_PEM;
    decode();
  });
  root.querySelector('[data-action="copySummary"]')?.addEventListener('click', () => {
    if (summary) copyText(root, summary, copy);
    else announce(root, copy.messages.invalid, 'error');
  });
}
