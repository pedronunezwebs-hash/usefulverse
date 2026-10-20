import { computeGarmentOverlay } from './logic.mjs';

const root = document.querySelector('[data-virtual-try-on]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const canvas = root.querySelector('[data-preview]'); const status = root.querySelector('[data-status]');
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', copy.fields.previewAlt);
  let baseBitmap; let garmentBitmap;
  const draw = () => {
    if (!baseBitmap || !garmentBitmap) return;
    const context = canvas.getContext('2d'); if (!context) throw Object.assign(new Error('canvas-unavailable'), { code: 'canvas-unavailable' });
    const scale = Math.min(1, 1200 / Math.max(baseBitmap.width, baseBitmap.height));
    canvas.width = Math.round(baseBitmap.width * scale); canvas.height = Math.round(baseBitmap.height * scale);
    context.drawImage(baseBitmap, 0, 0, canvas.width, canvas.height);
    const rect = computeGarmentOverlay(canvas.width, canvas.height, garmentBitmap.width, garmentBitmap.height, Number(form.elements.namedItem('left').value), Number(form.elements.namedItem('top').value), Number(form.elements.namedItem('width').value));
    context.globalAlpha = Number(form.elements.namedItem('opacity').value) / 100;
    context.drawImage(garmentBitmap, rect.left, rect.top, rect.width, rect.height); context.globalAlpha = 1;
    canvas.style.width = '100%'; canvas.style.height = 'auto'; canvas.style.maxWidth = '720px';
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      for (const field of ['base','garment']) {
        const file = form.elements.namedItem(field).files?.[0];
        if (!file || !['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024) throw Object.assign(new Error('invalid-file'), { code: 'invalid-file' });
      }
      baseBitmap?.close(); garmentBitmap?.close();
      baseBitmap = await createImageBitmap(form.elements.namedItem('base').files[0]);
      garmentBitmap = await createImageBitmap(form.elements.namedItem('garment').files[0]);
      if (baseBitmap.width * baseBitmap.height > 8_000_000 || garmentBitmap.width * garmentBitmap.height > 8_000_000) throw Object.assign(new Error('invalid-file'), { code: 'invalid-file' });
      draw(); result.hidden = false; status.textContent = copy.messages.complete; status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; }
  });
  form.addEventListener('input', () => { try { draw(); } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; } });
  root.querySelector('[data-download]').addEventListener('click', () => canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'manual-outfit-preview.png'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png'));
  form.addEventListener('reset', () => queueMicrotask(() => { baseBitmap?.close(); garmentBitmap?.close(); baseBitmap = undefined; garmentBitmap = undefined; canvas.width = 1; canvas.height = 1; result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
