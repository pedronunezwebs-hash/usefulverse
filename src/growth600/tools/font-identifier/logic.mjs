export const FONT_SAMPLE_LIMITS = Object.freeze({ fileBytes: 4 * 1024 * 1024, pixels: 8_000_000, textLength: 80, normalizedWidth: 128, normalizedHeight: 64 });
export const LOCAL_FONT_CANDIDATES = Object.freeze([
  'Arial', 'Arial Narrow', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana',
  'Tahoma', 'Trebuchet MS', 'system-ui', 'serif', 'sans-serif', 'monospace',
]);

export function validateFontSampleFile(file) {
  if (!(file instanceof Blob) || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new TypeError('Choose a JPEG, PNG or WebP sample image.');
  if (file.size <= 0 || file.size > FONT_SAMPLE_LIMITS.fileBytes) throw new RangeError('Choose an image up to 4 MiB.');
  return true;
}

export function validateFontSampleDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width * height > FONT_SAMPLE_LIMITS.pixels) throw new RangeError('The sample image must be 8 megapixels or smaller.');
  return Object.freeze({ width, height, pixels: width * height });
}

export function normalizeGlyphMask(imageData, width, height, { threshold = 220, targetWidth = FONT_SAMPLE_LIMITS.normalizedWidth, targetHeight = FONT_SAMPLE_LIMITS.normalizedHeight } = {}) {
  if (!(imageData instanceof Uint8ClampedArray) || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || imageData.length !== width * height * 4) throw new RangeError('A valid RGBA sample is required.');
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 254 || !Number.isInteger(targetWidth) || !Number.isInteger(targetHeight) || targetWidth < 8 || targetHeight < 8 || targetWidth * targetHeight > 65_536) throw new RangeError('Choose valid image comparison settings.');
  const ink = new Uint8Array(width * height);
  let minX = width; let minY = height; let maxX = -1; let maxY = -1;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const at = (y * width + x) * 4;
    const luminance = (imageData[at] * 299 + imageData[at + 1] * 587 + imageData[at + 2] * 114) / 1000;
    if (imageData[at + 3] > 32 && luminance < threshold) { ink[y * width + x] = 1; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
  }
  if (maxX < minX || maxY < minY) throw new RangeError('No dark text was found in the sample crop.');
  const cropWidth = maxX - minX + 1; const cropHeight = maxY - minY + 1;
  const scale = Math.min((targetWidth - 4) / cropWidth, (targetHeight - 4) / cropHeight);
  const drawWidth = Math.max(1, Math.round(cropWidth * scale)); const drawHeight = Math.max(1, Math.round(cropHeight * scale));
  const left = Math.floor((targetWidth - drawWidth) / 2); const top = Math.floor((targetHeight - drawHeight) / 2);
  const mask = new Uint8Array(targetWidth * targetHeight);
  for (let y = 0; y < drawHeight; y += 1) for (let x = 0; x < drawWidth; x += 1) {
    const sourceX = minX + Math.min(cropWidth - 1, Math.floor(x * cropWidth / drawWidth));
    const sourceY = minY + Math.min(cropHeight - 1, Math.floor(y * cropHeight / drawHeight));
    if (ink[sourceY * width + sourceX]) mask[(top + y) * targetWidth + left + x] = 1;
  }
  return Object.freeze({ mask, width: targetWidth, height: targetHeight, inkPixels: mask.reduce((sum, value) => sum + value, 0) });
}

export function rankFontMasks(reference, candidates, { limit = 5 } = {}) {
  if (!reference?.mask || !Number.isInteger(reference.width) || !Number.isInteger(reference.height) || reference.mask.length !== reference.width * reference.height) throw new RangeError('A normalized reference sample is required.');
  if (!Array.isArray(candidates) || candidates.length < 1 || candidates.length > 32 || !Number.isInteger(limit) || limit < 1 || limit > candidates.length) throw new RangeError('Choose a valid list of font candidates.');
  const seen = new Set(); const ranked = [];
  for (const candidate of candidates) {
    const name = String(candidate?.name ?? '').trim(); const mask = candidate?.sample?.mask;
    if (!name || !mask || candidate.sample.width !== reference.width || candidate.sample.height !== reference.height || mask.length !== reference.mask.length) throw new RangeError('Every font candidate must use the same normalized sample size.');
    const signature = Array.from(mask).join('');
    if (seen.has(signature)) continue;
    seen.add(signature);
    let intersection = 0; let union = 0;
    for (let index = 0; index < reference.mask.length; index += 1) {
      const ref = reference.mask[index] ? 1 : 0; const test = mask[index] ? 1 : 0;
      intersection += ref & test; union += ref | test;
    }
    ranked.push(Object.freeze({ name, similarity: union ? intersection / union : 0 }));
  }
  return Object.freeze(ranked.sort((a, b) => b.similarity - a.similarity || a.name.localeCompare(b.name)).slice(0, limit));
}
