import { validateStickerFiles } from './logic.mjs';

const root = document.querySelector('[data-tool="sticker-pack-maker"]');
if (root) {
  const form = root.querySelector('[data-pending-form]');
  const result = root.querySelector('[data-result]');
  const content = root.querySelector('[data-result-content]');
  const status = root.querySelector('[data-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  const make = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = String(text); if (className) element.className = className; return element; };
  const releaseCanvas = (canvas) => { canvas.width = 1; canvas.height = 1; };

  async function renderSheet(event) {
    event.preventDefault();
    content.replaceChildren(); result.hidden = true; status.classList.remove('status--error');
    const submit = form.querySelector('[type="submit"]'); submit.disabled = true; status.textContent = copy.messages.preparing;
    const prepared = [];
    try {
      const files = validateStickerFiles(form.elements.namedItem('files').files);
      for (const file of files) {
        const bitmap = await createImageBitmap(file);
        try {
          if (bitmap.width > 4096 || bitmap.height > 4096) throw Object.assign(new RangeError(copy.messages.imageDimensions), { code: 'image-dimensions' });
          const scale = Math.min(1, 340 / bitmap.width, 340 / bitmap.height);
          const width = Math.max(1, Math.round(bitmap.width * scale));
          const height = Math.max(1, Math.round(bitmap.height * scale));
          const image = document.createElement('canvas'); image.width = width; image.height = height;
          const imageContext = image.getContext('2d', { alpha: true });
          imageContext.imageSmoothingEnabled = true; imageContext.imageSmoothingQuality = 'high'; imageContext.drawImage(bitmap, 0, 0, width, height);
          const mask = document.createElement('canvas'); mask.width = width; mask.height = height;
          const maskContext = mask.getContext('2d', { alpha: true }); maskContext.drawImage(image, 0, 0);
          maskContext.globalCompositeOperation = 'source-in'; maskContext.fillStyle = '#fff'; maskContext.fillRect(0, 0, width, height);
          prepared.push({ fileName: file.name, width, height, image, mask });
        } finally { bitmap.close(); }
      }
      const sheet = document.createElement('canvas'); sheet.width = 1600; sheet.height = 1200;
      const context = sheet.getContext('2d', { alpha: true });
      context.clearRect(0, 0, sheet.width, sheet.height);
      const cellWidth = 400; const cellHeight = 400; const margin = 30; const outline = 7; const directions = 32;
      prepared.forEach((sticker, index) => {
        const row = Math.floor(index / 4); const rowStart = row * 4; const itemsInRow = Math.min(4, prepared.length - rowStart);
        const col = index - rowStart; const x = Math.round((sheet.width - itemsInRow * cellWidth) / 2) + col * cellWidth;
        const y = row * cellHeight;
        const left = x + Math.round((cellWidth - sticker.width) / 2);
        const top = y + Math.round((cellHeight - sticker.height) / 2);
        context.save(); context.globalCompositeOperation = 'source-over';
        for (let step = 0; step < directions; step++) {
          const angle = step * Math.PI * 2 / directions;
          context.drawImage(sticker.mask, left + Math.cos(angle) * outline, top + Math.sin(angle) * outline);
        }
        context.drawImage(sticker.image, left, top);
        context.restore();
      });
      const preview = make('canvas', undefined, 'sticker-sheet-preview'); preview.width = sheet.width; preview.height = sheet.height;
      preview.getContext('2d').drawImage(sheet, 0, 0);
      preview.setAttribute('role', 'img'); preview.setAttribute('aria-label', copy.fields.previewLabel.replace('{count}', String(prepared.length)));
      const pngBlob = await new Promise((resolve) => sheet.toBlob(resolve, 'image/png'));
      if (!pngBlob) throw new Error('PNG export failed.');
      const list = make('ul', undefined, 'sticker-file-list');
      for (const item of prepared) list.append(make('li', item.fileName));
      const download = make('button', copy.actions.download, 'button button--primary'); download.type = 'button';
      download.addEventListener('click', () => {
        const url = URL.createObjectURL(pngBlob); const anchor = make('a'); anchor.href = url; anchor.download = 'sticker-sheet.png'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
      content.append(preview, list, download);
      status.textContent = copy.messages.complete;
      result.hidden = false;
      for (const item of prepared) { releaseCanvas(item.image); releaseCanvas(item.mask); }
      releaseCanvas(sheet);
    } catch (error) {
      for (const item of prepared) { releaseCanvas(item.image); releaseCanvas(item.mask); }
      content.replaceChildren(); result.hidden = false;
      status.textContent = copy.messages[error?.code] ?? copy.messages.error;
      status.classList.add('status--error');
    } finally { submit.disabled = false; }
  }
  form.addEventListener('submit', renderSheet);
  form.addEventListener('reset', () => queueMicrotask(() => { content.replaceChildren(); result.hidden = true; status.textContent = ''; status.classList.remove('status--error'); }));
}
