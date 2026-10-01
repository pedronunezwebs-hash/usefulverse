export const PDF_VISUAL_EDIT_LIMITS = Object.freeze({
  inputBytes: 50 * 1024 * 1024,
  pages: 100,
  totalPixels: 40_000_000,
  imageBytes: 10 * 1024 * 1024,
  minAreaPixels: 100,
  minFontPoints: 8,
  maxFontPoints: 72,
});

export function normalizeVisualEditRect(start, end, width, height) {
  const limitWidth = Number(width);
  const limitHeight = Number(height);
  const values = [start?.x, start?.y, end?.x, end?.y, limitWidth, limitHeight].map(Number);
  if (values.some((value) => !Number.isFinite(value)) || limitWidth <= 0 || limitHeight <= 0) throw new TypeError('The selected PDF area is not valid.');
  const [x1, y1, x2, y2] = values;
  const left = Math.min(limitWidth, Math.max(0, Math.min(x1, x2)));
  const top = Math.min(limitHeight, Math.max(0, Math.min(y1, y2)));
  const right = Math.min(limitWidth, Math.max(0, Math.max(x1, x2)));
  const bottom = Math.min(limitHeight, Math.max(0, Math.max(y1, y2)));
  const rect = { x: left, y: top, width: right - left, height: bottom - top };
  if (rect.width * rect.height < PDF_VISUAL_EDIT_LIMITS.minAreaPixels) throw new RangeError('Select a larger area to replace.');
  return rect;
}

export function validateVisualEditInput(file, pageCount) {
  if (!file || file.type && file.type !== 'application/pdf' || !/\.pdf$/iu.test(file.name ?? '')) throw new TypeError('Choose a PDF file.');
  if (!Number.isFinite(file.size) || file.size > PDF_VISUAL_EDIT_LIMITS.inputBytes) throw new RangeError('Choose a PDF of 50 MB or less.');
  if (!Number.isInteger(pageCount) || pageCount < 1 || pageCount > PDF_VISUAL_EDIT_LIMITS.pages) throw new RangeError('This editor supports PDFs with 1–100 pages.');
  return true;
}

export function validateVisualReplacementImage(file) {
  if (!file || !['image/png', 'image/jpeg'].includes(file.type)) throw new TypeError('Choose a PNG or JPEG image.');
  if (file.size > PDF_VISUAL_EDIT_LIMITS.imageBytes) throw new RangeError('Choose a replacement image smaller than 10 MB.');
  return true;
}

export function visualEditPixelPlan(pageSizes, maxPixels = PDF_VISUAL_EDIT_LIMITS.totalPixels, maxScale = 1.5) {
  if (!Array.isArray(pageSizes) || !pageSizes.length) throw new TypeError('The PDF has no pages to render.');
  const area = pageSizes.reduce((sum, page) => {
    const width = Number(page.width);
    const height = Number(page.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) throw new TypeError('A PDF page has invalid dimensions.');
    return sum + width * height;
  }, 0);
  if (!Number.isFinite(maxPixels) || maxPixels < 1) throw new RangeError('The PDF exceeds the device-memory budget.');
  const scale = Math.min(maxScale, Math.sqrt(maxPixels / area));
  if (!Number.isFinite(scale) || scale < 0.2) throw new RangeError('This PDF needs too much memory to edit on this device. Try fewer or smaller pages.');
  return { scale, estimatedPixels: Math.ceil(area * scale * scale) };
}
