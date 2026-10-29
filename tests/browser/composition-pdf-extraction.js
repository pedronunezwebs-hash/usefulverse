// Synthetic, local-only PDF fixture: no external file, upload or hardware.
async () => {
  if (location.hostname !== '127.0.0.1' || !location.pathname.endsWith('/tools/extract-images-from-pdf/')) throw Error('Wrong local fixture page');
  if (!globalThis.PDFLib) await new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = '/assets/vendor/pdf-lib.min.js'; script.onload = resolve; script.onerror = reject; document.head.append(script); });
  const canvas = document.createElement('canvas'); canvas.width = 120; canvas.height = 80;
  canvas.getContext('2d').fillStyle = '#ff0000'; canvas.getContext('2d').fillRect(0, 0, 120, 80);
  const imageBytes = await (await fetch(canvas.toDataURL('image/jpeg', 0.9))).arrayBuffer();
  const pdf = await PDFLib.PDFDocument.create(), jpg = await pdf.embedJpg(imageBytes);
  pdf.addPage([120, 80]).drawImage(jpg, { x: 0, y: 0, width: 120, height: 80 });
  const bytes = await pdf.save();
  const transfer = new DataTransfer(); transfer.items.add(new File([bytes], 'local-red-image.pdf', { type: 'application/pdf' }));
  const form = document.querySelector('[data-extract-images-form]');
  form.elements.pdfFile.files = transfer.files; form.elements.pdfFile.dispatchEvent(new Event('change', { bubbles: true })); form.requestSubmit();
  for (let i = 0; i < 160 && !document.querySelector('[data-extracted-images] img'); i++) await new Promise(r => setTimeout(r, 100));
  const images = [...document.querySelectorAll('[data-extracted-images] img')];
  for (const image of images) await image.decode();
  const pixelCanvas = document.createElement('canvas'); pixelCanvas.width = pixelCanvas.height = 1;
  if (images[0]) pixelCanvas.getContext('2d').drawImage(images[0], 0, 0, 1, 1);
  const pixel = [...pixelCanvas.getContext('2d').getImageData(0, 0, 1, 1).data];
  const requests = performance.getEntriesByType('resource').map(r => ({ url: r.name, status: r.responseStatus }));
  const workers = requests.filter(r => r.url.includes('extract-images-pdf-worker.mjs'));
  const bad = requests.filter(r => /\/(?:pdf\.worker\.mjs|qcms_bg\.js)(?:[?#]|$)/.test(r.url) || r.status >= 400);
  return { fixtureBytes: bytes.length, images: images.length, dimensions: images.map(i => [i.naturalWidth, i.naturalHeight]), pixel, workers, bad,
    pass: images.length === 1 && images[0].naturalWidth === 120 && images[0].naturalHeight === 80 && pixel[0] > 240 && pixel[1] < 20 && pixel[2] < 20 && workers.length === 1 && bad.length === 0 };
}
