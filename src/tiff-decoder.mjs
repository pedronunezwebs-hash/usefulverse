import UTIF from 'utif';

export const MAX_TIFF_PIXELS = 40_000_000;

export function decodeTiffPixels(buffer, maxPixels = MAX_TIFF_PIXELS) {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 8) throw new TypeError('This TIFF file is incomplete.');
  const directories = UTIF.decode(buffer);
  const firstPage = directories[0];
  const width = Number(firstPage?.t256?.[0] ?? firstPage?.t256);
  const height = Number(firstPage?.t257?.[0] ?? firstPage?.t257);
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width < 1 || height < 1) {
    throw new TypeError('This TIFF file has invalid image dimensions.');
  }
  if (width * height > maxPixels) throw new RangeError('This TIFF image is larger than the supported pixel limit.');

  UTIF.decodeImage(buffer, firstPage);
  const rgba = UTIF.toRGBA8(firstPage);
  if (!rgba || rgba.byteLength !== width * height * 4) throw new TypeError('This TIFF image could not be decoded.');
  return { width, height, rgba };
}

export async function decodeTiffFile(file, maxPixels = MAX_TIFF_PIXELS) {
  const { width, height, rgba } = decodeTiffPixels(await file.arrayBuffer(), maxPixels);
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') {
    return { width, height, rgba };
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  try {
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) throw new Error('The browser could not create a TIFF preview.');
    context.putImageData(new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength), width, height), 0, 0);
    return await createImageBitmap(canvas);
  } finally {
    canvas.width = 1;
    canvas.height = 1;
  }
}
