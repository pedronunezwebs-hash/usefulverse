export const WEBFONT_LIMITS = Object.freeze({ fileBytes: 10 * 1024 * 1024, textCharacters: 20000 });

export function validateFontRequest(file, text, permission) {
  if (!(file instanceof File)) throw new TypeError('Choose a font file.');
  if (file.size < 12 || file.size > WEBFONT_LIMITS.fileBytes) throw new RangeError('Font files must be 12 bytes to 10 MiB.');
  if (!/\.(ttf|otf)$/iu.test(file.name)) throw new TypeError('Only TTF and OTF fonts are supported.');
  if (typeof text !== 'string' || !text.trim() || [...text].length > WEBFONT_LIMITS.textCharacters) throw new RangeError('Enter 1 to 20,000 characters.');
  if (permission !== true) throw new TypeError('Confirm that you have permission to modify this font.');
  return { text: [...new Set(text)].join('') };
}

export function subsetFilename(name) {
  return `${name.replace(/\.(ttf|otf)$/iu, '')}-subset.${name.match(/\.(ttf|otf)$/iu)?.[1]?.toLowerCase() ?? 'ttf'}`;
}
