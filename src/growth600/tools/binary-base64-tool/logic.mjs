export const BINARY_BASE64_LIMITS = Object.freeze({ inputBytes: 2 * 1024 * 1024, chunkBytes: 0x6000 });

const MIME_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/iu;
const IMAGE_PREVIEW_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp', 'image/avif']);

export function safeFileMimeType(value) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return MIME_PATTERN.test(normalized) ? normalized : 'application/octet-stream';
}

export function canPreviewBase64Image(mimeType) {
  return IMAGE_PREVIEW_TYPES.has(String(mimeType ?? '').toLowerCase());
}

export function encodeBinaryBase64(input) {
  const bytes = input instanceof Uint8Array ? input : input instanceof ArrayBuffer ? new Uint8Array(input) : null;
  if (!bytes) throw new TypeError('invalidBytes');
  if (bytes.byteLength > BINARY_BASE64_LIMITS.inputBytes) throw new RangeError('tooLarge');
  const parts = [];
  for (let offset = 0; offset < bytes.length; offset += BINARY_BASE64_LIMITS.chunkBytes) {
    const chunk = bytes.subarray(offset, Math.min(offset + BINARY_BASE64_LIMITS.chunkBytes, bytes.length));
    parts.push(btoa(String.fromCharCode(...chunk)));
  }
  return parts.join('');
}

export function encodeBinaryFile(bytes, mimeType) {
  const type = safeFileMimeType(mimeType);
  const base64 = encodeBinaryBase64(bytes);
  return Object.freeze({
    base64,
    dataUri: `data:${type};base64,${base64}`,
    mimeType: type,
    byteLength: bytes.byteLength,
    previewableImage: canPreviewBase64Image(type),
  });
}
