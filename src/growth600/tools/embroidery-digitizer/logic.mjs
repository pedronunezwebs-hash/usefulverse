export function rasterToRunningStitchSketch(imageData, width, height, threshold = 128, rowSpacing = 6) {
  if (!(imageData instanceof Uint8ClampedArray) || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || imageData.length !== width * height * 4 || width > 500 || height > 500 || !Number.isFinite(threshold) || threshold < 0 || threshold > 255 || !Number.isInteger(rowSpacing) || rowSpacing < 2 || rowSpacing > 16) {
    throw Object.assign(new Error('invalid-image'), { code: 'invalid-image' });
  }
  const paths = [];
  for (let y = 0; y < height; y += rowSpacing) {
    let start = -1;
    for (let x = 0; x <= width; x += 1) {
      let dark = false;
      if (x < width) {
        const offset = (y * width + x) * 4; const alpha = imageData[offset + 3] / 255;
        const luminance = (0.2126 * imageData[offset] + 0.7152 * imageData[offset + 1] + 0.0722 * imageData[offset + 2]) * alpha + 255 * (1 - alpha);
        dark = luminance <= threshold;
      }
      if (dark && start < 0) start = x;
      if (!dark && start >= 0) {
        paths.push(Object.freeze({ d: `M${start} ${y} H${x - 1}`, stitchCount: Math.max(1, Math.ceil((x - start) / 2)) }));
        if (paths.length > 25_000) throw Object.assign(new Error('too-dense'), { code: 'too-dense' });
        start = -1;
      }
    }
  }
  return Object.freeze({ width, height, paths: Object.freeze(paths), stitchCount: paths.reduce((sum, path) => sum + path.stitchCount, 0) });
}
