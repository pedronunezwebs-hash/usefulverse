const MAX_FILE_BYTES = 30 * 1024 * 1024;

export function validatePanoramaFile(file) {
  if (!file) throw Object.assign(new RangeError('Choose an image file.'), { code: 'choose-file' });
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw Object.assign(new RangeError('Choose a JPEG, PNG or WebP image.'), { code: 'unsupported-type' });
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) throw Object.assign(new RangeError('Image must be no larger than 30 MB.'), { code: 'file-too-large' });
  return true;
}

export function isEquirectangularSize(width, height) {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 && Math.abs(width / height - 2) <= 0.15;
}
