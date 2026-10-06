export const MAX_FONT_FILE_BYTES = 10 * 1024 * 1024;
const allowedExtensions = new Set(['woff', 'woff2', 'ttf', 'otf']);

export function validateFontFile(file) {
  if (!file || typeof file.name !== 'string' || !Number.isFinite(file.size)) return 'Choose a font file first.';
  const extension = file.name.split('.').at(-1)?.toLowerCase();
  if (!allowedExtensions.has(extension) || file.size <= 0 || file.size > MAX_FONT_FILE_BYTES) {
    return 'Choose a WOFF, WOFF2, TTF or OTF file under 10 MB.';
  }
  return null;
}
