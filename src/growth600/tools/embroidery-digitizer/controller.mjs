import { rasterToRunningStitchSketch } from './logic.mjs';

const root = document.querySelector('[data-embroidery-digitizer]');
if (root) {
  const copy = JSON.parse(document.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const form = root.querySelector('form'); const result = root.querySelector('[data-result]');
  const preview = root.querySelector('[data-preview]'); const status = root.querySelector('[data-status]');
  let currentSvg = '';
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const file = form.elements.namedItem('image').files?.[0];
      if (!file || !['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024) throw Object.assign(new Error('invalid-file'), { code: 'invalid-file' });
      const image = await createImageBitmap(file);
      if (image.width * image.height > 8_000_000) { image.close(); throw Object.assign(new Error('invalid-file'), { code: 'invalid-file' }); }
      const scale = Math.min(1, 500 / image.width, 500 / image.height); const width = Math.max(1, Math.round(image.width * scale)); const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) { image.close(); throw Object.assign(new Error('canvas-unavailable'), { code: 'canvas-unavailable' }); }
      context.drawImage(image, 0, 0, width, height); image.close();
      const sketch = rasterToRunningStitchSketch(context.getImageData(0, 0, width, height).data, width, height, Number(form.elements.namedItem('threshold').value), Number(form.elements.namedItem('spacing').value));
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', `0 0 ${width} ${height}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', copy.fields.previewAlt); svg.setAttribute('width', '100%'); svg.setAttribute('height', 'auto'); svg.setAttribute('style', 'max-width: 500px; background: white; border: 1px solid currentColor');
      for (const pathData of sketch.paths) { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', pathData.d); path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#111827'); path.setAttribute('stroke-width', '0.8'); svg.append(path); }
      preview.replaceChildren(svg); currentSvg = new XMLSerializer().serializeToString(svg); result.hidden = false; status.textContent = copy.messages.complete.replace('{count}', `${sketch.stitchCount}`); status.classList.remove('status--error');
    } catch (error) { status.textContent = copy.messages[error?.code] ?? copy.messages.error; status.classList.add('status--error'); result.hidden = true; currentSvg = ''; }
  });
  root.querySelector('[data-download]').addEventListener('click', () => {
    if (!currentSvg) return;
    const url = URL.createObjectURL(new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = 'running-stitch-sketch.svg'; link.click(); URL.revokeObjectURL(url);
  });
  form.addEventListener('reset', () => queueMicrotask(() => { preview.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); currentSvg = ''; }));
}
