const MAX_FILES = 12;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

export function validateStickerFiles(files) {
  const list = Array.from(files ?? []);
  if (!list.length) throw Object.assign(new RangeError('Choose at least one image.'), { code: 'choose-images' });
  if (list.length > MAX_FILES) throw Object.assign(new RangeError('Choose no more than 12 images.'), { code: 'too-many-images' });
  if (list.some((file) => !SUPPORTED_TYPES.has(file.type))) throw Object.assign(new RangeError('Choose PNG, JPEG or WebP images.'), { code: 'unsupported-image' });
  if (list.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_BYTES) throw Object.assign(new RangeError('The selected images exceed the 40 MiB total limit.'), { code: 'images-too-large' });
  return list;
}
