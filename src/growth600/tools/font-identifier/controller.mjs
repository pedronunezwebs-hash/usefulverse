import { FONT_SAMPLE_LIMITS, LOCAL_FONT_CANDIDATES, normalizeGlyphMask, rankFontMasks, validateFontSampleDimensions, validateFontSampleFile } from './logic.mjs';

const root = document.querySelector('[data-tool="font-identifier"]');
if (root) {
  const form = root.querySelector('#tool-form');
  const fileInput = form.elements.namedItem('sampleImage');
  const textInput = form.elements.namedItem('sampleText');
  const preview = root.querySelector('[data-font-sample-preview]');
  const result = root.querySelector('[data-font-results]');
  const status = root.querySelector('[data-font-status]');
  const copy = JSON.parse(root.querySelector('[data-tool-copy]')?.textContent ?? '{}');
  let previewUrl;
  const say = (message, kind = '') => { status.textContent = message; status.dataset.state = kind; };
  const releasePreview = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = undefined; preview.removeAttribute('src'); preview.hidden = true; };
  const clear = () => { releasePreview(); result.replaceChildren(); say(''); };
  const cssFamily = (name) => ['system-ui', 'serif', 'sans-serif', 'monospace'].includes(name) ? name : `"${name.replaceAll('"', '')}"`;

  fileInput.addEventListener('change', async () => {
    clear(); const file = fileInput.files?.[0]; if (!file) return;
    try {
      validateFontSampleFile(file);
      const bitmap = await createImageBitmap(file);
      try { validateFontSampleDimensions(bitmap.width, bitmap.height); }
      catch (error) { bitmap.close?.(); throw error; }
      bitmap.close?.(); previewUrl = URL.createObjectURL(file); preview.src = previewUrl; preview.hidden = false; say(copy.messages.sampleReady, 'success');
    } catch (error) { fileInput.value = ''; say(error instanceof RangeError ? copy.messages.tooLarge : copy.messages.badImage, 'error'); }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); result.replaceChildren();
    const file = fileInput.files?.[0]; const sampleText = textInput.value.trim();
    try {
      validateFontSampleFile(file);
      if (!sampleText || sampleText.length > FONT_SAMPLE_LIMITS.textLength) throw new RangeError(copy.messages.enterText);
      const bitmap = await createImageBitmap(file);
      try {
        validateFontSampleDimensions(bitmap.width, bitmap.height);
        const imageCanvas = document.createElement('canvas'); imageCanvas.width = bitmap.width; imageCanvas.height = bitmap.height;
        const imageContext = imageCanvas.getContext('2d', { willReadFrequently: true });
        if (!imageContext) throw new Error(copy.messages.canvasUnavailable);
        imageContext.drawImage(bitmap, 0, 0);
        const reference = normalizeGlyphMask(imageContext.getImageData(0, 0, bitmap.width, bitmap.height).data, bitmap.width, bitmap.height);
        const candidates = [];
        for (const name of LOCAL_FONT_CANDIDATES) {
          const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 112;
          const context = canvas.getContext('2d', { willReadFrequently: true });
          if (!context) throw new Error(copy.messages.canvasUnavailable);
          context.font = `72px ${cssFamily(name)}`; const measured = Math.ceil(context.measureText(sampleText).width + 32);
          canvas.width = Math.min(2400, Math.max(256, measured)); canvas.height = 112;
          const draw = canvas.getContext('2d', { willReadFrequently: true }); if (!draw) throw new Error(copy.messages.canvasUnavailable);
          draw.fillStyle = '#fff'; draw.fillRect(0, 0, canvas.width, canvas.height); draw.font = `72px ${cssFamily(name)}`; draw.textBaseline = 'middle'; draw.fillStyle = '#000'; draw.fillText(sampleText, 16, canvas.height / 2, canvas.width - 32);
          const sample = normalizeGlyphMask(draw.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
          candidates.push({ name, sample });
        }
        const ranked = rankFontMasks(reference, candidates, { limit: 5 });
        if (!ranked.length) { say(copy.messages.noCandidates, 'error'); return; }
        const list = document.createElement('ol'); list.className = 'font-identifier__results';
        for (const candidate of ranked) { const item = document.createElement('li'); const name = document.createElement('strong'); name.textContent = candidate.name; const score = document.createElement('span'); score.textContent = ` ${new Intl.NumberFormat(document.documentElement.lang || 'en', { style: 'percent', maximumFractionDigits: 1 }).format(candidate.similarity)}`; item.append(name, score); list.append(item); }
        result.append(list); say(copy.messages.complete, 'success');
      } finally { bitmap.close?.(); }
    } catch (error) {
      const message = error instanceof RangeError ? copy.messages.invalidSample
        : error instanceof TypeError ? copy.messages.badImage
          : error.message === copy.messages.canvasUnavailable ? copy.messages.canvasUnavailable : copy.messages.failed;
      say(message, 'error');
    }
  });
  form.addEventListener('reset', () => queueMicrotask(clear));
  window.addEventListener('pagehide', releasePreview, { once: true });
}
