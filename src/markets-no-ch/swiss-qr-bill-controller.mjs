import { buildSwissQrPayload, classifySwissIban, parseSwissQrPayload } from './swiss-qr-bill.mjs';

const root = document.querySelector('[data-market-tool="swissQrBill"]');
if (root) {
  const f = JSON.parse(root.querySelector('[data-tool-copy]').textContent).fields;
  const byId = (id) => root.querySelector(`#${id}`);
  const status = root.querySelector('[data-qr-bill-status]');
  const output = root.querySelector('[data-qr-bill-output]');
  const preview = root.querySelector('[data-qr-bill-preview]');
  const imageInput = byId('qr-bill-image');
  let current = null;
  let qrScriptPromise;
  let readerScriptPromise;

  const text = (id) => byId(id).value;
  const setStatus = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('result--error', error);
  };
  const escapeHtml = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  const download = (blob, name) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = name; link.hidden = true; document.body.append(link); link.click(); link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const loadScript = (src, test, holder) => {
    if (test()) return Promise.resolve();
    if (!holder.promise) holder.promise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src; script.async = true;
      script.onload = () => test() ? resolve() : reject(new Error('script-global-missing'));
      script.onerror = () => reject(new Error('script-load-failed'));
      document.head.append(script);
    });
    return holder.promise;
  };
  const qrLoader = { get promise() { return qrScriptPromise; }, set promise(value) { qrScriptPromise = value; } };
  const readerLoader = { get promise() { return readerScriptPromise; }, set promise(value) { readerScriptPromise = value; } };

  function makeQrSvg(payload) {
    window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
    const qr = window.qrcode(0, 'M');
    qr.addData(payload, 'Byte');
    qr.make();
    const count = qr.getModuleCount();
    const quiet = 4;
    const size = count + quiet * 2;
    const center = count / 2;
    const logoOuter = Math.max(9, Math.ceil(count * 0.19));
    const logoInner = logoOuter - 2;
    const left = Math.floor(center - logoOuter / 2);
    const top = left;
    let path = '';
    for (let row = 0; row < count; row += 1) {
      for (let col = 0; col < count; col += 1) {
        const underLogo = col >= left && col < left + logoOuter && row >= top && row < top + logoOuter;
        if (!underLogo && qr.isDark(row, col)) path += `M${col + quiet},${row + quiet}h1v1h-1z`;
      }
    }
    const logoLeft = left + 1 + quiet;
    const logoTop = top + 1 + quiet;
    const crossArm = Math.max(2, Math.floor(logoInner / 3));
    const crossOffset = Math.floor((logoInner - crossArm) / 2);
    const cross = `<rect x="${logoLeft}" y="${logoTop + crossOffset}" width="${logoInner}" height="${crossArm}" fill="#fff"/><rect x="${logoLeft + crossOffset}" y="${logoTop}" width="${crossArm}" height="${logoInner}" fill="#fff"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="Swiss QR Code" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/><rect x="${logoLeft - 1}" y="${logoTop - 1}" width="${logoOuter}" height="${logoOuter}" fill="#fff"/><rect x="${logoLeft}" y="${logoTop}" width="${logoInner}" height="${logoInner}" fill="#d52b1e"/>${cross}<metadata>Swiss QR Code · correction level M · quiet zone 4</metadata></svg>`;
  }

  function renderQrBill(data, qrSvg) {
    const addressText = (address) => [address?.name, [address?.street, address?.building].filter(Boolean).join(' '), [address?.postalCode, address?.city].filter(Boolean).join(' '), address?.country].filter(Boolean).map(escapeHtml).join('<br>') || '—';
    const amount = data.amount ? `${escapeHtml(data.currency)} ${escapeHtml(data.amount)}` : `${escapeHtml(data.currency)} —`;
    const reference = data.reference ? escapeHtml(data.reference) : '—';
    const info = data.message || data.billingInformation ? [data.message, data.billingInformation].filter(Boolean).map(escapeHtml).join('<br>') : '—';
    preview.innerHTML = `<div class="qr-bill-print-sheet" data-qr-print><section class="qr-bill-receipt"><h4>${escapeHtml(f.receipt)}</h4><p><strong>${escapeHtml(f.payableTo)}</strong><br>${addressText(data.creditor)}</p><p><strong>${escapeHtml(f.account)}</strong><br>${escapeHtml(data.iban)}</p><p><strong>${escapeHtml(f.paymentCurrency)}</strong><br>${amount}</p><p><strong>${escapeHtml(f.referenceLabel)}</strong><br>${reference}</p><p><strong>${escapeHtml(f.additionalInfo)}</strong><br>${info}</p>${data.debtor?.name ? `<p><strong>${escapeHtml(f.payableBy)}</strong><br>${addressText(data.debtor)}</p>` : ''}</section><section class="qr-bill-payment"><div class="qr-bill-code">${qrSvg}</div><div class="qr-bill-payment-info"><h4>${escapeHtml(f.paymentPart)}</h4><p><strong>${escapeHtml(f.payableTo)}</strong><br>${addressText(data.creditor)}</p><p><strong>${escapeHtml(f.account)}</strong><br>${escapeHtml(data.iban)}</p><p><strong>${escapeHtml(f.paymentCurrency)}</strong><br>${amount}</p><p><strong>${escapeHtml(f.referenceLabel)}</strong><br>${reference}</p><p><strong>${escapeHtml(f.additionalInfo)}</strong><br>${info}</p>${data.debtor?.name ? `<p><strong>${escapeHtml(f.payableBy)}</strong><br>${addressText(data.debtor)}</p>` : ''}</div><div class="qr-bill-calibration"><span></span><small>${escapeHtml(f.printScale)}</small></div></section></div>`;
    output.hidden = false;
  }

  function collect() {
    const debtor = {
      name: text('qr-bill-debtor-name'), street: text('qr-bill-debtor-street'), building: text('qr-bill-debtor-building'),
      postalCode: text('qr-bill-debtor-postal'), city: text('qr-bill-debtor-city'), country: text('qr-bill-debtor-country'),
    };
    return {
      iban: text('qr-bill-iban'), creditor: {
        name: text('qr-bill-creditor-name'), street: text('qr-bill-creditor-street'), building: text('qr-bill-creditor-building'),
        postalCode: text('qr-bill-creditor-postal'), city: text('qr-bill-creditor-city'), country: text('qr-bill-creditor-country'),
      },
      debtor, amount: text('qr-bill-amount'), currency: text('qr-bill-currency'), referenceType: text('qr-bill-reference-type'),
      reference: text('qr-bill-reference'), message: text('qr-bill-message'), billingInformation: text('qr-bill-billing'),
    };
  }

  async function generate(input = collect(), message = f.ready) {
    try {
      const result = buildSwissQrPayload(input);
      setStatus(f.ready);
      await loadScript('/assets/vendor/qrcode-generator.js', () => typeof window.qrcode === 'function', qrLoader);
      const qrSvg = makeQrSvg(result.payload);
      current = { ...input, ...result, creditor: input.creditor, debtor: input.debtor };
      renderQrBill(current, qrSvg);
      setStatus(message);
      return current;
    } catch (error) {
      current = null; output.hidden = true;
      setStatus(error?.code ? f.invalid : f.qrUnavailable, true);
      const field = error?.field;
      if (field === 'iban') byId('qr-bill-iban').focus();
      else if (field === 'reference') byId('qr-bill-reference').focus();
      return null;
    }
  }

  function useParsed(parsed) {
    const values = {
      'qr-bill-iban': parsed.iban, 'qr-bill-amount': parsed.amount, 'qr-bill-currency': parsed.currency,
      'qr-bill-reference-type': parsed.referenceType, 'qr-bill-reference': parsed.reference,
      'qr-bill-message': parsed.message, 'qr-bill-billing': parsed.billingInformation,
    };
    for (const [id, value] of Object.entries(values)) byId(id).value = value ?? '';
    const applyAddress = (prefix, address) => {
      const valuesBySuffix = { name: address.name, street: address.street, building: address.building, postal: address.postalCode, city: address.city, country: address.country };
      for (const [suffix, value] of Object.entries(valuesBySuffix)) byId(`${prefix}-${suffix}`).value = value ?? '';
    };
    applyAddress('qr-bill-creditor', parsed.creditor);
    applyAddress('qr-bill-debtor', parsed.debtor);
    return generate({ ...collect(), debtor: parsed.debtor }, f.payloadValid);
  }

  root.querySelector('[data-action="generateQrBill"]').addEventListener('click', () => generate());
  root.querySelector('[data-action="loadQrSample"]').addEventListener('click', () => {
    byId('qr-bill-iban').value = 'CH64 3196 1000 0044 2155 7';
    byId('qr-bill-creditor-name').value = 'Max Muster & Söhne'; byId('qr-bill-creditor-street').value = 'Musterstrasse';
    byId('qr-bill-creditor-building').value = '123'; byId('qr-bill-creditor-postal').value = '8000';
    byId('qr-bill-creditor-city').value = 'Seldwyla'; byId('qr-bill-creditor-country').value = 'CH';
    byId('qr-bill-debtor-name').value = 'Simon Muster'; byId('qr-bill-debtor-street').value = 'Musterstrasse';
    byId('qr-bill-debtor-building').value = '1'; byId('qr-bill-debtor-postal').value = '8000';
    byId('qr-bill-debtor-city').value = 'Seldwyla'; byId('qr-bill-debtor-country').value = 'CH';
    byId('qr-bill-amount').value = '50.00'; byId('qr-bill-currency').value = 'CHF'; byId('qr-bill-reference-type').value = 'QRR';
    byId('qr-bill-reference').value = '000008207791225857421286694'; byId('qr-bill-message').value = 'Payment of travel';
    syncReference();
    generate(collect(), f.sampleLoaded);
  });
  root.querySelector('[data-action="clearQrBill"]').addEventListener('click', () => {
    root.querySelectorAll('.qr-bill-tool input:not([type="file"]), .qr-bill-tool textarea').forEach((field) => { field.value = ''; });
    byId('qr-bill-currency').value = 'CHF'; byId('qr-bill-reference-type').value = 'NON';
    imageInput.value = ''; current = null; preview.replaceChildren(); output.hidden = true; setStatus(f.cleared);
  });
  root.querySelector('[data-action="checkQrPayload"]').addEventListener('click', () => {
    try { const parsed = parseSwissQrPayload(byId('qr-bill-payload-input').value); useParsed(parsed); }
    catch { current = null; output.hidden = true; setStatus(f.payloadInvalid, true); }
  });
  root.querySelector('[data-action="readQrImage"]').addEventListener('click', async () => {
    const file = imageInput.files?.[0];
    if (!file) { setStatus(f.readFailed, true); return; }
    if (file.size > 10 * 1024 * 1024 || !['image/png', 'image/jpeg'].includes(file.type)) { setStatus(f.imageTooLarge, true); return; }
    setStatus(f.reading);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true }); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      let value = '';
      if ('BarcodeDetector' in window) {
        try { const [result] = await new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas); value = result?.rawValue ?? ''; } catch { /* local jsQR fallback below */ }
      }
      if (!value) {
        await loadScript('/assets/vendor/jsQR.js', () => typeof window.jsQR === 'function', readerLoader);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        value = window.jsQR(image.data, image.width, image.height, { inversionAttempts: 'attemptBoth' })?.data ?? '';
      }
      if (!value) { setStatus(f.readFailed, true); return; }
      byId('qr-bill-payload-input').value = value;
      const parsed = parseSwissQrPayload(value); await useParsed(parsed); setStatus(f.readSuccess);
    } catch {
      setStatus(f.qrUnavailable, true);
    }
  });
  root.querySelector('[data-action="downloadQrPayload"]').addEventListener('click', () => {
    if (!current) { setStatus(f.noOutput, true); return; }
    download(new Blob([current.payload], { type: 'text/plain;charset=utf-8' }), 'swiss-qr-bill-payment-data.txt');
  });
  root.querySelector('[data-action="downloadQrSvg"]').addEventListener('click', () => {
    if (!current) { setStatus(f.noOutput, true); return; }
    const svg = preview.querySelector('svg');
    download(new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' }), 'swiss-qr-bill.svg');
  });
  root.querySelector('[data-action="printQrBill"]').addEventListener('click', () => {
    if (!current) { setStatus(f.noOutput, true); return; }
    window.print();
  });
  byId('qr-bill-iban').addEventListener('input', (event) => {
    const account = classifySwissIban(event.currentTarget.value);
    const type = byId('qr-bill-reference-type');
    if (account.valid && account.kind === 'qr-iban') type.value = 'QRR';
    else if (account.valid && type.value === 'QRR') type.value = 'NON';
    syncReference();
  });
  function syncReference() {
    const reference = byId('qr-bill-reference');
    reference.disabled = byId('qr-bill-reference-type').value === 'NON';
    if (reference.disabled) reference.value = '';
  }
  byId('qr-bill-reference-type').addEventListener('change', syncReference);
  syncReference();
}
