import { announce, readToolCopy } from '../controller-helpers.mjs';
import { traceRasterToSvg } from './logic.mjs';

const root = document.querySelector('[data-tool="image-vectorizer"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const copy = readToolCopy(root);
  const result = root.querySelector('[data-vector-result]');
  const preview = root.querySelector('[data-vector-preview]');
  const stats = root.querySelector('[data-vector-stats]');
  const alpha = form.elements.namedItem('alphaThreshold');
  const alphaValue = root.querySelector('[data-alpha-value]');
  let svgBlobUrl = '';
  const releasePreview = () => { if (svgBlobUrl) URL.revokeObjectURL(svgBlobUrl); svgBlobUrl = ''; preview.removeAttribute('src'); };
  const trace = async (event) => {
    event?.preventDefault();
    result.hidden = true;
    releasePreview();
    stats.replaceChildren();
    try {
      const file = form.elements.namedItem('imageFile').files?.[0];
      if (!file) throw Object.assign(new RangeError(), { code: 'SELECT_IMAGE' });
      if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) throw Object.assign(new RangeError(), { code: 'INVALID_IMAGE' });
      if (file.size > 5 * 1024 * 1024) throw Object.assign(new RangeError(), { code: 'IMAGE_TOO_LARGE' });
      const sourceUrl = URL.createObjectURL(file);
      try {
        const image = new Image();
        image.src = sourceUrl;
        try { await image.decode(); } catch { throw Object.assign(new RangeError(), { code: 'INVALID_IMAGE' }); }
        if (image.naturalWidth * image.naturalHeight > 32_000_000) throw Object.assign(new RangeError(), { code: 'IMAGE_DIMENSIONS' });
        const maxDimension = Number(form.elements.namedItem('detail').value);
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) throw new Error('Canvas is unavailable.');
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const pixels = context.getImageData(0, 0, width, height).data;
        const traced = traceRasterToSvg({ width, height, data: pixels, colorCount: Number(form.elements.namedItem('paletteCount').value), alphaThreshold: Number(alpha.value), mergeRuns: form.elements.namedItem('mergeRuns').checked });
        const blob = new Blob([traced.svg], { type: 'image/svg+xml;charset=utf-8' });
        svgBlobUrl = URL.createObjectURL(blob);
        preview.src = svgBlobUrl;
        preview.alt = `${copy.fields.resultTitle}, ${traced.width} by ${traced.height}`;
        for (const [label, value] of [[copy.fields.dimensions, `${traced.width} × ${traced.height} px`], [copy.fields.colorsUsed, String(traced.colorCount)], [copy.fields.pathSections, String(traced.pathCount)]]) {
          const term = document.createElement('dt'); const description = document.createElement('dd');
          term.textContent = label; description.textContent = value; stats.append(term, description);
        }
        result.hidden = false;
        announce(root, copy.messages.generated, 'success');
      } finally { URL.revokeObjectURL(sourceUrl); }
    } catch (error) {
      const message = error?.code === 'SELECT_IMAGE' ? copy.messages.selectImage
        : error?.code === 'INVALID_IMAGE' ? copy.messages.invalidImage
          : error?.code === 'IMAGE_TOO_LARGE' ? copy.messages.imageTooLarge
            : error?.code === 'IMAGE_DIMENSIONS' ? copy.messages.imageDimensions
              : /No visible pixels/u.test(error?.message ?? '') ? copy.messages.noVisiblePixels
                : /too many path sections/u.test(error?.message ?? '') ? copy.messages.tooManyPaths
                  : copy.messages.traceFailed;
      announce(root, message, 'error');
    }
  };
  form.addEventListener('submit', trace);
  form.addEventListener('input', () => { result.hidden = true; releasePreview(); announce(root, ''); });
  form.addEventListener('change', () => { result.hidden = true; releasePreview(); announce(root, ''); });
  alpha.addEventListener('input', () => { alphaValue.value = alpha.value; alphaValue.textContent = alpha.value; });
  form.addEventListener('reset', () => { result.hidden = true; stats.replaceChildren(); releasePreview(); alphaValue.value = '128'; alphaValue.textContent = '128'; announce(root, ''); });
  root.querySelector('[data-action="download"]')?.addEventListener('click', () => {
    if (!svgBlobUrl) return;
    const anchor = document.createElement('a');
    anchor.href = svgBlobUrl; anchor.download = 'vectorized-image.svg'; anchor.click();
    announce(root, copy.messages.downloaded, 'success');
  });
}
