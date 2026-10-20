export function computeGarmentOverlay(baseWidth, baseHeight, garmentWidth, garmentHeight, leftPercent, topPercent, widthPercent) {
  const values = [baseWidth, baseHeight, garmentWidth, garmentHeight, leftPercent, topPercent, widthPercent].map(Number);
  if (values.some((value) => !Number.isFinite(value)) || values.slice(0,4).some((value) => value <= 0) || leftPercent < 0 || leftPercent > 100 || topPercent < 0 || topPercent > 100 || widthPercent < 1 || widthPercent > 100) {
    throw Object.assign(new Error('invalid-layout'), { code: 'invalid-layout' });
  }
  const [bw,bh,gw,gh] = values;
  const width = bw * widthPercent / 100;
  const height = width * gh / gw;
  return Object.freeze({ left: bw * leftPercent / 100, top: bh * topPercent / 100, width, height });
}
